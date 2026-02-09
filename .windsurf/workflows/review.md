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

### Request Module Specific Rules

#### Validation

- All request validation must use `RequestValidationHelper`
- No duplicate validation methods across files
- Centralized business logic validation

#### Errors Handling

- Replace empty catch blocks with proper logging
- Use structured error responses
- Log errors with context information

## Recent Cleanup Actions

### Completed

1. **Removed duplicate methods from `request.helpers.ts`:**

   - `validateRequestDates` → Use `RequestValidationHelper.validateRequestDates()`
   - `checkDuplicateRequest` → Use `RequestValidationHelper.checkDuplicateRequest()`
2. **Cleaned up `request.service.ts`:**

   - Replaced manual validation with `RequestValidationHelper` calls
   - Improved error handling in `findAllPopulation` methods
   - Removed redundant validation patterns
3. **Standardized `RequestValidationHelper`:**

   - Removed all single-line comments
   - Added comprehensive JSDoc documentation
   - Maintained consistent parameter and return documentation

### Code Changes Summary

- **Files Modified:** `request.helpers.ts`, `request.service.ts`, `request-validation.helper.ts`
- **Redundancy Removed:** ~50 lines of duplicate validation code
- **Comments Standardized:** 100% JSDoc compliance
- **Error Handling:** Improved logging and validation patterns

## Development Workflow

1. **Before writing new code:**

   - Check existing helpers for reusable functionality
   - Ensure JSDoc compliance for all new methods
   - Follow centralized validation patterns
2. **During development:**

   - Use `RequestValidationHelper` for all validation logic
   - Add proper JSDoc documentation
   - Avoid single-line comments
3. **Code review checklist:**

   - [ ] No single-line comments
   - [ ] All methods have JSDoc
   - [ ] No duplicate validation logic
   - [ ] Proper error handling with logging
   - [ ] Centralized validation patterns used

## Enforcement

These standards are enforced through:

- Code review processes
- Automated linting rules (where applicable)
- Regular code cleanup sessions
- Developer training and onboarding

---

**Last Updated:** February 4, 2026
**Version:** 1.0
