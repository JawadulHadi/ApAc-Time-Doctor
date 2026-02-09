# Announcement Module Guide

## Module Overview

The Announcement Module handles system-wide communications and broadcast notifications within the APAC Management System. It provides functionality to send targeted or bulk announcements to all users, currently focusing on mission-critical updates and new feature announcements.

### Core Purpose

- System-wide broadcasting of important updates
- Standardized announcement delivery
- Employee engagement through feature announcements
- Automated email broadcast management

### Key Capabilities

- Send bulk announcements to all registered users
- Support for rich-text email templates
- Automated delivery tracking
- Permission-based announcement triggering

## API Endpoints

### Authentication Required

All endpoints require JWT authentication.

| Method | Endpoint            | Description                                      | Required Permission |
| ------ | ------------------- | ------------------------------------------------ | ------------------- |
| `POST` | `/announcement/all` | Send Mission Statement Announcement to all users | Authenticated       |

## Key Workflows

### Bulk Announcement Process

1. **Authentication**: Verify JWT token
2. **User Retrieval**: Fetch all active users from the database
3. **Template Preparation**: Load the specific announcement template
4. **Email Dispatch**: Initiate bulk email sending process
5. **Response**: Return initiation result and totals

## Integration Points

### User Module

- Retrieve user email addresses and names
- Filter active user accounts

### Email Service

- Handle SMTP connections
- Deliver templated emails to users

## Usage Examples

### Trigger Global Announcement

```bash
curl -X POST http://localhost:3400/announcement/all \
  -H "Authorization: Bearer <jwt-token>"
```

**Response:**

```json
{
  "success": true,
  "message": "Mission Statement Announcement Emails Initiated",
  "data": {
    "total": 150,
    "successful": 150,
    "failed": 0
  }
}
```

## Security Considerations

- **Access Control**: Currently limited to authenticated users
- **Rate Limiting**: Integrated with global rate limiter to prevent SMTP abuse
- **Data Protection**: User emails are accessed securely and never exposed in logs

## Troubleshooting

1. **Emails Not Sent**: Check SMTP configuration in environment variables
2. **Unauthorized**: Ensure valid JWT token is provided
3. **Slow Delivery**: Large bulk sends are processed asynchronously
