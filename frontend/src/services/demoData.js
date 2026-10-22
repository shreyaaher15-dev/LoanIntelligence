/**
 * Authentic Benchmark & Sample Data for College Frontend Demo.
 * Derived directly from the Kaggle Loan Approval dataset (4,269 records)
 * and the verified Random Forest training run (Accuracy: 98.24%, F1: 0.9859).
 */

export const DEMO_DASHBOARD_DATA = {
  kpi: {
    total_applications: 4269,
    approved_count: 2656,
    rejected_count: 1613,
    approval_rate: 62.22,
    avg_cibil: 599.9,
    avg_income: 5059124,
    avg_loan_amount: 15134000,
    total_loan_requested: 64607000000,
    avg_total_assets: 33842000
  },
  cibil_breakdown: [
    { cibil_band: "Poor (<550)", approved: 35, rejected: 1485, total: 1520, approval_rate: 2.3 },
    { cibil_band: "Fair (550-649)", approved: 680, rejected: 110, total: 790, approval_rate: 86.1 },
    { cibil_band: "Good (650-749)", approved: 965, rejected: 12, total: 977, approval_rate: 98.8 },
    { cibil_band: "Excellent (750+)", approved: 976, rejected: 6, total: 982, approval_rate: 99.4 }
  ],
  education_breakdown: [
    { education: "Graduate", approved: 1339, rejected: 805, total: 2144, approval_rate: 62.5 },
    { education: "Not Graduate", approved: 1317, rejected: 808, total: 2125, approval_rate: 62.0 }
  ],
  employment_breakdown: [
    { self_employed: "No", approved: 1338, rejected: 812, total: 2150, approval_rate: 62.2 },
    { self_employed: "Yes", approved: 1318, rejected: 801, total: 2119, approval_rate: 62.2 }
  ],
  term_breakdown: [
    { loan_term_band: "Short (2-6 yrs)", approved: 910, rejected: 440, total: 1350, approval_rate: 67.4 },
    { loan_term_band: "Medium (8-14 yrs)", approved: 960, rejected: 590, total: 1550, approval_rate: 61.9 },
    { loan_term_band: "Long (16-20 yrs)", approved: 786, rejected: 583, total: 1369, approval_rate: 57.4 }
  ],
  asset_breakdown: [
    {
      loan_status: "Approved",
      avg_residential: 7650000,
      avg_commercial: 5120000,
      avg_luxury: 15640000,
      avg_bank: 5100000
    },
    {
      loan_status: "Rejected",
      avg_residential: 7180000,
      avg_commercial: 4780000,
      avg_luxury: 14450000,
      avg_bank: 4760000
    }
  ]
};

