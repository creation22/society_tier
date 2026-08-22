const mongoose = require('mongoose');

const PARAMS = [
  'location',
  'connectivity',
  'maintenance',
  'amenities',
  'safety',
  'cleanliness',
  'valueForMoney',
  'parking',
  'community',
  'noise'
];

const paramSchema = {};
for (const p of PARAMS) {
  paramSchema[p] = { type: Number, required: true, min: 1, max: 10 };
}

const ratingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    societyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Society', required: true, index: true },
    ...paramSchema,
    overall: { type: Number, required: true, min: 1, max: 10 },
    review: { type: String, maxlength: 2000 }
  },
  { timestamps: true }
);

ratingSchema.index({ userId: 1, societyId: 1 }, { unique: true });
ratingSchema.index({ societyId: 1, createdAt: -1 });

module.exports = mongoose.model('Rating', ratingSchema);
