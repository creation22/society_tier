import api from './api.js';

/** City-wide Gurugram AQI (same reading everywhere in the city). */
export async function fetchAqi() {
  const { data } = await api.get('/aqi');
  return data; // { aqi, city, time, dominant, pollutants }
}

/** CPCB/US-style bands mapped to the site's brutal palette. */
export function aqiCategory(aqi) {
  if (aqi == null) return null;
  if (aqi <= 50) return { label: 'Good', color: '#06D6A0', advice: 'Air quality is satisfactory — enjoy the outdoors.' };
  if (aqi <= 100) return { label: 'Moderate', color: '#FFD60A', advice: 'Acceptable for most; very sensitive groups may notice.' };
  if (aqi <= 150) return { label: 'Unhealthy for Sensitive', color: '#FF6B35', advice: 'Sensitive groups should limit outdoor exertion.' };
  if (aqi <= 200) return { label: 'Unhealthy', color: '#EF233C', advice: 'Everyone may feel effects — reduce outdoor activity.' };
  if (aqi <= 300) return { label: 'Very Unhealthy', color: '#9D4EDD', advice: 'Health alert: avoid prolonged outdoor exertion.' };
  return { label: 'Hazardous', color: '#7B1113', advice: 'Emergency conditions — stay indoors.' };
}
