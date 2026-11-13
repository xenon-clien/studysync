const API_URL = import.meta.env.VITE_API_URL || `${window.location.protocol}//${window.location.hostname}:3001/api`;

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

  const response = await fetch(`${API_URL}${endpoint}`, {
    credentials: 'include',
    ...options,
    headers,
  });

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
    const err = new Error(data.message || 'Something went wrong');
    err.status = response.status;
    throw err;
  }

  return data;
};
