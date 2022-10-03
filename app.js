const express = require('express'); // подключение express
const mongoose = require('mongoose'); // подключение mongoose
const bodyParser = require('body-parser'); // подключение body-parser

const { errors } = require('celebrate'); // подключение celebrate

// routes
const userRouter = require('./routes/users'); // импортируем роутер users
const cardRouter = require('./routes/cards'); // импортируем роутер cards

// middlewares
const auth = require('./middlewares/auth');
const ErrorHandler = require('./middlewares/error-handler');

// errors
const ErrorNotFound = require('./errors/error-not-found');

// создаем сервер
const app = express();

// слушаем 3000 порт
const { PORT = 3000 } = process.env;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use('/', userRouter);

app.use('/', cardRouter);

app.use(errors());

app.use(auth, ((req, res, next) => {
  next(new ErrorNotFound('Страница не найдена'));
}));

// обрабатываем все ошибки
app.use(ErrorHandler, auth);

// порт приложение слушает
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Приложение, прослушивающее порт ${PORT}`);
});
