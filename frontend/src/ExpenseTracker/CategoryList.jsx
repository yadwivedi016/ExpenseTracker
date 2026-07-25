import React from "react";
import "../Styles/Dashboard.css";

const CategoryList = ({
  categories,
  transactions,
  selectedCategoryId,
  setSelectedCategoryId,
  editCategory,
  deleteCategory,
}) => {
  const handleDelete = (categoryId) => {
    if (
      window.confirm(
        "Delete this category?\n\nAll transactions under this category will also be deleted."
      )
    ) {
      deleteCategory(categoryId);
    }
  };

  return (
    <div className="card category-list-card">
      <div className="card-header">
        <div className="header-title-group">
          <h2>Categories</h2>
          <span className="badge category-count-badge">
            {categories.length} {categories.length === 1 ? "category" : "categories"}
          </span>
        </div>
        <p className="card-subtitle">Filter transactions by category or manage your list</p>
      </div>

      <ul className="category-list">
        <li
          className={`category-item ${selectedCategoryId === null ? "active" : ""}`}
          onClick={() => setSelectedCategoryId(null)}
        >
          <div className="category-info">
            <div className="category-icon-wrapper">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
            </div>
            <strong>All Categories</strong>
          </div>

          <div className="category-actions">
            <span className="count-pill">{transactions.length}</span>
          </div>
        </li>

        {categories.length === 0 ? (
          <li className="empty-state-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span>No categories created yet. Use the form above to add one.</span>
          </li>
        ) : (
          categories.map((category) => {
            const count = transactions.filter((tx) => {
              const txCatId = tx.category_id ?? tx.category?.category_id ?? (typeof tx.category === "object" ? tx.category?.id : tx.category);
              return String(txCatId) === String(category.category_id);
            }).length;

            const isSelected = String(selectedCategoryId) === String(category.category_id);

            return (
              <li
                key={category.category_id}
                className={`category-item ${isSelected ? "active" : ""}`}
                onClick={() => setSelectedCategoryId(category.category_id)}
              >
                <div className="category-info">
                  <strong>{category.category_name}</strong>
                  <span className={`type-tag ${category.type === "Income" ? "type-tag-income" : "type-tag-expense"}`}>
                    {category.type}
                  </span>
                </div>

                <div
                  className="category-actions"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="count-pill">{count}</span>

                  <button
                    className="icon-action-btn edit-btn"
                    onClick={() => editCategory(category)}
                    title="Edit Category"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                  </button>

                  <button
                    className="icon-action-btn delete-btn"
                    onClick={() => handleDelete(category.category_id)}
                    title="Delete Category"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                </div>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
};

export default CategoryList;
