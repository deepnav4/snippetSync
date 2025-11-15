# 🐳 Frontend Docker Setup Guide

This guide will help you run the SnippetSync frontend using Docker with Nginx.

## 📋 Prerequisites

- Docker Desktop installed ([Download here](https://www.docker.com/products/docker-desktop))
- Docker Compose (included with Docker Desktop)

## 🚀 Quick Start

### Option 1: Using Docker Compose (Recommended)

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Update API endpoint (if needed):**
   
   Edit `src/lib/axios.ts` to point to your backend:
   ```typescript
   const api = axios.create({
     baseURL: 'http://localhost:5000/api',  // Update if backend is on different host
   });
   ```

3. **Start the frontend:**
   ```bash
   docker-compose up -d
   ```

4. **Check logs:**
   ```bash
   docker-compose logs -f frontend
   ```

5. **Access the application:**
   - Frontend: http://localhost:3000

### Option 2: Docker Only (Manual Setup)

1. **Build the Docker image:**
   ```bash
   docker build -t snippetsync-frontend .
   ```

2. **Run the container:**
   ```bash
   docker run -d \
     -p 3000:80 \
     --name snippetsync-frontend \
     snippetsync-frontend
   ```

## 🛠️ Common Commands

### Start Service
```bash
docker-compose up -d
```

### Stop Service
```bash
docker-compose down
```

### View Logs
```bash
docker-compose logs -f frontend
```

### Restart Frontend
```bash
docker-compose restart frontend
```

### Rebuild After Code Changes
```bash
docker-compose up -d --build
```

### Execute Commands in Container
```bash
# Access container shell
docker exec -it snippetsync-frontend sh

# Check Nginx configuration
docker exec -it snippetsync-frontend nginx -t
```

## 🔧 Configuration

### Change Port

Edit `docker-compose.yml` to change the port:

```yaml
services:
  frontend:
    ports:
      - "8080:80"  # Change 8080 to your desired port
```

### Custom Nginx Configuration

Edit `nginx.conf` to customize:
- Caching rules
- Compression settings
- Security headers
- API proxy settings

### Environment-Specific Builds

For different environments, update the API endpoint before building:

**Development:**
```typescript
baseURL: 'http://localhost:5000/api'
```

**Production:**
```typescript
baseURL: 'https://api.yourdomain.com/api'
```

## 🌐 API Proxy Configuration

If you want to proxy API requests through Nginx (useful for CORS), uncomment in `nginx.conf`:

```nginx
location /api {
    proxy_pass http://backend:5000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
```

Then update your axios config to use relative URLs:
```typescript
baseURL: '/api'
```

## 🔍 Troubleshooting

### Port Already in Use
If port 3000 is already in use, change it in `docker-compose.yml`:

```yaml
ports:
  - "8080:80"  # Use 8080 instead
```

### API Connection Issues
1. Verify backend is running:
   ```bash
   curl http://localhost:5000/health
   ```

2. Check browser console for CORS errors

3. Ensure API baseURL is correct in `src/lib/axios.ts`

### Container Won't Start
1. Check logs for errors:
   ```bash
   docker-compose logs frontend
   ```

2. Rebuild without cache:
   ```bash
   docker-compose build --no-cache
   docker-compose up -d
   ```

### Build Failures
1. Clear npm cache locally:
   ```bash
   npm cache clean --force
   ```

2. Remove node_modules and rebuild:
   ```bash
   rm -rf node_modules
   docker-compose build --no-cache
   ```

### Static Assets Not Loading
1. Check Nginx configuration:
   ```bash
   docker exec -it snippetsync-frontend nginx -t
   ```

2. Verify files in container:
   ```bash
   docker exec -it snippetsync-frontend ls -la /usr/share/nginx/html
   ```

## 🚀 Production Deployment

For production deployment:

1. **Update API endpoint:**
   ```typescript
   baseURL: process.env.VITE_API_URL || 'https://api.yourdomain.com/api'
   ```

2. **Build with production API URL:**
   Create `.env.production`:
   ```env
   VITE_API_URL=https://api.yourdomain.com/api
   ```

3. **Enable HTTPS:**
   - Use a reverse proxy (Nginx, Traefik, Caddy)
   - Configure SSL certificates
   - Update Nginx config for HTTPS

4. **Optimize Nginx:**
   - Enable HTTP/2
   - Configure CDN
   - Set up rate limiting

## 📊 Monitoring

### Health Check
```bash
curl http://localhost:3000
```

### Container Stats
```bash
docker stats snippetsync-frontend
```

### Nginx Access Logs
```bash
docker exec -it snippetsync-frontend tail -f /var/log/nginx/access.log
```

### Nginx Error Logs
```bash
docker exec -it snippetsync-frontend tail -f /var/log/nginx/error.log
```

## 🧹 Cleanup

Remove containers and images:
```bash
docker-compose down
docker rmi snippetsync-frontend
```

Complete cleanup:
```bash
docker-compose down
docker system prune -a
```

## 🏗️ Build Optimization

The Dockerfile uses multi-stage builds for optimization:
- **Stage 1 (builder):** Installs dependencies and builds React app
- **Stage 2 (production):** Uses lightweight Nginx Alpine image with only built assets

This results in:
- Smaller image size (~30MB vs 1GB+)
- Faster deployments
- Better security (no build tools in production)

## 📝 Notes

- Frontend is served by Nginx on port 80 inside container
- React Router uses HTML5 history mode
- All routes redirect to `index.html` for client-side routing
- Static assets are cached for 1 year
- Gzip compression is enabled for text files

## 🆘 Support

If you encounter issues:
1. Check logs: `docker-compose logs -f frontend`
2. Verify Docker is running: `docker ps`
3. Check port availability: `netstat -ano | findstr :3000`
4. Ensure backend is accessible
5. Review Nginx configuration: `docker exec -it snippetsync-frontend nginx -t`

## 🔗 Full Stack Setup

To run both frontend and backend together, see the root-level `docker-compose.yml` for complete stack deployment.




# Access MySQL command line inside the container
docker exec -it snippetsync-db mysql -u snippetuser -psnippetpass snippetsync