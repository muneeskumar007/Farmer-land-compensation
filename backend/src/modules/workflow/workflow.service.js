const { mongoose } = require('../../config/db');
const {
  LandCase,
  Compensation,
  CaseAuditLog,
  User,
  LandDetails,
} = require('../../models');

function isTransactionNotSupported(error) {
  if (!error || !error.message) {
    return false;
  }
  return (
    error.message.includes('Transaction numbers are only allowed') ||
    error.message.includes('Transaction not supported') ||
    error.message.includes('replica set')
  );
}

function withSession(query, session) {
  return session ? query.session(session) : query;
}

async function runWithOptionalTransaction(work) {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const result = await work(session);
    await session.commitTransaction();
    return result;
  } catch (error) {
    await session.abortTransaction().catch(() => {});
    if (isTransactionNotSupported(error)) {
      return work(null);
    }
    throw error;
  } finally {
    session.endSession();
  }
}

function formatLandDetails(doc) {
  if (!doc) {
    return null;
  }
  return {
    id: doc._id.toString(),
    case_id: doc.case_id ? doc.case_id.toString() : null,
    state: doc.state,
    district: doc.district,
    taluk: doc.taluk,
    village: doc.village,
    pincode: doc.pincode,
    latitude: doc.latitude,
    longitude: doc.longitude,
    land_area_acres: doc.land_area_acres,
    gis_area_acres: doc.gis_area_acres,
    area_discrepancy_flag: doc.area_discrepancy_flag,
    land_type: doc.land_type,
    soil_type: doc.soil_type,
    irrigation_type: doc.irrigation_type,
    water_availability_score: doc.water_availability_score,
    crop_type: doc.crop_type,
    crop_yield_per_acre: doc.crop_yield_per_acre,
    season: doc.season,
    distance_to_road_km: doc.distance_to_road_km,
    distance_to_highway_km: doc.distance_to_highway_km,
    distance_to_city_km: doc.distance_to_city_km,
    distance_to_market_km: doc.distance_to_market_km,
    nearby_projects: doc.nearby_projects,
    avg_land_price_per_acre: doc.avg_land_price_per_acre,
    guideline_value: doc.guideline_value,
    previous_compensation: doc.previous_compensation,
    created_at: doc.created_at,
  };
}

async function insertAuditLog(session, caseId, userId, oldStatus, newStatus, notes) {
  const payload = {
    case_id: caseId,
    changed_by: userId,
    old_status: oldStatus,
    new_status: newStatus,
    notes: notes || null,
  };

  if (session) {
    await CaseAuditLog.create([payload], { session });
  } else {
    await CaseAuditLog.create(payload);
  }
}

async function getCaseForUpdate(caseId) {
  const doc = await LandCase.findById(caseId);
  if (!doc) {
    return null;
  }
  return {
    id: doc._id.toString(),
    farmer_id: doc.farmer_id ? doc.farmer_id.toString() : null,
    officer_id: doc.officer_id ? doc.officer_id.toString() : null,
    status: doc.status,
  };
}

async function submitCase(caseId, userId) {
  return runWithOptionalTransaction(async (session) => {
    const caseDoc = await withSession(LandCase.findById(caseId), session);
    if (!caseDoc) {
      throw Object.assign(new Error('Case not found'), { code: 'NOT_FOUND' });
    }
    if (caseDoc.farmer_id && caseDoc.farmer_id.toString() !== userId) {
      throw Object.assign(new Error('Forbidden'), { code: 'FORBIDDEN' });
    }
    if (caseDoc.status !== 'draft') {
      throw Object.assign(new Error('Invalid status'), { code: 'INVALID_STATUS' });
    }

    caseDoc.status = 'submitted';
    await caseDoc.save(session ? { session } : undefined);
    await insertAuditLog(session, caseId, userId, 'draft', 'submitted', null);
    return { status: 'submitted' };
  });
}

async function approveCase(caseId, userId, finalValue, notes) {
  return runWithOptionalTransaction(async (session) => {
    const caseDoc = await withSession(LandCase.findById(caseId), session);
    if (!caseDoc) {
      throw Object.assign(new Error('Case not found'), { code: 'NOT_FOUND' });
    }
    if (caseDoc.status !== 'under_review') {
      throw Object.assign(new Error('Invalid status'), { code: 'INVALID_STATUS' });
    }

    await Compensation.findOneAndUpdate(
      { case_id: caseId },
      {
        $set: {
          final_value: finalValue,
          approval_status: 'approved',
          approved_by: userId,
          approved_at: new Date(),
        },
        $setOnInsert: { case_id: caseId },
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
        runValidators: true,
        session,
      }
    );

    caseDoc.status = 'approved';
    await caseDoc.save(session ? { session } : undefined);
    await insertAuditLog(session, caseId, userId, 'under_review', 'approved', notes);
    return { status: 'approved' };
  });
}

