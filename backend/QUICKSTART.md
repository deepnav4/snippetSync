# 🚀 Quick Start Guide - Snippet Sync Backend

Get the Snippet Sync backend up and running in 5 minutes!

## Prerequisites

Before you begin, make sure you have:
- ✅ Node.js v18 or higher installed ([Download](https://nodejs.org/))
- ✅ npm (comes with Node.js)
- ✅ A code editor (VS Code recommended)

---

## Step 1: Install Dependencies

Navigate to the backend directory and install all required packages:

```powershell
cd backend
npm install
```

This will install:
- Express.js (web framework)
- Prisma (database ORM)
- TypeScript (type safety)
- JWT for authentication
- And all other dependencies

**Expected output**: You should see a progress bar and "added X packages" message.

---

## Step 2: Setup Environment Variables

Create your environment configuration file:

```powershell
copy .env.example .env
```

The `.env` file is already configured for local development with SQLite. You don't need to change anything for now!

**What's configured**:
- Server runs on port 5000
- SQLite database (no setup needed!)
- JWT secrets for development
- CORS enabled for localhost:3000

---

## Step 3: Initialize Database

Generate the Prisma Client and create the database:

```powershell
npm run prisma:generate
npm run prisma:migrate
```

**What this does**:
1. `prisma:generate` - Creates TypeScript types from your schema
2. `prisma:migrate` - Creates the SQLite database file and tables

**Expected output**: You should see "Your database is now in sync with your schema."

---

## Step 4: Start Development Server

Start the backend server in development mode:

```powershell
npm run dev
```

**Expected output**:
```
🚀 Server is running on http://localhost:5000
📝 Environment: development
🔒 CORS origin: http://localhost:3000
```

**Success!** Your backend is now running! 🎉

---

## Step 5: Test the API

### Option 1: Health Check (Browser)

Open your browser and navigate to:
```
http://localhost:5000/health
```

You should see:
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Option 2: Test with PowerShell

```powershell
# Test health endpoint
Invoke-RestMethod -Uri "http://localhost:5000/health" -Method Get

# Test signup (create a user)
$body = @{
    username = "testuser"
    email = "test@example.com"
    password = "password123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/signup" -Method Post -Body $body -ContentType "application/json"
```

### Option 3: Use Postman or Thunder Client

1. Create a new request
2. Method: POST
3. URL: `http://localhost:5000/api/auth/signup`
4. Body (JSON):
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```
5. Send!

---

## Project Structure Overview

```
backend/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── controllers/           # Route handlers
│   ├── services/              # Business logic
│   ├── routes/                # API endpoints
│   ├── middleware/            # Auth, validation, etc.
│   ├── utils/                 # Helper functions
│   ├── types/                 # TypeScript types
│   ├── app.ts                 # Express app setup
│   └── server.ts              # Server entry point
├── .env                       # Your environment variables
├── .env.example               # Template
├── package.json               # Dependencies
└── tsconfig.json              # TypeScript config
```

---

## Useful Commands

### Development

```powershell
# Start dev server with auto-reload
npm run dev

# Build TypeScript to JavaScript
npm run build

# Start production build
npm start
```

### Database

```powershell
# Open Prisma Studio (visual database editor)
npm run prisma:studio

# Create new migration
npm run prisma:migrate

# Reset database (⚠️ deletes all data)
npx prisma migrate reset

# View database in GUI
npm run prisma:studio
```

### Maintenance

```powershell
# Run linter
npm run lint

# Run tests
npm test
```

---

## API Endpoints Quick Reference

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/logout` - Logout
- `GET /api/auth/profile` - Get user profile

### Snippets
- `GET /api/snippets/public` - List public snippets
- `POST /api/snippets` - Create snippet (auth required)
- `GET /api/snippets/:id` - Get snippet
- `PUT /api/snippets/:id` - Update snippet (auth required)
- `DELETE /api/snippets/:id` - Delete snippet (auth required)
- `GET /api/snippets/import/:slug` - Import snippet (VS Code)

### Social
- `POST /api/snippets/:id/upvote` - Toggle upvote
- `GET /api/snippets/:id/comments` - Get comments
- `POST /api/snippets/:id/comments` - Add comment
- `PUT /api/comments/:commentId` - Update comment
- `DELETE /api/comments/:commentId` - Delete comment

**Full API documentation**: See [API_DOCS.md](./API_DOCS.md)

---

## Common Issues & Solutions

### Issue: Port 5000 already in use

**Solution**: Change the port in `.env`:
```env
PORT=3001
```

### Issue: Prisma Client not found

**Solution**: Generate the Prisma Client:
```powershell
npm run prisma:generate
```

### Issue: Database locked (SQLite)

**Solution**: Close Prisma Studio or any DB browser, then restart the server.

### Issue: TypeScript errors

**Solution**: Make sure dependencies are installed:
```powershell
npm install
```

### Issue: CORS errors from frontend

**Solution**: Update `CORS_ORIGIN` in `.env` to match your frontend URL:
```env
CORS_ORIGIN=http://localhost:5173
```

---

## Testing the Complete Flow

### 1. Register a User

```powershell
$signup = @{
    username = "alice"
    email = "alice@example.com"
    password = "secure123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/signup" -Method Post -Body $signup -ContentType "application/json"
$token = $response.data.accessToken
```

### 2. Create a Snippet

```powershell
$snippet = @{
    title = "Hello World in Python"
    language = "python"
    code = "print('Hello, World!')"
    visibility = "PUBLIC"
} | ConvertTo-Json

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

Invoke-RestMethod -Uri "http://localhost:5000/api/snippets" -Method Post -Body $snippet -Headers $headers
```

### 3. Get Public Snippets

```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/snippets/public" -Method Get
```

---

## Next Steps

Now that your backend is running:

1. ✅ **Explore the API** - Check out [API_DOCS.md](./API_DOCS.md)
2. ✅ **Connect Frontend** - Build your React frontend
3. ✅ **VS Code Extension** - See [VSCODE_INTEGRATION.md](./VSCODE_INTEGRATION.md)
4. ✅ **Database Schema** - Learn more in [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)
5. ✅ **Deploy** - See deployment section in [README.md](./README.md)

---

## Development Tips

### Use Prisma Studio

Prisma Studio is a visual database editor. Open it with:

```powershell
npm run prisma:studio
```

Navigate to `http://localhost:5555` to:
- View all your data
- Add/edit/delete records
- See table relationships

### Hot Reload

The dev server uses `nodemon` for auto-reload. Any changes to `.ts` files will automatically restart the server.

### Debugging

Add breakpoints in VS Code:
1. Go to Run & Debug (Ctrl+Shift+D)
2. Click "Create a launch.json file"
3. Select "Node.js"
4. Add this configuration:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Backend",
  "runtimeExecutable": "npm",
  "runtimeArgs": ["run", "dev"],
  "console": "integratedTerminal",
  "skipFiles": ["<node_internals>/**"]
}
```

---

## Production Deployment

### Quick Deploy to Railway

```powershell
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Add PostgreSQL
railway add postgresql

# Deploy
railway up
```

See full deployment guide in [README.md](./README.md#-deployment)

---

## Getting Help

- 📖 **Documentation**: Check the docs folder
- 🐛 **Issues**: Create an issue on GitHub
- 💬 **Community**: Join our Discord (link)

---

## Congratulations! 🎉

You now have a fully functional backend for Snippet Sync!

**What you've built**:
- ✅ RESTful API with authentication
- ✅ Database with proper relationships
- ✅ Public & private snippet sharing
- ✅ Social features (upvotes, comments)
- ✅ VS Code integration endpoint

**Ready to build something awesome!** 🚀

---

**Need help?** Re-run any command above or check the full documentation.
