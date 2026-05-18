import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import path from 'path';
import { config } from '../config';
import { readJSON, writeJSON } from '../services/storage';
import { authMiddleware } from '../middleware/auth';
import { User, JwtPayload } from '../types/index';

const router = Router();

const usersFile = () => path.join(config.dataDir, 'users', 'users.json');

/**
 * POST /api/auth/login
 * 用户登录，验证用户名密码后返回 JWT token 和用户信息
 */
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ error: '用户名和密码不能为空' });
      return;
    }

    const users = await readJSON<User[]>(usersFile());
    const user = users.find((u) => u.username === username);

    if (!user) {
      res.status(401).json({ error: '用户名或密码错误' });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      res.status(401).json({ error: '用户名或密码错误' });
      return;
    }

    const payload: JwtPayload = {
      userId: user.id,
      username: user.username,
      role: user.role,
    };

    const token = jwt.sign(payload, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn as any,
    });

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        role: user.role,
        team: user.team,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

/**
 * POST /api/auth/change-password
 * 修改密码，需认证
 */
router.post('/change-password', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      res.status(400).json({ error: '旧密码和新密码不能为空' });
      return;
    }

    if (newPassword.length < 6) {
      res.status(400).json({ error: '新密码长度不能少于6位' });
      return;
    }

    const users = await readJSON<User[]>(usersFile());
    const user = users.find((u) => u.id === req.user!.userId);

    if (!user) {
      res.status(404).json({ error: '用户不存在' });
      return;
    }

    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!isOldPasswordValid) {
      res.status(401).json({ error: '旧密码不正确' });
      return;
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await writeJSON(usersFile(), users);

    res.json({ message: '密码修改成功' });
  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

export default router;
