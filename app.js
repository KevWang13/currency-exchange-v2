// app.js
const http = require('http');
const app = require('./currencyApi');

const server = http.createServer((req, res) => {
  res.end('Hello from Node.js!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
