import { Check } from '../landing/icons'

export type StepState = 'done' | 'current' | 'todo' | 'stopped'

export interface Step {
  title: string
  detail: string
  state: StepState
}

const circle: Record<StepState, string> = {
  done: 'bg-brand-600 text-white dark:bg-brand-500',
  current: 'bg-white text-brand-700 ring-2 ring-brand-600 dark:bg-slate-900 dark:text-brand-300 dark:ring-brand-500',
  todo: 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500',
  stopped: 'bg-slate-500 text-white dark:bg-slate-600',
}

export function Stepper({ steps }: { steps: Step[] }) {
  return (
    <ol className="grid gap-4 sm:grid-cols-4 sm:gap-2">
      {steps.map((step, i) => (
        <li key={step.title} className="relative flex gap-3 sm:grid sm:justify-items-center sm:gap-2 sm:text-center">
          {i < steps.length - 1 && (
            <span
              aria-hidden="true"
              className={`absolute top-4 left-[calc(50%+22px)] hidden h-0.5 w-[calc(100%-44px)] sm:block ${
                step.state === 'done' ? 'bg-brand-500' : 'bg-slate-200 dark:bg-slate-700'
              }`}
            />
          )}
          <span
            className={`relative z-10 grid size-8 flex-none place-items-center rounded-full text-sm font-semibold ${circle[step.state]}`}
          >
            {step.state === 'done' ? <Check /> : step.state === 'stopped' ? '×' : i + 1}
          </span>
          <span className="grid gap-0.5">
            <span
              className={`text-sm font-semibold ${
                step.state === 'todo' ? 'text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-white'
              }`}
            >
              {step.title}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">{step.detail}</span>
          </span>
        </li>
      ))}
    </ol>
  )
}
