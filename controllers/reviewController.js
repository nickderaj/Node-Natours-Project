const Review = require('../models/reviewModel');
const factory = require('./handlerFactory');

// Factory Methods:
exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);

// Allow for nested GET reviews in tour
exports.setTourId = (req, res, next) => {
  if (req.params.tourId) req.query.tour = req.params.tourId;
  next();
};

// Allow nested routes:
exports.setTourUserIds = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId; // from the URL
  if (!req.body.user) req.body.user = req.user.id; // from the protect middleware
  next();
};
