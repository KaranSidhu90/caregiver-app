const Review = require('../models/Review');

exports.addReview = async (req, res, next) => {
  try {
    const { reviewerId, receiverId, bookingId, rating, comment } = req.body;

    const newReview = new Review({
      reviewerId,
      receiverId,
      bookingId,
      rating,
      comment
    });

    await newReview.save();
    res.status(201).json(newReview);
  } catch (err) {
    console.error('Error adding review:', err);
    next(err); // Forward error to the error handler middleware
  }
};

exports.getReviewsByReceiverId = async (req, res, next) => {
  try {
    const { receiverId } = req.params;
    const reviews = await Review.find({ receiverId }).sort({ date: -1 }).exec();

    if (!reviews.length) {
      return res.status(404).json({ message: 'No reviews found for this user' });
    }

    const mostRecentReviews = {};
    reviews.forEach(review => {
      if (!mostRecentReviews[review.reviewerId]) {
        mostRecentReviews[review.reviewerId] = review;
      }
    });

    const uniqueRecentReviews = Object.values(mostRecentReviews);
    res.status(200).json(uniqueRecentReviews);
  } catch (err) {
    console.error('Error fetching reviews:', err);
    next(err); // Forward error to the error handler middleware
  }
};

exports.getAverageRatingByReceiverId = async (req, res, next) => {
  try {
    const { receiverId } = req.params;
    const reviews = await Review.find({ receiverId });

    if (!reviews.length) {
      return res.status(404).json({ message: 'No reviews found for this user' });
    }

    const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
    res.status(200).json({ averageRating });
  } catch (err) {
    console.error('Error calculating average rating:', err);
    next(err); // Forward error to the error handler middleware
  }
};

exports.getReviewByBookingAndReceiver = async (req, res, next) => {
  try {
    const { bookingId, receiverId } = req.params;
    const review = await Review.findOne({ bookingId, receiverId });

    if (!review) {
      return res.status(404).json({ message: 'No review found for this booking and receiver.' });
    }

    res.status(200).json(review);
  } catch (err) {
    console.error('Error fetching review:', err);
    next(err); // Forward error to the error handler middleware
  }
};
