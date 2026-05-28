# Rent Mate

Peer-to-peer rental marketplace (India). NestJS API, React Native mobile, PostgreSQL, Redis, Razorpay.

## Quick start

```bash
cp .env.example .env
npm run docker:up
npm install
npm run db:generate
npm run db:migrate
npm run api:dev
# separate terminal
npm run mobile:start
```

## Structure

- `apps/api` — NestJS backend + Prisma
- `apps/mobile` — Expo React Native app
- `packages/shared` — Enums and shared types
- `docs/SRS.md` — Requirements and policies

## API docs

Base URL: `http://localhost:3000`

Key flows: auth OTP → listings → rentals → checkout → handoff → return → deposit release / dispute.
