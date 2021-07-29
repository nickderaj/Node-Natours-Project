const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) Get tour data from the collection
  const tours = await Tour.find();
  // 2) Build template

  // 3) Render that template using tour data
  res.status(200).render('overview', { title: 'The Forest Hiker Tour', tours }); // 'tours: tours' is just tours in ES6
});

exports.getTour = catchAsync((req, res) => {
  res.status(200).render('tour', { title: 'All Tours' });
});
