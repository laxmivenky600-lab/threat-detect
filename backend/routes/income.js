const express = require('express');
const Income = require('../models/Income');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.post('/', async (req, res) => {
  try {
    const { amount, source, date } = req.body;
    const income = new Income({
      userId: req.userId,
      amount,
      source,
      date: date || new Date()
    });
    await income.save();
    res.status(201).json(income);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const income = await Income.find({ userId: req.userId }).sort({ date: -1 });
    res.json(income);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/total', async (req, res) => {
  try {
    const total = await Income.aggregate([
      { $match: { userId: req.userId } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    res.json({ total: total[0]?.total || 0 });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/recent', async (req, res) => {
  try {
    const income = await Income.find({ userId: req.userId })
      .sort({ date: -1 })
      .limit(5);
    res.json(income);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const income = await Income.findOne({ _id: req.params.id, userId: req.userId });
    if (!income) {
      return res.status(404).json({ message: 'Income not found' });
    }
    await Income.deleteOne({ _id: req.params.id });
    res.json({ message: 'Income deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
