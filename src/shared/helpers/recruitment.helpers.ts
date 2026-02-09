import { Types } from 'mongoose';

import {
  arrayFields,
  nestedFields,
  simpleFields,
} from '../../types/constants/recruitment.constants';
import {
  IBaseUrl,
  IClarificationTag,
  IPersonalInfoTag,
} from '../../types/constants/url-tags.constants';
import { CandidateDocumentCategory } from '../../types/enums/recruitment.enums';
import { PersonalInfoWithDocumentsDto } from '@/modules/recruitment/dto/recruitment.dto';
export class RecruitmentHelpers {
  private static readonly isDifferent = (oldVal: any, newVal: any): boolean => {
    if (newVal === undefined || newVal === null) return false;
    if (typeof newVal === 'object' && !Array.isArray(newVal)) {
      return JSON.stringify(oldVal) !== JSON.stringify(newVal);
    }
    if (Array.isArray(newVal)) {
      return JSON.stringify(oldVal) !== JSON.stringify(newVal);
    }
    return oldVal !== newVal;
  };
  static generateClarificationUrl(token: string): string {
    return `${IBaseUrl}${IClarificationTag}/${token}`;
  }
  static generatePersonalInfoUrl(token: string): string {
    return `${IBaseUrl}${IPersonalInfoTag}/${token}`;
  }
  static extractUserIdsFromData(
    data: any[] | any,
    idFields: string[] = ['createdBy', 'updatedBy', 'user'],
  ): Set<string> {
    const userIds = new Set<string>();
    if (!data) {
      return userIds;
    }
    const processObject = (obj: any) => {
      if (!obj || typeof obj !== 'object') return;
      idFields.forEach(field => {
        if (obj[field] && Types.ObjectId.isValid(obj[field])) {
          userIds.add(obj[field].toString());
        }
      });
      if (obj.user?._id && Types.ObjectId.isValid(obj.user._id)) {
        userIds.add(obj.user._id.toString());
      }
      if (obj.remarks && Array.isArray(obj.remarks)) {
        obj.remarks.forEach((remark: any) => {
          if (remark.by && Types.ObjectId.isValid(remark.by)) {
            userIds.add(remark.by.toString());
          }
        });
      }
      Object.values(obj).forEach(value => {
        if (typeof value === 'object' && value !== null) {
          processObject(value);
        }
      });
    };
    if (Array.isArray(data)) {
      data.forEach(item => processObject(item));
    } else {
      processObject(data);
    }
    return userIds;
  }
  static detectDocumentCategory(
    filename: string,
    categoryField?: string,
  ): CandidateDocumentCategory {
    if (categoryField) {
      const categoryMap: Record<string, CandidateDocumentCategory> = {
        cnic: CandidateDocumentCategory.CNIC_FRONT,
        photograph: CandidateDocumentCategory.PASSPORT_PHOTO,
        resume: CandidateDocumentCategory.CV_RESUME,
        educationalDocs: CandidateDocumentCategory.EDUCATIONAL_CERTIFICATE,
        experienceLetter: CandidateDocumentCategory.EXPERIENCE_LETTER,
        salarySlip: CandidateDocumentCategory.SALARY_SLIP,
      };
      if (categoryMap[categoryField]) {
        return categoryMap[categoryField];
      }
    }
    const lower = filename.toLowerCase();
    if (lower.includes('cnic') && lower.includes('front'))
      return CandidateDocumentCategory.CNIC_FRONT;
    if (lower.includes('cnic') && lower.includes('back'))
      return CandidateDocumentCategory.CNIC_BACK;
    if (lower.includes('cnic')) return CandidateDocumentCategory.CNIC_FRONT;
    if (lower.includes('passport') || lower.includes('photo') || lower.includes('photograph'))
      return CandidateDocumentCategory.PASSPORT_PHOTO;
    if (lower.includes('cv') || lower.includes('resume'))
      return CandidateDocumentCategory.CV_RESUME;
    if (lower.includes('transcript')) return CandidateDocumentCategory.EDUCATIONAL_TRANSCRIPT;
    if (lower.includes('certificate') || lower.includes('degree') || lower.includes('education'))
      return CandidateDocumentCategory.EDUCATIONAL_CERTIFICATE;
    if (lower.includes('experience')) return CandidateDocumentCategory.EXPERIENCE_LETTER;
    if (lower.includes('salary') || lower.includes('slip'))
      return CandidateDocumentCategory.SALARY_SLIP;
    if (lower.includes('offer')) return CandidateDocumentCategory.OFFER_LETTER;
    if (lower.includes('relieving')) return CandidateDocumentCategory.RELIEVING_LETTER;
    return CandidateDocumentCategory.CV_RESUME;
  }
  static mergePersonalInfo(existing: any, newData: PersonalInfoWithDocumentsDto): any {
    const merged: any = { ...existing };
    let hasChanges = false;
    for (const field of simpleFields) {
      if (
        newData[field as keyof PersonalInfoWithDocumentsDto] !== undefined &&
        this.isDifferent(existing[field], newData[field as keyof PersonalInfoWithDocumentsDto])
      ) {
        merged[field] = newData[field as keyof PersonalInfoWithDocumentsDto];
        hasChanges = true;
      }
    }
    for (const field of nestedFields) {
      if (
        newData[field as keyof PersonalInfoWithDocumentsDto] !== undefined &&
        this.isDifferent(existing[field], newData[field as keyof PersonalInfoWithDocumentsDto])
      ) {
        merged[field] = newData[field as keyof PersonalInfoWithDocumentsDto];
        hasChanges = true;
      }
    }
    for (const field of arrayFields) {
      if (
        newData[field as keyof PersonalInfoWithDocumentsDto] !== undefined &&
        this.isDifferent(existing[field], newData[field as keyof PersonalInfoWithDocumentsDto])
      ) {
        merged[field] = newData[field as keyof PersonalInfoWithDocumentsDto];
        hasChanges = true;
      }
    }
    if (newData.submittedAt) {
      merged.submittedAt = newData.submittedAt;
      hasChanges = true;
    } else if (!existing.submittedAt) {
      merged.submittedAt = new Date();
      hasChanges = true;
    }
    return hasChanges ? merged : existing;
  }
  static mergeContactInfo(existing: any, newData: any): any {
    const merged = { ...existing };
    const contactFields = ['phone', 'email', 'address'];
    contactFields.forEach((field: string) => {
      if (newData[field] !== undefined && this.isDifferent(existing[field], newData[field])) {
        merged[field] = newData[field];
      }
    });
    return merged;
  }
  static mergeEducationInfo(existing: any, newData: any): any {
    const merged = { ...existing };
    const educationFields = ['degree', 'school', 'graduationYear'];
    educationFields.forEach((field: string) => {
      if (newData[field] !== undefined && this.isDifferent(existing[field], newData[field])) {
        merged[field] = newData[field];
      }
    });
    return merged;
  }
}
