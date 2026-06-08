import type { ReactNode } from 'react'

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000'

function Button({
  children,
  variant = 'primary',
  href,
}: {
  children: ReactNode
  variant?: 'primary' | 'secondary'
  href?: string
}) {
  const base =
    'inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-violet-400/60 focus:ring-offset-2 focus:ring-offset-slate-950'
  const styles =
    variant === 'primary'
      ? 'bg-violet-500 text-white hover:bg-violet-400'
      : 'bg-white/10 text-white hover:bg-white/15'

  if (href) {
    return (
      <a href={href} className={`${base} ${styles}`}>
        {children}
      </a>
    )
  }

  return <button className={`${base} ${styles}`}>{children}</button>
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border bg-white/[0.03] p-4">
      <div className="text-xs uppercase tracking-wide text-slate-400">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-white">{value}</div>
    </div>
  )
}

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_10%,rgba(139,92,246,0.35),transparent_45%),radial-gradient(circle_at_70%_30%,rgba(56,189,248,0.22),transparent_40%),radial-gradient(circle_at_50%_90%,rgba(16,185,129,0.18),transparent_40%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(2,6,23,0.2),rgba(2,6,23,1))]" />
      </div>

      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-white/10 text-sm font-bold">
            RM
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold text-white">Rent Mate</div>
            <div className="text-xs text-slate-400">Rent anything, safely.</div>
          </div>
        </div>

        <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
          <a className="hover:text-white" href="#how">
            How it works
          </a>
          <a className="hover:text-white" href="#trust">
            Trust & safety
          </a>
          <a className="hover:text-white" href="#pricing">
            Pricing
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="secondary" href="#download">
            Get the app
          </Button>
          <Button href="#list">List an item</Button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-6 pb-20">
        <section className="grid items-center gap-10 py-10 md:grid-cols-2 md:py-16">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border bg-white/[0.03] px-3 py-1 text-xs text-slate-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              API ready at <span className="font-mono text-slate-200">{API_BASE}</span>
            </div>

            <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight text-white md:text-6xl">
              Your neighborhood rental marketplace, built for trust.
            </h1>
            <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-slate-300 md:text-lg">
              Discover items nearby, rent with deposits and disputes built in, and keep everything
              organized from checkout to return.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button href="#discover">Browse listings</Button>
              <Button variant="secondary" href="#how">
                See how it works
              </Button>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-4">
              <Stat label="Fast onboarding" value="OTP login" />
              <Stat label="Secure payments" value="Razorpay" />
              <Stat label="Disputes" value="Built-in flow" />
              <Stat label="Realtime" value="Redis jobs" />
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 -z-10 rounded-3xl bg-white/[0.03] blur-xl" />
            <div className="overflow-hidden rounded-3xl border bg-gradient-to-b from-white/[0.08] to-white/[0.02]">
              <div className="flex items-center justify-between border-b px-5 py-4">
                <div className="text-sm font-semibold text-white">Rent Mate</div>
                <div className="text-xs text-slate-400">Web preview</div>
              </div>
              <div className="space-y-4 p-5">
                <div className="rounded-2xl border bg-white/[0.03] p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-sm font-semibold text-white">DSLR Camera Kit</div>
                      <div className="mt-1 text-xs text-slate-400">Mumbai • ₹499/day • Deposit ₹2,000</div>
                    </div>
                    <div className="rounded-full bg-emerald-400/15 px-2 py-1 text-xs text-emerald-200">
                      Available
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-3 text-xs text-slate-300">
                    <div className="rounded-xl border bg-white/[0.02] p-3">
                      <div className="text-slate-400">Pickup</div>
                      <div className="mt-1 text-white">Today</div>
                    </div>
                    <div className="rounded-xl border bg-white/[0.02] p-3">
                      <div className="text-slate-400">Return</div>
                      <div className="mt-1 text-white">Sunday</div>
                    </div>
                    <div className="rounded-xl border bg-white/[0.02] p-3">
                      <div className="text-slate-400">Total</div>
                      <div className="mt-1 text-white">₹1,497</div>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-3">
                    <div className="h-9 flex-1 rounded-xl bg-white/10" />
                    <div className="h-9 w-24 rounded-xl bg-violet-500/80" />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border bg-white/[0.03] p-4">
                    <div className="text-xs uppercase tracking-wide text-slate-400">Trust</div>
                    <div className="mt-2 text-sm font-semibold text-white">KYC-ready flows</div>
                    <div className="mt-2 text-sm text-slate-300">
                      Verified renters & owners, with clear handoff and return steps.
                    </div>
                  </div>
                  <div className="rounded-2xl border bg-white/[0.03] p-4">
                    <div className="text-xs uppercase tracking-wide text-slate-400">Support</div>
                    <div className="mt-2 text-sm font-semibold text-white">Disputes & deposits</div>
                    <div className="mt-2 text-sm text-slate-300">
                      Built-in resolution flow for peace of mind.
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border bg-white/[0.03] p-4">
                  <div className="text-xs uppercase tracking-wide text-slate-400">For owners</div>
                  <div className="mt-2 text-sm font-semibold text-white">List in minutes</div>
                  <div className="mt-2 text-sm text-slate-300">
                    Set price, deposit, availability, and rules—everything else is automated.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="how" className="mt-6 grid gap-4 md:mt-12 md:grid-cols-3">
          {[
            {
              title: 'Discover nearby',
              body: 'Search listings by category, price, and location. Save favorites.',
            },
            {
              title: 'Book with confidence',
              body: 'Clear deposits, identity checks, and transparent timelines.',
            },
            {
              title: 'Handoff → return',
              body: 'Guided steps and receipts keep owners and renters aligned.',
            },
          ].map((c) => (
            <div key={c.title} className="rounded-3xl border bg-white/[0.03] p-6">
              <div className="text-lg font-semibold text-white">{c.title}</div>
              <div className="mt-2 text-sm leading-relaxed text-slate-300">{c.body}</div>
            </div>
          ))}
        </section>

        <section id="trust" className="mt-10 rounded-3xl border bg-white/[0.03] p-6 md:mt-14 md:p-10">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <div className="text-xs uppercase tracking-wide text-slate-400">Trust & safety</div>
              <div className="mt-3 text-2xl font-semibold text-white md:text-3xl">
                Safety features that scale with your marketplace.
              </div>
              <div className="mt-3 text-sm leading-relaxed text-slate-300">
                Your backend already includes auth, KYC, rentals, payments, notifications, and
                disputes—this web UI is designed to match those flows.
              </div>
            </div>
            <div className="grid gap-3">
              {[
                'OTP auth & JWT sessions',
                'KYC verification hooks',
                'Deposits + refunds',
                'Disputes + admin review',
              ].map((t) => (
                <div key={t} className="rounded-2xl border bg-white/[0.02] p-4 text-sm text-slate-200">
                  {t}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="download" className="mt-10 flex flex-col items-start justify-between gap-6 rounded-3xl border bg-gradient-to-r from-violet-500/15 to-sky-400/10 p-6 md:mt-14 md:flex-row md:items-center md:p-10">
          <div>
            <div className="text-2xl font-semibold text-white">Get Rent Mate on mobile</div>
            <div className="mt-2 text-sm text-slate-200/80">
              Your Expo app already runs with <span className="font-mono">npm run mobile:start</span>.
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" href="#pricing">
              View pricing
            </Button>
            <Button href="#list">Start listing</Button>
          </div>
        </section>
      </main>

      <footer className="mx-auto w-full max-w-6xl border-t px-6 py-10 text-sm text-slate-400">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>© {new Date().getFullYear()} Rent Mate</div>
          <div className="font-mono text-xs">API: {API_BASE}</div>
        </div>
      </footer>
    </div>
  )
}
