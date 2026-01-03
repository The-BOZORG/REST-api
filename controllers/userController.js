import User from '../models/user.js';
import asyncHandler from '../utils/asyncHandler.js';
import {
  badRequestError,
  unauthenticatedError,
  notFoundError,
} from '../errors/index.js';
import { createTokenUser, checkPermissions } from '../utils/index.js';

//@access private
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ role: 'user' });
  res.status(201).json({ users });
});

//@access public
const getSingleUser = asyncHandler(async (req, res) => {
  const user = await User.findOne({ _id: req.params.id });
  if (!user) {
    throw new notFoundError(`no user with id ${req.params.id}`);
  }
  checkPermissions(req.user, user._id);
  res.status(200).json({ success: true, user });
});

//@access public
const showCorrectUser = asyncHandler(async (req, res) => {
  res.status(200).json({ user: req.user });
});

//@access public
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

//@access public
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

//@access private
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
