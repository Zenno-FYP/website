import axios, { AxiosError, AxiosResponse } from 'axios';
import { useAuthStore } from '@/stores/authStore';
import { invalidateCacheOnAuthChange } from '@/utils/requestCache';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:3000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Request interceptor - add Firebase token to all requests
api.interceptors.request.use(
  async (config) => {
    try {
      const { firebaseUser } = useAuthStore.getState();

      if (!firebaseUser) {
        console.warn('No Firebase user available for request');
        return config;
      }

      const token = await firebaseUser.getIdToken(false);
      // Uncomment to log token on every API call - helpful for debugging specific requests
      // console.log('🔐 API Request Token:', token.substring(0, 50) + '...');
      config.headers.Authorization = `Bearer ${token}`;
    } catch (error) {
      console.error('Failed to get Firebase token:', error);
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
      // Token expired or invalid - logout user and clear cache
      invalidateCacheOnAuthChange();
      useAuthStore.getState().logout();
    }

    return Promise.reject(error);
  }
);

// ============= Performance Metrics Types =============
export interface PerformanceMetric {
  value: number;
  change_percent: number;
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

// ============= Tool Usage Types =============
export interface TopApp {
  name: string;
  duration_hours: number;
  percent_of_total: number;
  change_percent: number;
}

export interface TopAppsResponse {
  total_usage_hours: number;
  usage_increase_from_yesterday_percent: number;
  apps: TopApp[];
}

export interface LanguageSummary {
  total_lines_of_code: number;
  total_files: number;
  total_languages_used: number;
}

export interface Language {
  name: string;
  percent: number;
  loc: number;
  files: number;
}

export interface LanguageDistribution {
  summary: LanguageSummary;
  languages: Language[];
}

export interface ToolUsageResponse {
  period: string;
  top_apps: TopAppsResponse;
  language_distribution: LanguageDistribution;
}

// ============= Tool Usage API =============
export async function fetchToolUsage(): Promise<ToolUsageResponse> {
  const response = await api.get<ToolUsageResponse>('/dashboard/tool-usage');
  return response.data;
}

// ============= Project Insights Types =============
export interface Skill {
  name: string;
  percent: number;
}

export interface ProjectDetail {
  name: string;
  last_active: string; // ISO 8601 string in local timezone (no Z)
}

export interface ProjectInsightsResponse {
  strongest_skills: Skill[];
  current_projects: ProjectDetail[];
}

// ============= Project Insights API =============
export async function fetchProjectInsights(): Promise<ProjectInsightsResponse> {
  const response = await api.get<ProjectInsightsResponse>('/dashboard/project-insights');
  return response.data;
}

export default api;