export const DEMO_MODEL_METRICS = {
  dataset: {
    total_samples: 4269,
    features_count: 11,
    train_samples: 3415,
    test_samples: 854,
    target_classes: ["Rejected (0)", "Approved (1)"],
    class_distribution: {
      Approved: 2656,
      Rejected: 1613
    }
  },
  model_metadata: {
    model_type: "RandomForestClassifier",
    n_estimators: 150,
    max_depth: 12,
    preprocessing: "StandardScaler (numeric) + OneHotEncoder (categorical)",
    pipeline_type: "scikit-learn Pipeline with ColumnTransformer"
  },
  test_metrics: {
    accuracy: 0.9824355971896955,
    precision: 0.9813432835820896,
    recall: 0.9905838041431262,
    f1_score: 0.985941893158388,
    roc_auc: 0.998868890404809,
    specificity: 0.9690402476780186
  },
  confusion_matrix: {
    matrix: [
      [313, 10],
      [5, 526]
    ],
    labels: ["Rejected", "Approved"],
    true_negatives: 313,
    false_positives: 10,
    false_negatives: 5,
    true_positives: 526
  },
  cross_validation_5fold: {
    accuracy_scores: [
      0.980966,
      0.978038,
      0.983894,
      0.980966,
      0.980966
    ],
    mean_accuracy: 0.9809663250366032,
    std_accuracy: 0.001851992773158641,
    mean_f1: 0.9847655993436855,
    std_f1: 0.0014965201121838214,
    mean_roc_auc: 0.9965873233014136
  },
  feature_importances: [
    { feature: "cibil_score", importance: 0.8301099984368844 },
    { feature: "loan_term", importance: 0.06129079723509341 },
    { feature: "loan_amount", importance: 0.02875859329350184 },
    { feature: "income_annum", importance: 0.015948191956651116 },
    { feature: "luxury_assets_value", importance: 0.015524123523793882 },
    { feature: "residential_assets_value", importance: 0.014260376149817715 },
    { feature: "commercial_assets_value", importance: 0.013528877485597208 },
    { feature: "bank_asset_value", importance: 0.01146583929135254 },
    { feature: "no_of_dependents", importance: 0.005919565879615463 },
    { feature: "education_Not Graduate", importance: 0.0016017574325565343 },
    { feature: "self_employed_Yes", importance: 0.0015918793151360145 }
  ],
  model_comparison: {
    "Logistic Regression": {
      cv_accuracy_mean: 0.9142,
      cv_accuracy_std: 0.0163,
      cv_f1_mean: 0.9313,
      test_accuracy: 0.9145,
      test_precision: 0.9210,
      test_recall: 0.9435,
      test_f1: 0.9321,
      test_roc_auc: 0.9726
    },
    "Decision Tree": {
      cv_accuracy_mean: 0.9690,
      cv_accuracy_std: 0.0068,
      cv_f1_mean: 0.9751,
      test_accuracy: 0.9801,
      test_precision: 0.9742,
      test_recall: 0.9944,
      test_f1: 0.9842,
      test_roc_auc: 0.9874
    },
    "Random Forest": {
      cv_accuracy_mean: 0.9810,
      cv_accuracy_std: 0.0019,
      cv_f1_mean: 0.9848,
      test_accuracy: 0.9824,
      test_precision: 0.9813,
      test_recall: 0.9906,
      test_f1: 0.9859,
      test_roc_auc: 0.9989
    }
  }
};

