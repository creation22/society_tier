/**
 * Society catalogue — names and core facts only.
 * No ratings, reviews or accounts are seeded; all live content comes from
 * real users.
 */

// Deterministic RNG so seeds are reproducible.
function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(1337);

const SOCIETIES = [
  // ── Golf Course Road ──────────────────────────────────────────────
  { name: 'DLF Magnolias', builder: 'DLF', sector: 'Sector 42', area: 'Golf Course Road', lat: 28.4628, lng: 77.0972, pricePerSqft: 18500, bhk: [3, 4, 5] },
  { name: 'DLF Aralias', builder: 'DLF', sector: 'Sector 42', area: 'Golf Course Road', lat: 28.4615, lng: 77.0958, pricePerSqft: 21000, bhk: [4, 5] },
  { name: 'DLF Park Place', builder: 'DLF', sector: 'Sector 54', area: 'Golf Course Road', lat: 28.4752, lng: 77.1015, pricePerSqft: 15200, bhk: [3, 4] },
  { name: 'DLF Belaire', builder: 'DLF', sector: 'Sector 54', area: 'Golf Course Road', lat: 28.4741, lng: 77.1030, pricePerSqft: 14100, bhk: [3, 4] },
  { name: 'Ambience Creacions', builder: 'Ambience', sector: 'Sector 43', area: 'Golf Course Road', lat: 28.4701, lng: 77.0988, pricePerSqft: 13800, bhk: [2, 3, 4] },

  // ── Golf Course Extension ─────────────────────────────────────────
  { name: 'IREO Skyon', builder: 'IREO', sector: 'Sector 60', area: 'Golf Course Extension', lat: 28.4318, lng: 77.1005, pricePerSqft: 11200, bhk: [2, 3, 4] },
  { name: 'IREO Victory Valley', builder: 'IREO', sector: 'Sector 59', area: 'Golf Course Extension', lat: 28.4262, lng: 77.0989, pricePerSqft: 10400, bhk: [2, 3, 4] },
  { name: 'M3M Merlin', builder: 'M3M', sector: 'Sector 67', area: 'Golf Course Extension', lat: 28.4152, lng: 77.0952, pricePerSqft: 10900, bhk: [2, 3, 4] },
  { name: 'M3M Golf Estate', builder: 'M3M', sector: 'Sector 65', area: 'Golf Course Extension', lat: 28.4205, lng: 77.0938, pricePerSqft: 11500, bhk: [3, 4] },
  { name: 'Tulip Violet', builder: 'Tulip', sector: 'Sector 69', area: 'Golf Course Extension', lat: 28.4088, lng: 77.0912, pricePerSqft: 7600, bhk: [2, 3] },

  // ── Dwarka Expressway ─────────────────────────────────────────────
  { name: 'Sobha City', builder: 'Sobha', sector: 'Sector 108', area: 'Dwarka Expressway', lat: 28.5005, lng: 76.9930, pricePerSqft: 9800, bhk: [2, 3, 4] },
  { name: 'Godrej Aria', builder: 'Godrej', sector: 'Sector 79', area: 'Dwarka Expressway', lat: 28.4210, lng: 76.9610, pricePerSqft: 8700, bhk: [2, 3] },
  { name: 'Adani Samsara', builder: 'Adani', sector: 'Sector 102', area: 'Dwarka Expressway', lat: 28.4980, lng: 76.9820, pricePerSqft: 9200, bhk: [3, 4] },
  { name: 'Shapoorji Pallonji Joyville', builder: 'Shapoorji Pallonji', sector: 'Sector 102', area: 'Dwarka Expressway', lat: 28.4965, lng: 76.9790, pricePerSqft: 7200, bhk: [2, 3] },

  // ── New Gurgaon ───────────────────────────────────────────────────
  { name: 'DLF The Ultima', builder: 'DLF', sector: 'Sector 81', area: 'New Gurgaon', lat: 28.4008, lng: 76.9522, pricePerSqft: 9600, bhk: [3, 4] },
  { name: 'Godrej Icon', builder: 'Godrej', sector: 'Sector 88B', area: 'New Gurgaon', lat: 28.3855, lng: 76.9352, pricePerSqft: 7800, bhk: [2, 3, 4] },
  { name: 'Emaar Palm Gardens', builder: 'Emaar', sector: 'Sector 83', area: 'New Gurgaon', lat: 28.3985, lng: 76.9400, pricePerSqft: 7400, bhk: [2, 3] },
  { name: 'Raheja Vedaanta', builder: 'Raheja', sector: 'Sector 108', area: 'New Gurgaon', lat: 28.4890, lng: 76.9680, pricePerSqft: 6200, bhk: [2, 3] },

  // ── Sohna Road ────────────────────────────────────────────────────
  { name: 'Vatika City', builder: 'Vatika', sector: 'Sector 49', area: 'Sohna Road', lat: 28.4182, lng: 77.0618, pricePerSqft: 8100, bhk: [2, 3, 4] },
  { name: 'Central Park II', builder: 'Central Park', sector: 'Sector 48', area: 'Sohna Road', lat: 28.4215, lng: 77.0648, pricePerSqft: 10200, bhk: [3, 4] },
  { name: 'Uniworld Gardens', builder: 'Unitech', sector: 'Sector 47', area: 'Sohna Road', lat: 28.4252, lng: 77.0665, pricePerSqft: 7900, bhk: [2, 3] },
  { name: 'Nirvana Country', builder: 'Unitech', sector: 'Sector 50', area: 'Sohna Road', lat: 28.4148, lng: 77.0592, pricePerSqft: 8800, bhk: [3, 4] },

  // ── Central Gurgaon ───────────────────────────────────────────────
  { name: 'Heritage City', builder: 'DLF', sector: 'Sector 25', area: 'Central Gurgaon', lat: 28.4782, lng: 77.0838, pricePerSqft: 12500, bhk: [3, 4] },
  { name: 'Hamilton Court', builder: 'DLF', sector: 'Sector 43', area: 'Central Gurgaon', lat: 28.4695, lng: 77.0912, pricePerSqft: 13100, bhk: [3, 4] },
  { name: 'Park View Spa', builder: 'Bestech', sector: 'Sector 57', area: 'Central Gurgaon', lat: 28.4452, lng: 77.0812, pricePerSqft: 9400, bhk: [3, 4] },
  { name: 'Hong Kong Garden', builder: 'Ansals', sector: 'Sector 46', area: 'Central Gurgaon', lat: 28.4332, lng: 77.0712, pricePerSqft: 6800, bhk: [2, 3] }
];

module.exports = { SOCIETIES };
