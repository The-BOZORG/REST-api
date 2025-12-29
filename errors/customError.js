class customError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode || 500; 
    this.message = message || "Internal Server Error";
  }
}
export default customError
