# Document Module Guide

## Module Overview

The Document Module is responsible for managing file uploads, storage, and retrieval within the APAC Management System. It provides secure document handling with Google Cloud Storage integration, role-based access control, and comprehensive metadata management.

### Core Purpose

- Secure document upload and storage
- Document categorization and organization
- File access control and permissions
- Integration with Google Cloud Storage
- Document lifecycle management

### Key Capabilities

- Multi-format file upload (PDF, images, documents)
- Automatic file validation and size limits
- Document categorization (Public, Non-Public, Contract, Other)
- Base64 conversion for client-side usage
- Secure file deletion and cleanup

## API Endpoints

### Authentication Required

All endpoints require JWT authentication via `Authorization: Bearer <token>` header.

| Method   | Endpoint                                    | Description                   | Required Permission           |
| -------- | ------------------------------------------- | ----------------------------- | ----------------------------- |
| `POST`   | `/documents/upload`                         | Upload a new document         | `CAN_UPDATE_COMPANY_RESOURCE` |
| `GET`    | `/documents/:id`                            | Get document by ID            | `CAN_VIEW_COMPANY_RESOURCE`   |
| `PUT`    | `/documents/:id`                            | Update document metadata/file | `CAN_UPDATE_COMPANY_RESOURCE` |
| `GET`    | `/documents`                                | Get all accessible documents  | `CAN_VIEW_COMPANY_RESOURCE`   |
| `GET`    | `/documents/gcs-to-base64/:fileUrl/:bucket` | Convert GCS file to base64    | None (authenticated)          |
| `DELETE` | `/documents/:id`                            | Delete document permanently   | `CAN_UPDATE_COMPANY_RESOURCE` |

## Data Transfer Objects (DTOs)

### UploadDocumentDto

Used for document upload operations.

```typescript
{
  title: string;          // Required: Document title (1-255 chars)
  category?: string;      // Optional: PUBLIC | NON_PUBLIC | CONTRACT | OTHER
  isPublic?: boolean;     // Optional: Public accessibility flag
  createdAt?: Date;       // Optional: Creation timestamp
  updatedAt?: Date;       // Optional: Update timestamp
}
```

**Validation Rules:**

- `title`: Required, 1-255 characters, trimmed
- `category`: Must be valid fileCategory enum value
- `isPublic`: Boolean value
- Dates: Valid Date objects

### UpdateDocumentDto

Used for document update operations.

```typescript
{
  title?: string;         // Optional: Updated title (1-255 chars)
  category?: string;      // Optional: Updated category
  isPublic?: boolean;     // Optional: Updated public flag
  createdAt?: Date;       // Optional: Updated creation date
  updatedAt?: Date;       // Optional: Updated modification date
}
```

## Key Workflows

### Document Upload Process

1. **File Validation**: Check file size (max 10MB) and type
2. **Permission Check**: Verify `CAN_UPDATE_COMPANY_RESOURCE` permission
3. **Metadata Processing**: Validate and sanitize DTO data
4. **GCS Upload**: Store file in Google Cloud Storage bucket
5. **Database Record**: Create document record with metadata
6. **Response**: Return document details with GCS URL

### Document Categorization

Documents are categorized using the `fileCategory` enum:

- `PUBLIC`: Accessible to all authenticated users
- `NON_PUBLIC`: Restricted access based on permissions
- `CONTRACT`: Legal and contractual documents
- `OTHER`: Miscellaneous documents

### Document Deletion and Archiving

1. **Permission Verification**: Check update permissions
2. **Database Removal**: Delete document record
3. **GCS Cleanup**: Remove file from cloud storage
4. **Audit Trail**: Log deletion action

### File Size and Type Restrictions

- **Maximum Size**: 10MB per file
- **Allowed Types**: Configured in `FileValidator.allowedMime`
- **Validation**: Automatic validation during upload
- **Error Handling**: Clear error messages for violations

## Integration Points

### Google Cloud Storage (GCS)

- **Bucket**: Configured via `GCS_BUCKET_NAME` environment variable
- **Authentication**: Service account credentials
- **File Naming**: Automatic unique naming with timestamps
- **Access**: Secure URL generation for file access

### Other Modules

