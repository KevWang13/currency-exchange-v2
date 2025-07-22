// middleware/auth.js
const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'change-this';

exports.verifyToken = (req, res, next) => {
  const bearer = req.headers.authorization?.split(' ')[1];
  if (!bearer) return res.status(401).send('No token');
  jwt.verify(bearer, SECRET, (err, payload) => {
    if (err) return res.status(403).send('Invalid token');
    req.user = payload; 
    next();
  });
};

exports.requireRole = role => (req, res, next) => {
  if (req.user.role !== role) return res.status(403).send('Forbidden');
  next();
};
