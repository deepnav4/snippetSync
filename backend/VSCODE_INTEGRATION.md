# 🔐 VS Code Extension Integration Guide

Complete guide for integrating the Snippet Sync backend with your VS Code extension.

## Overview

This backend provides a seamless integration point for VS Code extensions to import code snippets directly into the editor. The integration uses a unique share slug (UUID) to retrieve snippet data.

---

## Key Endpoint

### Import Snippet by Share Slug

**Endpoint**: `GET /api/snippets/import/:slug`

**Purpose**: Retrieve a snippet using its unique share slug for importing into VS Code.

**Authentication**: Not required (allows sharing private snippets via link)

**URL Parameter**:
- `slug`: The unique UUID share slug of the snippet

**Example Request**:
```
GET http://localhost:5000/api/snippets/import/123e4567-e89b-12d3-a456-426614174000
```

**Response Structure**:
```json
{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "React useState Hook Example",
    "description": "Simple counter component using hooks",
    "language": "javascript",
    "code": "import { useState } from 'react';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  return (\n    <button onClick={() => setCount(count + 1)}>\n      {count}\n    </button>\n  );\n}",
    "author": {
      "id": "user-uuid",
      "username": "johndoe",
      "profilePicture": null
    },
    "createdAt": "2024-01-15T10:30:00.000Z",
    "upvotesCount": 42
  }
}
```

---

## Integration Workflow

### 1. User Flow

```
1. User finds a snippet on Snippet Sync web app
2. User copies the share URL (contains shareSlug)
   Example: https://snippetsync.com/snippet/123e4567-e89b-12d3-a456-426614174000
3. User opens VS Code
4. User runs command: "Snippet Sync: Import Snippet"
5. User pastes the URL or just the share slug
6. Extension extracts the slug from the URL
7. Extension calls backend API
8. Extension creates a new file with the snippet code
```

### 2. VS Code Extension Implementation

#### Install Dependencies

```bash
npm install node-fetch
# Or use axios
npm install axios
```

#### Extract Share Slug from URL

```typescript
/**
 * Extract share slug from various URL formats
 */
function extractShareSlug(input: string): string | null {
  // If it's already a UUID, return it
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(input)) {
    return input;
  }

  // Extract from URL
  const urlPatterns = [
    /snippet\/([0-9a-f-]+)/i,
    /import\/([0-9a-f-]+)/i,
    /share\/([0-9a-f-]+)/i,
  ];

  for (const pattern of urlPatterns) {
    const match = input.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

// Usage
const slug = extractShareSlug('https://snippetsync.com/snippet/123e4567-...');
```

#### Fetch Snippet from API

```typescript
import * as vscode from 'vscode';

const API_BASE_URL = 'http://localhost:5000/api'; // Change for production

interface SnippetResponse {
  success: boolean;
  data: {
    id: string;
    title: string;
    description?: string;
    language: string;
    code: string;
    author: {
      username: string;
    };
    createdAt: string;
  };
  error?: string;
}

/**
 * Fetch snippet from backend
 */
async function fetchSnippet(shareSlug: string): Promise<SnippetResponse> {
  const url = `${API_BASE_URL}/snippets/import/${shareSlug}`;

  try {
    const response = await fetch(url);
    const data: SnippetResponse = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch snippet');
    }

    return data;
  } catch (error: any) {
    throw new Error(`Failed to import snippet: ${error.message}`);
  }
}
```

#### Create File in VS Code

