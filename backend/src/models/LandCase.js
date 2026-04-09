const mongoose = require('mongoose');

const { Schema } = mongoose;

const landCaseSchema = new Schema(
  {
    farmer_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    officer_id: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    status: {
      type: String,
      enum: [
        'draft',
        'submitted',
        'under_review',
        'approved',
        'rejected',
        'submitted_to_authority',
      ],
      default: 'draft',
    },
    acquisition_type: { type: String, required: true },
    urgency_level: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'low',
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

landCaseSchema.index({ farmer_id: 1 });
landCaseSchema.index({ officer_id: 1 });
landCaseSchema.index({ status: 1 });

module.exports = mongoose.model('LandCase', landCaseSchema);
