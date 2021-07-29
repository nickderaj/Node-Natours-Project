const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res, next) => {
  const tours = await Tour.find();
  res.status(200).render('overview', { title: 'The Forest Hiker Tour', tours }); // 'tours: tours' is just tours in ES6
});

exports.getTour = catchAsync(async (req, res) => {
  // 1) Get the data for the requested tour (including guides and reviews)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });
  res.status(200).render('tour', { title: tour.name, tour });
});
