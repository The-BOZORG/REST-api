import customError from "./customError.js";

class unauthorizedError extends customError {
  constructor(message) {
    super(message || "Access forbidden", 403);
  }
}

export default unauthorizedError;
