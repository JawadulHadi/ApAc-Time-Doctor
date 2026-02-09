# APAC-BE Development Instructions

## Code Standards & Guidelines

### Comment Policy

**NO SINGLE-LINE COMMENTS ALLOWED** - Only JSDoc comments are permitted for all functions, methods, and classes.

#### JSDoc Requirements

- Every function/method must have JSDoc documentation
- Include `@param` for all parameters with descriptions
- Include `@returns` for return values with descriptions
- Include `@throws` for exceptions that may be thrown
- Use proper JSDoc block format (`/** ... */`)

#### Example

```typescript
/**
 * Calculate working days between dates (excluding weekends)
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Number of working days
 */
static calculateWorkingDays(startDate: Date, endDate: Date): number {
  // Implementation here - no inline comments
}
```

### Code Quality Standards

#### DRY Principle

- Do not repeat code across files
- Use centralized helpers and utilities
- Consolidate validation logic in dedicated helper classes

#### Error Handling

- Use proper logging instead of silent failures
- Implement centralized validation patterns
- Provide meaningful error messages

#### File Organization

- Keep validation logic in dedicated validator classes
- Use helper classes for reusable utilities
- Maintain clear separation of concerns

---

## 📁 Project Structure Standards

### 🏗️ Core Module (`src/core/`)

#### Standards

- **Purpose**: Shared core functionality, decorators, interceptors
- **Validation**: Use centralized validation patterns
- **Error Handling**: Implement proper error propagation
- **Documentation**: All core classes must have JSDoc

#### Specific Rules

```typescript
// Core decorators must have JSDoc
/**
 * Permission decorator for role-based access control
 * @param permissions - Array of required permissions
 * @returns Decorator function
 */
export const Permission = (permissions: string[]) => {
  // Implementation
};

// Core interceptors must log errors properly
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  /**
   * Intercept HTTP requests for logging
   * @param context - ExecutionContext
   * @param next - CallHandler
   * @returns Observable with logging
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Implementation with proper error handling
  }
}
```

### 🔧 Shared Module (`src/shared/`)

#### Helpers (`src/shared/helpers/`)

- **Validation Helpers**: All validation logic centralized
- **Utility Helpers**: Reusable utility functions
- **Format Helpers**: Data formatting utilities
- **No Single-Line Comments**: Only JSDoc documentation

#### Validators (`src/shared/validators/`)

- **Centralized Validation**: All validation in dedicated classes
- **Type Safety**: Proper TypeScript usage
- **Error Messages**: User-friendly validation errors
- **No Redundancy**: No duplicate validation logic

#### Utils (`src/shared/utils/`)

- **Transform Utils**: Data transformation utilities
- **Display Utils**: UI formatting utilities
- **Role Utils**: Role-based utilities
- **JSDoc Required**: All utility methods documented

#### Specific Ruless

```typescript
// Helper classes must follow JSDoc standards
export class DateHelper {
  /**
   * Format date to display format
   * @param date - Date to format
   * @param format - Format string
   * @returns Formatted date string
   */
  static formatDate(date: Date, format: string): string {
    // Implementation
  }
}

// Validator classes must be comprehensive
export class UserValidationHelper {
  /**
   * Validate user email format
   * @param email - Email address to validate
   * @returns Validation result with valid flag and error message
   */
  static validateEmail(email: string): { valid: boolean; error?: string } {
    // Implementation
  }
}
```

### 📋 Types (`src/types/`)

#### Enums (`src/types/enums/`)

- **Complete Coverage**: All possible values defined
- **Type Safety**: Proper enum usage
- **Documentation**: Each enum documented with JSDoc

#### Interfaces (`src/types/interfaces/`)

- **Type Definitions**: Clear, comprehensive interfaces
- **Optional Properties**: Properly marked optional fields
- **JSDoc Documentation**: All interfaces documented

#### DTOs (`src/types/dtos/`)

- **Validation**: Use class-validator decorators
- **Documentation**: All DTOs have JSDoc
- **Type Safety**: Strong typing throughout

#### Constants (`src/types/constants/`)

- **Centralized**: All constants in dedicated files
- **Naming**: Clear, descriptive constant names
- **Documentation**: Constant groups documented

#### Specific Rulesss

```typescript
// Enums must have JSDoc
export enum UserRole {
  /** System administrator with full access */
  ADMIN = 'ADMIN',
  /** Regular user with limited access */
  USER = 'USER',
  /** Team lead with team management access */
  TEAM_LEAD = 'TEAM_LEAD',
}

// Interfaces must be documented
export interface UserPayload {
  /** Unique user identifier */
  _id: string;
  /** User email address */
  email: string;
  /** User role in the system */
  role: UserRole;
  /** Optional user profile information */
  profile?: ProfileData;
}

// DTOs must have validation decorators and JSDoc
export class CreateUserDto {
  /**
   * User email address
   */
  @IsEmail()
  email: string;

  /**
   * User password
   */
  @IsString()
  @MinLength(8)
  password: string;
}
```

---

### 📦 Module-Specific Standards

#### Auth Module (`src/modules/auth/`)

- **Security**: Proper JWT handling and validation
- **Validation**: Use `AuthValidationHelper` for all validations
- **Error Handling**: Structured error responses
- **No Single-Line Comments**: JSDoc only

#### User Module (`src/modules/user/`)

- **Validation**: Centralized in `UserValidationHelper`
- **Data Privacy**: Proper handling of sensitive data
- **Error Handling**: Comprehensive logging
- **Type Safety**: Strong typing throughout

#### Request Module (`src/modules/request/`)

- **Validation**: MUST use `RequestValidationHelper`
- **Business Logic**: Centralized validation patterns
- **Status Management**: Proper state transitions
- **Error Handling**: Structured logging with context

