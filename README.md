# Owoile console

A demo console for the Owoile rent escrow API. The backend (the ledger, escrow, webhooks and the MockPay provider, with their tests) lives in its own repo, in `server/`.

The console lets you:

- Create tenancies and **pay through MockPay's checkout page**. The payment reaches Owoile only through signed webhooks.
- Switch MockPay between **calm, chaotic and hostile**, and watch the **webhook inbox**:
  - Events arrive duplicated, late and out of order, and each one shows its delivery count.
  - Each event also shows its outcome: `applied`, `duplicate`, `stale`, or `rejected` with the reason.
- **Replay** a successful payment's webhook 20 times. Deliveries climb while escrow doesn't move.
- Confirm move-in (which releases escrow minus the fee), refund tenants, and pay landlords out with an `Idempotency-Key`.
- Watch the journal post live. Balances are shown in naira, and the integrity check recomputes debits and credits from the journal.

## Running

You need three terminals:

```sh
cd server && npm run dev            # API on :4000
cd server && npm run dev:provider   # MockPay on :4100
npm install && npm run dev          # this console
```

Vite proxies `/api/*` to the API and `/provider/*` to MockPay.
