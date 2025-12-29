import User from '../models/user.js';
import asyncHandler from '../utils/asyncHandler.js';
import { badRequestError, unauthenticatedError } from '../errors/index.js';
import { createTokenUser, attachCookies } from '../utils/index.js';

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const emailAlreadyExist = await User.findOne({ email });
  if (emailAlreadyExist) {
    throw new badRequestError('email already exist');
  }

  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? 'admin' : 'user';

  const user = await User.create({ name, email, password, role });

  const tokenUser = createTokenUser(user);
  const accessToken = attachCookies({ res, user: tokenUser });

  res
    .status(201)
    .json({ msg: 'user register success', user: tokenUser, accessToken });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new badRequestError('please provide email or password');
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new unauthenticatedError('invalid logon');
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new unauthenticatedError('invalid logon');
  }

  const tokenUser = createTokenUser(user);
  const accessToken = attachCookies({ res, user: tokenUser });

  res
    .status(200)
    .json({ msg: 'user login success', user: tokenUser, accessToken });
});

const logout = asyncHandler(async (req, res) => {
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(),
  });
  res.status(200).json({ msg: 'user logout!' });
});

export { register, login, logout };
