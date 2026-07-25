import React from "react";
import "../Styles/Dashboard.css";

const CategoryForm = ({
  categoryForm,
  setCategoryForm,
  createCategory,
  editingCategory,
  cancelCategoryEdit,
}) => {
  return (
    <div className="card form-card">
      <div className="card-header">
        <div className="card-header-icon category-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
          </svg>
        </div>
        <div>
          <h2>{editingCategory ? "Edit Category" : "Create Category"}</h2>
          <p className="card-subtitle">
            {editingCategory
              ? "Update category name or type"
              : "Group your income & expenses with custom categories"}
          </p>
        </div>
      </div>

      <form onSubmit={createCategory} className="dashboard-form">
        <div className="form-group">
          <label className="form-label">Category Name</label>
          <div className="input-wrapper">
            <span className="input-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="9" x2="20" y2="9"></line>
                <line x1="4" y1="15" x2="20" y2="15"></line>
                <line x1="10" y1="3" x2="8" y2="21"></line>
                <line x1="16" y1="3" x2="14" y2="21"></line>
              </svg>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="e.g., Groceries, Salary, Utilities"
              value={categoryForm.category_name}
              onChange={(e) =>
                setCategoryForm({
                  ...categoryForm,
                  category_name: e.target.value,
                })
              }
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Category Type</label>
          <div className="type-toggle-container">
            <button
              type="button"
              className={`type-toggle-btn ${categoryForm.type === "Expense" ? "active-expense" : ""}`}
              onClick={() => setCategoryForm({ ...categoryForm, type: "Expense" })}
            >
              Expense
            </button>
            <button
              type="button"
              className={`type-toggle-btn ${categoryForm.type === "Income" ? "active-income" : ""}`}
              onClick={() => setCategoryForm({ ...categoryForm, type: "Income" })}
            >
              Income
            </button>
          </div>

          <select
            style={{ display: "none" }}
            value={categoryForm.type}
            onChange={(e) =>
              setCategoryForm({
                ...categoryForm,
                type: e.target.value,
              })
            }
          >
            <option value="Expense">Expense</option>
            <option value="Income">Income</option>
          </select>
        </div>

        <div className="form-buttons">
          <button type="submit" className="btn btn-primary">
            {editingCategory ? "Update Category" : "Create Category"}
          </button>

          {editingCategory && (
            <button
              type="button"
              className="btn btn-secondary cancel-btn"
              onClick={cancelCategoryEdit}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;