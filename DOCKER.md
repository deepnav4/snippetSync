# 🐳 SnippetSync - Complete Docker Setup Guide

This guide will help you run the entire SnippetSync application (Frontend + Backend + Database) using Docker.


// clone the repository
// cd backend
// docker-compose up -d
// backend will be at http://localhost:5000

docker exec -it snippetsync-db mysql -u snippetuser -psnippetpass snippetsync

## 📋 Prerequisites

- **Docker Desktop** installed and running
  - Windows: [Download Docker Desktop](https://www.docker.com/products/docker-desktop)
  - Mac: [Download Docker Desktop](https://www.docker.com/products/docker-desktop)
  - Linux: Install Docker Engine and Docker Compose
- **Minimum System Requirements:**
  - 4GB RAM
  - 10GB free disk space
  - Docker Desktop running

## 🚀 Quick Start (Full Stack)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd snippetSync-proj
```

### 2. Create Environment File (Optional)
Create a `.env` file in the root directory:
```env
JWT_ACCESS_SECRET=your-super-strong-secret-key-here-min-32-chars
JWT_REFRESH_SECRET=your-another-strong-secret-key-here-min-32-chars
```

💡 **Tip:** Generate strong secrets:
```bash
# On Linux/Mac
openssl rand -base64 32

# On Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Max 256 }))
```

### 3. Start All Services
```bash
docker-compose up -d
```

This will start:
- ✅ PostgreSQL Database (port 5432)
- ✅ Backend API (port 5000)
- ✅ Frontend App (port 3000)

### 4. Wait for Services to Be Ready
```bash
docker-compose logs -f
```

Watch for:
- `postgres` - "database system is ready to accept connections"
- `backend` - "Server running on port 5000"
- `frontend` - Nginx started successfully

Press `Ctrl+C` to exit logs.

### 5. Access the Application
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **API Health Check:** http://localhost:5000/health

## 🛠️ Common Commands

### Start Services
```bash
docker-compose up -d
```

### Stop Services
```bash
docker-compose down
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### Check Service Status
```bash
docker-compose ps
```

### Restart a Service
```bash
docker-compose restart backend
docker-compose restart frontend
```

### Rebuild After Code Changes
```bash
# Rebuild and restart specific service
docker-compose up -d --build backend

# Rebuild all services
docker-compose up -d --build
```

### Stop and Remove Everything (including data)
```bash
docker-compose down -v
```
⚠️ **Warning:** This will delete all database data!

## 🔧 Service-Specific Commands

### Backend Commands
```bash
# Access backend shell
docker exec -it snippetsync-backend sh

# Run Prisma migrations
docker exec -it snippetsync-backend npx prisma migrate deploy

# Open Prisma Studio
docker exec -it snippetsync-backend npx prisma studio

# View backend logs
docker-compose logs -f backend
```

### Frontend Commands
```bash
# Access frontend shell
docker exec -it snippetsync-frontend sh

# Check Nginx configuration
docker exec -it snippetsync-frontend nginx -t

# View frontend logs
docker-compose logs -f frontend

# Reload Nginx
docker exec -it snippetsync-frontend nginx -s reload
```

### Database Commands
```bash
# Access PostgreSQL CLI
docker exec -it snippetsync-postgres psql -U snippetsync -d snippetsync

# Backup database
docker exec snippetsync-postgres pg_dump -U snippetsync snippetsync > backup.sql

# Restore database
docker exec -i snippetsync-postgres psql -U snippetsync snippetsync < backup.sql

# View database logs
docker-compose logs -f postgres
```

## 📊 Monitoring & Health Checks

### Check if All Services are Running
```bash
docker-compose ps
```

Expected output:
```
NAME                      STATUS              PORTS
snippetsync-backend       Up (healthy)        0.0.0.0:5000->5000/tcp
snippetsync-frontend      Up (healthy)        0.0.0.0:3000->80/tcp
snippetsync-postgres      Up (healthy)        0.0.0.0:5432->5432/tcp
```

### Test Backend Health
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{"status":"ok","timestamp":"2025-11-14T..."}
```

### Test Frontend
```bash
curl http://localhost:3000
```

Should return the HTML of the React app.

### View Resource Usage
```bash
docker stats
```

## 🔍 Troubleshooting

### Port Already in Use

**Problem:** Port 3000, 5000, or 5432 is already taken.

**Solution:** Edit `docker-compose.yml` and change the port mapping:
```yaml
services:
  frontend:
    ports:
      - "8080:80"  # Change 3000 to 8080
  backend:
    ports:
      - "5001:5000"  # Change 5000 to 5001
  postgres:
    ports:
      - "5433:5432"  # Change 5432 to 5433
```

### Service Won't Start

**Problem:** Container exits immediately.

**Solution:**
1. Check logs:
   ```bash
   docker-compose logs backend
   ```

2. Rebuild without cache:
   ```bash
   docker-compose build --no-cache backend
   docker-compose up -d backend
   ```

### Database Connection Failed

**Problem:** Backend can't connect to database.

**Solution:**
1. Check if postgres is healthy:
   ```bash
   docker-compose ps postgres
   ```

2. Restart postgres:
   ```bash
   docker-compose restart postgres
   ```

3. Check database logs:
   ```bash
   docker-compose logs postgres
   ```

### Frontend Shows 502 Bad Gateway

**Problem:** Frontend can't reach backend.

**Solution:**
1. Ensure backend is running:
   ```bash
   docker-compose ps backend
   ```

2. Check backend logs:
   ```bash
   docker-compose logs backend
   ```

3. Verify API URL in frontend code:
   - Check `frontend/src/lib/axios.ts`
   - Should be `http://localhost:5000/api`

### Docker Out of Memory

**Problem:** Services crash due to memory.

**Solution:**
1. Increase Docker memory in Docker Desktop settings
2. Minimum recommended: 4GB RAM

### Prisma Migration Issues

**Problem:** Migrations won't run.

**Solution:**
```bash
# Reset database (⚠️ deletes all data)
docker-compose down -v
docker-compose up -d

# Or manually run migrations
docker exec -it snippetsync-backend npx prisma migrate deploy
```

## 🌍 Environment Variables

### Backend Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Backend port | `5000` | No |
| `NODE_ENV` | Environment | `production` | No |
| `DATABASE_URL` | PostgreSQL URL | Auto-set | Yes |
| `JWT_ACCESS_SECRET` | JWT access secret | - | Yes |
| `JWT_REFRESH_SECRET` | JWT refresh secret | - | Yes |
| `JWT_ACCESS_EXPIRY` | Access token expiry | `15m` | No |
| `JWT_REFRESH_EXPIRY` | Refresh token expiry | `7d` | No |
| `CORS_ORIGIN` | Allowed origins | `localhost:3000` | No |

### Frontend Environment Variables

Frontend uses build-time variables. To change API URL, edit `frontend/src/lib/axios.ts` before building.

## 🚀 Production Deployment

For production environments:

### 1. Generate Strong Secrets
```bash
# Generate two different secrets
openssl rand -base64 32
openssl rand -base64 32
```

### 2. Create Production .env File
```env
JWT_ACCESS_SECRET=<generated-secret-1>
JWT_REFRESH_SECRET=<generated-secret-2>
NODE_ENV=production
```

### 3. Update API URL in Frontend
Edit `frontend/src/lib/axios.ts`:
```typescript
const api = axios.create({
  baseURL: 'https://api.yourdomain.com/api',
});
```

### 4. Enable HTTPS
- Use a reverse proxy (Nginx, Traefik, Caddy)
- Configure SSL certificates (Let's Encrypt)
- Update `COOKIE_SECURE=true` in backend env

### 5. Use External Database (Recommended)
- Remove `postgres` service from docker-compose
- Update `DATABASE_URL` to point to managed PostgreSQL
- Use services like: AWS RDS, Google Cloud SQL, Neon, Supabase

### 6. Enable Monitoring
- Add logging service (ELK, Grafana)
- Set up health check endpoints
- Configure alerts

## 📦 Backup & Restore

### Backup Everything
```bash
# Backup database
docker exec snippetsync-postgres pg_dump -U snippetsync snippetsync > backup-$(date +%Y%m%d).sql

# Backup volumes
docker run --rm -v snippetsync_postgres_data:/data -v $(pwd):/backup alpine tar czf /backup/postgres-data-$(date +%Y%m%d).tar.gz /data
```

### Restore Database
```bash
docker exec -i snippetsync-postgres psql -U snippetsync snippetsync < backup-20251114.sql
```

## 🧹 Cleanup

### Remove Stopped Containers
```bash
docker-compose down
```

### Remove All Data (including volumes)
```bash
docker-compose down -v
```

### Complete Cleanup (free disk space)
```bash
docker-compose down -v
docker system prune -a --volumes
```

⚠️ **Warning:** This removes all unused Docker data!

## 📁 Project Structure

```
snippetSync-proj/
├── backend/
│   ├── Dockerfile              # Backend Docker image
│   ├── docker-compose.yml      # Backend-only compose
│   ├── DOCKER.md              # Backend Docker docs
│   └── .dockerignore
├── frontend/
│   ├── Dockerfile              # Frontend Docker image
│   ├── docker-compose.yml      # Frontend-only compose
│   ├── nginx.conf             # Nginx configuration
│   ├── DOCKER.md              # Frontend Docker docs
│   └── .dockerignore
├── docker-compose.yml          # Full stack compose (this is what you run)
└── DOCKER.md                  # This file
```

## 🎯 Development Workflow

### Local Development (without Docker)
```bash
# Terminal 1 - Backend
cd backend
npm install
npm run dev

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev
```

### Testing with Docker
```bash
# Build and run
docker-compose up -d --build

# Make code changes
# Rebuild specific service
docker-compose up -d --build backend

# View logs
docker-compose logs -f backend
```

## 📝 Tips & Best Practices

1. **Always use `.dockerignore`** to exclude `node_modules` and other unnecessary files
2. **Use multi-stage builds** to keep images small
3. **Set resource limits** in production
4. **Use named volumes** for persistent data
5. **Implement health checks** for all services
6. **Use secrets management** for sensitive data
7. **Regular backups** of database
8. **Monitor resource usage** with `docker stats`
9. **Keep images updated** with `docker-compose pull`
10. **Use `.env` files** for environment-specific config

## 🆘 Getting Help

If you encounter issues:

1. **Check logs:**
   ```bash
   docker-compose logs -f
   ```

2. **Verify services:**
   ```bash
   docker-compose ps
   ```

3. **Check Docker:**
   ```bash
   docker version
   docker-compose version
   ```

4. **Restart everything:**
   ```bash
   docker-compose restart
   ```

5. **Nuclear option (reset everything):**
   ```bash
   docker-compose down -v
   docker system prune -a
   docker-compose up -d --build
   ```

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Backend Docker Guide](./backend/DOCKER.md)
- [Frontend Docker Guide](./frontend/DOCKER.md)

## ✅ Quick Checklist

Before deploying to production:

- [ ] Strong JWT secrets generated
- [ ] API URL updated in frontend
- [ ] CORS origins configured
- [ ] HTTPS/SSL enabled
- [ ] External database configured
- [ ] Backup strategy in place
- [ ] Monitoring set up
- [ ] Health checks working
- [ ] Resource limits set
- [ ] Logs aggregation enabled

---

**Happy Dockerizing! 🐳🚀**
