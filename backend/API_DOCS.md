# 📝 API Documentation - Snippet Sync

Complete API reference for Snippet Sync backend.

## Base URL

```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

## Authentication

Most endpoints require authentication using JWT tokens. Include the access token in the Authorization header:

```
Authorization: Bearer <your-access-token>
```

---

## 🔐 Authentication Endpoints

### 1. Register User

**POST** `/auth/signup`

Register a new user account.

**Request Body**:
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Validation Rules**:
- `username`: 3-30 characters, alphanumeric with underscores/hyphens
- `email`: Valid email format
- `password`: Minimum 6 characters

**Response** (201 Created):
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Errors**:
- 400: Email already registered / Username already taken / Validation failed

---

### 2. Login User

**POST** `/auth/login`

Authenticate user and receive tokens.

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Note**: Refresh token is sent as HTTP-only cookie.

**Errors**:
- 401: Invalid email or password

---

### 3. Refresh Access Token

**POST** `/auth/refresh`

Get a new access token using refresh token.

**Request**: Refresh token from cookie or body

**Request Body** (optional):
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Errors**:
- 401: Invalid or expired refresh token

---

### 4. Logout

**POST** `/auth/logout`

Logout user and invalidate refresh token.

**Headers**: `Authorization: Bearer <access-token>`

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

### 5. Get User Profile

**GET** `/auth/profile`

Get current authenticated user's profile.

**Headers**: `Authorization: Bearer <access-token>`

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "username": "johndoe",
    "email": "john@example.com",
    "profilePicture": null,
    "bio": "Full-stack developer",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "_count": {
      "snippets": 15,
      "comments": 42,
      "upvotes": 128
    }
  }
}
```

---

## 📄 Snippet Endpoints

### 1. Create Snippet

**POST** `/snippets`

Create a new code snippet.

**Headers**: `Authorization: Bearer <access-token>`

**Request Body**:
```json
{
  "title": "React useState Hook Example",
  "description": "Simple counter component using hooks",
  "language": "javascript",
  "code": "import { useState } from 'react';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  return <button onClick={() => setCount(count + 1)}>{count}</button>;\n}",
  "visibility": "PUBLIC"
}
```

**Fields**:
- `title` (required): 1-200 characters
- `description` (optional): Max 500 characters
- `language` (required): Programming language
- `code` (required): The code content
- `visibility` (optional): "PUBLIC" or "PRIVATE" (default: "PUBLIC")

**Response** (201 Created):
```json
{
  "success": true,
  "message": "Snippet created successfully",
  "data": {
    "id": "snippet-uuid",
    "title": "React useState Hook Example",
    "description": "Simple counter component using hooks",
    "language": "javascript",
    "code": "...",
    "visibility": "PUBLIC",
    "shareSlug": "unique-share-slug-uuid",
    "upvotesCount": 0,
    "author": {
      "id": "user-uuid",
      "username": "johndoe",
      "profilePicture": null
    },
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z",
    "_count": {
      "comments": 0,
      "upvotes": 0
    }
  }
}
```

---

### 2. Get Public Snippets

**GET** `/snippets/public`

Retrieve all public snippets with pagination and filters.

**Query Parameters**:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20, max: 100)
- `language` (optional): Filter by programming language
- `search` (optional): Search in title and description
- `order` (optional): "asc" or "desc" (default: "desc")

**Example**:
```
GET /snippets/public?page=1&limit=20&language=javascript&search=react
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "snippets": [
      {
        "id": "snippet-uuid",
        "title": "React useState Hook",
        "language": "javascript",
        "code": "...",
        "visibility": "PUBLIC",
        "upvotesCount": 42,
        "author": {
          "id": "user-uuid",
          "username": "johndoe",
          "profilePicture": null
        },
        "createdAt": "2024-01-15T10:30:00.000Z",
        "_count": {
          "comments": 5,
          "upvotes": 42
        }
      }
    ],
    "pagination": {
      "total": 150,
      "page": 1,
      "limit": 20,
      "totalPages": 8
    }
  }
}
```

---

### 3. Get Snippet by ID

**GET** `/snippets/:id`

Get a specific snippet by its ID.

**Headers**: `Authorization: Bearer <access-token>` (optional, required for private snippets)

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "snippet-uuid",
    "title": "React useState Hook",
    "description": "Example description",
    "language": "javascript",
    "code": "...",
    "visibility": "PUBLIC",
    "shareSlug": "share-slug-uuid",
    "upvotesCount": 42,
    "author": {
      "id": "user-uuid",
      "username": "johndoe",
      "profilePicture": null,
      "bio": "Developer"
    },
    "comments": [
      {
        "id": "comment-uuid",
        "content": "Great snippet!",
        "author": {
          "id": "user-uuid",
          "username": "janedoe",
          "profilePicture": null
        },
        "createdAt": "2024-01-15T11:00:00.000Z"
      }
    ],
    "createdAt": "2024-01-15T10:30:00.000Z",
    "_count": {
      "upvotes": 42
    }
  }
}
```

**Errors**:
- 404: Snippet not found
- 403: Access denied (private snippet, not the author)

---

### 4. Get Snippet by Share Slug (VS Code Import)

**GET** `/snippets/import/:slug`

Get snippet using its unique share slug. Used by VS Code extension.

**No authentication required** - allows importing private snippets via share link.

**Example**:
```
GET /snippets/import/123e4567-e89b-12d3-a456-426614174000
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "snippet-uuid",
    "title": "React Component",
    "language": "javascript",
    "code": "// Complete code here...",
    "description": "Description here",
    "author": {
      "id": "user-uuid",
      "username": "johndoe",
      "profilePicture": null
    },
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Errors**:
- 404: Snippet not found

