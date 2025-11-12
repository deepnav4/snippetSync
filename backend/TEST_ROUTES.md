# 🧪 API Routes Testing Guide - Step by Step

## Prerequisites
Server should be running at: `http://localhost:5000`

---

## ✅ 1. HEALTH CHECK (First Test)

### Test: Server Health
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/health" -Method Get
```

**Expected Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-11-12T..."
}
```

---

## 🔐 2. AUTHENTICATION ROUTES

### 2.1 User Signup (Registration)

**Endpoint:** `POST /api/auth/signup`

```powershell
$signupBody = @{
    username = "testuser1"
    email = "testuser1@example.com"
    password = "password123"
} | ConvertTo-Json

$signupResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/signup" -Method Post -Body $signupBody -ContentType "application/json"

# Save the access token
$accessToken = $signupResponse.data.accessToken
Write-Host "Access Token: $accessToken"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Test Validations:**
```powershell
# Test: Username too short (should fail)
$invalidSignup = @{
    username = "ab"
    email = "test@example.com"
    password = "password123"
} | ConvertTo-Json

try {
    Invoke-RestMethod -Uri "http://localhost:5000/api/auth/signup" -Method Post -Body $invalidSignup -ContentType "application/json"
} catch {
    Write-Host "✅ Validation working: Username too short rejected"
    $_.Exception.Response
}

# Test: Invalid email (should fail)
$invalidEmail = @{
    username = "testuser2"
    email = "invalid-email"
    password = "password123"
} | ConvertTo-Json

try {
    Invoke-RestMethod -Uri "http://localhost:5000/api/auth/signup" -Method Post -Body $invalidEmail -ContentType "application/json"
} catch {
    Write-Host "✅ Validation working: Invalid email rejected"
}

# Test: Password too short (should fail)
$shortPassword = @{
    username = "testuser3"
    email = "test3@example.com"
    password = "12345"
} | ConvertTo-Json

try {
    Invoke-RestMethod -Uri "http://localhost:5000/api/auth/signup" -Method Post -Body $shortPassword -ContentType "application/json"
} catch {
    Write-Host "✅ Validation working: Short password rejected"
}

# Test: Duplicate email (should fail)
$duplicateEmail = @{
    username = "testuser4"
    email = "testuser1@example.com"
    password = "password123"
} | ConvertTo-Json

