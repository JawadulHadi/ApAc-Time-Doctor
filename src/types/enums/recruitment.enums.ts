export enum HiringStage {
  ADDED = 'added',
  CLARIFICATION_REQUESTED = 'requested_-_clarification',
  CLARIFICATION_SUBMITTED = 'received_-_clarification',
  PERSONAL_INFO_AND_DOCUMENTS_REQUESTED = 'requested_-_personal_information',
  PERSONAL_INFO_AND_DOCUMENTS_SUBMITTED = 'received_-_personal_information',
  ONBOARDED = 'onboarded',
  ARCHIVED = 'archived',
  INTERVIEW_SCHEDULED = 'INTERVIEW_SCHEDULED',
  INTERVIEW_COMPLETED = 'INTERVIEW_COMPLETED',
  OFFER_EXTENDED = 'OFFER_EXTENDED',
}
export enum OnboardingStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}
export enum CandidateDocumentCategory {
  CNIC_FRONT = 'cnic_front',
  CNIC_BACK = 'cnic_back',
  PASSPORT_PHOTO = 'passport_photo',
  CV_RESUME = 'cv_resume',
  EDUCATIONAL_TRANSCRIPT = 'educational_transcript',
  EDUCATIONAL_CERTIFICATE = 'educational_certificate',
  EXPERIENCE_LETTER = 'experience_letter',
  SALARY_SLIP = 'salary_slip',
  OFFER_LETTER = 'offer_letter',
  RELIEVING_LETTER = 'relieving_letter',
}
export enum TokenType {
  CLARIFICATION_FORM = 'clarification_form_required',
  PERSONAL_INFO_AND_DOCUMENTS = 'personal_info_documents_required',
}
