import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor
api.interceptors.request.use(config => {
  const user = localStorage.getItem('agri_user');
  if (user) {
    config.headers.Authorization = `Bearer ${JSON.parse(user).token || 'mock-token'}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('agri_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// --- Mock data for frontend demo ---
const delay = ms => new Promise(r => setTimeout(r, ms));

const MOCK_LANDS = [
  { id: 1, farmerId: 1, farmerName: 'Rajesh Kumar', location: 'Thanjavur, Tamil Nadu', coordinates: [10.787, 79.139], size: 5.2, soilType: 'Alluvial', cropType: 'Rice', infrastructure: 'Highway', govtValue: 850000, mlValue: 1120000, status: 'pending', submittedAt: '2025-03-10', explanation: 'Fertile alluvial soil with high agricultural productivity near national highway increases market value significantly.' },
  { id: 2, farmerId: 3, farmerName: 'Muthu Selvam', location: 'Madurai, Tamil Nadu', coordinates: [9.925, 78.119], size: 3.8, soilType: 'Red Laterite', cropType: 'Cotton', infrastructure: 'Railway', govtValue: 620000, mlValue: 780000, status: 'approved', submittedAt: '2025-02-28', explanation: 'Red laterite soil suitable for cotton with railway connectivity adding transport value premium.' },
  { id: 3, farmerId: 4, farmerName: 'Lakshmi Devi', location: 'Coimbatore, Tamil Nadu', coordinates: [11.017, 76.955], size: 7.1, soilType: 'Black Cotton', cropType: 'Sugarcane', infrastructure: 'Both', govtValue: 1100000, mlValue: 1480000, status: 'pending', submittedAt: '2025-03-05', explanation: 'Black cotton soil with dual infrastructure access near industrial hub commands premium valuation.' },
  { id: 4, farmerId: 5, farmerName: 'Suresh Babu', location: 'Salem, Tamil Nadu', coordinates: [11.664, 78.146], size: 2.5, soilType: 'Sandy Loam', cropType: 'Groundnut', infrastructure: 'None', govtValue: 380000, mlValue: 420000, status: 'rejected', submittedAt: '2025-01-20', explanation: 'Sandy loam with limited infrastructure access results in standard market valuation.' },
  { id: 5, farmerId: 6, farmerName: 'Arumugam P', location: 'Tirunelveli, Tamil Nadu', coordinates: [8.727, 77.694], size: 4.5, soilType: 'Alluvial', cropType: 'Banana', infrastructure: 'Highway', govtValue: 720000, mlValue: 950000, status: 'approved', submittedAt: '2025-02-15', explanation: 'Alluvial soil near perennial river ideal for banana cultivation, highway access boosts market accessibility.' },
];

// --- Service functions ---

export const landService = {
  async predict(formData) {
    try {
      const res = await api.post('/predict', formData);
      return res.data;
    } catch {
      // Mock prediction
      await delay(1800);
      const base = formData.size * 150000;
      const soilMultiplier = { Alluvial: 1.3, 'Black Cotton': 1.25, 'Red Laterite': 1.1, 'Sandy Loam': 0.95, Clay: 1.05 }[formData.soilType] || 1;
      const infraMultiplier = { Highway: 1.2, Railway: 1.15, Both: 1.35, None: 1.0 }[formData.infrastructure] || 1;
      const mlValue = Math.round(base * soilMultiplier * infraMultiplier);
      const govtValue = Math.round(mlValue * 0.78);
      return {
        mlValue, govtValue,
        confidence: 87 + Math.round(Math.random() * 8),
        explanation: `The ML model analyzed ${formData.location} land with ${formData.soilType} soil covering ${formData.size} acres. ${formData.soilType} soil shows ${soilMultiplier > 1.2 ? 'high' : 'moderate'} agricultural productivity. ${formData.infrastructure !== 'None' ? `${formData.infrastructure} connectivity adds ${Math.round((infraMultiplier - 1) * 100)}% value premium.` : 'No major infrastructure nearby limits premium.'} Crop suitability for ${formData.cropType} further supports valuation.`,
        factors: [
          { name: 'Soil Quality', weight: 35, impact: soilMultiplier > 1.2 ? 'High' : 'Medium' },
          { name: 'Infrastructure', weight: 25, impact: infraMultiplier > 1.2 ? 'High' : infraMultiplier > 1 ? 'Medium' : 'Low' },
          { name: 'Land Size', weight: 20, impact: formData.size > 5 ? 'High' : 'Medium' },
          { name: 'Crop Suitability', weight: 20, impact: 'Medium' },
        ],
        historicalTrend: [
          { year: '2020', value: Math.round(mlValue * 0.72) },
          { year: '2021', value: Math.round(mlValue * 0.79) },
          { year: '2022', value: Math.round(mlValue * 0.86) },
          { year: '2023', value: Math.round(mlValue * 0.92) },
          { year: '2024', value: Math.round(mlValue * 0.97) },
          { year: '2025', value: mlValue },
        ],
      };
    }
  },

  async getLands() {
    try {
      const res = await api.get('/lands');
      return res.data;
    } catch {
      await delay(600);
      return MOCK_LANDS;
    }
  },

  async submitLand(data) {
    try {
      const res = await api.post('/lands', data);
      return res.data;
    } catch {
      await delay(800);
      return { ...data, id: Date.now(), status: 'pending', submittedAt: new Date().toISOString().split('T')[0] };
    }
  },

  async updateStatus(id, status) {
    try {
      const res = await api.patch(`/lands/${id}/status`, { status });
      return res.data;
    } catch {
      await delay(400);
      return { id, status };
    }
  },
};

export default api;
