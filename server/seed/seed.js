/**
 * Seed script — DEMO DATA ONLY.
 * Generates synthetic societies, users, ratings and comments so the app has
 * realistic-looking content during development. Do NOT ship this data as real
 * reviews. Run: npm run seed
 *
 * Flags:
 *   --fresh   drop all collections first
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../src/models/User');
const Society = require('../src/models/Society');
const Rating = require('../src/models/Rating');
const Comment = require('../src/models/Comment');
const Vote = require('../src/models/Vote');
const { recomputeAll } = require('../src/services/ratingService');
const { slugify } = require('../src/utils/helpers');
const { SOCIETIES, PARAM_BASE, COMMENTS, rand } = require('./seedData');

const DEMO_PASSWORD = 'password123';

function jitter(base, spread) {
  return base + (rand() * 2 - 1) * spread;
}

async function seed() {
  const fresh = process.argv.includes('--fresh');

  if (fresh) {
    console.log('Dropping existing data...');
    await Promise.all([
      User.deleteMany({}),
      Society.deleteMany({}),
      Rating.deleteMany({}),
      Comment.deleteMany({}),
      Vote.deleteMany({})
    ]);
  }

  // ── Societies ─────────────────────────────────────────────────────
  let societies = await Society.find();
  if (!societies.length) {
    societies = await Promise.all(
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
    console.log(`Seeded ${societies.length} societies`);
  }

  // ── Users ─────────────────────────────────────────────────────────
  let admin = await User.findOne({ email: 'admin@societytier.dev' });
  if (!admin) {
    admin = await User.create({
      username: 'admin',
      email: 'admin@societytier.dev',
      passwordHash: await bcrypt.hash(DEMO_PASSWORD, 10),
      role: 'admin'
    });
  }

  for (let i = 1; i <= 6; i++) {
    await User.findOneAndUpdate(
      { username: `demo_gurgaon_${i}` },
      {
        $setOnInsert: {
          username: `demo_gurgaon_${i}`,
          email: `demo${i}@societytier.dev`,
          passwordHash: await bcrypt.hash(DEMO_PASSWORD, 10)
        }
      },
      { upsert: true }
    );
  }
  const demoUsers = await User.find({ username: /^demo_gurgaon_/ }).select('_id');

  // Synthetic crowd for rating volume (clearly labelled demo accounts).
  const crowdCount = await User.countDocuments({ username: /^resident_/ });
  if (crowdCount < 400) {
    const hash = await bcrypt.hash(DEMO_PASSWORD, 8);
    const docs = [];
    for (let i = crowdCount; i < 400; i++) {
      docs.push({
        username: `resident_${1000 + i}`,
        email: `resident${1000 + i}@societytier.dev`,
        passwordHash: hash
      });
    }
    try {
      await User.insertMany(docs);
    } catch (_e) {
      /* concurrent seed run — ignore */
    }
  }
  const crowd = await User.find({ username: /^resident_/ }).select('_id');
  console.log(`Users ready (${crowd.length + demoUsers.length + 1})`);

  if ((await Rating.countDocuments()) === 0) {
    // ── Ratings ─────────────────────────────────────────────────────
    const ratingOps = [];
    const usedPairs = new Set();

    function pushRating(society, userId, q) {
      const key = `${society._id}:${userId}`;
      if (usedPairs.has(key)) return;
      usedPairs.add(key);
      const vals = {};
      for (const [param, base] of Object.entries(PARAM_BASE)) {
        vals[param] = Math.max(1, Math.min(10, Math.round(jitter(base * q, 1.3) * 10) / 10));
      }
      vals.overall =
        Math.round((Object.values(vals).reduce((a, b) => a + b, 0) / Object.keys(vals).length) * 10) / 10;
      ratingOps.push({
        userId,
        societyId: society._id,
        ...vals,
        createdAt: new Date(Date.now() - rand() * 300 * 24 * 3600 * 1000)
      });
    }

    for (const s of SOCIETIES) {
      const society = societies.find((x) => x.slug === slugify(s.name));
      const count = Math.round(200 + s.q * 1400 + rand() * 250);
      for (let i = 0; i < count; i++) {
        const user = crowd[Math.floor(rand() * crowd.length)];
        if (!user) break;
        pushRating(society, user._id, Math.max(0.4, Math.min(1, s.q + jitter(0, 0.09))));
      }
    }
    // Demo users rate a handful each.
    for (const du of demoUsers) {
      for (const society of societies.slice(0, 8)) pushRating(society, du._id, 0.85);
    }

    await Rating.insertMany(ratingOps, { ordered: false }).catch((e) =>
      console.warn('Some ratings skipped:', e.writeErrors ? e.writeErrors.length : e.message)
    );
    console.log(`Seeded ${ratingOps.length} ratings`);

    // ── Comments ────────────────────────────────────────────────────
    const commentOps = [];
    for (const society of societies) {
      const n = 5 + Math.floor(rand() * 5);
      const parents = [];
      for (let i = 0; i < n; i++) {
        const tpl = COMMENTS[Math.floor(rand() * COMMENTS.length)];
        const author =
          rand() < 0.25 ? demoUsers[Math.floor(rand() * demoUsers.length)] : crowd[Math.floor(rand() * crowd.length)];
        parents.push({
          authorId: author._id,
          doc: {
            userId: author._id,
            societyId: society._id,
            body: `[DEMO] ${tpl.body}`,
            tags: tpl.tags,
            upvotes: Math.floor(rand() * 180),
            downvotes: Math.floor(rand() * 30),
            createdAt: new Date(Date.now() - rand() * 180 * 24 * 3600 * 1000)
          }
        });
      }
      commentOps.push(...parents.map((p) => p.doc));

      for (const p of parents.slice(0, 2)) {
        commentOps.push({
          userId: crowd[Math.floor(rand() * crowd.length)]._id,
          societyId: society._id,
          parentKey: parents.indexOf(p),
          body: '[DEMO] Can confirm. Been here 3 years and this matches my experience.',
          upvotes: Math.floor(rand() * 40),
          downvotes: Math.floor(rand() * 8),
          createdAt: new Date(Date.now() - rand() * 90 * 24 * 3600 * 1000)
        });
      }
    }

    // Insert parents first so replies can reference real _ids.
    const parentsOnly = commentOps
      .filter((c) => !c.parentKey)
      .map(({ authorId, ...doc }) => doc);
    const insertedParents = await Comment.insertMany(parentsOnly);

    // Attach each reply to a root comment from the same society.
    const rootsBySociety = new Map();
    for (const p of insertedParents) {
      const k = String(p.societyId);
      if (!rootsBySociety.has(k)) rootsBySociety.set(k, []);
      rootsBySociety.get(k).push(p._id);
    }
    const replyDocs = commentOps
      .filter((c) => c.parentKey !== undefined)
      .map(({ parentKey, authorId, ...doc }) => {
        void parentKey;
        void authorId;
        return doc;
      });
    for (const r of replyDocs) delete r.parentKey;

    const rootsList = [...rootsBySociety.values()];
    replyDocs.forEach((r, i) => {
      const roots = rootsList[i % rootsList.length];
      r.parentCommentId = roots[i % roots.length];
      delete r.authorId;
    });
    await Comment.insertMany(replyDocs);
    console.log(`Seeded ${parentsOnly.length + replyDocs.length} comments`);

    // A few genuine votes from demo users.
    await Vote.insertMany(
      insertedParents.slice(0, 50).map((c) => ({ userId: demoUsers[0]._id, commentId: c._id, voteType: 'up' }))
    ).catch(() => {});
  } else {
    console.log('Ratings already exist — skipping rating/comment generation.');
  }

  // ── Recompute aggregates via the ranking algorithm ────────────────
  console.log('Recomputing ranking scores...');
  await recomputeAll();
  const top = await Society.find()
    .sort('-rankingScore')
    .limit(5)
    .select('name tier overallRating ratingCount rankingScore');
  console.log('\nTop 5 by ranking score:');
  for (const s of top) {
    console.log(`  ${s.tier} | ${s.name} | ${s.overallRating} avg | score ${s.rankingScore} (${s.ratingCount} ratings)`);
  }
  console.log(`\nDone. Demo logins -> admin@societytier.dev / demo1@societytier.dev | password: ${DEMO_PASSWORD}`);
}

mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/society-tier')
  .then(seed)
  .then(() => mongoose.disconnect())
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
