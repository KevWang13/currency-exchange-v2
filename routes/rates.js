// routes/rates.js
const express = require('express');
const pool   = require('../config/db');
const { verifyToken, requireRole } = require('../middleware/auth');
const router = express.Router();

// PUT /rates/:iso_code
router.put('/:iso', verifyToken, requireRole('admin'), async (req, res) => {
  const { rate_to_usd } = req.body;
  await pool.query(
    `INSERT INTO currency_rates (iso_code,rate_to_usd)
     VALUES (?,?)
     ON DUPLICATE KEY UPDATE rate_to_usd=VALUES(rate_to_usd),last_updated=CURRENT_TIMESTAMP`,
    [req.params.iso.toUpperCase(), rate_to_usd]
  );
  res.send('Rate updated');
});

module.exports = router;
