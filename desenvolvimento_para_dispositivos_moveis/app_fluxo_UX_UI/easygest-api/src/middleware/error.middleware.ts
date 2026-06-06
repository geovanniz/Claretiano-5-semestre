import { Request, Response, NextFunction } from 'express';

export function errorMiddleware(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const isDev = process.env.NODE_ENV === 'development';
  console.error('[ERROR]', err.message);

  res.status(500).json({
    error: 'Erro interno do servidor.',
    ...(isDev && { detail: err.message }),
  });
}
