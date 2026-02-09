# **Profile Module Guide**

## Module Overview

The Profile Module manages comprehensive user profile information including personal details, professional information, documents, and media files within the APAC Management System. It provides secure document handling with Google Cloud Storage integration.

### Core Purpose

- User profile management and updates
- Document upload and storage (ID proof, resume, etc.)
- Profile picture management
- Skills and achievements tracking
- Professional information management
- Personal document organization

### Key Capabilities

- Complete profile CRUD operations
- Profile picture upload/removal
- ID proof document management
- Resume upload and storage
- Additional document management
- Skills and achievements tracking
- Mission statement/bio management

## API Endpoints

### Authentication Required

All endpoints require JWT authentication.

| Method   | Endpoint                          | Description                   | Required Permission |
| -------- | --------------------------------- | ----------------------------- | ------------------- |
| `GET`    | `/profile/my-profile`             | Get current user's profile    | Authenticated       |
| `PUT`    | `/profile/my-profile`             | Update current user's profile | Authenticated       |
| `POST`   | `/profile/upload-profile-picture` | Upload profile picture        | Authenticated       |
| `DELETE` | `/profile/remove-profile-picture` | Remove profile picture        | Authenticated       |
| `GET`    | `/profile/profile-picture`        | Get profile picture           | Authenticated       |
| `POST`   | `/profile/upload-id-proof`        | Upload ID proof document      | Authenticated       |
| `DELETE` | `/profile/remove-id-proof`        | Remove ID proof document      | Authenticated       |
| `GET`    | `/profile/id-proof`               | Get ID proof document         | Authenticated       |
| `POST`   | `/profile/upload-resume`          | Upload resume document        | Authenticated       |
| `DELETE` | `/profile/remove-resume`          | Remove resume document        | Authenticated       |
| `GET`    | `/profile/resume`                 | Get resume document           | Authenticated       |
| `POST`   | `/profile/add-document`           | Add additional document       | Authenticated       |
| `DELETE` | `/profile/remove-document/:id`    | Remove specific document      | Authenticated       |
| `GET`    | `/profile/documents`              | Get all user documents        | Authenticated       |
| `GET`    | `/profile/:userId`                | Get profile by user ID        | Authenticated       |
| `POST`   | `/profile/mission-statement`      | Submit mission statement      | Authenticated       |

| Method | Endpoint                             | Description                | Required Permission |
| ------ | ------------------------------------ | -------------------------- | ------------------- |
| `PUT`  | `/profile/mission-statement/:userId` | Review mission statement   | Team Lead, HR, L&D  |
| `GET`  | `/profile/mission-statement/:userId` | Get mission statement      | Authenticated       |
| `GET`  | `/profile/mission-statements`        | Get all mission statements | Team Lead, HR, L&D  |

## Data Transfer Objects (DTOs)

### UpdateProfileDto

Used for profile update operations.

```typescript
{
  firstName?: string;
  lastName?: string;
  status?: UserStatus;
  dateOfBirth?: Date;
  designation?: string;
  employeeId?: string;
  contactNumber?: string;
  emergencyContact?: string;
  currentAddress?: string;
  permanentAddress?: string;
  dateOfJoining?: Date;
  leftUs?: Date;
  rejoinUs?: Date;
  skills?: string[];
  achievements?: string[];
  missionStatement?: string;
}
```

**Validation Rules:**

- All fields are optional
- `status`: Must be valid UserStatus enum value
- `dateOfBirth`, `dateOfJoining`, `leftUs`, `rejoinUs`: Valid Date objects
- `skills`, `achievements`: Arrays of strings
- `missionStatement`: String (bio/about me)

## Key Workflows

### Profile Update Process

1. **Authentication**: Verify JWT token
2. **Profile Lookup**: Find existing profile by user ID
3. **Validation**: Validate update data
4. **Update**: Apply changes to profile
5. **Response**: Return updated profile

### Profile Picture Upload

1. **File Validation**: Check file size (max 10MB) and type (jpeg, jpg, png, webp)
2. **Authentication**: Verify user session
3. **GCS Upload**: Store image in Google Cloud Storage
4. **Profile Update**: Update profile with image URL
5. **Old Image Cleanup**: Remove previous profile picture if exists
6. **Response**: Return updated profile

### Document Upload Workflow

1. **File Validation**: Verify file size and type
2. **Authentication**: Verify user identity
3. **GCS Storage**: Upload to appropriate bucket
4. **Metadata Storage**: Save document reference in profile
5. **Response**: Return updated profile with document info

### Document Removal

1. **Authentication**: Verify user owns the profile
2. **GCS Deletion**: Remove file from cloud storage
3. **Profile Update**: Remove document reference
4. **Response**: Confirm deletion

## Integration Points

### User Module

- User account association
- User authentication
- Permission validation
- Account status synchronization

### Google Cloud Storage (GCS)

- Profile picture storage
- Document storage (ID proof, resume, etc.)
- File retrieval and deletion
- Secure URL generation

### Common Services

- Email notifications
- Logging and monitoring
- Caching services
- File validation utilities

## Usage Examples

### Get My Profile

