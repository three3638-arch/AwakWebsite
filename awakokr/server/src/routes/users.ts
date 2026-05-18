import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { config } from '../config';
import { readJSON, writeJSON } from '../services/storage';
import { User } from '../types/index';

const router = Router();

const usersFile = () => path.join(config.dataDir, 'users', 'users.json');

/** 过滤掉 passwordHash 返回安全用户数据 */
function sanitizeUser(user: User) {
  return {
    id: user.id,
    username: user.username,
    displayName: user.displayName,
    role: user.role,
    team: user.team,
    createdAt: user.createdAt,
  };
}

/** 管理员权限校验中间件 */
function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  if (!req.user) {
    res.status(401).json({ error: '未认证' });
    return;
  }
  if (req.user.role !== 'admin') {
    res.status(403).json({ error: '权限不足：仅管理员可执行此操作' });
    return;
  }
  next();
}

/**
 * GET /api/users
 * 获取所有用户列表（不含密码）
 */
router.get('/', async (_req: Request, res: Response) => {
  try {
    const users = await readJSON<User[]>(usersFile());
    res.json(users.map(sanitizeUser));
  } catch (err) {
    console.error('Get users error:', err);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

/**
 * GET /api/users/:id
 * 获取单个用户信息
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const users = await readJSON<User[]>(usersFile());
    const user = users.find((u) => u.id === req.params.id);

    if (!user) {
      res.status(404).json({ error: '用户不存在' });
      return;
    }

    res.json(sanitizeUser(user));
  } catch (err) {
    console.error('Get user error:', err);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

/**
 * POST /api/users
 * 创建新用户（仅管理员）
 */
router.post('/', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { username, displayName, password, role, team } = req.body;

    if (!username || !displayName || !password || !role || !team) {
      res.status(400).json({ error: '所有字段均为必填' });
      return;
    }

    if (!['admin', 'member'].includes(role)) {
      res.status(400).json({ error: '角色必须是 admin 或 member' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ error: '密码长度不能少于6位' });
      return;
    }

    const users = await readJSON<User[]>(usersFile());

    // 用户名唯一校验
    if (users.some((u) => u.username === username)) {
      res.status(409).json({ error: '用户名已存在' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser: User = {
      id: uuidv4(),
      username,
      displayName,
      passwordHash,
      role,
      team,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    await writeJSON(usersFile(), users);

    res.status(201).json(sanitizeUser(newUser));
  } catch (err) {
    console.error('Create user error:', err);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

/**
 * PUT /api/users/:id
 * 更新用户信息（仅管理员）
 */
router.put('/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { displayName, role, team, password } = req.body;
    const users = await readJSON<User[]>(usersFile());
    const userIndex = users.findIndex((u) => u.id === req.params.id);

    if (userIndex === -1) {
      res.status(404).json({ error: '用户不存在' });
      return;
    }

    const user = users[userIndex];

    if (displayName !== undefined) user.displayName = displayName;
    if (role !== undefined) {
      if (!['admin', 'member'].includes(role)) {
        res.status(400).json({ error: '角色必须是 admin 或 member' });
        return;
      }
      user.role = role;
    }
    if (team !== undefined) user.team = team;
    if (password) {
      if (password.length < 6) {
        res.status(400).json({ error: '密码长度不能少于6位' });
        return;
      }
      user.passwordHash = await bcrypt.hash(password, 10);
    }

    users[userIndex] = user;
    await writeJSON(usersFile(), users);

    res.json(sanitizeUser(user));
  } catch (err) {
    console.error('Update user error:', err);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

/**
 * DELETE /api/users/:id
 * 删除用户（仅管理员，不能删除自己）
 */
router.delete('/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    if (req.params.id === req.user!.userId) {
      res.status(400).json({ error: '不能删除自己' });
      return;
    }

    const users = await readJSON<User[]>(usersFile());
    const userIndex = users.findIndex((u) => u.id === req.params.id);

    if (userIndex === -1) {
      res.status(404).json({ error: '用户不存在' });
      return;
    }

    users.splice(userIndex, 1);
    await writeJSON(usersFile(), users);

    res.json({ message: '用户已删除' });
  } catch (err) {
    console.error('Delete user error:', err);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

export default router;
