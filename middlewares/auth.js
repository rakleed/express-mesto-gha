const jwt = require('jsonwebtoken');
const Unauthorized = require('../errors/Unauthorized');
const { SECRET_PASSWORD_KEY } = require('../utils/constants');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new Unauthorized('Необходима авторизация.');
  }

  const token = authorization.replace('Bearer ', '');

  let payload;
  try {
    payload = jwt.verify(token, SECRET_PASSWORD_KEY);
  } catch (err) {
    next(new Unauthorized('Необходима авторизация.'));
  }

  req.user = payload;
  next();
};
