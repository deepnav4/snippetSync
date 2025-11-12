# 🗄️ Database Schema & ER Diagram - Snippet Sync

## Entity-Relationship Diagram

```
┌─────────────────────┐
│       User          │
├─────────────────────┤
│ id (PK)             │
│ username (UNIQUE)   │
│ email (UNIQUE)      │
│ passwordHash        │
│ profilePicture      │
│ bio                 │
│ createdAt           │
│ updatedAt           │
└─────────────────────┘
         │
         │ 1:N (author)
         │
         ├──────────────────────────┐
         │                          │
         ▼                          ▼
┌─────────────────────┐    ┌──────────────────┐
│      Snippet        │    │  RefreshToken    │
├─────────────────────┤    ├──────────────────┤
│ id (PK)             │    │ id (PK)          │
│ title               │    │ token (UNIQUE)   │
│ description         │    │ userId (FK)      │
│ language            │    │ expiresAt        │
│ code                │    │ createdAt        │
│ visibility (ENUM)   │    └──────────────────┘
│ shareSlug (UNIQUE)  │
│ authorId (FK)       │
│ upvotesCount        │
│ createdAt           │
│ updatedAt           │
└─────────────────────┘
         │
         │ 1:N
         ├──────────────┬──────────────┐
         │              │              │
         ▼              ▼              ▼
┌──────────────┐  ┌──────────┐  ┌──────────────┐
│   Comment    │  │  Upvote  │  │ SnippetTags  │
├──────────────┤  ├──────────┤  │ (Join Table) │
│ id (PK)      │  │ id (PK)  │  ├──────────────┤
│ content      │  │snippetId │  │ snippetId    │
│ snippetId(FK)│  │ userId   │  │ tagId        │
│ authorId (FK)│  │createdAt │  └──────────────┘
│ createdAt    │  └──────────┘         │
│ updatedAt    │       │               │
└──────────────┘       │               │
         │             │               │
         │             │               ▼
         │             │      ┌────────────────┐
         │             │      │      Tag       │
         │             │      ├────────────────┤
         │             │      │ id (PK)        │
         │             │      │ name (UNIQUE)  │
         │             │      └────────────────┘
         │             │
         │             ▼
         │       (User - Upvote)
         │       1:N relationship
         │
         ▼
    (User - Comment)
    1:N relationship
```

## Detailed Schema

### 1. User Table

```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  passwordHash TEXT NOT NULL,
  profilePicture TEXT,
  bio TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
```

**Relationships**:
- One User has many Snippets (as author)
- One User has many Comments (as author)
- One User has many Upvotes
- One User has many RefreshTokens

---

### 2. Snippet Table

```sql
CREATE TABLE snippets (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  language TEXT NOT NULL,
  code TEXT NOT NULL,
  visibility TEXT NOT NULL DEFAULT 'PUBLIC', -- 'PUBLIC' or 'PRIVATE'
  shareSlug TEXT UNIQUE NOT NULL,
  authorId TEXT NOT NULL,
  upvotesCount INTEGER DEFAULT 0,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (authorId) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX idx_snippets_authorId ON snippets(authorId);
CREATE INDEX idx_snippets_visibility ON snippets(visibility);
CREATE INDEX idx_snippets_shareSlug ON snippets(shareSlug);
CREATE INDEX idx_snippets_createdAt ON snippets(createdAt);
CREATE INDEX idx_snippets_language ON snippets(language);
```

**Relationships**:
- Many Snippets belong to one User (author)
- One Snippet has many Comments
- One Snippet has many Upvotes
- One Snippet has many Tags (M:N through SnippetTags)

**Key Features**:
- `shareSlug`: Unique UUID for sharing private snippets
- `visibility`: ENUM ('PUBLIC', 'PRIVATE')
- `upvotesCount`: Denormalized for performance

---

### 3. Comment Table

```sql
CREATE TABLE comments (
  id TEXT PRIMARY KEY,
  content TEXT NOT NULL,
  snippetId TEXT NOT NULL,
  authorId TEXT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (snippetId) REFERENCES snippets(id) ON DELETE CASCADE,
  FOREIGN KEY (authorId) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX idx_comments_snippetId ON comments(snippetId);
CREATE INDEX idx_comments_authorId ON comments(authorId);
CREATE INDEX idx_comments_createdAt ON comments(createdAt);
```

