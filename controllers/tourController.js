const Tour = require('../models/tourModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');

// Factory methods:
exports.getAllTours = factory.getAll(Tour);
exports.getTour = factory.getOne(Tour, { path: 'reviews' });
exports.createTour = factory.createOne(Tour);
exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);

// ALIAS Methods:
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage, price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } }, // search for results >=4.5
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' }, // shows the number of each difficulty, to uppercase for fun
        // _id: '$ratingsAverage', // shows number of tours with x rating
        num: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 }, // sort based on average price (1 is ascending)
    },
    // {
    //   $match: { _id: { $ne: 'EASY' } }, // exclude the 'EASY' difficulties
    // },
  ]);

  res.status(200).send({
    status: 'success',
    data: stats,
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates', // breaks down the array like the ... operator
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStart: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: {
        _id: 0, // hide the _id value, 1 shows 0 hides
      },
    },
    {
      $sort: { numTourStart: -1 }, //ascending based on busiest month
      // $sort: { month: 1 }, // ascending based on month
    },
    // {
    //   $limit: 6,
    // },
  ]);

  res.status(200).send({
    status: 'success',
    data: plan,
  });
});