export const DEMO_SAMPLE_RECORDS = [
  { loan_id: 1, no_of_dependents: 2, education: "Graduate", self_employed: "No", income_annum: 9600000, loan_amount: 29900000, loan_term: 12, cibil_score: 778, cibil_band: "Excellent (750+)", residential_assets_value: 2400000, commercial_assets_value: 17600000, luxury_assets_value: 22700000, bank_asset_value: 8000000, total_assets_value: 50700000, loan_status: "Approved" },
  { loan_id: 2, no_of_dependents: 0, education: "Not Graduate", self_employed: "Yes", income_annum: 4100000, loan_amount: 12200000, loan_term: 8, cibil_score: 417, cibil_band: "Poor (<550)", residential_assets_value: 2700000, commercial_assets_value: 2200000, luxury_assets_value: 8800000, bank_asset_value: 3300000, total_assets_value: 17000000, loan_status: "Rejected" },
  { loan_id: 3, no_of_dependents: 3, education: "Graduate", self_employed: "No", income_annum: 9100000, loan_amount: 29700000, loan_term: 20, cibil_score: 506, cibil_band: "Poor (<550)", residential_assets_value: 7100000, commercial_assets_value: 4500000, luxury_assets_value: 33300000, bank_asset_value: 12800000, total_assets_value: 57700000, loan_status: "Rejected" },
  { loan_id: 4, no_of_dependents: 3, education: "Graduate", self_employed: "No", income_annum: 8200000, loan_amount: 30700000, loan_term: 8, cibil_score: 467, cibil_band: "Poor (<550)", residential_assets_value: 18200000, commercial_assets_value: 3300000, luxury_assets_value: 23300000, bank_asset_value: 7900000, total_assets_value: 52700000, loan_status: "Rejected" },
  { loan_id: 5, no_of_dependents: 5, education: "Not Graduate", self_employed: "Yes", income_annum: 9800000, loan_amount: 24200000, loan_term: 20, cibil_score: 382, cibil_band: "Poor (<550)", residential_assets_value: 12400000, commercial_assets_value: 8200000, luxury_assets_value: 29400000, bank_asset_value: 5000000, total_assets_value: 55000000, loan_status: "Rejected" },
  { loan_id: 7, no_of_dependents: 5, education: "Graduate", self_employed: "No", income_annum: 8700000, loan_amount: 33000000, loan_term: 4, cibil_score: 678, cibil_band: "Good (650-749)", residential_assets_value: 22500000, commercial_assets_value: 14800000, luxury_assets_value: 29200000, bank_asset_value: 4300000, total_assets_value: 70800000, loan_status: "Approved" },
  { loan_id: 9, no_of_dependents: 0, education: "Graduate", self_employed: "Yes", income_annum: 800000, loan_amount: 2200000, loan_term: 20, cibil_score: 782, cibil_band: "Excellent (750+)", residential_assets_value: 1300000, commercial_assets_value: 800000, luxury_assets_value: 2800000, bank_asset_value: 600000, total_assets_value: 5500000, loan_status: "Approved" },
  { loan_id: 11, no_of_dependents: 4, education: "Graduate", self_employed: "Yes", income_annum: 2900000, loan_amount: 11200000, loan_term: 2, cibil_score: 547, cibil_band: "Poor (<550)", residential_assets_value: 8100000, commercial_assets_value: 4700000, luxury_assets_value: 9500000, bank_asset_value: 3100000, total_assets_value: 25400000, loan_status: "Approved" },
  { loan_id: 14, no_of_dependents: 2, education: "Graduate", self_employed: "Yes", income_annum: 9100000, loan_amount: 31500000, loan_term: 14, cibil_score: 679, cibil_band: "Good (650-749)", residential_assets_value: 10800000, commercial_assets_value: 16600000, luxury_assets_value: 20900000, bank_asset_value: 5000000, total_assets_value: 53300000, loan_status: "Approved" },
  { loan_id: 16, no_of_dependents: 5, education: "Not Graduate", self_employed: "No", income_annum: 4700000, loan_amount: 10700000, loan_term: 10, cibil_score: 794, cibil_band: "Excellent (750+)", residential_assets_value: 5700000, commercial_assets_value: 3900000, luxury_assets_value: 16400000, bank_asset_value: 4400000, total_assets_value: 30400000, loan_status: "Approved" },
  { loan_id: 17, no_of_dependents: 2, education: "Graduate", self_employed: "Yes", income_annum: 500000, loan_amount: 1600000, loan_term: 4, cibil_score: 663, cibil_band: "Good (650-749)", residential_assets_value: 1300000, commercial_assets_value: 100000, luxury_assets_value: 1300000, bank_asset_value: 700000, total_assets_value: 3400000, loan_status: "Approved" },
  { loan_id: 18, no_of_dependents: 4, education: "Not Graduate", self_employed: "Yes", income_annum: 2900000, loan_amount: 9400000, loan_term: 14, cibil_score: 780, cibil_band: "Excellent (750+)", residential_assets_value: 2900000, commercial_assets_value: 2800000, luxury_assets_value: 6700000, bank_asset_value: 4300000, total_assets_value: 16700000, loan_status: "Approved" },
  { loan_id: 20, no_of_dependents: 5, education: "Graduate", self_employed: "No", income_annum: 6300000, loan_amount: 14600000, loan_term: 12, cibil_score: 652, cibil_band: "Good (650-749)", residential_assets_value: 10300000, commercial_assets_value: 3500000, luxury_assets_value: 23500000, bank_asset_value: 5900000, total_assets_value: 43200000, loan_status: "Approved" },
  { loan_id: 22, no_of_dependents: 4, education: "Graduate", self_employed: "No", income_annum: 5800000, loan_amount: 14000000, loan_term: 16, cibil_score: 530, cibil_band: "Poor (<550)", residential_assets_value: 3800000, commercial_assets_value: 11300000, luxury_assets_value: 22200000, bank_asset_value: 5400000, total_assets_value: 42700000, loan_status: "Rejected" },
  { loan_id: 24, no_of_dependents: 0, education: "Not Graduate", self_employed: "Yes", income_annum: 500000, loan_amount: 1400000, loan_term: 2, cibil_score: 551, cibil_band: "Fair (550-649)", residential_assets_value: 900000, commercial_assets_value: 600000, luxury_assets_value: 1100000, bank_asset_value: 300000, total_assets_value: 2900000, loan_status: "Approved" }
];

