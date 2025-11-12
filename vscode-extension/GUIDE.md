# SnippetSync VS Code Extension - Setup & Usage Guide

## 🚀 Quick Start

### 1. Install & Run the Extension

1. Open the `vscode-extension` folder in VS Code
2. Press `F5` to launch Extension Development Host
3. A new VS Code window will open with the extension loaded

### 2. First Time Setup

1. Make sure your backend server is running on `http://localhost:5000`
2. In the Extension Development Host window, press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
3. Type "SnippetSync: Login" and press Enter
4. Enter your email and password

## 📋 Features & Commands

### Login
**Command:** `SnippetSync: Login`
- Authenticate with your SnippetSync account
- Credentials are securely stored using VS Code's Secret Storage API

### Export Snippet
**Command:** `SnippetSync: Export Snippet to Platform`

**Steps:**
1. Select the code you want to export in the editor
2. Run the command
3. Enter snippet details:
   - **Title**: Name of your snippet
   - **Description** (optional): What does this snippet do?
   - **Visibility**: PUBLIC or PRIVATE
   - **Tags** (optional): Comma-separated tags (e.g., "react, hooks, typescript")
4. Snippet is created and available on the platform!

### Import Snippet
**Command:** `SnippetSync: Import Snippet from Platform`

**Steps:**
1. Get a share slug from the platform
   - Go to any snippet on the web platform
   - Copy the share slug (e.g., "abc123")
2. Run the command
3. Paste the slug or full URL
4. Snippet code is inserted at cursor position

### View My Snippets
**Command:** `SnippetSync: View My Snippets`

**Steps:**
1. Run the command
2. Browse your snippets in the quick pick menu
3. Select a snippet to insert it into your editor

### Logout
**Command:** `SnippetSync: Logout`
- Clears your authentication and logs you out

## 🎯 Usage Examples

### Example 1: Export a React Hook

```typescript
// 1. Select this entire hook
import { useState, useEffect } from 'react';

export function useLocalStorage(key: string, initialValue: any) {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

// 2. Press Ctrl+Shift+P
// 3. Type "SnippetSync: Export"
// 4. Fill in:
//    - Title: "useLocalStorage Hook"
//    - Description: "Custom React hook for localStorage"
//    - Visibility: "PUBLIC"
//    - Tags: "react, hooks, localStorage, typescript"
```

### Example 2: Import a Snippet

```
1. On the web platform, find a snippet you like
2. Copy its share slug (e.g., "xyz789")
3. In VS Code, press Ctrl+Shift+P
4. Type "SnippetSync: Import"
5. Paste "xyz789" or full URL
6. Code appears at your cursor!
```

### Example 3: Browse and Insert

```
1. Press Ctrl+Shift+P
2. Type "SnippetSync: View My Snippets"
3. See all your snippets with language and description
4. Select one to insert it
```

## ⚙️ Configuration

Open VS Code settings and search for "SnippetSync":

### API URL
- **Setting:** `snippetSync.apiUrl`
- **Default:** `http://localhost:5000/api`
- **Usage:** Change if your backend is on a different URL

### Auto Sync (Coming Soon)
- **Setting:** `snippetSync.autoSync`
- **Default:** `false`
- **Usage:** Automatically sync snippets on startup

## 🔧 Development

### Project Structure
```
vscode-extension/
├── src/
│   ├── extension.ts       # Main extension entry point
│   ├── api.ts            # API service for backend communication
│   ├── snippetManager.ts # Snippet import/export logic
│   └── types.ts          # TypeScript type definitions
├── out/                  # Compiled JavaScript (generated)
├── package.json          # Extension manifest
├── tsconfig.json         # TypeScript config
└── README.md            # Documentation
```

### Commands for Development

```bash
# Install dependencies
npm install

# Compile once
npm run compile

# Watch mode (auto-compile on changes)
npm run watch

# Run extension (or press F5)
code --extensionDevelopmentPath=.
```

### Debugging

1. Open the extension folder in VS Code
2. Press `F5` to start debugging
3. Set breakpoints in `.ts` files
4. Use Debug Console to inspect variables

## 🌐 Integration with Backend

The extension communicates with your backend API:

### Endpoints Used
- `POST /api/auth/login` - Authentication
- `POST /api/auth/logout` - Logout
- `GET /api/snippets/my` - Get user's snippets
- `GET /api/snippets/import/:slug` - Get snippet by share slug
- `POST /api/snippets` - Create new snippet

### Authentication
- Uses JWT access tokens
- Tokens stored securely in VS Code Secret Storage
- Automatic token refresh on 401 errors

## 💡 Tips & Tricks

1. **Quick Export**: Select code, then use keyboard shortcut (can set custom shortcut)
2. **Share Snippets**: After exporting, get the share slug from the platform to share with team
3. **Language Detection**: Extension automatically detects the language of your code
4. **Multi-language Support**: Works with JavaScript, TypeScript, Python, Java, C++, Go, Rust, and more

## 🐛 Troubleshooting

### "Login failed"
- Check if backend is running on `http://localhost:5000`
- Verify your email and password are correct
- Check backend logs for errors

### "Failed to import snippet"
- Verify the share slug is correct
- Check if the snippet is PUBLIC or you're the owner
- Ensure you're logged in

### "No active editor"
- Open a file or create a new one before importing
- Make sure VS Code window is focused

### Extension not showing commands
- Reload VS Code window (`Ctrl+Shift+P` → "Reload Window")
- Check if extension compiled successfully (`npm run compile`)
- Look for errors in Debug Console

## 📦 Publishing (Future)

To publish to VS Code Marketplace:

```bash
# Install vsce
npm install -g vsce

# Package extension
vsce package

# Publish
vsce publish
```

## 🎉 Success!

Your SnippetSync VS Code extension is now ready! You can:
- ✅ Export code snippets to the platform
- ✅ Import snippets using share slugs
- ✅ Browse and insert your snippets
- ✅ Share snippets with your team
- ✅ Keep your snippets organized and accessible

Happy coding! 🚀
