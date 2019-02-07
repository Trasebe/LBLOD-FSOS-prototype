import httpStatus from "http-status";
import expressValidation from "express-validation";

/**
 * @extends Error
 */
class ExtendableError extends Error {
  constructor(message, status, isPublic) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
    this.status = status;
    this.isPublic = isPublic;
    this.isOperational = true; // This is required since bluebird 4 doesn't append it anymore.
    Error.captureStackTrace(this, this.constructor.name);
  }
}

/**
 * Class representing an API error.
 * @extends ExtendableError
 */
class APIError extends ExtendableError {
  /**
   * Creates an API error.
   * @param {string} message - Error message.
   * @param {number} status - HTTP status code of error.
   * @param {boolean} isPublic - Whether the message should be visible to user or not.
   */
  constructor(message, status = httpStatus.BAD_REQUEST, isPublic = true) {
    super(message, status, isPublic);
  }
}

export const ErrorParser = (err, req, res, next) => {
  if (err instanceof expressValidation.ValidationError) {
    // validation error contains errors which is an array of error each containing message[]
    const unifiedErrorMessage = err.errors
      .map(error => error.messages.join(". "))
      .join(" and ");
    const error = new APIError(unifiedErrorMessage, err.status, true);
    return next(error);
  }
  if (!(err instanceof APIError)) {
    const apiError = new APIError(err.message || err, err.status, err.isPublic);
    return next(apiError);
  }
  return next(err);
};

export default APIError;
