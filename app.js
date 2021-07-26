//////////////// EXPRESS ////////////////
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

//////////////// FILES ////////////////
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRouter');
const userRouter = require('./routes/userRouter');

//////////////// MIDDLEWARE ////////////////
const app = express();

app.use(helmet()); // Security HTTP Headers
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); // Development Logging
}

// Limit requests from same IP
const limiter = rateLimit({
  max: 100, // Only 100 requests from the same IP per hour
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);
app.use(express.json({ limit: '10kb' })); // Body parser, reading data from the body into req.body
app.use(mongoSanitize()); // Data sanitisation against NoSQL query injection
app.use(xss()); // Data sanitsation against XSS

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

//////////////// ROUTES ////////////////
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
