# Recruitment Module

## Module Overview

The Recruitment module manages the complete candidate lifecycle from initial application to onboarding within the APAC Management System. It provides comprehensive candidate tracking, document management, and automated workflow for moving candidates through various stages.

### Purpose and Responsibility

- **Candidate Management**: Create, view, filter, and manage candidate records
- **Document Collection**: Secure form generation for collecting personal information and documents
- **Workflow Management**: Track candidates through different hiring stages
- **Onboarding Integration**: Seamless transition from candidate to employee
- **Public Forms**: Token-based secure forms for candidate submissions
- **Recruitment Analytics**: Track recruitment pipeline performance

### Key Features

- Permission-based access control for HR operations
- Multi-stage candidate workflow management
- Secure document upload and storage
- Token-based public form access
- Integration with user management system
- Comprehensive candidate filtering and search
- Automated email notifications
- Form expiration and security controls
- Recruitment pipeline tracking

## Available Endpoints

### Protected Endpoints (Require JWT + CAN_MANAGE_CANDIDATES Permission)

| Method   | Endpoint                         | Description                          |
| -------- | -------------------------------- | ------------------------------------ |
| `POST`   | `/recruitment/candidate`         | Create new candidate                 |
| `GET`    | `/recruitment/candidate`         | Get all candidates with filters      |
| `POST`   | `/recruitment/clarification/:id` | Request clarification from candidate |
| `POST`   | `/recruitment/personal-info/:id` | Request personal info + documents    |
| `POST`   | `/recruitment/complete-info/:id` | Complete personal info collection    |
| `POST`   | `/recruitment/onboard/:id`       | Move candidate to onboarding         |
| `DELETE` | `/recruitment/archive/:id`       | Archive candidate                    |

### Public Endpoints (No Authentication Required)

| Method | Endpoint                                   | Description                        |
| ------ | ------------------------------------------ | ---------------------------------- |
| `GET`  | `/recruitment-public/candidate`            | Get candidate by filter/token      |
| `POST` | `/recruitment-public/clarification/:token` | Submit clarification form          |
| `POST` | `/recruitment-public/personal/:token`      | Submit personal info and documents |

## DTOs and Data Models

### AddCandidateDto

Used for creating new candidates.

**Purpose**: Create candidate records with job details and work timings.

```typescript
{
  email: string; // Required: Valid email address (unique)
  firstName: string; // Required: First name (2-50 chars)
  lastName: string; // Required: Last name (2-50 chars)
  jobTitle: string; // Required: Job title (2-100 chars)
  department: ObjectId; // Required: Department ID
  timingStart: string; // Required: Work start time (HH:MM AM/PM)
  timingEnd: string; // Required: Work end time (HH:MM AM/PM)
}
```

**Key Validation Rules**:

- Email must be unique and valid format
- Names must be 2-50 characters
- Job title must be 2-100 characters
- Department must be valid MongoDB ObjectId
- Timings must follow HH:MM AM/PM format (e.g., "09:00 AM")

### CandidateFilterDto

Used for filtering and searching candidates.

**Purpose**: Enable flexible candidate search and filtering.

```typescript
{
  id?: string;                // Filter by candidate ID
  email?: string;             // Filter by email address
  jobTitle?: string;          // Filter by job title
  hiringStage?: HiringStage;  // Filter by hiring stage
  department?: string;        // Filter by department name
  createdBy?: string;         // Filter by creator
  token?: string;             // Access token for public access
}
```

### ClarificationFormDto

Used for candidate clarification submissions.

**Purpose**: Collect detailed candidate information and commitments.

```typescript
{
  firstName: string;                    // Required: First name
  lastName: string;                     // Required: Last name
  cnicNo: string;                       // Required: CNIC (format: 12345-1234567-1)
  longTermCommitment: string;           // Required: Long-term commitment explanation
  oneYearCommitment: string;            // Required: One year commitment agreement
  referenceCheckAllowed: string;        // Required: Reference check permission
  currentGrossSalary: string;           // Required: Current salary
  expectedGrossSalary: string;          // Required: Expected salary
  noticePeriod: number;                 // Required: Notice period in days (0-365)
  officeTimingComfort: string;          // Required: Comfort with office timings
  signature: string;                    // Required: Digital signature
  currentOrganization?: OrganizationDto; // Optional: Current employer details
  previousOrganization?: OrganizationDto; // Optional: Previous employer details
  monthlyCommissions?: string;          // Optional: Monthly commissions
  perksAndBenefits?: string;           // Optional: Perks and benefits
  healthInsurance?: string;            // Optional: Health insurance details
  lifeInsurance?: string;              // Optional: Life insurance details
  eobi?: string;                       // Optional: EOBI details
  increments?: string;                 // Optional: Increment details
}
```

