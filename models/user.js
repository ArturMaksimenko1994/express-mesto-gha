const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');

const { RegularExpressions } = require('../validator/regular-expressions');

function validateUrl(v) {
  return RegularExpressions.test(v);
}

// Поля схемы пользователя
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: { validator: validateUrl },
  },
  email: {
    type: String,
    unique: true, // оно должно быть у каждого пользователя, и уникальным
    required: true,
    validate: {
      validator: (v) => isEmail(v),
      message: 'Неправильный формат почты',
    },
  },
  password: {
    type: String,
    required: true,
    select: false, // не возвращает хеш пароля
  },

});

module.exports = mongoose.model('user', userSchema);
