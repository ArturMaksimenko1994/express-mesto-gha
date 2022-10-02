const express = require('express'); // подключение express
const mongoose = require('mongoose'); // подключение mongoose
const bodyParser = require('body-parser'); // подключение body-parser
const cookieParser = require('cookie-parser');

const { celebrate, Joi, errors } = require('celebrate');

const userRouter = require('./routes/users'); // импортируем роутер users
const cardRouter = require('./routes/cards'); // импортируем роутер cards

const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const ErrorNotFound = require('./errors/error-not-found');
const { RegularExpressions } = require('./validator/regular-expressions');

// создаем сервер
const app = express();

// слушаем 3000 порт
const { PORT = 3000 } = process.env;

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(RegularExpressions),
  }),
}), createUser);

app.use('/users', auth, userRouter);

app.use('/cards', auth, cardRouter);

app.use(errors());

app.use((req, res, next) => {
  next(new ErrorNotFound('Страница не найдена'));
});

// обрабатываем все ошибки
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

// порт приложение слушает
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Приложение, прослушивающее порт ${PORT}`);
});
