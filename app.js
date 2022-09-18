const express = require('express'); //подключение express
const mongoose = require('mongoose'); //подключение mongoose
const bodyParser = require('body-parser'); //подключение body-parser


const userRouter = require('./routes/users'); // импортируем роутер users
const cardRouter = require('./routes/cards'); // импортируем роутер cards


// создаем сервер
const app = express();


// слушаем 3000 порт
const { PORT = 3000 } = process.env;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  // useCreateIndex: true,
  // useFindAndModify: false,
  useUnifiedTopology: true,
});


//временное решение авторизации
app.use((req, res, next) => {
  req.user = {
    _id: '63238b6b95582b0c468680f5'
  };

  next();
});

app.use('/users', userRouter)

app.use('/cards', cardRouter)

app.use('*', (req, res) => {
  res.status(404).send({
    message: 'Страница не существует',
  });
});


//порт приложение слушает
app.listen(PORT, () => {
  console.log(`Приложение, прослушивающее порт ${PORT}`)
});