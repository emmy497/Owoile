import type { ReactNode } from 'react'
import { HeroMockup } from './HeroMockup'
import { Check, ChevronRight, Eye, LogoMark, Percent, Scale, ShieldCheck } from './icons'

const NAV = [
  { href: '#features', label: 'Features' },
  { href: '#how', label: 'How it works' },
  { href: '#engineering', label: 'Under the hood' },
  { href: '#faq', label: 'FAQ' },
]

const BUILT_ON = ['Double-entry ledger', 'MongoDB transactions', 'Signed webhooks', 'TypeScript end to end']

const container = 'mx-auto w-full max-w-6xl px-5'
const btn =
  'inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-xl px-4.5 py-3 text-[15px] leading-tight font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600'
const btnPrimary = `${btn} bg-brand-600 text-white hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-400`
const btnGhost = `${btn} border border-slate-200 bg-white text-brand-700 hover:border-brand-600 dark:border-slate-700 dark:bg-slate-900 dark:text-brand-300`
const btnSm = 'px-3.5 py-2 text-sm'
const h2 = 'text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white'
const muted = 'text-slate-500 dark:text-slate-400'
const card = 'rounded-2xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/60'
const miniCard = 'grid w-full max-w-[250px] gap-1.5 rounded-xl bg-white p-4.5 text-xs shadow-xl shadow-slate-900/10 dark:bg-slate-900 dark:shadow-black/40'
const miniButton = 'mt-1 rounded-lg bg-brand-600 p-2 text-center font-semibold text-white dark:bg-brand-500'
const miniInput = 'mb-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-slate-900 dark:border-slate-700 dark:text-white'
const heldPill =
  'inline-flex items-center gap-1.5 justify-self-center rounded-full bg-brand-50 px-2.5 py-1 font-semibold text-brand-700 dark:bg-brand-950 dark:text-brand-300'

const STEPS = [
  {
    title: 'Landlord lists the tenancy',
    text: 'The property and annual rent go in once. Owoile opens a dedicated escrow account for that tenancy alone.',
    visual: (
      <div className={miniCard}>
        <span className={muted}>Property</span>
        <span className={miniInput}>12 Admiralty Way, Lekki</span>
        <span className={muted}>Annual rent</span>
        <span className={miniInput}>₦250,000.00</span>
        <span className={miniButton}>Create tenancy</span>
      </div>
    ),
  },
  {
    title: 'Tenant pays into escrow',
    text: 'The tenant pays through the checkout. The money lands in escrow, not in anyone’s pocket, and stays there.',
    visual: (
      <div className={`${miniCard} justify-items-center text-center`}>
        <span className="text-[11px] font-semibold tracking-wider text-brand-600 uppercase dark:text-brand-400">
          Checkout
        </span>
        <strong className="text-2xl tracking-tight text-slate-900 dark:text-white">₦250,000.00</strong>
        <span className={`${miniButton} justify-self-stretch`}>Pay ₦250,000.00</span>
        <span className={heldPill}>
          <Check /> Held in escrow
        </span>
      </div>
    ),
  },
  {
    title: 'Move in, landlord gets paid',
    text: 'When the tenant confirms move-in, escrow is released: the landlord gets the rent less a 2.5% fee.',
    visual: (
      <div className={`${miniCard} gap-2.5`}>
        <span className={heldPill}>
          <Check /> Move-in confirmed
        </span>
        {[
          ['To landlord', '₦243,750.00'],
          ['Platform fee', '₦6,250.00'],
        ].map(([label, amount]) => (
          <div key={label} className={`flex justify-between rounded-lg bg-slate-50 px-3 py-2.5 dark:bg-slate-800 ${muted}`}>
            <span>{label}</span>
            <strong className="text-slate-900 tabular-nums dark:text-white">{amount}</strong>
          </div>
        ))}
      </div>
    ),
  },
]

const GUARANTEES = [
  {
    value: 'Dr = Cr',
    title: 'Every entry balances',
    text: 'Each money movement is a journal entry whose debits equal its credits, checked before it is written and again by the database.',
  },
  {
    value: '0',
    title: 'Floating-point numbers',
    text: 'Money is stored as whole kobo and shown as naira. 0.1 + 0.2 rounding errors cannot happen.',
  },
  {
    value: '22 → 1',
    title: 'Deliveries to credits',
    text: 'In a live test, one payment webhook arrived 22 times, out of order. The tenant was credited exactly once.',
  },
  {
    value: '67',
    title: 'Automated tests',
    text: 'They cover concurrent payouts, racing refunds, forged webhooks and a worker crashing mid-payment.',
  },
]

