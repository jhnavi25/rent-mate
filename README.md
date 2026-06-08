<div align="center">

# rent-mate

**A hyperlocal peer-to-peer rental marketplace**

Rent what you need. Earn from what you own.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![NSoC](https://img.shields.io/badge/NSoC-2025-purple.svg)]()

[Features](#features) · [Tech Stack](#tech-stack) · [Getting Started](#getting-started) · [Architecture](#architecture) · [Contributing](#contributing) · [Roadmap](#roadmap)

</div>

---

## What is Rentify?

People often need things temporarily — a camera for a trip, a gaming console for the weekend, a projector for a presentation — but can't justify buying them. At the same time, millions of owned items sit unused most of the time.

Rentify is a community-driven platform that connects the two. Users can list products for rent, browse nearby listings, send rental requests, and participate in live bidding — all backed by identity verification, escrow payments, and a trust system that keeps every transaction safe.

> Starting hyperlocal — built for college campuses and urban communities first.

---

## Features

### Core (MVP)
- **User auth** — email/phone OTP, social login, JWT session management
- **KYC verification** — Aadhaar/PAN + selfie face matching for verified badges
- **Product listings** — photos, availability calendar, pricing, pickup/delivery options
- **Rental requests** — date selection, owner accept/reject flow, automated reminders
- **Escrow payments** — Razorpay integration; funds held until rental completion
- **Security deposits** — dynamic deposit amounts, partial damage deductions
- **Real-time chat** — product discussions, delivery coordination, image sharing
- **Ratings & reviews** — mutual reviews after every rental, trust scores
- **Push notifications** — bid alerts, approvals, return reminders via FCM

### Coming Soon
- **Live bidding** — post a request, receive competing offers in real time
- **Delivery integration** — hyperlocal delivery partner support with live tracking
- **AI moderation** — fraud detection, fake listing identification, damage analysis
- **Smart recommendations** — personalized feed based on rental history

---

## Tech Stack

| Layer | Technology |
|---|---|
| Mobile app | React Native + Expo |
| Web app | Next.js |
| Backend | NestJS (Node.js + TypeScript) |
| Database | PostgreSQL |
| Cache / real-time | Redis + Socket.IO |
| File storage | AWS S3 |
| Payments | Razorpay |
| Auth | Clerk |
| Maps | Google Maps API |
| Push notifications | Firebase Cloud Messaging |
| Email | Resend |
| Monitoring | Sentry + PostHog |

---

## Architecture

```
┌─────────────────────────────────────────────┐
│              Client layer                    │
│  React Native app  │  Next.js  │  Admin UI  │
└──────────────┬──────────────────────────────┘
               │
┌──────────────▼──────────────────────────────┐
│         NestJS API gateway                   │
│      JWT auth · routing · rate limiting      │
└──┬──────────┬──────────┬──────────┬─────────┘
   │          │          │          │
┌──▼──┐  ┌───▼──┐  ┌────▼──┐  ┌───▼─────┐
│ Listings│ Rentals│ Payments│  │ Chat/Bids│
└──────┘  └───────┘  └───────┘  └──────────┘
               │
┌──────────────▼──────────────────────────────┐
│              Data layer                      │
│  PostgreSQL  │  Redis  │  S3  │  Socket.IO  │
└─────────────────────────────────────────────┘
```

---

## Getting Started

### Prerequisites

- Node.js >= 18
- PostgreSQL >= 15
- Redis >= 7
- pnpm (recommended)

### 1. Clone the repo

```bash
git clone https://github.com/your-org/rentify.git
cd rentify
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Set up environment variables

```bash
cp .env.example .env
```

Fill in your credentials in `.env`:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/rentify

# Redis
REDIS_URL=redis://localhost:6379

# Auth (Clerk)
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=

# Payments (Razorpay)
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

# Storage (AWS S3)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_S3_BUCKET=

# Maps
GOOGLE_MAPS_API_KEY=

# Firebase (push notifications)
FIREBASE_PROJECT_ID=
FIREBASE_PRIVATE_KEY=
FIREBASE_CLIENT_EMAIL=

# Email (Resend)
RESEND_API_KEY=
```

### 4. Run database migrations

```bash
pnpm db:migrate
```

### 5. Start development servers

```bash
# Backend API
pnpm --filter api dev

# Web app
pnpm --filter web dev

# Mobile app
pnpm --filter mobile start
```

The API runs at `http://localhost:3001`, the web app at `http://localhost:3000`.

---

## Project Structure

```
rentify/
├── apps/
│   ├── api/          # NestJS backend
│   ├── web/          # Next.js web app
│   └── mobile/       # React Native app
├── packages/
│   ├── ui/           # Shared component library
│   ├── types/        # Shared TypeScript types
│   └── config/       # Shared configs (eslint, tsconfig)
├── docs/             # Additional documentation
└── .github/
    └── workflows/    # CI/CD pipelines
```

---

## Contributing

We welcome contributions of all sizes — from fixing typos to building entire features.

### Good first issues

These are beginner-friendly and well-scoped:

- [ ] Auth flow screens (login, signup, OTP)
- [ ] Product listing CRUD
- [ ] Availability calendar component
- [ ] Ratings and review UI
- [ ] Notification service
- [ ] Admin dashboard skeleton
- [ ] Razorpay webhook handlers
- [ ] Mobile home screen and search UI

Browse all open issues → [github.com/your-org/rentify/issues](https://github.com/your-org/rentify/issues)

### How to contribute

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Make your changes and write tests where applicable
4. Commit using [Conventional Commits](https://www.conventionalcommits.org/): `git commit -m "feat: add availability calendar"`
5. Push and open a pull request against `main`

Please read [CONTRIBUTING.md](CONTRIBUTING.md) before submitting a PR.

---

## Roadmap

| Phase | Duration | Goals |
|---|---|---|
| **Phase 1 — Validation** | 2–4 weeks | UI prototypes, user interviews, landing page |
| **Phase 2 — MVP** | 2–3 months | Auth, listings, payments, chat, ratings — launch at one college |
| **Phase 3 — Growth** | 4–8 months | Live bidding, delivery system, AI moderation |
| **Phase 4 — Scale** | Ongoing | Insurance, subscriptions, multi-city, business rentals |

---

## License

MIT © Rentify Contributors

---

<div align="center">

Built with contributors from the open source community · Part of Nexus Spring of Code 2025

</div>
