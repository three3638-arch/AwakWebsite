import express from 'express';
import cors from 'cors';
import { config } from './config';
import { ensureDataDirs } from './services/storage';
import { authMiddleware } from './middleware/auth';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import cycleRoutes from './routes/cycles';
import objectiveRoutes from './routes/objectives';
import keyResultRoutes from './routes/keyresults';
import todoRoutes from './routes/todos';
import reportRoutes from './routes/reports';

const app = express();

// ─── 中间件 ────────────────────────────────────
const corsOrigins = (process.env.CORS_ORIGINS ||
  'http://localhost:5173,http://localhost:3000,http://127.0.0.1:8080,http://127.0.0.1:3005'
).split(',').map((s) => s.trim()).filter(Boolean);

app.use(cors({
  origin: corsOrigins,
  credentials: true,
}));
app.use(express.json());

// ─── 健康检查 ──────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── 路由 ──────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/users', authMiddleware, userRoutes);
app.use('/api/cycles', authMiddleware, cycleRoutes);
app.use('/api/objectives', authMiddleware, objectiveRoutes);
app.use('/api/keyresults', authMiddleware, keyResultRoutes);
app.use('/api/todos', authMiddleware, todoRoutes);
app.use('/api/reports', authMiddleware, reportRoutes);

// ─── 全局错误处理 ──────────────────────────────
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: '服务器内部错误' });
});

// ─── 启动 ──────────────────────────────────────
function start() {
  // 确保数据目录结构存在
  ensureDataDirs(config.dataDir);
  console.log(`数据目录: ${config.dataDir}`);

  app.listen(config.port, () => {
    console.log(`AwakOKR 服务已启动: http://localhost:${config.port}`);
  });
}

start();
