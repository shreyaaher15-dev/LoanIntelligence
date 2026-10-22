"""
Database access layer for the Loan Intelligence Platform.
Executes queries and OLAP aggregations against the SQLite star schema warehouse.
"""
import os
import sqlite3
from typing import Dict, Any, List, Optional

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(BASE_DIR, "database", "loan_warehouse.db")

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def get_dashboard_summary() -> Dict[str, Any]:
    with get_db() as conn:
        cur = conn.cursor()
        
        # Overall KPIs
        kpi_query = """
        SELECT 
            COUNT(*) as total_applications,
            SUM(CASE WHEN s.loan_status = 'Approved' THEN 1 ELSE 0 END) as approved_count,
            SUM(CASE WHEN s.loan_status = 'Rejected' THEN 1 ELSE 0 END) as rejected_count,
            ROUND(AVG(f.cibil_score), 1) as avg_cibil,
            ROUND(AVG(f.income_annum), 0) as avg_income,
            ROUND(AVG(f.loan_amount), 0) as avg_loan_amount,
            ROUND(SUM(f.loan_amount), 0) as total_loan_requested,
            ROUND(AVG(f.total_assets_value), 0) as avg_total_assets
        FROM FactLoanApplication f
        JOIN DimLoanStatus s ON f.status_key = s.status_key
        """
        kpi = dict(cur.execute(kpi_query).fetchone())
        kpi['approval_rate'] = round((kpi['approved_count'] / kpi['total_applications']) * 100, 2) if kpi['total_applications'] else 0.0

        # Approval by CIBIL Band
        cibil_query = """
        SELECT 
            f.cibil_band,
            SUM(CASE WHEN s.loan_status = 'Approved' THEN 1 ELSE 0 END) as approved,
            SUM(CASE WHEN s.loan_status = 'Rejected' THEN 1 ELSE 0 END) as rejected,
            COUNT(*) as total,
            ROUND(AVG(CASE WHEN s.loan_status = 'Approved' THEN 1.0 ELSE 0.0 END) * 100, 1) as approval_rate
        FROM FactLoanApplication f
        JOIN DimLoanStatus s ON f.status_key = s.status_key
        GROUP BY f.cibil_band
        ORDER BY 
            CASE f.cibil_band 
                WHEN 'Poor (<550)' THEN 1 
                WHEN 'Fair (550-649)' THEN 2 
                WHEN 'Good (650-749)' THEN 3 
                WHEN 'Excellent (750+)' THEN 4 
                ELSE 5 
            END
        """
        cibil_breakdown = [dict(r) for r in cur.execute(cibil_query).fetchall()]

        # Approval by Education
        edu_query = """
        SELECT 
            a.education,
            SUM(CASE WHEN s.loan_status = 'Approved' THEN 1 ELSE 0 END) as approved,
            SUM(CASE WHEN s.loan_status = 'Rejected' THEN 1 ELSE 0 END) as rejected,
            COUNT(*) as total,
            ROUND(AVG(CASE WHEN s.loan_status = 'Approved' THEN 1.0 ELSE 0.0 END) * 100, 1) as approval_rate
        FROM FactLoanApplication f
        JOIN DimApplicant a ON f.applicant_key = a.applicant_key
        JOIN DimLoanStatus s ON f.status_key = s.status_key
        GROUP BY a.education
        """
        edu_breakdown = [dict(r) for r in cur.execute(edu_query).fetchall()]

        # Approval by Employment
        emp_query = """
        SELECT 
            a.self_employed,
            SUM(CASE WHEN s.loan_status = 'Approved' THEN 1 ELSE 0 END) as approved,
            SUM(CASE WHEN s.loan_status = 'Rejected' THEN 1 ELSE 0 END) as rejected,
            COUNT(*) as total,
            ROUND(AVG(CASE WHEN s.loan_status = 'Approved' THEN 1.0 ELSE 0.0 END) * 100, 1) as approval_rate
        FROM FactLoanApplication f
        JOIN DimApplicant a ON f.applicant_key = a.applicant_key
        JOIN DimLoanStatus s ON f.status_key = s.status_key
        GROUP BY a.self_employed
        """
        emp_breakdown = [dict(r) for r in cur.execute(emp_query).fetchall()]

        # Approval by Loan Term Band
        term_query = """
        SELECT 
            l.loan_term_band,
            SUM(CASE WHEN s.loan_status = 'Approved' THEN 1 ELSE 0 END) as approved,
            SUM(CASE WHEN s.loan_status = 'Rejected' THEN 1 ELSE 0 END) as rejected,
            COUNT(*) as total,
            ROUND(AVG(CASE WHEN s.loan_status = 'Approved' THEN 1.0 ELSE 0.0 END) * 100, 1) as approval_rate
        FROM FactLoanApplication f
        JOIN DimLoan l ON f.loan_key = l.loan_key
        JOIN DimLoanStatus s ON f.status_key = s.status_key
        GROUP BY l.loan_term_band
        ORDER BY 
            CASE l.loan_term_band 
                WHEN 'Short (2-6 yrs)' THEN 1 
                WHEN 'Medium (8-14 yrs)' THEN 2 
                WHEN 'Long (16-20 yrs)' THEN 3 
                ELSE 4 
            END
        """
        term_breakdown = [dict(r) for r in cur.execute(term_query).fetchall()]

        # Asset comparison by Status
        asset_query = """
        SELECT 
            s.loan_status,
            ROUND(AVG(f.residential_assets_value), 0) as avg_residential,
            ROUND(AVG(f.commercial_assets_value), 0) as avg_commercial,
            ROUND(AVG(f.luxury_assets_value), 0) as avg_luxury,
            ROUND(AVG(f.bank_asset_value), 0) as avg_bank
        FROM FactLoanApplication f
        JOIN DimLoanStatus s ON f.status_key = s.status_key
        GROUP BY s.loan_status
        """
        asset_breakdown = [dict(r) for r in cur.execute(asset_query).fetchall()]

        return {
            "kpi": kpi,
            "cibil_breakdown": cibil_breakdown,
            "education_breakdown": edu_breakdown,
            "employment_breakdown": emp_breakdown,
            "term_breakdown": term_breakdown,
            "asset_breakdown": asset_breakdown
        }