- **User Module**: User authentication and authorization
- **Profile Module**: Document association with user profiles
- **Auth Module**: Permission-based access control
- **Common Services**: Email notifications, logging, caching

### External Services

- **Google Cloud Storage**: Primary file storage
- **MongoDB**: Document metadata storage
- **JWT Service**: Authentication token validation

## Usage Examples

### Upload Document

```bash
curl -X POST http://localhost:3400/documents/upload \
  -H "Authorization: Bearer <jwt-token>" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@contract.pdf" \
  -F "title=Employee Contract" \
  -F "category=CONTRACT" \
  -F "isPublic=false"
```

### Get Document by ID

```bash
curl -X GET http://localhost:3400/documents/60f7b3b3b3b3b3b3b3b3b3b3 \
  -H "Authorization: Bearer <jwt-token>"
```

### Update Document

```bash
curl -X PUT http://localhost:3400/documents/60f7b3b3b3b3b3b3b3b3b3b3 \
  -H "Authorization: Bearer <jwt-token>" \
  -H "Content-Type: multipart/form-data" \
  -F "title=Updated Contract" \
  -F "category=PUBLIC"
```

### Get All Documents

```bash
curl -X GET http://localhost:3400/documents \
  -H "Authorization: Bearer <jwt-token>"
```

### Convert to Base64

```bash
curl -X GET http://localhost:3400/documents/gcs-to-base64/contract.pdf/iagility-apac \
  -H "Authorization: Bearer <jwt-token>"
```

### Delete Document

```bash
curl -X DELETE http://localhost:3400/documents/60f7b3b3b3b3b3b3b3b3b3b3 \
  -H "Authorization: Bearer <jwt-token>"
```

## Common Scenarios

### Scenario 1: Employee Document Upload

```typescript
// Frontend code example
const formData = new FormData();
formData.append('file', selectedFile);
formData.append('title', 'Employee ID Card');
formData.append('category', 'NON_PUBLIC');
formData.append('isPublic', 'false');

const response = await fetch('/documents/upload', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${token}`,
  },
  body: formData,
});
```

### Scenario 2: Public Document Access

```typescript
// Get all public documents
const response = await fetch('/documents', {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

const { data } = await response.json();
const publicDocs = data.documents.filter(doc => doc.isPublic);
```

### Scenario 3: Document Preview

```typescript
// Convert document to base64 for preview
const response = await fetch(`/documents/gcs-to-base64/${filename}/${bucket}`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

const { data } = await response.json();
const base64Content = data.base64;
// Use base64Content for preview
```

## Configuration Requirements

### Environment Variables

```env
GCS_BUCKET_NAME=your-gcs-bucket-name
GOOGLE_APPLICATION_CREDENTIALS=./path/to/service-account.json
```

### Google Cloud Storage Setup

1. Create GCS bucket
2. Generate service account credentials
3. Set appropriate bucket permissions
4. Configure CORS if needed for web access

### File Upload Limits

- Configured in `maxFileSize.maxFile` (default: 10MB)
- Adjustable via application configuration
- Consider server memory limits for large files

## Error Handling

### Common Error Responses

- `400`: Invalid file format, size exceeded, validation errors
- `401`: Missing or invalid JWT token
- `403`: Insufficient permissions
- `404`: Document not found
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

- Role-based permissions enforced
- Document ownership validation
- Secure file URL generation

### File Validation

- File type restrictions
- Size limit enforcement
- Malicious file detection

### Data Protection

- Encrypted storage in GCS
- Secure transmission (HTTPS)
- Audit trail maintenance

## Performance Notes

### Optimization Tips

- Use streaming for large file uploads
- Implement client-side file validation
- Consider CDN for frequently accessed files
- Monitor GCS bandwidth usage

### Caching Strategy

- Document metadata caching
- Base64 conversion caching for small files
- GCS URL caching with expiration

## Troubleshooting

### Common Issues

1. **Upload Fails**: Check file size, format, and permissions
2. **GCS Errors**: Verify credentials and bucket configuration
3. **Permission Denied**: Ensure user has required permissions
4. **File Not Found**: Verify document ID and GCS file existence

### Debug Steps

1. Check application logs for detailed error messages
2. Verify GCS bucket accessibility
3. Test with smaller files to isolate size issues
4. Validate JWT token and user permissions
