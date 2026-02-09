# APAC Management System - AI Coding Agent Instructions

## Project Overview

**APAC Management System** is an enterprise-grade HR platform built with **NestJS** (Node.js + TypeScript) providing comprehensive workforce management capabilities. MongoDB backend with Google Cloud Storage integration for document handling.

## Essential Architecture

### Module Structure (Domain-Driven Design)

```
src/modules/ → [auth, user, profile, department, document, recruitment, leave-bank, request]
Each module contains: .controller.ts, .service.ts, .repository.ts, schemas/, dto/, README.md
```

**Critical Pattern**: Modules are feature-bounded domains with clear responsibilities. Auth module handles all JWT/security. User module manages employee data. Request module handles multi-type approval workflows. Document module integrates with GCS.

### Core Layers

- **Controllers**: HTTP entry points, use DTOs for validation via `@nestjs/class-validator`
- **Services**: Business logic, coordinate between repositories and external services
- **Repositories**: Database abstraction using Mongoose with MongoDB
- **DTOs**: Request/Response validation using `class-validator` decorators (`@IsEmail()`, `@IsString()`, etc.)
- **Schemas**: Mongoose MongoDB schemas defining document structure

### Data Flow Example

```
HTTP Request → Controller (validates with DTO)
  → Service (business logic, coordinated operations)
  → Repository (database operations)
  → MongoDB/GCS (persistence)
```

## Authentication & Authorization (RBAC)

**JWT Strategy**: Password-based login creates JWT tokens. Tokens validated via `JwtStrategy` guard.

**Permission System**:

- Decorator: `@Permission('CAN_MANAGE_USERS', 'CAN_APPROVE_REQUESTS')` on controllers
- Guard: `PermissionsGuard` enforces at runtime by checking user's permission array
- User object attached to request via `@GetUser()` custom decorator
- Roles and ExecutiveRoles enums in `/src/types/enums/role.enums.ts`

**Key Files**:

- `src/core/guards/` - JWT & Permission guards
- `src/core/decorators/` - `@Permission()`, `@GetUser()`, `@Roles()`
- `src/core/guards/jwt.strategy.ts` - Token validation logic

## Critical Developer Workflows

### Build & Run

```bash
npm run build          # NestJS compile via nest CLI
npm run start:dev      # Watch mode with source reloading
npm run start:prod     # Production (dist/main)
npm run clean          # Full clean rebuild on issues
```

### Testing (Jest with 80% Coverage Threshold)

```bash
npm test              # All tests
npm run test:unit     # Unit tests only
npm run test:integration  # Integration tests
npm run test:cov      # With coverage report
npm run test:ci       # CI/CD mode (no watch, runInBand)
```

**Test Organization**:

- Unit tests: `src/**/*.spec.ts` testing single service/repository
- Integration tests: `src/**/*.integration.ts` testing module interactions
- Test helpers: `test/helpers/` - `test-module.helper.ts`, `mock.helper.ts`

### Code Quality

```bash
npm run lint          # ESLint fix auto-apply
npm run lint:check    # ESLint check only
npm run type-check    # TypeScript strict check
npm run fix           # Prettier format all files
npm run preflight     # Combo: lint + type-check (run before PR)
```

## Project-Specific Patterns & Conventions

### Path Aliases (tsconfig.json)

Use these everywhere instead of relative paths:

```typescript
import { UserService } from '@/modules/user/user.service'; // @/* → src/*
import { ResponseDto } from '@/types/dtos/response.dto'; // @/types/* → src/types/*
import { CodeHelper } from '@/shared/helpers/code.helper'; // @/shared/* → src/shared/*
```

### Service Dependency Injection (Circular Dependency Pattern)

Services often reference each other. Use `@Inject(forwardRef(() => OtherService))` for circular deps:

```typescript
constructor(
  @Inject(forwardRef(() => ProfileService))
  private profileService: ProfileService,
)
```

### Exception & Error Handling

