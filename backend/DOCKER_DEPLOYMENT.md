# 🐳 Docker Deployment Guide

## Quick Start (For Anyone)

### Option 1: Using Docker Compose (Recommended)
This is the easiest way to run the entire application with database.

```bash
# Start everything with one command
docker-compose up -d

# View logs
docker-compose logs -f

# Stop everything
docker-compose down
```

That's it! Your backend will be running on `http://localhost:5000` 🚀

---

## What Happens When You Run It?

1. **MySQL Database** starts on port `3307` (to avoid conflicts with local MySQL)
2. **Backend waits** 15 seconds for MySQL to be ready
3. **Database migrations** run automatically (creates all tables)
4. **Server starts** on port `5000`

---

## For Other Developers

### Prerequisites
- Install [Docker Desktop](https://www.docker.com/products/docker-desktop)
- That's it! No Node.js or MySQL needed locally

### Steps to Run

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd backend
   ```

2. **Create environment file (optional)**
   ```bash
   # Create .env file if you want custom settings
   DATABASE_URL=mysql://snippetuser:snippetpass@mysql:3306/snippetsync
   JWT_SECRET=your-secret-key
   ```

3. **Start the application**
   ```bash
   docker-compose up -d
   ```

4. **Verify it's running**
   ```bash
   # Check container status
   docker ps
   
   # Should show:
   # - snippetsync-backend (port 5000)
   # - snippetsync-db (port 3307)
   ```

5. **Test the API**
   ```bash
   # Health check
   curl http://localhost:5000/health
   
   # Should return: {"status":"ok","timestamp":"..."}
   ```

---

## Useful Docker Commands

### View Logs
```bash
# All services
docker-compose logs -f

# Only backend
docker logs snippetsync-backend -f

# Only database
docker logs snippetsync-db -f
```

### Stop & Remove Containers
```bash
# Stop containers (data persists)
docker-compose stop

# Stop and remove containers (data persists in volumes)
docker-compose down

# Stop and remove everything including data
docker-compose down -v
```

### Restart Services
```bash
# Restart everything
docker-compose restart

# Restart only backend
docker restart snippetsync-backend
```

### Rebuild After Code Changes
```bash
# Rebuild and restart
docker-compose up -d --build
```

---

## Publishing Your Image to Docker Hub

If you want others to pull your pre-built image:

### 1. Build and Tag Your Image
```bash
# Login to Docker Hub
docker login

# Build and tag
docker build -t yourusername/snippetsync-backend:latest .

# Push to Docker Hub
docker push yourusername/snippetsync-backend:latest
```

### 2. Update docker-compose.yml
Replace the `build` section with `image`:

```yaml
backend:
  image: yourusername/snippetsync-backend:latest
  # Remove the build section
```

### 3. Others Can Now Run It
```bash
# Pull and run with one command
docker-compose up -d

# Docker will automatically pull the image from Docker Hub
```

---

## Environment Variables

The following environment variables are configured in `docker-compose.yml`:

| Variable | Default Value | Description |
|----------|---------------|-------------|
| `DATABASE_URL` | `mysql://snippetuser:snippetpass@mysql:3306/snippetsync` | Database connection string |
| `JWT_SECRET` | `your-super-secret-jwt-key-change-this-in-production` | Secret for JWT tokens |
| `JWT_REFRESH_SECRET` | `your-super-secret-refresh-jwt-key-change-this-too` | Secret for refresh tokens |
| `NODE_ENV` | `production` | Environment mode |
| `PORT` | `5000` | Server port |

**⚠️ Important:** Change the JWT secrets in production!

---

## Ports

| Service | Internal Port | External Port | Description |
|---------|---------------|---------------|-------------|
| Backend | 5000 | 5000 | API Server |
| MySQL | 3306 | 3307 | Database (mapped to 3307 to avoid conflicts) |

---

## Troubleshooting

### Port Already in Use
```bash
# If port 5000 is busy, change it in docker-compose.yml
ports:
  - "8000:5000"  # Use port 8000 instead
```

### MySQL Connection Failed
```bash
# Check MySQL is healthy
docker ps

# Should show "healthy" status for snippetsync-db
# If not, check logs:
docker logs snippetsync-db
```

### Container Keeps Restarting
```bash
# Check logs for errors
docker logs snippetsync-backend

# Common issues:
# - MySQL not ready yet (wait a bit longer)
# - Database connection string wrong
# - Migration failed
```

### Reset Everything
```bash
# Stop and remove everything including data
docker-compose down -v

# Start fresh
docker-compose up -d --build
```

---

## Architecture

```
┌─────────────────────────────────────┐
│         Docker Compose              │
├─────────────────────────────────────┤
│                                     │
│  ┌──────────────────────────────┐  │
│  │  snippetsync-backend         │  │
│  │  - Node.js 20                │  │
│  │  - Express API               │  │
│  │  - Prisma ORM                │  │
│  │  - Port: 5000                │  │
│  └──────────┬───────────────────┘  │
│             │                       │
│             │ connects to           │
│             ▼                       │
│  ┌──────────────────────────────┐  │
│  │  snippetsync-db              │  │
│  │  - MySQL 8.0                 │  │
│  │  - Database: snippetsync     │  │
│  │  - Port: 3307 → 3306         │  │
│  │  - Volume: mysql-data        │  │
│  └──────────────────────────────┘  │
│                                     │
└─────────────────────────────────────┘
```

---

## Next Steps

- Access API at `http://localhost:5000`
- Test endpoints using Postman or curl
- Check `API_DOCS.md` for available routes
- Frontend should connect to `http://localhost:5000/api`

---

## Production Deployment

For production deployment to platforms like Railway, AWS, or DigitalOcean:

1. **Push your image to Docker Hub** (see above)
2. **Use environment variables** for sensitive data
3. **Use managed database** (not Docker MySQL)
4. **Enable SSL/HTTPS**
5. **Set up proper logging and monitoring**

See `DOCKER_GUIDE.md` for more detailed Docker concepts and learning resources.

---

## Alternative: Running Without Docker Compose

If you want to run MySQL and backend separately using individual Docker commands:

### Step 1: Start MySQL Container
```bash
# Create a network for containers to communicate
docker network create snippetsync-network

# Start MySQL container
docker run -d \
  --name snippetsync-db \
  --network snippetsync-network \
  -p 3307:3306 \
  -e MYSQL_ROOT_PASSWORD=root123 \
  -e MYSQL_DATABASE=snippetsync \
  -e MYSQL_USER=snippetuser \
  -e MYSQL_PASSWORD=snippetpass \
  -v mysql-data:/var/lib/mysql \
  mysql:8.0

# Wait for MySQL to be ready (about 30 seconds)
docker logs snippetsync-db -f
# Press Ctrl+C when you see "ready for connections"
```

### Step 2: Build Backend Image
```bash
# Make sure you're in the backend directory
cd backend

# Build the Docker image
docker build -t snippetsync-backend .
```

### Step 3: Run Backend Container
```bash
# Run backend container connected to same network
docker run -d \
  --name snippetsync-backend \
  --network snippetsync-network \
  -p 5000:5000 \
  -e NODE_ENV=production \
  -e PORT=5000 \
  -e DATABASE_URL=mysql://snippetuser:snippetpass@snippetsync-db:3306/snippetsync \
  -e JWT_SECRET=your-super-secret-jwt-key-change-this-in-production \
  -e JWT_REFRESH_SECRET=your-super-secret-refresh-jwt-key-change-this-too \
  snippetsync-backend
```

### Step 4: Verify Everything is Running
```bash
# Check both containers are running
docker ps

# Check backend logs
docker logs snippetsync-backend -f

# Should see:
# ⏳ Waiting for MySQL to be ready...
# ✅ Starting migration process...
# 🔄 Running database migrations...
# ✅ Migrations complete!
# 🚀 Starting server...
# 🚀 Server is running on http://localhost:5000
```

### Step 5: Test the API
```bash
# Test health endpoint
curl http://localhost:5000/health

# Should return: {"status":"ok","timestamp":"..."}
```

### Management Commands

```bash
# Stop containers
docker stop snippetsync-backend snippetsync-db

# Start containers
docker start snippetsync-db
sleep 10  # Wait for MySQL
docker start snippetsync-backend

# Remove containers (data persists in volume)
docker rm snippetsync-backend snippetsync-db

# Remove network
docker network rm snippetsync-network

# Remove volume (⚠️ deletes all data)
docker volume rm mysql-data
```

### Or Use Pre-built Image from Docker Hub

```bash
# Pull the image
docker pull deepnav/snippetsync-backend:latest

# Run it (after MySQL is running)
docker run -d \
  --name snippetsync-backend \
  --network snippetsync-network \
  -p 5000:5000 \
  -e DATABASE_URL=mysql://snippetuser:snippetpass@snippetsync-db:3306/snippetsync \
  -e JWT_SECRET=your-secret-key \
  deepnav/snippetsync-backend:latest
```

**Note:** Docker Compose is recommended as it handles networking, dependencies, and orchestration automatically. Use the manual approach above only if you need fine-grained control.





git clone https://github.com/deepnav4/snippetSync.git
cd snippetSync/backend
docker-compose up -d




docker pull deepnav/snippetsync-backend:latest
docker run -p 5000:5000 deepnav/snippetsync-backend:latest