const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config({ path: './../config.env' });

module.exports = function(req, res, next) {
  // Get token form header
  const token = req.header('x-auth-token');

  // Check if not token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const docoded = jwt.decode(token, process.env.JWTSECRET);
    req.user = docoded.user;
    next();
  } catch (err) {
    res.status(404).json({ msg: 'Token is not valid' });
  }
};
