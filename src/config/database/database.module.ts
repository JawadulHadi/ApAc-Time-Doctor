import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

import { SYSTEM_ERROR } from '../../types/constants/error-messages.constants';
import config from '../config';
@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => {
        const mongoConfig = config().mongo;
        if (!mongoConfig.host || !mongoConfig.db || !mongoConfig.user || !mongoConfig.pass) {
          throw new Error(SYSTEM_ERROR.DATABASE_CONNECTION_FAILED);
        }
        const { host, db, user, pass } = mongoConfig;
        const uri = `mongodb+srv://${user}:${pass}@${host}/${db}?retryWrites=true&w=majority`;
        const connectionOptions: any = {
          uri: uri,
        };
        if (process.env.FAST_STARTUP === 'true') {
          connectionOptions.bufferCommands = false;
          connectionOptions.bufferTimeoutMS = 10000;
          connectionOptions.maxPoolSize = 10;
          connectionOptions.socketTimeoutMS = 30000;
          connectionOptions.connectTimeoutMS = 15000;
          connectionOptions.serverSelectionTimeoutMS = 15000;
        }
        return connectionOptions;
      },
    }),
  ],
})
export class DatabaseModule {}
/**
 * Database module factory for testing
 * Returns MongoDB memory server configuration for test environment
 */
export function databaseModule(): {
  mongoServer: MongoMemoryServer;
  testConnection: mongoose.Connection;
} {
  let mongoServer: MongoMemoryServer;
  let testConnection: mongoose.Connection;
  return {
    mongoServer,
    testConnection,
  };
}
