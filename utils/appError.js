class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true; // use this boolean to only send errors back to the client for operational errors, not programming errors

    Error.captureStackTrace(this, this.constructor); // this error won't pollute the stack trace (err.stack)
  }
}

module.exports = AppError;
