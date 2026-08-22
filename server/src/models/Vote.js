const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    commentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', required: true },
    voteType: { type: String, enum: ['up', 'down'], required: true }
  },
  { timestamps: true }
);

voteSchema.index({ userId: 1, commentId: 1 }, { unique: true });
voteSchema.index({ commentId: 1 });

module.exports = mongoose.model('Vote', voteSchema);
