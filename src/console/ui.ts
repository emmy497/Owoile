import { ApiError, type TenancyStatus } from '../api'

export const card = 'rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900'

const btn =
  'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600'

export const btnPrimary = `${btn} bg-brand-600 text-white hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-400`
export const btnSecondary = `${btn} border border-slate-200 bg-white text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800`
export const btnDanger = `${btn} border border-red-200 bg-white text-red-700 hover:bg-red-50 dark:border-red-900 dark:bg-slate-900 dark:text-red-400 dark:hover:bg-red-950`
export const btnLink =
  'text-sm font-semibold text-brand-700 underline-offset-4 hover:underline disabled:opacity-50 dark:text-brand-400'

export const input =
  'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 tabular-nums placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-3 focus:ring-brand-500/20 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-white'

export const label = 'grid gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300'
export const muted = 'text-slate-500 dark:text-slate-400'
export const heading = 'font-semibold text-slate-900 dark:text-white'

export const STATUS: Record<TenancyStatus, { label: string; className: string }> = {
  pending: {
    label: 'Waiting for rent',
    className: 'bg-amber-50 text-amber-800 ring-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:ring-amber-900',
  },
  funded: {
    label: 'Rent in escrow',
    className: 'bg-sky-50 text-sky-800 ring-sky-200 dark:bg-sky-950 dark:text-sky-300 dark:ring-sky-900',
  },
  released: {
    label: 'Released to landlord',
    className: 'bg-brand-50 text-brand-800 ring-brand-200 dark:bg-brand-950 dark:text-brand-300 dark:ring-brand-900',
  },
  refunded: {
    label: 'Refunded',
    className: 'bg-slate-100 text-slate-700 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700',
  },
}

const FRIENDLY: Record<string, string> = {
  OVERPAYMENT: 'That is more than the rent still owed.',
  INVALID_TRANSITION: 'That can’t be done at this stage of the tenancy.',
  INSUFFICIENT_FUNDS: 'There isn’t enough money for that.',
  NOTHING_TO_REFUND: 'There’s nothing in escrow to refund yet.',
  VALIDATION_FAILED: 'Some details look wrong. Check the names and the amount.',
  PROVIDER_ERROR: 'MockPay, the test payment provider, isn’t responding. Start it with npm run dev:provider in server/.',
  LANDLORD_NOT_FOUND: 'This landlord has no balance yet.',
  TENANCY_NOT_FOUND: 'That tenancy no longer exists.',
}

export function friendlyError(err: unknown): string {
  if (err instanceof ApiError) return FRIENDLY[err.code] ?? err.message
  if (err instanceof TypeError) return 'Can’t reach the Owoile server. Is it running? (npm run dev in server/)'
  if (err instanceof Error) return err.message
  return String(err)
}
