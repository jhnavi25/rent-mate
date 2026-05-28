-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('renter', 'owner', 'admin');
CREATE TYPE "KycStatus" AS ENUM ('none', 'pending', 'verified', 'rejected');
CREATE TYPE "ListingStatus" AS ENUM ('draft', 'active', 'inactive');
CREATE TYPE "RentalStatus" AS ENUM ('draft', 'payment_pending', 'active', 'in_use', 'return_pending', 'deposit_hold', 'dispute_open', 'completed', 'cancelled');
CREATE TYPE "PaymentType" AS ENUM ('rental', 'deposit');
CREATE TYPE "PaymentStatus" AS ENUM ('pending', 'captured', 'refunded', 'failed');
CREATE TYPE "DisputeStatus" AS ENUM ('open', 'under_review', 'resolved');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "name" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'renter',
    "kyc_status" "KycStatus" NOT NULL DEFAULT 'none',
    "kyc_level" TEXT,
    "verified_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "otp_codes" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "phone" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "otp_codes_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "kyc_profiles" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "provider_ref" TEXT,
    "pan_number" TEXT,
    "aadhaar_masked" TEXT,
    "bank_account_last4" TEXT,
    "metadata" JSONB,
    "submitted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "kyc_profiles_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "listings" (
    "id" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "daily_price_paise" INTEGER NOT NULL,
    "deposit_paise" INTEGER NOT NULL,
    "category" TEXT,
    "city" TEXT,
    "status" "ListingStatus" NOT NULL DEFAULT 'draft',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "listings_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "listing_media" (
    "id" TEXT NOT NULL,
    "listing_id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "listing_media_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "rentals" (
    "id" TEXT NOT NULL,
    "listing_id" TEXT NOT NULL,
    "renter_id" TEXT NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "status" "RentalStatus" NOT NULL DEFAULT 'draft',
    "rental_fee_paise" INTEGER NOT NULL,
    "deposit_paise" INTEGER NOT NULL,
    "platform_fee_paise" INTEGER NOT NULL DEFAULT 0,
    "deposit_hold_until" TIMESTAMP(3),
    "handoff_confirmed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "rentals_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "rental_returns" (
    "id" TEXT NOT NULL,
    "rental_id" TEXT NOT NULL,
    "returned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "photos" TEXT[],
    "notes" TEXT,
    CONSTRAINT "rental_returns_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "rental_id" TEXT NOT NULL,
    "type" "PaymentType" NOT NULL,
    "amount_paise" INTEGER NOT NULL,
    "refunded_paise" INTEGER NOT NULL DEFAULT 0,
    "status" "PaymentStatus" NOT NULL DEFAULT 'pending',
    "razorpay_order_id" TEXT,
    "razorpay_payment_id" TEXT,
    "idempotency_key" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "payment_events" (
    "id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "payload_hash" TEXT NOT NULL,
    "processed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "payment_events_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ledger_entries" (
    "id" TEXT NOT NULL,
    "rental_id" TEXT,
    "payment_id" TEXT,
    "description" TEXT NOT NULL,
    "debit_paise" INTEGER NOT NULL DEFAULT 0,
    "credit_paise" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ledger_entries_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "disputes" (
    "id" TEXT NOT NULL,
    "rental_id" TEXT NOT NULL,
    "status" "DisputeStatus" NOT NULL DEFAULT 'open',
    "claimed_amount_paise" INTEGER NOT NULL,
    "resolution" TEXT,
    "resolved_amount_paise" INTEGER,
    "resolved_by_id" TEXT,
    "resolved_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "disputes_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "dispute_evidence" (
    "id" TEXT NOT NULL,
    "dispute_id" TEXT NOT NULL,
    "uploaded_by" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "dispute_evidence_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "rental_id" TEXT,
    "user_id" TEXT,
    "action" TEXT NOT NULL,
    "from_status" TEXT,
    "to_status" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");
CREATE UNIQUE INDEX "kyc_profiles_user_id_key" ON "kyc_profiles"("user_id");
CREATE UNIQUE INDEX "rental_returns_rental_id_key" ON "rental_returns"("rental_id");
CREATE UNIQUE INDEX "payments_razorpay_order_id_key" ON "payments"("razorpay_order_id");
CREATE UNIQUE INDEX "payments_razorpay_payment_id_key" ON "payments"("razorpay_payment_id");
CREATE UNIQUE INDEX "payments_idempotency_key_key" ON "payments"("idempotency_key");
CREATE UNIQUE INDEX "payment_events_event_id_key" ON "payment_events"("event_id");
CREATE UNIQUE INDEX "disputes_rental_id_key" ON "disputes"("rental_id");
CREATE INDEX "otp_codes_phone_code_idx" ON "otp_codes"("phone", "code");
CREATE INDEX "listings_status_city_idx" ON "listings"("status", "city");
CREATE INDEX "rentals_status_deposit_hold_until_idx" ON "rentals"("status", "deposit_hold_until");

-- AddForeignKey
ALTER TABLE "otp_codes" ADD CONSTRAINT "otp_codes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "kyc_profiles" ADD CONSTRAINT "kyc_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "listings" ADD CONSTRAINT "listings_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "listing_media" ADD CONSTRAINT "listing_media_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "rentals" ADD CONSTRAINT "rentals_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "rentals" ADD CONSTRAINT "rentals_renter_id_fkey" FOREIGN KEY ("renter_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "rental_returns" ADD CONSTRAINT "rental_returns_rental_id_fkey" FOREIGN KEY ("rental_id") REFERENCES "rentals"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "payments" ADD CONSTRAINT "payments_rental_id_fkey" FOREIGN KEY ("rental_id") REFERENCES "rentals"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "disputes" ADD CONSTRAINT "disputes_rental_id_fkey" FOREIGN KEY ("rental_id") REFERENCES "rentals"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "disputes" ADD CONSTRAINT "disputes_resolved_by_id_fkey" FOREIGN KEY ("resolved_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "dispute_evidence" ADD CONSTRAINT "dispute_evidence_dispute_id_fkey" FOREIGN KEY ("dispute_id") REFERENCES "disputes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "dispute_evidence" ADD CONSTRAINT "dispute_evidence_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_rental_id_fkey" FOREIGN KEY ("rental_id") REFERENCES "rentals"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
