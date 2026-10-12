export type Tone = 'ok' | 'warn' | 'error' | 'info'

export interface LogItem {
  id: number
  at: string
  tone: Tone
  text: string
}

export type Outcome = string | { tone: Tone; text: string }

export type Run = (label: string, action: () => Promise<Outcome>) => Promise<void>
