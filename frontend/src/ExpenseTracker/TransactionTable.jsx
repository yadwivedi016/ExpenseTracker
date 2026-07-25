import React from "react";
import "../Styles/Dashboard.css";

const TransactionTable = ({
  transactions,
  editTransaction,
  deleteTransaction,
}) => {
  const totalAmount = transactions.reduce(
    (sum, tx) =>
      tx.type === "Income"
        ? sum + Number(tx.amount)
        : sum - Number(tx.amount),
    0
  );

  const handleDelete = (transactionId) => {
    if (window.confirm("Delete this transaction?")) {
      deleteTransaction(transactionId);
    }
  };

  const formatAmount = (amount) => {
    return Number(amount).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div className="card table-card">
      <div className="card-header">
        <div className="header-title-group">
          <h2>Transactions</h2>
          <span className="badge tx-count-badge">
            {transactions.length} {transactions.length === 1 ? "entry" : "entries"}
          </span>
        </div>
        <p className="card-subtitle">Complete history of all recorded financial movements</p>
      </div>

      {transactions.length === 0 ? (
        <div className="empty-table-state">
          <div className="empty-icon-wrapper">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2"></rect>
              <line x1="6" y1="8" x2="18" y2="8"></line>
              <line x1="6" y1="12" x2="14" y2="12"></line>
              <line x1="6" y1="16" x2="10" y2="16"></line>
            </svg>
          </div>
          <h3>No transactions found</h3>
          <p>There are no transactions recorded for the selected filter.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="transaction-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Type</th>
                <th>Description</th>
                <th className="text-right">Amount</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.transaction_id} className="table-row">
                  <td className="date-cell">
                    <span className="date-text">{tx.transaction_date}</span>
                  </td>

                  <td>
                    <span className="category-chip">{tx.category_name}</span>
                  </td>

                  <td>
                    <span
                      className={`badge-pill ${
                        tx.type === "Income"
                          ? "income-badge"
                          : "expense-badge"
                      }`}
                    >
                      <span className="badge-dot"></span>
                      {tx.type}
                    </span>
                  </td>

                  <td className="description-cell">
                    {tx.description ? (
                      <span>{tx.description}</span>
                    ) : (
                      <span className="muted-text">—</span>
                    )}
                  </td>

                  <td
                    className={`amount-cell text-right ${
                      tx.type === "Income"
                        ? "income-text"
                        : "expense-text"
                    }`}
                  >
                    {tx.type === "Income" ? "+" : "-"}₹{formatAmount(tx.amount)}
                  </td>

                  <td className="actions-cell text-center">
                    <button
                      className="icon-action-btn edit-btn"
                      onClick={() => editTransaction(tx)}
                      title="Edit Transaction"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </button>

                    <button
                      className="icon-action-btn delete-btn"
                      onClick={() => handleDelete(tx.transaction_id)}
                      title="Delete Transaction"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

            <tfoot>
              <tr className="total-row">
                <td colSpan="4">
                  <strong>Net Total</strong>
                </td>
                <td
                  className={`amount-cell text-right ${
                    totalAmount >= 0 ? "income-text" : "expense-text"
                  }`}
                >
                  <strong>
                    {totalAmount >= 0 ? "+" : ""}₹{formatAmount(totalAmount)}
                  </strong>
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
};

export default TransactionTable;