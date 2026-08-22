const mongoose = require('mongoose');

const societySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    builder: { type: String, trim: true, index: true },
    sector: { type: String, trim: true, index: true },
    area: {
      type: String,
      trim: true,
      enum: [
        'Golf Course Road',
        'Golf Course Extension',
        'Dwarka Expressway',
        'New Gurgaon',
        'Sohna Road',
        'Southern Peripheral Road',
        'Central Gurgaon'
      ],
      index: true
    },
    address: { type: String, trim: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    description: { type: String, trim: true },
    image: { type: String, default: '' },
    pricePerSqft: { type: Number, default: 0 },
    bhkOptions: [{ type: Number }],
    overallRating: { type: Number, default: 0, index: true },
    rankingScore: { type: Number, default: 0, index: true },
    ratingCount: { type: Number, default: 0, index: true },
    categoryScores: {
      type: Map,
      of: Number,
      default: {}
    },
    tier: {
      type: String,
      enum: ['S', 'A', 'B', 'C', 'D'],
      default: 'B',
      index: true
    }
  },
  { timestamps: true }
);

societySchema.index({ name: 'text', sector: 'text', builder: 'text', area: 'text' });

module.exports = mongoose.model('Society', societySchema);
