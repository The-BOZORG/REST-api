import jwt from 'jsonwebtoken';

const createJwt = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRESIN,
  });
  return token;
};

const verifyJwt = ({ token }) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

const attachCookies = ({ res, user }) => {
  const token = createJwt({ payload: user });

  const oneDay = 1000 * 60 * 60 * 24;
  res.cookie('token', token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === 'production',
    signed: true,
  });
};

export { createJwt, verifyJwt, attachCookies };