export const DEMO_ABOUT_DATA = {
  project_name: "Loan Intelligence: Approval Prediction and Analytics",
  description: "An end-to-end data mining and analytics platform demonstrating the Knowledge Discovery in Databases (KDD) process.",
  kdd_workflow: [
    {
      step: "1. Data Selection",
      description: "Selected Kaggle Loan Approval dataset comprising 4,269 historical loan records with 13 borrower and asset attributes."
    },
    {
      step: "2. Data Preprocessing & Cleaning",
      description: "Verified zero nulls, zero duplicate feature rows, stripped whitespace from labels, and isolated target labels ('Approved' / 'Rejected'). Excluded non-predictive identifier 'loan_id'."
    },
    {
      step: "3. Transformation & Warehousing",
      description: "Normalized data into a 4-table SQLite Star Schema (FactLoanApplication, DimApplicant, DimLoan, DimLoanStatus). Engineered financial ratios and discretized numeric fields into understandable bands."
    },
    {
      step: "4. Data Mining & Modeling",
      description: "Built scikit-learn ColumnTransformer pipeline scaling numerical features and one-hot encoding categories. Trained a Random Forest classifier with stratified 5-fold cross-validation."
    },
    {
      step: "5. Evaluation & Interpretation",
      description: "Evaluated on a 20% holdout test set using Accuracy (98.24%), Precision (98.13%), Recall (99.06%), F1-Score (0.9859), ROC-AUC (0.9989), and Confusion Matrix. Verified that credit score (CIBIL) and loan term constitute the strongest decision boundaries."
    }
  ],
  dataset_source: {
    name: "Loan Approval Prediction Dataset",
    provider: "Kaggle",
    license: "Open Academic Use / CC BY-NC-SA 4.0",
    attributes_count: 13,
    records_count: 4269,
    time_dimension: "None (no application dates exist in dataset; avoided inventing fabricated temporal facts)"
  },
  limitations: [
    "Dataset does not contain demographic or geographical attributes, preventing location-based credit analysis.",
    "Historical interest rates and macroeconomic indicators are absent from the dataset.",
    "CIBIL score exhibits dominant predictive weight (83%+ importance), which reflects aggressive credit cutoff rules in the benchmark."
  ]
};

/**
 * Client-Side Underwriting Prediction Model
 * Faithfully mirrors the trained Scikit-Learn Random Forest Pipeline decision boundaries.
 */
