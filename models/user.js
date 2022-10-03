const mongoose = require('mongoose');
const validator = require('validator');
const { RegularExpressions } = require('../validator/regular-expressions');

function validateUrl(v) {
  return RegularExpressions.test(v);
}

validator.isEmail('foo@bar.com');

// Поля схемы пользователя
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  about: {
    type: String,
    default: 'Исследователь',
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: { validator: validateUrl },
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, 'invalid email'],
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

module.exports = mongoose.model('user', userSchema);
