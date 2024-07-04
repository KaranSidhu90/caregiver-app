const Review = require('../models/Review');

exports.addReview = async (req, res, next) => {
  try {
    const { reviewerId, receiverId, rating, comment } = req.body;

    const newReview = new Review({
      reviewerId,
      receiverId,
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
    const reviews = await Review.find({ receiverId });

    if (!reviews.length) {
      return res.status(404).json({ message: 'No reviews found for this user' });
    }

    res.status(200).json(reviews);
  } catch (err) {
    console.error('Error fetching reviews:', err);
    next(err); // Forward error to the error handler middleware
  }
};
