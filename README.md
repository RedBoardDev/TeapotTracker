# Discord Time Tracker Bot

A Discord bot that updates its status based on time tracking received via webhook.

## Architecture

This project follows a Clean Architecture with Domain-Driven Design (DDD):

- **Domain**: Business entities, Value Objects and repository interfaces
- **Application**: Use cases, DTOs and application services
- **Infrastructure**: Concrete implementations (Discord.js, Express, Logger)
- **Shared**: Shared types and errors

## Prerequisites

- Node.js 22 or higher
- npm or yarn
- A Discord bot token
- PM2 (optional, for production)

## Installation

1. Clone the repository and install dependencies:
```bash
cd TeapotTracker
npm install
```

2. Copy the `.env.example` file to `.env`:
```bash
cp .env.example .env
```

3. Configure environment variables in `.env`:
```
DISCORD_BOT_TOKEN=your_discord_token
PORT=4983
NODE_ENV=production
LOG_LEVEL=INFO
LOG_TO_FILE=true
LOG_DIR=./logs
WEBHOOK_PATH=/webhook
```

## Usage

### Development
```bash
npm run dev
```

### Production with PM2
```bash
# Start
npm run pm2:start

# Stop
npm run pm2:stop

# Restart
npm run pm2:restart

# View logs
npm run pm2:logs
```

### Production without PM2
```bash
npm start
```

## Webhook API

The bot listens on `POST http://localhost:4983/webhook` and expects the following payload:

```json
{
  "timeInterval": {
    "start": "2025-05-27T10:00:00Z",
    "end": "2025-05-27T12:00:00Z"  // Optional
  },
  "currentlyRunning": true,
  "project": {  // Optional
    "clientName": "Client Name"
  }
}
```

### Status Behaviors

1. **Working with client**:
   - Status: "Working at [clientName]" (🟢 online)
   - Conditions: `currentlyRunning = true`, `timeInterval.end` absent, `project.clientName` present

2. **Side task**:
   - Status: "Running a side quest" (🟡 idle)
   - Conditions: `currentlyRunning = true`, `timeInterval.end` absent, `project.clientName` absent

3. **Inactive**:
   - Status: "Status 418: I'm a Teapot" (🔴 dnd)
   - Conditions: `currentlyRunning = false`, `timeInterval.end` present

## Available Scripts

- `npm run dev`: Start in development mode with hot-reload
- `npm start`: Start in production mode
- `npm run lint`: Check and fix code with Biome
- `npm run format`: Format code with Biome
- `npm run pm2:*`: PM2 commands

## Endpoints

- `GET /health`: Service health check
- `POST /webhook`: Receive time tracking data

## Logs

Logs are written to the `./logs` folder with one file per day in `YYYY-MM-DD.log` format.

## Folder Structure

```
src/
├── domain/           # Pure business logic
├── application/      # Use cases and orchestration
├── infrastructure/   # Technical implementations
├── shared/          # Shared code
└── main.ts          # Entry point
```

## Error Handling

The bot is designed to never crash:
- Data validation with Zod
- Custom error handling
- Detailed logs
- Graceful shutdown
- Automatic reconnection with PM2

## Security

- Strict webhook payload validation
- Environment variables for secrets
- Logs without sensitive data
- Generic errors in production
