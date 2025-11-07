# NestJS + Next.js + PostgreSQL + Redis Starter

A full-stack TypeScript monorepo with NestJS backend, Next.js frontend, PostgreSQL database, and Redis cache.

## Getting Started

### Prerequisites
- Docker and Docker Compose
- Node.js 20+ (for local development)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/kodokbakar/nest-postgres-redis-starter.git
   cd nest-postgres-redis-starter
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

3. **Start the application**
   ```bash
   # Development mode
   docker compose --profile dev up -d --build

   # Production mode
   docker compose --profile prod up -d --build
   ```

4. **Verify services are running**
   ```bash
   curl http://localhost:3000/healthz
   ```

## Services

- **API (NestJS)**: http://localhost:3000
- **Web (Next.js)**: http://localhost:3001
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

## Project Initialization

### Initialize Prisma migrations
```bash
cd apps/api
npx prisma migrate dev
```

### Install dependencies locally
```bash
# API
cd apps/api
npm install

# Web
cd apps/web
npm install
```

## License

[MIT][https://opensource.org/license/MIT]
