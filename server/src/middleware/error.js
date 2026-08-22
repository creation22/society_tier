/** Central error handler + async wrapper so controllers stay clean. */

class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// eslint-disable-next-line no-unused-vars
function errorHandler(err, _req, res, _next) {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({
    error: status === 500 ? 'Something went wrong' : err.message
  });
}

function notFound(_req, res) {
  res.status(404).json({ error: 'Not found' });
}

module.exports = { ApiError, asyncHandler, errorHandler, notFound };
