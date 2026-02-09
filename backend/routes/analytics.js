const express = require('express');
const Expense = require('../models/Expense');
const Income = require('../models/Income');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.get('/summary', async (req, res) => {
  try {
    const [expenseTotal, incomeTotal] = await Promise.all([
      Expense.aggregate([
        { $match: { userId: req.userId } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Income.aggregate([
        { $match: { userId: req.userId } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ])
    ]);

    const expenses = expenseTotal[0]?.total || 0;
    const income = incomeTotal[0]?.total || 0;

    console.log('Summary for user', req.userId, ':', { expenses, income, balance: income - expenses });

    res.json({
      totalExpenses: expenses,
      totalIncome: income,
      balance: income - expenses
    });
  } catch (error) {
    console.error('Summary error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/expenses-by-category', async (req, res) => {
  try {
    const categoryData = await Expense.aggregate([
      { $match: { userId: req.userId } },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
      { $sort: { total: -1 } }
    ]);

    res.json(categoryData.map(item => ({
      category: item._id,
      amount: item.total
    })));
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/monthly-trends', async (req, res) => {
  try {
    const months = 6;

    const [expenseTrends, incomeTrends] = await Promise.all([
      Expense.aggregate([
        { $match: { userId: req.userId, date: { $gte: new Date(Date.now() - months * 30 * 24 * 60 * 60 * 1000) } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m', date: '$date' } },
            total: { $sum: '$amount' }
          }
        },
        { $sort: { _id: 1 } }
      ]),
      Income.aggregate([
        { $match: { userId: req.userId, date: { $gte: new Date(Date.now() - months * 30 * 24 * 60 * 60 * 1000) } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m', date: '$date' } },
            total: { $sum: '$amount' }
          }
        },
        { $sort: { _id: 1 } }
      ])
    ]);

    res.json({
      expenses: expenseTrends.map(item => ({ month: item._id, amount: item.total })),
      income: incomeTrends.map(item => ({ month: item._id, amount: item.total }))
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/recent-activity', async (req, res) => {
  try {
    const [recentExpenses, recentIncome] = await Promise.all([
      Expense.find({ userId: req.userId })
        .sort({ date: -1 })
        .limit(5)
        .lean(),
      Income.find({ userId: req.userId })
        .sort({ date: -1 })
        .limit(5)
        .lean()
    ]);

    const activity = [
      ...recentExpenses.map(e => ({ ...e, type: 'expense' })),
      ...recentIncome.map(i => ({ ...i, type: 'income' }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date))
     .slice(0, 10);

    res.json(activity);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
