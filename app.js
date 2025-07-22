// app.js
const express = require('express');
const path    = require('path');

// config
const db = require('./config/db');
db.query('SELECT 1')
  .then(() => console.log('✅ Connected to MySQL database'))
  .catch(err => console.error('❌ MySQL connection error:', err));

// middleware (if used globally)
const authMiddleware = require('./middleware/auth');

const users      = require('./routes/users');
const watchlist  = require('./routes/watchlist');
const currencies = require('./routes/currencies');
const rates      = require('./routes/rates');
const convert    = require('./routes/convert');
const reserve    = require('./routes/reserve');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', users);
app.use('/watchlist', watchlist);
app.use('/currencies', currencies);
app.use('/rates', rates);
app.use('/convert', convert);
app.use('/rates/reserve', reserve);

app.listen(process.env.PORT||3000, ()=>
  console.log('Listening on port', process.env.PORT||3000)
);
