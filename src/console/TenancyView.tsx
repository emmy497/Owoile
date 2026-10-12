import { useEffect, useState, type ReactNode } from 'react'
import { ApiError, api, type PaymentRecord, type Tenancy } from '../api'
import { cleanNaira, displayName, isZero, naira, randomKey } from '../format'
import type { Run } from '../types'
import { MoneyFlow } from './MoneyFlow'
import { Stepper, type Step } from './Stepper'
import { STATUS, btnDanger, btnLink, btnPrimary, btnSecondary, card, heading, input, muted } from './ui'

interface Props {
  tenancy: Tenancy
  tick: number
  run: Run
  onNewTenancy: () => void
}

function NextStep({ step, title, children }: { step: string; title: string; children: ReactNode }) {
  return (
    <section className={`${card} grid gap-4 border-brand-200 p-5 ring-4 ring-brand-500/10 sm:p-6 dark:border-brand-900`}>
      <span className="text-xs font-semibold tracking-wider text-brand-700 uppercase dark:text-brand-400">{step}</span>
      <h2 className={`-mt-2 text-xl tracking-tight ${heading}`}>{title}</h2>
      {children}
    </section>
  )
}

function Spinner() {
  return (
    <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden="true" />
  )
}

export function TenancyView({ tenancy, tick, run, onNewTenancy }: Props) {
  const [payments, setPayments] = useState<PaymentRecord[]>([])
  const [landlordBalance, setLandlordBalance] = useState<string | null>(null)
  const [busy, setBusy] = useState<string | null>(null)
  const [partial, setPartial] = useState(false)
  const [amount, setAmount] = useState('')
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null)
  const [lastPayout, setLastPayout] = useState<{ key: string; amount: string } | null>(null)

  const tenant = displayName(tenancy.tenantId)
  const landlord = displayName(tenancy.landlordId)

  useEffect(() => {
    let cancelled = false
    api
      .payments(tenancy.id)
      .then((list) => {
        if (!cancelled) setPayments(list)
      })
      .catch(() => {})
    if (tenancy.status === 'released') {
      api
        .landlordBalance(tenancy.landlordId)
        .then((res) => {
          if (!cancelled) setLandlordBalance(res.balance)
        })
        .catch((err) => {
          if (!cancelled && err instanceof ApiError && err.status === 404) setLandlordBalance('0.00')
        })
    }
    return () => {
      cancelled = true
    }
  }, [tenancy.id, tenancy.landlordId, tenancy.status, tick])

  async function act(name: string, action: Parameters<Run>[1]) {
    setBusy(name)
    await run(name, action)
    setBusy(null)
  }

  const waiting = tenancy.status === 'pending' && payments.some((p) => p.status === 'initiated')
  const paidOut = tenancy.status === 'released' && landlordBalance !== null && isZero(landlordBalance)
  const partialAmount = cleanNaira(amount)

  const pay = () => {
    const tab = window.open('about:blank', '_blank')
    return act('Pay rent', async () => {
      try {
        const result = await api.checkout(tenancy.id, partial && partialAmount ? partialAmount : undefined, window.location.href)
        if (tab) tab.location.href = result.checkoutUrl
        else window.open(result.checkoutUrl, '_blank')
        setCheckoutUrl(result.checkoutUrl)
        setAmount('')
        setPartial(false)
        return {
          tone: 'info',
          text: `Opened a test checkout for ${naira(result.amount)} in a new tab. Click “Pay” there, then come back. This page updates by itself.`,
        }
      } catch (err) {
        tab?.close()
        throw err
      }
    })
  }

  const release = () =>
    act('Confirm move-in', async () => {
      const result = await api.confirmMoveIn(tenancy.id)
      return `${tenant} moved in. ${naira(result.landlordReceives)} was released to ${landlord}, and Owoile kept its ${naira(result.platformFee)} fee.`
    })

  const refund = () =>
    act('Refund', async () => {
      const before = tenancy.escrowBalance
      await api.refund(tenancy.id)
      return `Refunded ${naira(before)} from escrow back to ${tenant}.`
    })

  const payout = (key: string, value: string) =>
    act('Pay out', async () => {
      const result = await api.payout(tenancy.landlordId, value, key)
      setLastPayout({ key, amount: value })
      return result.replayed
        ? {
            tone: 'info',
            text: `Sent the same payout request again. Owoile recognised it and moved no money. ${landlord} still has ${naira(result.balance)} left.`,
          }
        : `Paid ${naira(result.amount)} out to ${landlord}’s bank account.`
    })

  const refunded = tenancy.status === 'refunded'
  const steps: Step[] = [
    { title: 'Tenancy created', detail: naira(tenancy.rent) + ' a year', state: 'done' },
    {
      title: 'Tenant pays rent',
      detail: tenancy.fundedAt ? 'Paid into escrow' : refunded ? 'Not completed' : 'Held in escrow',
      state: tenancy.fundedAt ? 'done' : refunded ? 'stopped' : 'current',
    },
    {
      title: refunded ? 'Refunded' : 'Tenant moves in',
      detail: refunded ? 'Money returned to tenant' : 'Releases the rent',
      state: refunded ? 'stopped' : tenancy.status === 'released' ? 'done' : tenancy.status === 'funded' ? 'current' : 'todo',
    },
    {
      title: 'Landlord paid out',
      detail: 'To their bank',
      state: refunded ? 'stopped' : paidOut ? 'done' : tenancy.status === 'released' ? 'current' : 'todo',
    },
  ]

  return (
    <div className="grid gap-6">
      <section className={`${card} grid gap-6 p-5 sm:p-6`}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className={`text-2xl tracking-tight ${heading}`}>{tenancy.property}</h1>
            <p className={`text-sm ${muted}`}>
              Tenant <span className="font-medium text-slate-700 dark:text-slate-200">{tenant}</span> · Landlord{' '}
              <span className="font-medium text-slate-700 dark:text-slate-200">{landlord}</span> · Rent{' '}
              <span className="font-medium text-slate-700 tabular-nums dark:text-slate-200">{naira(tenancy.rent)}</span>
            </p>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${STATUS[tenancy.status].className}`}>
            {STATUS[tenancy.status].label}
          </span>
        </div>
        <Stepper steps={steps} />
      </section>

      {tenancy.status === 'pending' && (
        <NextStep step="Step 2 · You are the tenant" title={`Pay ${naira(tenancy.outstanding)} rent`}>
          <p className={muted}>
            The rent doesn’t go to {landlord} yet. It goes into escrow and stays there until {tenant} moves in. Clicking
            the button opens a <strong className="font-semibold text-slate-700 dark:text-slate-200">test checkout</strong> in a
            new tab. Click “Pay” there, then come back here.
          </p>

          {waiting && (
            <div className="flex flex-wrap items-center gap-3 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:bg-amber-950/60 dark:text-amber-200">
              <Spinner />
              <span className="flex-1">
                Waiting for the payment to be confirmed. Finish paying in the checkout tab. This updates by itself within a
                few seconds.
              </span>
              {checkoutUrl && (
                <a href={checkoutUrl} target="_blank" rel="noreferrer" className={btnLink}>
                  Open checkout again
                </a>
              )}
            </div>
          )}

          {!isZero(tenancy.escrowBalance) && (
            <p className="text-sm text-slate-700 dark:text-slate-300">
              {naira(tenancy.escrowBalance)} already paid. {naira(tenancy.outstanding)} to go.
            </p>
          )}

          {partial && (
            <label className="grid max-w-xs gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
              Amount for this instalment
              <span className="relative">
                <span className={`pointer-events-none absolute inset-y-0 left-3.5 grid place-items-center ${muted}`}>₦</span>
                <input
                  className={`${input} pl-8`}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder={tenancy.outstanding}
                  inputMode="decimal"
                  autoFocus
                />
              </span>
            </label>
          )}

          <div className="flex flex-wrap items-center gap-4">
            <button type="button" className={btnPrimary} onClick={pay} disabled={busy !== null}>
              {busy === 'Pay rent' && <Spinner />}
              {partial && partialAmount ? `Pay ${naira(partialAmount)}` : `Pay ${naira(tenancy.outstanding)} as ${tenant}`}
            </button>
            <button type="button" className={btnLink} onClick={() => setPartial((p) => !p)}>
              {partial ? 'Pay the full amount instead' : 'Pay part of it instead'}
            </button>
            {!isZero(tenancy.escrowBalance) && (
              <button type="button" className={btnLink} onClick={refund} disabled={busy !== null}>
                Cancel and refund what’s been paid
              </button>
            )}
          </div>
        </NextStep>
      )}

      {tenancy.status === 'funded' && (
        <NextStep step="Step 3 · You are the tenant" title={`Has ${tenant} moved in?`}>
          <p className={muted}>
            The full rent of {naira(tenancy.rent)} is safe in escrow. Once {tenant} confirms they’ve moved in, Owoile
            releases it: <strong className="font-semibold text-slate-700 dark:text-slate-200">{naira(tenancy.landlordReceives)}</strong>{' '}
            to {landlord} and a {naira(tenancy.platformFee)} (2.5%) fee to Owoile. If the move falls through, the tenant
            gets everything back instead.
          </p>
          <div className="flex flex-wrap gap-3">
            <button type="button" className={btnPrimary} onClick={release} disabled={busy !== null}>
              {busy === 'Confirm move-in' && <Spinner />}
              Yes, I’ve moved in. Release the rent
            </button>
            <button type="button" className={btnDanger} onClick={refund} disabled={busy !== null}>
              {busy === 'Refund' && <Spinner />}
              No, refund me
            </button>
          </div>
        </NextStep>
      )}

      {tenancy.status === 'released' && !paidOut && (
        <NextStep step="Step 4 · You are the landlord" title={`Withdraw your rent, ${landlord.split(' ')[0]}`}>
          <p className={muted}>
            The rent is now in {landlord}’s Owoile balance. Paying it out sends it to their bank account.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              className={btnPrimary}
              onClick={() => landlordBalance && payout(randomKey('payout'), landlordBalance)}
              disabled={busy !== null || landlordBalance === null}
            >
              {busy === 'Pay out' && <Spinner />}
              Pay out {landlordBalance ? naira(landlordBalance) : '…'}
            </button>
          </div>
        </NextStep>
      )}

      {paidOut && (
        <NextStep step="All done" title="The rent reached the landlord">
          <p className={muted}>
            {tenant} paid, the money waited safely in escrow, {tenant} moved in, and {landlord} was paid. Every naira along
            the way is recorded in the books. See “Under the hood” below.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <button type="button" className={btnPrimary} onClick={onNewTenancy}>
              Start another tenancy
            </button>
            {lastPayout && (
              <button
                type="button"
                className={btnSecondary}
                onClick={() => payout(lastPayout.key, lastPayout.amount)}
                disabled={busy !== null}
                title="Simulates a double-click or a network retry"
              >
                Try paying out twice
              </button>
            )}
          </div>
        </NextStep>
      )}

      {refunded && (
        <NextStep step="Closed" title="This tenancy was refunded">
          <p className={muted}>
            The money in escrow went back to {tenant}. {landlord} received nothing, and Owoile took no fee.
          </p>
          <div>
            <button type="button" className={btnPrimary} onClick={onNewTenancy}>
              Start another tenancy
            </button>
          </div>
        </NextStep>
      )}

      <MoneyFlow tenancy={tenancy} />
    </div>
  )
}
