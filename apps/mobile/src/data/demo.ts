export interface DemoListing {
  id: string;
  title: string;
  description: string;
  dailyPricePaise: number;
  depositPaise: number;
  city: string;
  category: string;
  imageUrl: string;
  accent: string;
  rating: number;
  reviews: number;
  ownerName: string;
  verified: boolean;
  distanceKm: number;
  tags: string[];
}

export interface DemoRental {
  id: string;
  status: string;
  startDate: string;
  endDate: string;
  rentalFeePaise: number;
  depositPaise: number;
  listing: {
    title: string;
    imageUrl: string;
    category: string;
    city: string;
  };
}

export const CATEGORIES = [
  { id: 'all', label: 'All', emoji: '✨' },
  { id: 'cameras', label: 'Cameras', emoji: '📷' },
  { id: 'gaming', label: 'Gaming', emoji: '🎮' },
  { id: 'outdoors', label: 'Outdoors', emoji: '🏕️' },
  { id: 'tools', label: 'Tools', emoji: '🔧' },
  { id: 'music', label: 'Music', emoji: '🎸' },
  { id: 'mobility', label: 'Mobility', emoji: '🚲' },
];

export const DEMO_LISTINGS: DemoListing[] = [
  {
    id: 'demo-1',
    title: 'Sony A7 IV + 24-70mm Lens Kit',
    description:
      'Professional mirrorless setup with extra battery, 64GB card, and padded carry case. Perfect for weddings and travel shoots.',
    dailyPricePaise: 149900,
    depositPaise: 2500000,
    city: 'Mumbai',
    category: 'cameras',
    imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80',
    accent: '#7C5CFF',
    rating: 4.9,
    reviews: 38,
    ownerName: 'Arjun M.',
    verified: true,
    distanceKm: 2.4,
    tags: ['Pro gear', 'Insurance included'],
  },
  {
    id: 'demo-2',
    title: 'PlayStation 5 + 2 Controllers',
    description:
      'Weekend gaming bundle with FIFA 25 and Spider-Man 2. HDMI cable and stand included. Pickup from Bandra West.',
    dailyPricePaise: 79900,
    depositPaise: 1200000,
    city: 'Mumbai',
    category: 'gaming',
    imageUrl: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e9?w=800&q=80',
    accent: '#38BDF8',
    rating: 4.8,
    reviews: 52,
    ownerName: 'Priya K.',
    verified: true,
    distanceKm: 4.1,
    tags: ['Same-day pickup', '2 games free'],
  },
  {
    id: 'demo-3',
    title: '4-Person Camping Tent + Stove',
    description:
      'Waterproof tent, sleeping mats, portable stove, and LED lantern. Ideal for Lonavala or Alibaug trips.',
    dailyPricePaise: 49900,
    depositPaise: 800000,
    city: 'Pune',
    category: 'outdoors',
    imageUrl: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&q=80',
    accent: '#22D3A6',
    rating: 4.7,
    reviews: 21,
    ownerName: 'Rohan S.',
    verified: true,
    distanceKm: 6.8,
    tags: ['Weekend ready', 'Cleaned after each trip'],
  },
  {
    id: 'demo-4',
    title: 'Bosch Professional Drill Set',
    description:
      '18V cordless drill with 32-bit set, level, and toolbox. Great for home fixes and small renovations.',
    dailyPricePaise: 34900,
    depositPaise: 500000,
    city: 'Bengaluru',
    category: 'tools',
    imageUrl: 'https://images.unsplash.com/photo-1504141935-507943e233b2?w=800&q=80',
    accent: '#FBBF24',
    rating: 4.6,
    reviews: 17,
    ownerName: 'Vikram D.',
    verified: false,
    distanceKm: 3.2,
    tags: ['Deposit refundable', 'ID verified owner'],
  },
  {
    id: 'demo-5',
    title: 'Fender Acoustic Guitar (Cutaway)',
    description:
      'Well-maintained acoustic with soft case, capo, and spare strings. Suited for gigs and studio sessions.',
    dailyPricePaise: 39900,
    depositPaise: 600000,
    city: 'Delhi',
    category: 'music',
    imageUrl: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800&q=80',
    accent: '#FF5C7A',
    rating: 5.0,
    reviews: 12,
    ownerName: 'Ananya R.',
    verified: true,
    distanceKm: 8.5,
    tags: ['Studio quality', 'Flexible return window'],
  },
  {
    id: 'demo-6',
    title: 'Hero Lectro E-Cycle (City)',
    description:
      'Electric cycle with 40km range, charger, and helmet. Explore your city without fuel costs.',
    dailyPricePaise: 59900,
    depositPaise: 1500000,
    city: 'Hyderabad',
    category: 'mobility',
    imageUrl: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&q=80',
    accent: '#A78BFA',
    rating: 4.5,
    reviews: 29,
    ownerName: 'Karthik N.',
    verified: true,
    distanceKm: 5.0,
    tags: ['Helmet included', 'Battery 90%+'],
  },
];

export const DEMO_RENTALS: DemoRental[] = [
  {
    id: 'demo-rental-1',
    status: 'in_use',
    startDate: '2026-06-05',
    endDate: '2026-06-08',
    rentalFeePaise: 239700,
    depositPaise: 1200000,
    listing: {
      title: 'PlayStation 5 + 2 Controllers',
      imageUrl: DEMO_LISTINGS[1].imageUrl,
      category: 'gaming',
      city: 'Mumbai',
    },
  },
  {
    id: 'demo-rental-2',
    status: 'deposit_hold',
    startDate: '2026-05-28',
    endDate: '2026-05-31',
    rentalFeePaise: 149700,
    depositPaise: 2500000,
    listing: {
      title: 'Sony A7 IV + 24-70mm Lens Kit',
      imageUrl: DEMO_LISTINGS[0].imageUrl,
      category: 'cameras',
      city: 'Mumbai',
    },
  },
  {
    id: 'demo-rental-3',
    status: 'completed',
    startDate: '2026-05-10',
    endDate: '2026-05-12',
    rentalFeePaise: 99800,
    depositPaise: 800000,
    listing: {
      title: '4-Person Camping Tent + Stove',
      imageUrl: DEMO_LISTINGS[2].imageUrl,
      category: 'outdoors',
      city: 'Pune',
    },
  },
];

export function getDemoListing(id: string): DemoListing | undefined {
  return DEMO_LISTINGS.find((l) => l.id === id);
}

export function getDemoRental(id: string): DemoRental | undefined {
  return DEMO_RENTALS.find((r) => r.id === id);
}
