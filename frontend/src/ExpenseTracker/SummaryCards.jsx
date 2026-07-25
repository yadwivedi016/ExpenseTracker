import React from "react";
import "../Styles/Dashboard.css";

const SummaryCards = ({ income = 0, expense = 0 }) => {
  const totalIncome = Number(income);
  const totalExpense = Number(expense);
  const balance = totalIncome - totalExpense;

  const formatCurrency = (amount) => {
    return `₹${Number(amount).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <div className="summary-container">
      <div className="summary-card income-card">
        <div className="summary-header">
          <h4>Total Income</h4>
          <div className="summary-icon income-icon-bg">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
              <polyline points="17 6 23 6 23 12"></polyline>
            </svg>
          </div>
        </div>
        <h2>{formatCurrency(totalIncome)}</h2>
        <span className="summary-footer income-footer">Inflow recorded</span>
      </div>

      <div className="summary-card expense-card">
        <div className="summary-header">
          <h4>Total Expense</h4>
          <div className="summary-icon expense-icon-bg">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline>
              <polyline points="17 18 23 18 23 12"></polyline>
            </svg>
          </div>
        </div>
        <h2>{formatCurrency(totalExpense)}</h2>
        <span className="summary-footer expense-footer">Outflow recorded</span>
      </div>

      <div className="summary-card balance-card">
        <div className="summary-header">
          <h4>Current Balance</h4>
          <div className="summary-icon balance-icon-bg">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="5" width="20" height="14" rx="2"></rect>
              <line x1="2" y1="10" x2="22" y2="10"></line>
            </svg>
          </div>
        </div>
        <h2 className={balance >= 0 ? "balance-positive" : "balance-negative"}>
          {formatCurrency(balance)}
        </h2>
        <span className={`summary-footer ${balance >= 0 ? "balance-footer-pos" : "balance-footer-neg"}`}>
          {balance >= 0 ? "Net Surplus" : "Net Deficit"}
        </span>
      </div>
    </div>
  );
};

export default SummaryCards;