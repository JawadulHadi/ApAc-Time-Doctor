# User Module Guide

## Module Overview

The User Module manages user accounts, profiles, and user-related operations within the APAC Management System. It handles user creation, updates, password management, and provides comprehensive user profile information including organizational hierarchy.

### Core Purpose

- **User account management**: Centralized administration of credentials and access.
- **Profile Lifecycle**: Orchestrates creation and synchronization between User and Profile entities.
- **Hierarchy Awareness**: Manages organizational structure and Team Lead assignments.
- **Security**: Robust password management and Role-Based Access Control (RBAC).

### Key Capabilities

- **Automated Onboarding**: Creates accounts with auto-generated credentials and activation flows.
- **Optimized Hierarchy**: High-performance retrieval of organizational charts and executive lists.
- **Granular Updates**: Partial updates with transaction-safe synchronization.
- **Secure Authentication**: Integration with JWT and Bcrypt for data protection.

## API Endpoints

### Authentication Required

All endpoints require JWT authentication.

| Method | Endpoint           | Description                | Required Permission                |
| ------ | ------------------ | -------------------------- | ---------------------------------- |
| `GET`  | `/user/all`        | Get all users by hierarchy | `CAN_MANAGE_USERS`                 |
| `GET`  | `/user/:id`        | Get user profile by ID     | `CAN_VIEW_USER_PROFILE`            |
| `GET`  | `/user/profile/me` | Get current user profile   | Authenticated                      |
| `POST` | `/user/user`       | Create new user account    | `CAN_MANAGE_USERS`, `CAN_ADD_USER` |
| `PUT`  | `/user/:userId`    | Update user information    | `CAN_MANAGE_USERS`                 |
| `POST` | `/user/password`   | Change user password       | Authenticated                      |

## Data Transfer Objects (DTOs)

### CreateUserProfileDto

Used for creating new user accounts. Inherits from `CreateUserDto`.

```typescript
{
  firstName: string;       // Required: Min 2 chars
  lastName: string;        // Required: Min 2 chars
  email: string;           // Required: Must be valid email
  role: Role;              // Required: Valid system role
  department?: string;     // Optional: Valid Department ObjectId
  contactNumber?: string;  // Optional: 10-20 chars
}
```

### UpdateUserDto

Used for updating user information. Supports partial updates.

```typescript
{
  email?: string;
  firstName?: string;
  lastName?: string;
  contactNumber?: string;
  designation?: string;
  department?: string;     // ObjectId string
  permissions?: string[];
  status?: UserStatus;
}
```

## Internal Architecture

### Service Layer Optimization

The `UserService` utilizes transaction-based updates to ensure data consistency between `User` and `Profile` collections. Long-running or non-critical tasks (like profile picture uploads) are handled asynchronously to improve API response times.

### Optimized Queries

- **Executive Fetching**: Uses targeted role-based queries instead of in-memory filtering.
- **Indexing**: Database indexes are maintained on `email`, `status`, and `department` for high-performance lookups.

### Security Implementation

- **Password Hashing**: Bcrypt with salt rounds (10).
- **Validation**: Strict schema validation and DTO-level checks using `class-validator`.
- **RBAC**: Integrated `PermissionsGuard` and custom `@Permission` decorators.

## Key Workflows

### User Creation

1. Validate input and requester permissions.
2. Generate secure random password and activation code.
3. Start database transaction.
4. Create `User` document.
5. Create `Profile` document with synchronized data.
6. Commit transaction.
7. Trigger post-creation hooks (Email, Default Profile Pic, Team Lead assignment).

### Team Lead Assignment

When a user is promoted to `TEAM_LEAD` or moved to a different department, the system automatically:

1. Removes them from any previous Team Lead roles.
2. Assigns them as the leader of the new target department.

## Error Handling

| Status Code | Scenario                                |
| ----------- | --------------------------------------- |
| `400`       | Validation errors or invalid ObjectIds. |
| `401`       | Missing or invalid JWT token.           |
| `403`       | Insufficient RBAC permissions.          |
| `404`       | Target user or department not found.    |
| `409`       | Email or Username conflict.             |

## Troubleshooting

### Debugging Steps

1. **Logs**: Check NestJS application logs for `UserService` or `UserController` tags.
2. **Database**: Verify synchronization between `users` and `profiles` collections.
3. **Email**: Check if `EmailAuthTemplatesService` is correctly configured if activation emails are missing.
