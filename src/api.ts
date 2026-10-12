export type TenancyStatus = 'pending' | 'funded' | 'released' | 'refunded'

export interface Tenancy {
  id: string
  landlordId: string
  tenantId: string
  property: string
  status: TenancyStatus
  rent: string
  platformFee: string
  landlordReceives: string
  escrowBalance: string
  outstanding: string
  fundedAt: string | null
  releasedAt: string | null
  refundedAt: string | null
  createdAt: string
  replayed: boolean
}

export interface LedgerAccount {
  id: string
  code: string
  name: string
  type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense'
  balance: string
}

export interface JournalLine {
  account: string
  direction: 'debit' | 'credit'
  amount: string
}

export interface JournalEntry {
  id: string
  idempotencyKey: string
  description: string
  postedAt: string
  reversalOf: string | null
  lines: JournalLine[]
}

export interface Integrity {
  ok: boolean
  totalDebits: string
  totalCredits: string
  unbalancedEntryIds: string[]
  balanceDrift: { code: string; cached: string; fromJournal: string }[]
}

export interface PayoutResult {
  landlordId: string
  amount: string
  balance: string
  entryId: string
  replayed: boolean
}

export interface PaymentRecord {
  reference: string
  tenancyId: string
  amount: string
  status: 'initiated' | 'succeeded' | 'failed'
  failureReason: string | null
  createdAt: string
  updatedAt: string
}

export interface CheckoutResult extends PaymentRecord {
  checkoutUrl: string
}

export interface WebhookEventRecord {
  id: string
  type: string
  reference: string
  deliveries: number
  status: 'received' | 'processing' | 'processed' | 'failed'
  outcome: 'applied' | 'duplicate' | 'stale' | 'noop' | null
  attempts: number
  lastError: string | null
  receivedAt: string
  processedAt: string | null
}

export interface ChaosConfig {
  duplicateRate: number
  maxDuplicates: number
  maxDelayMs: number
  dropRate: number
}

export type ChaosPreset = 'calm' | 'chaotic' | 'hostile'

export class ApiError extends Error {
  readonly status: number
  readonly code: string

  constructor(status: number, code: string, message: string) {
    super(message)
    this.status = status
    this.code = code
  }
}

async function call<T>(path: string, init: RequestInit = {}, prefix = '/api'): Promise<T> {
  const res = await fetch(`${prefix}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init.headers },
  })
  const body = await res.json().catch(() => null)
  if (!res.ok) {
    throw new ApiError(res.status, body?.error?.code ?? 'HTTP_ERROR', body?.error?.message ?? res.statusText)
  }
  return body as T
}

function post<T>(path: string, body?: unknown, headers?: Record<string, string>) {
  return call<T>(path, { method: 'POST', body: body === undefined ? undefined : JSON.stringify(body), headers })
}

export const api = {
  health: () => call<{ status: string; db: string }>('/health'),
  tenancies: () => call<Tenancy[]>('/tenancies'),
  createTenancy: (input: { landlordId: string; tenantId: string; property: string; rent: string }) =>
    post<Tenancy>('/tenancies', input),
  checkout: (id: string, amount: string | undefined, callbackUrl: string) =>
    post<CheckoutResult>(`/tenancies/${id}/checkout`, amount ? { amount, callbackUrl } : { callbackUrl }),
  payments: (id: string) => call<PaymentRecord[]>(`/tenancies/${id}/payments`),
  webhookEvents: (limit = 40) => call<WebhookEventRecord[]>(`/webhooks/events?limit=${limit}`),
  confirmMoveIn: (id: string) => post<Tenancy>(`/tenancies/${id}/confirm-move-in`),
  refund: (id: string) => post<Tenancy>(`/tenancies/${id}/refund`),
  landlordBalance: (landlordId: string) =>
    call<{ landlordId: string; balance: string }>(`/landlords/${encodeURIComponent(landlordId)}/balance`),
  payout: (landlordId: string, amount: string, idempotencyKey: string) =>
    post<PayoutResult>(`/landlords/${encodeURIComponent(landlordId)}/payouts`, { amount }, {
      'Idempotency-Key': idempotencyKey,
    }),
  accounts: () => call<LedgerAccount[]>('/ledger/accounts'),
  entries: (limit = 30) => call<JournalEntry[]>(`/ledger/entries?limit=${limit}`),
  integrity: () => call<Integrity>('/ledger/integrity'),
}

export const provider = {
  chaos: () => call<{ chaos: ChaosConfig; presets: Record<ChaosPreset, ChaosConfig> }>('/_dev/chaos', {}, '/provider'),
  setChaos: (preset: ChaosPreset) =>
    call<{ chaos: ChaosConfig }>('/_dev/chaos', { method: 'PUT', body: JSON.stringify({ preset }) }, '/provider'),
  replay: (reference: string, times: number) =>
    call<{ replayed: string; times: number }>(
      `/_dev/transactions/${encodeURIComponent(reference)}/replay`,
      { method: 'POST', body: JSON.stringify({ times }) },
      '/provider',
    ),
}
