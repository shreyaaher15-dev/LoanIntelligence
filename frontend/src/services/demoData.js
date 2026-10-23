/**
 * Client-Side Prediction Engine & Demo Information for College Project Showcase.
 * Simulates loan approval decisions based on benchmarks derived from the Kaggle Loan Approval dataset.
 */

export function simulatePrediction({ cibil_score, income_annum, loan_amount, loan_term }) {
  const cibil = Number(cibil_score || 300);
  const income = Number(income_annum || 1);
  const loan = Number(loan_amount || 1);
  const term = Number(loan_term || 10);

  const ratio = Number((loan / (income > 0 ? income : 1)).toFixed(2));

  let cibilRange = "Poor (300–549)";
  if (cibil >= 750) cibilRange = "Excellent (750–900)";
  else if (cibil >= 650) cibilRange = "Good (650–749)";
  else if (cibil >= 550) cibilRange = "Fair (550–649)";

  let isApproved = false;
  let summary = "";
  let keyPoints = [];

  if (cibil >= 750) {
    if (ratio > 6.0 && term > 15) {
      isApproved = false;
      summary = "Even with an excellent credit score, borrowing more than 6 times your annual income across an extended 15+ year repayment tenure creates heavy long-term debt exposure.";
      keyPoints = [
        `Credit score (${cibil}) is in the top tier, showing reliable past credit history.`,
        `Requested loan amount is high relative to income (${ratio}x annual earnings).`,
        `Long tenure (${term} years) increases long-term interest liability.`
      ];
    } else {
      isApproved = true;
      summary = `Your CIBIL score is in the excellent range (750–900) and your requested loan amount is within safe debt-to-income limits. Applications with these parameters have the strongest approval likelihood.`;
      keyPoints = [
        `Strong CIBIL score (${cibil}) indicates minimal default risk.`,
        `Loan amount is ${ratio}x your annual income, which is well within standard borrowing benchmarks.`,
        `${term}-year repayment term is well-proportioned to the loan size.`
      ];
    }
  } else if (cibil >= 650) {
    if (ratio > 5.0) {
      isApproved = false;
      summary = `While your CIBIL score meets the standard credit benchmark (650+), the requested loan exceeds 5 times your annual income, which typically triggers rejection due to debt service limits.`;
      keyPoints = [
        `Credit score (${cibil}) is satisfactory (650–749 range).`,
        `High borrowing multiplier (${ratio}x annual income) exceeds the recommended 4x–5x ceiling.`,
        `Lowering the loan amount or increasing annual income would strengthen the application.`
      ];
    } else {
      isApproved = true;
      summary = `Your CIBIL score is above the typical 650 benchmark, and the loan amount is proportionate to your annual earnings (${ratio}x). This profile meets standard lending criteria.`;
      keyPoints = [
        `Credit score (${cibil}) is above the 650 approval threshold.`,
        `Loan is ${ratio}x your annual income, maintaining healthy affordability.`,
        `${term}-year term provides manageable installments.`
      ];
    }
  } else if (cibil >= 550) {
    if (ratio <= 3.0 && term <= 10) {
      isApproved = true;
      summary = `Your CIBIL score is in the moderate range (550–649), but a modest loan request (${ratio}x annual income) and a shorter repayment term (${term} years) help mitigate the risk.`;
      keyPoints = [
        `Moderate credit rating (${cibil}) requires conservative borrowing.`,
        `Low loan multiplier (${ratio}x income) keeps debt obligations manageable.`,
        `Shorter term (${term} years) reduces overall risk exposure.`
      ];
    } else {
      isApproved = false;
      summary = `With a fair/borderline credit score (550–649), requesting ${ratio}x your annual income over a ${term}-year period exceeds conservative risk guidelines.`;
      keyPoints = [
        `Credit score (${cibil}) is below the preferred 650 threshold.`,
        `Loan amount (${ratio}x annual income) is elevated for a borderline credit profile.`,
        `Higher default probability based on benchmark criteria.`
      ];
    }
  } else {
    isApproved = false;
    summary = `Your CIBIL score falls in the poor/subprime range (below 550). In benchmark lending rules, scores in this tier are the primary cause for loan rejection.`;
    keyPoints = [
      `CIBIL score (${cibil}) is below the minimum 550 underwriting benchmark.`,
      `Past credit history is the primary barrier to approval.`,
      `Improving credit score above 650 is recommended before applying.`
    ];
  }

  return {
    prediction: isApproved ? "Likely Approved" : "Likely Rejected",
    status_type: isApproved ? "approved" : "rejected",
    cibil_score: cibil,
    cibil_range: cibilRange,
    income_annum: income,
    loan_amount: loan,
    loan_term: term,
    loan_to_income_ratio: ratio,
    summary,
    key_points: keyPoints
  };
}
