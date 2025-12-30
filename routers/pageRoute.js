import { Router } from 'express';
const router = Router();

import {
  getHomePage,
  getAuthPage,
  getDashboardPage,
  getUsersPage,
} from '../controllers/pageController.js';

import {
  authenticateUser,
  authorizePermissions,
} from '../middlewares/authitication.js';

// Public Pages
router.get('/', getHomePage);
router.get('/auth', getAuthPage);

// Protected Pages
router.get('/dashboard', authenticateUser, getDashboardPage);
router.get(
  '/users',
  authenticateUser,
  authorizePermissions('admin'),
  getUsersPage
);

export default router;
