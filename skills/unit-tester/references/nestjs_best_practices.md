# NestJS Testing Best Practices

Follow these patterns when testing NestJS components (Services, Controllers, Providers).

## 🛠️ Mocking Dependencies

Use `Test.createTestingModule` to setup your environment. Prefer `useValue` for simple mocks.

### Mocking a Service
```typescript
const mockUsersService = {
  findOne: jest.fn(),
  create: jest.fn(),
};

const module = await Test.createTestingModule({
  providers: [
    AuthService,
    { provide: UsersService, useValue: mockUsersService },
  ],
}).compile();
```

### Mocking Mongoose Models
If testing a service that uses Mongoose:
```typescript
const mockPlayerModel = {
  find: jest.fn(),
  create: jest.fn().mockImplementation((dto) => dto),
  exec: jest.fn(),
};

{ provide: getModelToken('Player'), useValue: mockPlayerModel }
```

## 📐 AAA Pattern (Arrange-Act-Assert)

Keep tests organized to improve readability:

1. **Arrange**: Set up the state, mocks, and expected data.
2. **Act**: Call the method being tested.
3. **Assert**: Verify the behavior.

```typescript
it('should create a player', async () => {
  // Arrange
  const createPlayerDto = { name: 'Player 1' };
  mockPlayerModel.create.mockReturnValue(createPlayerDto);

  // Act
  const result = await service.create(createPlayerDto);

  // Assert
  expect(result).toEqual(createPlayerDto);
  expect(mockPlayerModel.create).toHaveBeenCalledWith(createPlayerDto);
});
```

## 🧪 Testing Controllers

Controllers should focus on request mapping and status codes.
- Mock the underlying Service.
- Assert that the Service method was called with correct parameters.
- Verify the return value matches the expected DTO.

## 🚨 Error Handling

Don't forget to test failure scenarios:
- What happens if the service throws a `NotFoundException`?
- What happens if the database connection fails?

```typescript
it('should throw NotFoundException if player not found', async () => {
  mockPlayerModel.findById.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });

  await expect(service.findOne('id')).rejects.toThrow(NotFoundException);
});
```
