const mongoose = require('mongoose');

const { Schema } = mongoose;

const compensationSchema = new Schema(
  {
    case_id: { type: Schema.Types.ObjectId, ref: 'LandCase', unique: true, required: true },
    market_value_per_acre: { type: Number },
    multiplier: { type: Number },
    solatium_per_acre: { type: Number },
    calculated_value: { type: Number },
    predicted_value: { type: Number },
    final_value: { type: Number },
    feature_importance: { type: Schema.Types.Mixed },
    approval_status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    approved_by: { type: Schema.Types.ObjectId, ref: 'User' },
    approved_at: { type: Date },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

compensationSchema.index({ case_id: 1, approval_status: 1 });

module.exports = mongoose.model('Compensation', compensationSchema);
