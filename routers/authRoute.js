import express from 'express';
const router = express.Router();

import {
  register,
  shouwRegister,
  login,
  showLogin,
  logout,
} from '../controllers/authController.js';

router.post('/register', register);
router.get('/register', shouwRegister);
router.post('/login', login);
router.get('/login', showLogin);
router.get('/logout', logout);

export default router;
