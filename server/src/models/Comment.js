const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    societyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Society', required: true, index: true },
    parentCommentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
      default: null,
      index: true
    },
    body: { type: String, required: true, maxlength: 5000 },
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
    tags: [
      {
        type: String,
        enum: [
          'MAINTENANCE',
          'SAFETY',
          'PARKING',
          'WATER',
          'POWER',
          'NOISE',
          'AMENITIES',
          'LOCATION',
          'RENT',
          'COMMUNITY'
        ]
      }
    ],
    isHidden: { type: Boolean, default: false }
  },
  { timestamps: true }
);

commentSchema.index({ societyId: 1, createdAt: -1 });
commentSchema.index({ societyId: 1, upvotes: -1 });

module.exports = mongoose.model('Comment', commentSchema);
