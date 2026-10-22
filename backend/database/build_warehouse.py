"""
SQLite Star Schema ETL for Loan Intelligence Platform.
Builds the dimensional warehouse from data/loan_approval_dataset.csv.
Fact table: FactLoanApplication
Dimension tables: DimApplicant, DimLoan, DimLoanStatus
"""
import os
import sqlite3
import pandas as pd
import numpy as np

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CSV_PATH = os.path.join(BASE_DIR, "data", "loan_approval_dataset.csv")
DB_PATH = os.path.join(BASE_DIR, "database", "loan_warehouse.db")

def categorize_cibil(score):
    if score < 550:
        return "Poor (<550)"
    elif score < 650:
        return "Fair (550-649)"
    elif score < 750:
        return "Good (650-749)"
    else:
        return "Excellent (750+)"

def categorize_term(term):
    if term <= 6:
        return "Short (2-6 yrs)"
    elif term <= 14:
        return "Medium (8-14 yrs)"
    else:
        return "Long (16-20 yrs)"

def categorize_loan_amount(amount):
    if amount < 5000000:
        return "Tier 1 (< ₹50L)"
    elif amount < 15000000:
        return "Tier 2 (₹50L - ₹1.5Cr)"
    elif amount < 25000000:
        return "Tier 3 (₹1.5Cr - ₹2.5Cr)"
    else:
        return "Tier 4 (> ₹2.5Cr)"

def categorize_income(income):
    if income < 2000000:
        return "Low (< ₹20L)"
    elif income < 5000000:
        return "Middle (₹20L - ₹50L)"
    elif income < 7500000:
        return "Upper-Middle (₹50L - ₹75L)"
    else:
        return "High (> ₹75L)"

