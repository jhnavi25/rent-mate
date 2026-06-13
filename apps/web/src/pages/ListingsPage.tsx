import { useState, useEffect } from "react";

interface Listing {
  id: number;
  title: string;
  category: string;
  price: number;
  location: string;
  image?: string;
  available: boolean;
}

const MOCK_LISTINGS: Listing[] = [
  { id: 1, title: "Mountain Bike", category: "Sports", price: 150, location: "Delhi", available: true },
  { id: 2, title: "DSLR Camera", category: "Electronics", price: 500, location: "Mumbai", available: true },
  { id: 3, title: "Camping Tent", category: "Outdoor", price: 200, location: "Bangalore", available: false },
  { id: 4, title: "Power Drill", category: "Tools", price: 100, location: "Pune", available: true },
  { id: 5, title: "Acoustic Guitar", category: "Music", price: 250, location: "Chennai", available: true },
  { id: 6, title: "Projector", category: "Electronics", price: 800, location: "Hyderabad", available: false },
];

const CATEGORIES = ["All", "Electronics", "Sports", "Outdoor", "Tools", "Music"];

export default function ListingsPage() {
  const [listings, setListings] = useState<Listing[]>(MOCK_LISTINGS);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    let filtered = MOCK_LISTINGS;
    if (category !== "All") filtered = filtered.filter((l) => l.category === category);
    if (search) filtered = filtered.filter((l) =>
      l.title.toLowerCase().includes(search.toLowerCase()) ||
      l.location.toLowerCase().includes(search.toLowerCase())
    );
    setListings(filtered);
  }, [search, category]);

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Browse Listings</h1>
          <p className="text-slate-400 mt-1">Rent items near you</p>
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            placeholder="Search by name or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 p-3 rounded-lg bg-slate-800 text-white outline-none placeholder-slate-500"
          />
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  category === cat
                    ? "bg-blue-600 text-white"
                    : "bg-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {listings.length === 0 ? (
          <div className="text-center py-20 text-slate-500">No listings found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {listings.map((item) => (
              <div key={item.id} className="bg-slate-900 rounded-xl p-5 flex flex-col gap-3 hover:ring-1 hover:ring-blue-600 transition">
                {/* Placeholder image */}
                <div className="w-full h-36 bg-slate-800 rounded-lg flex items-center justify-center text-4xl">
                  {item.category === "Electronics" ? "??" :
                   item.category === "Sports" ? "??" :
                   item.category === "Outdoor" ? "?" :
                   item.category === "Tools" ? "??" : "??"}
                </div>

                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-white font-semibold">{item.title}</h3>
                    <p className="text-slate-400 text-sm">{item.location}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${item.available ? "bg-green-900 text-green-400" : "bg-red-900 text-red-400"}`}>
                    {item.available ? "Available" : "Rented"}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-auto">
                  <span className="text-blue-400 font-bold">?{item.price}<span className="text-slate-500 font-normal text-sm">/day</span></span>
                  <button
                    disabled={!item.available}
                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${
                      item.available
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-slate-700 text-slate-500 cursor-not-allowed"
                    }`}
                  >
                    {item.available ? "Rent Now" : "Unavailable"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
