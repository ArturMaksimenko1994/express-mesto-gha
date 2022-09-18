const User = require('../models/user')


const ERROR_REQUEST = 400;
const ERROR_NOT_FOUND = 404;
const ERROR_SERVER = 500;


//создание пользователя
const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя' });
      } else {
        return res.status(ERROR_SERVER).send({ message: 'Произошла неизвестная ошибка' });
      }
    });
};


//возвращает всех пользователей
const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => {
      res.status(ERROR_SERVER).send({ message: 'Произошла неизвестная ошибка' });
    });
};


//возвращает пользователя по _id
const getUserId = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_REQUEST).send({ message: 'Невалидный _id' });
      }
      if (err.message === 'NotFound') {
        return res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден' });
      } else {
        return res.status(ERROR_SERVER).send({ message: 'Произошла неизвестная ошибка' });
      }
    });
};


//обновляет профиль
const updateProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    { _id: req.user._id },
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_REQUEST).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      }
      if (err.message === 'NotFound') {
        return res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден' });
      } else {
        return res.status(ERROR_SERVER).send({ message: 'Произошла неизвестная ошибка' });
      }
    });
};


//обновляет аватар
const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    { _id: req.user._id },
    { avatar },
    {
      new: true,
      runValidators: true,
      upsert: true,
    },
  )
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_REQUEST).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      }
      if (err.message === 'NotFound') {
        return res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден' });
      } else {
        return res.status(ERROR_SERVER).send({ message: 'Произошла неизвестная ошибка' });
      }
    });
};


module.exports = {
  createUser,
  getUsers,
  getUserId,
  updateProfile,
  updateAvatar
}