try {
    Invoke-RestMethod -Uri "http://localhost:5000/api/auth/signup" -Method Post -Body $duplicateEmail -ContentType "application/json"
} catch {
    Write-Host "✅ Validation working: Duplicate email rejected"
}
```

---

### 2.2 User Login

**Endpoint:** `POST /api/auth/login`

```powershell
$loginBody = @{
    email = "testuser1@example.com"
    password = "password123"
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method Post -Body $loginBody -ContentType "application/json"

# Save the access token
$accessToken = $loginResponse.data.accessToken
Write-Host "Access Token: $accessToken"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Test Invalid Login:**
```powershell
# Test: Wrong password
$wrongPassword = @{
    email = "testuser1@example.com"
    password = "wrongpassword"
} | ConvertTo-Json

try {
    Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method Post -Body $wrongPassword -ContentType "application/json"
} catch {
    Write-Host "✅ Security working: Wrong password rejected"
}

# Test: Non-existent user
$nonExistentUser = @{
    email = "nonexistent@example.com"
    password = "password123"
} | ConvertTo-Json

try {
    Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method Post -Body $nonExistentUser -ContentType "application/json"
} catch {
    Write-Host "✅ Security working: Non-existent user rejected"
}
```

---

### 2.3 Get User Profile (Protected Route)

**Endpoint:** `GET /api/auth/profile`

```powershell
# Use the access token from signup/login
$headers = @{
    "Authorization" = "Bearer $accessToken"
}

$profileResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/profile" -Method Get -Headers $headers

Write-Host "User Profile:"
$profileResponse.data | ConvertTo-Json -Depth 3
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "id": "user-uuid",
    "username": "testuser1",
    "email": "testuser1@example.com",
    "profilePicture": null,
    "bio": null,
    "createdAt": "2025-11-12T...",
    "_count": {
      "snippets": 0,
      "comments": 0,
      "upvotes": 0
    }
  }
}
```

**Test Without Token:**
```powershell
# Test: Access without token (should fail)
try {
    Invoke-RestMethod -Uri "http://localhost:5000/api/auth/profile" -Method Get
} catch {
    Write-Host "✅ Authentication working: Unauthorized access rejected"
}

# Test: Invalid token (should fail)
$invalidHeaders = @{
    "Authorization" = "Bearer invalid-token-here"
}

try {
    Invoke-RestMethod -Uri "http://localhost:5000/api/auth/profile" -Method Get -Headers $invalidHeaders
} catch {
    Write-Host "✅ Authentication working: Invalid token rejected"
}
```

---

### 2.4 Logout

**Endpoint:** `POST /api/auth/logout`

```powershell
$headers = @{
    "Authorization" = "Bearer $accessToken"
}

$logoutResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/logout" -Method Post -Headers $headers

Write-Host "Logout Response:"
$logoutResponse | ConvertTo-Json
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

## 📝 3. SNIPPET ROUTES

### 3.1 Create Snippet (Protected)

**Endpoint:** `POST /api/snippets`

```powershell
# First, login to get a fresh token
$loginBody = @{
    email = "testuser1@example.com"
    password = "password123"
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
$accessToken = $loginResponse.data.accessToken

# Create snippet
$snippetBody = @{
    title = "React useState Hook Example"
    description = "Simple counter component using hooks"
    language = "javascript"
    code = "import { useState } from 'react';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  return <button onClick={() => setCount(count + 1)}>{count}</button>;\n}"
    visibility = "PUBLIC"
} | ConvertTo-Json

$headers = @{
    "Authorization" = "Bearer $accessToken"
}

$snippetResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/snippets" -Method Post -Body $snippetBody -ContentType "application/json" -Headers $headers

Write-Host "Snippet Created:"
$snippetResponse.data | ConvertTo-Json -Depth 3

# Save snippet ID for later tests
$snippetId = $snippetResponse.data.id
$shareSlug = $snippetResponse.data.shareSlug
Write-Host "Snippet ID: $snippetId"
Write-Host "Share Slug: $shareSlug"
```

**Expected Response:**
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
    "shareSlug": "unique-uuid",
    "upvotesCount": 0,
    "author": {
      "id": "user-uuid",
      "username": "testuser1",
      "profilePicture": null
    },
    "createdAt": "2025-11-12T...",
    "updatedAt": "2025-11-12T...",
    "_count": {
      "comments": 0,
      "upvotes": 0
    }
  }
}
```

**Create Multiple Snippets for Testing:**
```powershell
# Python snippet
$pythonSnippet = @{
    title = "Python Hello World"
    language = "python"
    code = "print('Hello, World!')"
    visibility = "PUBLIC"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/snippets" -Method Post -Body $pythonSnippet -ContentType "application/json" -Headers $headers

# Private snippet
$privateSnippet = @{
    title = "Private API Keys"
    language = "javascript"
    code = "const API_KEY = 'secret-key-12345';"
    visibility = "PRIVATE"
} | ConvertTo-Json

$privateSnippetResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/snippets" -Method Post -Body $privateSnippet -ContentType "application/json" -Headers $headers

$privateSnippetId = $privateSnippetResponse.data.id
$privateShareSlug = $privateSnippetResponse.data.shareSlug
```

**Test Validations:**
```powershell
# Test: Missing required fields
$invalidSnippet = @{
    title = "Test"
} | ConvertTo-Json

try {
    Invoke-RestMethod -Uri "http://localhost:5000/api/snippets" -Method Post -Body $invalidSnippet -ContentType "application/json" -Headers $headers
} catch {
    Write-Host "✅ Validation working: Missing fields rejected"
}

# Test: Without authentication
try {
    Invoke-RestMethod -Uri "http://localhost:5000/api/snippets" -Method Post -Body $snippetBody -ContentType "application/json"
} catch {
    Write-Host "✅ Authentication working: Unauthenticated request rejected"
}
```

---

### 3.2 Get Public Snippets

**Endpoint:** `GET /api/snippets/public`

```powershell
# Get all public snippets (no auth required)
$publicSnippets = Invoke-RestMethod -Uri "http://localhost:5000/api/snippets/public" -Method Get

Write-Host "Public Snippets:"
$publicSnippets.data | ConvertTo-Json -Depth 4

# With pagination
$pagedSnippets = Invoke-RestMethod -Uri "http://localhost:5000/api/snippets/public?page=1&limit=10" -Method Get

Write-Host "`nPaginated Snippets:"
$pagedSnippets.data.snippets | ConvertTo-Json -Depth 3
Write-Host "`nPagination Info:"
$pagedSnippets.data.pagination | ConvertTo-Json

# With language filter
$jsSnippets = Invoke-RestMethod -Uri "http://localhost:5000/api/snippets/public?language=javascript" -Method Get

Write-Host "`nJavaScript Snippets:"
$jsSnippets.data.snippets.Count

# With search
$searchResults = Invoke-RestMethod -Uri "http://localhost:5000/api/snippets/public?search=react" -Method Get

Write-Host "`nSearch Results for 'react':"
$searchResults.data.snippets | ConvertTo-Json -Depth 3
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "snippets": [
      {
        "id": "snippet-uuid",
        "title": "React useState Hook Example",
        "language": "javascript",
        "code": "...",
        "visibility": "PUBLIC",
        "upvotesCount": 0,
        "author": {
          "id": "user-uuid",
          "username": "testuser1",
          "profilePicture": null
        },
        "createdAt": "2025-11-12T...",
        "_count": {
          "comments": 0,
          "upvotes": 0
        }
      }
    ],
    "pagination": {
      "total": 2,
      "page": 1,
      "limit": 20,
      "totalPages": 1
    }
  }
}
```

---

### 3.3 Get Snippet by ID

**Endpoint:** `GET /api/snippets/:id`

```powershell
# Get public snippet (no auth required)
$snippet = Invoke-RestMethod -Uri "http://localhost:5000/api/snippets/$snippetId" -Method Get

