const { pool, query } = require('../../config/db');

async function getCaseForUpdate(caseId) {
  const result = await query(
    `SELECT id, farmer_id, officer_id, status
     FROM land_cases
     WHERE id = $1`,
    [caseId]
  );
  return result.rows[0] || null;
}

async function insertAuditLog(client, caseId, userId, oldStatus, newStatus, notes) {
  await client.query(
    `INSERT INTO case_audit_log (case_id, changed_by, old_status, new_status, notes)
     VALUES ($1, $2, $3, $4, $5)`,
    [caseId, userId, oldStatus, newStatus, notes || null]
  );
}

async function submitCase(caseId, userId) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const caseRow = await client.query(
      `SELECT id, farmer_id, status FROM land_cases WHERE id = $1 FOR UPDATE`,
      [caseId]
    );
    const row = caseRow.rows[0];
    if (!row) {
      throw Object.assign(new Error('Case not found'), { code: 'NOT_FOUND' });
    }
    if (row.farmer_id !== userId) {
      throw Object.assign(new Error('Forbidden'), { code: 'FORBIDDEN' });
    }
    if (row.status !== 'draft') {
      throw Object.assign(new Error('Invalid status'), { code: 'INVALID_STATUS' });
    }
    await client.query(
      `UPDATE land_cases SET status = 'submitted', updated_at = NOW() WHERE id = $1`,
      [caseId]
    );
    await insertAuditLog(client, caseId, userId, row.status, 'submitted', null);
    await client.query('COMMIT');
    return { status: 'submitted' };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

async function approveCase(caseId, userId, finalValue, notes) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const caseRow = await client.query(
      `SELECT id, status FROM land_cases WHERE id = $1 FOR UPDATE`,
      [caseId]
    );
    const row = caseRow.rows[0];
    if (!row) {
      throw Object.assign(new Error('Case not found'), { code: 'NOT_FOUND' });
    }
    if (row.status !== 'under_review') {
      throw Object.assign(new Error('Invalid status'), { code: 'INVALID_STATUS' });
    }

    await client.query(
      `INSERT INTO compensation (case_id, final_value, approval_status, approved_by, approved_at)
       VALUES ($1, $2, 'approved', $3, NOW())
       ON CONFLICT (case_id) DO UPDATE SET
         final_value = EXCLUDED.final_value,
         approval_status = 'approved',
         approved_by = EXCLUDED.approved_by,
         approved_at = EXCLUDED.approved_at,
         updated_at = NOW()`,
      [caseId, finalValue, userId]
    );

    await client.query(
      `UPDATE land_cases SET status = 'approved', updated_at = NOW() WHERE id = $1`,
      [caseId]
    );
    await insertAuditLog(client, caseId, userId, row.status, 'approved', notes);
    await client.query('COMMIT');
    return { status: 'approved' };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

async function rejectCase(caseId, userId, reason) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const caseRow = await client.query(
      `SELECT id, status FROM land_cases WHERE id = $1 FOR UPDATE`,
      [caseId]
    );
    const row = caseRow.rows[0];
    if (!row) {
      throw Object.assign(new Error('Case not found'), { code: 'NOT_FOUND' });
    }
    if (row.status !== 'under_review') {
      throw Object.assign(new Error('Invalid status'), { code: 'INVALID_STATUS' });
    }

    await client.query(
      `UPDATE land_cases SET status = 'rejected', updated_at = NOW() WHERE id = $1`,
      [caseId]
    );
    await insertAuditLog(client, caseId, userId, row.status, 'rejected', reason);
    await client.query('COMMIT');
    return { status: 'rejected' };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

async function assignCase(caseId, userId, officerId) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const caseRow = await client.query(
      `SELECT id, status FROM land_cases WHERE id = $1 FOR UPDATE`,
      [caseId]
    );
    const row = caseRow.rows[0];
    if (!row) {
      throw Object.assign(new Error('Case not found'), { code: 'NOT_FOUND' });
    }

    await client.query(
      `UPDATE land_cases
       SET officer_id = $1, status = 'under_review', updated_at = NOW()
       WHERE id = $2`,
      [officerId, caseId]
    );
    await insertAuditLog(client, caseId, userId, row.status, 'under_review', null);
    await client.query('COMMIT');
    return { status: 'under_review', officer_id: officerId };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

async function submitToAuthority(caseId, userId) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const caseRow = await client.query(
      `SELECT id, farmer_id, status FROM land_cases WHERE id = $1 FOR UPDATE`,
      [caseId]
    );
    const row = caseRow.rows[0];
    if (!row) {
      throw Object.assign(new Error('Case not found'), { code: 'NOT_FOUND' });
    }
    if (row.status !== 'approved') {
      throw Object.assign(new Error('Invalid status'), { code: 'INVALID_STATUS' });
    }

    const farmer = await client.query(
      `SELECT name, email FROM users WHERE id = $1`,
      [row.farmer_id]
    );
    const landDetails = await client.query(
      `SELECT * FROM land_details WHERE case_id = $1`,
      [caseId]
    );
    const compensation = await client.query(
      `SELECT * FROM compensation WHERE case_id = $1`,
      [caseId]
    );
    const audit = await client.query(
      `SELECT * FROM case_audit_log WHERE case_id = $1 ORDER BY changed_at ASC`,
      [caseId]
    );

    await client.query(
      `UPDATE land_cases SET status = 'submitted_to_authority', updated_at = NOW() WHERE id = $1`,
      [caseId]
    );
    await insertAuditLog(
      client,
      caseId,
      userId,
      row.status,
      'submitted_to_authority',
      null
    );

    await client.query('COMMIT');

    const compRow = compensation.rows[0] || {};
    const calculated = Number(compRow.calculated_value || 0);
    const predicted = Number(compRow.predicted_value || 0);
    const variancePct =
      calculated > 0 ? (Math.abs(calculated - predicted) / calculated) * 100 : null;

    return {
      case_id: caseId,
      generated_at: new Date().toISOString(),
      farmer_details: farmer.rows[0] || null,
      land_details: landDetails.rows[0] || null,
      compensation: {
        market_value_per_acre: compRow.market_value_per_acre || null,
        multiplier: compRow.multiplier || null,
        multiplier_basis:
          landDetails.rows[0] && Number(landDetails.rows[0].distance_to_city_km) > 50
            ? 'rural (>50km from city)'
            : 'urban (≤50km from city)',
        solatium_per_acre: compRow.solatium_per_acre || null,
        calculated_value: compRow.calculated_value || null,
        predicted_value: compRow.predicted_value || null,
        final_value: compRow.final_value || null,
        variance_pct: variancePct,
      },
      statutory_basis: 'RFCTLARR Act 2013',
      audit_trail: audit.rows,
      status: 'submitted_to_authority',
    };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

module.exports = {
  getCaseForUpdate,
  submitCase,
  approveCase,
  rejectCase,
  assignCase,
  submitToAuthority,
};
