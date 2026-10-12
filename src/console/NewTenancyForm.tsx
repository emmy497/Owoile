import { useState, type FormEvent } from 'react'
import { api } from '../api'
import { cleanNaira, naira, toId } from '../format'
import type { Run } from '../types'
import { btnPrimary, btnSecondary, card, heading, input, label, muted } from './ui'

interface Props {
  run: Run
  firstTime: boolean
  onCreated: (id: string) => void
  onCancel: (() => void) | null
}

const NAIRA = /^\d+(\.\d{1,2})?$/

export function NewTenancyForm({ run, firstTime, onCreated, onCancel }: Props) {
  const [form, setForm] = useState({
    property: '12 Admiralty Way, Lekki',
    rent: '250,000',
    tenant: 'Bola Adeyemi',
    landlord: 'Ade Okafor',
  })
  const [busy, setBusy] = useState(false)

  const rent = cleanNaira(form.rent)
  const rentValid = NAIRA.test(rent) && Number(rent) > 0

  const update = (field: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [field]: e.target.value }))

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (!rentValid) return
    setBusy(true)
    await run('Create tenancy', async () => {
      const tenancy = await api.createTenancy({
        property: form.property.trim(),
        rent,
        tenantId: toId(form.tenant, 'tenant'),
        landlordId: toId(form.landlord, 'landlord'),
      })
      onCreated(tenancy.id)
      return `Created a tenancy for ${tenancy.property}. Rent of ${naira(tenancy.rent)} is now waiting to be paid.`
    })
    setBusy(false)
  }

  return (
    <form onSubmit={submit} className={`${card} grid gap-6 p-6 sm:p-8`}>
      <div className="grid gap-2">
        <span className="text-xs font-semibold tracking-wider text-brand-700 uppercase dark:text-brand-400">Step 1</span>
        <h1 className={`text-2xl tracking-tight ${heading}`}>
          {firstTime ? 'Welcome! Let’s rent out a property' : 'Set up a new tenancy'}
        </h1>
        <p className={`max-w-2xl ${muted}`}>
          {firstTime
            ? 'This is a working demo of Owoile. You’ll play both sides: the landlord who lists a home, and the tenant who pays rent. The rent is held safely in escrow until the tenant moves in. No real money is used.'
            : 'Enter the property, the yearly rent, and who is renting it. Owoile opens a separate escrow account just for this tenancy.'}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className={`${label} sm:col-span-2`}>
          Property address
          <input className={input} value={form.property} onChange={update('property')} required maxLength={200} />
        </label>
        <label className={label}>
          Tenant’s name
          <input className={input} value={form.tenant} onChange={update('tenant')} required maxLength={64} />
        </label>
        <label className={label}>
          Landlord’s name
          <input className={input} value={form.landlord} onChange={update('landlord')} required maxLength={64} />
        </label>
        <label className={`${label} sm:col-span-2`}>
          Yearly rent
          <span className="relative">
            <span className={`pointer-events-none absolute inset-y-0 left-3.5 grid place-items-center ${muted}`}>₦</span>
            <input
              className={`${input} pl-8`}
              value={form.rent}
              onChange={update('rent')}
              inputMode="decimal"
              required
              aria-invalid={!rentValid}
            />
          </span>
          <span className={`text-xs font-normal ${rentValid ? muted : 'text-red-600 dark:text-red-400'}`}>
            {rentValid
              ? `Owoile keeps 2.5% when the rent is released. The landlord gets the rest.`
              : 'Enter an amount like 250,000 or 250000.50'}
          </span>
        </label>
      </div>

      <div className="flex flex-wrap gap-3">
        <button type="submit" className={btnPrimary} disabled={busy || !rentValid}>
          {busy ? 'Creating…' : 'Create tenancy'}
        </button>
        {onCancel && (
          <button type="button" className={btnSecondary} onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
