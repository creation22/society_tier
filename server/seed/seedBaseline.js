/**
 * Baseline reputation ratings — ONE entry per society, from a single system
 * account. Scores reflect general Gurgaon market perception and are meant
 * only to give the app a non-empty starting point; real resident ratings
 * will refine them over time.
 *
 * Run: node seed/seedBaseline.js   (use --fresh to wipe baseline first)
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

const PROFILES = {
  luxury:  { maintenance: 1.2, amenities: 1.3, safety: 0.8, cleanliness: 0.9, location: 0.6, valueForMoney: -1.6, parking: 0.5, community: 0.4, connectivity: 0.3, noise: 0.5 },
  premium: { maintenance: 0.6, amenities: 0.7, safety: 0.4, cleanliness: 0.5, location: 0.3, valueForMoney: -0.4, parking: 0.2, community: 0.3, connectivity: 0.2, noise: 0.3 },
  standard:{ maintenance: 0, amenities: 0, safety: 0, cleanliness: 0, location: 0, valueForMoney: 0.4, parking: 0, community: 0.1, connectivity: 0.1, noise: -0.1 },
  budget:  { maintenance: -0.8, amenities: -0.9, safety: -0.4, cleanliness: -0.5, location: -0.2, valueForMoney: 0.9, parking: -0.3, community: 0.2, connectivity: 0.2, noise: -0.6 }
};

const DATA = [
  { slug: 'dlf-magnolias', base: 9.0, profile: 'luxury' },
  { slug: 'dlf-aralias', base: 9.1, profile: 'luxury' },
  { slug: 'dlf-park-place', base: 8.4, profile: 'luxury' },
  { slug: 'dlf-belaire', base: 8.2, profile: 'premium' },
  { slug: 'ambience-creacions', base: 8.0, profile: 'premium' },
  { slug: 'dlf-the-ultima', base: 8.1, profile: 'premium' },
  { slug: 'ireo-skyon', base: 7.8, profile: 'premium' },
  { slug: 'ireo-victory-valley', base: 7.5, profile: 'premium' },
  { slug: 'm3m-merlin', base: 7.6, profile: 'premium' },
  { slug: 'm3m-golf-estate', base: 7.9, profile: 'premium' },
  { slug: 'tulip-violet', base: 6.4, profile: 'standard' },
  { slug: 'sobha-city', base: 8.0, profile: 'premium' },
  { slug: 'godrej-aria', base: 7.2, profile: 'standard' },
  { slug: 'adani-samsara', base: 7.4, profile: 'standard' },
  { slug: 'shapoorji-pallonji-joyville', base: 7.0, profile: 'standard' },
  { slug: 'raheja-vedaanta', base: 7.0, profile: 'standard' },
  { slug: 'emaar-palm-gardens', base: 7.3, profile: 'standard' },
  { slug: 'godrej-icon', base: 7.4, profile: 'standard' },
  { slug: 'nirvana-country', base: 7.7, profile: 'premium' },
  { slug: 'uniworld-gardens', base: 7.0, profile: 'standard' },
  { slug: 'central-park-ii', base: 7.5, profile: 'premium' },
  { slug: 'vatika-city', base: 7.2, profile: 'standard' },
  { slug: 'hamilton-court', base: 7.4, profile: 'premium' },
  { slug: 'hong-kong-garden', base: 6.3, profile: 'budget' },
  { slug: 'park-view-spa', base: 6.8, profile: 'standard' },
  { slug: 'heritage-city', base: 6.9, profile: 'standard' }
];

const clamp = (v) => Math.max(1, Math.min(10, Math.round(v * 10) / 10));

async function seed() {
  const fresh = process.argv.includes('--fresh');

  // One system account owns every baseline rating.
  let user = await User.findOne({ email: 'baseline@societytier.dev' });
  if (!user) {
    user = await User.create({
      username: 'societytier',
      email: 'baseline@societytier.dev',
      role: 'admin',
      passwordHash: await bcrypt.hash(crypto.randomBytes(16).toString('hex'), 8)
    });
  }

  if (fresh) {
    await Rating.deleteMany({ userId: user._id });
    console.log('Cleared previous baseline ratings.');
  }

  let made = 0;
  for (const { slug, base, profile } of DATA) {
    const society = await Society.findOne({ slug });
    if (!society) { console.log('  skip (missing):', slug); continue; }
    const d = PROFILES[profile] || PROFILES.standard;
    const vals = {};
    for (const p of PARAMS) vals[p] = clamp(base + (d[p] || 0));
    vals.overall = Math.round((PARAMS.reduce((s, p) => s + vals[p], 0) / PARAMS.length) * 10) / 10;

    await Rating.findOneAndUpdate(
      { userId: user._id, societyId: society._id },
      { $set: vals },
      { upsert: true, new: true, runValidators: true }
    );
    made += 1;
  }

  console.log(`Seeded ${made} baseline ratings (1 per society).`);
  await recomputeAll();

  const top = await Society.find().sort('-rankingScore').limit(5)
    .select('name tier overallRating ratingCount rankingScore');
  console.log('\nTop 5 by ranking score:');
  for (const s of top) {
    console.log(`  ${s.tier} | ${s.name} | avg ${s.overallRating} | ${s.ratingCount} ratings`);
  }
}

mongoose.connect(process.env.MONGODB_URI)
  .then(seed)
  .then(() => mongoose.disconnect())
  .catch((e) => { console.error(e); process.exit(1); });
