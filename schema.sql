CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'officer', 'farmer')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE users IS 'System users including administrators, officers, and farmers.';
COMMENT ON COLUMN users.id IS 'Primary key for users.';
COMMENT ON COLUMN users.name IS 'Full name of the user.';
COMMENT ON COLUMN users.email IS 'Unique email used for login and communication.';
COMMENT ON COLUMN users.password_hash IS 'Hashed password (bcrypt/argon2), never plain text.';
COMMENT ON COLUMN users.role IS 'Role of the user: admin, officer, or farmer.';
COMMENT ON COLUMN users.is_active IS 'Whether the user account is active.';
COMMENT ON COLUMN users.created_at IS 'Timestamp when the user was created.';
COMMENT ON COLUMN users.updated_at IS 'Timestamp when the user was last updated.';

CREATE TABLE land_cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farmer_id UUID NOT NULL REFERENCES users(id),
    officer_id UUID REFERENCES users(id),
    status VARCHAR(30) NOT NULL DEFAULT 'draft' CHECK (
        status IN (
            'draft',
            'submitted',
            'under_review',
            'approved',
            'rejected',
            'submitted_to_authority'
        )
    ),
    acquisition_type VARCHAR(50) NOT NULL,
    urgency_level VARCHAR(20) NOT NULL DEFAULT 'low' CHECK (
        urgency_level IN ('low', 'medium', 'high', 'critical')
    ),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE land_cases IS 'Land acquisition cases submitted for compensation.';
COMMENT ON COLUMN land_cases.id IS 'Primary key for land cases.';
COMMENT ON COLUMN land_cases.farmer_id IS 'User ID of the farmer who submitted the case.';
COMMENT ON COLUMN land_cases.officer_id IS 'User ID of the officer handling the case.';
COMMENT ON COLUMN land_cases.status IS 'Workflow status of the case.';
COMMENT ON COLUMN land_cases.acquisition_type IS 'Type of acquisition driving the land take.';
COMMENT ON COLUMN land_cases.urgency_level IS 'Urgency classification for case handling.';
COMMENT ON COLUMN land_cases.created_at IS 'Timestamp when the case was created.';
COMMENT ON COLUMN land_cases.updated_at IS 'Timestamp when the case was last updated.';

CREATE TABLE land_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID NOT NULL UNIQUE REFERENCES land_cases(id) ON DELETE CASCADE,
    state VARCHAR NOT NULL,
    district VARCHAR NOT NULL,
    taluk VARCHAR NOT NULL,
    village VARCHAR NOT NULL,
    pincode CHAR(6) NOT NULL,
    latitude NUMERIC(9, 6),
    longitude NUMERIC(9, 6),
    land_area_acres NUMERIC(8, 3) NOT NULL CHECK (land_area_acres > 0),
    gis_area_acres NUMERIC(8, 3),
    area_discrepancy_flag BOOLEAN DEFAULT FALSE,
    land_type VARCHAR(30) NOT NULL,
    soil_type VARCHAR(30) NOT NULL,
    irrigation_type VARCHAR(30) NOT NULL,
    water_availability_score SMALLINT CHECK (water_availability_score BETWEEN 1 AND 10),
    crop_type VARCHAR(50),
    crop_yield_per_acre NUMERIC(8, 2),
    season VARCHAR(20),
    distance_to_road_km NUMERIC(7, 2),
    distance_to_highway_km NUMERIC(7, 2),
    distance_to_city_km NUMERIC(7, 2),
    distance_to_market_km NUMERIC(7, 2),
    nearby_projects VARCHAR(50),
    avg_land_price_per_acre NUMERIC(14, 2) NOT NULL,
    guideline_value NUMERIC(14, 2) NOT NULL,
    previous_compensation NUMERIC(14, 2),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE land_details IS 'Detailed land, crop, and market data tied to a case.';
COMMENT ON COLUMN land_details.id IS 'Primary key for land details.';
COMMENT ON COLUMN land_details.case_id IS 'Case ID linked to these land details.';
COMMENT ON COLUMN land_details.state IS 'State where the land is located.';
COMMENT ON COLUMN land_details.district IS 'District where the land is located.';
COMMENT ON COLUMN land_details.taluk IS 'Taluk/tehsil where the land is located.';
COMMENT ON COLUMN land_details.village IS 'Village where the land is located.';
COMMENT ON COLUMN land_details.pincode IS '6-digit postal code for the land location.';
COMMENT ON COLUMN land_details.latitude IS 'Latitude coordinate for the land parcel.';
COMMENT ON COLUMN land_details.longitude IS 'Longitude coordinate for the land parcel.';
COMMENT ON COLUMN land_details.land_area_acres IS 'Declared land area in acres.';
COMMENT ON COLUMN land_details.gis_area_acres IS 'Verified GIS-measured area in acres.';
COMMENT ON COLUMN land_details.area_discrepancy_flag IS 'Flags mismatch between declared and GIS area.';
COMMENT ON COLUMN land_details.land_type IS 'Type of land: agricultural/residential/commercial/etc.';
COMMENT ON COLUMN land_details.soil_type IS 'Soil type classification.';
COMMENT ON COLUMN land_details.irrigation_type IS 'Primary irrigation source.';
COMMENT ON COLUMN land_details.water_availability_score IS 'Water availability score from 1 to 10.';
COMMENT ON COLUMN land_details.crop_type IS 'Primary crop type cultivated.';
COMMENT ON COLUMN land_details.crop_yield_per_acre IS 'Yield per acre in quintals.';
COMMENT ON COLUMN land_details.season IS 'Cultivation season.';
COMMENT ON COLUMN land_details.distance_to_road_km IS 'Distance to nearest road in kilometers.';
COMMENT ON COLUMN land_details.distance_to_highway_km IS 'Distance to nearest highway in kilometers.';
COMMENT ON COLUMN land_details.distance_to_city_km IS 'Distance to nearest city in kilometers.';
COMMENT ON COLUMN land_details.distance_to_market_km IS 'Distance to nearest market in kilometers.';
COMMENT ON COLUMN land_details.nearby_projects IS 'Nearby development projects impacting valuation.';
COMMENT ON COLUMN land_details.avg_land_price_per_acre IS 'Estimated average market land price per acre.';
COMMENT ON COLUMN land_details.guideline_value IS 'Government guideline value per acre.';
COMMENT ON COLUMN land_details.previous_compensation IS 'Historical compensation benchmark per acre.';
COMMENT ON COLUMN land_details.created_at IS 'Timestamp when the land details were created.';

