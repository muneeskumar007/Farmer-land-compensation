import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  timeout: 8000
});

api.interceptors.request.use((config) => {
  const stored = localStorage.getItem("ldss_auth");
  if (stored) {
    const parsed = JSON.parse(stored);
    const token = parsed?.tokens?.accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export async function loginUser(payload) {
  const response = await api.post("/auth/login", payload);
  return response.data;
}

export async function registerUser(payload) {
  const response = await api.post("/auth/register", payload);
  return response.data;
}

export async function getCases(params = {}) {
  const response = await api.get("/cases", { params });
  return response.data;
}

export async function createCase(payload) {
  const response = await api.post("/cases", payload);
  return response.data;
}

export async function calculateCompensation(caseId) {
  const response = await api.post("/compensation/calculate", { case_id: caseId });
  return response.data;
}

export async function predictCompensation(caseId) {
  const response = await api.post("/compensation/predict", { case_id: caseId });
  return response.data;
}

export default api;
