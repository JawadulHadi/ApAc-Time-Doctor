import fs from 'fs';
import path from 'path';
import { HttpStatus, Logger } from '@nestjs/common';

import GCStorage from '../../config/gcs.config';
import { FILE, SYSTEM_ERROR } from '../../types/constants/error-messages.constants';
import { Bucket } from '../../types/enums/doc.enums';
let gcsConfig: GCStorage | null = null;
const getGcsConfig = (): GCStorage => {
  if (!gcsConfig) {
    gcsConfig = new GCStorage();
  }
  return gcsConfig;
};
export const initializeGCS = async (): Promise<void> => {
  try {
    const config = getGcsConfig();
    await config.ensureInitialized();
    Logger.log(SYSTEM_ERROR.GCS_INITIALIZED);
  } catch (error) {
    Logger.error(SYSTEM_ERROR.GCS_FAILED);
    throw error;
  }
};
export const uploadFileToGcs = async (
  filepath: string,
  bucketName: Bucket = Bucket.APAC,
  makePublic: boolean = true,
  maxRetries: number = 3,
): Promise<string> => {
  try {
    const config = getGcsConfig();
    await config.ensureInitialized();
    if (!fs.existsSync(filepath)) {
      throw new Error(SYSTEM_ERROR.FILE_SYSTEM_ERROR);
    }
    const storage = config.getStorage();
    const bucket = storage.bucket(bucketName);
    const filename = path.basename(filepath);
    Logger.log(`Uploading ${filename} to GCS bucket: ${bucketName}`);
    let lastError: Error;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const [file] = await bucket.upload(filepath, {
          destination: filename,
          metadata: {
            cacheControl: 'public, max-age=31536000',
          },
        });
        Logger.log(FILE.UPLOAD_SUCCEED);
        if (makePublic) {
          await file.makePublic();
          Logger.log(FILE.PUBLIC);
        }
        await new Promise(resolve => setTimeout(resolve, 100));
        const [signedUrl] = await file.getSignedUrl({
          version: 'v4',
          action: 'read',
          expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        });
        return signedUrl;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        Logger.warn(FILE.UPLOAD_FAILED, error.message);
        if (attempt < maxRetries) {
          const delay = Math.pow(2, attempt - 1) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
      }
    }
    throw lastError || new Error(SYSTEM_ERROR.FILE_SYSTEM_ERROR);
  } catch (error) {
    Logger.error(FILE.UPLOAD_FAILED, error.message);
    throw new Error(`${FILE.UPLOAD_FAILED}: ${error.message}`);
  }
};
export const downloadFileFromGcs = async (
  fileName: string,
  bucketName: Bucket = Bucket.APAC,
  localPath?: string,
): Promise<string> => {
  try {
    const config = getGcsConfig();
    await config.ensureInitialized();
    const storage = config.getStorage();
    const bucket = storage.bucket(bucketName);
    const destination = localPath || path.join('./tmp', fileName);
    const destinationDir = path.dirname(destination);
    if (!fs.existsSync(destinationDir)) {
      fs.mkdirSync(destinationDir, { recursive: true });
    }
    Logger.log(`Downloading ${fileName} from GCS`);
    await bucket.file(fileName).download({
      destination: destination,
    });
    Logger.log(FILE.DOWNLOAD_SUCCESS);
    return destination;
  } catch (error) {
    Logger.error(FILE.DOWNLOAD_FAILED, error.message);
    throw new Error(FILE.DOWNLOAD_FAILED);
  }
};
export const streamFileFromGcs = (
  fileName: string,
  bucketName: Bucket = Bucket.APAC,
): NodeJS.ReadableStream => {
  try {
    const config = getGcsConfig();
    const storage = config.getStorage();
    const file = storage.bucket(bucketName).file(fileName);
    return file.createReadStream();
  } catch (error) {
    Logger.error(FILE.FILE_PROCESSING_TIMEOUT, error.message);
    throw error;
  }
};
export const deleteFileFromGcs = async (
  fileName: string,
  bucketName: Bucket = Bucket.APAC,
): Promise<void> => {
  try {
    const config = getGcsConfig();
    await config.ensureInitialized();
    const storage = config.getStorage();
    Logger.log(`Deleting ${fileName} from GCS`);
    await storage.bucket(bucketName).file(fileName).delete();
    Logger.log(FILE.DELETED);
  } catch (error: any) {
    if (error.code === 404 || error.code === HttpStatus.NOT_FOUND) {
      Logger.log(FILE.NOT_FOUND);
      return;
    }
    Logger.error(FILE.FAILED_TO_DELETE, error.message);
    throw new Error(FILE.FAILED_TO_DELETE);
  }
};
export const fileExistsInGcs = async (
  fileName: string,
  bucketName: Bucket = Bucket.APAC,
): Promise<boolean> => {
  try {
    const config = getGcsConfig();
    await config.ensureInitialized();
    const storage = config.getStorage();
    const [exists] = await storage.bucket(bucketName).file(fileName).exists();
    return exists;
  } catch (error) {
    Logger.error(FILE.CORRUPTED, error.message);
    return false;
  }
};
export const testGcsConnection = async (): Promise<boolean> => {
  try {
    const config = getGcsConfig();
    await config.ensureInitialized();
    return await config.isConnected();
  } catch (error) {
    Logger.error('GCS connection test failed', error.message);
    return false;
  }
};
export const generateSignedUrl = async (
  fileName: string,
  bucketName: Bucket = Bucket.APAC,
  expiresInMinutes: number = 60,
): Promise<string> => {
  try {
    const config = getGcsConfig();
    await config.ensureInitialized();
    const storage = config.getStorage();
    const bucket = storage.bucket(bucketName);
    const file = bucket.file(fileName);
    const [exists] = await file.exists();
    if (!exists) {
      Logger.warn(`File ${fileName} does not exist in bucket ${bucketName}`);
      return '';
    }
    const [url] = await file.getSignedUrl({
      version: 'v4',
      action: 'read',
      expires: Date.now() + expiresInMinutes * 60 * 1000,
    });
    return url;
  } catch (error) {
    Logger.error(FILE.FILE_PROCESSING_TIMEOUT, error.message);
    return '';
  }
};
export const ensureGcsInitialized = async (): Promise<void> => {
  try {
    const config = getGcsConfig();
    await config.ensureInitialized();
    Logger.log(SYSTEM_ERROR.GCS_INITIALIZED);
  } catch (error) {
    Logger.error(SYSTEM_ERROR.GCS_FAILED, error.message);
    throw new Error(SYSTEM_ERROR.GCS_FAILED);
  }
};
if (process.env.NODE_ENV !== 'test') {
  (async () => {
    try {
      await ensureGcsInitialized();
    } catch (error: any) {
      if (
        !error.message.includes('No valid credentials found') ||
        process.env.NODE_ENV === 'development'
      ) {
        Logger.warn(`GCS initialization issue: ${error.message}`);
      }
    }
  })();
}
