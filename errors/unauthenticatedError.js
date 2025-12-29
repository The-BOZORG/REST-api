import customError from "./customError.js";

class unauthenticatedError extends customError {
  constructor(message) {
    super(message || "Authentication required", 401);
  }
}
export default unauthenticatedError