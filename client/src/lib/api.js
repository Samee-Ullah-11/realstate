const BASE = '/api/v1';

export class ApiRequestError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export async function apiGet(path, params) {
  const query = new URLSearchParams();
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== '') query.set(key, value);
    }
  }
  const suffix = query.size ? `?${query}` : '';
  const res = await fetch(`${BASE}${path}${suffix}`, { credentials: 'include' });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiRequestError(res.status, body.error || 'Request failed');
  }
  return res.json();
}

export async function apiUpload(path, formData) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new ApiRequestError(res.status, data.error || 'Upload failed');
  }
  return res.json();
}

export async function apiSend(path, method, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new ApiRequestError(res.status, data.error || 'Request failed');
  }
  return res.json();
}
