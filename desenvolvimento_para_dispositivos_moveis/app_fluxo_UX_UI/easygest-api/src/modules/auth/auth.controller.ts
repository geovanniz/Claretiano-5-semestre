import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { AuthRequest } from '../../types';

const service = new AuthService();

export const authController = {
  login(req: Request, res: Response): void {
    try {
      const result = service.login(req.body);
      res.json({ data: result });
    } catch (e: unknown) {
      res.status(401).json({ error: (e as Error).message });
    }
  },

  me(req: AuthRequest, res: Response): void {
    try {
      const user = service.me(req.user!.sub);
      res.json({ data: user });
    } catch (e: unknown) {
      res.status(404).json({ error: (e as Error).message });
    }
  },
};
