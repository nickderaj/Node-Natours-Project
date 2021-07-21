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

app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl}`,
  // });

  const err = new Error('Test error!');
  err.status = 'fail';
  err.statusCode = 404;
  next(err);
});

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500; // 500 is internal server error
  err.status = err.status || 'error'; // 500 is error, 400 is fail
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
  next();
});

module.exports = app;