#### Profile Module (`src/modules/profile/`)

- **File Handling**: Proper validation and security
- **Validation**: Use `ProfileValidationHelper`
- **Error Handling**: Comprehensive error logging
- **Documentation**: All methods documented

#### Department Module (`src/modules/department/`)

- **Validation**: Use `DepartmentValidationHelper`
- **Hierarchy**: Proper department structure validation
- **Error Handling**: Structured error responses
- **Type Safety**: Strong typing

#### Leave Bank Module (`src/modules/leave-bank/`)

- **Validation**: Use `LeaveBankValidationHelper`
- **Calculations**: Accurate leave balance calculations
- **Error Handling**: Comprehensive logging
- **Business Logic**: Centralized in helpers

#### Document Module (`src/modules/document/`)

- **File Security**: Proper file type validation
- **Validation**: Use `DocumentValidationHelper`
- **Error Handling**: Structured error responses
- **Type Safety**: Strong typing

#### Recruitment Module (`src/modules/recruitment/`)

- **Validation**: Use `RecruitmentValidationHelper`
- **Process Flow**: Proper recruitment workflow
- **Error Handling**: Comprehensive logging
- **Data Integrity**: Proper candidate data handling

---

## 🎯 Universal Validation Standards

### All Modules Must Follow

#### **1. Validation Helper Pattern**

```typescript
export class [ModuleName]ValidationHelper {
  /**
   * Validate [specific functionality]
   * @param param - Parameter description
   * @returns Validation result with valid flag and error message
   */
  static validate[FunctionName](param: type): { valid: boolean; error?: string } {
    // Implementation
  }
}
```

#### **2. Error Handling Pattern**

```typescript
try {
  // Operation
} catch (error) {
  this.logger.error(`Error in [methodName]:`, {
    context: relevantData,
    error: error?.message || error,
    stack: error?.stack,
  });
  throw new HttpException(
    'User-friendly error message',
    HttpStatus.INTERNAL_SERVER_ERROR,
  );
}
```

#### **3. Service Method Pattern**

```typescript
/**
 * Method description
 * @param param1 - Parameter description
 * @param param2 - Parameter description
 * @returns Return value description
 */
async [methodName](
  param1: Type1,
  param2: Type2,
): Promise<ReturnType> {
  // Validation
  [ModuleName]ValidationHelper.validate[FunctionName](param1);
  
  // Business logic
  // Error handling
  // Return result
}
```

---

## 🔄 Development Workflow

### 1. Before Writing New Code

- [ ] Check existing helpers for reusable functionality
- [ ] Ensure JSDoc compliance for all new methods
- [ ] Follow centralized validation patterns
- [ ] Review module-specific standards

### 2. During Development

- [ ] Use appropriate ValidationHelper classes
- [ ] Add proper JSDoc documentation
- [ ] Avoid single-line comments
- [ ] Implement proper error handling
- [ ] Follow module-specific patterns

### 3. Code Review Checklist

- [ ] No single-line comments anywhere
- [ ] All methods have comprehensive JSDoc
- [ ] No duplicate validation logic
- [ ] Proper error handling with structured logging
- [ ] Centralized validation patterns used
- [ ] Module-specific standards followed
- [ ] Type safety maintained
- [ ] Business logic properly separated

---

## 🛡️ Security Standards

### All Modules Must Implement

- **Input Validation**: Comprehensive input sanitization
- **Authorization**: Proper role-based access control
- **Error Handling**: No sensitive information in error messages
- **Logging**: Security events properly logged
- **Type Safety**: Strong typing to prevent injection attacks

---

## 📊 Performance Standards

### Database Operations

- **Efficient Queries**: Proper indexing and query optimization
- **Connection Management**: Proper connection handling
- **Error Handling**: Database errors properly logged
- **Pagination**: Implement pagination for large datasets

### Memory Management

- **Resource Cleanup**: Proper cleanup of resources
- **Error Handling**: Memory leaks prevented
- **Efficient Data Structures**: Use appropriate data structures

---

## 🧪 Testing Standards

### Unit Tests

- **Coverage**: Minimum 80% code coverage
- **Structure**: Proper test structure with describe/it blocks
- **Mocks**: Use standardized mocking patterns
- **Assertions**: Comprehensive assertions

### Integration Tests

- **API Testing**: Comprehensive endpoint testing
- **Database Testing**: Database integration testing
- **Error Scenarios**: Test all error conditions

---

## 📋 Enforcement

These standards are enforced through:

- Code review processes
- Automated linting rules (where applicable)
- Regular code cleanup sessions
- Developer training and onboarding
- CI/CD pipeline checks
- Automated testing requirements

---

## 📈 Recent Improvements

### Completed

1. **Request Module Overhaul:**
   - Centralized `RequestValidationHelper` implementation
   - Removed duplicate validation logic
   - Enhanced error handling with structured logging
   - 100% JSDoc compliance achieved

2. **Code Quality Improvements:**
   - Eliminated single-line comments project-wide
   - Standardized validation patterns
   - Improved type safety throughout
   - Enhanced error handling

3. **Module Standardization:**
   - Consistent validation helper patterns
   - Unified error handling approaches
   - Standardized JSDoc documentation
   - Centralized business logic

### Code Changes Summary

- **Files Modified:** 15+ files across modules
- **Redundancy Removed:** ~200 lines of duplicate code
- **Comments Standardized:** 100% JSDoc compliance
- **Error Handling:** Improved logging and validation patterns
- **Type Safety:** Enhanced TypeScript usage
- **Security:** Improved validation and authorization

---

**Last Updated:** February 4, 2026
**Version:** 2.0
**Scope:** Project-wide standards for all modules, core, shared, and types
