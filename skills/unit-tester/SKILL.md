---
name: unit-tester
description: High-quality unit test generator for NestJS. Use when Gemini CLI needs to create, refactor, or improve Jest-based unit tests while avoiding test smells and maintaining clean code standards.
---

# Unit Tester Skill

This skill guides you in creating robust, maintainable unit tests for NestJS applications using Jest.

## 🧠 Core Principles

- **Avoid Fragility**: Test behavior, not implementation details.
- **Clean Code**: Follow the AAA (Arrange, Act, Assert) pattern.
- **Minimal Mocking**: Mock external boundaries; use real logic for internal utility functions.
- **Zero Smells**: Actively detect and eliminate test smells (flakiness, over-mocking, etc.).

## 🛠️ Workflow

### 1. Analyze the Target
Read the file you are testing. Identify:
- Public methods and their return types.
- Dependencies (Injected services, models, repositories).
- Edge cases (null inputs, empty arrays, error states).

### 2. Setup (Arrange)
Use `Test.createTestingModule` to setup the environment.
- Reference [nestjs_best_practices.md](references/nestjs_best_practices.md) for mocking patterns.
- Keep setup logic clean in `beforeEach()`.

### 3. Implement Tests (Act & Assert)
Write focused test cases with descriptive names: `should [expected result] when [condition]`.
- Follow the guidelines in [smells.md](references/smells.md) to ensure high-quality test code.
- Use `toBe()`, `toEqual()`, `toThrow()`, and `toHaveBeenCalledWith()` appropriately.

### 4. Verify & Refactor
- Run the tests using `npm test` or `yarn test`.
- Check coverage if requested.
- Refactor the test if it feels too complex or repetitive.

## 📚 References

- **[Test Smells Guide](references/smells.md)**: How to avoid fragile, over-mocked, or slow tests.
- **[NestJS Best Practices](references/nestjs_best_practices.md)**: Common patterns for NestJS-specific testing.
