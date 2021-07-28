const express = require('express');
const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');

const router = express.Router();

router
  .route('/')
  .get(reviewController.getAllReviews)
  .get(reviewController.getReview)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.createReview
  );

// router
//   .route('/:id')
//   .get(reviewController.getReview)
//   .post(
//     authController.protect,
//     authController.restrictTo('user'),
//     reviewController.createReview
//   )
//   .patch(authController.protect, reviewController.updateReview)
//   .delete(authController.protect, reviewController.deleteReview);

module.exports = router;