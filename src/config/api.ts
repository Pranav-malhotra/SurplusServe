// API Configuration - Updated for production deployment
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://surplusserve-5xmz.onrender.com';

export const API_ENDPOINTS = {
  // Auth endpoints
  REGISTER: `${API_BASE_URL}/auth/register`,
  LOGIN: `${API_BASE_URL}/auth/login`,
  
  // Surplus listings
  SURPLUS_LISTINGS: `${API_BASE_URL}/surplus-listings`,
  MY_LISTINGS: `${API_BASE_URL}/surplus-listings/mine`,
  CLAIM_LISTING: (id: number) => `${API_BASE_URL}/surplus-listings/${id}/claim`,
  COLLECT_LISTING: (id: number) => `${API_BASE_URL}/surplus-listings/${id}/collect`,
  
  // Dashboard
  DASHBOARD_STATS: (userId: number) => `${API_BASE_URL}/dashboard/stats/${userId}`,
  RECENT_ACTIVITY: (userId: number) => `${API_BASE_URL}/dashboard/recent-activity/${userId}`,
  
  // Analytics
  USER_ANALYTICS: (userId: number) => `${API_BASE_URL}/analytics/user/${userId}`,
  PLATFORM_ANALYTICS: `${API_BASE_URL}/analytics/platform`,
  TRENDS_ANALYTICS: `${API_BASE_URL}/analytics/trends`,
  NGO_ANALYTICS: (ngoId: number) => `${API_BASE_URL}/analytics/ngo/${ngoId}`,
  
  // Predictive shorting
  PREDICTIVE_SHORTING: `${API_BASE_URL}/predictive-shorting`,
};

export default API_ENDPOINTS; 