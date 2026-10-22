"""
Model training and evaluation pipeline for Loan Intelligence Platform.
Trains a scikit-learn Pipeline with ColumnTransformer and RandomForestClassifier.
Performs stratified train/test split, 5-fold cross-validation, and computes real metrics.
"""
import os
import json
import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, StratifiedKFold, cross_validate
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    roc_auc_score, confusion_matrix, classification_report
)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CSV_PATH = os.path.join(BASE_DIR, "data", "loan_approval_dataset.csv")
MODEL_OUT_PATH = os.path.join(BASE_DIR, "ml", "pipeline.joblib")
METRICS_OUT_PATH = os.path.join(BASE_DIR, "ml", "metrics.json")

def train_and_evaluate():
    print(f"Reading dataset from {CSV_PATH}...")
    df = pd.read_csv(CSV_PATH)
    df.columns = df.columns.str.strip()
    for col in df.select_dtypes(include=['object', 'string']).columns:
        df[col] = df[col].astype(str).str.strip()

    # Target
    y_raw = df['loan_status'].values
    # Approved = 1, Rejected = 0
    y = np.where(y_raw == 'Approved', 1, 0)

    # Exclude loan_id and target
    X = df.drop(columns=['loan_id', 'loan_status'])

    cat_cols = ['education', 'self_employed']
    num_cols = [
        'no_of_dependents', 'income_annum', 'loan_amount', 'loan_term',
        'cibil_score', 'residential_assets_value', 'commercial_assets_value',
        'luxury_assets_value', 'bank_asset_value'
    ]

    print("Feature columns:")
    print("  Categorical:", cat_cols)
    print("  Numerical:", num_cols)

    # Preprocessor
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), num_cols),
            ('cat', OneHotEncoder(drop='if_binary', handle_unknown='ignore'), cat_cols)
        ]
    )

    # Stratified Train/Test Split (80/20)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )
    print(f"Train split: {X_train.shape[0]} samples, Test split: {X_test.shape[0]} samples")

    # 1. Evaluate Alternative Baseline Classifiers for comparison
    models = {
        "Logistic Regression": Pipeline([
            ('preprocessor', preprocessor),
            ('clf', LogisticRegression(random_state=42, max_iter=1000))
        ]),
        "Decision Tree": Pipeline([
            ('preprocessor', preprocessor),
            ('clf', DecisionTreeClassifier(random_state=42, max_depth=8))
        ]),
        "Random Forest": Pipeline([
            ('preprocessor', preprocessor),
            ('clf', RandomForestClassifier(n_estimators=150, max_depth=12, random_state=42, min_samples_split=4))
        ])
    }

    comparison_results = {}
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

    for name, pipe in models.items():
        print(f"Running 5-Fold Cross-Validation for {name}...")
        cv_scores = cross_validate(
            pipe, X_train, y_train, cv=cv,
            scoring=['accuracy', 'precision', 'recall', 'f1', 'roc_auc']
        )
        pipe.fit(X_train, y_train)
        y_pred = pipe.predict(X_test)
        y_prob = pipe.predict_proba(X_test)[:, 1] if hasattr(pipe, 'predict_proba') else None

        acc = float(accuracy_score(y_test, y_pred))
        prec = float(precision_score(y_test, y_pred))
        rec = float(recall_score(y_test, y_pred))
        f1 = float(f1_score(y_test, y_pred))
        auc = float(roc_auc_score(y_test, y_prob)) if y_prob is not None else 0.0

        comparison_results[name] = {
            "cv_accuracy_mean": float(np.mean(cv_scores['test_accuracy'])),
            "cv_accuracy_std": float(np.std(cv_scores['test_accuracy'])),
            "cv_f1_mean": float(np.mean(cv_scores['test_f1'])),
            "test_accuracy": acc,
            "test_precision": prec,
            "test_recall": rec,
            "test_f1": f1,
            "test_roc_auc": auc
        }

    # 2. Main Selected Model: Random Forest
    rf_pipeline = models["Random Forest"]
    rf_pipeline.fit(X_train, y_train)

    y_test_pred = rf_pipeline.predict(X_test)
    y_test_prob = rf_pipeline.predict_proba(X_test)[:, 1]

    # Confusion matrix:
    # rows: true (0: Rejected, 1: Approved)
    # cols: pred (0: Rejected, 1: Approved)
    cm = confusion_matrix(y_test, y_test_pred)
    tn, fp, fn, tp = cm.ravel()

    # Feature Importance extraction
    rf_clf = rf_pipeline.named_steps['clf']
    # OneHotEncoder feature names
    cat_feature_names = rf_pipeline.named_steps['preprocessor'].named_transformers_['cat'].get_feature_names_out(cat_cols).tolist()
    all_feature_names = num_cols + cat_feature_names
    importances = rf_clf.feature_importances_

    feature_importance_list = [
        {"feature": name, "importance": float(imp)}
        for name, imp in sorted(zip(all_feature_names, importances), key=lambda x: x[1], reverse=True)
    ]

    metrics = {
        "dataset": {
            "total_samples": int(len(df)),
            "features_count": int(X.shape[1]),
            "train_samples": int(len(X_train)),
            "test_samples": int(len(X_test)),
            "target_classes": ["Rejected (0)", "Approved (1)"],
            "class_distribution": {
                "Approved": int(np.sum(y == 1)),
                "Rejected": int(np.sum(y == 0))
            }
        },
        "model_metadata": {
            "model_type": "RandomForestClassifier",
            "n_estimators": 150,
            "max_depth": 12,
            "preprocessing": "StandardScaler (numeric) + OneHotEncoder (categorical)",
            "pipeline_type": "scikit-learn Pipeline with ColumnTransformer"
        },
        "test_metrics": {
            "accuracy": float(accuracy_score(y_test, y_test_pred)),
            "precision": float(precision_score(y_test, y_test_pred)),
            "recall": float(recall_score(y_test, y_test_pred)),
            "f1_score": float(f1_score(y_test, y_test_pred)),
            "roc_auc": float(roc_auc_score(y_test, y_test_prob)),
            "specificity": float(tn / (tn + fp))
        },
        "confusion_matrix": {
            "matrix": cm.tolist(),
            "labels": ["Rejected", "Approved"],
            "true_negatives": int(tn),
            "false_positives": int(fp),
            "false_negatives": int(fn),
            "true_positives": int(tp)
        },
        "cross_validation_5fold": {
            "accuracy_scores": [float(s) for s in cv_scores['test_accuracy']],
            "mean_accuracy": float(np.mean(cv_scores['test_accuracy'])),
            "std_accuracy": float(np.std(cv_scores['test_accuracy'])),
            "mean_f1": float(np.mean(cv_scores['test_f1'])),
            "std_f1": float(np.std(cv_scores['test_f1'])),
            "mean_roc_auc": float(np.mean(cv_scores['test_roc_auc']))
        },
        "feature_importances": feature_importance_list,
        "model_comparison": comparison_results
    }

    print("\n--- Final Measured Metrics on Holdout Test Set ---")
    print(f"Accuracy:  {metrics['test_metrics']['accuracy']:.4f}")
    print(f"Precision: {metrics['test_metrics']['precision']:.4f}")
    print(f"Recall:    {metrics['test_metrics']['recall']:.4f}")
    print(f"F1-Score:  {metrics['test_metrics']['f1_score']:.4f}")
    print(f"ROC-AUC:   {metrics['test_metrics']['roc_auc']:.4f}")
    print("\nConfusion Matrix:")
    print(f"  TN: {tn} | FP: {fp}")
    print(f"  FN: {fn}  | TP: {tp}")

    # Save Pipeline and Metrics
    joblib.dump(rf_pipeline, MODEL_OUT_PATH)
    print(f"\nPipeline saved to: {MODEL_OUT_PATH}")

    with open(METRICS_OUT_PATH, "w", encoding="utf-8") as f:
        json.dump(metrics, f, indent=2)
    print(f"Metrics saved to: {METRICS_OUT_PATH}")

    return metrics

if __name__ == "__main__":
    train_and_evaluate()
