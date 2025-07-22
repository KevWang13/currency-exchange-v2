// config/db.js
const mysql = require('mysql2/promise');

module.exports = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'n3u3da!',
  database: 'currency_db',
  waitForConnections: true,
  connectionLimit: 10,
  timezone: '+08:00'
});
