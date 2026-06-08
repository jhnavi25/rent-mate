import { useCallback, useEffect, useState } from 'react';
import { api } from '../api/client';
import { DEMO_RENTALS, DemoRental } from '../data/demo';

function enrichRental(raw: Partial<DemoRental> & { id: string; status: string }): DemoRental {
  const demo = DEMO_RENTALS.find((r) => r.id === raw.id);
  if (demo) return demo;

  return {
    id: raw.id,
    status: raw.status,
    startDate: raw.startDate ?? new Date().toISOString().slice(0, 10),
    endDate: raw.endDate ?? new Date().toISOString().slice(0, 10),
    rentalFeePaise: raw.rentalFeePaise ?? 0,
    depositPaise: raw.depositPaise ?? 0,
    listing: {
      title: raw.listing?.title ?? 'Rental item',
      imageUrl:
        raw.listing?.imageUrl ??
        'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80',
      category: raw.listing?.category ?? 'tools',
      city: raw.listing?.city ?? 'India',
    },
  };
}

export function useRentals() {
  const [rentals, setRentals] = useState<DemoRental[]>([]);
  const [loading, setLoading] = useState(true);
  const [demoMode, setDemoMode] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api<Partial<DemoRental>[]>('/rentals/mine');
      if (data.length === 0) {
        setRentals(DEMO_RENTALS);
        setDemoMode(true);
      } else {
        setRentals(data.map((item) => enrichRental(item as Parameters<typeof enrichRental>[0])));
        setDemoMode(false);
      }
    } catch {
      setRentals(DEMO_RENTALS);
      setDemoMode(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { rentals, loading, demoMode, refresh: load };
}

export async function fetchRental(id: string): Promise<{ rental: DemoRental & {
  depositHoldUntil?: string;
  dispute?: { status: string; claimedAmountPaise: number } | null;
  listing: DemoRental['listing'] & { ownerId?: string };
}; demoMode: boolean }> {
  if (id.startsWith('demo-')) {
    const demo = DEMO_RENTALS.find((r) => r.id === id);
    if (demo) {
      return {
        rental: {
          ...demo,
          depositHoldUntil: demo.status === 'deposit_hold' ? '2026-06-10T18:30:00Z' : undefined,
          dispute: demo.status === 'deposit_hold' ? null : undefined,
        },
        demoMode: true,
      };
    }
  }

  try {
    const raw = await api<DemoRental & {
      depositHoldUntil?: string;
      dispute?: { status: string; claimedAmountPaise: number } | null;
      listing: DemoRental['listing'] & { ownerId?: string };
    }>(`/rentals/${id}`);
    return { rental: enrichRental(raw) as typeof raw, demoMode: false };
  } catch {
    const demo = DEMO_RENTALS.find((r) => r.id === id) ?? DEMO_RENTALS[0];
    return {
      rental: {
        ...demo,
        depositHoldUntil: demo.status === 'deposit_hold' ? '2026-06-10T18:30:00Z' : undefined,
        dispute: null,
      },
      demoMode: true,
    };
  }
}
