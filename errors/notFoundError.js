import customError from "./customError.js";

class notFoundError extends customError {
  constructor(message) {
    super(message || "Resource not found", 404);
  }
}

export default notFoundError;