- **Global Filter**: `src/core/filters/global-exception.filter.ts` catches all exceptions and standardizes responses
- **Error Constants**: `src/types/constants/error-messages.constants.ts` - reuse defined error messages (e.g., `USER.NOT_FOUND`, `AUTH.INVALID_TOKEN`)
- **Standard Response**: Use `HttpException(ERROR_CONSTANT, HttpStatus....)` not generic Error

### DTO Validation Pattern

All incoming data validated via DTOs with decorators:

```typescript
// user.dto.ts
export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}

// In controller:
@Post('users')
createUser(@Body() dto: CreateUserDto) { ... } // Auto-validated by ValidationPipe
```

### Transform & Response Format

- Centralized: `src/shared/utils/unified-transform.utils.ts`
- Use `responseTransform()` for consistent API responses across all modules
- `src/core/interceptors/transform.interceptor.ts` applies globally

### Repository Pattern (Database Abstraction)

Services never directly use Mongoose. Always use repository:

```typescript
// Correct
const user = await this.userRepository.findById(userId);

// Wrong - Don't do this
const user = await this.userModel.findById(userId);
```

Repositories handle:

- Session management for transactions
- Index optimization
- Query building
- Data transformation before returning to service

### Email Service Integration

- `src/services/email/` - templated emails via Handlebars
- Auth emails: `email-auth-templates.service.ts`
- Always send async (don't await in hot paths)

### File Handling & GCS Integration

- Multipart files via Multer in `src/app.module.ts` - maxFileSize const
- `src/modules/document/` manages GCS uploads
- Document module handles versioning & access control

## Key External Integrations

| Integration              | Module           | Config                                 |
| ------------------------ | ---------------- | -------------------------------------- |
| **Google Cloud Storage** | document         | `src/config/gcs.config.ts`             |
| **MongoDB**              | all              | `src/config/database/`                 |
| **Swagger/OpenAPI**      | main             | `src/config/swagger/swagger.config.ts` |
| **Email (SMTP)**         | auth, user       | `.env SMTP_*` variables                |
| **JWT**                  | auth             | Passport JWT strategy                  |
| **Cache Manager**        | health, profiles | `.env REDIS_*`                         |

## Important File Navigation

**Configuration**:

- `src/config/` - app initialization, database, swagger, GCS
- `src/main.ts` - bootstrap with middleware, CORS, rate limiting, helmet security

**Core Infrastructure**:

- `src/core/guards/` - JWT, Permission enforcement
- `src/core/filters/` - Global exception handling
- `src/core/interceptors/` - Response transformation
- `src/core/pipes/` - Data transformation/validation

**Shared Utilities** (used across modules):

- `src/shared/helpers/` - Code generators, Email, User helpers
- `src/shared/validators/` - Input validation logic
- `src/shared/utils/` - Response transforms, Cache utils, GCS utils

**Types & Constants**:

- `src/types/enums/` - Role, Status, Permission enums
- `src/types/interfaces/` - Shared interfaces (User, Request, Transform, Filter)
- `src/types/constants/` - Error messages, Decorator keys, API response formats

## Testing Best Practices (This Project)

1. **Setup Test Module**: Use `createTestingModule()` from `test/helpers/test-module.helper.ts`
2. **Mock Dependencies**: `test/helpers/mock.helper.ts` provides mock implementations
3. **Test Organization**: Place near source (`.spec.ts` in same directory)
4. **Coverage**: Must maintain 80% (branches, lines, functions, statements)
5. **Async Tests**: Always use async/await or return Promise, never callback-based

## CI/CD & Merge Workflow

**Git Branching Strategy**:

- Develop on feature branches (auto-named: `many-tortoise`, `final-call`, etc.)
- Open PRs against `dev` branch for integration testing
- Deploy to prod via Docker (trigger on push to `dev` branch)
- Uses `main` as production-stable baseline

**Deployment Pipeline** (see `.github/workflows/deploy.yaml`):

1. **Trigger**: Push to `dev` branch (critical: workflow only runs on dev!)
2. **Build**: Docker image tagged with timestamp
3. **Transfer**: SSH to InMotion server (144.208.78.107), upload tar + .env
4. **Deploy**: Load image, replace container, health check (30s wait)
5. **Cleanup**: Keep last 3 images, remove older ones

**Pre-Merge Checklist**:

1. Run `npm run preflight` (lint + type-check)
2. Run `npm test` or `npm run test:ci` locally first
3. Commit message format: `feat:`, `fix:`, `refactor:`, `docs:`, etc.
4. Ensure no console.log or debug code left
5. **Create PR from feature branch → `dev` (very important: target dev, not main)**
6. Wait for GitHub Actions workflow to pass
7. Merge via GitHub UI (auto-deploys to InMotion)

**GitHub Actions Runner Issues** (if job hangs):

- **Error**: "The job was not acquired by Runner of type hosted even after multiple attempts"
- **Cause**: GitHub's ubuntu-latest runners unavailable or queue timeout
- **Fix 1**: Click "Re-run failed jobs" in GitHub UI (easiest)
- **Fix 2**: Push empty commit to retry: `git commit --allow-empty -m "chore: trigger retry" && git push`
- **Fix 3**: Verify targeting `dev` branch (workflow only triggers on dev, not main)
- **Fix 4**: Wait 10-15 minutes and retry (GitHub infrastructure issue)

**Merge Troubleshooting**:

- **Job waits for runner indefinitely**: See "GitHub Actions Runner Issues" above
- **PR reverts immediately after merge**: Check GitHub Actions for deploy.yaml failures
  - SSH connection: Verify private key secret is valid
  - Docker load: Check tar file uploaded correctly
  - Health check: Container may not be starting - check `.env` loaded
- **Tests block merge**: Run `npm run test:ci` locally to match CI environment
- **Type errors block merge**: Run `npm run type-check` before pushing
- **Lint errors block merge**: Run `npm run lint:check` to preview issues
- **Deployment hangs on server**: Check container logs: `docker logs apac-be-dev` on server

**Environment Variables** (required in `.env` for deployment):

```
NODE_ENV=development
PORT=3400
JWT_SECRET=<secure-value>
JWT_EXPIRES_IN=7d
MONGO_HOST=<mongodb-host>
MONGO_DB=apac-leave-system
MONGO_USER=<user>
MONGO_PASS=<password>
GCS_BUCKET_NAME=iagility-apac
GCS_KEY_JSON=<full-json-credentials>
FRONTEND_URLS=http://localhost:3000,https://apac-dev.agilebrains.com
```

## When Adding New Features

1. **Create module structure**: `src/modules/[feature]/{feature.module.ts, feature.service.ts, feature.repository.ts, schemas/, dto/}`
2. **Add to app.module.ts imports**
3. **Define DTOs** with validation decorators
4. **Implement service logic** coordinating repositories + external services
5. **Create controller** with endpoints, @Permission decorators, error handling
6. **Test first**: Unit tests for service, integration tests for controller
7. **Document**: Add README.md to module following patterns from existing modules
8. **Test coverage**: Ensure 80%+ coverage before PR

## Quick Reference: Common Commands

| Task                | Command                                         |
| ------------------- | ----------------------------------------------- |
| Full Clean Build    | `npm run clean && npm install && npm run build` |
| Dev Server          | `npm run start:dev`                             |
| Run All Tests       | `npm test`                                      |
| Run + Show Coverage | `npm run test:cov`                              |
| Pre-PR Checklist    | `npm run preflight && npm test`                 |
| Production Build    | `npm run build && npm run start:prod`           |
| Format Code         | `npm run fix`                                   |
| Check Linting       | `npm run lint:check`                            |

## Debugging Tips

- **Set NODE_ENV** in `.env` for appropriate log levels
- **Check logs** in bootstrap (main.ts) for startup issues
- **Invalid JWT tokens** → Check `src/core/guards/jwt.strategy.ts` validation logic
- **Permission denied** → Verify `@Permission` decorator and `user.permissions` array
- **Database issues** → Check MongoDB connection in `src/config/database/database.module.ts`
- **Test failures** → Run `npm run test:watch` for incremental debugging
- **Docker deployment fails** → Verify `.env` loaded correctly on server, check stderr in deploy.yaml output
- **Circular dependency errors** → Use `@Inject(forwardRef())` pattern in service constructors