def build_warehouse():
    print(f"Loading data from {CSV_PATH}...")
    df = pd.read_csv(CSV_PATH)
    # Strip whitespace from column names and string values
    df.columns = df.columns.str.strip()
    for col in df.select_dtypes(include='object').columns:
        df[col] = df[col].str.strip()

    print(f"Dataset shape: {df.shape}")

    # Derived fields
    df['total_assets_value'] = (
        df['residential_assets_value'] +
        df['commercial_assets_value'] +
        df['luxury_assets_value'] +
        df['bank_asset_value']
    )
    df['asset_to_loan_ratio'] = np.where(
        df['loan_amount'] > 0,
        np.round(df['total_assets_value'] / df['loan_amount'], 4),
        0.0
    )
    df['loan_to_income_ratio'] = np.where(
        df['income_annum'] > 0,
        np.round(df['loan_amount'] / df['income_annum'], 4),
        0.0
    )
    df['cibil_band'] = df['cibil_score'].apply(categorize_cibil)
    df['loan_term_band'] = df['loan_term'].apply(categorize_term)
    df['loan_amount_band'] = df['loan_amount'].apply(categorize_loan_amount)
    df['income_band'] = df['income_annum'].apply(categorize_income)

    if os.path.exists(DB_PATH):
        os.remove(DB_PATH)

    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    cur.executescript("""
    PRAGMA foreign_keys = ON;

    -- DimApplicant
    CREATE TABLE DimApplicant (
        applicant_key INTEGER PRIMARY KEY AUTOINCREMENT,
        no_of_dependents INTEGER NOT NULL,
        education TEXT NOT NULL,
        self_employed TEXT NOT NULL,
        UNIQUE(no_of_dependents, education, self_employed)
    );

    -- DimLoan
    CREATE TABLE DimLoan (
        loan_key INTEGER PRIMARY KEY AUTOINCREMENT,
        loan_term INTEGER NOT NULL,
        loan_term_band TEXT NOT NULL,
        loan_amount_band TEXT NOT NULL,
        UNIQUE(loan_term, loan_term_band, loan_amount_band)
    );

    -- DimLoanStatus
    CREATE TABLE DimLoanStatus (
        status_key INTEGER PRIMARY KEY AUTOINCREMENT,
        loan_status TEXT NOT NULL UNIQUE
    );

    -- FactLoanApplication
    CREATE TABLE FactLoanApplication (
        fact_id INTEGER PRIMARY KEY AUTOINCREMENT,
        loan_id INTEGER NOT NULL UNIQUE,
        applicant_key INTEGER NOT NULL,
        loan_key INTEGER NOT NULL,
        status_key INTEGER NOT NULL,
        income_annum REAL NOT NULL,
        income_band TEXT NOT NULL,
        loan_amount REAL NOT NULL,
        loan_term INTEGER NOT NULL,
        cibil_score INTEGER NOT NULL,
        cibil_band TEXT NOT NULL,
        residential_assets_value REAL NOT NULL,
        commercial_assets_value REAL NOT NULL,
        luxury_assets_value REAL NOT NULL,
        bank_asset_value REAL NOT NULL,
        total_assets_value REAL NOT NULL,
        asset_to_loan_ratio REAL NOT NULL,
        loan_to_income_ratio REAL NOT NULL,
        app_count INTEGER NOT NULL DEFAULT 1,
        FOREIGN KEY (applicant_key) REFERENCES DimApplicant(applicant_key),
        FOREIGN KEY (loan_key) REFERENCES DimLoan(loan_key),
        FOREIGN KEY (status_key) REFERENCES DimLoanStatus(status_key)
    );

    CREATE INDEX idx_fact_applicant ON FactLoanApplication(applicant_key);
    CREATE INDEX idx_fact_loan ON FactLoanApplication(loan_key);
    CREATE INDEX idx_fact_status ON FactLoanApplication(status_key);
    CREATE INDEX idx_fact_cibil_band ON FactLoanApplication(cibil_band);
    """)

    # Populate DimLoanStatus
    statuses = sorted(df['loan_status'].unique())
    for s in statuses:
        cur.execute("INSERT INTO DimLoanStatus (loan_status) VALUES (?)", (s,))
    conn.commit()

    # Populate DimApplicant
    applicants = df[['no_of_dependents', 'education', 'self_employed']].drop_duplicates()
    for _, row in applicants.iterrows():
        cur.execute(
            "INSERT INTO DimApplicant (no_of_dependents, education, self_employed) VALUES (?, ?, ?)",
            (int(row['no_of_dependents']), row['education'], row['self_employed'])
        )
    conn.commit()

    # Populate DimLoan
    loans = df[['loan_term', 'loan_term_band', 'loan_amount_band']].drop_duplicates()
    for _, row in loans.iterrows():
        cur.execute(
            "INSERT INTO DimLoan (loan_term, loan_term_band, loan_amount_band) VALUES (?, ?, ?)",
            (int(row['loan_term']), row['loan_term_band'], row['loan_amount_band'])
        )
    conn.commit()

    # Mappings
    status_map = dict(cur.execute("SELECT loan_status, status_key FROM DimLoanStatus").fetchall())
    applicant_map = {
        (dep, edu, emp): key
        for key, dep, edu, emp in cur.execute("SELECT applicant_key, no_of_dependents, education, self_employed FROM DimApplicant").fetchall()
    }
    loan_map = {
        (term, t_band, a_band): key
        for key, term, t_band, a_band in cur.execute("SELECT loan_key, loan_term, loan_term_band, loan_amount_band FROM DimLoan").fetchall()
    }

    # Insert into FactLoanApplication
    fact_rows = []
    for _, r in df.iterrows():
        app_key = applicant_map[(int(r['no_of_dependents']), r['education'], r['self_employed'])]
        l_key = loan_map[(int(r['loan_term']), r['loan_term_band'], r['loan_amount_band'])]
        st_key = status_map[r['loan_status']]

        fact_rows.append((
            int(r['loan_id']),
            app_key,
            l_key,
            st_key,
            float(r['income_annum']),
            r['income_band'],
            float(r['loan_amount']),
            int(r['loan_term']),
            int(r['cibil_score']),
            r['cibil_band'],
            float(r['residential_assets_value']),
            float(r['commercial_assets_value']),
            float(r['luxury_assets_value']),
            float(r['bank_asset_value']),
            float(r['total_assets_value']),
            float(r['asset_to_loan_ratio']),
            float(r['loan_to_income_ratio']),
            1
        ))

    cur.executemany("""
    INSERT INTO FactLoanApplication (
        loan_id, applicant_key, loan_key, status_key,
        income_annum, income_band, loan_amount, loan_term,
        cibil_score, cibil_band, residential_assets_value,
        commercial_assets_value, luxury_assets_value,
        bank_asset_value, total_assets_value,
        asset_to_loan_ratio, loan_to_income_ratio, app_count
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, fact_rows)

    conn.commit()
    print("Star Schema warehouse successfully built!")
    
    # Validation query
    total_facts = cur.execute("SELECT COUNT(*) FROM FactLoanApplication").fetchone()[0]
    print(f"Total Fact rows inserted: {total_facts}")
    
    conn.close()

if __name__ == "__main__":
    build_warehouse()