### PersonalInfoWithDocumentsDto

Used for personal information and document submissions.

**Purpose**: Collect comprehensive personal details and supporting documents.

```typescript
{
  gender?: Gender;                      // Optional: Gender (MALE, FEMALE, OTHER)
  maritalStatus?: MaritalStatus;        // Optional: Marital status
  mobile?: string;                      // Optional: Mobile number (10-20 chars)
  telephone?: string;                   // Optional: Telephone number
  address?: string;                     // Optional: Address (max 300 chars)
  nationality?: string;                 // Optional: Nationality
  dateOfBirth?: string;                 // Optional: Date of birth (YYYY-MM-DD)
  bloodGroup?: BloodGroup;              // Optional: Blood group
  fatherName?: string;                  // Optional: Father's name
  motherName?: string;                  // Optional: Mother's name
  emergencyContact?: EmergencyContactDto; // Optional: Emergency contact
  nextOfKin?: NextOfKinDto;             // Optional: Next of kin
  totalExperience?: TotalExperienceDto; // Optional: Total experience
  education?: EducationEntryDto[];      // Optional: Education history
  employmentHistory?: EmploymentEntryDto[]; // Optional: Employment history
}
```

### RequestFormDto

Response for form generation requests.

**Purpose**: Provide secure form access details to candidates.

```typescript
{
  id: string; // Candidate ID
  fullName: string; // Candidate full name
  email: string; // Candidate email
  jobTitle: string; // Job title
  timingStart: string; // Work start time
  timingEnd: string; // Work end time
  updatedAt: Date; // Last updated timestamp
  copyLink: string; // Form URL for candidate
  hiringStage: string; // Current hiring stage
  token: string; // Access token
}
```

## Key Workflows

### Candidate Addition Process

1. **Permission Check**: Verify `CAN_MANAGE_CANDIDATES` permission
2. **Email Validation**: Check for duplicate email addresses
3. **Department Validation**: Verify department exists
4. **Candidate Creation**: Create candidate record with initial hiring stage
5. **Response**: Return created candidate details

### Clarification Request Workflow

1. **Permission Check**: Verify `CAN_MANAGE_CANDIDATES` permission
2. **Candidate Lookup**: Find candidate by ID
3. **Token Generation**: Create unique secure token for form access
4. **Form URL Creation**: Generate clarification form URL with token
5. **Email Dispatch**: Send form link to candidate
6. **Hiring Stage Update**: Update candidate to appropriate stage
7. **Response**: Return form details with access link

### Document Collection Process

1. **Permission Check**: Verify `CAN_MANAGE_CANDIDATES` permission
2. **Candidate Lookup**: Find candidate by ID
3. **Token Generation**: Create secure token for document submission
4. **Form URL Creation**: Generate personal info and document upload form
5. **Email Notification**: Send form link with instructions
6. **Hiring Stage Update**: Update candidate stage appropriately
7. **Response**: Return form details with access link

### Onboarding Transition

1. **Permission Check**: Verify `CAN_MANAGE_CANDIDATES` permission
2. **Candidate Validation**: Ensure candidate is ready for onboarding
3. **User Account Creation**: Create employee user account via User module
4. **Profile Setup**: Initialize user profile with candidate data
5. **Hiring Stage Update**: Mark candidate as ONBOARDED
6. **Welcome Email**: Send onboarding instructions
7. **Response**: Return created user and auth user details

### Candidate Archiving

1. **Permission Check**: Verify `CAN_MANAGE_CANDIDATES` permission
2. **Onboarding Check**: Prevent archiving of onboarded candidates
3. **Soft Delete**: Mark candidate as archived (data preserved)
4. **Data Retention**: Maintain candidate data for records
5. **Response**: Confirm successful archival

### Public Form Submission Workflows

#### Clarification Form Submission

1. **Token Validation**: Verify token is valid and not expired
2. **Data Validation**: Validate all required clarification fields
3. **Form Processing**: Save clarification data to candidate record
4. **Stage Update**: Update hiring stage based on submission
5. **Response**: Confirm successful submission

#### Personal Info and Document Submission

