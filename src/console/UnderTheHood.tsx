import { useEffect, useState } from 'react'
import {
  provider,
  type ChaosPreset,
  type Integrity,
  type JournalEntry,
  type LedgerAccount,
  type Tenancy,
  type WebhookEventRecord,
} from '../api'
import { displayName, naira, time } from '../format'
import type { LogItem, Run } from '../types'
import { btnSecondary, card, muted } from './ui'

type Tab = 'activity' | 'notifications' | 'books' | 'journal'

interface Props {
  log: LogItem[]
  events: WebhookEventRecord[]
  accounts: LedgerAccount[]
  entries: JournalEntry[]
  integrity: Integrity | null
  tenancies: Tenancy[]
  run: Run
}

const TABS: { key: Tab; label: string }[] = [
  { key: 'activity', label: 'What happened' },
  { key: 'notifications', label: 'Payment notifications' },
  { key: 'books', label: 'The books' },
  { key: 'journal', label: 'Journal' },
]

const PRESETS: { key: ChaosPreset; label: string; hint: string }[] = [
  { key: 'calm', label: 'Well-behaved', hint: 'Each notification arrives once, in order.' },
  { key: 'chaotic', label: 'Messy', hint: 'Some arrive twice or more, late, or out of order.' },
  { key: 'hostile', label: 'Very messy', hint: 'Up to 6 copies, long delays, and many lost on the way.' },
]

const EVENT_LABEL: Record<string, string> = {
  'charge.initiated': 'Payment started',
  'charge.success': 'Payment confirmed',
  'charge.failed': 'Payment declined',
}

const LOG_TONE = {
  ok: 'border-brand-500',
  info: 'border-sky-500',
  warn: 'border-amber-500',
  error: 'border-red-500 bg-red-50 dark:bg-red-950/40',
}

function outcome(e: WebhookEventRecord): { text: string; className: string } {
  if (e.status === 'failed') return { text: 'Rejected', className: 'text-red-700 dark:text-red-400' }
  if (e.status !== 'processed') return { text: 'Processing…', className: 'text-amber-700 dark:text-amber-400' }
  switch (e.outcome) {
    case 'applied':
      return { text: 'Counted', className: 'text-brand-700 dark:text-brand-400' }
    case 'duplicate':
      return { text: 'Ignored: already counted', className: muted }
    case 'stale':
      return { text: 'Ignored: out of date', className: muted }
    default:
      return { text: 'Nothing to do', className: muted }
  }
}

function accountName(code: string, tenancies: Tenancy[]): string {
  const [kind, , id] = code.split(':')
  if (code === 'system:provider-clearing') return 'Held at the payment provider'
  if (code === 'system:platform-fees') return 'Owoile’s fees'
  if (kind === 'escrow') return `Escrow · ${tenancies.find((t) => t.id === id)?.property ?? 'old tenancy'}`
  if (kind === 'payable') return `Owed to ${displayName(code.split(':').at(-1) ?? '')}`
  return code
}

function Explainer({ children }: { children: string }) {
  return <p className={`max-w-3xl text-sm ${muted}`}>{children}</p>
}

function Empty({ children }: { children: string }) {
  return <p className={`rounded-xl border border-dashed border-slate-200 py-8 text-center text-sm dark:border-slate-700 ${muted}`}>{children}</p>
}

