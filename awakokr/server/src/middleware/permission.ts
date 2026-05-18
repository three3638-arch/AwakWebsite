import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from '../types/index';

/**
 * 权限校验中间件工厂函数
 * 检查当前用户是否是资源创建者或管理员，非所有者且非管理员返回 403
 *
 * @param resourceCreatorField - 资源对象中代表创建者的字段名，如 'createdBy'
 * @returns Express 中间件
 *
 * 使用方式：在路由中先获取资源对象，再挂载此中间件
 * 需要在 res.locals.resource 上挂载资源对象
 */
export function checkOwnerOrAdmin(resourceCreatorField: string) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = req.user as JwtPayload | undefined;

    if (!user) {
      res.status(401).json({ error: '未认证' });
      return;
    }

    // 管理员直接放行
    if (user.role === 'admin') {
      next();
      return;
    }

    // 从 res.locals.resource 获取资源对象
    const resource = res.locals.resource as Record<string, unknown> | undefined;
    if (!resource) {
      res.status(500).json({ error: '权限校验失败：未找到资源对象' });
      return;
    }

    const creatorId = resource[resourceCreatorField];
    if (creatorId === user.userId) {
      next();
      return;
    }

    res.status(403).json({ error: '权限不足：仅资源创建者或管理员可执行此操作' });
  };
}
