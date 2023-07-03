const { Error } = require('mongoose');
const User = require('../models/user');
const { BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR } = require('../errors/errors');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      if (err instanceof Error.ValidationError) {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя.' });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка.' });
    });
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params['userId'])
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof Error.CastError) {
        res.status(NOT_FOUND).send({ message: 'Пользователь по указанному `_id` не найден.' });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка.' });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof Error.ValidationError) {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя.' });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка.' });
    });
};

module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof Error.ValidationError) {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
        return;
      } if (err instanceof Error.CastError) {
        res.status(NOT_FOUND).send({ message: 'Пользователь с указанным `_id` не найден.' });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка.' });
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof Error.ValidationError) {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении автара.' });
        return;
      } if (err instanceof Error.CastError) {
        res.status(NOT_FOUND).send({ message: 'Пользователь с указанным `_id` не найден.' });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка.' });
    });
};