Write-Host "Snippet Details:"
$snippet.data | ConvertTo-Json -Depth 4

# Try to get private snippet without auth (should fail)
try {
    Invoke-RestMethod -Uri "http://localhost:5000/api/snippets/$privateSnippetId" -Method Get
} catch {
    Write-Host "✅ Privacy working: Private snippet access denied without auth"
}

# Get private snippet with auth (if you're the author)
$headers = @{
    "Authorization" = "Bearer $accessToken"
}

$privateSnippet = Invoke-RestMethod -Uri "http://localhost:5000/api/snippets/$privateSnippetId" -Method Get -Headers $headers

Write-Host "`nPrivate Snippet (authenticated):"
$privateSnippet.data | ConvertTo-Json -Depth 4
```

---

### 3.4 Get Snippet by Share Slug (VS Code Import)

**Endpoint:** `GET /api/snippets/import/:slug`

```powershell
# Get snippet by share slug (works for both public and private)
$sharedSnippet = Invoke-RestMethod -Uri "http://localhost:5000/api/snippets/import/$shareSlug" -Method Get

Write-Host "Shared Snippet:"
$sharedSnippet.data | ConvertTo-Json -Depth 3

# Get private snippet by share slug (works without auth!)
$sharedPrivateSnippet = Invoke-RestMethod -Uri "http://localhost:5000/api/snippets/import/$privateShareSlug" -Method Get

Write-Host "`nPrivate Snippet via Share Slug (no auth needed):"
$sharedPrivateSnippet.data | ConvertTo-Json -Depth 3
```

---

### 3.5 Update Snippet (Protected, Author Only)

**Endpoint:** `PUT /api/snippets/:id`

```powershell
$updateBody = @{
    title = "React useState Hook - Updated"
    description = "Updated description with more details"
} | ConvertTo-Json

$headers = @{
    "Authorization" = "Bearer $accessToken"
}

$updateResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/snippets/$snippetId" -Method Put -Body $updateBody -ContentType "application/json" -Headers $headers

Write-Host "Updated Snippet:"
$updateResponse.data | ConvertTo-Json -Depth 3
```

**Test: Update someone else's snippet (should fail):**
```powershell
# Create a second user
$user2Body = @{
    username = "testuser2"
    email = "testuser2@example.com"
    password = "password123"
} | ConvertTo-Json

