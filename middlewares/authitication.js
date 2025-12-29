import { unauthorizedError, unauthenticatedError } from '../errors/index.js';
import { verifyJwt } from '../utils/index.js';

const authenticateUser = async (req, res, next) => {
  let payload = null;
  let shouldRefreshAccessToken = false;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const accessToken = authHeader.split(' ')[1];

    try {
      payload = verifyJwt({ token: accessToken, type: 'access' });
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        shouldRefreshAccessToken = true;
      } else if (error.name === 'JsonWebTokenError') {
        throw new unauthenticatedError('Invalid access token');
      }
    }
  }

  if (!payload && req.signedCookies?.refreshToken) {
    try {
      payload = verifyJwt({
        token: req.signedCookies.refreshToken,
        type: 'refresh',
      });
      shouldRefreshAccessToken = true;
    } catch (error) {
      throw new unauthenticatedError('Invalid or expired refresh token');
    }
  }

  if (!payload) {
    throw new unauthenticatedError('Authentication required');
  }

  req.user = {
    name: payload.name,
    userId: payload.userId,
    role: payload.role,
  };

  next();
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
