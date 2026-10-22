/**
 * Standalone Client-Side Service for College Frontend Demo.
 * Completely eliminates backend dependency, network latency, and offline errors.
 * Provides authentic Kaggle benchmark data and live ML decision boundary simulation.
 */

import {
  DEMO_DASHBOARD_DATA,
  DEMO_MODEL_METRICS,
  DEMO_SAMPLE_RECORDS,
  DEMO_ABOUT_DATA,
  simulatePrediction,
  simulateWarehouseAnalytics
} from './demoData';

export const api = {
  getHealth: async () => {
    return {
      status: "healthy",
      service: "Loan Intelligence Platform (College Demo Mode)",
      model_loaded: true,
      metrics_loaded: true,
      mode: "frontend_demo",
      database: "SQLite Star Schema (FactLoanApplication, DimApplicant, DimLoan, DimLoanStatus)"
    };
  },

  getDashboard: async () => {
    // Return authentic warehouse aggregation summary
    return JSON.parse(JSON.stringify(DEMO_DASHBOARD_DATA));
  },

  getModelMetrics: async () => {
    // Return verified empirical test and 5-fold cross validation metrics
    return JSON.parse(JSON.stringify(DEMO_MODEL_METRICS));
  },

  getWarehouseAnalytics: async (params = {}) => {
    // Dynamic interactive client-side OLAP slicer
    return simulateWarehouseAnalytics(params);
  },

  getWarehouseRecords: async (limit = 25, offset = 0) => {
    const list = DEMO_SAMPLE_RECORDS.slice(offset, offset + limit);
    return {
      limit,
      offset,
      count: list.length,
      total_records: DEMO_SAMPLE_RECORDS.length,
      records: list
    };
  },

  predictLoan: async (applicantData) => {
    // Simulate short calculation delay for realistic UX
    await new Promise(res => setTimeout(res, 350));
    return simulatePrediction(applicantData);
  },

  getAbout: async () => {
    return JSON.parse(JSON.stringify(DEMO_ABOUT_DATA));
  }
};

export default api;