```bash
curl -X GET http://localhost:3400/profile/my-profile \
  -H "Authorization: Bearer <jwt-token>"
```

### Update My Profile

```bash
curl -X PUT http://localhost:3400/profile/my-profile \
  -H "Authorization: Bearer <jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "designation": "Senior Software Engineer",
    "skills": ["JavaScript", "Node", "MongoDB"],
    "missionStatement": "Building scalable solutions"
  }'
```

### Upload Profile Picture

```bash
curl -X POST http://localhost:3400/profile/upload-profile-picture \
  -H "Authorization: Bearer <jwt-token>" \
  -F "file=@profile.jpg"
```

### Upload ID Proof

```bash
curl -X POST http://localhost:3400/profile/upload-id-proof \
  -H "Authorization: Bearer <jwt-token>" \
  -F "file=@id_card.pdf"
```

### Upload Resume

```bash
curl -X POST http://localhost:3400/profile/upload-resume \
  -H "Authorization: Bearer <jwt-token>" \
  -F "file=@resume.pdf"
```

### Remove Profile Picture

```bash
curl -X DELETE http://localhost:3400/profile/remove-profile-picture \
  -H "Authorization: Bearer <jwt-token>"
```

### Get All Documents

```bash
curl -X GET http://localhost:3400/profile/documents \
  -H "Authorization: Bearer <jwt-token>"
```

## Common Scenarios

### Scenario 1: Complete Profile Setup

```typescript
await fetch('/profile/my-profile', {
  method: 'PUT',
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    designation: 'Full Stack Developer',
    skills: ['React', 'Node', 'TypeScript'],
    achievements: ['AWS Certified', 'Published Author'],
    missionStatement: 'Creating impactful software solutions',
  }),
});

const formData = new FormData();
formData.append('file', profilePicFile);
await fetch('/profile/upload-profile-picture', {
  method: 'POST',
  headers: { Authorization: `Bearer ${token}` },
  body: formData,
});
```

### Scenario 2: Document Management

```typescript
const idProofForm = new FormData();
idProofForm.append('file', idProofFile);
await fetch('/profile/upload-id-proof', {
  method: 'POST',
  headers: { Authorization: `Bearer ${token}` },
  body: idProofForm,
});

const resumeForm = new FormData();
resumeForm.append('file', resumeFile);
await fetch('/profile/upload-resume', {
  method: 'POST',
  headers: { Authorization: `Bearer ${token}` },
  body: resumeForm,
});
```

### Scenario 3: Profile Viewing

```typescript
const response = await fetch('/profile/my-profile', {
  headers: { Authorization: `Bearer ${token}` },
});

const { data } = await response.json();
const { profile } = data;
```

## Configuration Requirements

### Environment Variables

```env
GCS_BUCKET_NAME=your-gcs-bucket-name
GOOGLE_APPLICATION_CREDENTIALS=./path/to/service-account.json
MAX_FILE_SIZE=10485760  # 10MB in bytes
```

### File Upload Limits

- **Profile Picture**: Max 10MB, formats: jpeg, jpg, png, webp
- **ID Proof**: Max 10MB, formats: pdf, jpeg, jpg, png
- **Resume**: Max 10MB, formats: pdf, doc, docx
- **Additional Documents**: Max 10MB, formats: pdf, jpeg, jpg, png, doc, docx

### Google Cloud Storage Setup

1. Create GCS bucket for profile storage
2. Generate service account credentials
3. Set appropriate bucket permissions
4. Configure CORS for web access

## Error Handling

### Common Error Responses

- `400`: Invalid file format, size exceeded, validation errors
- `401`: Missing or invalid JWT token
- `403`: Insufficient permissions
- `404`: Profile not found, document not found
- `413`: File size too large
- `500`: Internal server error, GCS issues

### Error Response Format

```json
{
  "success": false,
  "message": "File size too large. Maximum allowed file size is 10MB.",
  "statusCode": 413
}
```

## Security Considerations

### Access Control

- Users can only access their own profiles
- Document ownership validation
- Secure file URL generation
- Permission-based access

### File Validation

- File type restrictions enforced
- Size limit enforcement
- Malicious file detection
- Secure file naming

### Data Protection

- Encrypted storage in GCS
- Secure transmission (HTTPS)
- Personal data privacy
- Document access logging

## Performance Notes

### Optimization Tips

- Use streaming for large file uploads
- Implement client-side file validation
- Cache profile data
- Monitor GCS bandwidth usage

### Caching Strategy

- Profile data caching (5-minute TTL)
- Document metadata caching
- GCS URL caching with expiration
- Skills and achievements caching

## Troubleshooting

### Common Issues

1. **Upload Fails**: Check file size, format, and permissions
2. **GCS Errors**: Verify credentials and bucket configuration
3. **Profile Not Found**: Ensure profile exists for user
4. **Document Not Accessible**: Check GCS file existence and permissions

### Debug Steps

1. Check application logs for detailed error messages
2. Verify GCS bucket accessibility
3. Test with smaller files to isolate size issues
4. Validate JWT token and user session
5. Check file format compatibility
   \*\*
