const cardRoutes = require('express').Router(); // создали роутер

const {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

cardRoutes.post('/', createCard);
cardRoutes.get('/', getCards);
cardRoutes.delete('/:cardId', deleteCard);
cardRoutes.put('/:cardId/likes', likeCard);
cardRoutes.delete('/:cardId/likes', dislikeCard);

module.exports = cardRoutes;
