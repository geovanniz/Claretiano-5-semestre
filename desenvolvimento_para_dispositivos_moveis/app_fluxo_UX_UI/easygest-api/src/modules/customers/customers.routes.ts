// ── Service ───────────────────────────────────────────────────────────────────
import { db } from '../../database/connection';
import { Customer, CreateCustomerDTO } from '../../types';

export class CustomersService {
  findAll(): Customer[] {
    return db
      .prepare('SELECT * FROM customers WHERE active = 1 ORDER BY name')
      .all() as Customer[];
  }

  findById(id: number): Customer {
    const row = db
      .prepare('SELECT * FROM customers WHERE id = ? AND active = 1')
      .get(id) as Customer | undefined;
    if (!row) throw new Error('Cliente não encontrado.');
    return row;
  }

  create(dto: CreateCustomerDTO): Customer {
    const stmt = db.prepare(`
      INSERT INTO customers (name, doc_type, doc_number, email, phone)
      VALUES (@name, @doc_type, @doc_number, @email, @phone)
    `);
    const result = stmt.run(dto);
    return this.findById(result.lastInsertRowid as number);
  }

  update(id: number, dto: Partial<CreateCustomerDTO>): Customer {
    this.findById(id);
    const fields = Object.keys(dto).map(k => `${k} = @${k}`).join(', ');
    db.prepare(`UPDATE customers SET ${fields} WHERE id = @id`).run({ ...dto, id });
    return this.findById(id);
  }

  remove(id: number): void {
    this.findById(id);
    db.prepare('UPDATE customers SET active = 0 WHERE id = ?').run(id);
  }
}

// ── Controller + Routes ───────────────────────────────────────────────────────
import { Router, Response } from 'express';
import { AuthRequest } from '../../types';
import { authMiddleware } from '../../middleware/auth.middleware';

const service = new CustomersService();

export const customerRoutes = Router();
customerRoutes.use(authMiddleware);

customerRoutes.get('/', (_req, res: Response) => {
  res.json({ data: service.findAll() });
});

customerRoutes.get('/:id', (req: AuthRequest, res: Response) => {
  try { res.json({ data: service.findById(+req.params.id) }); }
  catch (e: unknown) { res.status(404).json({ error: (e as Error).message }); }
});

customerRoutes.post('/', (req: AuthRequest, res: Response) => {
  try { res.status(201).json({ data: service.create(req.body) }); }
  catch (e: unknown) { res.status(400).json({ error: (e as Error).message }); }
});

customerRoutes.put('/:id', (req: AuthRequest, res: Response) => {
  try { res.json({ data: service.update(+req.params.id, req.body) }); }
  catch (e: unknown) { res.status(400).json({ error: (e as Error).message }); }
});

customerRoutes.delete('/:id', (req: AuthRequest, res: Response) => {
  try { service.remove(+req.params.id); res.json({ message: 'Cliente removido.' }); }
  catch (e: unknown) { res.status(404).json({ error: (e as Error).message }); }
});