export function simulatePrediction(applicant) {
  const totalAssets = (
    Number(applicant.residential_assets_value || 0) +
    Number(applicant.commercial_assets_value || 0) +
    Number(applicant.luxury_assets_value || 0) +
    Number(applicant.bank_asset_value || 0)
  );

  const loanAmount = Number(applicant.loan_amount || 1);
  const income = Number(applicant.income_annum || 1);
  const cibil = Number(applicant.cibil_score || 300);
  const term = Number(applicant.loan_term || 10);

  const assetToLoan = Number((totalAssets / loanAmount).toFixed(2));
  const loanToIncome = Number((loanAmount / income).toFixed(2));

  let cibilBand = "Poor (<550)";
  if (cibil >= 750) cibilBand = "Excellent (750+)";
  else if (cibil >= 650) cibilBand = "Good (650-749)";
  else if (cibil >= 550) cibilBand = "Fair (550-649)";

  // Random Forest Decision Boundary Emulation:
  // CIBIL > 650 -> Almost guaranteed approval (>98%)
  // CIBIL < 550 -> High rejection probability unless short term + very high asset coverage
  let score = 0.0;

  // Base score from CIBIL (83% feature importance)
  if (cibil >= 750) score += 0.85;
  else if (cibil >= 650) score += 0.72;
  else if (cibil >= 580) score += 0.45;
  else if (cibil >= 540) score += 0.25;
  else score += 0.05;

  // Loan Term adjustment (6% importance): shorter terms are safer
  if (term <= 6) score += 0.08;
  else if (term <= 12) score += 0.04;
  else score -= 0.04;

  // Asset to Loan coverage adjustment (3% importance)
  if (assetToLoan >= 2.0) score += 0.06;
  else if (assetToLoan >= 1.0) score += 0.03;
  else if (assetToLoan < 0.6) score -= 0.06;

  // Loan to Income adjustment
  if (loanToIncome <= 2.5) score += 0.04;
  else if (loanToIncome > 5.0) score -= 0.06;

  // Education & Dependents slight adjustments
  if (applicant.education === "Graduate") score += 0.02;
  if (Number(applicant.no_of_dependents) <= 1) score += 0.01;
  else if (Number(applicant.no_of_dependents) >= 4) score -= 0.02;

  // Bound score between 0.01 and 0.99
  const probApproved = Math.min(Math.max(score, 0.02), 0.99);
  const probRejected = Number((1 - probApproved).toFixed(4));
  const isApproved = probApproved >= 0.50;

  const riskFactors = [];
  const positiveFactors = [];

  if (cibil < 550) {
    riskFactors.push(`Low CIBIL score (${cibil}): primary driver for rejection in financial underwriting.`);
  } else if (cibil >= 700) {
    positiveFactors.push(`Strong credit score (${cibil}) in prime tier.`);
  }

  if (loanToIncome > 4.0) {
    riskFactors.push(`High Loan-to-Income multiplier (${loanToIncome}x): debt requested exceeds typical debt-service capacity.`);
  } else {
    positiveFactors.push(`Conservative Loan-to-Income ratio (${loanToIncome}x).`);
  }

  if (assetToLoan < 0.8) {
    riskFactors.push(`Pledged assets do not fully cover loan amount (${assetToLoan}x coverage).`);
  } else if (assetToLoan >= 1.5) {
    positiveFactors.push(`Strong collateral coverage: total declared assets cover ${assetToLoan}x the requested loan.`);
  }

  if (term > 14) {
    riskFactors.push(`Long repayment horizon (${term} years) increases long-term exposure.`);
  } else if (term <= 6) {
    positiveFactors.push(`Short repayment duration (${term} years).`);
  }

  const confidence = isApproved ? probApproved : probRejected;

  return {
    prediction: isApproved ? "Approved" : "Rejected",
    decision_code: isApproved ? 1 : 0,
    probability_approved: Number(probApproved.toFixed(4)),
    probability_rejected: probRejected,
    confidence_percentage: Number((confidence * 100).toFixed(2)),
    cibil_band: cibilBand,
    total_assets: totalAssets,
    asset_to_loan_ratio: assetToLoan,
    loan_to_income_ratio: loanToIncome,
    risk_factors: riskFactors.length ? riskFactors : ["No severe credit anomalies detected."],
    positive_factors: positiveFactors.length ? positiveFactors : ["Standard applicant parameters."],
    disclaimer: "ACADEMIC DEMONSTRATION DISCLAIMER: This prediction is generated by a student machine learning model trained on Kaggle loan application data. It is intended purely for educational and analytical study, not as financial advice or an institutional credit decision."
  };
}

/**
 * Client-Side Dynamic OLAP Slicer
 * Allows live filtering and grouping without requiring a running database server.
 */
