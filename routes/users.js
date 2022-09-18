const userRouter = require('express').Router(); // создали роутер

const {
  createUser,
  getUsers,
  getUserId,
  updateProfile,
  updateAvatar
 } = require('../controllers/users');



userRouter.post('/', createUser);
userRouter.get('/', getUsers);
userRouter.get('/:userId', getUserId);
userRouter.patch('/me', updateProfile);
userRouter.patch('/me/avatar', updateAvatar);


module.exports = userRouter;