const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true, // removes white space in the end & beginning
      maxlength: [
        40,
        'A tour name must be less than or equal to 40 characters.',
      ],
      minlength: [10, 'A tour name must be at least 10 characters.'],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 0,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a summary'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String, // Store the name of the image in the database, not the actual images
      required: [true, 'A tour must have a cover image'],
    },
    images: [String], // This is an array of strings
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false, // hides the created at date from public API
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// DOCUMENT MIDDLEWARE
// Called before a document is saved to the database - runs before .save() and .create(), NOT for .insertMany()
tourSchema.pre('save', function (next) {
  // console.log(this); // 'this' points to the document that is being saved.
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

// QUERY MIDDLEWARE
tourSchema.pre(/^find/, function (next) {
  // console.log(this); // 'this' points to the query now, not the document.
  this.find({ secretTour: { $ne: true } }); // hides anything that has 'secretTour: true'
  // this.start = Date.now();
  next();
});

// // runs after the query has executed, so it has access to the docs that are returned:
// tourSchema.post(/^find/, function (docs, next) {
//   console.log(`Query took ${Date.now() - this.start} milliseconds!`);
//   console.log(docs);
//   next();
// });

// AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function (next) {
  this._pipeline.unshift({ $match: { secretTour: { $ne: true } } });
  console.log(this._pipeline); // 'this' points to the current aggregation object
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
