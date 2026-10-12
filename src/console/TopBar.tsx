import type { Integrity } from '../api'
import { LogoMark } from '../landing/icons'

interface Props {
  online: boolean | null
  integrity: Integrity | null
}

function Pill({ tone, children }: { tone: 'ok' | 'bad' | 'idle'; children: string }) {
  const tones = {
    ok: 'bg-brand-50 text-brand-800 dark:bg-brand-950 dark:text-brand-300',
    bad: 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300',
    idle: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
  }
  const dots = { ok: 'bg-brand-500', bad: 'bg-red-500', idle: 'bg-slate-400' }
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${tones[tone]}`}>
      <span className={`size-1.5 rounded-full ${dots[tone]}`} />
      {children}
    </span>
  )
}

export function TopBar({ online, integrity }: Props) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/85 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/85">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <a href="/" className="flex items-center gap-2.5">
          <LogoMark />
          <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">Owoile</span>
          <span className="hidden rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 sm:inline dark:bg-slate-800 dark:text-slate-300">
            Demo console
          </span>
        </a>
        <div className="flex flex-wrap justify-end gap-2">
          <Pill tone={online === null ? 'idle' : online ? 'ok' : 'bad'}>
            {online === null ? 'Connecting…' : online ? 'Server connected' : 'Server offline'}
          </Pill>
          {integrity && (
            <Pill tone={integrity.ok ? 'ok' : 'bad'}>{integrity.ok ? 'Books balanced' : 'Books out of balance'}</Pill>
          )}
        </div>
      </div>
    </header>
  )
}
