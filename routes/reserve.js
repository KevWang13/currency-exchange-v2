// routes/reserve.js
const express = require('express');
const pool   = require('../config/db');
const { verifyToken } = require('../middleware/auth');
const router = express.Router();

// POST /rates/reserve
router.post('/reserve', verifyToken, async (req, res) => {
  const { from, to, amount, duration } = req.body;
  // 1) lookup spot rate
  // 2) insert into reservations with expiration = NOW() + interval
  // 3) return reservationId, guaranteedRate, expirationTime
  res.json({ reservationId: 'abc‑123', guaranteedRate: 1.2345, expirationTime: '…' });
});

// GET /rates/reservations
router.get('/reservations', verifyToken, async (req, res) => {
  // return active reservations for user
  res.json([]);
});

module.exports = router;
