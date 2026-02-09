# Simple Expense Tracker (MERN)

A responsive web app built with the MERN stack that allows users to add, view, and manage expenses easily on mobile and desktop.

## Features

- User Authentication (Sign up, Login, Logout)
- **Dashboard** - Overview of income, expenses, and balance with recent activity
- **Income Tracking** - Add, view, and delete income sources
- **Expense Tracking** - Add, view, and delete expense categories
- **Analytics** - Visual charts and insights including:
  - Monthly trends (line & bar charts)
  - Expenses by category (pie chart)
  - Category breakdown
- Responsive Design (Mobile, Tablet, Desktop)
- Clean and Simple UI

## Tech Stack

- Frontend: React.js, Tailwind CSS
- Backend: Node.js, Express.js
- Database: MongoDB
- Authentication: JWT

## Prerequisites

- Node.js (v18 or higher)
- MongoDB installed and running on localhost:27017

## Setup Instructions

### Prerequisites

**IMPORTANT:** Before starting, ensure MongoDB is running!

**Option 1: Local MongoDB**
- Install MongoDB from https://www.mongodb.com/try/download/community
- Start MongoDB service:
  - Windows: Run as Administrator → `net start MongoDB`
  - Mac: `brew services start mongodb-community`
  - Linux: `sudo systemctl start mongod`

**Option 2: MongoDB Atlas (Cloud - FREE)**
- Create account at https://www.mongodb.com/cloud/atlas
- Create free cluster
- Add database user and IP `0.0.0.0/0`
- Get connection string and update `.env` file

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```
MONGODB_URI=mongodb://127.0.0.1:27017/expense-tracker
JWT_SECRET=your-secret-key-change-this-in-production
PORT=5000
```

4. Start the backend server:
```bash
npm run dev
```

You should see:
```
Connected to MongoDB
Server running on port 5000
```

If you see "MongoDB connection error", check TROUBLESHOOTING.md

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the frontend development server:
```bash
npm run dev
```

The frontend will be running on `http://localhost:3000`

### Quick Start

Run these commands in separate terminals:

Terminal 1 (Backend):
```bash
cd backend
npm install
npm run dev
```

Terminal 2 (Frontend):
```bash
cd frontend
npm install
npm run dev
```

## Usage

1. Open your browser and navigate to `http://localhost:3000`
2. Click on "Sign up" to create a new account
3. After signing up, you'll be redirected to the Dashboard
4. Add your first expense by clicking "Manage Expenses"
5. View your total expenses and recent transactions on the Dashboard

## Project Structure

```
expense-tracker/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   └── Expense.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── expenses.js
│   ├── middleware/
│   │   └── auth.js
│   ├── index.js
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Signup.jsx
    │   │   ├── Dashboard.jsx
    │   │   └── Expenses.jsx
    │   ├── services/
    │   │   └── api.js
    │   ├── App.jsx
    │   └── main.jsx
    └── package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login a user

### Expenses (Protected routes)
- `POST /api/expenses` - Add a new expense
- `GET /api/expenses` - Get all expenses for the user
- `GET /api/expenses/total` - Get total expenses for the user
- `GET /api/expenses/recent` - Get recent transactions
- `DELETE /api/expenses/:id` - Delete an expense

### Income (Protected routes)
- `POST /api/income` - Add a new income
- `GET /api/income` - Get all income for the user
- `GET /api/income/total` - Get total income for the user
- `GET /api/income/recent` - Get recent income
- `DELETE /api/income/:id` - Delete an income

### Analytics (Protected routes)
- `GET /api/analytics/summary` - Get summary (total income, expenses, balance)
- `GET /api/analytics/expenses-by-category` - Get expenses grouped by category
- `GET /api/analytics/monthly-trends` - Get monthly income and expense trends
- `GET /api/analytics/recent-activity` - Get recent transactions (both income and expenses)

## Future Enhancements

- Edit expenses
- Charts and visualizations
- Monthly summary reports
- Expense categories with icons
- Export data to CSV
- Dark mode