export function UnderTheHood({ log, events, accounts, entries, integrity, tenancies, run }: Props) {
  const [tab, setTab] = useState<Tab>('activity')
  const [preset, setPreset] = useState<ChaosPreset | null>(null)
  const [providerUp, setProviderUp] = useState<boolean | null>(null)

  useEffect(() => {
    provider
      .chaos()
      .then(({ chaos, presets }) => {
        setProviderUp(true)
        const match = (Object.keys(presets) as ChaosPreset[]).find(
          (key) => JSON.stringify(presets[key]) === JSON.stringify(chaos),
        )
        setPreset(match ?? null)
      })
      .catch(() => setProviderUp(false))
  }, [])

  const lastConfirmed = events.find((e) => e.type === 'charge.success' && e.outcome === 'applied')

  const choose = (key: ChaosPreset) =>
    run('Change behaviour', async () => {
      await provider.setChaos(key)
      setPreset(key)
      return { tone: 'info', text: `The test payment provider is now “${PRESETS.find((p) => p.key === key)?.label}”.` }
    })

  const replay = () =>
    lastConfirmed &&
    run('Resend notification', async () => {
      await provider.replay(lastConfirmed.reference, 20)
      return {
        tone: 'info',
        text: 'The payment provider is resending the last “payment confirmed” notification 20 more times. Watch the count go up while the money stays the same.',
      }
    })

  return (
    <section className={`${card} overflow-hidden`}>
      <div className="grid gap-1 px-5 pt-5 sm:px-6">
        <h2 className="font-semibold text-slate-900 dark:text-white">Under the hood</h2>
        <p className={`text-sm ${muted}`}>What Owoile is doing behind the scenes to keep every naira accounted for.</p>
      </div>

      <div role="tablist" className="mt-4 flex gap-1 overflow-x-auto border-b border-slate-200 px-3 sm:px-4 dark:border-slate-800">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={tab === t.key}
            onClick={() => setTab(t.key)}
            className={`-mb-px border-b-2 px-3 py-2.5 text-sm font-medium whitespace-nowrap transition ${
              tab === t.key
                ? 'border-brand-600 text-brand-700 dark:border-brand-400 dark:text-brand-300'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            {t.label}
            {t.key === 'notifications' && events.length > 0 && (
              <span className="ml-1.5 rounded-full bg-slate-100 px-1.5 text-xs dark:bg-slate-800">{events.length}</span>
            )}
          </button>
        ))}
      </div>

      <div className="grid gap-4 p-5 sm:p-6">
        {tab === 'activity' && (
          <>
            <Explainer>A plain-English record of everything you’ve done in this session.</Explainer>
            {log.length === 0 ? (
              <Empty>Nothing yet. Your actions will appear here.</Empty>
            ) : (
              <ul className="grid max-h-96 gap-2 overflow-y-auto">
                {log.map((item) => (
                  <li
                    key={item.id}
                    className={`grid animate-appear grid-cols-[auto_1fr] gap-3 rounded-lg border-l-3 bg-slate-50 px-3 py-2 text-sm dark:bg-slate-800/50 ${LOG_TONE[item.tone]}`}
                  >
                    <span className={`text-xs tabular-nums ${muted}`}>{time(item.at)}</span>
                    <span className="text-slate-700 dark:text-slate-200">{item.text}</span>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}

        {tab === 'notifications' && (
          <>
            <Explainer>
              When a tenant pays, the payment provider sends Owoile a notification. Real providers often send the same one
              several times, late, or out of order. Owoile has to count each payment exactly once, even then. Make the test
              provider misbehave and watch.
            </Explainer>

            {providerUp === false ? (
              <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:bg-amber-950/60 dark:text-amber-200">
                The test payment provider isn’t running. Start it with <code className="font-mono">npm run dev:provider</code>{' '}
                in the server folder.
              </p>
            ) : (
              <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-end">
                <fieldset className="grid gap-2">
                  <legend className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                    How should the payment provider behave?
                  </legend>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {PRESETS.map((p) => (
                      <button
                        key={p.key}
                        type="button"
                        aria-pressed={preset === p.key}
                        onClick={() => choose(p.key)}
                        className={`grid gap-0.5 rounded-xl border px-3.5 py-2.5 text-left transition ${
                          preset === p.key
                            ? 'border-brand-400 bg-brand-50 ring-2 ring-brand-500/20 dark:border-brand-700 dark:bg-brand-950/60'
                            : 'border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600'
                        }`}
                      >
                        <span className="text-sm font-semibold text-slate-900 dark:text-white">{p.label}</span>
                        <span className={`text-xs ${muted}`}>{p.hint}</span>
                      </button>
                    ))}
                  </div>
                </fieldset>
                <button type="button" className={btnSecondary} onClick={replay} disabled={!lastConfirmed}>
                  Resend last payment 20×
                </button>
              </div>
            )}

            {events.length === 0 ? (
              <Empty>No notifications yet. Pay rent on a tenancy to see them arrive.</Empty>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className={`text-left text-xs ${muted}`}>
                      <th className="pb-2 font-medium">Notification</th>
                      <th className="pb-2 font-medium">Payment</th>
                      <th className="pb-2 text-right font-medium">Times received</th>
                      <th className="pb-2 pl-4 font-medium">What Owoile did</th>
                      <th className="pb-2 text-right font-medium">First seen</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map((e) => {
                      const o = outcome(e)
                      return (
                        <tr key={e.id} className="border-t border-slate-100 dark:border-slate-800">
                          <td className="py-2.5 font-medium whitespace-nowrap text-slate-900 dark:text-white">
                            {EVENT_LABEL[e.type] ?? e.type}
                          </td>
                          <td className={`max-w-40 truncate py-2.5 font-mono text-xs ${muted}`}>{e.reference}</td>
                          <td className="py-2.5 text-right tabular-nums">
                            <span
                              className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                                e.deliveries > 1
                                  ? 'bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-300'
                                  : 'text-slate-600 dark:text-slate-300'
                              }`}
                            >
                              {e.deliveries}×
                            </span>
                          </td>
                          <td className={`py-2.5 pl-4 font-medium ${o.className}`} title={e.lastError ?? undefined}>
                            {o.text}
                            {e.lastError && <span className="block text-xs font-normal">{e.lastError}</span>}
                          </td>
                          <td className={`py-2.5 text-right text-xs tabular-nums ${muted}`}>{time(e.receivedAt)}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {tab === 'books' && (
          <>
            <Explainer>
              Owoile keeps double-entry books, like a bank. Money never appears or vanishes: it only moves between these
              accounts, and both sides of every move are written down. The check below recalculates everything from scratch.
            </Explainer>
            {integrity && (
              <div
                className={`flex flex-wrap items-center justify-between gap-3 rounded-xl px-4 py-3 text-sm ${
                  integrity.ok
                    ? 'bg-brand-50 text-brand-900 dark:bg-brand-950/60 dark:text-brand-200'
                    : 'bg-red-50 text-red-900 dark:bg-red-950/60 dark:text-red-200'
                }`}
              >
                <strong>{integrity.ok ? '✓ The books balance' : '✗ The books don’t balance'}</strong>
                <span className="tabular-nums">
                  Debits {naira(integrity.totalDebits)} = Credits {naira(integrity.totalCredits)}
                </span>
              </div>
            )}
            {accounts.length === 0 ? (
              <Empty>No accounts yet.</Empty>
            ) : (
              <ul className="grid gap-2 sm:grid-cols-2">
                {accounts.map((a) => (
                  <li
                    key={a.id}
                    title={a.code}
                    className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 px-4 py-3 dark:border-slate-800"
                  >
                    <span className="truncate text-sm text-slate-700 dark:text-slate-200">{accountName(a.code, tenancies)}</span>
                    <span className="text-sm font-semibold text-slate-900 tabular-nums dark:text-white">{naira(a.balance)}</span>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}

        {tab === 'journal' && (
          <>
            <Explainer>
              Every money movement, newest first. Each one has two sides that always add up to the same amount. Nothing here
              can be edited or deleted; mistakes are fixed by adding a new entry.
            </Explainer>
            {entries.length === 0 ? (
              <Empty>No money has moved yet.</Empty>
            ) : (
              <ul className="grid max-h-[32rem] gap-3 overflow-y-auto">
                {entries.map((entry) => (
                  <li key={entry.id} className="grid animate-appear gap-2 rounded-xl border border-slate-200 p-4 dark:border-slate-800">
                    <div className="flex justify-between gap-3">
                      <span className="text-sm font-medium text-slate-900 dark:text-white">{entry.description}</span>
                      <span className={`text-xs whitespace-nowrap tabular-nums ${muted}`}>{time(entry.postedAt)}</span>
                    </div>
                    <table className="w-full text-sm">
                      <tbody>
                        {entry.lines.map((line, i) => (
                          <tr key={i}>
                            <td className={`w-16 py-0.5 text-xs font-semibold ${muted}`}>
                              {line.direction === 'debit' ? 'Debit' : 'Credit'}
                            </td>
                            <td className={`py-0.5 text-slate-700 dark:text-slate-300 ${line.direction === 'credit' ? 'pl-4' : ''}`}>
                              {accountName(line.account, tenancies)}
                            </td>
                            <td className="py-0.5 text-right font-medium tabular-nums text-slate-900 dark:text-white">
                              {naira(line.amount)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </section>
  )
}
