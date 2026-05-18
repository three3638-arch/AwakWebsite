import fs from 'fs';
import path from 'path';
import lockfile from 'proper-lockfile';

/**
 * 确保目录存在，不存在则递归创建
 */
function ensureDir(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * 确保文件存在，不存在则创建并写入默认内容
 */
function ensureFile(filePath: string, defaultContent: string = '[]'): void {
  const dir = path.dirname(filePath);
  ensureDir(dir);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, defaultContent, 'utf-8');
  }
}

/**
 * 读取 JSON 文件
 * 文件不存在时自动创建并返回空数组
 */
export async function readJSON<T = unknown>(filePath: string): Promise<T> {
  ensureFile(filePath, '[]');
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as T;
}

/**
 * 写入 JSON 文件
 * 使用 proper-lockfile 加文件锁，保证并发写入安全
 */
export async function writeJSON<T = unknown>(filePath: string, data: T): Promise<void> {
  ensureFile(filePath, '[]');

  // 获取文件锁
  const release = await lockfile.lock(filePath, { retries: 3 });
  try {
    const json = JSON.stringify(data, null, 2);
    fs.writeFileSync(filePath, json, 'utf-8');
  } finally {
    await release();
  }
}

/**
 * 确保数据目录结构完整
 */
export function ensureDataDirs(baseDir: string): void {
  const subDirs = ['users', 'cycles', 'objectives', 'keyresults', 'todos'];
  for (const dir of subDirs) {
    ensureDir(path.join(baseDir, dir));
  }

  // 确保每个子目录下有对应的 JSON 数据文件
  const dataFiles: Record<string, string> = {
    users: '[]',
    cycles: '[]',
    objectives: '[]',
    keyresults: '[]',
    todos: '[]',
  };
  for (const [name, defaultContent] of Object.entries(dataFiles)) {
    ensureFile(path.join(baseDir, name, `${name}.json`), defaultContent);
  }
}