$user2Response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/signup" -Method Post -Body $user2Body -ContentType "application/json"
$user2Token = $user2Response.data.accessToken

# Try to update user1's snippet with user2's token (should fail)
$headers2 = @{
    "Authorization" = "Bearer $user2Token"
}

try {
    Invoke-RestMethod -Uri "http://localhost:5000/api/snippets/$snippetId" -Method Put -Body $updateBody -ContentType "application/json" -Headers $headers2
} catch {
    Write-Host "✅ Authorization working: Cannot update other user's snippet"
}
```

---

### 3.6 Delete Snippet (Protected, Author Only)

**Endpoint:** `DELETE /api/snippets/:id`

```powershell
# Create a snippet to delete
$deleteTestSnippet = @{
    title = "To Be Deleted"
    language = "text"
    code = "This will be deleted"
    visibility = "PUBLIC"
} | ConvertTo-Json

$headers = @{
    "Authorization" = "Bearer $accessToken"
}

$toDeleteResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/snippets" -Method Post -Body $deleteTestSnippet -ContentType "application/json" -Headers $headers
$toDeleteId = $toDeleteResponse.data.id

# Delete the snippet
$deleteResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/snippets/$toDeleteId" -Method Delete -Headers $headers

Write-Host "Delete Response:"
$deleteResponse | ConvertTo-Json

# Verify it's deleted
try {
    Invoke-RestMethod -Uri "http://localhost:5000/api/snippets/$toDeleteId" -Method Get
} catch {
    Write-Host "✅ Deletion successful: Snippet not found"
}
```

---

### 3.7 Get User's Snippets

**Endpoint:** `GET /api/snippets/user/:userId`

```powershell
# Get user ID from profile
$headers = @{
    "Authorization" = "Bearer $accessToken"
}

$profile = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/profile" -Method Get -Headers $headers
$userId = $profile.data.id

# Get user's snippets (authenticated as the user)
$userSnippets = Invoke-RestMethod -Uri "http://localhost:5000/api/snippets/user/$userId" -Method Get -Headers $headers

Write-Host "User's All Snippets (including private):"
$userSnippets.data | ConvertTo-Json -Depth 3

# Get user's snippets without auth (only public)
$publicUserSnippets = Invoke-RestMethod -Uri "http://localhost:5000/api/snippets/user/$userId" -Method Get

Write-Host "`nUser's Public Snippets:"
$publicUserSnippets.data | ConvertTo-Json -Depth 3
```

---

## 👍 4. UPVOTE ROUTES

### 4.1 Toggle Upvote

**Endpoint:** `POST /api/snippets/:id/upvote`

```powershell
$headers = @{
    "Authorization" = "Bearer $accessToken"
}

# First upvote
$upvoteResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/snippets/$snippetId/upvote" -Method Post -Headers $headers

Write-Host "Upvote Response:"
$upvoteResponse.data | ConvertTo-Json

# Toggle (remove upvote)
$removeUpvoteResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/snippets/$snippetId/upvote" -Method Post -Headers $headers

Write-Host "`nRemove Upvote Response:"
$removeUpvoteResponse.data | ConvertTo-Json

# Upvote again
$upvoteAgainResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/snippets/$snippetId/upvote" -Method Post -Headers $headers

Write-Host "`nUpvote Again Response:"
$upvoteAgainResponse.data | ConvertTo-Json
```

**Test: Upvote without auth (should fail):**
```powershell
try {
    Invoke-RestMethod -Uri "http://localhost:5000/api/snippets/$snippetId/upvote" -Method Post
} catch {
    Write-Host "✅ Authentication working: Upvote requires auth"
}
```

---

### 4.2 Check Upvote Status

**Endpoint:** `GET /api/snippets/:id/upvote/check`

```powershell
$headers = @{
    "Authorization" = "Bearer $accessToken"
}

$upvoteStatus = Invoke-RestMethod -Uri "http://localhost:5000/api/snippets/$snippetId/upvote/check" -Method Get -Headers $headers

