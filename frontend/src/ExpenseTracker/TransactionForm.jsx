import React from "react";
import "../Styles/Dashboard.css";

const TransactionForm = ({
  categories,
  transactionForm,
  setTransactionForm,
  createTransaction,
  editingTransaction,
  cancelTransactionEdit,
}) => {
  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <div className="card form-card">
      <div className="card-header">
        <div className="card-header-icon primary-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </div>
        <div>
          <h2>{editingTransaction ? "Edit Transaction" : "Add Transaction"}</h2>
          <p className="card-subtitle">
            {editingTransaction
              ? "Modify the details of your recorded transaction"
              : "Enter transaction details to track your money flow"}
          </p>
        </div>
      </div>

      <form onSubmit={createTransaction} className="dashboard-form">
        <div className="form-group">
          <label className="form-label">Category</label>
          <div className="input-wrapper">
            <span className="input-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                <line x1="7" y1="7" x2="7.01" y2="7"></line>
              </svg>
            </span>
            <select
              className="form-control select-control"
              value={transactionForm.category_id}
              onChange={(e) =>
                setTransactionForm({
                  ...transactionForm,
                  category_id: e.target.value,
                })
              }
              required
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.category_id} value={category.category_id}>
                  {category.category_name} ({category.type})
                </option>
              ))}
            </select>
            <span className="select-caret">▾</span>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Amount (₹)</label>
          <div className="input-wrapper">
            <span className="input-icon amount-symbol">₹</span>
            <input
              type="number"
              step="0.01"
              className="form-control"
              placeholder="0.00"
              value={transactionForm.amount}
              onChange={(e) =>
                setTransactionForm({
                  ...transactionForm,
                  amount: e.target.value,
                })
              }
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <div className="input-wrapper">
            <span className="input-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="e.g., Grocery shopping, Monthly salary"
              value={transactionForm.description}
              onChange={(e) =>
                setTransactionForm({
                  ...transactionForm,
                  description: e.target.value,
                })
              }
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Date</label>
          <div className="input-wrapper">
            <span className="input-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </span>
            <input
              type="date"
              className="form-control"
              max={todayStr}
              value={transactionForm.transaction_date}
              onChange={(e) => {
                if (e.target.value > todayStr) {
                  alert("Transaction date cannot be in the future.");
                  return;
                }
                setTransactionForm({
                  ...transactionForm,
                  transaction_date: e.target.value,
                });
              }}
              required
            />
          </div>
        </div>

        <div className="form-buttons">
          <button type="submit" className="btn btn-primary">
            {editingTransaction ? "Update Transaction" : "Add Transaction"}
          </button>

          {editingTransaction && (
            <button
              type="button"
              className="btn btn-secondary cancel-btn"
              onClick={cancelTransactionEdit}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;