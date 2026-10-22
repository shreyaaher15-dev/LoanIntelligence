/**
 * API Service for Loan Intelligence Platform.
 * Supports configurable API Base URL via VITE_API_BASE_URL (defaults to empty string for Vite proxy).
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

async function fetchJson(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    });

    if (!res.ok) {
      let errorMsg = `Server error: ${res.status} ${res.statusText}`;
      try {
        const errorJson = await res.json();
        if (errorJson.detail) {
          errorMsg = Array.isArray(errorJson.detail)
            ? errorJson.detail.map(d => `${d.loc?.join('.') || ''}: ${d.msg}`).join(', ')
            : errorJson.detail;
        }
      } catch {
        // Fall back to HTTP status message
      }
      throw new Error(errorMsg);
    }

    return await res.json();
  } catch (err) {
    console.error(`API Error on [${endpoint}]:`, err);
    throw err;
  }
}

export const api = {
  getHealth: () => fetchJson('/api/health'),
  getDashboard: () => fetchJson('/api/dashboard'),
  getModelMetrics: () => fetchJson('/api/model/metrics'),
  getWarehouseAnalytics: (params = {}) => {
    const query = new URLSearchParams();
    if (params.education && params.education !== 'All') query.set('education', params.education);
    if (params.self_employed && params.self_employed !== 'All') query.set('self_employed', params.self_employed);
    if (params.cibil_band && params.cibil_band !== 'All') query.set('cibil_band', params.cibil_band);
    if (params.loan_term_band && params.loan_term_band !== 'All') query.set('loan_term_band', params.loan_term_band);
    if (params.group_by) query.set('group_by', params.group_by);
    return fetchJson(`/api/warehouse/analytics?${query.toString()}`);
  },
  getWarehouseRecords: (limit = 25, offset = 0) =>
    fetchJson(`/api/warehouse/records?limit=${limit}&offset=${offset}`),
  predictLoan: (applicantData) =>
    fetchJson('/api/predict', {
      method: 'POST',
      body: JSON.stringify(applicantData)
    }),
  getAbout: () => fetchJson('/api/about')
};

export default api;
