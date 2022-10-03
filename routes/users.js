const userRouter = require('express').Router(); // создали роутер
const { celebrate, Joi } = require('celebrate');
const { RegularExpressions } = require('../validator/regular-expressions');
const auth = require('../middlewares/auth');
const {
  getUsers,
  getUserId,
  updateProfile,
  updateAvatar,
  getUserInfo,
  login,
  createUser,
} = require('../controllers/users');

userRouter.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

userRouter.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(RegularExpressions),
  }),
}), createUser);

userRouter.get('/', auth, getUsers);

userRouter.get('/me', getUserInfo);

userRouter.get('/:userId', auth, celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().hex().length(24),
  }),
}), getUserId);

userRouter.patch('/me', auth, celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateProfile);

userRouter.patch('/me/avatar', auth, celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().regex(RegularExpressions),
  }),
}), updateAvatar);

module.exports = userRouter;
