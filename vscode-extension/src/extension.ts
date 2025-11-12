import * as vscode from 'vscode';
import { ApiService } from './api';
import { SnippetManager } from './snippetManager';

let apiService: ApiService;
let snippetManager: SnippetManager;

export function activate(context: vscode.ExtensionContext) {
  console.log('SnippetSync extension is now active!');

  // Initialize services
  apiService = new ApiService(context);
  snippetManager = new SnippetManager(context, apiService);

  // Register commands
  
  // Login command
  const loginCommand = vscode.commands.registerCommand(
    'snippet-sync.login',
    async () => {
      try {
        const email = await vscode.window.showInputBox({
          prompt: 'Enter your email',
          placeHolder: 'user@example.com',
          validateInput: (value) => {
            if (!value || !value.includes('@')) {
              return 'Please enter a valid email';
            }
            return null;
          },
        });

        if (!email) {
          return;
        }

        const password = await vscode.window.showInputBox({
          prompt: 'Enter your password',
          password: true,
        });

        if (!password) {
          return;
        }

        await vscode.window.withProgress(
          {
            location: vscode.ProgressLocation.Notification,
            title: 'Logging in...',
            cancellable: false,
          },
          async () => {
            const result = await apiService.login({ email, password });
            vscode.window.showInformationMessage(
              `Welcome back, ${result.user.username}!`
            );
          }
        );
      } catch (error: any) {
        vscode.window.showErrorMessage(
          `Login failed: ${error.response?.data?.error || error.message}`
        );
      }
    }
  );

  // Logout command
  const logoutCommand = vscode.commands.registerCommand(
    'snippet-sync.logout',
    async () => {
      try {
        await apiService.logout();
        vscode.window.showInformationMessage('Logged out successfully');
      } catch (error: any) {
        vscode.window.showErrorMessage(`Logout failed: ${error.message}`);
      }
    }
  );

  // Import snippet command
  const importSnippetCommand = vscode.commands.registerCommand(
    'snippet-sync.importSnippet',
    () => snippetManager.importSnippet()
  );

  // Export snippet command
  const exportSnippetCommand = vscode.commands.registerCommand(
    'snippet-sync.exportSnippet',
    () => snippetManager.exportSnippet()
  );

  // View my snippets command
  const viewMySnippetsCommand = vscode.commands.registerCommand(
    'snippet-sync.viewMySnippets',
    () => snippetManager.viewMySnippets()
  );

  // Sync all command
  const syncAllCommand = vscode.commands.registerCommand(
    'snippet-sync.syncAll',
    () => snippetManager.syncAll()
  );

  // Add all commands to subscriptions
  context.subscriptions.push(
    loginCommand,
    logoutCommand,
    importSnippetCommand,
    exportSnippetCommand,
    viewMySnippetsCommand,
    syncAllCommand
  );

  // Show welcome message
  vscode.window.showInformationMessage(
    'SnippetSync is ready! Use Ctrl+Shift+P and search for "SnippetSync" to get started.'
  );
}

export function deactivate() {
  console.log('SnippetSync extension is now deactivated');
}
