const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    reporterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    commentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' },
    reason: { type: String, maxlength: 500 },
    status: { type: String, enum: ['open', 'resolved'], default: 'open', index: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Report', reportSchema);
