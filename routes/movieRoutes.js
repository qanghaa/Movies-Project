const express = require('express');
const movieController = require('../controllers/movieController');
const authController = require('../controllers/authController');
const reviewRouter = require('./../routes/reviewRoutes');

const router = express.Router();

// router.param('id', movieController.checkID);

// POST /movie/234fad4/reviews
// GET /movie/234fad4/reviews

router.use('/:movieId/reviews', reviewRouter);

router.route('/movie-stats').get(movieController.getMovieStats);

router
  .route('/')
  .get(movieController.getAllMovies)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'manager'),
    movieController.createMovie
  );

router
  .route('/:id')
  .get(movieController.getMovie)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'manager'),
    movieController.addSingleMovie
  )
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'manager'),
    movieController.uploadMovieImages,
    movieController.resizeMovieImages,
    movieController.updateMovie
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'manager'),
    movieController.deleteMovie
  );

module.exports = router;