const FAQ = [
  {
    q: 'What is Owoile?',
    a: 'Owoile (owó + ilé, “money” + “house”) is a rent escrow platform. A tenant’s rent is held safely until they move in, then released to the landlord. Neither side has to trust the other with the money first.',
  },
  {
    q: 'Is this live? Does real money move?',
    a: 'Not yet. Owoile is in active development and runs against MockPay, a test payment provider, so no real money moves. You can try every flow in the live console.',
  },
  {
    q: 'What happens to my rent if I don’t move in?',
    a: 'Until the tenant confirms move-in, the rent sits in that tenancy’s escrow account. If the tenancy falls through, whatever escrow holds is refunded to the tenant.',
  },
  {
    q: 'What if the payment provider sends the same notification twice?',
    a: 'Payment providers do this all the time. Every notification is signature-checked, stored once by its event ID, and matched against the payment’s own status. Duplicates and out-of-order messages can never credit a tenancy twice.',
  },
  {
    q: 'How much does it cost?',
    a: 'A 2.5% platform fee is taken from the rent when escrow is released, rounded down to the kobo. The landlord receives the rest. Tenants pay nothing extra.',
  },
]

function FeatureCard({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <article className={`${card} grid content-start gap-2.5 p-7 lg:col-span-2`}>
      <span className="mb-1.5 grid size-10 place-items-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-400">
        {icon}
      </span>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
      <p className={`text-[15px] ${muted}`}>{children}</p>
    </article>
  )
}

function Logo() {
  return (
    <a href="/" className="inline-flex items-center gap-2.5 text-xl font-bold tracking-tight text-slate-900 dark:text-white">
      <LogoMark />
      <span>Owoile</span>
    </a>
  )
}

