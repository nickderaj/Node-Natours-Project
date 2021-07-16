//////////////// EXPRESS ////////////////
const express = require('express');
const morgan = require('morgan');

//////////////// FILES ////////////////
const tourRouter = require('./routes/tourRouter');
const userRouter = require('./routes/userRouter');

//////////////// MIDDLEWARE ////////////////
const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//////////////// ROUTES ////////////////

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
