import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 15000
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// On invalid/expired sessions, drop the stale identity, silently acquire a
// fresh guest session and retry the original request once.
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const cfg = err.config;
    if (
      err.response &&
      err.response.status === 401 &&
      cfg &&
      !cfg._retry &&
      !cfg.url.includes('/auth/')
    ) {
      cfg._retry = true;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      try {
        const { data } = await api.post('/auth/guest');
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        cfg.headers.Authorization = `Bearer ${data.token}`;
        return api(cfg);
      } catch {
        /* guest mint failed — surface the original error */
      }
    }
    return Promise.reject(err);
  }
);

export default api;