CREATE TABLE compensation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID NOT NULL UNIQUE REFERENCES land_cases(id) ON DELETE CASCADE,
    market_value_per_acre NUMERIC(14, 2) NOT NULL,
    multiplier NUMERIC(4, 2) NOT NULL,
    solatium_per_acre NUMERIC(14, 2) NOT NULL,
    calculated_value NUMERIC(16, 2) NOT NULL,
    predicted_value NUMERIC(16, 2),
    final_value NUMERIC(16, 2),
    feature_importance JSONB,
    approval_status VARCHAR(20) DEFAULT 'pending' CHECK (
        approval_status IN ('pending', 'approved', 'rejected')
    ),
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE compensation IS 'Compensation calculations and approvals for a case.';
COMMENT ON COLUMN compensation.id IS 'Primary key for compensation.';
COMMENT ON COLUMN compensation.case_id IS 'Case ID linked to this compensation record.';
COMMENT ON COLUMN compensation.market_value_per_acre IS 'Market value per acre used for calculations.';
COMMENT ON COLUMN compensation.multiplier IS 'Rural/urban multiplier applied to market value.';
COMMENT ON COLUMN compensation.solatium_per_acre IS 'Solatium per acre (100% of market value).';
COMMENT ON COLUMN compensation.calculated_value IS 'Calculated compensation amount before adjustments.';
COMMENT ON COLUMN compensation.predicted_value IS 'Model-predicted compensation value.';
COMMENT ON COLUMN compensation.final_value IS 'Final approved compensation amount.';
COMMENT ON COLUMN compensation.feature_importance IS 'Model feature importance metadata.';
COMMENT ON COLUMN compensation.approval_status IS 'Approval status of the compensation record.';
COMMENT ON COLUMN compensation.approved_by IS 'User ID of the approving officer.';
COMMENT ON COLUMN compensation.approved_at IS 'Timestamp when approval occurred.';
COMMENT ON COLUMN compensation.created_at IS 'Timestamp when compensation was created.';
COMMENT ON COLUMN compensation.updated_at IS 'Timestamp when compensation was last updated.';

CREATE TABLE case_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID NOT NULL REFERENCES land_cases(id),
    changed_by UUID NOT NULL REFERENCES users(id),
    old_status VARCHAR(30),
    new_status VARCHAR(30) NOT NULL,
    notes TEXT,
    changed_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE case_audit_log IS 'Audit trail for case status changes.';
COMMENT ON COLUMN case_audit_log.id IS 'Primary key for audit log.';
COMMENT ON COLUMN case_audit_log.case_id IS 'Case ID whose status changed.';
COMMENT ON COLUMN case_audit_log.changed_by IS 'User ID who made the change.';
COMMENT ON COLUMN case_audit_log.old_status IS 'Previous status before change.';
COMMENT ON COLUMN case_audit_log.new_status IS 'New status after change.';
COMMENT ON COLUMN case_audit_log.notes IS 'Optional notes about the change.';
COMMENT ON COLUMN case_audit_log.changed_at IS 'Timestamp when the change was recorded.';

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_land_cases_farmer_id ON land_cases(farmer_id);
CREATE INDEX idx_land_cases_officer_id ON land_cases(officer_id);
CREATE INDEX idx_land_cases_status ON land_cases(status);
CREATE INDEX idx_land_details_case_id ON land_details(case_id);
CREATE INDEX idx_land_details_state_district ON land_details(state, district);
CREATE INDEX idx_compensation_case_status ON compensation(case_id, approval_status);
CREATE INDEX idx_case_audit_log_case_id ON case_audit_log(case_id);

CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_land_cases_updated_at
BEFORE UPDATE ON land_cases
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_compensation_updated_at
BEFORE UPDATE ON compensation
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TABLE token_blocklist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token_hash VARCHAR(64) UNIQUE NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE token_blocklist IS 'Blocklist for invalidated refresh tokens.';
COMMENT ON COLUMN token_blocklist.id IS 'Primary key for token blocklist.';
COMMENT ON COLUMN token_blocklist.token_hash IS 'SHA-256 hash of the refresh token.';
COMMENT ON COLUMN token_blocklist.expires_at IS 'Expiration time of the refresh token.';
COMMENT ON COLUMN token_blocklist.created_at IS 'Timestamp when the token was blocked.';

CREATE INDEX idx_token_blocklist_expires_at ON token_blocklist(expires_at);
