const cardRoutes = require('express').Router(); // создали роутер
const { celebrate, Joi } = require('celebrate');
const { RegularExpressions } = require('../validator/regular-expressions');
const auth = require('../middlewares/auth');
const {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

cardRoutes.post('/cards', auth, celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(RegularExpressions),
  }),
}), createCard);

cardRoutes.get('/cards', auth, getCards);

cardRoutes.delete('/cards/:cardId', auth, celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().hex().length(24),
  }),
}), deleteCard);

cardRoutes.put('/cards/:cardId/likes', auth, celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().hex().length(24),
  }),
}), likeCard);

cardRoutes.delete('/cards/:cardId/likes', auth, celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().hex().length(24),
  }),
}), dislikeCard);

module.exports = cardRoutes;
