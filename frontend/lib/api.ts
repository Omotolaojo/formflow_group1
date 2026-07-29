const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

export const api = {
  claims: `${API_URL}/api/claims`,
  approve: `${API_URL}/api/approve`,
  process: `${API_URL}/api/process`,
  health: `${API_URL}/api/health`,
};

export default API_URL;