import axios, { AxiosError, AxiosResponse } from 'axios';
import { useAuthStore } from '@/stores/authStore';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:3000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Request interceptor - add Firebase token to all requests
api.interceptors.request.use(
  async (config) => {
    const { firebaseUser } = useAuthStore.getState();

    if (firebaseUser) {
      try {
        const token = await firebaseUser.getIdToken(false);
        config.headers.Authorization = `Bearer ${token}`;
      } catch (error) {
        console.error('Failed to get Firebase token:', error);
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors globally
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - logout user
      useAuthStore.getState().logout();
    }

    return Promise.reject(error);
  }
);

// ============= Performance Metrics Types =============
export interface PerformanceMetric {
  value: number;
  unit: string;
  change_percent: number;
  trend: 'up' | 'down' | 'neutral';
}

export interface UsageTrendDay {
  date: string;
  day_name: string;
  focused_hours: number;
  reading_hours: number;
  distracted_hours: number;
  idle_hours: number;
  total_active_hours: number;
}

export interface PerformanceMetricsResponse {
  period: string;
  sync_timestamp: string;
  performance_summary: {
    wpm: PerformanceMetric;
    daily_active_average: PerformanceMetric;
    total_clicks: PerformanceMetric;
    total_scrolls: PerformanceMetric;
  };
  usage_trend_graph: UsageTrendDay[];
}

// ============= Performance Metrics API =============
export async function fetchPerformanceMetrics(): Promise<PerformanceMetricsResponse> {
  const response = await api.get<PerformanceMetricsResponse>('/dashboard/performance-metrics');
  return response.data;
}

export default api;
