import { Router } from 'express';
const route = Router();

import {
  getAllUsers,
  getSingleUser,
  showCorrectUser,
  updateUser,
  updateUserPassword,
  deleteUser,
} from '../controllers/userController.js';

import {
  authenticateUser,
  authorizePermissions,
} from '../middlewares/authitication.js';

route.get('/', authenticateUser, authorizePermissions('admin'), getAllUsers);
route.get('/showme', authenticateUser, showCorrectUser);
route.patch('/updateuser', authenticateUser, updateUser);
route.patch('/updatepassword', authenticateUser, updateUserPassword);
route.delete(
  '/delete/:id',
  authenticateUser,
  authorizePermissions('admin'),
  deleteUser
);
route.get('/:id', authenticateUser, getSingleUser);

export default route;
