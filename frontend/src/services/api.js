/**
 * API Service for Loan Approval Prediction Demo.
 * Completely self-contained client-side simulation for clean college demonstration.
 */
import { simulatePrediction } from './demoData';

export const api = {
  predictLoan: async (applicantData) => {
    // Short realistic calculation delay for interactive feel
    await new Promise(res => setTimeout(res, 250));
    return simulatePrediction(applicantData);
  }
};

export default api;
