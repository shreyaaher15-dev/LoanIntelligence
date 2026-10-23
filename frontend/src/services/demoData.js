/**
 * Client-Side Prediction Engine & Demo Data for College Project Showcase.
 * Simulates loan approval decisions based on benchmarks derived from the Kaggle Loan Approval dataset.
 */

export function simulatePrediction({ cibil_score, income_annum, loan_amount, loan_term }) {
  const cibil = Number(cibil_score || 300);
  const income = Number(income_annum || 1);
  const loan = Number(loan_amount || 1);
  const term = Number(loan_term || 10);

  const loanToIncome = Number((loan / (income > 0 ? income : 1)).toFixed(2));

  let cibilBand = "Poor (<550)";
  if (cibil >= 750) cibilBand = "Excellent (750+)";
  else if (cibil >= 650) cibilBand = "Good (650-749)";
  else if (cibil >= 550) cibilBand = "Fair (550-649)";

  let isApproved = false;
  let explanation = "";
  let reasons = [];

  if (cibil >= 750) {
    if (loanToIncome > 6.0 && term > 15) {
      isApproved = false;
      explanation = "Although your credit score is excellent, the requested loan amount is more than 6x your annual income over a very long tenure (15+ years), leading to a high debt exposure.";
      reasons = [
        "Excellent credit score (750+), indicating strong past creditworthiness.",
        `High Loan-to-Income ratio (${loanToIncome}x): requested borrowing exceeds typical guidelines.`,
        `Long tenure (${term} years) increases long-term risk.`
      ];
    } else {
      isApproved = true;
      explanation = `Your CIBIL score of ${cibil} is in the prime credit tier (750+), and your loan-to-income ratio of ${loanToIncome}x is well within safe borrowing guidelines.`;
      reasons = [
        `High CIBIL score (${cibil}/900): excellent credit history with very low default risk.`,
        `Balanced Loan-to-Income ratio of ${loanToIncome}x annual earnings.`,
        `${term}-year repayment term fits the requested loan size.`
      ];
    }
  } else if (cibil >= 650) {
    if (loanToIncome > 5.0) {
      isApproved = false;
      explanation = `Your CIBIL score of ${cibil} is good, but the requested loan is ${loanToIncome}x your annual income, which exceeds recommended borrowing thresholds.`;
      reasons = [
        `Good CIBIL score (${cibil}/900) indicates consistent past credit performance.`,
        `Elevated debt-to-income multiple (${loanToIncome}x): recommended limit is typically 4x to 5x.`,
        "Higher leverage relative to annual income increases borrower risk."
      ];
    } else {
      isApproved = true;
      explanation = `Your CIBIL score of ${cibil} meets the standard credit benchmark, and your requested loan amount (${loanToIncome}x income) is manageable.`;
      reasons = [
        `CIBIL score (${cibil}) is safely above the 650 benchmark.`,
        `Healthy loan-to-income multiplier (${loanToIncome}x).`,
        `Appropriate ${term}-year repayment horizon.`
      ];
    }
  } else if (cibil >= 550) {
    if (loanToIncome <= 3.0 && term <= 10) {
      isApproved = true;
      explanation = `Your CIBIL score of ${cibil} is in the moderate range, but your modest borrowing request (${loanToIncome}x annual income) and shorter term (${term} years) keep risk low.`;
      reasons = [
        `Moderate credit score (${cibil}/900) requires cautious underwriting.`,
        `Low loan multiplier (${loanToIncome}x annual income) significantly strengthens your application.`,
        `Shorter term (${term} years) reduces repayment risk.`
      ];
    } else {
      isApproved = false;
      explanation = `Your CIBIL score of ${cibil} is in the borderline range (550-649), and the requested loan amount (${loanToIncome}x income) is too high for this credit profile.`;
      reasons = [
        `CIBIL credit rating (${cibil}) is below the preferred 650 benchmark.`,
        `Loan-to-income multiple (${loanToIncome}x) is high for a borderline credit profile.`,
        "Historical data indicates higher rejection likelihood at this score level."
      ];
    }
  } else {
    isApproved = false;
    explanation = `Your CIBIL score of ${cibil} is in the subprime range (< 550). In historical credit benchmarks, scores below 550 are the primary reason for loan rejections.`;
    reasons = [
      `CIBIL score (${cibil}/900) is below the minimum 550 underwriting benchmark.`,
      "Subprime credit rating is the primary driver for automated rejection.",
      "Improving your credit score above 650 before applying is strongly recommended."
    ];
  }

  return {
    prediction: isApproved ? "Likely Approved" : "Likely Rejected",
    status_type: isApproved ? "approved" : "rejected",
    cibil_score: cibil,
    cibil_band: cibilBand,
    income_annum: income,
    loan_amount: loan,
    loan_term: term,
    loan_to_income_ratio: loanToIncome,
    explanation,
    reasons,
    disclaimer: "College Demo Notice: This prediction is an educational simulation based on decision rules derived from Kaggle loan approval data. It runs directly in the browser for demonstration purposes."
  };
}

export const DEMO_ABOUT_INFO = {
  project_title: "Loan Approval Prediction",
  sub_title: "Student Mini-Project Demonstration",
  description: "An academic project exploring machine learning and data mining techniques to predict loan application outcomes based on borrower financial and credit profiles.",
  dataset: {
    source: "Kaggle Loan Approval Prediction Dataset",
    records: "4,269 historical applications",
    attributes: "CIBIL credit score, annual income, loan amount, and tenure",
    license: "Open Academic Use (CC BY-NC-SA 4.0)"
  },
  key_insights: [
    {
      title: "CIBIL Score is the #1 Factor",
      desc: "Applicants with a credit score above 650 have an approval rate exceeding 98%, while those below 550 are predominantly rejected."
    },
    {
      title: "Debt-to-Income Leverage",
      desc: "Borrowers whose requested loan exceeds 5x their annual earnings face increased rejection risk, even with fair credit."
    },
    {
      title: "Loan Tenure Impact",
      desc: "Shorter repayment horizons (2 to 6 years) demonstrate higher approval probabilities compared to extended 15-20 year terms."
    }
  ]
};
