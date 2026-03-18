# SmartRanking API

A tennis ranking management API built with **NestJS**, **Mongoose**, and **MongoDB**. This system allows for managing players, categories, challenges, and match results.

## 🚀 Features

- **Players Management**: CRUD operations for players.
- **Categories**: Group players into categories and assign them to specific events.
- **Challenges**: Create challenges between players within the same category.
- **Matches**: Record match results, which automatically updates challenge statuses.
- **Observability**: Integrated NestJS Logger across all services.
- **Validation**: Strict data validation using `class-validator` and custom pipes.

## 🛠️ Tech Stack

- **Framework**: [NestJS](https://nestjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Language**: TypeScript
- **Validation**: class-validator & class-transformer

## 📋 Prerequisites

- Node.js (v18 or higher)
- Docker & Docker Compose (for running MongoDB)

## ⚙️ Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd api-smartranking
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   Copy `.env.example` to `.env` and configure your MongoDB URI.
   ```bash
   cp .env.example .env
   ```

4. **Run MongoDB**:
   ```bash
   docker-compose up -d
   ```

5. **Run the API**:
   ```bash
   # Development
   npm run start:dev

   # Production build
   npm run build
   npm run start:prod
   ```

## 🔌 API Endpoints

### Players
- `POST /api/v1/players`: Create a new player.
- `GET /api/v1/players`: List all players.
- `GET /api/v1/players/:id`: Get player details.
- `PUT /api/v1/players/:id`: Update player info.
- `DELETE /api/v1/players/:id`: Remove a player.

### Categories
- `POST /api/v1/categories`: Create a category.
- `GET /api/v1/categories`: List all categories.
- `POST /api/v1/categories/:category/players/:playerId`: Assign a player to a category.

### Challenges
- `POST /api/v1/challengers`: Request a new challenge.
- `GET /api/v1/challengers`: List all challenges (supports `?playerId=` filter).
- `PUT /api/v1/challengers/:id`: Update challenge status (ACCEPTED, DENIED, CANCELED).
- `DELETE /api/v1/challengers/:id`: Delete a challenge.

### Matches
- `POST /api/v1/challengers/:challengeId/match`: Register a match result for a challenge.

## 📝 Testing

You can find request examples in the `requests.http` file. If you use VS Code, the **REST Client** extension is recommended to run them directly.

```bash
# Run unit tests
npm run test

# Run e2e tests
npm run test:e2e
```

## 🏗️ Architecture

The project follows the standard NestJS modular architecture:
- `src/players`: Player logic and schema.
- `src/categories`: Category logic and player assignments.
- `src/challengers`: Logic for challenges and match results.
- `src/shared`: Database providers and global filters/pipes.
