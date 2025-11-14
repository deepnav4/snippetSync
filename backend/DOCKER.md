# 🐳 Backend Docker Setup Guide

This guide will help you run the SnippetSync backend using Docker.

## 📋 Prerequisites

- Docker Desktop installed ([Download here](https://www.docker.com/products/docker-desktop))
- Docker Compose (included with Docker Desktop)

## 🚀 Quick Start

### Option 1: Using Docker Compose (Recommended)

Docker Compose will start both PostgreSQL database and the backend API.

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create environment file (optional):**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and set your JWT secrets:
   ```env
   JWT_ACCESS_SECRET=your-strong-secret-here
   JWT_REFRESH_SECRET=your-another-strong-secret-here
   ```

3. **Start all services:**
   ```bash
   docker-compose up -d
   ```

4. **Check logs:**
   ```bash
   docker-compose logs -f backend
   ```

5. **Access the API:**
   - API: http://localhost:5000
   - Health Check: http://localhost:5000/health

### Option 2: Docker Only (Manual Setup)

If you already have a PostgreSQL database running:

1. **Build the Docker image:**
   ```bash
   docker build -t snippetsync-backend .
   ```

2. **Run the container:**
   ```bash
   docker run -d \
     -p 5000:5000 \
     -e DATABASE_URL="postgresql://user:password@host:5432/dbname?schema=public" \
     -e JWT_ACCESS_SECRET="your-secret" \
     -e JWT_REFRESH_SECRET="your-secret" \
     --name snippetsync-backend \
     snippetsync-backend
   ```

## 🛠️ Common Commands

### Start Services
```bash
docker-compose up -d
```

### Stop Services
```bash
docker-compose down
```

### Stop and Remove Volumes (⚠️ Deletes all data)
```bash
docker-compose down -v
```

### View Logs
```bash
# All services
docker-compose logs -f

# Backend only
docker-compose logs -f backend

# PostgreSQL only
docker-compose logs -f postgres
```

### Restart Backend
```bash
docker-compose restart backend
```

### Rebuild After Code Changes
```bash
docker-compose up -d --build backend
```

### Execute Commands in Container
```bash
# Access backend shell
docker exec -it snippetsync-backend sh

# Run Prisma commands
docker exec -it snippetsync-backend npx prisma studio
docker exec -it snippetsync-backend npx prisma migrate deploy
```

### Database Management
```bash
# Access PostgreSQL CLI
docker exec -it snippetsync-postgres psql -U snippetsync -d snippetsync

# Backup database
docker exec snippetsync-postgres pg_dump -U snippetsync snippetsync > backup.sql

# Restore database
docker exec -i snippetsync-postgres psql -U snippetsync snippetsync < backup.sql
```

## 🗄️ Database Migrations

Migrations run automatically when the container starts. To run manually:

```bash
docker exec -it snippetsync-backend npx prisma migrate deploy
```

## 🔍 Troubleshooting

### Port Already in Use
If port 5000 or 5432 is already in use, edit `docker-compose.yml`:

```yaml
services:
  backend:
    ports:
      - "5001:5000"  # Change host port
  postgres:
    ports:
      - "5433:5432"  # Change host port
```

### Database Connection Issues
1. Check if PostgreSQL is healthy:
   ```bash
   docker-compose ps
   ```

2. Verify connection string in logs:
   ```bash
   docker-compose logs backend | grep DATABASE
   ```

### Container Won't Start
1. Check logs for errors:
   ```bash
   docker-compose logs backend
   ```

2. Rebuild without cache:
   ```bash
   docker-compose build --no-cache backend
   docker-compose up -d backend
   ```

### Permission Issues on Windows
Run Docker Desktop as Administrator or ensure WSL2 is properly configured.

## 🌍 Environment Variables

Key environment variables you can override in `.env` or `docker-compose.yml`:

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Backend port | `5000` |
| `DATABASE_URL` | PostgreSQL connection string | Auto-configured |
| `JWT_ACCESS_SECRET` | JWT access token secret | Required |
| `JWT_REFRESH_SECRET` | JWT refresh token secret | Required |
| `CORS_ORIGIN` | Allowed CORS origins | `http://localhost:5173` |
| `NODE_ENV` | Environment mode | `production` |

## 🔐 Production Deployment

For production deployment:

1. **Generate strong secrets:**
   ```bash
   # On Linux/Mac
   openssl rand -base64 32

   # On Windows (PowerShell)
   [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Max 256 }))
   ```

2. **Update docker-compose.yml:**
   - Set strong JWT secrets
   - Configure HTTPS/SSL
   - Update CORS_ORIGIN
   - Set COOKIE_SECURE=true

3. **Use external database:**
   - Remove postgres service
   - Update DATABASE_URL to point to managed PostgreSQL

4. **Enable HTTPS:**
   - Use a reverse proxy (Nginx, Traefik, Caddy)
   - Configure SSL certificates

## 📊 Monitoring

### Health Check
```bash
curl http://localhost:5000/health
```

### Container Stats
```bash
docker stats snippetsync-backend
```

### Resource Usage
```bash
docker-compose ps
docker-compose top
```

## 🧹 Cleanup

Remove all containers, networks, and volumes:
```bash
docker-compose down -v
docker system prune -a
```

## 📝 Notes

- Database data persists in Docker volume `postgres_data`
- Migrations run automatically on container start
- Backend rebuilds automatically with `--build` flag
- Logs rotate automatically by Docker daemon

## 🆘 Support

If you encounter issues:
1. Check logs: `docker-compose logs -f`
2. Verify Docker is running: `docker ps`
3. Check port availability: `netstat -ano | findstr :5000`
4. Review environment variables
5. Ensure .env file exists with proper values
