import type { Tenancy } from '../api'
import { displayName, naira } from '../format'
import { Plus } from '../landing/icons'
import { STATUS, btnPrimary, card, muted } from './ui'

interface Props {
  tenancies: Tenancy[]
  selectedId: string | null
  creating: boolean
  onSelect: (id: string) => void
  onCreate: () => void
}

export function TenancySidebar({ tenancies, selectedId, creating, onSelect, onCreate }: Props) {
  return (
    <aside className={`${card} grid content-start gap-3 self-start p-4 lg:sticky lg:top-22`}>
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Tenancies</h2>
        <span className={`text-xs ${muted}`}>{tenancies.length}</span>
      </div>

      <button type="button" className={`${btnPrimary} w-full`} onClick={onCreate} disabled={creating}>
        <Plus /> New tenancy
      </button>

      {tenancies.length === 0 ? (
        <p className={`py-4 text-center text-sm ${muted}`}>No tenancies yet.</p>
      ) : (
        <ul className="-m-1 grid max-h-[60vh] gap-1 overflow-y-auto p-1">
          {tenancies.map((t) => {
            const selected = !creating && t.id === selectedId
            return (
              <li key={t.id}>
                <button
                  type="button"
                  onClick={() => onSelect(t.id)}
                  aria-current={selected}
                  className={`grid w-full min-w-0 gap-1 rounded-xl px-3 py-2.5 text-left transition ${
                    selected
                      ? 'bg-brand-50 ring-1 ring-brand-300 dark:bg-brand-950 dark:ring-brand-800'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <span className="truncate text-sm font-medium text-slate-900 dark:text-white">{t.property}</span>
                  <span className={`truncate text-xs ${muted}`}>
                    {displayName(t.tenantId)} → {displayName(t.landlordId)}
                  </span>
                  <span className="flex items-center justify-between gap-2">
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ${STATUS[t.status].className}`}>
                      {STATUS[t.status].label}
                    </span>
                    <span className="flex-none text-xs font-semibold text-slate-700 tabular-nums dark:text-slate-300">
                      {naira(t.rent)}
                    </span>
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </aside>
  )
}
