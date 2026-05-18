import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config';
import { readJSON, writeJSON, ensureDataDirs } from '../services/storage';
import { User } from '../types/index';
import path from 'path';

async function initAdmin(): Promise<void> {
  // 确保数据目录存在
  ensureDataDirs(config.dataDir);

  const usersFile = path.join(config.dataDir, 'users', 'users.json');
  const users = await readJSON<User[]>(usersFile);

  // 检查是否已存在管理员
  const existingAdmin = users.find(u => u.role === 'admin');
  if (existingAdmin) {
    console.log('管理员账号已存在，跳过创建。');
    console.log(`  用户名: ${existingAdmin.username}`);
    return;
  }

  // 创建默认管理员
  const passwordHash = await bcrypt.hash('admin123', 10);
  const admin: User = {
    id: uuidv4(),
    username: 'admin',
    displayName: '系统管理员',
    passwordHash,
    role: 'admin',
    team: '管理团队',
    createdAt: new Date().toISOString(),
  };

  users.push(admin);
  await writeJSON(usersFile, users);

  console.log('默认管理员账号创建成功！');
  console.log('  用户名: admin');
  console.log('  密码: admin123');
  console.log('  ⚠ 请登录后立即修改默认密码！');
}

initAdmin().catch(err => {
  console.error('初始化管理员失败:', err);
  process.exit(1);
});
