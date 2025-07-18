// Move all require statements to the top
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');

// Initialize express app after requires
const app = express();

// serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

// create MySQL pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'yang1999',
  database: 'currency_db',
  waitForConnections: true,
  connectionLimit: 10,
  timezone: '+08:00'
});

// -- UTIL: fetch rate_to_usd for one currency
async function getRate(iso) {
  const [rows] = await pool.query(
    'SELECT rate_to_usd FROM currency_rates WHERE iso_code = ?',
    [iso]
  );
  if (!rows.length) throw new Error(`Rate not found for ${iso}`);
  return parseFloat(rows[0].rate_to_usd);
}

// --- ENDPOINTS ---

// List all active currencies, with optional filters
app.get('/currencies', async (req, res) => {
  try {
    const filters = [];
    const params = [];

    // allow filtering on any column
    ['iso_code','name','symbol','country','is_active'].forEach(key => {
      if (req.query[key] !== undefined) {
        filters.push(`${key} = ?`);
        params.push(req.query[key]);
      }
    });

    const where = filters.length ? 'WHERE ' + filters.join(' AND ') : '';
    const [rows] = await pool.query(
      `SELECT * FROM currencies ${where}`,
      params
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get one currency by ISO code
app.get('/currencies/:iso', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM currencies WHERE iso_code = ?',
      [req.params.iso.toUpperCase()]
    );
    if (!rows.length) return res.status(404).send('Not found');
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new currency
app.post('/currencies', async (req, res) => {
  try {
    const { iso_code, name, symbol, country, flag_url } = req.body;
    await pool.query(
      `INSERT INTO currencies 
         (iso_code,name,symbol,country,flag_url) 
       VALUES (?, ?, ?, ?, ?)`,
      [iso_code.toUpperCase(), name, symbol, country, flag_url]
    );
    res.status(201).send('Created');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Disable (soft-delete) a currency
app.get('/currencies/delete', async (req, res) => {
  try {
    const iso = req.query.iso_code.toUpperCase();
    await pool.query(
      'UPDATE currencies SET is_active = 0 WHERE iso_code = ?',
      [iso]
    );
    res.send('Disabled');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update currency metadata
app.post('/currencies/update', async (req, res) => {
  try {
    const { iso_code, name, symbol, country, flag_url, is_active } = req.body;
    const fields = [];
    const params = [];

    if (name   !== undefined) { fields.push('name = ?');   params.push(name);   }
    if (symbol !== undefined) { fields.push('symbol = ?'); params.push(symbol); }
    if (country!== undefined) { fields.push('country = ?');params.push(country);}
    if (flag_url!==undefined) { fields.push('flag_url = ?');params.push(flag_url);}
    if (is_active!==undefined){ fields.push('is_active = ?');params.push(is_active?1:0);}

    if (!fields.length) return res.status(400).send('Nothing to update');

    params.push(iso_code.toUpperCase());
    await pool.query(
      `UPDATE currencies SET ${fields.join(', ')} WHERE iso_code = ?`,
      params
    );
    res.send('Updated');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update or insert a rate_to_usd
app.post('/rates/update', async (req, res) => {
  try {
    const { iso_code, rate_to_usd } = req.body;
    await pool.query(
      `INSERT INTO currency_rates (iso_code, rate_to_usd)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE rate_to_usd = VALUES(rate_to_usd), last_updated = CURRENT_TIMESTAMP`,
      [iso_code.toUpperCase(), rate_to_usd]
    );
    res.send('Rate stored');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Convert amount from one currency to another via USD
app.get('/convert', async (req, res) => {
  try {
    const from = req.query.from.toUpperCase();
    const to   = req.query.to.toUpperCase();
    const amt  = parseFloat(req.query.amount);
    if (isNaN(amt)) return res.status(400).send('Invalid amount');

    // 1) get both rates
    const [rateFrom, rateTo] = await Promise.all([
      getRate(from),
      getRate(to)
    ]);

    // 2) convert: amount_in_usd = amt * rateFrom
    //    then amount_in_to = amount_in_usd / rateTo
    const usdVal  = amt * rateFrom;
    const result  = usdVal / rateTo;

    res.json({
      from, to, original: amt,
      converted: result,
      via_usd: usdVal
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// start server
const PORT = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(PORT, ()=> console.log(`Listening on port ${PORT}`));
}
module.exports = app;