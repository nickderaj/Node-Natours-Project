//////////////// EXPRESS ////////////////
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

//////////////// FILES ////////////////
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRouter');
const userRouter = require('./routes/userRouter');
const reviewRouter = require('./routes/reviewRouter');
const viewRouter = require('./routes/viewRouter');

//////////////// MIDDLEWARE ////////////////
const app = express();

// Setting up Pug (server-side rendering):
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views')); // writes '__dirname/views' behind the scenes

// Serving static files:
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'", 'https:', 'http:', 'data:', 'ws:'],
      baseUri: ["'self'"],
      fontSrc: ["'self'", 'https:', 'http:', 'data:'],
      scriptSrc: ["'self'", 'https:', 'http:', 'blob:'],
      styleSrc: ["'self'", "'unsafe-inline'", 'https:', 'http:'],
    },
  })
); // Security HTTP Headers
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
app.use(cookieParser()); // Parse the data from the cookies
app.use(mongoSanitize()); // Data sanitisation against NoSQL query injection
app.use(xss()); // Data sanitsation against XSS
app.use((req, res, next) => {
  console.log(req.cookies);
  next();
});

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
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
