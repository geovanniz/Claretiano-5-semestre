// ── Service ───────────────────────────────────────────────────────────────────
import bcrypt from 'bcryptjs';
import { db } from '../../database/connection';
import { User, CreateUserDTO } from '../../types';

type SafeUser = Omit<User, 'password_hash'>;

export class UsersService {
  findAll(): SafeUser[] {
    return db
      .prepare('SELECT id, name, email, role, active, created_at FROM users ORDER BY name')
      .all() as SafeUser[];
  }

  findById(id: number): SafeUser {
    const row = db
      .prepare('SELECT id, name, email, role, active, created_at FROM users WHERE id = ?')
      .get(id) as SafeUser | undefined;
    if (!row) throw new Error('Usuário não encontrado.');
    return row;
  }

  create(dto: CreateUserDTO): SafeUser {
    const hash = bcrypt.hashSync(dto.password, 10);
    const stmt = db.prepare(
      `INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)`
    );
    const result = stmt.run(dto.name, dto.email, hash, dto.role);
    return this.findById(result.lastInsertRowid as number);
  }

  update(id: number, dto: Partial<CreateUserDTO>): SafeUser {
    this.findById(id);
    const { password, ...rest } = dto;
    const updates: Record<string, unknown> = { ...rest };
    if (password) updates.password_hash = bcrypt.hashSync(password, 10);

    const fields = Object.keys(updates).map(k => `${k} = @${k}`).join(', ');
    db.prepare(`UPDATE users SET ${fields} WHERE id = @id`).run({ ...updates, id });
    return this.findById(id);
  }

  deactivate(id: number): void {
    this.findById(id);
    db.prepare('UPDATE users SET active = 0 WHERE id = ?').run(id);
  }
}

// ── Controller + Routes ───────────────────────────────────────────────────────
import { Router, Response } from 'express';
import { AuthRequest } from '../../types';
import { authMiddleware, roleGuard } from '../../middleware/auth.middleware';

const service = new UsersService();

export const userRoutes = Router();
userRoutes.use(authMiddleware, roleGuard('admin'));

userRoutes.get('/',    (_req, res: Response) => res.json({ data: service.findAll() }));
userRoutes.get('/:id', (req: AuthRequest, res: Response) => {
  try { res.json({ data: service.findById(+req.params.id) }); }
  catch (e: unknown) { res.status(404).json({ error: (e as Error).message }); }
});
userRoutes.post('/', (req: AuthRequest, res: Response) => {
  try { res.status(201).json({ data: service.create(req.body) }); }
  catch (e: unknown) { res.status(400).json({ error: (e as Error).message }); }
});
userRoutes.put('/:id', (req: AuthRequest, res: Response) => {
  try { res.json({ data: service.update(+req.params.id, req.body) }); }
  catch (e: unknown) { res.status(400).json({ error: (e as Error).message }); }
});
userRoutes.delete('/:id', (req: AuthRequest, res: Response) => {
  try { service.deactivate(+req.params.id); res.json({ message: 'Usuário desativado.' }); }
  catch (e: unknown) { res.status(404).json({ error: (e as Error).message }); }
});
