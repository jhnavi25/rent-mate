import { useCallback, useEffect, useState } from 'react';
import { api } from '../api/client';
import { DEMO_LISTINGS, DemoListing } from '../data/demo';

function enrichListing(raw: Partial<DemoListing> & { id: string; title: string }): DemoListing {
  const demo = DEMO_LISTINGS.find((d) => d.id === raw.id);
  if (demo) return demo;

  return {
    id: raw.id,
    title: raw.title,
    description: raw.description ?? 'Peer-to-peer rental item on Rent Mate.',
    dailyPricePaise: raw.dailyPricePaise ?? 0,
    depositPaise: raw.depositPaise ?? 0,
    city: raw.city ?? 'India',
    category: raw.category ?? 'tools',
    imageUrl:
      raw.imageUrl ??
      'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80',
    accent: '#7C5CFF',
    rating: 4.6,
    reviews: 8,
    ownerName: 'Community member',
    verified: true,
    distanceKm: 3.5,
    tags: ['KYC verified', 'Deposit protected'],
  };
}

export function useListings() {
  const [listings, setListings] = useState<DemoListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [demoMode, setDemoMode] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api<Partial<DemoListing>[]>('/listings');
      if (data.length === 0) {
        setListings(DEMO_LISTINGS);
        setDemoMode(true);
      } else {
        setListings(data.map((item) => enrichListing(item as Parameters<typeof enrichListing>[0])));
        setDemoMode(false);
      }
    } catch {
      setListings(DEMO_LISTINGS);
      setDemoMode(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { listings, loading, demoMode, refresh: load };
}

export async function fetchListing(id: string): Promise<{ listing: DemoListing; demoMode: boolean }> {
  if (id.startsWith('demo-')) {
    const demo = DEMO_LISTINGS.find((l) => l.id === id);
    if (demo) return { listing: demo, demoMode: true };
  }

  try {
    const raw = await api<Partial<DemoListing> & { id: string; title: string }>(`/listings/${id}`);
    return { listing: enrichListing(raw), demoMode: false };
  } catch {
    const demo = DEMO_LISTINGS.find((l) => l.id === id) ?? DEMO_LISTINGS[0];
    return { listing: demo, demoMode: true };
  }
}
