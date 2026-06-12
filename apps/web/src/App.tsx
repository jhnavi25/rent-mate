import Lottie from 'lottie-react'
import { useEffect, useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import AuthPage from './pages/AuthPage'
import ListingsPage from './pages/ListingsPage'
import NewListingPage from './pages/NewListingPage'
import type { ReactNode } from 'react'

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000'

const MARQUEE_ITEMS = [
  '📷 DSLR Camera', '🛺 Camping Gear', '🎮 Gaming Console', '🔧 Power Tools',
  '🎸 Guitar', '🚲 Bicycle', '📽️ Projector', '🏕️ Tent', '🎤 Mic Setup',
  '🛵 Scooter', '🎨 Art Supplies', '💻 MacBook',
]

const HOW_IT_WORKS = [
  {
    step: '01',
    icon: '🗺️',
    title: 'Discover nearby',
    body: 'Browse verified listings by category, price range, and distance from you.',
    color: 'from-violet-500/20 to-violet-500/5',
    accent: 'border-violet-500/40',
  },
  {
    step: '02',
    icon: '🔐',
    title: 'Book with confidence',
    body: 'KYC-verified owners, transparent deposits, and a 72h inspection window.',
    color: 'from-sky-500/20 to-sky-500/5',
    accent: 'border-sky-500/40',
  },
  {
    step: '03',
    icon: '🤝',
    title: 'Handoff → return',
    body: 'Guided pickup and return flow. Disputes resolved in your favour, every time.',
    color: 'from-emerald-500/20 to-emerald-500/5',
    accent: 'border-emerald-500/40',
  },
]

const TRUST_ITEMS = [
  { icon: '🛡️', label: 'OTP auth & JWT sessions', desc: 'Passwordless, secure, instant' },
  { icon: '🪪', label: 'KYC verification', desc: 'Aadhaar / PAN identity checks' },
  { icon: '💰', label: 'Escrow deposits', desc: 'Funds held until safe return' },
  { icon: '⚖️', label: 'Dispute resolution', desc: 'Admin-mediated, fair outcomes' },
]

const FLOATING_TAGS = [
  { label: '₹499/day', top: '6%', left: '-2%', delay: '0s' },
  { label: '⭐ 4.9', top: '18%', right: '-4%', delay: '1.5s' },
  { label: '✓ Verified', bottom: '32%', left: '-4%', delay: '0.8s' },
  { label: '📍 2.3 km', bottom: '8%', right: '-2%', delay: '2s' },
]

function Button({
  children,
  variant = 'primary',
  href,
  size = 'md',
}: {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost'
  href?: string
  size?: 'sm' | 'md' | 'lg'
}) {
  const sizes = { sm: 'px-3 py-1.5 text-xs', md: 'px-5 py-2.5 text-sm', lg: 'px-7 py-3.5 text-base' }
  const base = `inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-400/60 focus:ring-offset-2 focus:ring-offset-slate-950 ${sizes[size]}`
  const styles = {
    primary: 'bg-violet-600 text-white hover:bg-violet-500 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:-translate-y-0.5 active:translate-y-0',
    secondary: 'bg-white/8 text-white border border-white/10 hover:bg-white/12 hover:border-white/20 hover:-translate-y-0.5',
    ghost: 'text-slate-300 hover:text-white',
  }[variant]

if (href?.startsWith('/')) {
  return (
    <Link to={href} className={`${base} ${styles}`}>
      {children}
    </Link>
  )
}

if (href?.startsWith('#')) {
  return (
    <a href={href} className={`${base} ${styles}`}>
      {children}
    </a>
  )
}

return <button className={`${base} ${styles}`}>{children}</button>
}

function FloatingTag({
  label, top, left, right, bottom, delay,
}: {
  label: string; top?: string; left?: string; right?: string; bottom?: string; delay: string
}) {
  return (
    <div
      className="absolute animate-float rounded-full border border-white/10 bg-slate-900/80 px-3 py-1.5 text-xs font-semibold text-white shadow-lg backdrop-blur-sm"
      style={{ top, left, right, bottom, animationDelay: delay }}
    >
      {label}
    </div>
  )
}

function MarqueeStrip() {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS]
  return (
    <div className="relative overflow-hidden border-y border-white/[0.06] py-3">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-slate-950" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-slate-950" />
      <div className="flex animate-marquee whitespace-nowrap">
        {items.map((item, i) => (
          <span key={i} className="mx-6 text-sm font-medium text-slate-400">
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

// Reliable LottieFiles CDN animation — delivery/handoff themed
const LOTTIE_SRC = 'https://lottie.host/0e4c43bf-b88a-4fd5-95e7-b855efedd3a4/Pj1BBjWxLq.json'

function LottieHero() {
  const [prefersReduced, setPrefersReduced] = useState(false)

  const [animData, setAnimData] = useState<object | null>(null)

  useEffect(() => {
    setPrefersReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    const t = setTimeout(() => {
      fetch(LOTTIE_SRC)
        .then((r) => r.json())
        .then((data) => setAnimData(data))
        .catch(() => null)
    }, 100)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="relative flex items-center justify-center animate-fadeInUp overflow-visible">
      {FLOATING_TAGS.map((tag) => (
        <FloatingTag key={tag.label} {...tag} />
      ))}
      <div className="gradient-border relative overflow-visible rounded-3xl bg-slate-900/60 shadow-2xl shadow-violet-500/10 backdrop-blur-sm p-6">
        {animData && !prefersReduced ? (
          <Lottie
            animationData={animData}
            loop
            autoplay
            style={{ height: 360, width: 360 }}
          />
        ) : (
          // fallback for reduced-motion or before load
          <div className="flex h-[360px] w-[360px] flex-col items-center justify-center gap-6">
            <div className="text-8xl">🤝</div>
            <div className="text-center text-sm text-slate-400">
              Peer-to-peer rentals<br />KYC verified · Escrow protected
            </div>
          </div>
        )}
        <p className="text-center text-xs text-slate-500 mt-2 tracking-widest uppercase">
          Peer-to-peer rentals · KYC verified
        </p>
      </div>
    </div>
  )
}

function LandingPage() {
  const scrollToSection = (id: string) => {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(124,92,255,0.18),transparent_55%),radial-gradient(ellipse_at_80%_10%,rgba(56,189,248,0.12),transparent_50%),radial-gradient(ellipse_at_50%_100%,rgba(16,185,129,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_60%,rgb(2,6,23))]" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '64px 64px' }} />
      </div>

      {/* Navbar */}
      <header className="glass sticky top-0 z-50 border-b border-white/[0.06]">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-violet-600 text-sm font-black text-white shadow-lg shadow-violet-500/40">
              RM
            </div>
            <div className="leading-tight">
              <div className="text-sm font-bold text-white">Rent Mate</div>
              <div className="text-[10px] text-slate-500">Hyperlocal rentals</div>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            <button onClick={() => scrollToSection('how')}>
               How it works
            </button>
            <button onClick={() => scrollToSection('trust')}>
               Trust & Safety
            </button>
            <button onClick={() => scrollToSection('download')}>
              Mobile app
            </button>
          </nav>

          <div className="flex items-center gap-2">
            <Link to="/auth">
              <Button variant="ghost" size="md">
                  Sign in
              </Button>
            </Link>
            <Link to="/listings/new">
              <Button size="sm">
                List an item ↗
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-6 pb-24">

        {/* Hero */}
        <section className="relative flex flex-col gap-12 py-16 md:py-24">
          {/* Left */}
          <div className="animate-fadeInUp">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-300">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              Now live · API at {API_BASE}
            </div>

            <h1 className="text-balance text-5xl font-black tracking-tighter text-white md:text-7xl">
              Rent what{' '}
              <span className="shimmer-text">you need.</span>
              <br />
              Earn from{' '}
              <span className="shimmer-text">what you own.</span>
            </h1>

            <p className="animate-fadeInUp-delayed mt-6 max-w-lg text-pretty text-base leading-relaxed text-slate-400 md:text-lg">
              India's peer-to-peer rental marketplace — built for college campuses and urban communities. KYC verified. Escrow protected. Real-time.
            </p>

            <div className="animate-fadeInUp-delayed-2 mt-8 flex flex-wrap items-center gap-3">
              <Link to="/listings">
                <Button size="lg">
                  Browse listings →
                </Button>
              </Link>
              <Button variant="secondary" href="#how" size="lg">How it works</Button>
            </div>

            <div className="mt-10 flex items-center gap-6 text-sm text-slate-400">
              {([
                  ['500+', 'Listings'],
                  ['4.9★', 'Avg rating'],
                  ['72h', 'Dispute SLA'],
                ] as const).map(([val, lbl]) => (
                <div key={lbl}>
                  <span className="block text-xl font-black text-white">{val}</span>
                  <span className="text-xs">{lbl}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Lottie Hero Animation */}
          <div className="animate-fadeInUp"></div>
          <LottieHero />
        </section>

        {/* Marquee */}
        <MarqueeStrip />

        {/* How it works */}
        <section id="how" className="mt-20">
          <div className="mb-10 text-center">
            <div className="inline-block rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-violet-400">
              How it works
            </div>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-white md:text-4xl">
              Three steps to your next rental
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {HOW_IT_WORKS.map((c) => (
              <div
                key={c.step}
                className={`card-hover gradient-border relative overflow-hidden rounded-3xl border bg-gradient-to-br ${c.color} to-transparent p-7`}
              >
                <div className="absolute right-5 top-5 font-black text-6xl text-white/[0.04]">{c.step}</div>
                <div className="mb-4 text-4xl">{c.icon}</div>
                <div className={`mb-1 inline-block rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${c.accent} text-slate-400`}>
                  Step {c.step}
                </div>
                <div className="mt-2 text-lg font-bold text-white">{c.title}</div>
                <div className="mt-2 text-sm leading-relaxed text-slate-400">{c.body}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Trust & Safety */}
        <section id="trust" className="mt-20">
          <div className="gradient-border overflow-hidden rounded-3xl bg-slate-900/40 p-8 md:p-12">
            <div className="grid gap-10 md:grid-cols-2">
              <div>
                <div className="inline-block rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-emerald-400">
                  Trust & Safety
                </div>
                <h2 className="mt-4 text-3xl font-black tracking-tight text-white md:text-4xl">
                  Built safe,<br />from the ground up.
                </h2>
                <p className="mt-4 text-base leading-relaxed text-slate-400">
                  Every transaction is wrapped in identity checks, escrow payments, and dispute resolution — so you can rent and lend with zero anxiety.
                </p>
                <Button variant="secondary" href="#download" size="lg">
                  See full safety guide →
                </Button>
              </div>

              <div className="grid gap-3">
                {TRUST_ITEMS.map((t) => (
                  <div
                    key={t.label}
                    className="card-hover flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4"
                  >
                    <div className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/5 text-2xl">
                      {t.icon}
                    </div>
                    <div>
                      <div className="font-semibold text-white">{t.label}</div>
                      <div className="text-xs text-slate-500">{t.desc}</div>
                    </div>
                    <div className="ml-auto text-slate-600">›</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section id="download" className="relative mt-20 overflow-hidden rounded-3xl p-px">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-sky-500 to-emerald-500 opacity-60" />
          <div className="relative rounded-[calc(1.5rem-1px)] bg-slate-950 p-8 md:p-12">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_50%,rgba(124,92,255,0.15),transparent_60%)]" />
            <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div>
                <div className="text-3xl font-black text-white md:text-4xl">
                  Ready to start?
                </div>
                <p className="mt-2 text-slate-400">
                  Download the app or list your first item in under 2 minutes.
                </p>
                <p className="mt-1 font-mono text-xs text-slate-600">
                  npx expo start · pnpm --filter api dev
                </p>
              </div>
              <div className="flex flex-shrink-0 flex-wrap gap-3">
                <Button variant="secondary" href="#pricing">View pricing</Button>
              <Link to="/listings/new">
                <Button size="lg">
                  Start listing ↗
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.04]">
        <div className="mx-auto w-full max-w-6xl px-6 py-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-violet-600 text-xs font-black text-white">RM</div>
              <div>
                <div className="text-sm font-bold text-white">Rent Mate</div>
                <div className="text-xs text-slate-600">© {new Date().getFullYear()} · MIT License</div>
              </div>
            </div>
            <div className="flex gap-6 text-xs text-slate-600">
              {['Privacy', 'Terms', 'Contributing', 'GitHub'].map((l) => (
                <a key={l} href="#" className="transition-colors hover:text-slate-300">{l}</a>
              ))}
            </div>
            <div className="font-mono text-xs text-slate-700">API: {API_BASE}</div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/listings" element={<ListingsPage />} />
      <Route path="/listings/new" element={<NewListingPage />} />
    </Routes>
  )
}



