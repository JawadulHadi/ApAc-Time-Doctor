import { Storage } from '@google-cloud/storage';
import { Logger } from '@nestjs/common';
import fs from 'fs';
import path from 'path';
class GCStorage {
  private storage: Storage | null = null;
  private isInitialized: boolean = false;
  private initializationError: Error | null = null;
  private initializationPromise: Promise<void> | null = null;
  private readonly logger = new Logger(GCStorage.name);
  constructor() {}
  private async initializeGCSAsync(): Promise<void> {
    if (this.isInitialized) {
      return;
    }
    if (this.initializationPromise) {
      return this.initializationPromise;
    }
    this.initializationPromise = this.initializeGCS();
    try {
      await this.initializationPromise;
    } finally {
      this.initializationPromise = null;
    }
  }
  private async initializeGCS(): Promise<void> {
    try {
      this.logger.log('Initializing GCS...');
      if (process.env.GCS_SERVICE_ACCOUNT_JSON) {
        try {
          const credentials = JSON.parse(process.env.GCS_SERVICE_ACCOUNT_JSON);
          this.storage = new Storage({
            credentials,
            projectId:
              credentials.project_id || process.env.GCS_PROJECT_ID || 'artful-talon-269415',
          });
          this.logger.log(`GCS initialized with ${credentials}`);
        } catch (parseError) {
          throw new Error('Invalid Key format');
        }
      } else if (process.env.GCS_KEY_JSON) {
        try {
          const credentials = JSON.parse(process.env.GCS_KEY_JSON);
          this.storage = new Storage({
            credentials,
            projectId:
              credentials.project_id || process.env.GCS_PROJECT_ID || 'artful-talon-269415',
          });
          this.logger.log(`GCS initialized with ${credentials}`);
        } catch (parseError) {
          throw new Error('Invalid GCS_KEY_JSON format');
        }
      } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        const keyPath = path.resolve(process.cwd(), process.env.GOOGLE_APPLICATION_CREDENTIALS);
        if (!fs.existsSync(keyPath)) {
          throw new Error(`GCS key file not found at: ${keyPath}`);
        }
        this.storage = new Storage({
          keyFilename: keyPath,
          projectId: process.env.GCS_PROJECT_ID || 'artful-talon-269415',
        });
        this.logger.log('GCS initialized with GOOGLE_APPLICATION_CREDENTIALS');
      } else {
        this.storage = this.initializeFromKeyFile();
      }
      if (this.storage) {
        await this.testConnection();
        this.isInitialized = true;
        this.logger.log('GCS initialized successfully');
      } else {
        throw new Error('All GCS initialization methods failed');
      }
    } catch (error) {
      this.initializationError = error instanceof Error ? error : new Error(String(error));
      if (
        process.env.NODE_ENV === 'development' ||
        !this.initializationError.message.includes('No valid credentials found')
      ) {
        this.logger.error('GCS initialization failed:', this.initializationError.message);
      }
      throw this.initializationError;
    }
  }
  public async ensureInitialized(): Promise<void> {
    if (this.isInitialized && this.storage) {
      return;
    }
    if (this.initializationPromise) {
      return this.initializationPromise;
    }
    if (this.initializationError && !this.initializationPromise) {
      this.initializationError = null;
    }
    this.initializationPromise = this.initializeGCS();
    try {
      await this.initializationPromise;
    } finally {
      this.initializationPromise = null;
    }
  }
  public async getStorageSafe(): Promise<Storage> {
    await this.ensureInitialized();
    if (!this.storage) {
      throw new Error('GCS storage not available after initialization');
    }
    return this.storage;
  }
  private initializeFromKeyFile(): Storage {
    const possiblePaths = [
      'Service-account-key.json',
      'gcs-key.json',
      'src/config/gcs-key.json',
      'config/gcs-key.json',
      '../config/gcs-key.json',
      './gcs-key.json',
      './Service-account-key.json',
    ];
    for (const keyPath of possiblePaths) {
      const fullPath = path.resolve(process.cwd(), keyPath);
      if (fs.existsSync(fullPath)) {
        try {
          const storage = new Storage({
            keyFilename: fullPath,
            projectId: process.env.GCS_PROJECT_ID || 'artful-talon-269415',
          });
          this.logger.log(`GCS initialized with key file: ${fullPath}`);
          return storage;
        } catch (error) {
          this.logger.warn(`Failed to initialize with key file ${fullPath}:`, error.message);
          continue;
        }
      }
    }
    throw new Error('GCS initialization failed. No valid credentials found');
  }
  private async testConnection(): Promise<void> {
    if (!this.storage) {
      throw new Error('Storage instance not available for connection test');
    }
    try {
      const [buckets] = await this.storage.getBuckets({ maxResults: 1 });
      this.logger.log(`GCS connection successful. Found ${buckets.length} bucket(s)`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`GCS authentication failed: ${errorMessage}`);
    }
  }
  public getStorage(): Storage {
    if (!this.isInitialized || !this.storage) {
      throw new Error('GCS not initialized. Call ensureInitialized() first.');
    }
    return this.storage;
  }
  getBucket(bucketName: string): any {
    return this.getStorage().bucket(bucketName);
  }
  public async isConnected(): Promise<boolean> {
    try {
      if (!this.storage) return false;
      await this.storage.getBuckets({ maxResults: 1 });
      return true;
    } catch {
      return false;
    }
  }
  public getStatus() {
    return {
      isInitialized: this.isInitialized,
      error: this.initializationError?.message || null,
      hasStorage: !!this.storage,
      isInitializing: !!this.initializationPromise,
    };
  }
}
export default GCStorage;
