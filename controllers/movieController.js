const multer = require('multer');
const sharp = require('sharp');
const Movie = require('./../models/movieModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('./../utils/appError');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadMovieImages = upload.fields([{ name: 'images', maxCount: 3 }]);

exports.resizeMovieImages = catchAsync(async (req, res, next) => {
  if (!req.files?.images) return next();

  req.body.images = [];

  await Promise.all(
    req.files.images.map(async (file, i) => {
      const filename = `movie-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 100 })
        .toFile(`public/img/movies/${filename}`);

      req.body.images.push(filename);
    })
  );

  next();
});

exports.aliasTopMovies = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage';
  req.query.fields = 'name,ratingsAverage,summary';
  next();
};

exports.addSingleMovie = catchAsync(async (req, res, next) => {
  const movie = await Movie.findByIdAndUpdate(
    { _id: req.params.id },
    { $push: { content: req.body.movie } },
    {
      new: true,
      runValidators: true
    }
  );

  if (!movie) {
    return next(new AppError('No movie found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: movie
    }
  });
});

exports.getMovieStats = catchAsync(async (req, res, next) => {
  const stats = await Movie.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } }
    },
    {
      $project: {
        size: { $size: '$content' },
        name: 1,
        ratingsAverage: 1,
        ratingsQuantity: 1
      }
    },
    {
      $group: {
        _id: '$name',
        numRatings: { $sum: '$ratingsQuantity' },
        numMovies: { $sum: '$size' },
        avgRating: { $avg: '$ratingsAverage' }
      }
    },

    {
      $sort: { avgRating: 1 }
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats
    }
  });
});

exports.getAllMovies = factory.getAll(Movie);
exports.getMovie = factory.getOne(Movie, { path: 'reviews' });
exports.createMovie = factory.createOne(Movie);
exports.updateMovie = factory.updateOne(Movie);
exports.deleteMovie = factory.deleteOne(Movie);
