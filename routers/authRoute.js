import express from 'express';
const router = express.Router();

import validate from '../middlewares/validation.js';
import { loginSchema, registerSchema } from '../utils/index.js';

import { register, login, logout } from '../controllers/authController.js';

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/logout', logout);

export default router;
