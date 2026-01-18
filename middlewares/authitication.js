import { unauthorizedError, unauthenticatedError } from '../errors/index.js';
import { verifyJwt } from '../utils/index.js';

const authenticateUser = async (req, res, next) => {
  const token = req.signedCookies.token;

  if (!token) {
    throw new CustomError.UnauthenticatedError('auth invalid');
  }
  try {
    const { name, userId, role } = verifyJwt({ token });
    req.user = { name, userId, role };
    next();
  } catch (error) {
    throw new CustomError.UnauthenticatedError('auth invalid');
  }
};

const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new unauthorizedError('unauthorized to access this route');
    }
    next();
  };
};

export { authenticateUser, authorizePermissions };
