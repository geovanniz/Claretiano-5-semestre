import { Router } from 'express';
import { authController } from './auth.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

export const authRoutes = Router();

// POST /auth/login  — público
authRoutes.post('/login', authController.login);

// GET  /auth/me     — requer token
authRoutes.get('/me', authMiddleware, authController.me);
