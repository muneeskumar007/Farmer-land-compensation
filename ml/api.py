import json
import os
import sys
import time
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from typing import List, Optional

import joblib
import numpy as np
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field, ValidationError, field_validator


VALID_STATES = [
    "Maharashtra",
    "Tamil Nadu",
    "Uttar Pradesh",
    "Rajasthan",
    "Karnataka",
    "Telangana",
    "Gujarat",
    "West Bengal",
    "Madhya Pradesh",
    "Punjab",
]


def _log_error(message, detail):
    timestamp = datetime.now(timezone.utc).isoformat()
    print(f"[{timestamp}] ERROR: {message} | {detail}", file=sys.stderr)


class PredictionRequest(BaseModel):
    state: str = Field(..., description="Indian state", example="Maharashtra")
    district: str = Field(..., description="District name", example="Pune")
    land_area_acres: float = Field(..., description="Land area in acres", example=12.5)
    land_type: str = Field(..., description="Land type", example="agricultural")
    soil_type: str = Field(..., description="Soil type", example="black")
    irrigation_type: str = Field(..., description="Irrigation type", example="canal")
    water_availability_score: int = Field(
        ..., description="Water availability score (1-10)", example=8
    )
    crop_type: str = Field(..., description="Crop type", example="paddy")
    crop_yield_per_acre: float = Field(
        ..., description="Crop yield per acre (quintals)", example=22.5
    )
    season: str = Field(..., description="Season", example="kharif")
    distance_to_road_km: float = Field(..., description="Distance to road (km)", example=2.5)
    distance_to_highway_km: float = Field(
        ..., description="Distance to highway (km)", example=15.0
    )
    distance_to_city_km: float = Field(..., description="Distance to city (km)", example=35.0)
    distance_to_market_km: float = Field(
        ..., description="Distance to market (km)", example=8.0
    )
    nearby_projects: str = Field(..., description="Nearby projects", example="highway")
    avg_land_price_per_acre: float = Field(
        ..., description="Average land price per acre (INR)", example=1500000.0
    )
    guideline_value: float = Field(
        ..., description="Guideline value per acre (INR)", example=1200000.0
    )
    previous_compensation: Optional[float] = Field(
        None, description="Previous compensation per acre (INR)", example=1300000.0
    )
    acquisition_type: str = Field(..., description="Acquisition type", example="highway")
    urgency_level: str = Field(..., description="Urgency level", example="medium")

    @field_validator("land_area_acres")
    @classmethod
    def _land_area_positive(cls, value):
        if value <= 0:
            raise ValueError("land_area_acres must be greater than 0")
        return value

    @field_validator("water_availability_score")
    @classmethod
    def _water_score_range(cls, value):
        if value < 1 or value > 10:
            raise ValueError("water_availability_score must be between 1 and 10")
        return value

    @field_validator("state")
    @classmethod
    def _state_valid(cls, value):
        if value not in VALID_STATES:
            raise ValueError("state must be one of the valid Indian states")
        return value


class PredictionResponse(BaseModel):
    predicted_compensation: float
    predicted_per_acre: float
    confidence_interval: dict
    top_features: List[dict]
    model_version: str
    prediction_timestamp: str


@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.start_time = time.time()
    app.state.model = None
    app.state.feature_importance = []
    app.state.metrics = {}

    model_path = os.getenv("ML_MODEL_PATH") or os.getenv("MODEL_PATH") or os.path.join(
        "ml", "artefacts", "compensation_model.joblib"
    )
    metrics_path = os.getenv(
        "ML_METRICS_PATH", os.path.join("ml", "artefacts", "metrics.json")
    )
    feature_importance_path = os.getenv(
        "ML_FEATURE_IMPORTANCE_PATH",
        os.path.join("ml", "artefacts", "feature_importance.json"),
    )

    try:
        if os.path.exists(model_path):
            app.state.model = joblib.load(model_path)
        if os.path.exists(metrics_path):
            with open(metrics_path, "r", encoding="utf-8") as f:
                app.state.metrics = json.load(f)
        if os.path.exists(feature_importance_path):
            with open(feature_importance_path, "r", encoding="utf-8") as f:
                app.state.feature_importance = json.load(f)
    except Exception as exc:
        _log_error("Failed to load model artefacts", exc)
        app.state.model = None

    yield


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def _ensure_model_loaded():
    if app.state.model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")


def _predict_single(payload: PredictionRequest):
    data = payload.model_dump()
    model = app.state.model
    input_df = pd.DataFrame([data])
    pred = model.predict(input_df)[0]

    estimators = model.named_steps["regressor"].estimators_
    transformed = model.named_steps["preprocessor"].transform(input_df)
    tree_preds = np.array([tree.predict(transformed)[0] for tree in estimators])
    std = float(np.std(tree_preds))
    lower = float(pred - std)
    upper = float(pred + std)

    top_features = app.state.feature_importance[:5] if app.state.feature_importance else []
    model_version = app.state.metrics.get("model_version", "unknown")
    timestamp = datetime.now(timezone.utc).isoformat()

    return {
        "predicted_compensation": float(pred),
        "predicted_per_acre": float(pred / payload.land_area_acres),
        "confidence_interval": {"lower": lower, "upper": upper},
        "top_features": top_features,
        "model_version": model_version,
        "prediction_timestamp": timestamp,
    }


@app.get("/health")
def health_check():
    uptime = time.time() - app.state.start_time
    return {
        "status": "ok",
        "model_loaded": app.state.model is not None,
        "uptime_seconds": float(round(uptime, 2)),
    }


@app.get("/feature-importance")
def feature_importance():
    _ensure_model_loaded()
    return app.state.feature_importance


@app.post("/predict", response_model=PredictionResponse)
def predict(payload: PredictionRequest):
    try:
        _ensure_model_loaded()
        return _predict_single(payload)
    except HTTPException as exc:
        raise exc
    except Exception as exc:
        _log_error("Prediction failed", exc)
        return JSONResponse(
            status_code=500,
            content={"error": "prediction_failed", "detail": str(exc)},
        )


@app.post("/batch-predict")
def batch_predict(payloads: List[PredictionRequest]):
    try:
        _ensure_model_loaded()
        if len(payloads) > 100:
            raise HTTPException(status_code=422, detail="Batch size must be <= 100")
        return [_predict_single(item) for item in payloads]
    except HTTPException as exc:
        raise exc
    except Exception as exc:
        _log_error("Batch prediction failed", exc)
        return JSONResponse(
            status_code=500,
            content={"error": "batch_prediction_failed", "detail": str(exc)},
        )


@app.exception_handler(RequestValidationError)
def request_validation_exception_handler(_, exc: RequestValidationError):
    _log_error("Validation error", exc)
    return JSONResponse(status_code=422, content={"detail": exc.errors()})


@app.exception_handler(ValidationError)
def validation_exception_handler(_, exc: ValidationError):
    _log_error("Validation error", exc)
    return JSONResponse(status_code=422, content={"detail": exc.errors()})


if __name__ == "__main__":
    import uvicorn

    port = int(os.getenv("ML_SERVICE_PORT", "8001"))
    uvicorn.run("ml.api:app", host="0.0.0.0", port=port, reload=False)
