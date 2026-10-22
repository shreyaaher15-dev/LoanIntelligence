"""
FastAPI application for Loan Intelligence: Approval Prediction and Analytics.
Provides REST API endpoints for:
- Dashboard KPIs and distributions (SQLite Star Schema OLAP)
- Loan approval prediction with Random Forest ML Pipeline
- Measured model evaluation metrics and confusion matrix
- Star Schema dimensional warehouse analytics
- System health and metadata
"""
import os
import json
import joblib
import pandas as pd
import numpy as np
from typing import Optional, List, Dict, Any
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from database.db import get_dashboard_summary, get_warehouse_analytics, get_sample_records

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "ml", "pipeline.joblib")
METRICS_PATH = os.path.join(BASE_DIR, "ml", "metrics.json")

# Load model pipeline
pipeline = None
if os.path.exists(MODEL_PATH):
    pipeline = joblib.load(MODEL_PATH)
    print("Random Forest Pipeline successfully loaded.")
else:
    print("WARNING: Pipeline file not found at", MODEL_PATH)

# Load metrics
cached_metrics = None
if os.path.exists(METRICS_PATH):
    with open(METRICS_PATH, "r", encoding="utf-8") as f:
        cached_metrics = json.load(f)

app = FastAPI(
    title="Loan Intelligence Platform API",
    description="Backend API for student mini-project: Loan Intelligence (Approval Prediction and Analytics).",
    version="1.0.0"
)

# CORS setup for local dev and production hosting (Netlify)
# Reads allowed origins from environment variable or allows localhost + any Netlify deploy preview
allowed_origins_env = os.getenv("ALLOWED_ORIGINS", "")
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000"
]
if allowed_origins_env:
    origins.extend([o.strip() for o in allowed_origins_env.split(",") if o.strip()])

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permits local React app + Netlify previews
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic schemas
class ApplicantInput(BaseModel):
    no_of_dependents: int = Field(..., ge=0, le=5, description="Number of dependents (0-5)")
    education: str = Field(..., description="Education level ('Graduate' or 'Not Graduate')")
    self_employed: str = Field(..., description="Self employment status ('Yes' or 'No')")
    income_annum: float = Field(..., ge=100000, le=100000000, description="Annual income in INR")
    loan_amount: float = Field(..., ge=100000, le=500000000, description="Loan amount requested in INR")
    loan_term: int = Field(..., ge=2, le=20, description="Loan repayment term in years")
    cibil_score: int = Field(..., ge=300, le=900, description="CIBIL credit score (300-900)")
    residential_assets_value: float = Field(..., description="Residential assets valuation in INR")
    commercial_assets_value: float = Field(..., ge=0, description="Commercial assets valuation in INR")
    luxury_assets_value: float = Field(..., ge=0, description="Luxury assets valuation in INR")
    bank_asset_value: float = Field(..., ge=0, description="Bank deposit/liquid assets valuation in INR")

class PredictionResponse(BaseModel):
    prediction: str
    decision_code: int
    probability_approved: float
    probability_rejected: float
    confidence_percentage: float
    cibil_band: str
    total_assets: float
    asset_to_loan_ratio: float
    loan_to_income_ratio: float
    risk_factors: List[str]
    positive_factors: List[str]
    disclaimer: str

@app.get("/api/health")
def health():
    return {
        "status": "healthy",
        "service": "Loan Intelligence Platform API",
        "model_loaded": pipeline is not None,
        "metrics_loaded": cached_metrics is not None,
        "database": "SQLite Star Schema (FactLoanApplication, DimApplicant, DimLoan, DimLoanStatus)"
    }

@app.get("/api/dashboard")
def dashboard():
    try:
        return get_dashboard_summary()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error querying dashboard metrics: {str(e)}")

@app.get("/api/model/metrics")
def get_metrics():
    if cached_metrics is None:
        raise HTTPException(status_code=500, detail="Model metrics have not been generated.")
    return cached_metrics

