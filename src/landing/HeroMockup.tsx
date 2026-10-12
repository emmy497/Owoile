import { ArrowDown, ArrowUp, Bell, Check, Home, KeyIcon, Search, Send, Undo } from './icons'

const ACTIONS = [
  { icon: <Send />, label: 'Pay rent' },
  { icon: <KeyIcon />, label: 'Move in' },
  { icon: <Undo />, label: 'Refund' },
  { icon: <Home />, label: 'Payout' },
]

const ACTIVITY = [
  { icon: <ArrowDown />, label: 'Rent paid into escrow', amount: '+₦250,000', incoming: true },
  { icon: <ArrowUp />, label: 'Released to landlord', amount: '−₦243,750', incoming: false },
  { icon: <ArrowUp />, label: 'Platform fee (2.5%)', amount: '−₦6,250', incoming: false },
]

const floatCard =
  'absolute animate-float rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xl shadow-slate-900/10 motion-reduce:animate-none dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/40'

export function HeroMockup() {
  return (
    <div className="relative flex justify-center py-6" aria-hidden="true">
      <div className="w-[270px] rounded-[40px] bg-linear-to-br from-brand-200 to-brand-400 p-2.5 shadow-2xl shadow-brand-600/40 sm:w-[300px]">
        <div className="grid gap-1 rounded-t-[30px] rounded-b-2xl bg-linear-to-br from-brand-500 to-brand-800 px-4.5 pt-5 pb-14 text-white">
          <div className="mb-4 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5 text-xs">
              <Search /> Search tenancies
            </span>
            <Bell />
          </div>
          <span className="text-xs opacity-80">Held in escrow</span>
          <div className="flex items-center justify-between gap-2">
            <strong className="text-[22px] tracking-tight tabular-nums">₦250,000.00</strong>
            <span className="flex-none rounded-full bg-white px-2.5 py-0.5 text-[11px] font-semibold text-brand-700">Funded</span>
          </div>
          <span className="text-xs opacity-75">12 Admiralty Way, Lekki</span>
        </div>

        <div className="relative mx-3 -mt-9 grid grid-cols-4 rounded-2xl bg-white px-1.5 py-3 shadow-lg shadow-slate-900/15">
          {ACTIONS.map((a) => (
            <span key={a.label} className="grid justify-items-center gap-1 text-center text-[10.5px] font-medium text-slate-600">
              <span className="text-brand-600">{a.icon}</span>
              {a.label}
            </span>
          ))}
        </div>

        <div className="mt-2.5 grid gap-2.5 rounded-t-2xl rounded-b-[30px] bg-white px-3.5 pt-3.5 pb-4.5 text-slate-800">
          <div className="flex items-baseline justify-between text-[13px]">
            <strong>Recent activity</strong>
            <span className="text-[11px] text-brand-600">View ledger</span>
          </div>
          {ACTIVITY.map((row) => (
            <div key={row.label} className="grid grid-cols-[30px_1fr_auto] items-center gap-2.5 rounded-xl bg-slate-50 p-2 text-xs">
              <span className="grid size-7.5 place-items-center rounded-full bg-brand-50 text-brand-600">{row.icon}</span>
              <span>{row.label}</span>
              <span className={`font-semibold ${row.incoming ? 'text-brand-600' : 'text-red-600'}`}>{row.amount}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={`${floatCard} -bottom-1 left-0 flex max-w-[230px] items-center gap-3 sm:-left-6 sm:max-w-[250px]`}>
        <span className="grid size-9 flex-none place-items-center rounded-full bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-400">
          <Check />
        </span>
        <div>
          <strong className="block text-sm text-slate-900 dark:text-white">Ledger balanced</strong>
          <span className="text-xs text-slate-500 dark:text-slate-400">Debits ₦500,000.00 = Credits ₦500,000.00</span>
        </div>
      </div>

      <div className={`${floatCard} top-0 right-0 grid min-w-[150px] gap-1 [animation-delay:-3s] sm:top-10 sm:-right-1`}>
        <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
          Payment webhook
        </span>
        <div className="flex items-baseline gap-1.5">
          <strong className="text-3xl tracking-tight text-slate-900 dark:text-white">×22</strong>
          <span className="text-[13px] text-slate-500 dark:text-slate-400">deliveries</span>
        </div>
        <span className="justify-self-start rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-semibold text-brand-700 dark:bg-brand-950 dark:text-brand-300">
          credited once
        </span>
      </div>
    </div>
  )
}