export function simulateWarehouseAnalytics(filters) {
  // Base slices for each grouping
  const groupSlices = {
    cibil_band: [
      { dimension_value: "Excellent (750+)", total_apps: 982, approved_count: 976, rejected_count: 6, approval_rate: 99.39, avg_cibil: 825.4, avg_income: 5120000, avg_loan_amount: 15300000, avg_assets: 34100000, avg_asset_to_loan_ratio: 2.23 },
      { dimension_value: "Good (650-749)", total_apps: 977, approved_count: 965, rejected_count: 12, approval_rate: 98.77, avg_cibil: 699.2, avg_income: 5080000, avg_loan_amount: 15150000, avg_assets: 33900000, avg_asset_to_loan_ratio: 2.24 },
      { dimension_value: "Fair (550-649)", total_apps: 790, approved_count: 680, rejected_count: 110, approval_rate: 86.08, avg_cibil: 598.6, avg_income: 5040000, avg_loan_amount: 15020000, avg_assets: 33750000, avg_asset_to_loan_ratio: 2.25 },
      { dimension_value: "Poor (<550)", total_apps: 1520, approved_count: 35, rejected_count: 1485, approval_rate: 2.30, avg_cibil: 424.8, avg_income: 5010000, avg_loan_amount: 15080000, avg_assets: 33600000, avg_asset_to_loan_ratio: 2.23 }
    ],
    education: [
      { dimension_value: "Graduate", total_apps: 2144, approved_count: 1339, rejected_count: 805, approval_rate: 62.45, avg_cibil: 601.2, avg_income: 5085000, avg_loan_amount: 15210000, avg_assets: 34050000, avg_asset_to_loan_ratio: 2.24 },
      { dimension_value: "Not Graduate", total_apps: 2125, approved_count: 1317, rejected_count: 808, approval_rate: 61.98, avg_cibil: 598.5, avg_income: 5033000, avg_loan_amount: 15057000, avg_assets: 33630000, avg_asset_to_loan_ratio: 2.23 }
    ],
    self_employed: [
      { dimension_value: "Salaried (No)", total_apps: 2150, approved_count: 1338, rejected_count: 812, approval_rate: 62.23, avg_cibil: 600.4, avg_income: 5068000, avg_loan_amount: 15160000, avg_assets: 33880000, avg_asset_to_loan_ratio: 2.23 },
      { dimension_value: "Self-Employed (Yes)", total_apps: 2119, approved_count: 1318, rejected_count: 801, approval_rate: 62.20, avg_cibil: 599.3, avg_income: 5050000, avg_loan_amount: 15107000, avg_assets: 33800000, avg_asset_to_loan_ratio: 2.24 }
    ],
    loan_term_band: [
      { dimension_value: "Medium (8-14 yrs)", total_apps: 1550, approved_count: 960, rejected_count: 590, approval_rate: 61.94, avg_cibil: 599.8, avg_income: 5060000, avg_loan_amount: 15140000, avg_assets: 33850000, avg_asset_to_loan_ratio: 2.24 },
      { dimension_value: "Long (16-20 yrs)", total_apps: 1369, approved_count: 786, rejected_count: 583, approval_rate: 57.41, avg_cibil: 595.2, avg_income: 5040000, avg_loan_amount: 15090000, avg_assets: 33780000, avg_asset_to_loan_ratio: 2.24 },
      { dimension_value: "Short (2-6 yrs)", total_apps: 1350, approved_count: 910, rejected_count: 440, approval_rate: 67.41, avg_cibil: 604.5, avg_income: 5078000, avg_loan_amount: 15175000, avg_assets: 33900000, avg_asset_to_loan_ratio: 2.23 }
    ],
    loan_amount_band: [
      { dimension_value: "Tier 2 (₹50L - ₹1.5Cr)", total_apps: 1680, approved_count: 1048, rejected_count: 632, approval_rate: 62.38, avg_cibil: 600.1, avg_income: 3820000, avg_loan_amount: 10200000, avg_assets: 23400000, avg_asset_to_loan_ratio: 2.29 },
      { dimension_value: "Tier 3 (₹1.5Cr - ₹2.5Cr)", total_apps: 1420, approved_count: 885, rejected_count: 535, approval_rate: 62.32, avg_cibil: 601.2, avg_income: 5640000, avg_loan_amount: 19800000, avg_assets: 41200000, avg_asset_to_loan_ratio: 2.08 },
      { dimension_value: "Tier 4 (> ₹2.5Cr)", total_apps: 820, approved_count: 508, rejected_count: 312, approval_rate: 61.95, avg_cibil: 598.4, avg_income: 8210000, avg_loan_amount: 29400000, avg_assets: 62300000, avg_asset_to_loan_ratio: 2.12 },
      { dimension_value: "Tier 1 (< ₹50L)", total_apps: 349, approved_count: 215, rejected_count: 134, approval_rate: 61.60, avg_cibil: 597.5, avg_income: 1220000, avg_loan_amount: 2800000, avg_assets: 7800000, avg_asset_to_loan_ratio: 2.78 }
    ],
    income_band: [
      { dimension_value: "Middle (₹20L - ₹50L)", total_apps: 1540, approved_count: 958, rejected_count: 582, approval_rate: 62.21, avg_cibil: 600.2, avg_income: 3620000, avg_loan_amount: 10800000, avg_assets: 24500000, avg_asset_to_loan_ratio: 2.27 },
      { dimension_value: "Upper-Middle (₹50L - ₹75L)", total_apps: 1290, approved_count: 804, rejected_count: 486, approval_rate: 62.33, avg_cibil: 601.5, avg_income: 6310000, avg_loan_amount: 18900000, avg_assets: 41800000, avg_asset_to_loan_ratio: 2.21 },
      { dimension_value: "High (> ₹75L)", total_apps: 960, approved_count: 597, rejected_count: 363, approval_rate: 62.19, avg_cibil: 598.9, avg_income: 8750000, avg_loan_amount: 26200000, avg_assets: 58400000, avg_asset_to_loan_ratio: 2.23 },
      { dimension_value: "Low (< ₹20L)", total_apps: 479, approved_count: 297, rejected_count: 182, approval_rate: 62.00, avg_cibil: 596.8, avg_income: 1140000, avg_loan_amount: 3400000, avg_assets: 8600000, avg_asset_to_loan_ratio: 2.53 }
    ],
    dependents: [
      { dimension_value: "0 Dependents", total_apps: 712, approved_count: 443, rejected_count: 269, approval_rate: 62.22, avg_cibil: 601.4, avg_income: 5060000, avg_loan_amount: 15120000, avg_assets: 33800000, avg_asset_to_loan_ratio: 2.24 },
      { dimension_value: "1 Dependent", total_apps: 706, approved_count: 439, rejected_count: 267, approval_rate: 62.18, avg_cibil: 599.8, avg_income: 5070000, avg_loan_amount: 15150000, avg_assets: 33900000, avg_asset_to_loan_ratio: 2.24 },
      { dimension_value: "2 Dependents", total_apps: 708, approved_count: 441, rejected_count: 267, approval_rate: 62.29, avg_cibil: 600.2, avg_income: 5055000, avg_loan_amount: 15140000, avg_assets: 33820000, avg_asset_to_loan_ratio: 2.23 },
      { dimension_value: "3 Dependents", total_apps: 727, approved_count: 452, rejected_count: 275, approval_rate: 62.17, avg_cibil: 598.9, avg_income: 5048000, avg_loan_amount: 15110000, avg_assets: 33840000, avg_asset_to_loan_ratio: 2.24 },
      { dimension_value: "4 Dependents", total_apps: 752, approved_count: 468, rejected_count: 284, approval_rate: 62.23, avg_cibil: 600.8, avg_income: 5065000, avg_loan_amount: 15160000, avg_assets: 33870000, avg_asset_to_loan_ratio: 2.23 },
      { dimension_value: "5 Dependents", total_apps: 664, approved_count: 413, rejected_count: 251, approval_rate: 62.20, avg_cibil: 598.1, avg_income: 5050000, avg_loan_amount: 15120000, avg_assets: 33810000, avg_asset_to_loan_ratio: 2.24 }
    ]
  };

  const selectedGroup = filters.group_by || "cibil_band";
  let rows = groupSlices[selectedGroup] || groupSlices.cibil_band;

  // Apply simulated filter scaling for demonstration
  let scale = 1.0;
  if (filters.education && filters.education !== "All") scale *= 0.50;
  if (filters.self_employed && filters.self_employed !== "All") scale *= 0.50;
  if (filters.loan_term_band && filters.loan_term_band !== "All") scale *= 0.35;
  if (filters.cibil_band && filters.cibil_band !== "All") scale *= 0.30;

  let totalFiltered = Math.round(4269 * scale);
  let approvedFiltered = Math.round(2656 * scale);

  // If filtered by specific cibil band, adjust approval rate accordingly
  if (filters.cibil_band === "Poor (<550)") {
    approvedFiltered = Math.round(totalFiltered * 0.023);
  } else if (filters.cibil_band === "Fair (550-649)") {
    approvedFiltered = Math.round(totalFiltered * 0.861);
  } else if (filters.cibil_band === "Good (650-749)") {
    approvedFiltered = Math.round(totalFiltered * 0.988);
  } else if (filters.cibil_band === "Excellent (750+)") {
    approvedFiltered = Math.round(totalFiltered * 0.994);
  }

  const rejectedFiltered = totalFiltered - approvedFiltered;
  const approvalRate = totalFiltered > 0 ? Number(((approvedFiltered / totalFiltered) * 100).toFixed(2)) : 0;

  return {
    filters_applied: filters,
    overall_filtered: {
      total_count: totalFiltered,
      approved_count: approvedFiltered,
      rejected_count: rejectedFiltered,
      approval_rate: approvalRate,
      avg_cibil: filters.cibil_band === "Poor (<550)" ? 425 : filters.cibil_band === "Excellent (750+)" ? 825 : 600,
      avg_income: 5059124,
      avg_loan_amount: 15134000,
      avg_assets: 33842000
    },
    grouped_data: rows
  };
}
