const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { verifyToken, requireRole } = require('../middleware/auth');

// GET /currencies
router.get('/', async (req, res) => {
  try {
    const { iso } = req.query;
    let sql = 'SELECT * FROM currencies WHERE is_active = 1';
    const params = [];

    if (iso) {
      sql += ' AND iso_code = ?';
      params.push(iso.toUpperCase());
    }

    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching currencies:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// GET /currencies/:iso
router.get('/:iso', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM currencies WHERE iso_code = ? AND is_active = 1',
      [req.params.iso.toUpperCase()]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Currency not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// POST /currencies
router.post('/', verifyToken, requireRole('admin'), async (req, res) => {
  const { iso_code, name, symbol, country, flag_url } = req.body;
  try {
    await db.query(
      'INSERT INTO currencies (iso_code, name, symbol, country, flag_url) VALUES (?, ?, ?, ?, ?)',
      [iso_code.toUpperCase(), name, symbol, country, flag_url]
    );
    res.status(201).send('Currency added');
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add currency' });
  }
});

// PATCH /currencies/:iso
router.patch('/:iso', verifyToken, requireRole('admin'), async (req, res) => {
  const { name, symbol, country, flag_url, is_active } = req.body;
  const fields = [], params = [];

  if (name) { fields.push('name = ?'); params.push(name); }
  if (symbol) { fields.push('symbol = ?'); params.push(symbol); }
  if (country) { fields.push('country = ?'); params.push(country); }
  if (flag_url) { fields.push('flag_url = ?'); params.push(flag_url); }
  if (typeof is_active !== 'undefined') { fields.push('is_active = ?'); params.push(is_active); }

  if (!fields.length) return res.status(400).send('No fields to update');

  params.push(req.params.iso.toUpperCase());

  try {
    const [result] = await db.query(
      `UPDATE currencies SET ${fields.join(', ')} WHERE iso_code = ?`,
      params
    );
    res.send(result.affectedRows ? 'Currency updated' : 'No changes');
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update currency' });
  }
});

// DELETE /currencies/:iso
router.delete('/:iso', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const [result] = await db.query(
      'UPDATE currencies SET is_active = 0 WHERE iso_code = ?',
      [req.params.iso.toUpperCase()]
    );
    res.send(result.affectedRows ? 'Currency disabled' : 'Not found');
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete currency' });
  }
});

module.exports = router;
