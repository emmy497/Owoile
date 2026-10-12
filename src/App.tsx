import { useCallback, useEffect, useRef, useState } from 'react'
import { api, type Integrity, type JournalEntry, type LedgerAccount, type Tenancy, type WebhookEventRecord } from './api'
import { NewTenancyForm } from './console/NewTenancyForm'
import { TenancySidebar } from './console/TenancySidebar'
import { TenancyView } from './console/TenancyView'
import { TopBar } from './console/TopBar'
import { UnderTheHood } from './console/UnderTheHood'
import { friendlyError } from './console/ui'
import type { LogItem, Run, Tone } from './types'

const POLL_MS = 2000
const TOAST_MS = 7000

async function loadSnapshot() {
  try {
    const [tenancies, accounts, entries, integrity, events] = await Promise.all([
      api.tenancies(),
      api.accounts(),
      api.entries(),
      api.integrity(),
      api.webhookEvents(),
    ])
    return { tenancies, accounts, entries, integrity, events }
  } catch {
    return null
  }
}

const TOAST_TONE: Record<Tone, string> = {
  ok: 'border-brand-200 bg-brand-50 text-brand-900 dark:border-brand-900 dark:bg-brand-950 dark:text-brand-100',
  info: 'border-sky-200 bg-sky-50 text-sky-900 dark:border-sky-900 dark:bg-sky-950 dark:text-sky-100',
  warn: 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-100',
  error: 'border-red-200 bg-red-50 text-red-900 dark:border-red-900 dark:bg-red-950 dark:text-red-100',
}

function App() {
  const [tenancies, setTenancies] = useState<Tenancy[]>([])
  const [accounts, setAccounts] = useState<LedgerAccount[]>([])
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [integrity, setIntegrity] = useState<Integrity | null>(null)
  const [events, setEvents] = useState<WebhookEventRecord[]>([])
  const [online, setOnline] = useState<boolean | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [tick, setTick] = useState(0)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [log, setLog] = useState<LogItem[]>([])
  const [dismissedToast, setDismissedToast] = useState<number | null>(null)
  const nextLogId = useRef(1)

  const refresh = useCallback(
    () =>
      loadSnapshot().then((snapshot) => {
        if (snapshot) {
          setTenancies(snapshot.tenancies)
          setAccounts(snapshot.accounts)
          setEntries(snapshot.entries)
          setIntegrity(snapshot.integrity)
          setEvents(snapshot.events)
        }
        setOnline(snapshot !== null)
        setLoaded(true)
        setTick((n) => n + 1)
      }),
    [],
  )

  useEffect(() => {
    void refresh()
    const timer = setInterval(() => void refresh(), POLL_MS)
    return () => clearInterval(timer)
  }, [refresh])

  const note = useCallback((tone: Tone, text: string) => {
    const item = { id: nextLogId.current++, at: new Date().toISOString(), tone, text }
    setLog((items) => [item, ...items].slice(0, 50))
  }, [])

  const run: Run = useCallback(
    async (_label, action) => {
      try {
        const outcome = await action()
        if (typeof outcome === 'string') note('ok', outcome)
        else note(outcome.tone, outcome.text)
      } catch (err) {
        note('error', friendlyError(err))
      } finally {
        await refresh()
      }
    },
    [note, refresh],
  )

  const toast = log[0] && log[0].id !== dismissedToast ? log[0] : null

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setDismissedToast(toast.id), TOAST_MS)
    return () => clearTimeout(timer)
  }, [toast])

  const selected = tenancies.find((t) => t.id === selectedId) ?? tenancies[0] ?? null
  const showForm = loaded && (creating || !selected)

  const select = (id: string) => {
    setSelectedId(id)
    setCreating(false)
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-700 antialiased dark:bg-slate-950 dark:text-slate-300">
      <TopBar online={online} integrity={integrity} />

      {online === false && (
        <div className="border-b border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
          Can’t reach the Owoile server. Start it with <code className="font-mono">npm run dev</code> in the server folder.
          This page reconnects by itself.
        </div>
      )}

      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[300px_minmax(0,1fr)] lg:py-8">
        <TenancySidebar
          tenancies={tenancies}
          selectedId={selected?.id ?? null}
          creating={showForm}
          onSelect={select}
          onCreate={() => setCreating(true)}
        />

        <div className="grid min-w-0 content-start gap-6">
          {!loaded ? (
            <div className="h-64 animate-pulse rounded-2xl bg-slate-200/60 dark:bg-slate-800/60" />
          ) : showForm ? (
            <NewTenancyForm
              run={run}
              firstTime={tenancies.length === 0}
              onCreated={select}
              onCancel={selected ? () => setCreating(false) : null}
            />
          ) : (
            selected && (
              <TenancyView
                key={selected.id}
                tenancy={selected}
                tick={tick}
                run={run}
                onNewTenancy={() => setCreating(true)}
              />
            )
          )}

          <UnderTheHood
            log={log}
            events={events}
            accounts={accounts}
            entries={entries}
            integrity={integrity}
            tenancies={tenancies}
            run={run}
          />
        </div>
      </main>

      {toast && (
        <div
          role="status"
          className={`fixed right-4 bottom-4 left-4 z-30 flex animate-appear items-start gap-3 rounded-xl border px-4 py-3 text-sm shadow-lg sm:left-auto sm:max-w-md ${TOAST_TONE[toast.tone]}`}
        >
          <span className="flex-1">{toast.text}</span>
          <button
            type="button"
            onClick={() => setDismissedToast(toast.id)}
            className="-mr-1 rounded px-1 text-base leading-none opacity-60 hover:opacity-100"
            aria-label="Dismiss"
          >
            ×
          </button>
        </div>
      )}
    </div>
  )
}

export default App
