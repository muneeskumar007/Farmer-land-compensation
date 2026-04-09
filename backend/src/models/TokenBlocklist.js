const mongoose = require('mongoose');

const { Schema } = mongoose;

const tokenBlocklistSchema = new Schema(
  {
    token_hash: { type: String, required: true, unique: true },
    expires_at: { type: Date, required: true },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: false },
  }
);

tokenBlocklistSchema.index({ expires_at: 1 });

module.exports = mongoose.model('TokenBlocklist', tokenBlocklistSchema);