export function Landing() {
  return (
    <div className="bg-white font-sans text-base/relaxed text-slate-700 antialiased dark:bg-slate-950 dark:text-slate-300">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80">
        <div className={`${container} flex h-17 items-center justify-between gap-4`}>
          <Logo />
          <nav aria-label="Main" className="hidden gap-7 md:flex">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-[15px] font-medium text-slate-600 hover:text-brand-600 dark:text-slate-300 dark:hover:text-brand-400"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <a href="/console" className={`${btnPrimary} ${btnSm}`}>
            Open console <ChevronRight />
          </a>
        </div>
      </header>

      <main>
        <section className="overflow-hidden bg-linear-to-b from-brand-50 to-white pt-12 pb-16 sm:pt-18 sm:pb-22 dark:from-brand-950/60 dark:to-slate-950">
          <div className={`${container} grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]`}>
            <div>
              <h1 className="text-4xl leading-[1.06] font-bold tracking-tighter text-slate-900 sm:text-5xl lg:text-[58px] dark:text-white">
                Rent you can trust. Escrow that never loses a kobo.
              </h1>
              <p className={`mt-5 max-w-lg text-lg ${muted}`}>
                Owoile holds rent in escrow until the tenant moves in, then pays the landlord, all on a double-entry
                ledger built so every naira is accounted for.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="/console" className={btnPrimary}>
                  Try the live console <ChevronRight />
                </a>
                <a href="#how" className={btnGhost}>
                  See how it works <ChevronRight />
                </a>
              </div>
              <div className="mt-11 grid gap-2.5">
                <span className={`text-[13px] ${muted}`}>Built on</span>
                <ul className="flex flex-wrap gap-x-5 gap-y-2">
                  {BUILT_ON.map((item) => (
                    <li key={item} className="text-sm font-semibold text-slate-900/70 dark:text-white/70">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <HeroMockup />
          </div>
        </section>

        <section id="features" className="scroll-mt-17 py-18 sm:py-24">
          <div className={container}>
            <h2 className={`${h2} max-w-2xl`}>Renting in Nigeria shouldn’t mean paying a year upfront on faith.</h2>

            <div className="mt-11 grid gap-5 md:grid-cols-2 lg:grid-cols-5">
              <article
                className={`${card} grid content-end justify-items-center gap-2.5 bg-brand-50 p-8 text-center md:col-span-2 lg:col-span-3 lg:row-span-2 dark:bg-brand-950/40`}
              >
                <div className="relative flex w-full justify-center pt-7 pb-9" aria-hidden="true">
                  <div className="grid w-full max-w-[300px] gap-2.5 rounded-2xl bg-white p-5 text-left shadow-xl shadow-slate-900/10 dark:bg-slate-900 dark:shadow-black/40">
                    <div className={`flex items-center justify-between text-[13px] ${muted}`}>
                      <span>Tenancy · Lekki</span>
                      <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-[11px] font-semibold text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                        Funded
                      </span>
                    </div>
                    <strong className="text-3xl tracking-tight text-slate-900 dark:text-white">₦250,000.00</strong>
                    <ol className={`grid grid-cols-3 gap-1.5 text-xs ${muted}`}>
                      {['Paid', 'Held', 'Released'].map((step, i) => (
                        <li
                          key={step}
                          className={`border-t-[3px] pt-2 ${i < 2 ? 'border-brand-600 font-medium text-slate-900 dark:border-brand-400 dark:text-white' : 'border-slate-200 dark:border-slate-700'}`}
                        >
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                  <span className="absolute bottom-5 left-[8%] grid size-11 place-items-center rounded-full border-3 border-white bg-amber-500 font-bold text-white shadow-lg dark:border-slate-900">
                    T
                  </span>
                  <span className="absolute top-2.5 right-[8%] grid size-11 place-items-center rounded-full border-3 border-white bg-brand-600 font-bold text-white shadow-lg dark:border-slate-900">
                    L
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Rent held in escrow until move-in</h3>
                <p className={`max-w-md text-[15px] ${muted}`}>
                  The tenant pays, but the landlord isn’t paid yet. The money waits in an escrow account of its own
                  until the tenant confirms they’ve moved in, or it goes back to them if the deal falls through.
                </p>
              </article>

              <FeatureCard icon={<ShieldCheck />} title="Safe from double payments">
                Clicked twice? Network retried? Provider resent the alert? Each payment is recorded once, no matter how
                many times it’s announced.
              </FeatureCard>
              <FeatureCard icon={<Eye />} title="Transparent by design">
                Every naira in or out is a ledger entry you can trace: who paid, where it’s held, and where it went.
              </FeatureCard>
              <FeatureCard icon={<Scale />} title="Exact to the kobo">
                Money is counted in whole kobo, never decimals, so balances are always exact and splits always add up.
              </FeatureCard>

              <article
                className={`${card} grid content-end justify-items-center gap-2.5 bg-brand-50 p-8 text-center md:col-span-2 lg:col-span-3 lg:col-start-3 lg:row-span-2 lg:row-start-3 dark:bg-brand-950/40`}
              >
                <div className="relative mx-auto mt-2 mb-5 aspect-[400/220] w-full max-w-md" aria-hidden="true">
                  <svg
                    className="absolute inset-0 size-full fill-none stroke-brand-600 stroke-2 opacity-55 [stroke-dasharray:5_6] dark:stroke-brand-400"
                    viewBox="0 0 400 220"
                    preserveAspectRatio="none"
                  >
                    {['M70 110 H170', 'M230 110 C280 110 280 50 330 50', 'M230 110 C280 110 280 170 330 170'].map((d) => (
                      <path key={d} d={d} vectorEffect="non-scaling-stroke" className="animate-dash motion-reduce:animate-none" />
                    ))}
                  </svg>
                  {[
                    { label: 'Tenant', pos: 'left-[12%] top-1/2' },
                    { label: 'Landlord · 97.5%', pos: 'left-[85%] top-[22.7%]' },
                    { label: 'Fee · 2.5%', pos: 'left-[85%] top-[77.3%]' },
                  ].map((node) => (
                    <span
                      key={node.label}
                      className={`absolute ${node.pos} z-10 -translate-1/2 rounded-xl bg-white px-3 py-2 text-[13px] font-semibold whitespace-nowrap text-slate-900 shadow-lg shadow-slate-900/10 dark:bg-slate-900 dark:text-white`}
                    >
                      {node.label}
                    </span>
                  ))}
                  <span className="absolute top-1/2 left-1/2 z-10 grid -translate-1/2 justify-items-center gap-1.5 rounded-xl bg-white px-4 py-3 text-[13px] font-semibold text-slate-900 shadow-lg shadow-slate-900/10 dark:bg-slate-900 dark:text-white">
                    <LogoMark size={44} />
                    Escrow
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Every naira, double-entered</h3>
                <p className={`max-w-md text-[15px] ${muted}`}>
                  Owoile runs on the same bookkeeping banks use. Money never appears or disappears: it moves between
                  accounts, and every move is recorded twice so the books always balance.
                </p>
              </article>

              <FeatureCard icon={<Percent />} title="One fair, visible fee">
                A flat 2.5% when escrow is released, rounded down to the kobo. No hidden charges, and tenants pay
                nothing extra.
              </FeatureCard>
            </div>
          </div>
        </section>

        <section id="how" className="scroll-mt-17 bg-slate-50 py-18 sm:py-24 dark:bg-slate-900/40">
          <div className={container}>
            <h2 className={h2}>How it works</h2>
            <div className="mt-11 grid gap-8 md:grid-cols-3 md:gap-6">
              {STEPS.map((step, i) => (
                <article key={step.title} className="grid content-start gap-2">
                  <div
                    className="mb-3 grid aspect-4/3 place-items-center rounded-2xl border border-slate-200 bg-linear-to-br from-brand-50 to-brand-100 p-5 dark:border-slate-800 dark:from-brand-950/60 dark:to-slate-900"
                    aria-hidden="true"
                  >
                    {step.visual}
                  </div>
                  <span className="text-[13px] font-semibold text-brand-600 dark:text-brand-400">Step {i + 1}</span>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{step.title}</h3>
                  <p className={`text-[15px] ${muted}`}>{step.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="engineering" className="scroll-mt-17 py-18 sm:py-24">
          <div className={container}>
            <h2 className={`${h2} text-center`}>Built like a bank’s back office</h2>
            <p className={`mx-auto mt-4 max-w-2xl text-center text-[17px] ${muted}`}>
              Payment providers resend messages, deliver them out of order, and sometimes lose them. Owoile assumes all
              of that will happen, and is tested against it.
            </p>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {GUARANTEES.map((g) => (
                <article key={g.title} className={`${card} grid content-start gap-2 px-6 py-7`}>
                  <strong className="text-4xl font-bold tracking-tight text-brand-600 tabular-nums dark:text-brand-400">
                    {g.value}
                  </strong>
                  <h3 className="text-[17px] font-semibold text-slate-900 dark:text-white">{g.title}</h3>
                  <p className={`text-sm ${muted}`}>{g.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="scroll-mt-17 bg-slate-50 py-18 sm:py-24 dark:bg-slate-900/40">
          <div className={`${container} grid items-start gap-12 lg:grid-cols-[0.85fr_1.15fr]`}>
            <div className="grid justify-items-start gap-4">
              <h2 className={h2}>Frequently asked questions</h2>
              <p className={`max-w-sm ${muted}`}>
                Straight answers about how Owoile handles rent, and where the project is today.
              </p>
              <a href="/console" className={`${btnPrimary} ${btnSm}`}>
                Try it yourself <ChevronRight />
              </a>
            </div>
            <div className="grid gap-3">
              {FAQ.map((item, i) => (
                <details
                  key={item.q}
                  name="faq"
                  open={i === 0}
                  className="group rounded-2xl border border-slate-200 bg-white px-5 py-1 dark:border-slate-800 dark:bg-slate-900"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-3.5 font-semibold text-slate-900 focus-visible:outline-2 focus-visible:outline-brand-600 dark:text-white [&::-webkit-details-marker]:hidden">
                    {item.q}
                    <span className="size-2 flex-none -translate-y-0.5 rotate-45 border-r-2 border-b-2 border-current transition-transform group-open:translate-y-0.5 group-open:-rotate-135" />
                  </summary>
                  <p className={`pb-4 text-[15px] ${muted}`}>{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-linear-135 from-brand-950 via-brand-950 to-brand-700 py-26 text-white">
          <div className="pointer-events-none absolute inset-y-0 right-0 left-2/5 bg-linear-115 from-transparent from-30% to-white/5 to-30%" />
          <div className={`${container} relative grid justify-items-center gap-5 text-center`}>
            <span className="drop-shadow-[0_0_24px_rgb(52_196_127/0.7)]">
              <LogoMark size={52} />
            </span>
            <h2 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">Watch the ledger balance itself</h2>
            <p className="max-w-lg text-white/80">
              Create a tenancy, pay through the test checkout, then make the payment provider misbehave. The books still
              add up.
            </p>
            <a href="/console" className={`${btn} bg-white text-brand-700 hover:-translate-y-px`}>
              Open the live console <ChevronRight />
            </a>
          </div>
        </section>
      </main>

      <footer className="pt-16 pb-8">
        <div className={container}>
          <div className="flex flex-wrap justify-between gap-10 border-b border-slate-200 pb-10 dark:border-slate-800">
            <div className="grid max-w-xs gap-3.5">
              <Logo />
              <p className={`text-sm ${muted}`}>Rent escrow and payouts on a double-entry ledger. Owó + ilé: money and house.</p>
            </div>
            <div className="flex gap-12 sm:gap-18">
              {[
                { title: 'Product', links: NAV.filter((n) => n.href !== '#engineering') },
                {
                  title: 'Try it',
                  links: [
                    { href: '/console', label: 'Live console' },
                    { href: '#engineering', label: 'Under the hood' },
                  ],
                },
              ].map((col) => (
                <div key={col.title} className="grid content-start gap-2.5">
                  <h4 className="mb-1 text-[15px] font-semibold text-slate-900 dark:text-white">{col.title}</h4>
                  {col.links.map((link) => (
                    <a key={link.href} href={link.href} className={`text-sm hover:text-brand-600 ${muted}`}>
                      {link.label}
                    </a>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className={`flex flex-wrap justify-between gap-2 pt-6 text-[13px] ${muted}`}>
            <span>© {new Date().getFullYear()} Owoile</span>
            <span>Test payments only; no real money moves.</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
