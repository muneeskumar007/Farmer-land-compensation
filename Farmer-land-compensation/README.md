# Indian Land Compensation System — Integration Guide

**Quick Summary**
This repository integrates a Node.js backend (port 3000), a FastAPI ML service (port 8001), and PostgreSQL using Docker Compose. The ML service expects trained artefacts in `ml/artefacts/`.

**Prerequisites**
- Docker Desktop / Docker Engine
- Python 3.10+ (for training before container build)
- Node.js 20+ (optional, for local seed/commands)
- PostgreSQL client (`psql`) for migrations

**Clone And Setup**
1. Copy environment file and update secrets.
   ```bash
   cp backend/.env.example backend/.env
   ```
2. Edit `backend/.env` and set strong `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET`.

**Generate Dataset And Train ML Model**
Run training from repository root so relative paths resolve:
```bash
python ml/train.py
```
This generates:
- `ml/artefacts/compensation_model.joblib`
- `ml/artefacts/metrics.json`
- `ml/artefacts/feature_importance.json`

**Start Services**
```bash
docker compose up --build
```

**Run DB Migrations**
```bash
psql "postgresql://postgres:postgres@localhost:5432/land_compensation" -f schema.sql
```

**Seed Admin User**
```bash
docker compose exec backend node seed.js
```

**End-to-End Walkthrough**

Register a farmer:
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Ravi Kumar\",\"email\":\"ravi.farmer@example.com\",\"password\":\"StrongPass1!\",\"role\":\"farmer\"}"
```

Register an officer:
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Priya Singh\",\"email\":\"priya.officer@example.com\",\"password\":\"StrongPass1!\",\"role\":\"officer\"}"
```

Login as admin (created by seed):
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@example.com\",\"password\":\"ChangeMe123!\"}"
```

Admin assigns officer:
```bash
curl -X POST http://localhost:3000/cases/<CASE_ID>/assign \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ADMIN_ACCESS_TOKEN>" \
  -d "{\"officer_id\":\"<OFFICER_ID>\"}"
```

Farmer creates a case:
```bash
curl -X POST http://localhost:3000/cases \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <FARMER_ACCESS_TOKEN>" \
  -d "{\"acquisition_type\":\"highway\",\"urgency_level\":\"high\"}"
```

Officer adds land details:
```bash
curl -X POST http://localhost:3000/cases/<CASE_ID>/land-details \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <OFFICER_ACCESS_TOKEN>" \
  -d "{\"state\":\"Maharashtra\",\"district\":\"Pune\",\"taluk\":\"Haveli\",\"village\":\"Kondhwa\",\"pincode\":\"411048\",\"latitude\":18.457,\"longitude\":73.889,\"land_area_acres\":12.5,\"gis_area_acres\":11.9,\"land_type\":\"agricultural\",\"soil_type\":\"black\",\"irrigation_type\":\"canal\",\"water_availability_score\":8,\"crop_type\":\"paddy\",\"crop_yield_per_acre\":23.4,\"season\":\"kharif\",\"distance_to_road_km\":2.2,\"distance_to_highway_km\":15.4,\"distance_to_city_km\":35.1,\"distance_to_market_km\":6.8,\"nearby_projects\":\"highway\",\"avg_land_price_per_acre\":1800000,\"guideline_value\":1400000,\"previous_compensation\":1500000}"
```

Officer triggers calculation:
```bash
curl -X POST http://localhost:3000/compensation/calculate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <OFFICER_ACCESS_TOKEN>" \
  -d "{\"case_id\":\"<CASE_ID>\"}"
```

Officer triggers prediction:
```bash
curl -X POST http://localhost:3000/compensation/predict \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <OFFICER_ACCESS_TOKEN>" \
  -d "{\"case_id\":\"<CASE_ID>\"}"
```

Officer reviews and approves:
```bash
curl -X POST http://localhost:3000/cases/<CASE_ID>/approve \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <OFFICER_ACCESS_TOKEN>" \
  -d "{\"final_value\":47200000,\"notes\":\"Approved after review.\"}"
```

Officer submits to authority:
```bash
curl -X POST http://localhost:3000/cases/<CASE_ID>/submit-to-authority \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <OFFICER_ACCESS_TOKEN>"
```

View final report JSON:
```bash
curl -X POST http://localhost:3000/cases/<CASE_ID>/submit-to-authority \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <OFFICER_ACCESS_TOKEN>"
```
