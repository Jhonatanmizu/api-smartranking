# Test Smells and Code Smells in Unit Tests

To ensure long-term maintainability and reliability, avoid these common smells when generating or refactoring tests.

## 🛑 Test Smells (Behavioral Issues)

### 1. Fragile Tests
- **Symptoms**: Tests break due to minor changes in implementation details that don't affect public behavior.
- **Fix**: Focus assertions on **public outputs and observable side effects** rather than private state or specific call orders (unless critical).

### 2. Over-Mocking ("Mocking Hell")
- **Symptoms**: Every dependency is mocked, making the test a mirrors of the implementation. If you change a dependency's name, the test passes but the app breaks.
- **Fix**: Use real objects for simple logic and only mock external boundaries (DB, API, external libraries).

### 3. Non-Deterministic Tests (Flaky Tests)
- **Symptoms**: Tests pass or fail randomly without code changes (e.g., using `Date.now()`, random numbers, or global state).
- **Fix**: Mock time or seed random values. Ensure each test cleans up after itself.

### 4. Test Interdependence
- **Symptoms**: Test B fails if Test A doesn't run first.
- **Fix**: Ensure each `it()` block is fully isolated. Re-initialize the `TestingModule` or reset mocks in `beforeEach()`.

### 5. Slow Tests
- **Symptoms**: Unit tests take seconds to run.
- **Fix**: Avoid DB connections, network calls, or heavy disk I/O. Use mocks for these operations.

## 🚱 Code Smells in Tests (Structural Issues)

### 1. Duplicate Setup
- **Symptoms**: The same "Arrange" logic is copied across multiple test cases.
- **Fix**: Use `beforeEach()` or helper functions to create common test data/mocks.

### 2. Complex Logic in Tests
- **Symptoms**: Tests contain loops, conditionals, or complex math.
- **Fix**: Tests should be linear and declarative. If you need a loop, you might be testing too much at once.

### 3. Magic Numbers / Hard-coded Data
- **Symptoms**: `expect(result).toBe(42)` where 42 is unexplained.
- **Fix**: Use descriptive variables or constants (e.g., `const EXPECTED_USER_ID = '123'`).

### 4. Excessive Assertions
- **Symptoms**: A single test case has 10+ assertions.
- **Fix**: If one assertion fails, you should know exactly what's wrong. Break into smaller, focused test cases.
