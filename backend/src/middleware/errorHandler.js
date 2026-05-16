function notFound(req, res, next) {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.originalUrl} does not exist`,
  });
}

function errorHandler(err, req, res, next) {
  if (err.name === 'CastError') {
    return res.status(404).json({
      error: 'Not Found',
      message: 'Job request not found',
    });
  }

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      error: 'Validation Error',
      message: messages.join(', '),
    });
  }

  const status = err.status || 500;
  res.status(status).json({
    error: err.name || 'Server Error',
    message: err.message || 'Internal server error',
  });
}

module.exports = { notFound, errorHandler };
