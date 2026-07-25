import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

import "../Styles/Dashboard.css";

import SummaryCards from "./SummaryCards";
import TransactionForm from "./TransactionForm";
import CategoryForm from "./CategoryForm";
import CategoryList from "./CategoryList";
import TransactionTable from "./TransactionTable";

const Dashboard = ({ isAuthenticated, setIsAuthenticated }) => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  const [editingCategory, setEditingCategory] = useState(null);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const [categoryForm, setCategoryForm] = useState({
    category_name: "",
    type: "Expense",
  });

  const [transactionForm, setTransactionForm] = useState({
    category_id: "",
    amount: "",
    description: "",
    transaction_date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    loadCategories();
    loadTransactions();
  }, [isAuthenticated, navigate]);

  const handleUnauthorized = (err) => {
    if (err.response?.status === 401 || err.response?.status === 403) {
      localStorage.removeItem("token");
      if (setIsAuthenticated) setIsAuthenticated(false);
      navigate("/login");
    }
  };

  // Summary logic
  const income = transactions
    .filter((tx) => tx.type === "Income")
    .reduce((sum, tx) => sum + Number(tx.amount), 0);

  const expense = transactions
    .filter((tx) => tx.type === "Expense")
    .reduce((sum, tx) => sum + Number(tx.amount), 0);

  // Category API handlers
  const loadCategories = async () => {
    try {
      const res = await API.get("categories/", {
        withCredentials: true,
      });
      setCategories(res.data.categories || []);
    } catch (err) {
      console.log(err.response?.data);
      handleUnauthorized(err);
    }
  };

  const createCategory = async (e) => {
    e.preventDefault();

    try {
      if (editingCategory) {
        await API.put(`categories/${editingCategory.category_id}/`,
          categoryForm,
          { withCredentials: true }
        );
        alert("Category updated.");
      } else {
        await API.post("/categories/",
          categoryForm,
          { withCredentials: true }
        );
        alert("Category created.");
      }

      setEditingCategory(null);
      setCategoryForm({ category_name: "", type: "Expense" });
      loadCategories();
    } catch (err) {
      alert(err.response?.data?.message || "An error occurred");
      handleUnauthorized(err);
    }
  };

  const editCategory = (category) => {
    setEditingCategory(category);
    setCategoryForm({
      category_name: category.category_name,
      type: category.type,
    });
  };

  const cancelCategoryEdit = () => {
    setEditingCategory(null);
    setCategoryForm({ category_name: "", type: "Expense" });
  };

  const deleteCategory = async (categoryId) => {
    try {
      await API.delete(`/categories/${categoryId}/`,
        { withCredentials: true }
      );
      loadCategories();
      loadTransactions();
    } catch (err) {
      alert(err.response?.data?.message || "An error occurred");
      handleUnauthorized(err);
    }
  };

  // Transaction API handlers
  const loadTransactions = async () => {
    try {
      const res = await API.get("/transactions/", {
        withCredentials: true,
      });
      setTransactions(res.data.transactions || []);
    } catch (err) {
      console.log(err.response?.data);
      handleUnauthorized(err);
    }
  };

  const createTransaction = async (e) => {
    e.preventDefault();

    try {
      if (editingTransaction) {
        await API.put(`transactions/${editingTransaction.transaction_id}/`,
          transactionForm,
          { withCredentials: true }
        );
        alert("Transaction updated.");
      } else {
        await API.post("/transactions/",
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
      handleUnauthorized(err);
    }
  };

  const editTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setTransactionForm({
      category_id: transaction.category_id,
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
    try {
      await API.delete(`/transactions/${transactionId}/`,
        { withCredentials: true }
      );
      loadTransactions();
    } catch (err) {
      alert(err.response?.data?.message || "An error occurred");
      handleUnauthorized(err);
    }
  };

  const visibleTransactions =
    selectedCategoryId === null
      ? transactions
      : transactions.filter(
          (tx) => String(tx.category_id) === String(selectedCategoryId)
        );

  if (!isAuthenticated) return null;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Financial Overview</h1>
          <p className="dashboard-subtitle">
            Track expenses, manage budget categories, and organize your money seamlessly.
          </p>
        </div>
        <div className="dashboard-badge">
          <span className="live-dot"></span> Active Dashboard
        </div>
      </header>

      <SummaryCards income={income} expense={expense} />

      <div className="dashboard-grid">
        <TransactionForm
          categories={categories}
          transactionForm={transactionForm}
          setTransactionForm={setTransactionForm}
          createTransaction={createTransaction}
          editingTransaction={editingTransaction}
          cancelTransactionEdit={cancelTransactionEdit}
        />

        <CategoryForm
          categoryForm={categoryForm}
          setCategoryForm={setCategoryForm}
          createCategory={createCategory}
          editingCategory={editingCategory}
          cancelCategoryEdit={cancelCategoryEdit}
        />
      </div>

      <CategoryList
        categories={categories}
        transactions={transactions}
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
    </div>
  );
};

export default Dashboard;