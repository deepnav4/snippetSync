# SnippetSync VS Code Extension

Sync your code snippets between VS Code and the SnippetSync platform.

## Features

- 🔐 **Login/Logout** - Authenticate with your SnippetSync account
- 📥 **Import Snippets** - Import snippets from the platform using share slug
- 📤 **Export Snippets** - Export selected code as snippets to the platform
- 👀 **View My Snippets** - Browse and insert your snippets directly in VS Code
- 🔄 **Auto Sync** (Coming Soon) - Automatically sync snippets in the background

## Usage

### 1. Login to SnippetSync

1. Open Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`)
2. Search for `SnippetSync: Login`
3. Enter your email and password

### 2. Export a Snippet

1. Select the code you want to export
2. Open Command Palette
3. Search for `SnippetSync: Export Snippet to Platform`
4. Fill in the snippet details (title, description, visibility, tags)
5. Your snippet is now available on the platform!

### 3. Import a Snippet

1. Copy the share slug from the platform (or full URL)
2. Open Command Palette
3. Search for `SnippetSync: Import Snippet from Platform`
4. Paste the slug
5. The snippet will be inserted at your cursor position

### 4. Browse Your Snippets

1. Open Command Palette
2. Search for `SnippetSync: View My Snippets`
3. Select a snippet to insert it into your editor

## Commands

- `SnippetSync: Login` - Login to your account
- `SnippetSync: Logout` - Logout from your account
- `SnippetSync: Import Snippet from Platform` - Import snippet by share slug
- `SnippetSync: Export Snippet to Platform` - Export selected code
- `SnippetSync: View My Snippets` - Browse and insert your snippets
- `SnippetSync: Sync All Snippets` - Sync all snippets (Coming Soon)

## Configuration

You can configure the extension in VS Code settings:

- `snippetSync.apiUrl` - SnippetSync API URL (default: `http://localhost:5000/api`)
- `snippetSync.autoSync` - Enable automatic syncing (default: `false`)

## Installation

### From Source

1. Navigate to the extension directory:
   ```bash
   cd vscode-extension
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Compile the extension:
   ```bash
   npm run compile
   ```

4. Press F5 in VS Code to launch Extension Development Host

## Development

```bash
# Watch for changes
npm run watch

# Compile
npm run compile

# Lint
npm run lint
```

## Requirements

- VS Code 1.80.0 or higher
- Node.js 18.x or higher
- Active SnippetSync account

## Support

For issues or questions, please visit: https://github.com/yourusername/snippet-sync

## License

MIT
