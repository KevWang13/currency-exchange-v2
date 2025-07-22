// routes/watchlist.js
const express = require('express');
const pool   = require('../config/db');
const { verifyToken } = require('../middleware/auth');
const router = express.Router();

// GET all watchlist for user
router.get('/', verifyToken, async (req, res) => {
  const [rows] = await pool.query(
    'SELECT symbol,target_price,alert_triggered FROM watchlist WHERE user_id = ?',
    [req.user.id]
  );
  res.json(rows);
});

// POST add a symbol
router.post('/', verifyToken, async (req, res) => {
  const { symbol, target_price } = req.body;
  await pool.query(
    `INSERT INTO watchlist (user_id,symbol,target_price) VALUES (?,?,?)`,
    [req.user.id, symbol, target_price]
  );
  res.status(201).json({ symbol, target_price });
});

// DELETE a symbol
router.delete('/:symbol', verifyToken, async (req, res) => {
  await pool.query(
    'DELETE FROM watchlist WHERE user_id = ? AND symbol = ?',
    [req.user.id, req.params.symbol]
  );
  res.json({ message: `Pair ${req.params.symbol} removed` });
});

module.exports = router;
