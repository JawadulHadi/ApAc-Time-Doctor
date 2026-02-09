# 🎯 APAC Management System - Cursor AI Rules

**Last Updated:** February 2025
**Project:** APAC HR Management System
**Team:** MicroAgility Solutions Delivery
**Status:** Active

---

## 📌 CRITICAL RULES (NON-NEGOTIABLE)

### Rule #1: JSDoc Mandatory
- **EVERY function, method, class, interface MUST have JSDoc**
- JSDoc must include: description, @param, @returns, @throws, @example
- Single-line comments (//) are **STRICTLY FORBIDDEN**
- JSDoc comment block is the ONLY acceptable comment style

```typescript
/**
 * Detailed description of what this does
 *
 * @param param1 - Description of param1
 * @param param2 - Description of param2
 * @returns Description of return value
 * @throws ErrorName - When this error occurs
 * @example
 * const result = await method(param1, param2);
 */
async method(param1: string, param2: number): Promise<void> {
  // Implementation
}
```

### Rule #2: NO Direct Comments Allowed
```typescript
❌ FORBIDDEN:
const users = []; // Array of users
let count = 0; // User counter

✅ CORRECT:
/**
 * Collection of active system users
 * Updated during initialization
 */
const users: User[] = [];

/**
 * Counter tracking total users processed in current batch
 */
let count = 0;
```

### Rule #3: Validation Centralization
- **ALL validation logic lives in `src/shared/validators/`**
- Create `[Domain]ValidationHelper` class
- Services CALL validation helpers, they don't CONTAIN validation
- No validation scattered across multiple files

```typescript
✅ CORRECT STRUCTURE:

// In src/shared/validators/user-data.validation.ts
export class UserValidationHelper {
  static validateEmail(email: string): void {
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      throw new BadRequestException('Invalid email format');
    }
  }

  static validatePassword(password: string): void {
    if (password.length < 8) {
      throw new BadRequestException('Password too short');
    }
  }
}

// In user.service.ts
async createUser(dto: CreateUserDto): Promise<User> {
  UserValidationHelper.validateEmail(dto.email);
  UserValidationHelper.validatePassword(dto.password);
  // Business logic
}
```

### Rule #4: Repository Pattern (MANDATORY)
- **Services NEVER call Mongoose models directly**
- All database operations go through Repository
- Repository = single source of database truth
- Services = business logic only

```typescript
❌ FORBIDDEN in service.ts:
const user = await this.userModel.findById(id);
const users = await this.userModel.find({ role: 'admin' });

✅ CORRECT:
const user = await this.userRepository.findById(id);
const users = await this.userRepository.findByRole('admin');
```

### Rule #5: Use Path Aliases (MANDATORY)
- Use `@/` aliases, NEVER relative paths
- Config in `tsconfig.json` already done
- Aliases: `@/modules/*`, `@/types/*`, `@/shared/*`, `@/core/*`, `@/services/*`

```typescript
❌ FORBIDDEN:
import { UserService } from '../../../modules/user/user.service';
import { Logger } from '../../core/logger';
import helpers from '../shared/helpers';

✅ CORRECT:
import { UserService } from '@/modules/user/user.service';
import { Logger } from '@/core/logger';
import { helpers } from '@/shared/helpers';
```

### Rule #6: Type Safety
- **NO `any` type** without explicit justification comment
- Use proper TypeScript interfaces and types
- Leverage enums from `src/types/enums/`
- Enable strict null checks

```typescript
❌ FORBIDDEN:
const user: any = {};
const data = response.data as any;

✅ CORRECT:
const user: User = {};
const data: UserData = response.data;

// If absolutely needed with justification:
const unknownData: any = JSON.parse(apiResponse); // TODO: Type this properly
```

### Rule #7: Error Handling Pattern
- Structured logging with context
- Meaningful error messages
- NO empty catch blocks
- Proper HTTP status codes

```typescript
try {
  const user = await this.userRepository.findById(userId);
  if (!user) {
    throw new NotFoundException('User not found with given ID');
  }
  return user;
} catch (error) {
  this.logger.error('User retrieval failed', {
    userId,
    timestamp: new Date().toISOString(),
    errorMessage: error?.message,
    stack: error?.stack,
    context: { module: 'UserService', method: 'findUser' }
  });

  if (error instanceof NotFoundException) {
    throw error;
  }

  throw new HttpException(
    'Failed to retrieve user information',
    HttpStatus.INTERNAL_SERVER_ERROR
  );
}
```

### Rule #8: Security & Permissions
- Every protected endpoint uses `@Permission()` decorator
- Check PermissionsGuard for role validation
- Sanitize all user inputs via DTOs
- Never trust client-provided data

```typescript
@Post('create')
@UseGuards(AuthGuard, PermissionsGuard)
@Permission('CAN_CREATE_USER')
async createUser(@Body() dto: CreateUserDto) {
  // DTO automatically validates input
  // Guard automatically checks permissions
}
```

### Rule #9: Testing Minimum Coverage
- **80%+ code coverage required**
- Unit tests for all services
- Integration tests for controllers
- Run: `npm run test:cov`

### Rule #10: Pre-Commit Verification
Before any commit, run:
```bash
npm run lint            # ESLint check
npm run type-check      # TypeScript verify
npm run test:cov        # Coverage report (must be > 80%)
npm run fix             # Auto-format code
```

---

## 🏗️ PROJECT STRUCTURE

```
src/
├── config/              # Configuration modules
│   ├── database/        # MongoDB config
│   ├── swagger/         # API docs config
│   ├── gcs.config.ts    # Google Cloud Storage config
│   └── config.ts        # Main config
│
├── core/                # Framework extensions
│   ├── decorators/      # @Permission, @Roles, @Public, etc.
│   ├── filters/         # Global exception filter
│   ├── guards/          # Auth guard, permissions guard
│   ├── interceptors/    # Response transform, logging
│   └── pipes/           # Validation pipes
│
├── modules/             # Domain modules (each has bounded context)
│   ├── auth/            # Authentication & JWT
│   │   ├── dto/         # Login, register DTOs
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   └── README.md
│   │
│   ├── user/            # User management
│   │   ├── dto/         # CreateUserDto, UpdateUserDto
│   │   ├── schemas/     # User.schema.ts
│   │   ├── user.controller.ts
│   │   ├── user.service.ts
│   │   ├── user.repository.ts
│   │   ├── user.module.ts
│   │   └── README.md
│   │
│   ├── request/         # Request approvals workflow
│   ├── leave-bank/      # Leave management
│   ├── profile/         # Employee profiles
│   ├── department/      # Department management
│   ├── recruitment/     # ATS module
│   ├── document/        # Document management
│   ├── health/          # Health checks
│   └── [future modules]/
│
├── shared/              # Reusable across modules
│   ├── helpers/         # Business logic helpers
│   │   ├── user.helpers.ts
│   │   ├── request.helpers.ts
│   │   └── [domain].helpers.ts
│   │
│   ├── validators/      # Validation helper classes
│   │   ├── user-data.validation.ts
│   │   ├── file.validation.ts
│   │   └── [domain].validation.ts
│   │
│   ├── utils/           # Pure utility functions
│   │   ├── email.utils.ts
│   │   ├── gcs.utils.ts
│   │   └── [function].utils.ts
│   │
│   ├── mappers/         # Data mapping logic
│   └── shared.module.ts # Shared exports
│
├── services/            # Specialized services
│   └── email/           # Email service with templates
│       ├── auth/
│       ├── leave-bank/
│       ├── request/
│       └── recruitment/
│
├── types/               # TypeScript definitions
│   ├── constants/       # App-wide constants
│   │   ├── error-messages.constants.ts
│   │   ├── role-hierarchy.constants.ts
│   │   ├── emails/      # Email template constants
│   │   └── [domain].constants.ts
│   │
│   ├── dtos/            # Shared DTOs
│   │   ├── pagination.dto.ts
│   │   ├── response.dto.ts
│   │   └── base.dto.ts
│   │
│   ├── enums/           # Enumerations
│   │   ├── role.enums.ts
│   │   ├── request.enums.ts
│   │   ├── profile.enums.ts
│   │   └── [domain].enums.ts
│   │
│   └── interfaces/      # Shared interfaces
│       ├── user.interface.ts
│       ├── request.interface.ts
│       ├── base.interface.ts
│       └── [domain].interface.ts
│
├── app.controller.ts    # Root controller
├── app.service.ts       # Root service
├── app.module.ts        # Root module
└── main.ts              # Application entry point
```

---

## 📝 CODE GENERATION RULES FOR CURSOR

### When Generating Services
✅ Cursor should:
1. Add constructor with dependency injection
2. Add Logger injection
3. Create repository injection
4. Write JSDoc for each method
5. Use repository pattern (never direct models)
6. Call validation helpers
7. Implement error handling with logging
8. Use proper return types

### When Generating Controllers
✅ Cursor should:
1. Add @Permission() decorators
2. Add @UseGuards(AuthGuard, PermissionsGuard)
3. Write JSDoc for endpoints
4. Use DTOs for request bodies
5. Return proper HTTP status codes
6. Document API responses with @ApiResponse

### When Generating Validators
✅ Cursor should:
1. Create static validation methods
2. Use descriptive error messages
3. Include all edge cases
4. Throw appropriate HTTP exceptions
5. Document with JSDoc

### When Generating Tests
✅ Cursor should:
1. Test happy path
2. Test error scenarios
3. Mock dependencies properly
4. Cover edge cases
5. Use clear test descriptions
6. Aim for >80% coverage

---

## 🚨 FORBIDDEN PATTERNS

### Pattern 1: Single-line Comments
```typescript
❌ FORBIDDEN:
const status = 'active'; // User status
let count = 0; // Counter

✅ CORRECT:
/**
 * Current status of user account
 * Possible values: active, inactive, suspended, pending
 */
const status = 'active';

/**
 * Number of users processed in current batch
 * Reset at start of each batch operation
 */
let count = 0;
```

### Pattern 2: Direct Model Usage in Services
```typescript
❌ FORBIDDEN:
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>
  ) {}

  async getUser(id: string) {
    return this.userModel.findById(id); // WRONG!
  }
}

✅ CORRECT:
export class UserService {
  constructor(
    private userRepository: UserRepository
  ) {}

  async getUser(id: string) {
    return this.userRepository.findById(id); // Correct!
  }
}
```

### Pattern 3: Scattered Validation
```typescript
❌ FORBIDDEN:
// Validation in multiple places
async createUser(dto: CreateUserDto) {
  if (!dto.email || !dto.email.includes('@')) {
    throw new BadRequestException('Invalid email');
  }
  // Service logic
}

async updateUser(dto: UpdateUserDto) {
  if (!dto.email || !dto.email.includes('@')) {
    throw new BadRequestException('Invalid email');
  }
  // Service logic
}

✅ CORRECT:
// Validation in ONE place
export class UserValidationHelper {
  static validateEmail(email: string): void {
    if (!email || !email.includes('@')) {
      throw new BadRequestException('Invalid email');
    }
  }
}

// Reuse everywhere
async createUser(dto: CreateUserDto) {
  UserValidationHelper.validateEmail(dto.email);
  // Service logic
}

async updateUser(dto: UpdateUserDto) {
  UserValidationHelper.validateEmail(dto.email);
  // Service logic
}
```

### Pattern 4: Empty Catch Blocks
```typescript
❌ FORBIDDEN:
try {
  await this.userRepository.findById(id);
} catch {} // FORBIDDEN - Silent failure!

try {
  await this.userRepository.findById(id);
} catch (e) {} // Also forbidden

✅ CORRECT:
try {
  const user = await this.userRepository.findById(id);
  if (!user) throw new NotFoundException('User not found');
  return user;
} catch (error) {
  this.logger.error('User fetch failed', {
    id,
    error: error?.message,
    stack: error?.stack
  });
  throw new HttpException(
    'Could not retrieve user',
    HttpStatus.INTERNAL_SERVER_ERROR
  );
}
```

### Pattern 5: Relative Imports
```typescript
❌ FORBIDDEN:
import { UserService } from '../../../modules/user/user.service';
import { Logger } from '../../../core/logger';
import { helpers } from '../../shared/helpers';

✅ CORRECT:
import { UserService } from '@/modules/user/user.service';
import { Logger } from '@/core/logger';
import { helpers } from '@/shared/helpers';
```

### Pattern 6: Using `any` Type
```typescript
❌ FORBIDDEN:
const user: any = {};
const data = response.data as any;

✅ CORRECT:
const user: User = {};
const data: UserResponse = response.data;

// Only if absolutely unavoidable:
const config: any = JSON.parse(file); // TODO: Type this as ConfigInterface
```

### Pattern 7: Console Statements
```typescript
❌ FORBIDDEN:
console.log(user);
console.error('Error occurred');
console.debug(data);

✅ CORRECT:
this.logger.log('User retrieved successfully', { userId: user.id });
this.logger.error('Error occurred', { error: error?.message });
this.logger.debug('Debug info', { data });
```

### Pattern 8: Hardcoded Values
```typescript
❌ FORBIDDEN:
const MAX_USERS = 100;
const DEFAULT_ROLE = 'EMPLOYEE';
const API_TIMEOUT = 5000;

✅ CORRECT:
// In src/types/constants/system.config.constants.ts
export const SYSTEM_CONFIG = {
  MAX_USERS: 100,
  DEFAULT_ROLE: 'EMPLOYEE',
  API_TIMEOUT: 5000
};

// Usage:
import { SYSTEM_CONFIG } from '@/types/constants/system.config.constants';
const maxUsers = SYSTEM_CONFIG.MAX_USERS;
```

---

## 📋 CODE REVIEW CHECKLIST

Before commit/PR, verify ALL of:

- [ ] **JSDoc Compliance**: All functions/classes have JSDoc
- [ ] **No Single-line Comments**: Zero inline comments
- [ ] **Validation Centralized**: All validation in helpers
- [ ] **Repository Pattern**: No direct model calls
- [ ] **Path Aliases**: All imports use @/
- [ ] **Error Handling**: Structured logging, no empty catch
- [ ] **Type Safety**: No `any` without justification
- [ ] **Permissions**: All endpoints use @Permission() decorator
- [ ] **DTO Usage**: Request bodies use DTOs with validation
- [ ] **Test Coverage**: >80% coverage achieved
- [ ] **ESLint Passing**: No lint errors (`npm run lint:check`)
- [ ] **TypeScript Strict**: No type errors (`npm run type-check`)
- [ ] **Prettier Formatted**: Code style correct (`npm run fix:check`)
- [ ] **No console.log**: No debug code in production
- [ ] **Meaningful Commits**: Clear commit messages

---

## 🎓 EXAMPLE: Creating New Feature

### 1. Create DTO (src/modules/[feature]/dto/create-[feature].dto.ts)
```typescript
/**
 * DTO for creating new feature
 * Includes validation rules for input data
 */
export class Create[Feature]Dto {
  /**
   * Name of the feature
   * Must be unique and non-empty
   */
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  name: string;

  /**
   * Optional description
   */
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}
```

### 2. Create Schema (src/modules/[feature]/schemas/[feature].schema.ts)
```typescript
/**
 * Mongoose schema for [Feature] entity
 * Defines database structure and validations
 */
@Schema({ timestamps: true })
export class [Feature] {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: false })
  description: string;

  @Prop({ required: true })
  createdBy: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

/**
 * [Feature] document type combining schema with Mongoose methods
 */
export type [Feature]Document = [Feature] & Document;
```

### 3. Create Repository (src/modules/[feature]/[feature].repository.ts)
```typescript
/**
 * Repository handling database operations for [Feature]
 * Centralizes all MongoDB interactions
 */
@Injectable()
export class [Feature]Repository {
  /**
   * Constructor with MongoDB model injection
   */
  constructor(
    @InjectModel([Feature].name)
    private [feature]Model: Model<[Feature]Document>
  ) {}

  /**
   * Create new feature record
   * @param dto - Feature creation data
   * @returns Created feature document
   * @throws Error if creation fails
   */
  async create(dto: Create[Feature]Dto): Promise<[Feature]Document> {
    const feature = new this.[feature]Model(dto);
    return feature.save();
  }

  /**
   * Find feature by ID
   * @param id - MongoDB ObjectId
   * @returns Feature document or null
   */
  async findById(id: string): Promise<[Feature]Document | null> {
    return this.[feature]Model.findById(id).exec();
  }
}
```

### 4. Create Validation Helper (src/shared/validators/[feature].validation.ts)
```typescript
/**
 * Validation helper for [Feature] module
 * Centralizes all validation logic
 */
export class [Feature]ValidationHelper {
  /**
   * Validate feature name
   * @param name - Feature name to validate
   * @throws BadRequestException if invalid
   */
  static validateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new BadRequestException('Feature name cannot be empty');
    }
    if (name.length < 3) {
      throw new BadRequestException('Feature name must be at least 3 characters');
    }
  }
}
```

### 5. Create Service (src/modules/[feature]/[feature].service.ts)
```typescript
/**
 * Service handling business logic for [Feature] module
 */
@Injectable()
export class [Feature]Service {
  private logger = new Logger('[Feature]Service');

  constructor(
    private [feature]Repository: [Feature]Repository
  ) {}

  /**
   * Create new feature with validation
   * @param dto - Feature creation data
   * @returns Newly created feature
   * @throws BadRequestException if validation fails
   * @throws HttpException if creation fails
   */
  async create(dto: Create[Feature]Dto): Promise<[Feature]Document> {
    try {
      [Feature]ValidationHelper.validateName(dto.name);

      const feature = await this.[feature]Repository.create(dto);

      this.logger.log('Feature created successfully', {
        featureName: feature.name,
        timestamp: new Date().toISOString()
      });

      return feature;
    } catch (error) {
      this.logger.error('Feature creation failed', {
        dto,
        errorMessage: error?.message,
        stack: error?.stack
      });

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new HttpException(
        'Failed to create feature',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
```

### 6. Create Controller (src/modules/[feature]/[feature].controller.ts)
```typescript
/**
 * Controller for [Feature] module REST endpoints
 */
@ApiTags('[Feature]')
@Controller('[feature]')
export class [Feature]Controller {
  constructor(private [feature]Service: [Feature]Service) {}

  /**
   * Create new feature
   * @param dto - Feature creation data
   * @returns Created feature with full details
   */
  @Post()
  @UseGuards(AuthGuard, PermissionsGuard)
  @Permission('CAN_CREATE_[FEATURE]')
  @ApiOperation({
    summary: 'Create new feature',
    description: 'Creates a new feature with provided data'
  })
  @ApiResponse({
    status: 201,
    description: 'Feature created successfully'
  })
  async create(@Body() dto: Create[Feature]Dto) {
    return await this.[feature]Service.create(dto);
  }
}
```

---

## 🔍 CURSOR PROMPTS CHEAT SHEET

### Prompt 1: Code Review
```
Review this code against our project standards:
1. JSDoc completeness
2. Validation centralization
3. Error handling
4. Type safety
5. Repository pattern compliance
6. Permission decorators

List issues found and suggest fixes.
```

### Prompt 2: Generate Tests
```
Generate Jest unit tests for this service method:
- Test happy path
- Test each error scenario
- Mock all dependencies
- Cover edge cases
- Use clear test descriptions
- Target 100% method coverage

Use src/types/constants/ for test data.
```

### Prompt 3: Create Validator
```
Create a validation helper for this DTO.
Requirements:
- Static methods for each field
- Throw BadRequestException on error
- Clear error messages
- Include all business rules
- Add JSDoc with examples
```

### Prompt 4: Explain Architecture
```
Explain the [request] approval workflow:
- Which roles are involved
- Approval steps
- Permission checks
- Email notifications
- Database updates
```

### Prompt 5: Find Similar Code
```
Find all implementations of [email notification pattern].
Show me:
- Email service templates
- Email utility functions
- Where they're called
- How they're tested
```

---

## ✨ SUCCESS METRICS

### Code Quality
- ✅ 100% JSDoc compliance
- ✅ Zero single-line comments
- ✅ 80%+ test coverage
- ✅ Zero `any` types
- ✅ All validation centralized

### Security
- ✅ Permission checks on all endpoints
- ✅ Input sanitization via DTOs
- ✅ No secrets in code
- ✅ Proper error messages (no stack traces to client)

### Performance
- ✅ Proper database indexing
- ✅ Pagination implemented
- ✅ Caching where appropriate
- ✅ No N+1 queries

### Maintainability
- ✅ Clear module structure
- ✅ Repository pattern followed
- ✅ Path aliases used
- ✅ Proper error handling

---

## 📞 QUESTIONS FOR CURSOR

### Architecture Questions
- "What is the leave approval workflow?"
- "How does permission checking work?"
- "Explain the request module flow"
- "What email notifications are sent?"

### Code Questions
- "Why does this service use this pattern?"
- "What are all the validation helpers?"
- "Show me how to implement feature X"
- "What's the testing pattern for this?"

### Debugging Questions
- "Why might this test fail?"
- "What could cause this error?"
- "Find all places where X is used"
- "Is there duplicate code here?"

---

## 🎯 FINAL REMINDERS

1. **Every change requires JSDoc** - No exceptions
2. **Always centralize validation** - Never scatter it
3. **Use repository pattern** - Never direct models
4. **Check permissions** - Every endpoint
5. **Test thoroughly** - 80%+ coverage minimum
6. **Use path aliases** - Never relative imports
7. **Structured logging** - Always include context
8. **Commit often** - Clear, meaningful messages
9. **Code review** - Follow this checklist
10. **Ask Cursor** - It's here to help!

---

**This rules file is binding for all APAC Management System development with Cursor AI.**

**Last Review:** February 2025
**Next Review:** May 2025
**Maintained By:** Development Team
