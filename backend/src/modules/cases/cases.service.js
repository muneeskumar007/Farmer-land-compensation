const { LandCase } = require('../../models');

function formatCase(doc) {
  return {
    id: doc._id.toString(),
    farmer_id: doc.farmer_id ? doc.farmer_id.toString() : null,
    officer_id: doc.officer_id ? doc.officer_id.toString() : null,
    status: doc.status,
    acquisition_type: doc.acquisition_type,
    urgency_level: doc.urgency_level,
    created_at: doc.created_at,
    updated_at: doc.updated_at,
  };
}

async function createCase(farmerId, acquisitionType, urgencyLevel) {
  const created = await LandCase.create({
    farmer_id: farmerId,
    acquisition_type: acquisitionType,
    urgency_level: urgencyLevel,
  });
  return formatCase(created);
}

async function getCaseById(caseId, requestingUser) {
  const doc = await LandCase.findById(caseId);
  if (!doc) {
    return null;
  }
  if (
    requestingUser.role === 'farmer' &&
    doc.farmer_id &&
    doc.farmer_id.toString() !== requestingUser.sub
  ) {
    const err = new Error('Forbidden');
    err.code = 'FORBIDDEN';
    throw err;
  }
  return formatCase(doc);
}

async function getCases(filters, page, limit) {
  const offset = (page - 1) * limit;
  const filterQuery = {};
  if (filters.status) {
    filterQuery.status = filters.status;
  }

  const total = await LandCase.countDocuments(filterQuery);
  const data = await LandCase.find(filterQuery)
    .sort({ created_at: -1 })
    .skip(offset)
    .limit(limit);

  const pages = Math.max(1, Math.ceil(total / limit));
  return {
    data: data.map(formatCase),
    total,
    page,
    pages,
  };
}

module.exports = {
  createCase,
  getCaseById,
  getCases,
};
