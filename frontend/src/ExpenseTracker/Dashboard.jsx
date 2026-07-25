import React, { useEffect, useState } from "react";
import axios from "axios";

import "../Styles/Dashboard.css";

import SummaryCards from "./SummaryCards";
import TransactionForm from "./TransactionForm";
import CategoryForm from "./CategoryForm";
import CategoryList from "./CategoryList";
import TransactionTable from "./TransactionTable";

const Dashboard = () => {
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  const [editingCategory, setEditingCategory] = useState(null);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const currentMonthStr = new Date().toISOString().slice(0, 7); // "YYYY-MM"
  const [selectedMonth, setSelectedMonth] = useState(currentMonthStr);

  const [categoryForm, setCategoryForm] = useState({
    category_name: "",
    type: "Expense",
    budget_limit: "", // NEW: optional monthly budget for this category
  });

  const [transactionForm, setTransactionForm] = useState({
    category_id: "",
    amount: "",
    description: "",
    transaction_date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadTransactions();
  }, [selectedMonth]);

  const getTxCategoryId = (tx) => {
    if (!tx) return null;
    return (
      tx.category_id ??
      tx.category?.category_id ??
      (typeof tx.category === "object" ? tx.category?.id : tx.category)
    );
  };

  const getTxCategoryName = (tx) => {
    if (!tx) return "Uncategorized";
    if (tx.category_name) return tx.category_name;
    if (typeof tx.category === "object" && tx.category?.category_name) {
      return tx.category.category_name;
    }
    const cat = categories.find(
      (c) => String(c.category_id) === String(getTxCategoryId(tx))
    );
    return cat ? cat.category_name : "Uncategorized";
  };

  // Category API handlers
  const loadCategories = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/categories/", {
        withCredentials: true,
      });
      setCategories(res.data.categories || res.data || []);
    } catch (err) {
      console.log(err.response?.data);
    }
  };

  const createCategory = async (e) => {
    e.preventDefault();

    // Validation: non-empty, trimmed name
    const trimmedName = categoryForm.category_name.trim();
    if (!trimmedName) {
      alert("Category name cannot be empty.");
      return;
    }

    // Validation: no duplicate name (case-insensitive), excluding the one being edited
    const isDuplicate = categories.some(
      (c) =>
        c.category_name.trim().toLowerCase() === trimmedName.toLowerCase() &&
        (!editingCategory || c.category_id !== editingCategory.category_id)
    );
    if (isDuplicate) {
      alert("A category with this name already exists.");
      return;
    }

    // Validation: budget limit, if provided, must be a positive number
    if (
      categoryForm.budget_limit !== "" &&
      Number(categoryForm.budget_limit) <= 0
    ) {
      alert("Budget limit must be greater than zero.");
      return;
    }

    const payload = {
      ...categoryForm,
      category_name: trimmedName,
      budget_limit:
        categoryForm.budget_limit === "" ? null : Number(categoryForm.budget_limit),
    };

    try {
      if (editingCategory) {
        await axios.put(
          `http://localhost:8000/api/categories/${editingCategory.category_id}/`,
          payload,
          { withCredentials: true }
        );
        alert("Category updated.");
      } else {
        await axios.post("http://localhost:8000/api/categories/", payload, {
          withCredentials: true,
        });
        alert("Category created.");
      }

      setEditingCategory(null);
      setCategoryForm({ category_name: "", type: "Expense", budget_limit: "" });
      loadCategories();
    } catch (err) {
      alert(err.response?.data?.message || "An error occurred");
    }
  };

  const editCategory = (category) => {
    setEditingCategory(category);
    setCategoryForm({
      category_name: category.category_name,
      type: category.type,
      budget_limit:
        category.budget_limit === null || category.budget_limit === undefined
          ? ""
          : String(category.budget_limit),
    });
  };

  const cancelCategoryEdit = () => {
    setEditingCategory(null);
    setCategoryForm({ category_name: "", type: "Expense", budget_limit: "" });
  };

  const deleteCategory = async (categoryId) => {
    const categoryTxCount = transactions.filter(
      (tx) => String(getTxCategoryId(tx)) === String(categoryId)
    ).length;

    const confirmMsg =
      categoryTxCount > 0
        ? `This category has ${categoryTxCount} transaction(s) linked to it. Deleting it may affect those records. Are you sure you want to continue?`
        : "Are you sure you want to delete this category?";

    if (!window.confirm(confirmMsg)) return;

    try {
      await axios.delete(
        `http://localhost:8000/api/categories/${categoryId}/`,
        { withCredentials: true }
      );
      loadCategories();
      loadTransactions();
    } catch (err) {
      alert(err.response?.data?.message || "An error occurred");
    }
  };

  // Transaction API handlers
  const loadTransactions = async () => {
    try {
      const url = selectedMonth
        ? `http://localhost:8000/api/transactions/?date=${selectedMonth}&month=${selectedMonth}`
        : `http://localhost:8000/api/transactions/`;

      const res = await axios.get(url, {
        withCredentials: true,
      });

      setTransactions(res.data.transactions || res.data || []);
    } catch (err) {
      console.log(err.response?.data);
    }
  };

  const createTransaction = async (e) => {
    e.preventDefault();

    // Prevent future-dated transactions
    const todayStr = new Date().toISOString().split("T")[0];
    if (transactionForm.transaction_date > todayStr) {
      alert("Transaction date cannot be in the future.");
      return;
    }

    // Validation: amount must be a positive number
    const amountNum = Number(transactionForm.amount);
    if (!transactionForm.amount || isNaN(amountNum) || amountNum <= 0) {
      alert("Amount must be greater than zero.");
      return;
    }

    // Validation: a category must be selected
    if (!transactionForm.category_id) {
      alert("Please select a category.");
      return;
    }

    try {
      if (editingTransaction) {
        await axios.put(
          `http://localhost:8000/api/transactions/${editingTransaction.transaction_id}/`,
          transactionForm,
          { withCredentials: true }
        );
        alert("Transaction updated.");
      } else {
        await axios.post(
          "http://localhost:8000/api/transactions/",
          transactionForm,
          { withCredentials: true }
        );
        alert("Transaction added.");
      }

      setEditingTransaction(null);
      setTransactionForm({
        category_id: "",
        amount: "",
        description: "",
        transaction_date: new Date().toISOString().split("T")[0],
      });
      loadTransactions();
    } catch (err) {
      alert(err.response?.data?.message || "An error occurred");
    }
  };

  const editTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setTransactionForm({
      category_id: getTxCategoryId(transaction) || "",
      amount: transaction.amount,
      description: transaction.description || "",
      transaction_date: transaction.transaction_date,
    });
  };

  const cancelTransactionEdit = () => {
    setEditingTransaction(null);
    setTransactionForm({
      category_id: "",
      amount: "",
      description: "",
      transaction_date: new Date().toISOString().split("T")[0],
    });
  };

  const deleteTransaction = async (transactionId) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) {
      return;
    }

    try {
      await axios.delete(
        `http://localhost:8000/api/transactions/${transactionId}/`,
        { withCredentials: true }
      );
      loadTransactions();
    } catch (err) {
      alert(err.response?.data?.message || "An error occurred");
    }
  };

  // Step 1: Filter transactions by selectedMonth (client-side fallback)
  const monthFilteredTransactions = transactions.filter((tx) => {
    if (!selectedMonth) return true;
    if (!tx.transaction_date) return true;
    return String(tx.transaction_date).startsWith(selectedMonth);
  });

  // Step 2: Filter transactions by selectedCategoryId
  const visibleTransactions = monthFilteredTransactions
    .filter((tx) => {
      if (selectedCategoryId === null || selectedCategoryId === "") return true;
      return String(getTxCategoryId(tx)) === String(selectedCategoryId);
    })
    .map((tx) => ({
      ...tx,
      category_name: getTxCategoryName(tx),
    }));

  // Dynamic summary totals based on the selected month
  const income = monthFilteredTransactions
    .filter((tx) => tx.type === "Income")
    .reduce((sum, tx) => sum + Number(tx.amount || 0), 0);

  const expense = monthFilteredTransactions
    .filter((tx) => tx.type === "Expense")
    .reduce((sum, tx) => sum + Number(tx.amount || 0), 0);

  // NEW: per-category spend within the selected month, for budget progress bars
  const categorySpend = categories.map((cat) => {
    const spent = monthFilteredTransactions
      .filter(
        (tx) => String(getTxCategoryId(tx)) === String(cat.category_id)
      )
      .reduce((sum, tx) => sum + Number(tx.amount || 0), 0);

    const budget =
      cat.budget_limit === null || cat.budget_limit === undefined
        ? null
        : Number(cat.budget_limit);

    const percentUsed = budget && budget > 0 ? (spent / budget) * 100 : null;

    return {
      ...cat,
      spent,
      budget,
      percentUsed,
      isOverBudget: budget !== null && spent > budget,
    };
  });

  return (
    <div className="dashboard-container">
      {/* Executive Header Toolbar */}
      <header className="dashboard-header">
        <div className="header-text-group">
          <h1 className="dashboard-title">Financial Overview</h1>
          <p className="dashboard-subtitle">
            Track expenses, manage budget categories, and organize your money seamlessly.
          </p>
        </div>

        <div className="header-controls">
          <div className="month-filter-group">
            <label className="filter-label">Period:</label>
            <input
              type="month"
              value={selectedMonth}
              max={currentMonthStr}
              onChange={(e) => {
                if (e.target.value > currentMonthStr) {
                  alert("You can't select a future month.");
                  return;
                }
                setSelectedMonth(e.target.value);
              }}
              className="month-filter-input"
            />
            {selectedMonth && (
              <button
                onClick={() => setSelectedMonth("")}
                className="clear-month-btn"
                title="View All Months"
              >
                All
              </button>
            )}
          </div>

          <div className="dashboard-badge">
            <span className="live-dot"></span> Active
          </div>
        </div>
      </header>

      {/* Summary Stat Cards */}
      <SummaryCards income={income} expense={expense} />

      {/* Structured 2-Column Main Dashboard Layout */}
      <div className="dashboard-main-layout">
        {/* Left Column: Category form first, then Transaction form */}
        <aside className="dashboard-sidebar">
          <CategoryForm
            categoryForm={categoryForm}
            setCategoryForm={setCategoryForm}
            createCategory={createCategory}
            editingCategory={editingCategory}
            cancelCategoryEdit={cancelCategoryEdit}
          />

          <TransactionForm
            categories={categories}
            transactionForm={transactionForm}
            setTransactionForm={setTransactionForm}
            createTransaction={createTransaction}
            editingTransaction={editingTransaction}
            cancelTransactionEdit={cancelTransactionEdit}
          />
        </aside>

        {/* Right Column: Category filters (with budget progress) & Transaction table */}
        <main className="dashboard-content-area">
          <CategoryList
            categories={categorySpend}
            transactions={monthFilteredTransactions}
            selectedCategoryId={selectedCategoryId}
            setSelectedCategoryId={setSelectedCategoryId}
            editCategory={editCategory}
            deleteCategory={deleteCategory}
          />

          <TransactionTable
            transactions={visibleTransactions}
            editTransaction={editTransaction}
            deleteTransaction={deleteTransaction}
          />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;