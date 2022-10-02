/* eslint-disable consistent-return */
/* eslint-disable no-else-return */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const ErrorValidation = require('../errors/error-validation');
const ErrorUnauthorization = require('../errors/error-unauthorization');
const ErrorNotFound = require('../errors/error-not-found');
const ErrorConflict = require('../errors/error-conflict');

// создание пользователя
const createUser = (req, res, next) => {
  const {
    name, about, avatar, email,
  } = req.body;
  bcrypt.hash(req.body.password, 10) // хешируем пароль
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => {
      res.send({
        _id: user._id,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ErrorValidation('Переданы некорректные данные при создании пользователя'));
      }
      if (err.code === 11000) {
        return next(new ErrorConflict('Пользователь уже существует'));
      } else {
        next(err);
      }
    });
};

// аутентификация(вход на сайт) пользователя
const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return next(new ErrorUnauthorization('Неправильные почта или пароль'));
      }
      // создадим токен
      const token = jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' }); // токен будет просрочен через 7 дней
      return bcrypt.compare(password, user.password) // сравниваем переданный пароль и хеш из базы
        .then((matched) => {
          if (!matched) {
            return next(new ErrorUnauthorization('Неправильные почта или пароль'));
          }
          // вернём токен
          return res.send({ token });
        })
        .catch(() => {
          next(new ErrorUnauthorization('Введите почту и пароль'));
        })
        .catch(next);
    });
};

// возвращает всех пользователей
const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

// возвращает пользователя по _id
const getUserId = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new ErrorValidation('Невалидный id'));
      }
      if (err.message === 'NotFound') {
        return next(new ErrorNotFound('Пользователь не найден'));
      } else {
        next(err);
      }
    });
};

// обновляет профиль
const updateProfile = (req, res, next) => {
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
        return next(new ErrorValidation('Переданы некорректные данные при обновлении профиля'));
      }
      if (err.message === 'NotFound') {
        return next(new ErrorNotFound('Пользователь с указанным _id не найден'));
      } else {
        next(err);
      }
    });
};

// обновляет аватар
const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    { _id: req.user._id },
    { avatar },
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
        return next(new ErrorValidation('Переданы некорректные данные при обновлении аватара'));
      }
      if (err.message === 'NotFound') {
        return next(new ErrorNotFound('Пользователь с указанным _id не найден'));
      } else {
        next(err);
      }
    });
};

// информация о пользователе
const getUserInfo = (req, res, next) => {
  User.findById({ _id: req.user._id })
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new ErrorValidation('Невалидный id'));
      }
      if (err.message === 'NotFound') {
        return next(new ErrorNotFound('Пользователь не найден'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  createUser,
  login,
  getUsers,
  getUserId,
  updateProfile,
  updateAvatar,
  getUserInfo,
};
