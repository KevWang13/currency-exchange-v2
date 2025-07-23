// routes/users.js
const express = require('express');
const pool   = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const { verifyToken } = require('../middleware/auth');
const router = express.Router();
const SECRET = process.env.JWT_SECRET || 'change-this';

// Registration
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  await pool.query(
    'INSERT INTO users (username,email,password_hash) VALUES (?,?,?)',
    [username, email, hash]
  );
  res.status(201).send('User created');
});

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const [[user]] = await pool.query(
    'SELECT * FROM users WHERE username = ?', [username]
  );
  if (!user) return res.status(401).send('Invalid credentials');
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).send('Invalid credentials');
  const token = jwt.sign(
    { id: user.id, role: user.role }, SECRET, { expiresIn: '2h' }
  );
  res.json({ token });
});

// View Profile
router.get('/profile', verifyToken, async (req, res) => {
  const [[user]] = await pool.query(
    'SELECT id,username,email,role,created_at,updated_at FROM users WHERE id = ?',
    [req.user.id]
  );
  res.json(user);
});

// Update Profile
router.put('/profile', verifyToken, async (req, res) => {
  const { email, password } = req.body;
  const fields = [], params = [];
  if (email) { fields.push('email = ?'); params.push(email); }
  if (password) {
    const hash = await bcrypt.hash(password, 10);
    fields.push('password_hash = ?');
    params.push(hash);
  }
  if (!fields.length) return res.status(400).send('Nothing to update');
  params.push(req.user.id);
  await pool.query(
    `UPDATE users SET ${fields.join(', ')} WHERE id = ?`, params
  );
  res.send('Profile updated');
});

// GET /users — return all users (or limited info for demo)
router.get('/', async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT id, username, email FROM users');
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Database error' });
    }
  });


// GET (Search Users)
// Search Users
router.get('/search', async (req, res) => {
  try {
    const { id, username, email } = req.query;
    let query = 'SELECT id, username, email FROM users WHERE 1=1';
    const params = [];

    if (id) {
      query += ' AND id = ?';
      params.push(id);
    }
    if (username) {
      query += ' AND username LIKE ?';
      params.push(`%${username}%`);
    }
    if (email) {
      query += ' AND email LIKE ?';
      params.push(`%${email}%`);
    }

    const [rows] = await pool.query(query, params);
    if (!rows.length) {
      return res.status(404).json({ message: 'No users found' });
    }
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});


module.exports = router;
