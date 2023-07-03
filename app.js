const express = require('express');
const mongoose = require('mongoose');
const { notFoundError } = require('./errors/errors');

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: '64a082113db0edce5dfcf98e',
  };

  next();
});
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use('*', (req, res) => res.status(notFoundError).send({ message: 'Такая страница не существует.' }));

app.listen(3000);
