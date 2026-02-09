/**
 * Storage and media constants
 * Contains URLs and paths for file storage, images, and media assets
 */

export const ImageUrl =
  'https://storage.googleapis.com/iagility-apac/document_68d5280ea98d09600d6e4ef5_444_1766582858014.png';

export const IGoogleUrl = 'https://storage.googleapis.com/iagility-apac/profile_pic_';

export const UPLOAD_CONSTANTS = {
  DEFAULT_IMAGE: ImageUrl,
  GOOGLE_STORAGE_BASE: IGoogleUrl,
  UPLOAD_DIR: './uploads',
} as const;
