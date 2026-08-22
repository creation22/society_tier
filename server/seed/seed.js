/**
 * Seed script — societies only.
 * Inserts the Gurgaon society catalogue (names + core info). No demo users,
 * no synthetic ratings, comments or votes: all live content comes from real
 * signups.
 *
 * Flags:
 *   --fresh   wipe ALL collections before seeding
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');

const User = require('../src/models/User');
const Society = require('../src/models/Society');
const Rating = require('../src/models/Rating');
const Comment = require('../src/models/Comment');
const Vote = require('../src/models/Vote');
const Report = require('../src/models/Report');
const { slugify } = require('../src/utils/helpers');
const { SOCIETIES } = require('./seedData');

async function seed() {
  const fresh = process.argv.includes('--fresh');

  if (fresh) {
    console.log('Wiping existing data...');
    await Promise.all([
      User.deleteMany({}),
      Society.deleteMany({}),
      Rating.deleteMany({}),
      Comment.deleteMany({}),
      Vote.deleteMany({}),
      Report.deleteMany({})
    ]);
  }

  const existing = await Society.countDocuments();
  if (existing > 0) {
    console.log(`Societies already present (${existing}) — nothing to do.`);
    return;
  }

  const created = await Promise.all(
    SOCIETIES.map((s) =>
      Society.create({
        name: s.name,
        slug: slugify(s.name),
        builder: s.builder,
        sector: s.sector,
        area: s.area,
        address: `${s.sector}, Gurgaon, Haryana`,
        latitude: s.lat,
        longitude: s.lng,
        description: `${s.name} by ${s.builder} in ${s.sector}, ${s.area}.`,
        pricePerSqft: s.pricePerSqft,
        bhkOptions: s.bhk
      })
    )
  );
  console.log(`Seeded ${created.length} societies (no ratings, no demo accounts).`);
}

mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/society-tier')
  .then(seed)
  .then(() => mongoose.disconnect())
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