**Relationships**:
- Many Comments belong to one Snippet
- Many Comments belong to one User (author)

**Cascade Delete**:
- Delete snippet → deletes all comments
- Delete user → deletes all their comments

---

### 4. Upvote Table

```sql
CREATE TABLE upvotes (
  id TEXT PRIMARY KEY,
  snippetId TEXT NOT NULL,
  userId TEXT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (snippetId) REFERENCES snippets(id) ON DELETE CASCADE,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(snippetId, userId)
);

-- Indexes
CREATE INDEX idx_upvotes_snippetId ON upvotes(snippetId);
CREATE INDEX idx_upvotes_userId ON upvotes(userId);
CREATE UNIQUE INDEX idx_upvotes_unique ON upvotes(snippetId, userId);
```

**Relationships**:
- Many Upvotes belong to one Snippet
- Many Upvotes belong to one User

**Key Features**:
- Unique constraint on (snippetId, userId) prevents duplicate upvotes
- One user can only upvote a snippet once

**Cascade Delete**:
- Delete snippet → deletes all upvotes
- Delete user → deletes all their upvotes

---

### 5. RefreshToken Table

```sql
CREATE TABLE refresh_tokens (
  id TEXT PRIMARY KEY,
  token TEXT UNIQUE NOT NULL,
  userId TEXT NOT NULL,
  expiresAt DATETIME NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX idx_refresh_tokens_userId ON refresh_tokens(userId);
CREATE INDEX idx_refresh_tokens_token ON refresh_tokens(token);
CREATE INDEX idx_refresh_tokens_expiresAt ON refresh_tokens(expiresAt);
```

**Relationships**:
- Many RefreshTokens belong to one User

**Key Features**:
- Stores JWT refresh tokens
- `expiresAt`: Automatic expiration check
- Deleted on logout or user deletion

---

### 6. Tag Table (Optional - for future use)

```sql
CREATE TABLE tags (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL
);

CREATE TABLE _SnippetTags (
  snippetId TEXT NOT NULL,
  tagId TEXT NOT NULL,
  PRIMARY KEY (snippetId, tagId),
  FOREIGN KEY (snippetId) REFERENCES snippets(id) ON DELETE CASCADE,
  FOREIGN KEY (tagId) REFERENCES tags(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX idx_snippet_tags_snippetId ON _SnippetTags(snippetId);
CREATE INDEX idx_snippet_tags_tagId ON _SnippetTags(tagId);
```

**Relationships**:
- Many-to-Many between Snippets and Tags

---

## Database Relationships Summary

### One-to-Many (1:N)

1. **User → Snippet**: One user creates many snippets
2. **User → Comment**: One user writes many comments
3. **User → Upvote**: One user can upvote many snippets
4. **User → RefreshToken**: One user can have multiple refresh tokens
5. **Snippet → Comment**: One snippet has many comments
6. **Snippet → Upvote**: One snippet has many upvotes

### Many-to-Many (M:N)

1. **Snippet ↔ Tag**: Through `_SnippetTags` join table

---

## Key Design Decisions

### 1. UUID Primary Keys
- **Why**: Better for distributed systems, security (non-sequential), URL-friendly
- **Format**: `123e4567-e89b-12d3-a456-426614174000`

### 2. Share Slug
- **Purpose**: Allow sharing private snippets without exposing internal IDs
- **Implementation**: Separate UUID column (`shareSlug`)
- **Benefit**: Can regenerate shareSlug without changing snippet ID

### 3. Denormalized Upvote Count
- **Field**: `upvotesCount` in Snippet table
- **Reason**: Performance optimization for listing snippets
- **Trade-off**: Requires update on every upvote/un-upvote
- **Benefit**: Avoids COUNT query on every snippet retrieval

### 4. Cascade Deletes
- **User deleted** → All their snippets, comments, upvotes deleted
- **Snippet deleted** → All its comments and upvotes deleted
- **Benefit**: Maintains referential integrity
- **Note**: Consider soft deletes for production

### 5. Visibility Enum
- **Values**: 'PUBLIC', 'PRIVATE'
- **PUBLIC**: Shown on home feed, accessible to all
- **PRIVATE**: Only accessible via shareSlug or by author

