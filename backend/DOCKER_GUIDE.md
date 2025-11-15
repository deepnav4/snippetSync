# 🐳 Docker Setup Guide - Learn Step by Step

## 📚 What is Docker?
Docker is like a "shipping container" for your application. It packages:
- Your code
- Node.js runtime
- Dependencies (npm packages)
- Database

Everything runs in isolated "containers" that work the same everywhere!

## 🏗️ Architecture
```
┌─────────────────────────────────┐
│     Docker Compose              │
│  (Orchestrates everything)      │
└─────────────────────────────────┘
         │
         ├──────────────┬───────────────┐
         │              │               │
    ┌───▼────┐    ┌────▼─────┐   ┌────▼─────┐
    │Backend │    │PostgreSQL│   │ Volume   │
    │Container│◄──┤ Database │   │(Data)    │
    │Port 5000│   │Port 5432 │   │          │
    └─────────┘   └──────────┘   └──────────┘
```

## 📝 Files Explained

### 1. **Dockerfile** (Recipe for Backend Container)
- `FROM node:20-alpine` - Use lightweight Node.js 20
- `WORKDIR /app` - Set working directory
- `COPY package*.json` - Copy package files
- `RUN npm install` - Install dependencies
- `COPY prisma` - Copy database schema
- `RUN prisma generate` - Generate Prisma client
- `COPY . .` - Copy all code
- `RUN npm run build` - Build TypeScript
- `EXPOSE 5000` - Open port 5000
- `CMD ["npm", "start"]` - Start the server

### 2. **docker-compose.yml** (Multi-Container Setup)
Defines 2 services:
- **postgres**: Database container
- **backend**: Your API container

### 3. **.dockerignore** (Files to Exclude)
Like .gitignore but for Docker. Excludes node_modules, .env, etc.

## 🚀 Steps to Run

### Step 1: Make sure Docker Desktop is running
Open Docker Desktop app on Windows

### Step 2: Navigate to backend folder
```powershell
cd c:\Users\User\Desktop\100xdevs\frontendProjectys\snippetSync-proj\backend
```

### Step 3: Build and start containers
```powershell
docker-compose up --build
```

What this does:
1. Downloads PostgreSQL image
2. Builds your backend image
3. Starts database container
4. Waits for database to be ready
5. Runs database migrations
6. Starts backend container

### Step 4: Check if it's running
Open browser: http://localhost:5000

### Step 5: View logs
```powershell
docker-compose logs -f
```

### Step 6: Stop containers
```powershell
docker-compose down
```

### Step 7: Stop and remove all data
```powershell
docker-compose down -v
```

## 🔍 Useful Commands

### See running containers
```powershell
docker ps
```

### See all containers (including stopped)
```powershell
docker ps -a
```

### See images
```powershell
docker images
```

### Access backend container shell
```powershell
docker exec -it snippetsync-backend sh
```

### Access database container shell
```powershell
docker exec -it snippetsync-db psql -U postgres -d snippetsync
```

### View backend logs
```powershell
docker logs snippetsync-backend
```

### Restart just backend
```powershell
docker-compose restart backend
```

### Rebuild backend (after code changes)
```powershell
docker-compose up --build backend
```

## 🎯 Your Backend URL
Once running, access at:
- **API**: http://localhost:5000
- **Database**: localhost:5432

## 🐛 Troubleshooting

### Port already in use
```powershell
# Find process using port 5000
Get-NetTCPConnection -LocalPort 5000 | Select-Object OwningProcess
# Kill it
Stop-Process -Id <ProcessId> -Force
```

### Database connection failed
- Make sure postgres container is healthy
- Check `docker-compose logs postgres`

### Code changes not reflected
- Rebuild: `docker-compose up --build`

## 🎓 Learning Points

1. **Containers are isolated** - Each runs independently
2. **Volumes persist data** - Database data survives container restarts
3. **Networks connect containers** - Backend can talk to postgres by name
4. **Build once, run anywhere** - Same container works on any machine
5. **Health checks** - Backend waits for database to be ready

Ready to start? Let's do it! 🚀
