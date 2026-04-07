import json
import os
from datetime import datetime, timezone

import joblib
import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestRegressor
from sklearn.impute import SimpleImputer
from sklearn.metrics import (
    mean_absolute_error,
    mean_squared_error,
    r2_score,
)
from sklearn.model_selection import cross_val_score, train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler


FEATURE_COLUMNS = [
    "state",
    "district",
    "land_area_acres",
    "land_type",
    "soil_type",
    "irrigation_type",
    "water_availability_score",
    "crop_type",
    "crop_yield_per_acre",
    "season",
    "distance_to_road_km",
    "distance_to_highway_km",
    "distance_to_city_km",
    "distance_to_market_km",
    "nearby_projects",
    "avg_land_price_per_acre",
    "guideline_value",
    "previous_compensation",
    "acquisition_type",
    "urgency_level",
]

TARGET_COLUMN = "final_compensation_amount"


def _load_data(path):
    if not os.path.exists(path):
        raise FileNotFoundError(f"CSV not found at: {path}")
    df = pd.read_csv(path)
    missing = [col for col in FEATURE_COLUMNS + [TARGET_COLUMN] if col not in df.columns]
    if missing:
        raise ValueError(f"Missing required columns: {missing}")
    return df


def _build_pipeline(numerical_cols, categorical_cols):
    numerical_pipeline = Pipeline(
        steps=[
            ("imputer", SimpleImputer(strategy="median")),
            ("scaler", StandardScaler()),
        ]
    )

    categorical_pipeline = Pipeline(
        steps=[
            ("imputer", SimpleImputer(strategy="most_frequent")),
            (
                "encoder",
                OneHotEncoder(handle_unknown="ignore", sparse_output=False),
            ),
        ]
    )

    preprocessor = ColumnTransformer(
        transformers=[
            ("num", numerical_pipeline, numerical_cols),
            ("cat", categorical_pipeline, categorical_cols),
        ]
    )

    model = RandomForestRegressor(
        n_estimators=300,
        max_depth=20,
        min_samples_leaf=4,
        max_features="sqrt",
        random_state=42,
        n_jobs=-1,
    )

    pipeline = Pipeline(
        steps=[
            ("preprocessor", preprocessor),
            ("regressor", model),
        ]
    )
    return pipeline


def _get_feature_names(preprocessor, numerical_cols, categorical_cols):
    ohe = preprocessor.named_transformers_["cat"].named_steps["encoder"]
    ohe_features = ohe.get_feature_names_out(categorical_cols).tolist()
    return numerical_cols + ohe_features


def _metrics_table(metrics):
    lines = [
        "| Metric | Value |",
        "|---|---|",
        f"| R2 | {metrics['r2']:.4f} |",
        f"| MAE | {metrics['mae']:.2f} |",
        f"| RMSE | {metrics['rmse']:.2f} |",
        f"| MAPE | {metrics['mape']:.2f}% |",
        f"| CV R2 Mean | {metrics['cv_r2_mean']:.4f} |",
        f"| CV R2 Std | {metrics['cv_r2_std']:.4f} |",
    ]
    return "\n".join(lines)


def main():
    data_path = os.getenv(
        "ML_DATA_PATH", os.path.join("data", "synthetic_land_compensation.csv")
    )
    artefacts_dir = os.getenv("ML_ARTEFACTS_DIR", os.path.join("ml", "artefacts"))
    model_path = os.getenv(
        "ML_MODEL_PATH", os.path.join(artefacts_dir, "compensation_model.joblib")
    )
    metrics_path = os.getenv(
        "ML_METRICS_PATH", os.path.join(artefacts_dir, "metrics.json")
    )
    feature_importance_path = os.getenv(
        "ML_FEATURE_IMPORTANCE_PATH",
        os.path.join(artefacts_dir, "feature_importance.json"),
    )

    os.makedirs(artefacts_dir, exist_ok=True)

    df = _load_data(data_path)
    X = df[FEATURE_COLUMNS].copy()
    y = df[TARGET_COLUMN].copy()

    numerical_cols = X.select_dtypes(include=["number"]).columns.tolist()
    categorical_cols = [col for col in FEATURE_COLUMNS if col not in numerical_cols]

    pipeline = _build_pipeline(numerical_cols, categorical_cols)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    pipeline.fit(X_train, y_train)

    y_pred = pipeline.predict(X_test)
    r2 = r2_score(y_test, y_pred)
    mae = mean_absolute_error(y_test, y_pred)
    rmse = mean_squared_error(y_test, y_pred, squared=False)
    mape = np.mean(np.abs((y_test - y_pred) / y_test)) * 100

    cv_scores = cross_val_score(
        pipeline, X_train, y_train, cv=5, scoring="r2", n_jobs=-1
    )

    feature_names = _get_feature_names(
        pipeline.named_steps["preprocessor"], numerical_cols, categorical_cols
    )
    importances = pipeline.named_steps["regressor"].feature_importances_

    importance_records = [
        {"feature": name, "importance": float(score)}
        for name, score in zip(feature_names, importances)
    ]
    importance_records.sort(key=lambda x: x["importance"], reverse=True)
    top_20 = importance_records[:20]

    with open(feature_importance_path, "w", encoding="utf-8") as f:
        json.dump(top_20, f, indent=2)

    joblib.dump(pipeline, model_path)

    model_version = "v1.0-" + datetime.now(timezone.utc).strftime("%Y%m%d%H%M%S")
    metrics_payload = {
        "model_version": model_version,
        "training_timestamp": datetime.now(timezone.utc).isoformat(),
        "r2": float(r2),
        "mae": float(mae),
        "rmse": float(rmse),
        "mape": float(mape),
        "cv_r2_mean": float(cv_scores.mean()),
        "cv_r2_std": float(cv_scores.std()),
        "rows": int(len(df)),
    }

    with open(metrics_path, "w", encoding="utf-8") as f:
        json.dump(metrics_payload, f, indent=2)

    print("Training Summary")
    print(_metrics_table(metrics_payload))
    print(f"\nModel saved to: {model_path}")
    print(f"Metrics saved to: {metrics_path}")
    print(f"Feature importance saved to: {feature_importance_path}")


if __name__ == "__main__":
    main()
