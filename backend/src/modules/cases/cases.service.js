const { query } = require('../../config/db');

async function createCase(farmerId, acquisitionType, urgencyLevel) {
  const result = await query(
    `INSERT INTO land_cases (farmer_id, acquisition_type, urgency_level)
     VALUES ($1, $2, $3)
     RETURNING id, farmer_id, officer_id, status, acquisition_type, urgency_level, created_at, updated_at`,
    [farmerId, acquisitionType, urgencyLevel]
  );
  return result.rows[0];
}

async function getCaseById(caseId, requestingUser) {
  const result = await query(
    `SELECT id, farmer_id, officer_id, status, acquisition_type, urgency_level, created_at, updated_at
     FROM land_cases
     WHERE id = $1`,
    [caseId]
  );
  const row = result.rows[0];
  if (!row) {
    return null;
  }
  if (requestingUser.role === 'farmer' && row.farmer_id !== requestingUser.sub) {
    const err = new Error('Forbidden');
    err.code = 'FORBIDDEN';
    throw err;
  }
  return row;
}

async function getCases(filters, page, limit) {
  const offset = (page - 1) * limit;
  const values = [];
  const where = [];

  if (filters.status) {
    values.push(filters.status);
    where.push(`status = $${values.length}`);
  }

  const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';

  const totalResult = await query(
    `SELECT COUNT(*)::int AS total FROM land_cases ${whereClause}`,
    values
  );
  const total = totalResult.rows[0].total;

  values.push(limit);
  values.push(offset);

  const dataResult = await query(
    `SELECT id, farmer_id, officer_id, status, acquisition_type, urgency_level, created_at, updated_at
     FROM land_cases
     ${whereClause}
     ORDER BY created_at DESC
     LIMIT $${values.length - 1} OFFSET $${values.length}`,
    values
  );

  const pages = Math.max(1, Math.ceil(total / limit));
  return {
    data: dataResult.rows,
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
