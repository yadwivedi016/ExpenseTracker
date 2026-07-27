# 💰 Expense Tracker

A full-stack Expense Tracker application built with **React**, **Django REST Framework (DRF)**, and **PostgreSQL**. The application enables users to securely manage their personal finances by tracking income, expenses, and custom categories through a clean and responsive dashboard. The frontend communicates with a RESTful API built using Django REST Framework for authentication and data management.

---

## 🌐 Live Demo

🚀 **Application:** https://expense-tracker-mocha-seven-30.vercel.app/

---

## ✨ Features

- 🔐 User Registration & Login
- 👤 Session-based Authentication
- 💰 Add Income & Expense Transactions
- 📂 Create, Update & Delete Categories
- 💳 Create, Update & Delete Transactions
- 📊 Dashboard displaying:
  - Total Income
  - Total Expense
  - Current Balance
- 📅 Monthly Transaction Filtering
- 🔍 Category-wise Transaction Filtering
- 📱 Responsive User Interface

---

## 🛠️ Tech Stack

### Frontend

- React
- React Router
- Axios
- CSS3

### Backend

- Django
- Django REST Framework (DRF)
- PostgreSQL
- Psycopg
- Python Dotenv

### Deployment

- Frontend: Vercel
- Backend: Render

---

## 📁 Project Structure

```text
ExpenseTracker/
│
├── backend/
│   ├── backend/
│   ├── expensetracker/
│   ├── manage.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## 🚀 Getting Started

### Clone the Repository

```bash
git clone https://github.com/yadwivedi016/ExpenseTracker.git
cd ExpenseTracker
```

### Backend Setup

```bash
cd backend

python -m venv env

# Windows
env\Scripts\activate

# macOS / Linux
source env/bin/activate

pip install -r requirements.txt

python manage.py runserver
```

### Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

---

## 🔑 Environment Variables

### Backend (.env)

```env
SECRET_KEY=your_secret_key
DEBUG=True

DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_HOST=your_database_host
DB_PORT=5432
DB_SSLMODE=disable

ALLOWED_HOSTS=127.0.0.1,localhost
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:8000/api
```

---

## 📸 Screenshots

Add screenshots of:

- Home Page
- Login Page
- Register Page
- Dashboard
- Categories
- Transactions

---

## 🚀 Future Improvements

- 📈 Expense Charts & Analytics
- 📄 Export Transactions (CSV/PDF)
- 🌙 Dark Mode

---

## 👨‍💻 Author

**Yash Dwivedi**

GitHub: https://github.com/yadwivedi016

---

## ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub.