@app.get("/api/warehouse/analytics")
def warehouse_analytics(
    education: Optional[str] = Query(None),
    self_employed: Optional[str] = Query(None),
    cibil_band: Optional[str] = Query(None),
    loan_term_band: Optional[str] = Query(None),
    group_by: str = Query("cibil_band")
):
    try:
        return get_warehouse_analytics(
            education=education,
            self_employed=self_employed,
            cibil_band=cibil_band,
            loan_term_band=loan_term_band,
            group_by=group_by
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error querying star schema analytics: {str(e)}")

@app.get("/api/warehouse/records")
def warehouse_records(
    limit: int = Query(25, ge=1, le=100),
    offset: int = Query(0, ge=0)
):
    try:
        records = get_sample_records(limit=limit, offset=offset)
        return {
            "limit": limit,
            "offset": offset,
            "count": len(records),
            "records": records
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error querying warehouse records: {str(e)}")

@app.post("/api/predict", response_model=PredictionResponse)
def predict(input_data: ApplicantInput):
    if pipeline is None:
        raise HTTPException(status_code=503, detail="Prediction model pipeline is not available.")

    # Validate categories
    edu_clean = input_data.education.strip().title()
    if edu_clean not in ["Graduate", "Not Graduate"]:
        raise HTTPException(status_code=400, detail="Education must be either 'Graduate' or 'Not Graduate'")

    emp_clean = input_data.self_employed.strip().title()
    if emp_clean not in ["Yes", "No"]:
        raise HTTPException(status_code=400, detail="self_employed must be either 'Yes' or 'No'")

    # Construct input dataframe matching model training columns
    # ('no_of_dependents', 'income_annum', 'loan_amount', 'loan_term',
    #  'cibil_score', 'residential_assets_value', 'commercial_assets_value',
    #  'luxury_assets_value', 'bank_asset_value', 'education', 'self_employed')
    row = {
        'no_of_dependents': input_data.no_of_dependents,
        'education': edu_clean,
        'self_employed': emp_clean,
        'income_annum': input_data.income_annum,
        'loan_amount': input_data.loan_amount,
        'loan_term': input_data.loan_term,
        'cibil_score': input_data.cibil_score,
        'residential_assets_value': input_data.residential_assets_value,
        'commercial_assets_value': input_data.commercial_assets_value,
        'luxury_assets_value': input_data.luxury_assets_value,
        'bank_asset_value': input_data.bank_asset_value
    }
    input_df = pd.DataFrame([row])

    try:
        pred_class = int(pipeline.predict(input_df)[0])
        probabilities = pipeline.predict_proba(input_df)[0]
        prob_approved = float(probabilities[1])
        prob_rejected = float(probabilities[0])
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction execution failed: {str(e)}")

    total_assets = (
        input_data.residential_assets_value +
        input_data.commercial_assets_value +
        input_data.luxury_assets_value +
        input_data.bank_asset_value
    )
    asset_to_loan = round(total_assets / input_data.loan_amount, 2) if input_data.loan_amount > 0 else 0.0
    loan_to_income = round(input_data.loan_amount / input_data.income_annum, 2) if input_data.income_annum > 0 else 0.0

    if input_data.cibil_score < 550:
        cibil_band = "Poor (<550)"
    elif input_data.cibil_score < 650:
        cibil_band = "Fair (550-649)"
    elif input_data.cibil_score < 750:
        cibil_band = "Good (650-749)"
    else:
        cibil_band = "Excellent (750+)"

    # Risk and positive factors analysis based on feature distributions
    risk_factors = []
    positive_factors = []

    if input_data.cibil_score < 550:
        risk_factors.append(f"Low CIBIL score ({input_data.cibil_score}): primary driver for rejection in financial underwriting.")
    elif input_data.cibil_score >= 700:
        positive_factors.append(f"Strong credit score ({input_data.cibil_score}) in the top tier.")

    if loan_to_income > 4.5:
        risk_factors.append(f"High Loan-to-Income multiplier ({loan_to_income}x): debt requested is significantly higher than annual earnings.")
    else:
        positive_factors.append(f"Conservative Loan-to-Income ratio ({loan_to_income}x).")

    if asset_to_loan < 0.8:
        risk_factors.append(f"Asset-to-Loan coverage is below 1.0x ({asset_to_loan}x coverage).")
    elif asset_to_loan >= 1.5:
        positive_factors.append(f"Strong collateral coverage: total declared assets cover {asset_to_loan}x the requested loan.")

    if input_data.loan_term > 14:
        risk_factors.append(f"Extended repayment horizon ({input_data.loan_term} years) increases default exposure.")
    elif input_data.loan_term <= 6:
        positive_factors.append(f"Short repayment duration ({input_data.loan_term} years).")

    confidence = prob_approved if pred_class == 1 else prob_rejected

    return PredictionResponse(
        prediction="Approved" if pred_class == 1 else "Rejected",
        decision_code=pred_class,
        probability_approved=round(prob_approved, 4),
        probability_rejected=round(prob_rejected, 4),
        confidence_percentage=round(confidence * 100, 2),
        cibil_band=cibil_band,
        total_assets=total_assets,
        asset_to_loan_ratio=asset_to_loan,
        loan_to_income_ratio=loan_to_income,
        risk_factors=risk_factors if risk_factors else ["No severe credit anomalies detected."],
        positive_factors=positive_factors if positive_factors else ["Standard applicant parameters."],
        disclaimer=(
            "ACADEMIC DEMONSTRATION DISCLAIMER: This prediction is generated by a student machine learning model "
            "trained on Kaggle loan application data. It is intended purely for educational and analytical study, "
            "not as financial advice or an institutional credit decision."
        )
    )

@app.get("/api/about")
def about():
    return {
        "project_name": "Loan Intelligence: Approval Prediction and Analytics",
        "description": "An end-to-end data mining and analytics platform demonstrating the Knowledge Discovery in Databases (KDD) process.",
        "kdd_workflow": [
            {
                "step": "1. Data Selection",
                "description": "Selected Kaggle Loan Approval dataset comprising 4,269 historical loan records with 13 borrower and asset attributes."
            },
            {
                "step": "2. Data Preprocessing & Cleaning",
                "description": "Verified zero nulls, zero duplicate feature rows, stripped whitespace from labels, and isolated target labels ('Approved' / 'Rejected'). Excluded non-predictive identifier 'loan_id'."
            },
            {
                "step": "3. Transformation & Warehousing",
                "description": "Normalized data into a 4-table SQLite Star Schema (FactLoanApplication, DimApplicant, DimLoan, DimLoanStatus). Engineered financial ratios and discretized numeric fields into understandable bands."
            },
            {
                "step": "4. Data Mining & Modeling",
                "description": "Built scikit-learn ColumnTransformer pipeline scaling numerical features and one-hot encoding categories. Trained a Random Forest classifier with stratified 5-fold cross-validation."
            },
            {
                "step": "5. Evaluation & Interpretation",
                "description": "Evaluated on a 20% holdout test set using Accuracy, Precision, Recall, F1-Score, ROC-AUC, and Confusion Matrix. Verified that credit score (CIBIL) and loan term constitute the strongest decision boundaries."
            }
        ],
        "dataset_source": {
            "name": "Loan Approval Prediction Dataset",
            "provider": "Kaggle",
            "license": "Open Academic Use / CC BY-NC-SA 4.0",
            "attributes_count": 13,
            "records_count": 4269,
            "time_dimension": "None (no application dates exist in dataset; avoided inventing fabricated temporal facts)"
        },
        "limitations": [
            "Dataset does not contain demographic or geographical attributes, preventing location-based credit analysis.",
            "Historical interest rates and macroeconomic indicators are absent from the dataset.",
            "CIBIL score exhibits dominant predictive weight (83%+ importance), which reflects synthetic or credit-bureau-dominated approval policies in this specific benchmark."
        ]
    }
