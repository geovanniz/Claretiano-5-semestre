import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../../database/connection';
import { User, LoginDTO, JwtPayload } from '../../types';

export class AuthService {
  login(dto: LoginDTO): { token: string; user: Omit<User, 'password_hash'> } {
    const user = db
      .prepare('SELECT * FROM users WHERE email = ? AND active = 1')
      .get(dto.email) as User | undefined;

    if (!user || !bcrypt.compareSync(dto.password, user.password_hash)) {
      throw new Error('Credenciais inválidas.');
    }

    const payload: JwtPayload = { sub: user.id, name: user.name, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
    });

    const { password_hash, ...safeUser } = user;
    return { token, user: safeUser };
  }

  me(userId: number): Omit<User, 'password_hash'> {
    const user = db
      .prepare('SELECT id, name, email, role, active, created_at FROM users WHERE id = ?')
      .get(userId) as User | undefined;

    if (!user) throw new Error('Usuário não encontrado.');
    return user;
  }
}
