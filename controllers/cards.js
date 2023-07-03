const { Error } = require('mongoose');
const Card = require('../models/card');
const {
  notFoundError,
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require('../errors/errors');

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate('likes')
    .then((cards) => res.send(cards))
    .catch(() => res.status(INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка.' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err instanceof Error.ValidationError) {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании карточки.' });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка.' });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error(notFoundError))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.message === notFoundError) {
        res.status(NOT_FOUND).send({ message: 'Передан несуществующий `_id` карточки.' });
        return;
      } if (err instanceof Error.CastError) {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные для постановки/снятия лайка.' });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка.' });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId)
    .orFail(new Error(notFoundError))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.message === notFoundError) {
        res.status(NOT_FOUND).send({ message: 'Карточка с указанным `_id` не найдена.' });
        return;
      } if (err instanceof Error.CastError) {
        res.status(BAD_REQUEST).send({ message: 'Передан несуществующий `_id` карточки.' });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка.' });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error(notFoundError))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.message === notFoundError) {
        res.status(NOT_FOUND).send({ message: 'Передан несуществующий `_id` карточки.' });
        return;
      } if (err instanceof Error.CastError) {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные для постановки/снятия лайка.' });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка.' });
    });
};
