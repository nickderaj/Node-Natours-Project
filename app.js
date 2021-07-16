// Configure everything to do with Express here //

//////////////// EXPRESS ////////////////

const express = require('express');
const morgan = require('morgan');

//////////////// FILES ////////////////
const tourRouter = require('./routes/tourRouter');
const userRouter = require('./routes/userRouter');

//////////////// MIDDLEWARE ////////////////
const app = express();
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
// app.use(express.static(`${__dirname}/public`));
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//////////////// ROUTES ////////////////

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
