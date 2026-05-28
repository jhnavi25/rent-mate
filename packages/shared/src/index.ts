export enum UserRole {
  RENTER = 'renter',
  OWNER = 'owner',
  ADMIN = 'admin',
}

export enum KycStatus {
  NONE = 'none',
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
}

export enum ListingStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum RentalStatus {
  DRAFT = 'draft',
  PAYMENT_PENDING = 'payment_pending',
  ACTIVE = 'active',
  IN_USE = 'in_use',
  RETURN_PENDING = 'return_pending',
  DEPOSIT_HOLD = 'deposit_hold',
  DISPUTE_OPEN = 'dispute_open',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum PaymentType {
  RENTAL = 'rental',
  DEPOSIT = 'deposit',
}

export enum PaymentStatus {
  PENDING = 'pending',
  CAPTURED = 'captured',
  REFUNDED = 'refunded',
  FAILED = 'failed',
}

export enum DisputeStatus {
  OPEN = 'open',
  UNDER_REVIEW = 'under_review',
  RESOLVED = 'resolved',
}

export const RENTAL_TRANSITIONS: Record<RentalStatus, RentalStatus[]> = {
  [RentalStatus.DRAFT]: [RentalStatus.PAYMENT_PENDING, RentalStatus.CANCELLED],
  [RentalStatus.PAYMENT_PENDING]: [RentalStatus.ACTIVE, RentalStatus.CANCELLED],
  [RentalStatus.ACTIVE]: [RentalStatus.IN_USE, RentalStatus.CANCELLED],
  [RentalStatus.IN_USE]: [RentalStatus.RETURN_PENDING],
  [RentalStatus.RETURN_PENDING]: [RentalStatus.DEPOSIT_HOLD],
  [RentalStatus.DEPOSIT_HOLD]: [RentalStatus.COMPLETED, RentalStatus.DISPUTE_OPEN],
  [RentalStatus.DISPUTE_OPEN]: [RentalStatus.COMPLETED],
  [RentalStatus.COMPLETED]: [],
  [RentalStatus.CANCELLED]: [],
};

export function canTransition(from: RentalStatus, to: RentalStatus): boolean {
  return RENTAL_TRANSITIONS[from]?.includes(to) ?? false;
}
