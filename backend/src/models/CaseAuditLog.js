const mongoose = require('mongoose');

const { Schema } = mongoose;

const caseAuditLogSchema = new Schema(
  {
    case_id: { type: Schema.Types.ObjectId, ref: 'LandCase', required: true },
    changed_by: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    old_status: { type: String },
    new_status: { type: String, required: true },
    notes: { type: String },
  },
  {
    timestamps: { createdAt: 'changed_at', updatedAt: false },
  }
);

caseAuditLogSchema.index({ case_id: 1 });

module.exports = mongoose.model('CaseAuditLog', caseAuditLogSchema);
