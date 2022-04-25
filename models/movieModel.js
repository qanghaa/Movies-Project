const mongoose = require('mongoose');
const slugify = require('slugify');

const movieSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A movie must have a name']
    },
    description: {
      type: String,
      required: true
    },
    country: { type: String, required: true },
    director: {
      type: String,
      required: [true, 'A movie must have director']
    },
    slug: String,
    actor: {
      type: Array,
      required: [true, 'A movie must have at least one actor']
    },
    type: {
      type: String,
      enum: ['single', 'series'],
      default: 'single'
    },
    genre: {
      type: Array,
      required: [true, 'A movie must have at least one genre']
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: val => Math.round(val * 10) / 10 // 4.666666, 46.6666, 47, 4.7
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    images: [String],
    year: {
      type: Number,
      default: new Date().getFullYear()
    },
    content: [String]
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    id: false
  }
);

movieSchema.index({ slug: 1 });
// Virtual populate
movieSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'movie',
  localField: '_id'
});

movieSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'reviews',
    select: ['-__v']
  });
  next();
});

movieSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

const movie = mongoose.model('movie', movieSchema);

module.exports = movie;
