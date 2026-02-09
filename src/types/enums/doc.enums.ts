export enum fileType {
  PDF = 'application/pdf',
  DOCX = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  PNG = 'image/png',
  JPEG = 'image/jpeg',
  JPG = 'image/jpg',
}
export enum fileCategory {
  PUBLIC = 'Public',
  NON_PUBLIC = 'Non-Public',
  CONTRACT = 'Contract',
  OTHER = 'Other',
}
export class FileValidator {
  static readonly allowedMime: string[] = [];
}
export enum maxFileSize {
  maxFile = 10 * 1024 * 1024,
}
export const isValidFileType = (mimeType: string): boolean => {
  return Object.values(fileType).includes(mimeType as fileType);
};
export enum DocumentCategory {
  CERTIFICATION = 'certification',
  DEGREE = 'degree',
  RESUME = 'resume',
  ID_PROOF = 'id_proof',
  PERSONAL = 'personal',
  OTHER = 'other',
  PROFILE_PICTURE = 'profile_picture',
}
export enum Bucket {
  APAC = 'iagility-apac',
}
export enum apacDepartment {
  SuperAdmin = 'APAC Systems Support',
  Admin = 'Admin Operations',
  HR = 'HR Operations',
  IT = 'IT System Department',
  LD = 'Learning and Development Operations',
}