```typescript
/**
 * Create a new file with snippet content
 */
async function createSnippetFile(snippet: SnippetResponse['data']): Promise<void> {
  // Determine file extension based on language
  const extension = getFileExtension(snippet.language);
  const fileName = `${sanitizeFileName(snippet.title)}${extension}`;

  // Create new untitled document
  const document = await vscode.workspace.openTextDocument({
    language: snippet.language,
    content: snippet.code,
  });

  // Show the document in editor
  await vscode.window.showTextDocument(document);

  // Add metadata as comments at the top (optional)
  const editor = vscode.window.activeTextEditor;
  if (editor) {
    const metadata = generateMetadataComment(snippet);
    await editor.edit((editBuilder) => {
      editBuilder.insert(new vscode.Position(0, 0), metadata);
    });
  }

  vscode.window.showInformationMessage(
    `Imported snippet: "${snippet.title}" by ${snippet.author.username}`
  );
}

/**
 * Get file extension based on language
 */
function getFileExtension(language: string): string {
  const extensions: { [key: string]: string } = {
    javascript: '.js',
    typescript: '.ts',
    python: '.py',
    java: '.java',
    cpp: '.cpp',
    c: '.c',
    csharp: '.cs',
    go: '.go',
    rust: '.rs',
    php: '.php',
    ruby: '.rb',
    swift: '.swift',
    kotlin: '.kt',
    html: '.html',
    css: '.css',
    sql: '.sql',
    json: '.json',
    yaml: '.yaml',
    markdown: '.md',
    // Add more as needed
  };

  return extensions[language.toLowerCase()] || '.txt';
}

/**
 * Sanitize file name
 */
function sanitizeFileName(name: string): string {
  return name
    .replace(/[^a-z0-9_\-\s]/gi, '')
    .replace(/\s+/g, '_')
    .substring(0, 50);
}

/**
 * Generate metadata comment
 */
function generateMetadataComment(snippet: SnippetResponse['data']): string {
  const commentStyle = getCommentStyle(snippet.language);
  const lines = [
    `${commentStyle.start} Snippet: ${snippet.title}`,
    `${commentStyle.line} Author: ${snippet.author.username}`,
    `${commentStyle.line} Imported: ${new Date().toLocaleDateString()}`,
  ];

  if (snippet.description) {
    lines.push(`${commentStyle.line} Description: ${snippet.description}`);
  }

  lines.push(commentStyle.end);
  lines.push(''); // Empty line

  return lines.join('\n');
}

/**
 * Get comment style based on language
 */
function getCommentStyle(language: string): { start: string; line: string; end: string } {
  const styles: { [key: string]: { start: string; line: string; end: string } } = {
    javascript: { start: '/**', line: ' *', end: ' */' },
    typescript: { start: '/**', line: ' *', end: ' */' },
    python: { start: '"""', line: '', end: '"""' },
    html: { start: '<!--', line: '', end: '-->' },
    css: { start: '/**', line: ' *', end: ' */' },
  };

  return styles[language.toLowerCase()] || { start: '/*', line: ' *', end: ' */' };
}
```

#### Complete VS Code Command

```typescript
/**
 * Register the import snippet command
 */
export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    'snippetSync.importSnippet',
    async () => {
      try {
        // Prompt user for URL or share slug
        const input = await vscode.window.showInputBox({
          prompt: 'Enter snippet URL or share slug',
          placeHolder: 'https://snippetsync.com/snippet/123e4567-... or just the UUID',
          validateInput: (value) => {
            if (!value) {
              return 'Please enter a URL or share slug';
            }
            const slug = extractShareSlug(value);
            if (!slug) {
              return 'Invalid URL or share slug format';
            }
            return null;
          },
        });

        if (!input) {
          return; // User cancelled
        }

        // Extract share slug
        const shareSlug = extractShareSlug(input);
        if (!shareSlug) {
          vscode.window.showErrorMessage('Invalid snippet URL or slug');
          return;
        }

        // Show progress
        await vscode.window.withProgress(
          {
            location: vscode.ProgressLocation.Notification,
            title: 'Importing snippet...',
            cancellable: false,
          },
          async (progress) => {
            progress.report({ increment: 30 });

            // Fetch snippet
            const response = await fetchSnippet(shareSlug);
            progress.report({ increment: 40 });

            // Create file
            await createSnippetFile(response.data);
            progress.report({ increment: 30 });
          }
        );
      } catch (error: any) {
        vscode.window.showErrorMessage(
          `Failed to import snippet: ${error.message}`
        );
      }
    }
  );

  context.subscriptions.push(disposable);
}
```

---

## Advanced Features

### 1. Save to Specific Folder

```typescript
async function saveSnippetToFolder(snippet: SnippetResponse['data']): Promise<void> {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders) {
    vscode.window.showErrorMessage('No workspace folder open');
    return;
  }

  // Let user choose folder
  const folderUri = await vscode.window.showOpenDialog({
    canSelectFiles: false,
    canSelectFolders: true,
    canSelectMany: false,
    defaultUri: workspaceFolders[0].uri,
    openLabel: 'Select Folder',
  });

  if (!folderUri || folderUri.length === 0) {
    return;
  }

  // Create file
  const extension = getFileExtension(snippet.language);
  const fileName = `${sanitizeFileName(snippet.title)}${extension}`;
  const fileUri = vscode.Uri.joinPath(folderUri[0], fileName);

  // Write content
  const content = Buffer.from(snippet.code, 'utf8');
  await vscode.workspace.fs.writeFile(fileUri, content);

  // Open file
  const document = await vscode.workspace.openTextDocument(fileUri);
  await vscode.window.showTextDocument(document);

  vscode.window.showInformationMessage(`Snippet saved to ${fileName}`);
}
```

### 2. Insert at Cursor Position

```typescript
async function insertSnippetAtCursor(code: string): Promise<void> {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showErrorMessage('No active editor');
    return;
  }

  const position = editor.selection.active;
  await editor.edit((editBuilder) => {
    editBuilder.insert(position, code);
  });

  vscode.window.showInformationMessage('Snippet inserted!');
}
```

### 3. Quick Pick with Recent Snippets

