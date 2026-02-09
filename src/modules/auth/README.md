# Auth Module Guide

## Module Overview

The Auth Module is responsible for user authentication, authorization, and account management within the APAC Management System. It provides secure login/logout functionality, password management, account activation, and JWT token-based authentication.

### Core Purpose

- User authentication and session management
- Password reset and recovery workflows
- Account activation for new users
- JWT token generation and validation
- Security and access control

### Key Capabilities

- Secure login with JWT token generation
- Password reset via email verification
- Account activation with verification codes
- Session management and logout
- Resend activation emails for unverified users
- Password strength validation

## API Endpoints

### Authentication Required

Most endpoints are public except logout and test endpoints which require JWT authentication.

| Method | Endpoint                | Description                     | Required Permission |
| ------ | ----------------------- | ------------------------------- | ------------------- |
| `POST` | `/auth/login`           | Authenticate user and get token | None (public)       |
| `POST` | `/auth/logout`          | Logout current user             | Authenticated       |
| `POST` | `/auth/forgot-password` | Request password reset          | None (public)       |
| `POST` | `/auth/reset-password`  | Reset password with code        | None (public)       |
| `POST` | `/auth/activate`        | Activate user account           | None (public)       |
| `POST` | `/auth/re-activation`   | Resend activation email         | None (public)       |
| `GET`  | `/auth/token`           | Test authentication endpoint    | Authenticated       |

## Data Transfer Objects (DTOs)

### LoginDto

Used for user authentication.

```typescript
{
  username: string; // Required: Username or email (min 1 char)
  password: string; // Required: Password (min 8 chars)
}
```

**Validation Rules:**

- `username`: Required, must be a non-empty string
- `password`: Required, minimum 8 characters

### ForgotPasswordDto

Used for requesting password reset.

```typescript
{
  email: string; // Required: Valid email address
}
```

**Validation Rules:**

- `email`: Required, must be a valid email format

### ResetPasswordDto

Used for resetting password with verification code.

```typescript
{
  id: string; // Required: User MongoDB ObjectId
  code: string; // Required: Reset code (min 6 chars)
  newPassword: string; // Required: New password (min 8 chars)
}
```

**Validation Rules:**

- `id`: Must be a valid MongoDB ObjectId
- `code`: Minimum 6 characters
- `newPassword`:
  - Minimum 8 characters
  - Must contain uppercase and lowercase letters
  - Must contain at least one number
  - Must contain at least one special character

### ActivateUserDto

Used for activating new user accounts.

```typescript
{
  id: string; // Required: User MongoDB ObjectId
  code: string; // Required: Activation code (min 6 chars)
  password: string; // Required: New password (min 8 chars)
}
```

**Validation Rules:**

- `id`: Must be a valid MongoDB ObjectId
- `code`: Minimum 6 characters
- `password`: Same validation as `newPassword` in ResetPasswordDto

### ReActivationDto

Used for resending activation emails.

```typescript
{
  email: string; // Required: Valid email address
}
```

**Validation Rules:**

- `email`: Required, must be a valid email format

## Key Workflows

### User Login Process

1. **Credential Validation**: Verify username and password format
2. **User Lookup**: Find user by username/email
3. **Password Verification**: Compare hashed passwords
4. **Status Check**: Ensure user account is active and verified
5. **Token Generation**: Create JWT token with user payload
6. **Response**: Return token and user information

### Password Reset Workflow

1. **Email Verification**: Validate email exists in system
2. **Code Generation**: Create 6-digit reset code
3. **Email Dispatch**: Send reset code to user's email
4. **Code Validation**: User submits code with new password
5. **Password Update**: Hash and store new password
6. **Confirmation**: Send success notification

### Account Activation Flow

1. **New User Creation**: Admin creates user account (unverified)
2. **Activation Email**: System sends activation code to user
3. **User Activation**: User submits code and sets password
4. **Profile Sync**: Create/update user profile
5. **Account Verification**: Mark account as verified
6. **Auto Login**: Generate JWT token for immediate access

### Session Management

1. **Login**: JWT token issued with expiration
2. **Token Validation**: Middleware validates token on protected routes
3. **Logout**: Record logout timestamp
4. **Token Expiry**: Automatic session termination

## Integration Points

### User Module

- User account creation and management
- User profile retrieval
- Account status updates
- Password management

### Profile Module

- Profile creation during activation
- Profile synchronization
- User information updates

### Email Service

- Activation code emails
- Password reset emails
- Account notification emails

### JWT Service

- Token generation
- Token validation
- Payload encryption/decryption

## Usage Examples

### Login

```bash
curl -X POST http://localhost:3400/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "user@apac-dev.agilebrains.com",
    "password": "Password123!"
  }'
```

**Response:**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "email": "user@apac-dev.agilebrains.com",
      "firstName": "John",
      "lastName": "Doe"
    }
  }
}
```

### Forgot Password

```bash
curl -X POST http://localhost:3400/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@apac-dev.agilebrains.com"
  }'
