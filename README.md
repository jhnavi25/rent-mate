<h3 align="center"> 🌸 Nexus Spring of Code Project </h3>

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%">

<div align="center">

# rent-mate

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%">

**A hyperlocal peer-to-peer rental marketplace**

Rent what you need. Earn from what you own.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![NSoC](https://img.shields.io/badge/NSoC-2026-purple.svg)]()

[Features](#features) · [Tech Stack](#tech-stack) · [Getting Started](#getting-started) · [Architecture](#architecture) · [Contributing](#contributing) · [Roadmap](#roadmap)

</div>

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%">

## 📊 Project Insights

<table align="center">
    <thead align="center">
        <tr>
            <td><b>🌟 Stars</b></td>
            <td><b>🛠️ Languages</b></td>
            <td><b>👥 Contributors</b></td>
        </tr>
     </thead>
    <tbody>
         <tr>
            <td><img alt="Stars" src="https://img.shields.io/github/stars/AYUSHDAS0601/rent-mate?style=flat&logo=github"/></td>
            <td><img alt="Languages Count" src="https://img.shields.io/github/languages/count/AYUSHDAS0601/rent-mate?style=flat&color=green&logo=github"></td>
            <td><img alt="Contributors Count" src="https://img.shields.io/github/contributors/AYUSHDAS0601/rent-mate?style=flat&color=blue&logo=github"/></td>
        </tr>
    </tbody>
</table>

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%">

## What is rent-mate?

People often need things temporarily — a camera for a trip, a gaming console for the weekend, a projector for a presentation — but can't justify buying them. At the same time, millions of owned items sit unused most of the time.

Rentify is a community-driven platform that connects the two. Users can list products for rent, browse nearby listings, send rental requests, and participate in live bidding — all backed by identity verification, escrow payments, and a trust system that keeps every transaction safe.

> Starting hyperlocal — built for college campuses and urban communities first.

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%">

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

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%">

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

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%">

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

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%">

## Getting Started

### Prerequisites

- Node.js >= 18
- PostgreSQL >= 15
- Redis >= 7
- pnpm (recommended)

### 1. Clone the repo

```bash
git clone https://github.com/your-org/rentify.git
cd rent-mate
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

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%">

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

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%">

🌟 **Exciting News...**

🚀 This project is now an official part of Nexus Spring of Code - NSoC'26! 💃🎉💻 We're thrilled to welcome contributors from all over India and beyond to collaborate, build, and grow *rent-mate!* Let’s make learning and career development smarter – together! 🌟👨‍💻👩‍💻

👩‍💻 NSoC is one of India’s **largest 60-day open source program** that encourages developers of all levels to contribute to real-world projects 🌍 while learning, collaborating, and growing together. 🌱

🌈 With **mentorship, community support**, and **collaborative coding**, it's the perfect platform for developers to:

- ✨ Improve their skills
- 🤝 Contribute to impactful projects
- 🏆 Get recognized for their work
- 📜 Receive certificates and swag!

🎉 **I can’t wait to welcome new contributors** from NSoC'26 to this rent-mate project family! Let's build, learn, and grow together — one commit at a time. 🔥👨‍💻👩‍💻

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%">

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

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%">

## Roadmap

| Phase | Duration | Goals |
|---|---|---|
| **Phase 1 — Validation** | 2–4 weeks | UI prototypes, user interviews, landing page |
| **Phase 2 — MVP** | 2–3 months | Auth, listings, payments, chat, ratings — launch at one college |
| **Phase 3 — Growth** | 4–8 months | Live bidding, delivery system, AI moderation |
| **Phase 4 — Scale** | Ongoing | Insurance, subscriptions, multi-city, business rentals |

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%">

<h2 id="featured-in"> 🏆 Featured In: </h2>

<table>
<tr>
      <th>Event Name</th>
      <th>Event Description</th>
    </tr>
    <tr>
        <td>Nexus Spring of Code 2026</td>
        <td>A 60-day open source program where project maintainers bring real-world projects, and contributors work on solving actual issues, building features, and shipping production-ready code.</td> 
    </tr>
   <tr>
</table>

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%">

<h2 id="contact">📞 Contact</h2>

- **GitHub Issues**: [Report bugs or request features](https://github.com/AYUSHDAS0601/rent-mate/issues)

- **Email**: Contact the maintainers for collaboration opportunities

*Feel free to reach out with any questions or feedback!*

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%">

<h2 id="code-of-conduct">📜 Code of Conduct</h2>

Please refer to the [`Code of Conduct`](https://github.com/AYUSHDAS0601/rent-mate/blob/main/docs/CODEOFCONDUCT.md) for details on contributing guidelines and community standards.

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%">

<h2 id="contribution-guidelines">🤝👤 Contribution Guidelines</h2>

We love our contributors! If you'd like to help, please check out our [`CONTRIBUTING.md`](https://github.com/AYUSHDAS0601/rent-mate/blob/main/docs/CONTRIBUTING.md) file for guidelines.

>Thank you once again to all our contributors who has contributed to **rent-mate!** Your efforts are truly appreciated. 💖👏

<!-- Contributors avatars (auto-updating) -->
<p align="left">
  <a href="https://github.com/AYUSHDAS0601/rent-mate/graphs/contributors">
    <img src="https://contrib.rocks/image?repo=AYUSHDAS0601/rent-mate" alt="Contributors" />
  </a>
</p>

See the full list of contributors and their contributions on the [`GitHub Contributors Graph`](https://github.com/AYUSHDAS0601/rent-mate/graphs/contributors).

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%">

<h2 align="center">
<p style="font-family:var(--ff-philosopher);font-size:3rem;"><b> Show some <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Red%20Heart.png" alt="Red Heart" width="40" height="40" /> by starring this awesome repository!
</p>
</h2>

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%">

<h2 id="suggestions-feedback">💡 Suggestions & Feedback</h2>

Feel free to open issues or discussions if you have any feedback, feature suggestions, or want to collaborate!

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%">

<h2 id="show-your-support">🙌 Show Your Support</h2>

*If you find rent-mate project helpful, give it a star! ⭐ to support more such educational initiatives:*

- ⭐ **Starring the repository**
- 🐦 **Sharing on social media**
- 💬 **Telling your friends and colleagues**
- 🤝 **Contributing to the project**

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%">

<h2 id="license">📄 License</h2>

This project is licensed under the MIT License - see the [`License`](https://github.com/AYUSHDAS0601/rent-mate/blob/main/docs/LICENSE.md) file for details.

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%">

<h2 id="project-admin" align="center">🧑‍💻Project Admin:</h2>
<table>
<tr>
<td align="center">
<a href="https://github.com/AYUSHDAS0601/rent-mate"><img src="https://avatars.githubusercontent.com/u/101057653?v=4" height="140px" width="140px" alt="Ayush Das"></a><br><sub><b>AYUSH DAS</b><br>
</td>
</tr>
</table>

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%">

<h1 align="center"><img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Glowing%20Star.png" alt="Glowing Star" width="25" height="25" /> Give us a Star and let's make magic! <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Glowing%20Star.png" alt="Glowing Star" width="25" height="25" /></h1>

<p align="center">
     <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Mirror%20Ball.png" alt="Mirror Ball" width="150" height="150" />
</p>

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%">

<h3 align="center"> 👨‍💻 Built with ❤️ by rent-mate Team</h3>
<h4 align="center"> ❤️ AYUSH DAS and Contributors ❤️ </h4>
<p align="center">
<a href="https://github.com/AYUSHDAS0601/rent-mate/issues">Open an Issue</a> | <a href="https://github.com/AYUSHDAS0601/rent-mate">🌟 Star on GitHub</a> </p>

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&height=65&section=footer"/>

<p align="center">
  <a href="#top" style="font-size: 18px; padding: 8px 16px; display: inline-block; border: 1px solid #ccc; border-radius: 6px; text-decoration: none;">
    ⬆️ Back to Top
  </a>
</p>

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%">

> Ready to show off your coding achievements? Get started with **rent-mate** today! 🚀