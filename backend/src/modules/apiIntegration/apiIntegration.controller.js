const apiResponse = require('../../utils/apiResponse');
const LandCase = require('../../models/LandCase');
const LandDetails = require('../../models/LandDetails');

// POST /api/patta/lookup
async function lookupPatta(req, res, next) {
  try {
    const { pattaNumber, district } = req.body;
    
    // Mock response since Patta records are usually external or custom models
    const mockRecord = {
      pattaNumber,
      district,
      owner_name: 'Mock Farmer',
      land_area_acres: 5.0,
      land_type: 'agricultural',
      soil_type: 'red',
      status: 'active'
    };

    return apiResponse.success(res, mockRecord, 200);
  } catch (error) {
    return next(error);
  }
}

// GET /api/lands
async function getAllLands(req, res, next) {
  try {
    // Fetch all cases as lands
    const lands = await LandCase.find()
      .populate('farmer_id', 'name email phone')
      .populate('officer_id', 'name email')
      .sort({ created_at: -1 });
      
    return apiResponse.success(res, { lands }, 200);
  } catch (error) {
    return next(error);
  }
}

// PATCH /api/lands/:id/status
async function updateLandStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body; // e.g., 'approved', 'rejected'

    const updatedCase = await LandCase.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedCase) {
      return apiResponse.error(res, 'Land record not found', 404);
    }

    return apiResponse.success(res, { land: updatedCase }, 200);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  lookupPatta,
  getAllLands,
  updateLandStatus
};
