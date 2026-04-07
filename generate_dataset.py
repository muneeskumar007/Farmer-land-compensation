# SYNTHETIC DATA — NOT REAL LAND RECORDS
# Monetary values are in Indian Rupees (₹).

import os

import numpy as np
import pandas as pd
from faker import Faker


def _state_configs():
    states = [
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

    districts = {
        "Maharashtra": [
            "Pune",
            "Nagpur",
            "Nashik",
            "Aurangabad",
            "Kolhapur",
        ],
        "Tamil Nadu": [
            "Chennai",
            "Coimbatore",
            "Madurai",
            "Tiruchirappalli",
            "Salem",
        ],
        "Uttar Pradesh": [
            "Lucknow",
            "Kanpur",
            "Varanasi",
            "Agra",
            "Prayagraj",
        ],
        "Rajasthan": [
            "Jaipur",
            "Jodhpur",
            "Udaipur",
            "Kota",
            "Bikaner",
        ],
        "Karnataka": [
            "Bengaluru Urban",
            "Mysuru",
            "Hubballi-Dharwad",
            "Belagavi",
            "Mangaluru",
        ],
        "Telangana": [
            "Hyderabad",
            "Warangal",
            "Nizamabad",
            "Karimnagar",
            "Khammam",
        ],
        "Gujarat": [
            "Ahmedabad",
            "Surat",
            "Vadodara",
            "Rajkot",
            "Bhavnagar",
        ],
        "West Bengal": [
            "Kolkata",
            "Howrah",
            "Darjeeling",
            "Siliguri",
            "Bardhaman",
        ],
        "Madhya Pradesh": [
            "Bhopal",
            "Indore",
            "Gwalior",
            "Jabalpur",
            "Ujjain",
        ],
        "Punjab": [
            "Ludhiana",
            "Amritsar",
            "Jalandhar",
            "Patiala",
            "Bathinda",
        ],
    }

    pincode_prefix = {
        "Maharashtra": (40, 41),
        "Tamil Nadu": (60, 64),
        "Uttar Pradesh": (20, 28),
        "Rajasthan": (30, 34),
        "Karnataka": (56, 59),
        "Telangana": (50, 51),
        "Gujarat": (36, 39),
        "West Bengal": (70, 74),
        "Madhya Pradesh": (45, 48),
        "Punjab": (14, 15),
    }

    bounding_boxes = {
        "Maharashtra": (15.6, 22.1, 72.6, 80.9),
        "Tamil Nadu": (8.0, 13.6, 76.2, 80.5),
        "Uttar Pradesh": (23.8, 30.4, 77.0, 84.7),
        "Rajasthan": (23.0, 30.2, 69.5, 78.3),
        "Karnataka": (11.5, 18.5, 74.0, 78.6),
        "Telangana": (15.8, 19.9, 77.0, 81.6),
        "Gujarat": (20.0, 24.7, 68.0, 74.6),
        "West Bengal": (21.5, 27.3, 86.3, 89.9),
        "Madhya Pradesh": (21.1, 26.9, 74.0, 82.0),
        "Punjab": (29.5, 32.6, 73.8, 76.9),
    }

    base_price_ranges = {
        "Maharashtra": (800000, 5000000),
        "Tamil Nadu": (600000, 3500000),
        "Uttar Pradesh": (300000, 1500000),
        "Rajasthan": (200000, 1200000),
        "Karnataka": (700000, 4000000),
        "Telangana": (600000, 3000000),
        "Gujarat": (500000, 2500000),
        "West Bengal": (400000, 2000000),
        "Madhya Pradesh": (200000, 1000000),
        "Punjab": (800000, 3500000),
    }

    return states, districts, pincode_prefix, bounding_boxes, base_price_ranges


def _random_pincode(state, pincode_prefix):
    prefix_min, prefix_max = pincode_prefix[state]
    prefix = np.random.randint(prefix_min, prefix_max + 1)
    suffix = np.random.randint(0, 10000)
    return int(f"{prefix}{suffix:04d}")


def _random_coordinate(state, bounding_boxes):
    lat_min, lat_max, lon_min, lon_max = bounding_boxes[state]
    lat = np.random.uniform(lat_min, lat_max)
    lon = np.random.uniform(lon_min, lon_max)
    return lat, lon


def _water_score(irrigation_type):
    if irrigation_type in {"canal", "drip", "borewell"}:
        return int(np.random.randint(6, 11))
    if irrigation_type == "rainfed":
        return int(np.random.randint(3, 8))
    return int(np.random.randint(1, 5))


def _crop_yield(crop_type):
    ranges = {
        "paddy": (15, 35),
        "wheat": (12, 25),
        "sugarcane": (200, 400),
        "cotton": (8, 18),
        "soybean": (10, 20),
        "groundnut": (8, 16),
        "maize": (12, 30),
        "vegetables": (40, 120),
        "fallow": (0, 2),
    }
    low, high = ranges[crop_type]
    return float(np.round(np.random.uniform(low, high), 2))


def generate_dataset(row_count=5000):
    np.random.seed(42)
    fake = Faker("en_IN")
    fake.seed_instance(42)

    states, districts, pincode_prefix, bounding_boxes, base_price_ranges = _state_configs()

    land_types = ["agricultural", "residential", "commercial", "waste", "forest"]
    soil_types = ["black", "red", "alluvial", "laterite", "sandy", "loamy"]
    irrigation_types = ["canal", "borewell", "rainfed", "drip", "none"]
    crop_types = [
        "paddy",
        "wheat",
        "sugarcane",
        "cotton",
        "soybean",
        "groundnut",
        "maize",
        "vegetables",
        "fallow",
    ]
    seasons = ["kharif", "rabi", "zaid", "perennial"]
    nearby_projects = ["none", "highway", "industrial_zone", "smart_city", "railway", "airport"]
    acquisition_types = [
        "highway",
        "railway",
        "defence",
        "smart_city",
        "irrigation_project",
        "industrial",
    ]
    urgency_levels = ["low", "medium", "high", "critical"]

    rows = []

    for _ in range(row_count):
        state = np.random.choice(states)
        district = np.random.choice(districts[state])
        taluk = fake.city()
        village = fake.street_name()
        pincode = _random_pincode(state, pincode_prefix)
        latitude, longitude = _random_coordinate(state, bounding_boxes)

        land_area_acres = float(np.round(np.random.uniform(0.5, 50.0), 3))
        land_type = np.random.choice(land_types)
        soil_type = np.random.choice(soil_types)
        irrigation_type = np.random.choice(irrigation_types)
        water_score = _water_score(irrigation_type)

        crop_type = np.random.choice(crop_types)
        crop_yield = _crop_yield(crop_type)
        season = np.random.choice(seasons)

        distance_to_road = float(np.round(np.random.uniform(0.1, 30.0), 2))
        distance_to_highway = float(np.round(np.random.uniform(0.5, 80.0), 2))
        distance_to_city = float(np.round(np.random.uniform(1.0, 200.0), 2))
        distance_to_market = float(np.round(np.random.uniform(0.5, 50.0), 2))
        nearby_project = np.random.choice(nearby_projects, p=[0.5, 0.12, 0.12, 0.1, 0.08, 0.08])

        base_min, base_max = base_price_ranges[state]
        base_price = np.random.uniform(base_min, base_max)
        distance_factor = max(1.0 - 0.004 * distance_to_city, 0.2)
        avg_land_price = base_price * distance_factor
        if nearby_project != "none":
            avg_land_price *= 1.15
        if irrigation_type in {"canal", "drip"}:
            avg_land_price *= 1.10
        avg_land_price = float(np.round(avg_land_price, 2))

        guideline_value = float(np.round(avg_land_price * np.random.uniform(0.6, 0.95), 2))
        if np.random.rand() > 0.3:
            previous_compensation = float(
                np.round(avg_land_price * np.random.uniform(0.8, 1.2), 2)
            )
        else:
            previous_compensation = np.nan

        market_value = max(avg_land_price, guideline_value)
        multiplier = 2.0 if distance_to_city > 50 else 1.0
        solatium = market_value
        base_comp = (market_value * multiplier * land_area_acres) + (
            solatium * land_area_acres
        )
        noise = np.random.normal(0.0, 0.05)
        final_comp = base_comp * (1.0 + noise)
        final_comp = float(np.round(max(final_comp, 50000.0), 2))

        rows.append(
            {
                "record_label": "SYNTHETIC",
                "state": state,
                "district": district,
                "taluk": taluk,
                "village": village,
                "pincode": pincode,
                "latitude": float(np.round(latitude, 6)),
                "longitude": float(np.round(longitude, 6)),
                "land_area_acres": land_area_acres,
                "land_type": land_type,
                "soil_type": soil_type,
                "irrigation_type": irrigation_type,
                "water_availability_score": water_score,
                "crop_type": crop_type,
                "crop_yield_per_acre": crop_yield,
                "season": season,
                "distance_to_road_km": distance_to_road,
                "distance_to_highway_km": distance_to_highway,
                "distance_to_city_km": distance_to_city,
                "distance_to_market_km": distance_to_market,
                "nearby_projects": nearby_project,
                "avg_land_price_per_acre": avg_land_price,
                "guideline_value": guideline_value,
                "previous_compensation": previous_compensation,
                "acquisition_type": np.random.choice(acquisition_types),
                "urgency_level": np.random.choice(urgency_levels),
                "market_value": float(np.round(market_value, 2)),
                "multiplier": multiplier,
                "solatium": float(np.round(solatium, 2)),
                "final_compensation_amount": final_comp,
            }
        )

    df = pd.DataFrame(rows)
    os.makedirs("data", exist_ok=True)
    output_path = os.path.join("data", "synthetic_land_compensation.csv")
    df.to_csv(output_path, index=False)
    return df


if __name__ == "__main__":
    generate_dataset()
