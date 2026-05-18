import path from 'path';

export const config = {
  port: Number(process.env.PORT) || 3001,
  jwtSecret: process.env.JWT_SECRET || 'awak-okr-secret-key-change-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  dataDir: process.env.DATA_DIR
    ? path.resolve(process.env.DATA_DIR)
    : path.resolve(__dirname, '../../data'),
};
