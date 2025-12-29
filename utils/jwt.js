import jwt from 'jsonwebtoken';

const createJwt = (payload) => {
  const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });

  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });

  return { accessToken, refreshToken };
};

const verifyJwt = ({ token, type = 'access' }) => {
  const secret =
    type === 'access'
      ? process.env.JWT_ACCESS_SECRET
      : process.env.JWT_REFRESH_SECRET;

  return jwt.verify(token, secret);
};

const attachCookies = ({ res, user }) => {
  const { accessToken, refreshToken } = createJwt(user);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    signed: true,
    sameSite: 'strict',
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });

  return accessToken;
};

export { createJwt, verifyJwt, attachCookies };
