const Tour = require('../models/tourModel');
const AppError = require('../utils/appError');
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

//router.route('/tours-within/:distance/centre/:latlng/unit/:unit').get(tourController.getToursWithin)
// /tours-within/233/centre/34.127341,-118.132760/unit/mi
exports.getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  // Guard clauses
  if (distance <= 0) {
    next(new AppError('Please provide a distance'));
  }
  if (unit !== 'mi' && unit !== 'km') {
    next(new AppError('Please provide the unit in km or mi', 400));
  }
  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitude and longitude in the format lat,lng.',
        400
      )
    );
  }

  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  const tours = await Tour.find({
    // LNG THEN LAT IN GEOJSON
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  console.log(distance, latlng, unit);

  res.status(200).json({
    status: 'success',
    data: {
      data: tours,
    },
  });
});

// router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);
exports.getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  // Guard clauses
  if (unit !== 'mi' && unit !== 'km') {
    next(new AppError('Please provide the unit in km or mi', 400));
  }
  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitude and longitude in the format lat,lng.',
        400
      )
    );
  }

  const multiplier = unit === 'mi' ? 0.000621371 : 0.001; // convert from meters to KM/miles
  const distances = await Tour.aggregate([
    {
      // geoNear ALWAYS needs to be the first stage, and requires at least one of our fields contains a geospatial index. (tourSchema.index ({ startLocation: 2dsphere }))
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1],
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier, //  to convert from meters to KM/miles
      },
    },
    {
      $project: {
        distance: 1,
        name: 1,
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      data: distances,
    },
  });
});
