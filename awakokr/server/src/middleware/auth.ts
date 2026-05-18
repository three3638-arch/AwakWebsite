import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { JwtPayload } from '../types/index';

/**
 * JWT 认证中间件
 * 从 Authorization header 读取 Bearer token，验证后将 decoded 信息附加到 req.user
 */
export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: '未提供认证令牌' });
    return;
  }

  const token = authHeader.substring(7); // 去掉 "Bearer " 前缀

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: '认证令牌无效或已过期' });
  }
}
