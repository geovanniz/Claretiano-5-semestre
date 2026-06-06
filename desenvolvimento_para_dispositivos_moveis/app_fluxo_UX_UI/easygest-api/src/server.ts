import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { authRoutes }     from './modules/auth/auth.routes';
import { productRoutes }  from './modules/products/products.routes';
import { customerRoutes } from './modules/customers/customers.routes';
import { userRoutes }     from './modules/users/users.routes';
import { saleRoutes }     from './modules/sales/sales.routes';
import { financialRoutes} from './modules/financial/financial.routes';
import { errorMiddleware } from './middleware/error.middleware';

const app  = express();
const PORT = process.env.PORT ?? 3000;

// ── Middlewares globais ───────────────────────────────────────────────────────
app.use(cors({ origin: '*' }));            // em prod: restrinja a origem
app.use(express.json());

// ── Rotas ─────────────────────────────────────────────────────────────────────
app.use('/auth',      authRoutes);
app.use('/products',  productRoutes);
app.use('/customers', customerRoutes);
app.use('/users',     userRoutes);
app.use('/sales',     saleRoutes);
app.use('/financial', financialRoutes);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// ── Error handler ─────────────────────────────────────────────────────────────
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`🚀 EasyGest API rodando em http://localhost:${PORT}`);
});

export default app;
