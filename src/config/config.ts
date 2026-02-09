import dotenv from 'dotenv';

import { Config } from '../types/interfaces/base.interface';
dotenv.config();
export default (): Config => {
  const requiredEnvVars = ['MONGO_HOST', 'MONGO_DB', 'MONGO_USER', 'MONGO_PASS'];
  const missingVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
  return {
    mongo: {
      host: process.env.MONGO_HOST,
      db: process.env.MONGO_DB,
      user: process.env.MONGO_USER,
      pass: process.env.MONGO_PASS,
    },
    app: {
      port: parseInt(process.env.PORT || '3400', 10),
      env: process.env.NODE_ENV || 'development',
    },
  };
};
