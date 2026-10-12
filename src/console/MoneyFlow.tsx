import type { Tenancy } from '../api'
import { displayName, isZero, naira } from '../format'
import { ChevronRight } from '../landing/icons'
import { card, muted } from './ui'

interface Bucket {
  who: string
  role: string
  amount: string
  note: string
  active: boolean
}

function buckets(t: Tenancy): Bucket[] {
  const inEscrow = !isZero(t.escrowBalance)
  const released = t.status === 'released'
  const refunded = t.status === 'refunded'
  const owes = t.status === 'pending' && !isZero(t.outstanding)

  return [
    {
      who: displayName(t.tenantId),
      role: 'Tenant',
      amount: refunded ? 'Refunded' : owes ? naira(t.outstanding) : '₦0.00',
      note: refunded ? 'The money went back to the tenant' : owes ? 'still to pay' : 'has paid in full',
      active: owes || refunded,
    },
    {
      who: 'Escrow',
      role: 'Held by Owoile',
      amount: naira(t.escrowBalance),
      note: inEscrow ? 'held safely, nobody can spend it' : released ? 'released' : 'empty',
      active: inEscrow,
    },
    {
      who: displayName(t.landlordId),
      role: 'Landlord',
      amount: released ? naira(t.landlordReceives) : '₦0.00',
      note: released ? `received, after the ${naira(t.platformFee)} fee` : `gets ${naira(t.landlordReceives)} after move-in`,
      active: released,
    },
  ]
}

export function MoneyFlow({ tenancy }: { tenancy: Tenancy }) {
  const items = buckets(tenancy)
  return (
    <section className={`${card} grid gap-4 p-5 sm:p-6`}>
      <div>
        <h2 className="font-semibold text-slate-900 dark:text-white">Where’s the money?</h2>
        <p className={`text-sm ${muted}`}>Highlighted is where the rent is right now.</p>
      </div>
      <div className="grid items-stretch gap-2 sm:grid-cols-[1fr_auto_1fr_auto_1fr]">
        {items.map((b, i) => (
          <div key={b.role} className="contents">
            <div
              className={`grid content-start gap-1 rounded-xl border p-4 transition ${
                b.active
                  ? 'border-brand-300 bg-brand-50 dark:border-brand-800 dark:bg-brand-950/60'
                  : 'border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/40'
              }`}
            >
              <span className={`text-xs font-medium ${muted}`}>{b.role}</span>
              <span className="truncate text-sm font-semibold text-slate-900 dark:text-white">{b.who}</span>
              <span
                className={`text-xl font-bold tracking-tight tabular-nums ${
                  b.active ? 'text-brand-700 dark:text-brand-300' : 'text-slate-400 dark:text-slate-500'
                }`}
              >
                {b.amount}
              </span>
              <span className={`text-xs ${muted}`}>{b.note}</span>
            </div>
            {i < items.length - 1 && (
              <span className="grid rotate-90 place-items-center text-slate-300 sm:rotate-0 dark:text-slate-600" aria-hidden="true">
                <ChevronRight />
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