### 6. Timestamp Fields
- **createdAt**: Record creation timestamp
- **updatedAt**: Auto-updated on record modification
- **expiresAt** (RefreshToken): For automatic token expiration

---

## Indexes & Performance

### Critical Indexes

1. **snippets(authorId)**: Fast user snippet retrieval
2. **snippets(visibility, createdAt)**: Efficient public snippet listing
3. **snippets(shareSlug)**: Fast VS Code import
4. **upvotes(snippetId, userId)**: Unique constraint + fast lookup
5. **comments(snippetId, createdAt)**: Ordered comment retrieval

### Query Optimization Tips

1. Use `select` to fetch only needed fields
2. Use `include` for nested data (1 query vs N+1)
3. Implement pagination on all list endpoints
4. Use `_count` for relationship counts

---

## Sample Queries (Prisma)

### Get Public Snippets with Author and Counts

```typescript
const snippets = await prisma.snippet.findMany({
  where: { visibility: 'PUBLIC' },
  take: 20,
  skip: 0,
  orderBy: { createdAt: 'desc' },
  include: {
    author: {
      select: {
        id: true,
        username: true,
        profilePicture: true,
      },
    },
    _count: {
      select: {
        comments: true,
        upvotes: true,
      },
    },
  },
});
```

### Check if User Upvoted Snippet

```typescript
const upvote = await prisma.upvote.findUnique({
  where: {
    snippetId_userId: {
      snippetId: 'snippet-id',
      userId: 'user-id',
    },
  },
});

const hasUpvoted = !!upvote;
```

### Get Snippet with All Comments

```typescript
const snippet = await prisma.snippet.findUnique({
  where: { id: 'snippet-id' },
  include: {
    author: true,
    comments: {
      include: {
        author: {
          select: {
            id: true,
            username: true,
            profilePicture: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    },
  },
});
```

---

## Migration Strategy

### Development (SQLite)

```bash
# Create migration
npx prisma migrate dev --name init

# Reset database
npx prisma migrate reset

# Generate client
npx prisma generate
```

### Production (PostgreSQL)

```bash
# Deploy migrations
npx prisma migrate deploy

# Or push schema (without migrations)
npx prisma db push
```

---

## Data Validation

### Application Level (Prisma + express-validator)

- Username: 3-30 chars, alphanumeric + underscore/hyphen
- Email: Valid format, unique
- Password: Min 6 chars (hashed with bcrypt)
- Snippet title: 1-200 chars
- Snippet code: Required, not empty
- Comment content: 1-1000 chars

### Database Level

- NOT NULL constraints
- UNIQUE constraints (email, username, shareSlug, token)
- FOREIGN KEY constraints with CASCADE
- DEFAULT values (visibility, upvotesCount, timestamps)

---

## Scalability Considerations

### Current Design (Small to Medium Scale)

- ✅ SQLite for development
- ✅ Denormalized counts for performance
- ✅ Proper indexing on foreign keys
- ✅ Cascade deletes for integrity

### For Large Scale

1. **Switch to PostgreSQL** for better concurrency
2. **Add Caching** (Redis) for:
   - Public snippet lists
   - User profiles
   - Popular snippets
3. **Add Full-Text Search** (Elasticsearch) for snippet search
4. **Implement Soft Deletes** to prevent data loss
5. **Add Read Replicas** for read-heavy operations
6. **Partition Tables** by date (for old snippets)
7. **Consider CDN** for code snippet storage

---

## Backup Strategy

### SQLite (Development)

```bash
# Backup
sqlite3 dev.db ".backup backup.db"

# Restore
sqlite3 dev.db ".restore backup.db"
```

### PostgreSQL (Production)

```bash
# Backup
pg_dump -U user -d snippetsync > backup.sql

# Restore
psql -U user -d snippetsync < backup.sql
```

### Automated Backups

- Daily backups with retention policy
- Point-in-time recovery for critical data
- Test restore process regularly

---

## Security Considerations

1. **SQL Injection**: Protected by Prisma ORM (parameterized queries)
2. **Sensitive Data**: Passwords hashed with bcrypt (salt rounds: 10)
3. **Cascade Deletes**: Automatically clean up related data
4. **Unique Constraints**: Prevent duplicate users/snippets
5. **Foreign Keys**: Maintain referential integrity

---

**Schema Version**: 1.0.0  
**Last Updated**: January 2024