```

### Reset Password

```bash
curl -X POST http://localhost:3400/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "id": "507f1f77bcf86cd799439011",
    "code": "123456",
    "newPassword": "NewPassword123!"
  }'
```

### Activate User

```bash
curl -X POST http://localhost:3400/auth/activate \
  -H "Content-Type: application/json" \
  -d '{
    "id": "507f1f77bcf86cd799439011",
    "code": "123456",
    "password": "MyPassword123!"
  }'
```

### Logout

```bash
curl -X POST http://localhost:3400/auth/logout \
  -H "Authorization: Bearer <jwt-token>"
```

### Resend Activation

```bash
curl -X POST http://localhost:3400/auth/re-activation \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@apac-dev.agilebrains.com"
  }'
```

## Common Scenarios

### Scenario 1: New User Onboarding

```typescript
// 1. Admin creates user account (via User module)
// 2. System sends activation email automatically
// 3. User receives email with activation code
// 4. User activates account
const response = await fetch('/auth/activate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    id: userId,
    code: '123456',
    password: 'SecurePass123!',
  }),
});

// 5. User is automatically logged in
const { access_token, user } = await response.json();
```

### Scenario 2: Password Recovery

```typescript
// 1. User requests password reset
await fetch('/auth/forgot-password', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'jhadii@mailinator.com' }),
});

// 2. User receives reset code via email
// 3. User submits reset code with new password
await fetch('/auth/reset-password', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    id: userId,
    code: resetCode,
    newPassword: 'NewSecurePass123!',
  }),
});
```

### Scenario 3: Session Management

```typescript
// Login and store token
const loginResponse = await fetch('/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username, password }),
});

const { access_token } = await loginResponse.json();
localStorage.setItem('token', access_token);

// Use token for authenticated requests
const profileResponse = await fetch('/user/profile', {
  headers: { Authorization: `Bearer ${access_token}` },
});

// Logout when done
await fetch('/auth/logout', {
  method: 'POST',
  headers: { Authorization: `Bearer ${access_token}` },
});
localStorage.removeItem('token');
```

## Configuration Requirements

### Environment Variables

```env
JWT_SECRET=your-secret-key-here
JWT_EXPIRATION=24h
EMAIL_SERVICE_ENABLED=true
```

### Password Policy

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

### Security Settings

- JWT token expiration: Configurable (default 24h)
- Reset code expiration: 1 hour
- Activation code expiration: 7 days
- Maximum login attempts: Configurable

## Error Handling

### Common Error Responses

- `400`: Invalid credentials, validation errors, user already verified
- `401`: Unauthorized, invalid token, incorrect password
- `404`: User not found, invalid email
- `500`: Internal server error, email service failure

### Error Response Format

```json
{
  "success": false,
  "message": "Invalid credentials",
  "statusCode": 401
}
```

### Specific Error Cases

**Invalid Login:**

```json
{
  "success": false,
  "message": "Invalid credentials",
  "statusCode": 401
}
```

**User Not Found:**

```json
{
  "success": false,
  "message": "User not found",
  "statusCode": 404
}
```

**Invalid Activation Code:**

```json
{
  "success": false,
  "message": "That activation code doesn't work",
  "statusCode": 400
}
```

## Security Considerations

### Password Security

- Passwords hashed using bcrypt
- Minimum strength requirements enforced
- Reset codes expire after 1 hour
- Activation codes expire after 7 days

### Token Security

- JWT tokens signed with secret key
- Tokens include user ID and permissions
- Token expiration enforced
- Secure token transmission (HTTPS)

### Account Protection

- Failed login attempt tracking
- Account lockout after multiple failures
- Email verification for password reset
- Activation required for new accounts

### Data Protection

- Sensitive data encrypted in transit
- Passwords never logged or exposed
- Reset codes single-use only
- Secure session management

## Performance Notes

### Optimization Tips

- Cache user lookup results
- Use database indexes on email/username
- Implement rate limiting on auth endpoints
- Monitor failed login attempts

### Caching Strategy

- User credentials cached after successful login
- JWT validation cached for performance
- Rate limit counters stored in Redis

## Troubleshooting

### Common Issues

1. **Login Fails**: Check credentials, account status, and verification
2. **Token Invalid**: Verify token hasn't expired, check JWT secret
3. **Email Not Received**: Check email service configuration, spam folder
4. **Activation Fails**: Verify code hasn't expired, check user status

### Debug Steps

1. Check application logs for detailed error messages
2. Verify email service is configured correctly
3. Test with known valid credentials
4. Validate JWT secret matches across services
5. Check user account status in database

### Common Solutions

- **Reset Code Expired**: Request new reset code
- **Activation Code Expired**: Resend activation email
- **Token Expired**: Login again to get new token
- **Account Locked**: Contact administrator to unlock
