import User from '../models/user.js';
import asyncHandler from '../utils/asyncHandler.js';
import {
  badRequestError,
  unauthenticatedError,
  notFoundError,
} from '../errors/index.js';
import {
  createTokenUser,
  attachCookies,
  checkPermissions,
} from '../utils/index.js';
import user from '../models/user.js';

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ role: 'user' });
  res.status(201).json({ users });
});

const getSingleUser = asyncHandler(async (req, res) => {
  const user = await User.findOne({ _id: req.params.id });
  if (!user) {
    throw new notFoundError(`no user with id ${req.params.id}`);
  }
  checkPermissions(req.user, user._id);
  res.status(200).json({ success: true, user });
});

const showCorrectUser = asyncHandler(async (req, res) => {
  res.status(200).json({ user: req.user });
});

const updateUser = asyncHandler(async (req, res) => {
  const { email, name } = req.body;
  if (!email || !name) {
    throw new badRequestError('please provide all value');
  }

  const user = await User.findByIdAndUpdate(
    { _id: req.user.userId },
    { email, name },
    { new: true, runValidators: true }
  );

  const tokenUser = createTokenUser(user);

  res.status(201).json({ user: tokenUser });
});

const updateUserPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new badRequestError('please provide both password');
  }

  const user = await User.findOne({ _id: req.user.userId }).select('+password');

  const isPasswordCorrect = await user.comparePassword(oldPassword);
  if (!isPasswordCorrect) {
    throw new unauthenticatedError('invalid password');
  }

  user.password = newPassword;

  await user.save();
  res.status(201).json({ success: true, msg: 'password update success!' });
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete({ _id: req.params.id });

  if (!user) {
    throw new notFoundError(`no user with id ${req.params.id}`);
  }

  checkPermissions(req.user, user._id);
  res.status(200).json({ success: true });
});

export {
  getAllUsers,
  getSingleUser,
  showCorrectUser,
  updateUser,
  updateUserPassword,
  deleteUser,
};