---

### 5. Update Snippet

**PUT** `/snippets/:id`

Update an existing snippet (author only).

**Headers**: `Authorization: Bearer <access-token>`

**Request Body** (all fields optional):
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "language": "typescript",
  "code": "// Updated code",
  "visibility": "PRIVATE"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Snippet updated successfully",
  "data": {
    "id": "snippet-uuid",
    "title": "Updated Title",
    // ... full snippet data
  }
}
```

**Errors**:
- 404: Snippet not found
- 403: Access denied (not the author)

---

### 6. Delete Snippet

**DELETE** `/snippets/:id`

Delete a snippet (author only).

**Headers**: `Authorization: Bearer <access-token>`

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Snippet deleted successfully"
}
```

**Errors**:
- 404: Snippet not found
- 403: Access denied (not the author)

---

### 7. Get User's Snippets

**GET** `/snippets/user/:userId`

Get all snippets by a specific user.

**Headers**: `Authorization: Bearer <access-token>` (optional)

**Note**: Shows only public snippets unless requester is the author.

**Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "id": "snippet-uuid",
      "title": "Snippet Title",
      // ... snippet data
    }
  ]
}
```

---

## 👍 Upvote Endpoints

### 1. Toggle Upvote

**POST** `/snippets/:id/upvote`

Toggle upvote on a snippet (add if not upvoted, remove if already upvoted).

**Headers**: `Authorization: Bearer <access-token>`

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "upvoted": true,
    "message": "Upvote added"
  }
}
```

OR

```json
{
  "success": true,
  "data": {
    "upvoted": false,
    "message": "Upvote removed"
  }
}
```

**Errors**:
- 400: Snippet not found

---

### 2. Check Upvote Status

**GET** `/snippets/:id/upvote/check`

Check if current user has upvoted a snippet.

**Headers**: `Authorization: Bearer <access-token>`

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "hasUpvoted": true
  }
}
```

---

## 💬 Comment Endpoints

### 1. Get Snippet Comments

**GET** `/snippets/:id/comments`

Get all comments for a snippet.

**Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "id": "comment-uuid",
      "content": "Great snippet! Very helpful.",
      "author": {
        "id": "user-uuid",
        "username": "janedoe",
        "profilePicture": null
      },
      "createdAt": "2024-01-15T11:00:00.000Z",
      "updatedAt": "2024-01-15T11:00:00.000Z"
    }
  ]
}
```

---

### 2. Create Comment

**POST** `/snippets/:id/comments`

Add a comment to a snippet.

**Headers**: `Authorization: Bearer <access-token>`

**Request Body**:
```json
{
  "content": "This is a great snippet! Thanks for sharing."
}
```

**Validation**:
- `content`: 1-1000 characters

**Response** (201 Created):
```json
{
  "success": true,
  "message": "Comment created successfully",
  "data": {
    "id": "comment-uuid",
    "content": "This is a great snippet! Thanks for sharing.",
    "author": {
      "id": "user-uuid",
      "username": "johndoe",
      "profilePicture": null
    },
    "createdAt": "2024-01-15T11:00:00.000Z"
  }
}
```

**Errors**:
- 400: Snippet not found / Validation failed

---

### 3. Update Comment

**PUT** `/comments/:commentId`

Update a comment (author only).

**Headers**: `Authorization: Bearer <access-token>`

**Request Body**:
```json
{
  "content": "Updated comment text"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Comment updated successfully",
  "data": {
    "id": "comment-uuid",
    "content": "Updated comment text",
    // ... full comment data
  }
}
```

**Errors**:
- 404: Comment not found
- 403: Access denied (not the author)

---

### 4. Delete Comment

**DELETE** `/comments/:commentId`

Delete a comment (author only).

**Headers**: `Authorization: Bearer <access-token>`

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Comment deleted successfully"
}
```

**Errors**:
- 404: Comment not found
- 403: Access denied (not the author)

---

## 🏥 Health Check

### Health Status

**GET** `/health`

Check if the server is running.

**Response** (200 OK):
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## 🚨 Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "error": "Error message description"
}
```

### Common HTTP Status Codes

- `200 OK`: Request successful
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Missing or invalid authentication
- `403 Forbidden`: Authenticated but not authorized
- `404 Not Found`: Resource not found
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

---

## 🔄 Rate Limiting

API is rate-limited to prevent abuse:

- **Window**: 15 minutes
- **Max Requests**: 100 requests per IP
- **Headers**: Rate limit info included in response headers

**Rate Limit Headers**:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642248600
```

---

## 📝 Example Usage (JavaScript/TypeScript)

### Registration and Login

```javascript
// Register
const signupResponse = await fetch('http://localhost:5000/api/auth/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'johndoe',
    email: 'john@example.com',
    password: 'securepass123'
  })
});

const { data } = await signupResponse.json();
const accessToken = data.accessToken;

// Create snippet
const snippetResponse = await fetch('http://localhost:5000/api/snippets', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`
  },
  body: JSON.stringify({
    title: 'My Snippet',
    language: 'javascript',
    code: 'console.log("Hello World");',
    visibility: 'PUBLIC'
  })
});
```

---

## 🔗 Postman Collection

You can import this API into Postman for testing. Create a collection with:

1. Environment variables:
   - `baseUrl`: `http://localhost:5000/api`
   - `accessToken`: (set after login)

2. Pre-request script for authenticated endpoints:
   ```javascript
   pm.request.headers.add({
     key: 'Authorization',
     value: 'Bearer ' + pm.environment.get('accessToken')
   });
   ```

---

**Last Updated**: January 2024  
**API Version**: 1.0.0