1. **Token Validation**: Verify token is valid and not expired
2. **File Processing**: Handle multiple document uploads (CNIC, resume, etc.)
3. **Data Validation**: Validate personal information if provided
4. **Storage**: Save documents and personal info to candidate record
5. **Stage Update**: Update hiring stage appropriately
6. **Response**: Confirm successful submission

## Integration Points

### User Module

- User account creation during onboarding process
- Permission validation for HR operations
- Employee profile initialization
- Email validation
- Account activation

### Department Module

- Department validation during candidate creation
- Department information retrieval for candidate records

### Profile Module

- Profile creation for onboarded candidates
- Document storage
- Personal information management

### Email Service

- Application confirmation emails
- Form request notifications
- Status update notifications
- Onboarding instructions

### File Storage

- Document upload handling (CNIC, resume, certificates, etc.)
- File validation and size limits (50MB max per file)
- Secure file storage and retrieval
- Resume storage
- Secure document access

### Common Module

- Enum definitions (HiringStage, Gender, MaritalStatus, BloodGroup)
- Response transformation utilities
- Permission decorators and guards

## Examples

### Sample API Calls

#### Create Candidate

```bash
curl -X POST http://localhost:3400/recruitment/candidate \
  -H "Authorization: Bearer <jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "lastName": "Doe",
    "email": "jane.doe@mailinator.com",
    "jobTitle": "Software Engineer",
    "department": "507f1f77bcf86cd799439011",
    "timingStart": "09:00 AM",
    "timingEnd": "06:00 PM"
  }'
```

#### Get Candidates with Filters

```bash
curl -X GET "http://localhost:3400/recruitment/candidate?hiringStage=NEW&jobTitle=Software Engineer" \
  -H "Authorization: Bearer <jwt-token>"
```

#### Request Clarification

```bash
curl -X POST http://localhost:3400/recruitment/clarification/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer <jwt-token>"
```

#### Request Personal Info with Documents

```bash
curl -X POST http://localhost:3400/recruitment/personal-info/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer <jwt-token>"
```

#### Move to Onboarding

```bash
curl -X POST http://localhost:3400/recruitment/onboard/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer <jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "lastName": "Doe",
    "email": "jane.doe@company.com",
    "mobile": "+1234567890"
  }'
```

#### Archive Candidate

```bash
curl -X DELETE http://localhost:3400/recruitment/archive/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer <jwt-token>"
```

#### Public Clarification Form Submission

```bash
curl -X POST http://localhost:3400/recruitment-public/clarification/abc123token \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Smith",
    "cnicNo": "12345-1234567-1",
    "longTermCommitment": "I am committed to long-term growth...",
    "oneYearCommitment": "I agree to one year commitment...",
    "referenceCheckAllowed": "Yes, references can be contacted",
    "currentGrossSalary": "50000",
    "expectedGrossSalary": "60000",
    "noticePeriod": 30,
    "officeTimingComfort": "Comfortable with evening shift",
    "signature": "John Smith"
  }'
```

#### Public Personal Info and Document Submission

```bash
curl -X POST http://localhost:3400/recruitment-public/personal/abc123token \
  -H "Content-Type: multipart/form-data" \
  -F 'personalInfo={"gender":"MALE","mobile":"+1234567890","address":"123 Main St"}' \
  -F 'cnic=@/path/to/cnic.pdf' \
  -F 'photograph=@/path/to/photo.jpg' \
  -F 'resume=@/path/to/resume.pdf'
```

### Common Use Cases

#### Scenario 1: New Application Processing

```typescript
// HR creates new candidate
const response = await fetch('/recruitment/candidate', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${hrToken}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    firstName: 'Alice',
    lastName: 'Johnson',
    email: 'alice.j@mailinator.com',
    jobTitle: 'DevOps Engineer',
    department: '507f1f77bcf86cd799439011',
    timingStart: '09:00 AM',
    timingEnd: '06:00 PM',
  }),
});

// Candidate created with initial hiring stage
```

#### Scenario 2: Document Collection

```typescript
// Request documents from candidate
const response = await fetch(`/recruitment/personal-info/${candidateId}`, {
  method: 'POST',
  headers: { Authorization: `Bearer ${hrToken}` },
});

const { data } = await response.json();
// Returns secure form URL for candidate
// Candidate receives email with form link
```

#### Scenario 3: Onboarding Approved Candidate

```typescript
// Move candidate to onboarding
const response = await fetch(`/recruitment/onboard/${candidateId}`, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${hrToken}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    firstName: 'Alice',
    lastName: 'Johnson',
    email: 'alice.johnson@apac-dev.agilebrains.com',
    mobile: '+1234567890',
  }),
});

// User account created, returns user and auth user details
```

