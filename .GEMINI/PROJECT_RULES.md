# Project Rules & Standards

This document defines the engineering standards and conventions for the SmartRanking API.

## 🏗️ Architectural Pattern
- **Framework**: NestJS (Modular architecture).
- **Database**: MongoDB with Mongoose.
- **Dependency Injection**: Always use constructor-based injection.
- **Providers**: Use the `providers.ts` pattern for Mongoose models to keep modules clean.

## 🚀 Development Standards
- **Package Manager**: Always use `yarn`. Never use `npm`.
- **Type Safety**: 
    - Strict Typing is mandatory. **NEVER** use `any`.
    - Use `unknown` for generic error handling.
    - Define interfaces for all Mongoose Documents.
- **Naming Conventions**:
    - Classes/Decorators: `PascalCase` (e.g., `PlayersService`).
    - Methods/Variables/Properties: `camelCase` (e.g., `createPlayer`).
    - Files: `kebab-case.extension` (e.g., `create-player.dto.ts`).
- **Observability**: 
    - Every service must instantiate a `private readonly logger = new Logger(ServiceName.name)`.
    - Log significant operations (create, update, delete, errors).

## 🔌 API & Documentation
- **Swagger**: All controller methods must have `@ApiOperation` and `@ApiResponse`.
- **Versioning**: All routes must start with `/api/v1/`.
- **DTOs**: Use `class-validator` for input validation. All DTO properties should be properly decorated.

## 🧪 Testing Strategy
- **Unit Tests**: Required for all Services (`.service.spec.ts`).
- **E2E Tests**: Required for core Controller flows (`test/app.e2e-spec.ts`).
- **Mocks**: Use `jest.fn()` and mocked Mongoose models for unit tests.

## 📁 Directory Structure
```
src/
  ├── [module]/
  │     ├── dto/
  │     ├── interfaces/
  │     ├── schema/
  │     ├── [module].controller.ts
  │     ├── [module].service.ts
  │     ├── [module].module.ts
  │     └── [module].providers.ts
  └── shared/
        ├── database/
        ├── filters/
        └── pipes/
```
