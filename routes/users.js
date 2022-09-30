const userRouter = require('express').Router(); // создали роутер
const { celebrate, Joi } = require('celebrate');
const {
  createUser,
  getUsers,
  getUserId,
  updateProfile,
  updateAvatar,
  getUserInfo,
} = require('../controllers/users');

userRouter.post('/', createUser);

userRouter.get('/', getUsers);

userRouter.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().hex().length(24),
  }),
}), getUserId);

userRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateProfile);

userRouter.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required(),
  }),
}), updateAvatar);

userRouter.get('/me', getUserInfo);

module.exports = userRouter;
