const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({
    message: 'An unexpected error occurred',
    error: err.message,
  });
};

module.exports = errorHandler;