def get_warehouse_analytics(
    education: Optional[str] = None,
    self_employed: Optional[str] = None,
    cibil_band: Optional[str] = None,
    loan_term_band: Optional[str] = None,
    group_by: str = "cibil_band"
) -> Dict[str, Any]:
    with get_db() as conn:
        cur = conn.cursor()

        where_clauses = []
        params = []

        if education and education != "All":
            where_clauses.append("a.education = ?")
            params.append(education)
        if self_employed and self_employed != "All":
            where_clauses.append("a.self_employed = ?")
            params.append(self_employed)
        if cibil_band and cibil_band != "All":
            where_clauses.append("f.cibil_band = ?")
            params.append(cibil_band)
        if loan_term_band and loan_term_band != "All":
            where_clauses.append("l.loan_term_band = ?")
            params.append(loan_term_band)

        where_sql = ("WHERE " + " AND ".join(where_clauses)) if where_clauses else ""

        # Validate group_by
        group_col_map = {
            "cibil_band": "f.cibil_band",
            "education": "a.education",
            "self_employed": "a.self_employed",
            "loan_term_band": "l.loan_term_band",
            "loan_amount_band": "l.loan_amount_band",
            "income_band": "f.income_band",
            "dependents": "a.no_of_dependents"
        }
        group_col = group_col_map.get(group_by, "f.cibil_band")

        summary_query = f"""
        SELECT 
            {group_col} as dimension_value,
            COUNT(*) as total_apps,
            SUM(CASE WHEN s.loan_status = 'Approved' THEN 1 ELSE 0 END) as approved_count,
            SUM(CASE WHEN s.loan_status = 'Rejected' THEN 1 ELSE 0 END) as rejected_count,
            ROUND(AVG(CASE WHEN s.loan_status = 'Approved' THEN 1.0 ELSE 0.0 END) * 100, 2) as approval_rate,
            ROUND(AVG(f.cibil_score), 1) as avg_cibil,
            ROUND(AVG(f.income_annum), 0) as avg_income,
            ROUND(AVG(f.loan_amount), 0) as avg_loan_amount,
            ROUND(AVG(f.total_assets_value), 0) as avg_assets,
            ROUND(AVG(f.asset_to_loan_ratio), 2) as avg_asset_to_loan_ratio
        FROM FactLoanApplication f
        JOIN DimApplicant a ON f.applicant_key = a.applicant_key
        JOIN DimLoan l ON f.loan_key = l.loan_key
        JOIN DimLoanStatus s ON f.status_key = s.status_key
        {where_sql}
        GROUP BY {group_col}
        ORDER BY total_apps DESC
        """
        rows = [dict(r) for r in cur.execute(summary_query, params).fetchall()]

        # Filtered overall summary
        overall_query = f"""
        SELECT 
            COUNT(*) as total_count,
            SUM(CASE WHEN s.loan_status = 'Approved' THEN 1 ELSE 0 END) as approved_count,
            SUM(CASE WHEN s.loan_status = 'Rejected' THEN 1 ELSE 0 END) as rejected_count,
            ROUND(AVG(f.cibil_score), 1) as avg_cibil,
            ROUND(AVG(f.income_annum), 0) as avg_income,
            ROUND(AVG(f.loan_amount), 0) as avg_loan_amount,
            ROUND(AVG(f.total_assets_value), 0) as avg_assets
        FROM FactLoanApplication f
        JOIN DimApplicant a ON f.applicant_key = a.applicant_key
        JOIN DimLoan l ON f.loan_key = l.loan_key
        JOIN DimLoanStatus s ON f.status_key = s.status_key
        {where_sql}
        """
        overall = dict(cur.execute(overall_query, params).fetchone())
        overall['approval_rate'] = (
            round((overall['approved_count'] / overall['total_count']) * 100, 2)
            if overall['total_count'] else 0.0
        )

        return {
            "filters_applied": {
                "education": education,
                "self_employed": self_employed,
                "cibil_band": cibil_band,
                "loan_term_band": loan_term_band,
                "group_by": group_by
            },
            "overall_filtered": overall,
            "grouped_data": rows
        }

def get_sample_records(limit: int = 50, offset: int = 0) -> List[Dict[str, Any]]:
    with get_db() as conn:
        cur = conn.cursor()
        query = """
        SELECT 
            f.loan_id,
            a.no_of_dependents,
            a.education,
            a.self_employed,
            f.income_annum,
            f.loan_amount,
            f.loan_term,
            f.cibil_score,
            f.cibil_band,
            f.residential_assets_value,
            f.commercial_assets_value,
            f.luxury_assets_value,
            f.bank_asset_value,
            f.total_assets_value,
            s.loan_status
        FROM FactLoanApplication f
        JOIN DimApplicant a ON f.applicant_key = a.applicant_key
        JOIN DimLoanStatus s ON f.status_key = s.status_key
        ORDER BY f.loan_id ASC
        LIMIT ? OFFSET ?
        """
        return [dict(r) for r in cur.execute(query, (limit, offset)).fetchall()]