Write-Host "Upvote Status:"
$upvoteStatus.data | ConvertTo-Json
```

---

## 💬 5. COMMENT ROUTES

### 5.1 Create Comment

**Endpoint:** `POST /api/snippets/:id/comments`

```powershell
$commentBody = @{
    content = "Great snippet! Very helpful for understanding React hooks."
} | ConvertTo-Json

$headers = @{
    "Authorization" = "Bearer $accessToken"
}

$commentResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/snippets/$snippetId/comments" -Method Post -Body $commentBody -ContentType "application/json" -Headers $headers

Write-Host "Comment Created:"
$commentResponse.data | ConvertTo-Json -Depth 3

# Save comment ID for later
$commentId = $commentResponse.data.id

# Create more comments
$comment2 = @{
    content = "Thanks for sharing!"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/snippets/$snippetId/comments" -Method Post -Body $comment2 -ContentType "application/json" -Headers $headers
```

**Test Validations:**
```powershell
# Test: Empty comment (should fail)
$emptyComment = @{
    content = ""
} | ConvertTo-Json

try {
    Invoke-RestMethod -Uri "http://localhost:5000/api/snippets/$snippetId/comments" -Method Post -Body $emptyComment -ContentType "application/json" -Headers $headers
} catch {
    Write-Host "✅ Validation working: Empty comment rejected"
}

# Test: Comment without auth (should fail)
try {
    Invoke-RestMethod -Uri "http://localhost:5000/api/snippets/$snippetId/comments" -Method Post -Body $commentBody -ContentType "application/json"
} catch {
    Write-Host "✅ Authentication working: Unauthenticated comment rejected"
}
```

---

### 5.2 Get Snippet Comments

**Endpoint:** `GET /api/snippets/:id/comments`

```powershell
# Get all comments (no auth required)
$comments = Invoke-RestMethod -Uri "http://localhost:5000/api/snippets/$snippetId/comments" -Method Get

Write-Host "All Comments:"
$comments.data | ConvertTo-Json -Depth 3
```

---

### 5.3 Update Comment (Author Only)

**Endpoint:** `PUT /api/comments/:commentId`

```powershell
$updateCommentBody = @{
    content = "Updated comment: Even more helpful with the detailed explanation!"
} | ConvertTo-Json

$headers = @{
    "Authorization" = "Bearer $accessToken"
}

$updateCommentResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/comments/$commentId" -Method Put -Body $updateCommentBody -ContentType "application/json" -Headers $headers

Write-Host "Updated Comment:"
$updateCommentResponse.data | ConvertTo-Json -Depth 3
```

**Test: Update someone else's comment (should fail):**
```powershell
# Use user2's token to try updating user1's comment
$headers2 = @{
    "Authorization" = "Bearer $user2Token"
}

try {
    Invoke-RestMethod -Uri "http://localhost:5000/api/comments/$commentId" -Method Put -Body $updateCommentBody -ContentType "application/json" -Headers $headers2
} catch {
    Write-Host "✅ Authorization working: Cannot update other user's comment"
}
```

---

### 5.4 Delete Comment (Author Only)

**Endpoint:** `DELETE /api/comments/:commentId`

```powershell
# Create a comment to delete
$deleteCommentBody = @{
    content = "This comment will be deleted"
} | ConvertTo-Json

$headers = @{
    "Authorization" = "Bearer $accessToken"
}

$toDeleteCommentResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/snippets/$snippetId/comments" -Method Post -Body $deleteCommentBody -ContentType "application/json" -Headers $headers
$toDeleteCommentId = $toDeleteCommentResponse.data.id

# Delete the comment
$deleteCommentResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/comments/$toDeleteCommentId" -Method Delete -Headers $headers

Write-Host "Delete Comment Response:"
$deleteCommentResponse | ConvertTo-Json
```

---

## 📊 6. COMPLETE INTEGRATION TEST

```powershell
Write-Host "=== COMPLETE API TEST SUITE ===" -ForegroundColor Cyan
Write-Host ""

# 1. Health Check
Write-Host "1. Testing Health Check..." -ForegroundColor Yellow
$health = Invoke-RestMethod -Uri "http://localhost:5000/health" -Method Get
Write-Host "✅ Server is healthy: $($health.status)" -ForegroundColor Green

# 2. User Signup
Write-Host "`n2. Testing User Signup..." -ForegroundColor Yellow
$signupBody = @{
    username = "integrationtest"
    email = "integration@test.com"
    password = "testpass123"
} | ConvertTo-Json

$signup = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/signup" -Method Post -Body $signupBody -ContentType "application/json"
$token = $signup.data.accessToken
Write-Host "✅ User created successfully" -ForegroundColor Green

# 3. Get Profile
Write-Host "`n3. Testing Get Profile..." -ForegroundColor Yellow
$headers = @{ "Authorization" = "Bearer $token" }
$profile = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/profile" -Method Get -Headers $headers
Write-Host "✅ Profile retrieved: $($profile.data.username)" -ForegroundColor Green

# 4. Create Snippet
Write-Host "`n4. Testing Create Snippet..." -ForegroundColor Yellow
$snippetBody = @{
    title = "Integration Test Snippet"
    language = "javascript"
    code = "console.log('Integration test');"
    visibility = "PUBLIC"
} | ConvertTo-Json

$snippet = Invoke-RestMethod -Uri "http://localhost:5000/api/snippets" -Method Post -Body $snippetBody -ContentType "application/json" -Headers $headers
$snippetId = $snippet.data.id
Write-Host "✅ Snippet created: $($snippet.data.title)" -ForegroundColor Green

# 5. Get Public Snippets
Write-Host "`n5. Testing Get Public Snippets..." -ForegroundColor Yellow
$publicSnippets = Invoke-RestMethod -Uri "http://localhost:5000/api/snippets/public" -Method Get
Write-Host "✅ Retrieved $($publicSnippets.data.snippets.Count) public snippets" -ForegroundColor Green

# 6. Upvote Snippet
Write-Host "`n6. Testing Upvote..." -ForegroundColor Yellow
$upvote = Invoke-RestMethod -Uri "http://localhost:5000/api/snippets/$snippetId/upvote" -Method Post -Headers $headers
Write-Host "✅ Upvote successful: $($upvote.data.message)" -ForegroundColor Green

# 7. Add Comment
Write-Host "`n7. Testing Add Comment..." -ForegroundColor Yellow
$commentBody = @{
    content = "Integration test comment"
} | ConvertTo-Json

$comment = Invoke-RestMethod -Uri "http://localhost:5000/api/snippets/$snippetId/comments" -Method Post -Body $commentBody -ContentType "application/json" -Headers $headers
Write-Host "✅ Comment added successfully" -ForegroundColor Green

# 8. Get Comments
Write-Host "`n8. Testing Get Comments..." -ForegroundColor Yellow
$comments = Invoke-RestMethod -Uri "http://localhost:5000/api/snippets/$snippetId/comments" -Method Get
Write-Host "✅ Retrieved $($comments.data.Count) comments" -ForegroundColor Green

Write-Host "`n=== ALL TESTS PASSED ===" -ForegroundColor Green
Write-Host ""
```

---

## 🎯 Summary Checklist

Run tests in this order:

- [ ] 1. Health Check
- [ ] 2.1 User Signup
- [ ] 2.2 User Login
- [ ] 2.3 Get Profile
- [ ] 2.4 Logout
- [ ] 3.1 Create Snippet
- [ ] 3.2 Get Public Snippets
- [ ] 3.3 Get Snippet by ID
- [ ] 3.4 Get Snippet by Share Slug
- [ ] 3.5 Update Snippet
- [ ] 3.6 Delete Snippet
- [ ] 3.7 Get User's Snippets
- [ ] 4.1 Toggle Upvote
- [ ] 4.2 Check Upvote Status
- [ ] 5.1 Create Comment
- [ ] 5.2 Get Comments
- [ ] 5.3 Update Comment
- [ ] 5.4 Delete Comment

---

**Testing Tips:**
1. Always test with valid data first
2. Then test edge cases (validation, auth, etc.)
3. Save important IDs (userId, snippetId, commentId) for subsequent tests
4. Keep track of your access tokens
5. Use different users to test authorization

**Common Issues:**
- 401: Token missing or invalid → Check Authorization header
- 403: Access denied → User doesn't own the resource
- 400: Validation failed → Check request body format
- 404: Not found → Check if resource exists

---

**Last Updated:** November 12, 2025
