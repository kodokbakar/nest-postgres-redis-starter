# TS + NestJS + Postgres + Redis (Docker)

## Quickstart
1. `cp .env.example .env`
2. `docker compose up -d --build`
3. Health: `curl http://localhost:3000/healthz`

## Services
- API: http://localhost:3000
- Postgres: localhost:5432
- Redis: localhost:6379
