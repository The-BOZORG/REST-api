import customError from "./customError.js";

class badRequestError extends customError {
  constructor(message) {
    super(message || "Bad Request", 400);
  }
}

export default badRequestError
