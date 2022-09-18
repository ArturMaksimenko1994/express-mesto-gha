const Card = require('../models/card')


const ERROR_REQUEST = 400;
const ERROR_NOT_FOUND = 404;
const ERROR_SERVER = 500;


//создаёт карточку
const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_REQUEST).send({ message: 'Переданы некорректные данные при создании карточки' });
      } else {
        return res.status(ERROR_SERVER).send({ message: 'Произошла неизвестная ошибка' });
      }
    });
};


//возвращает все карточки
const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => {res.status(ERROR_SERVER).send({ message: 'Произошла неизвестная ошибка' });
    });
};


//удаления карточки
const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_REQUEST).send({ message: 'Карточка с указанным _id не найдена' });
      }
      if (err.message === 'NotFound') {
        return res.status(ERROR_NOT_FOUND).send({ message: 'Карточка не найдена' });
      } else {
        return res.status(ERROR_SERVER).send({ message: 'Произошла неизвестная ошибка' });
      }
    });
};


//лайк карточки
const likeCard = (req, res) => {
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
        return res.status(ERROR_REQUEST).send({ message: 'Переданы некорректные данные для постановки лайка' });
      }
      if (err.message === 'NotFound') {
        return res.status(ERROR_NOT_FOUND).send({ message: 'Передан несуществующий _id карточки' });
      } else {
        return res.status(ERROR_SERVER).send({ message: 'Произошла неизвестная ошибка' });
      }
    });
};

//дизлайк карточки
const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate ( req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_REQUEST).send({ message: 'Переданы некорректные данные для снятии лайка' });
      }
      if (err.message === 'NotFound') {
        return res.status(ERROR_NOT_FOUND).send({ message: 'Передан несуществующий _id карточки' });
      } else {
        return res.status(ERROR_SERVER).send({ message: 'Произошла неизвестная ошибка' });
      }
    });
};


module.exports = {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard
}