// ── Controller ────────────────────────────────────────────────────────────────
import { Response } from 'express';
import { ProductsService } from './products.service';
import { AuthRequest } from '../../types';

const service = new ProductsService();

export const productsController = {
  index(_req: AuthRequest, res: Response): void {
    res.json({ data: service.findAll() });
  },

  show(req: AuthRequest, res: Response): void {
    try {
      res.json({ data: service.findById(+req.params.id) });
    } catch (e: unknown) {
      res.status(404).json({ error: (e as Error).message });
    }
  },

  create(req: AuthRequest, res: Response): void {
    try {
      const product = service.create(req.body);
      res.status(201).json({ data: product });
    } catch (e: unknown) {
      res.status(400).json({ error: (e as Error).message });
    }
  },

  update(req: AuthRequest, res: Response): void {
    try {
      const product = service.update(+req.params.id, req.body);
      res.json({ data: product });
    } catch (e: unknown) {
      res.status(400).json({ error: (e as Error).message });
    }
  },

  remove(req: AuthRequest, res: Response): void {
    try {
      service.remove(+req.params.id);
      res.json({ message: 'Produto removido.' });
    } catch (e: unknown) {
      res.status(404).json({ error: (e as Error).message });
    }
  },
};

// ── Routes ────────────────────────────────────────────────────────────────────
import { Router } from 'express';
import { authMiddleware, roleGuard } from '../../middleware/auth.middleware';

export const productRoutes = Router();

// Todos os endpoints requerem autenticação
productRoutes.use(authMiddleware);

productRoutes.get('/',     productsController.index);
productRoutes.get('/:id',  productsController.show);
productRoutes.post('/',    roleGuard('admin', 'estoque'), productsController.create);
productRoutes.put('/:id',  roleGuard('admin', 'estoque'), productsController.update);
productRoutes.delete('/:id', roleGuard('admin'),          productsController.remove);