## Configuration Requirements

### File Upload Limits

- Maximum file size: 50MB per file
- CNIC documents: Maximum 2 files
- Photograph: Maximum 1 file
- Resume: Maximum 1 file
- Educational documents: Maximum 5 files
- Experience letters: Maximum 2 files
- Salary slips: Maximum 3 files

### Environment Variables

```env
RECRUITMENT_FORM_EXPIRY_DAYS=7
EMAIL_NOTIFICATIONS_ENABLED=true
PUBLIC_SUBMISSIONS_ENABLED=true
```

### Hiring Stage Values

Based on `HiringStage` enum:

- `NEW`: New application received
- `SCREENING`: Under initial screening
- `INTERVIEW`: Interview scheduled/in progress
- `TECHNICAL_ASSESSMENT`: Technical evaluation
- `CLARIFICATION_REQUESTED`: Awaiting clarification
- `DOCUMENTS_REQUESTED`: Awaiting documents
- `BACKGROUND_CHECK`: Background verification
- `OFFER_EXTENDED`: Offer made to candidate
- `OFFER_ACCEPTED`: Offer accepted by candidate
- `ONBOARDED`: Successfully onboarded
- `REJECTED`: Application rejected
- `ARCHIVED`: Archived candidate

### Supported Enums

- **Gender**: `MALE`, `FEMALE`, `OTHER`
- **MaritalStatus**: `SINGLE`, `MARRIED`, `DIVORCED`, `WIDOWED`
- **BloodGroup**: `A_POSITIVE`, `A_NEGATIVE`, `B_POSITIVE`, `B_NEGATIVE`, `AB_POSITIVE`, `AB_NEGATIVE`, `O_POSITIVE`, `O_NEGATIVE`

### Position Types

Configurable based on organization needs:

- Software Engineer
- DevOps Engineer
- QA Engineer
- Product Manager
- Full Stack Developer
- etc.

## Error Handling

### Common Error Responses

- `400`: Validation errors, duplicate email, invalid data, cannot onboard at current stage
- `401`: Unauthorized, invalid JWT token
- `403`: Insufficient permissions (missing `CAN_MANAGE_CANDIDATES`)
- `404`: Candidate not found, department not found, invalid token
- `409`: Conflict (e.g., already onboarded)
- `500`: Internal server error

### Error Response Format

```json
{
  "success": false,
  "message": "Candidate with this email already exists",
  "statusCode": 400
}
```

## Security Considerations

### Access Control

- All protected endpoints require valid JWT authentication
- `CAN_MANAGE_CANDIDATES` permission required for all HR operations
- Token-based access for public forms with expiration
- File upload validation and size limits
- Permission-based access to recruitment data
- Candidate data privacy

### Data Protection

- Secure token generation for public form access
- File upload validation and virus scanning
- Personal data encryption in transit and at rest
- GDPR compliance for candidate data handling
- Secure document storage
- Form expiration enforcement
- Access logging

### Token Security

- Unique tokens generated for each form request
- Tokens expire after specified time period
- One-time use tokens for sensitive operations
- Secure token validation on public endpoints

### Privacy Compliance

- GDPR compliance
- Data retention policies
- Right to be forgotten
- Consent management

## Performance Notes

### Optimization Tips

- Cache candidate lists
- Index on email and hiring stage
- Implement pagination for large datasets
- Optimize search queries

### Caching Strategy

- Candidate list caching (5-minute TTL)
- Hiring stage filter caching
- Job title list caching

## Troubleshooting

### Common Issues

1. **Candidate Addition Fails**: Check email uniqueness, department validity, permissions
2. **Form Not Sent**: Verify email service configuration
3. **Onboarding Fails**: Check user module integration
4. **Status Not Updating**: Verify workflow transitions
5. **File Upload Fails**: Check file size limits and format validation

### Debug Steps

1. Check application logs for errors
2. Verify email service connectivity
3. Test with valid candidate data
4. Check user module integration
5. Validate form generation
6. Verify token expiration settings

## API Documentation

Complete API documentation is available at `/api-docs` when the server is running. The documentation includes:

- Interactive endpoint testing
- Request/response schemas
- Authentication requirements
- Example requests and responses
- Error code documentation

## Dependencies

- **NestJS**: Framework and decorators
- **Mongoose**: MongoDB object modeling
- **class-validator**: DTO validation
- **class-transformer**: Data transformation
- **Multer**: File upload handling
- **Swagger**: API documentation
