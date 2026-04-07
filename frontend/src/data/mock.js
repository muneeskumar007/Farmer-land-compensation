export const cases = [
  {
    id: "CASE-2026-001",
    farmer: "Ravi Kumar",
    district: "Pune",
    status: "under_review",
    landArea: 12.5,
    compensation: 47200000
  },
  {
    id: "CASE-2026-002",
    farmer: "Lakshmi Devi",
    district: "Coimbatore",
    status: "approved",
    landArea: 8.4,
    compensation: 35500000
  },
  {
    id: "CASE-2026-003",
    farmer: "Amit Singh",
    district: "Lucknow",
    status: "submitted",
    landArea: 15.1,
    compensation: 49800000
  }
];

export const analytics = {
  compensationByDistrict: [
    { name: "Pune", value: 4.7 },
    { name: "Coimbatore", value: 3.5 },
    { name: "Lucknow", value: 4.9 },
    { name: "Jaipur", value: 3.1 }
  ],
  priceTrends: [
    { month: "Jan", price: 2.4 },
    { month: "Feb", price: 2.6 },
    { month: "Mar", price: 2.9 },
    { month: "Apr", price: 3.1 },
    { month: "May", price: 3.4 }
  ],
  distribution: [
    { name: "Approved", value: 42 },
    { name: "Under Review", value: 28 },
    { name: "Submitted", value: 20 },
    { name: "Rejected", value: 10 }
  ]
};

export const featureImportance = [
  { feature: "avg_land_price_per_acre", importance: 0.32 },
  { feature: "land_area_acres", importance: 0.18 },
  { feature: "distance_to_city_km", importance: 0.11 },
  { feature: "guideline_value", importance: 0.08 },
  { feature: "irrigation_type_canal", importance: 0.06 }
];

export const caseDetail = {
  id: "CASE-2026-001",
  farmer: "Ravi Kumar",
  status: "under_review",
  landArea: 12.5,
  district: "Pune",
  acquisitionType: "Highway",
  compensation: {
    marketValue: 1800000,
    multiplier: 1,
    solatium: 1800000,
    calculated: 45000000,
    predicted: 46750000,
    finalValue: 47200000
  }
};
