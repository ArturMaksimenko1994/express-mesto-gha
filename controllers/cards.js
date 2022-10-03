/* eslint-disable consistent-return */
/* eslint-disable no-else-return */
const Card = require('../models/card');

const ErrorValidation = require('../errors/error-validation');
const ErrorNotFound = require('../errors/error-not-found');
const ErrorForbidden = require('../errors/error-forbidden');

// создаёт карточку
const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorValidation('Переданы некорректные данные при создании карточки'));
      } else {
        next(err);
      }
    });
};

// возвращает все карточки
const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

// удаления карточки
const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((card) => {
      if (card.owner.toString() === req.user._id.toString()) {
        return card.remove();
      } else {
        return next(new ErrorForbidden('Вы не можете удалить эту карточку'));
      }
    })
    .then(() => res.send({ message: 'Карточка удалена' }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new ErrorForbidden('Невалидный id'));
      }
      if (err.message === 'NotFound') {
        return next(new ErrorNotFound('Карточка не найдена'));
      } else {
        return next(err);
      }
    });
};

// лайк карточки
const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new ErrorValidation('Передан несуществующий _id карточки'));
      }
      if (err.message === 'NotFound') {
        return next(new ErrorNotFound('Карточка не найдена'));
      } else {
        return next(err);
      }
    });
};

// дизлайк карточки
const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new ErrorValidation('Передан несуществующий _id карточки'));
      }
      if (err.message === 'NotFound') {
        return next(new ErrorNotFound('Передан несуществующий _id карточки'));
      } else {
        return next(err);
      }
    });
};

module.exports = {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
};