async function rejectCase(caseId, userId, reason) {
  return runWithOptionalTransaction(async (session) => {
    const caseDoc = await withSession(LandCase.findById(caseId), session);
    if (!caseDoc) {
      throw Object.assign(new Error('Case not found'), { code: 'NOT_FOUND' });
    }
    if (caseDoc.status !== 'under_review') {
      throw Object.assign(new Error('Invalid status'), { code: 'INVALID_STATUS' });
    }

    caseDoc.status = 'rejected';
    await caseDoc.save(session ? { session } : undefined);
    await insertAuditLog(session, caseId, userId, 'under_review', 'rejected', reason);
    return { status: 'rejected' };
  });
}

async function assignCase(caseId, userId, officerId) {
  return runWithOptionalTransaction(async (session) => {
    const caseDoc = await withSession(LandCase.findById(caseId), session);
    if (!caseDoc) {
      throw Object.assign(new Error('Case not found'), { code: 'NOT_FOUND' });
    }

    const previousStatus = caseDoc.status;
    caseDoc.officer_id = officerId;
    caseDoc.status = 'under_review';
    await caseDoc.save(session ? { session } : undefined);
    await insertAuditLog(session, caseId, userId, previousStatus, 'under_review', null);
    return { status: 'under_review', officer_id: officerId };
  });
}

async function submitToAuthority(caseId, userId) {
  return runWithOptionalTransaction(async (session) => {
    const caseDoc = await withSession(LandCase.findById(caseId), session);
    if (!caseDoc) {
      throw Object.assign(new Error('Case not found'), { code: 'NOT_FOUND' });
    }
    if (caseDoc.status !== 'approved') {
      throw Object.assign(new Error('Invalid status'), { code: 'INVALID_STATUS' });
    }

    const [farmer, landDetails, compensation, audit] = await Promise.all([
      withSession(
        User.findById(caseDoc.farmer_id).select('name email').lean(),
        session
      ),
      withSession(LandDetails.findOne({ case_id: caseId }).lean(), session),
      withSession(Compensation.findOne({ case_id: caseId }).lean(), session),
      withSession(
        CaseAuditLog.find({ case_id: caseId }).sort({ changed_at: 1 }).lean(),
        session
      ),
    ]);

    caseDoc.status = 'submitted_to_authority';
    await caseDoc.save(session ? { session } : undefined);
    await insertAuditLog(
      session,
      caseId,
      userId,
      'approved',
      'submitted_to_authority',
      null
    );

    const compRow = compensation || {};
    const calculated = Number(compRow.calculated_value || 0);
    const predicted = Number(compRow.predicted_value || 0);
    const variancePct =
      calculated > 0 ? (Math.abs(calculated - predicted) / calculated) * 100 : null;

    return {
      case_id: caseId,
      generated_at: new Date().toISOString(),
      farmer_details: farmer ? { name: farmer.name, email: farmer.email } : null,
      land_details: formatLandDetails(landDetails),
      compensation: {
        market_value_per_acre: compRow.market_value_per_acre || null,
        multiplier: compRow.multiplier || null,
        multiplier_basis:
          landDetails && Number(landDetails.distance_to_city_km) > 50
            ? 'rural (>50km from city)'
            : 'urban (<=50km from city)',
        solatium_per_acre: compRow.solatium_per_acre || null,
        calculated_value: compRow.calculated_value || null,
        predicted_value: compRow.predicted_value || null,
        final_value: compRow.final_value || null,
        variance_pct: variancePct,
      },
      statutory_basis: 'RFCTLARR Act 2013',
      audit_trail: (audit || []).map((entry) => ({
        id: entry._id.toString(),
        case_id: entry.case_id ? entry.case_id.toString() : null,
        changed_by: entry.changed_by ? entry.changed_by.toString() : null,
        old_status: entry.old_status,
        new_status: entry.new_status,
        notes: entry.notes,
        changed_at: entry.changed_at,
      })),
      status: 'submitted_to_authority',
    };
  });
}

module.exports = {
  getCaseForUpdate,
  submitCase,
  approveCase,
  rejectCase,
  assignCase,
  submitToAuthority,
};
