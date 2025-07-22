const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET /convert?from=USD&to=EUR&amount=100
router.get('/', async (req, res) => {
  const { from, to, amount } = req.query;

  if (!from || !to || !amount) {
    return res.status(400).json({ error: 'Missing parameters' });
  }

  try {
    // Get both currency rates relative to USD
    const [rows] = await db.query(
      'SELECT iso_code, rate_to_usd FROM currency_rates WHERE iso_code IN (?, ?)',
      [from, to]
    );

    if (rows.length < 2) {
      return res.status(404).json({ error: 'Currency not found' });
    }

    const rateFrom = rows.find(r => r.iso_code === from).rate_to_usd;
    const rateTo   = rows.find(r => r.iso_code === to).rate_to_usd;

    const converted = (amount * rateFrom) / rateTo;

    res.json({ converted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Conversion error' });
  }
});

module.exports = router;
