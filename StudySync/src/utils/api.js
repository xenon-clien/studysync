const resolveApiUrl = () => {
  // 1. Explicit environment variable set at build/deploy time (e.g. in Vercel Project Settings)
  if (import.meta.env.VITE_API_URL) {
    const raw = import.meta.env.VITE_API_URL.trim().replace(/\/+$/, '');
    return raw.endsWith('/api') ? raw : `${raw}/api`;
  }

  // 2. Client-side browser fallback
  if (typeof window !== 'undefined') {
    const { hostname, protocol } = window.location;
    // Local development
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return `${protocol}//${hostname}:3001/api`;
    }
    // Deployed on Vercel / cloud without VITE_API_URL
    return '/api';
  }

  return 'http://localhost:3001/api';
};

const API_URL = resolveApiUrl();

async function parseResponse(response) {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

export const apiFetch = async (endpoint, options = {}, _retried = false) => {
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${API_URL}${endpoint}`, {
      credentials: 'include',
      ...options,
      headers,
    });
  } catch (netErr) {
    if (netErr?.name === 'TypeError' || (netErr?.message && netErr.message.toLowerCase().includes('fetch'))) {
      const isCloud = typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
      const msg = isCloud
        ? `Backend connect nahi ho pa raha (${API_URL}). Kripya Vercel frontend me VITE_API_URL set karein.`
        : `Could not connect to backend server at ${API_URL}. Please ensure backend is running.`;
      const err = new Error(msg);
      err.status = 503;
      throw err;
    }
    throw netErr;
  }

  if (response.status === 401 && !_retried && !endpoint.startsWith('/auth/')) {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      try {
        const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        });
        const refreshData = await parseResponse(refreshRes);
        if (refreshRes.ok && refreshData.token) {
          localStorage.setItem('token', refreshData.token);
          return apiFetch(endpoint, options, true);
        }
      } catch {
        // Ignore refresh error and fall through to 401 handling
      }
    }
  }

  const data = await parseResponse(response);

  if (!response.ok) {
    let msg = data.message;
    if (typeof msg === 'string' && (msg.includes('<html') || msg.includes('<!DOCTYPE') || msg.includes('<body') || msg.includes('Method Not Allowed'))) {
      if (response.status === 405) {
        msg = 'Backend API is not available on this cloud domain (405 Method Not Allowed).';
      } else if (response.status === 404) {
        msg = `API route not found: ${endpoint} (404)`;
      } else {
        msg = `Server returned HTTP ${response.status}`;
      }
    }
    const err = new Error(msg || 'Something went wrong');
    err.status = response.status;
    err.data = data;
    throw err;
  }

  return data;
};