```typescript
interface RecentSnippet {
  shareSlug: string;
  title: string;
  language: string;
  importedAt: string;
}

async function showRecentSnippets(
  context: vscode.ExtensionContext
): Promise<void> {
  const recent: RecentSnippet[] =
    context.globalState.get('recentSnippets', []);

  if (recent.length === 0) {
    vscode.window.showInformationMessage('No recent snippets');
    return;
  }

  const selected = await vscode.window.showQuickPick(
    recent.map((s) => ({
      label: s.title,
      description: s.language,
      detail: `Imported ${s.importedAt}`,
      snippet: s,
    })),
    { placeHolder: 'Select a recent snippet to import' }
  );

  if (selected) {
    const response = await fetchSnippet(selected.snippet.shareSlug);
    await createSnippetFile(response.data);
  }
}

// Save to recent snippets
async function saveToRecent(
  context: vscode.ExtensionContext,
  snippet: SnippetResponse['data'],
  shareSlug: string
): Promise<void> {
  const recent: RecentSnippet[] =
    context.globalState.get('recentSnippets', []);

  const newSnippet: RecentSnippet = {
    shareSlug,
    title: snippet.title,
    language: snippet.language,
    importedAt: new Date().toLocaleDateString(),
  };

  // Add to beginning, keep max 10
  recent.unshift(newSnippet);
  await context.globalState.update('recentSnippets', recent.slice(0, 10));
}
```

### 4. Clipboard Detection

```typescript
async function importFromClipboard(): Promise<void> {
  const clipboardText = await vscode.env.clipboard.readText();
  const shareSlug = extractShareSlug(clipboardText);

  if (!shareSlug) {
    vscode.window.showErrorMessage(
      'No valid snippet URL found in clipboard'
    );
    return;
  }

  const response = await fetchSnippet(shareSlug);
  await createSnippetFile(response.data);
}
```

---

## Configuration

### Extension Settings (package.json)

```json
{
  "contributes": {
    "configuration": {
      "title": "Snippet Sync",
      "properties": {
        "snippetSync.apiUrl": {
          "type": "string",
          "default": "http://localhost:5000/api",
          "description": "Snippet Sync API base URL"
        },
        "snippetSync.autoSave": {
          "type": "boolean",
          "default": false,
          "description": "Automatically save imported snippets to workspace"
        },
        "snippetSync.defaultFolder": {
          "type": "string",
          "default": "snippets",
          "description": "Default folder for saving snippets"
        },
        "snippetSync.addMetadata": {
          "type": "boolean",
          "default": true,
          "description": "Add metadata comments to imported snippets"
        }
      }
    },
    "commands": [
      {
        "command": "snippetSync.importSnippet",
        "title": "Snippet Sync: Import Snippet"
      },
      {
        "command": "snippetSync.importFromClipboard",
        "title": "Snippet Sync: Import from Clipboard"
      },
      {
        "command": "snippetSync.showRecent",
        "title": "Snippet Sync: Show Recent Snippets"
      }
    ],
    "keybindings": [
      {
        "command": "snippetSync.importSnippet",
        "key": "ctrl+shift+i",
        "mac": "cmd+shift+i"
      }
    ]
  }
}
```

---

## Error Handling

```typescript
enum SnippetSyncError {
  NETWORK_ERROR = 'Network error. Please check your connection.',
  SNIPPET_NOT_FOUND = 'Snippet not found.',
  INVALID_FORMAT = 'Invalid snippet format.',
  API_ERROR = 'API error. Please try again later.',
}

function handleSnippetError(error: any): string {
  if (error.message.includes('fetch')) {
    return SnippetSyncError.NETWORK_ERROR;
  }
  if (error.message.includes('404')) {
    return SnippetSyncError.SNIPPET_NOT_FOUND;
  }
  return SnippetSyncError.API_ERROR;
}
```

---

## Testing

### Test with Sample Share Slug

```typescript
// Test the extension with a sample share slug
const TEST_SHARE_SLUG = '123e4567-e89b-12d3-a456-426614174000';

async function testImport(): Promise<void> {
  try {
    const response = await fetchSnippet(TEST_SHARE_SLUG);
    console.log('✅ Successfully fetched snippet:', response.data.title);
  } catch (error) {
    console.error('❌ Failed to fetch snippet:', error);
  }
}
```

---

## Production Considerations

1. **API URL Configuration**:
   - Use environment-specific URLs
   - Allow users to configure custom API endpoints

2. **Rate Limiting**:
   - Implement retry logic with exponential backoff
   - Cache recently imported snippets

3. **Error Recovery**:
   - Graceful handling of network failures
   - Offline mode with cached snippets

4. **Security**:
   - Validate snippet content before inserting
   - Sanitize file names
   - Warn users about potentially unsafe code

5. **Performance**:
   - Lazy load snippet content
   - Implement request cancellation
   - Show progress indicators

---

## Complete Extension Example

See the full working example at:
- GitHub: [your-repo/vscode-extension](link)
- VS Code Marketplace: [Snippet Sync](link)

---

**Last Updated**: January 2024  
**Extension Version**: 1.0.0
