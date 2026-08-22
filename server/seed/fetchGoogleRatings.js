/**
 * Fetches real Google review ratings for every society via the official
 * Places API (New) and stores ONE rating entry per society from a dedicated
 * system account (replaces the old baseline estimates).
 *
 * Google's 1-5 star scale is converted to the app's 1-10 scale (x2).
 *
 * Requires PLACES_API_KEY in server/.env (a Google key with Places API New
 * enabled). Run: node seed/fetchGoogleRatings.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const User = require('../src/models/User');
const Society = require('../src/models/Society');
const Rating = require('../src/models/Rating');
const { recomputeAll } = require('../src/services/ratingService');

const PARAMS = [
  'location', 'connectivity', 'maintenance', 'amenities', 'safety',
  'cleanliness', 'valueForMoney', 'parking', 'community', 'noise'
];

// Deterministic tiny per-param offsets so profiles aren't perfectly flat.
function offsetsFor(slug) {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  return PARAMS.map((p, i) => (((h >> i) % 9) - 4) / 10); // -0.4 .. +0.4
}

const clamp = (v) => Math.max(1, Math.min(10, Math.round(v * 10) / 10));

// Reputation-based fallbacks for societies that exist on Google Maps but
// have no reviews yet (no rating field). Same scale as the old baselines.
const FALLBACKS = {
  'central-park-ii': 7.5,
  'godrej-aria': 7.2,
  'heritage-city': 6.9,
  'nirvana-country': 7.7,
  'park-view-spa': 6.8,
  'tulip-violet': 6.4,
  'vatika-city': 7.2,
  'adani-samsara': 7.4,
  'ambience-creacions': 8.0,
  'dlf-aralias': 9.1,
  'dlf-belaire': 8.2,
  'dlf-magnolias': 9.0,
  'dlf-park-place': 8.4,
  'dlf-the-ultima': 8.1,
  'emaar-palm-gardens': 7.3,
  'godrej-icon': 7.4,
  'hamilton-court': 7.4,
  'hong-kong-garden': 6.3,
  'ireo-skyon': 7.8,
  'ireo-victory-valley': 7.5,
  'm3m-golf-estate': 7.9,
  'm3m-merlin': 7.6,
  'raheja-vedaanta': 7.0,
  'shapoorji-pallonji-joyville': 7.0,
  'sobha-city': 8.0,
  'uniworld-gardens': 7.0
};

async function fetchGoogleRating(key, name, sector) {
  const call = (textQuery) =>
    fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      headers: {
        'X-Goog-Api-Key': key,
        'X-Goog-FieldMask': 'places.displayName,places.rating,places.userRatingCount',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ textQuery, languageCode: 'en' })
    }).then(async (r) => {
      if (!r.ok) throw new Error(`Places API HTTP ${r.status}: ${await r.text()}`);
      return r.json();
    });

  // Strict query first ("Name Sector Gurgaon"), then relaxed fallbacks.
  const queries = [`${name} ${sector} Gurgaon`, `${name} Gurgaon`, name];
  for (const q of queries) {
    const j = await call(q);
    const place = j.places && j.places.find((p) => typeof p.rating === 'number');
    if (place) return place;
  }
  return null;
}

async function run() {
  const key = process.env.PLACES_API_KEY || process.env.VITE_GOOGLE_MAPS_API_KEY;
  if (!key) {
    console.error('Set PLACES_API_KEY in server/.env (Google key with "Places API (New)" enabled).');
    process.exit(1);
  }

  // Dedicated system account for imported Google ratings.
  let user = await User.findOne({ email: 'google-reviews@societytier.dev' });
  if (!user) {
    user = await User.create({
      username: 'google_reviews',
      email: 'google-reviews@societytier.dev',
      role: 'admin',
      passwordHash: await bcrypt.hash(crypto.randomBytes(16).toString('hex'), 8)
    });
  }

  // Option B: only Google data — wipe old baseline entries.
  await Rating.deleteMany({});
  console.log('Cleared all existing ratings.');

  const societies = await Society.find().sort('name');
  let ok = 0;
  let missed = [];

  for (const s of societies) {
    try {
      const place = await fetchGoogleRating(key, s.name, s.sector);
      let source;
      let base;
      if (place) {
        base = clamp(place.rating * 2); // 5-star scale -> 10 scale
        source = `google ${place.rating}★ (${place.userRatingCount} reviews)`;
      } else if (FALLBACKS[s.slug] != null) {
        base = FALLBACKS[s.slug];
        source = 'estimate (no Google reviews yet)';
      } else {
        missed.push(s.name);
        console.log(`  ? ${s.name}: no Google result and no fallback`);
        continue;
      }

      const offs = offsetsFor(s.slug);
      const vals = {};
      PARAMS.forEach((p, i) => { vals[p] = clamp(base + offs[i]); });
      vals.overall = Math.round((PARAMS.reduce((sum, p) => sum + vals[p], 0) / PARAMS.length) * 10) / 10;

      await Rating.findOneAndUpdate(
        { userId: user._id, societyId: s._id },
        { $set: vals },
        { upsert: true, new: true, runValidators: true }
      );
      ok += 1;
      console.log(`  ✓ ${s.name}: ${source} -> ${vals.overall}/10`);
    } catch (e) {
      missed.push(s.name);
      console.log(`  ! ${s.name}: ${e.message}`);
    }
  }

  console.log(`\nImported ${ok}/${societies.length}${missed.length ? ` (missed: ${missed.join(', ')})` : ''}`);
  await recomputeAll();

  const top = await Society.find().sort('-rankingScore').limit(6)
    .select('name tier overallRating ratingCount rankingScore');
  console.log('\nTop 6 after import:');
  for (const s of top) {
    console.log(`  ${s.tier} | ${s.name} | avg ${s.overallRating}`);
  }
}

mongoose.connect(process.env.MONGODB_URI)
  .then(run)
  .then(() => mongoose.disconnect())
  .catch((e) => { console.error(e); process.exit(1); });
