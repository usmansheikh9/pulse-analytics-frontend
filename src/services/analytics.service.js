import api from './api'
import { ENDPOINTS } from '../config/endpoints'

export const analyticsService = {
  overview: () => api.get(ENDPOINTS.OVERVIEW),
  timeSeries: (hours) => api.get(ENDPOINTS.TIME_SERIES, { params: { hours } }),
  topPages: (limit) => api.get(ENDPOINTS.TOP_PAGES, { params: { limit } }),
  recentEvents: (limit) => api.get(ENDPOINTS.RECENT_EVENTS, { params: { limit } }),
  trafficByPage: (hours) => api.get(ENDPOINTS.TRAFFIC_BY_PAGE, { params: { hours } }),
  metricsHistory: (minutes) => api.get(ENDPOINTS.METRICS_HISTORY, { params: { minutes } }),
}
