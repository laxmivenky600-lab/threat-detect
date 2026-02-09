import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

function Dashboard() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [summary, setSummary] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (location.pathname === '/dashboard') {
      fetchDashboardData();
    }
  }, [location]);

  const fetchDashboardData = async () => {
    try {
      const [summaryRes, activityRes] = await Promise.all([
        api.get('/analytics/summary'),
        api.get('/analytics/recent-activity')
      ]);
      setSummary(summaryRes.data);
      setRecentActivity(activityRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-8">
      <nav className="bg-white shadow-md px-4 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Expense Tracker</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Welcome, {user?.name}</span>
            <button
              onClick={logout}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <nav className="bg-white border-b shadow-sm px-4 py-3">
        <div className="max-w-7xl mx-auto">
          <div className="flex space-x-4 overflow-x-auto">
            <Link
              to="/dashboard"
              className="px-4 py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors whitespace-nowrap"
            >
              Dashboard
            </Link>
            <Link
              to="/income"
              className="px-4 py-2 rounded-md text-gray-600 font-medium hover:bg-gray-100 transition-colors whitespace-nowrap"
            >
              Income
            </Link>
            <Link
              to="/expenses"
              className="px-4 py-2 rounded-md text-gray-600 font-medium hover:bg-gray-100 transition-colors whitespace-nowrap"
            >
              Expenses
            </Link>
            <Link
              to="/analytics"
              className="px-4 py-2 rounded-md text-gray-600 font-medium hover:bg-gray-100 transition-colors whitespace-nowrap"
            >
              Analytics
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <button
            onClick={fetchDashboardData}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Refresh
          </button>
        </div>

        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-600 mb-2">Total Income</h2>
              <p className="text-4xl font-bold text-green-600">${summary.totalIncome.toFixed(2)}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-600 mb-2">Total Expenses</h2>
              <p className="text-4xl font-bold text-red-600">${summary.totalExpenses.toFixed(2)}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-600 mb-2">Balance</h2>
              <p className={`text-4xl font-bold ${summary.balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                ${summary.balance.toFixed(2)}
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            to="/income"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-green-500"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-2">Add Income</h2>
            <p className="text-gray-600">Track your earnings and sources of income</p>
          </Link>
          <Link
            to="/expenses"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-blue-500"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-2">Manage Expenses</h2>
            <p className="text-gray-600">Add, view, and delete expenses</p>
          </Link>
          <Link
            to="/analytics"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-purple-500"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-2">View Analytics</h2>
            <p className="text-gray-600">Charts, trends, and insights</p>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Activity</h2>
          {recentActivity.length === 0 ? (
            <p className="text-gray-500">No activity yet. Add your first transaction!</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Type</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Category/Source</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recentActivity.map((item) => (
                    <tr key={item._id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.type === 'income'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {item.type === 'income' ? 'Income' : 'Expense'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {new Date(item.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {item.type === 'income' ? item.source : item.category}
                      </td>
                      <td
                        className={`px-4 py-3 text-sm text-right font-semibold ${
                          item.type === 'income' ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {item.type === 'income' ? '+' : '-'}${item.amount.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
