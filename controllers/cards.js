const { Error } = require('mongoose');
const Card = require('../models/card');
const BadRequest = require('../errors/BadRequest');
const Forbidden = require('../errors/Forbidden');
const NotFound = require('../errors/NotFound');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate('likes')
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err instanceof Error.ValidationError) {
        next(new BadRequest('Переданы некорректные данные при создании карточки.'));
      }
      next(err);
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail(new NotFound('Передан несуществующий `_id` карточки.'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err instanceof Error.CastError) {
        next(new BadRequest('Переданы некорректные данные для постановки лайка.'));
      }
      next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(new NotFound('Карточка с указанным `_id` не найдена.'))
    .then((card) => {
      if (!card.owner.equals(req.user._id)) {
        next(new Forbidden('Отсутствуют права для удаления карточки с указанным `_id`.'));
      }
      Card.deleteOne(card)
        .then(res.send(card));
    })
    .catch((err) => {
      if (err instanceof Error.CastError) {
        next(new BadRequest('Передан несуществующий `_id` карточки.'));
      }
      next(err);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail(new NotFound('Передан несуществующий `_id` карточки.'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err instanceof Error.CastError) {
        next(new BadRequest('Переданы некорректные данные для снятия лайка.'));
      }
      next(err);
    });
};
