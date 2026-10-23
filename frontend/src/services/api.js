/**
 * API Service for Loan Approval Prediction Demo.
 * Completely self-contained client-side simulation for clean college demonstration.
 */
import { simulatePrediction, DEMO_ABOUT_INFO } from './demoData';

export const api = {
  predictLoan: async (applicantData) => {
    // Short realistic delay for interactive feel
    await new Promise(res => setTimeout(res, 300));
    return simulatePrediction(applicantData);
  },

  getAbout: async () => {
    return DEMO_ABOUT_INFO;
  }
};

export default api;
