# Rent Mate — Software Requirements Specification

## 1. Overview

Rent Mate is a peer-to-peer rental marketplace for India. Users list items, book rentals at fixed prices, pay via Razorpay, and resolve deposit disputes through platform ops.

**Tech stack:** NestJS, PostgreSQL, Redis, React Native, Razorpay, FCM.

## 2. Phased roadmap

| Phase | Scope |
|-------|--------|
| 0 — Foundation | Monorepo, auth (OTP), listing CRUD, DB migrations |
| 1 — MVP | Fixed-price booking, Razorpay, rental lifecycle, KYC gates, deposit auto-release |
| 2 — Trust & ops | Disputes UI, admin review, ledger, owner payouts (Route) |
| 3 — Growth | **Live bidding** (Socket.IO + Redis), ratings, referrals |

**Live bidding is Phase 3**, not Phase 2. Phase 2 may include async "make offer" without sockets.

## 3. KYC gates

| Action | KYC required |
|--------|----------------|
| Browse / search | No |
| Favorites / chat | No |
| **Create listing** | Yes — PAN + bank (owner) |
| **First checkout (renter)** | Yes — Aadhaar OTP or equivalent |
| Payout / withdraw | Yes |

Store `kyc_status` on user. Block `POST /listings` and `POST /rentals/:id/checkout` until `verified`.

## 4. Rental lifecycle

States: `draft` → `payment_pending` → `active` → `in_use` → `return_pending` → `deposit_hold` → `completed` | `dispute_open` → `completed` | `cancelled`.

1. Discover → book → pay (Razorpay) → active  
2. Handoff (both confirm) → in_use  
3. Renter marks returned → return_pending → deposit_hold (inspection window)  
4. No claim by deadline → auto-release deposit → completed  
5. Owner claim → dispute_open → ops resolution → partial/full deposit refund → completed  

## 5. Payments & escrow (Razorpay)

- No native escrow: platform state machine + separate **rental** and **deposit** payment records.
- Webhooks (`payment.captured`, `refund.processed`) are source of truth.
- Partial damage deduction refunds **only** from deposit payment id.
- Idempotency keys + webhook dedup table.

## 6. Deposit dispute policy

| Rule | Default |
|------|---------|
| Inspection window | 72 hours after renter marks returned |
| Claim deadline | End of inspection window |
| Evidence | Timestamped photos (pickup + return) |
| Arbitration | Platform ops review queue |
| Auto-release | Cron if no claim by `deposit_hold_until` |
| Max deduction | min(claimed_amount, deposit_captured) |

## 7. Live bidding (Phase 3)

- Redis ZSET `auction:{id}` for bid ranking; API worker is sole writer.
- Socket.IO broadcasts read-only events only.
- Rate limits per user in Redis.

## 8. Open decisions

1. Owner payout: Razorpay Route vs manual (MVP: manual flag in admin).  
2. Dual Razorpay orders for rental + deposit (recommended).  
3. Platform fee: 10% of rental fee at payout.  
4. Inspection window: 72h (configurable via env).
