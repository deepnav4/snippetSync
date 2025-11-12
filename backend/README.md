# 🚀 Snippet Sync Backend

A robust, production-ready backend API for **Snippet Sync** - a code snippet sharing platform with VS Code integration. Built with TypeScript, Express, and Prisma.

## ✨ Features

- **Authentication & Authorization**: JWT-based auth with refresh tokens
- **User Management**: Register, login, profile management
- **Snippet Management**: Create, read, update, delete code snippets
- **Visibility Control**: Public snippets (home feed) and private snippets (shareable links)
- **Social Features**: Upvotes and comments on snippets
- **VS Code Integration**: Special endpoint for importing snippets directly into VS Code
- **Security**: Rate limiting, CORS, Helmet, password hashing
- **Database**: SQLite for development, PostgreSQL for production
- **Validation**: Request validation with express-validator
- **Error Handling**: Centralized error handling

## 📋 Table of Contents

- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Database Schema](#-database-schema)
- [API Endpoints](#-api-endpoints)
- [Setup & Installation](#-setup--installation)
- [Environment Variables](#-environment-variables)
- [VS Code Extension Integration](#-vs-code-extension-integration)
- [Deployment](#-deployment)

## 🛠 Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: SQLite (dev), PostgreSQL (prod)
- **ORM**: Prisma
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **Validation**: express-validator
- **Security**: Helmet, CORS, express-rate-limit
- **Logging**: Morgan

## 📁 Project Structure

```
backend/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── controllers/           # Request handlers
│   │   ├── authController.ts
│   │   ├── snippetController.ts
│   │   ├── upvoteController.ts
│   │   └── commentController.ts
│   ├── services/              # Business logic
│   │   ├── authService.ts
│   │   ├── snippetService.ts
│   │   ├── upvoteService.ts
│   │   └── commentService.ts
│   ├── routes/                # API routes
│   │   ├── authRoutes.ts
│   │   ├── snippetRoutes.ts
│   │   ├── upvoteRoutes.ts
│   │   └── commentRoutes.ts
│   ├── middleware/            # Custom middleware
│   │   ├── auth.ts
│   │   ├── errorHandler.ts
│   │   └── validation.ts
│   ├── utils/                 # Helper functions
│   │   ├── jwt.ts
│   │   ├── password.ts
│   │   └── response.ts
│   ├── types/                 # TypeScript types
│   │   ├── index.ts
│   │   └── express.d.ts
│   ├── app.ts                 # Express app setup
│   └── server.ts              # Server entry point
├── .env.example               # Environment variables template
├── .gitignore
├── package.json
├── tsconfig.json
└── nodemon.json
```

## 🗄 Database Schema

### User Model
- `id` (UUID, Primary Key)
- `username` (String, Unique)
- `email` (String, Unique)
- `passwordHash` (String)
- `profilePicture` (String, Optional)
- `bio` (String, Optional)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

### Snippet Model
- `id` (UUID, Primary Key)
- `title` (String)
- `description` (String, Optional)
- `language` (String)
- `code` (String)
- `visibility` (Enum: PUBLIC | PRIVATE)
- `shareSlug` (UUID, Unique) - For private snippet sharing
- `authorId` (UUID, Foreign Key)
- `upvotesCount` (Int, Default: 0)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

### Comment Model
- `id` (UUID, Primary Key)
- `content` (String)
- `snippetId` (UUID, Foreign Key)
- `authorId` (UUID, Foreign Key)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

### Upvote Model
- `id` (UUID, Primary Key)
- `snippetId` (UUID, Foreign Key)
- `userId` (UUID, Foreign Key)
- `createdAt` (DateTime)
- **Unique Constraint**: (snippetId, userId) - One upvote per user per snippet

### RefreshToken Model
- `id` (UUID, Primary Key)
- `token` (String, Unique)
- `userId` (UUID, Foreign Key)
- `expiresAt` (DateTime)
- `createdAt` (DateTime)

### Tag Model (Optional, for future)
- `id` (UUID, Primary Key)
- `name` (String, Unique)

## 🔌 API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/signup` | Public | Register new user |
| POST | `/login` | Public | Login user |
| POST | `/refresh` | Public | Refresh access token |
| POST | `/logout` | Private | Logout user |
| GET | `/profile` | Private | Get current user profile |

### Snippet Routes (`/api/snippets`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/public` | Public | Get all public snippets (paginated) |
| GET | `/import/:slug` | Public | Get snippet by share slug (VS Code) |
| POST | `/` | Private | Create new snippet |
| GET | `/:id` | Public* | Get snippet by ID |
| PUT | `/:id` | Private | Update snippet (author only) |
| DELETE | `/:id` | Private | Delete snippet (author only) |
| GET | `/user/:userId` | Public* | Get user's snippets |

*Public but requires auth for private snippets

### Upvote Routes (`/api/snippets`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/:id/upvote` | Private | Toggle upvote on snippet |
| GET | `/:id/upvote/check` | Private | Check if user upvoted |

### Comment Routes (`/api/snippets`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/:id/comments` | Public | Get snippet comments |
| POST | `/:id/comments` | Private | Create comment |
| PUT | `/comments/:commentId` | Private | Update comment (author only) |
| DELETE | `/comments/:commentId` | Private | Delete comment (author only) |

### Health Check

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/health` | Public | Server health status |

## 🚀 Setup & Installation

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- SQLite (pre-installed on most systems)

### Installation Steps

1. **Clone the repository and navigate to backend**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Setup environment variables**:
   ```bash
   copy .env.example .env
   ```
   Then edit `.env` with your configuration.

4. **Generate Prisma Client**:
   ```bash
   npm run prisma:generate
   ```

5. **Run database migrations**:
   ```bash
   npm run prisma:migrate
   ```

6. **Start development server**:
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:5000`

### Additional Commands

```bash
# Build for production
npm run build

# Start production server
npm start

# Open Prisma Studio (database GUI)
npm run prisma:studio

# Push database schema (without migrations)
npm run prisma:push

# Run tests
npm test

# Lint code
npm run lint
```

## 🔐 Environment Variables

Create a `.env` file in the backend root directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database URL
# For SQLite (local development):
DATABASE_URL="file:./dev.db"

# For PostgreSQL (production):
# DATABASE_URL="postgresql://user:password@localhost:5432/snippetsync?schema=public"

# JWT Secrets (CHANGE THESE IN PRODUCTION!)
JWT_ACCESS_SECRET=your-super-secret-access-token-key
JWT_REFRESH_SECRET=your-super-secret-refresh-token-key

# JWT Expiration
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Cookie Settings
COOKIE_DOMAIN=localhost
COOKIE_SECURE=false
COOKIE_SAME_SITE=lax
```

### Production Environment Variables

For production, make sure to:
1. Use strong, random JWT secrets
2. Set `NODE_ENV=production`
3. Use PostgreSQL instead of SQLite
4. Set `COOKIE_SECURE=true`
5. Configure proper CORS_ORIGIN

## 🔌 VS Code Extension Integration

The backend provides a special endpoint for VS Code extension integration:

### Endpoint: `/api/snippets/import/:slug`

**Method**: GET  
**Access**: Public  
**URL Parameter**: `slug` - The unique share slug of the snippet

**Example Request**:
```
GET http://localhost:5000/api/snippets/import/123e4567-e89b-12d3-a456-426614174000
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "React useState Hook Example",
    "language": "javascript",
    "code": "import { useState } from 'react';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  return <button onClick={() => setCount(count + 1)}>{count}</button>;\n}",
    "description": "Simple counter component",
    "author": {
      "id": "user-id",
      "username": "johndoe",
      "profilePicture": null
    },
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### VS Code Extension Workflow

1. User copies a snippet share URL from the web app
2. User runs command in VS Code: "Import Snippet"
3. Extension extracts the `shareSlug` from the URL
4. Extension calls `/api/snippets/import/:slug`
5. Backend returns snippet data
6. Extension creates a new file with the snippet code

### Authentication for Private Snippets (Optional)

If you want to restrict access to private snippets even via share link, you can add authentication:

```typescript
// In VS Code extension
const response = await fetch(`${API_URL}/api/snippets/import/${slug}`, {
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});
```

## 📊 API Response Format

All API responses follow this consistent format:

**Success Response**:
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message"
}
```

**Error Response**:
```json
{
  "success": false,
  "error": "Error message description"
}
```

**Validation Error Response**:
```json
{
  "success": false,
  "error": "Validation failed",
  "data": [
    {
      "field": "email",
      "message": "Invalid email address"
    }
  ]
}
```

## 🚢 Deployment

### Option 1: Railway

1. Install Railway CLI:
   ```bash
   npm install -g @railway/cli
   ```

2. Login to Railway:
   ```bash
   railway login
   ```

3. Initialize project:
   ```bash
   railway init
   ```

4. Add PostgreSQL:
   ```bash
   railway add postgresql
   ```

5. Set environment variables in Railway dashboard

6. Deploy:
   ```bash
   railway up
   ```

### Option 2: Render

1. Create a new Web Service on Render.com
2. Connect your GitHub repository
3. Configure:
   - **Build Command**: `npm install && npm run prisma:generate && npm run build`
   - **Start Command**: `npm start`
4. Add PostgreSQL database
5. Set environment variables in dashboard
6. Deploy!

### Option 3: Heroku

1. Install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create snippet-sync-api`
4. Add PostgreSQL: `heroku addons:create heroku-postgresql:mini`
5. Set environment variables: `heroku config:set KEY=value`
6. Deploy: `git push heroku main`

### Post-Deployment Checklist

- [ ] Run database migrations: `npm run prisma:migrate`
- [ ] Verify all environment variables are set
- [ ] Test API endpoints
- [ ] Configure CORS for frontend domain
- [ ] Enable SSL/HTTPS
- [ ] Setup monitoring and logging
- [ ] Configure automatic backups for database

## 🔒 Security Best Practices

1. **JWT Secrets**: Use strong, random strings (min 32 characters)
2. **HTTPS**: Always use HTTPS in production
3. **Rate Limiting**: Adjust limits based on your needs
4. **CORS**: Only allow trusted domains
5. **Input Validation**: All inputs are validated
6. **SQL Injection**: Protected by Prisma ORM
7. **Password Storage**: Bcrypt with salt rounds of 10
8. **Refresh Tokens**: Stored in HTTP-only cookies

## 📝 Authentication Flow

1. **Signup/Login**: User provides credentials
2. **Token Generation**: Server generates access token (15min) and refresh token (7 days)
3. **Token Storage**: 
   - Access token: Stored in frontend (localStorage/memory)
   - Refresh token: HTTP-only cookie
4. **API Requests**: Include access token in Authorization header
5. **Token Refresh**: When access token expires, use refresh token to get new one
6. **Logout**: Delete refresh token from database and clear cookie

## 🧪 Testing

To run tests (when implemented):

```bash
npm test
```

## 📈 Performance Optimization

- **Database Indexing**: Indexed on `authorId`, `visibility`, `shareSlug`, `createdAt`
- **Denormalized Counts**: `upvotesCount` stored directly on snippets
- **Pagination**: All list endpoints support pagination
- **Connection Pooling**: Prisma handles connection pooling
- **Rate Limiting**: Prevents abuse

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - feel free to use this project for learning or production.

## 🐛 Troubleshooting

### Prisma Client not generated
```bash
npm run prisma:generate
```

### Database connection issues
- Check DATABASE_URL in .env
- For SQLite, ensure write permissions in directory
- For PostgreSQL, verify connection string

### Port already in use
Change PORT in .env file

### CORS errors
Verify CORS_ORIGIN matches your frontend URL

## 📞 Support

For issues or questions, please create an issue on GitHub.

---

Built with ❤️ for the developer community
