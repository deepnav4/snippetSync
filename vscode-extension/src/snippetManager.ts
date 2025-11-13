import * as vscode from 'vscode';
import { ApiService } from './api';
import { Snippet } from './types';

export class SnippetManager {
  constructor(
    private context: vscode.ExtensionContext,
    private apiService: ApiService
  ) {}

  /**
   * Import a snippet from the platform and insert into editor
   */
  async importSnippet(): Promise<void> {
    try {
      const isAuth = await this.apiService.isAuthenticated();
      if (!isAuth) {
        vscode.window.showWarningMessage('Please login first');
        return;
      }

      // Get 6-digit share code from user
      const code = await vscode.window.showInputBox({
        prompt: 'Enter 6-digit temporary share code',
        placeHolder: 'e.g., a7k9m2',
        validateInput: (value) => {
          if (!value) {
            return null;
          }
          if (value.length !== 6) {
            return 'Code must be exactly 6 characters';
          }
          if (!/^[a-z0-9]+$/i.test(value)) {
            return 'Code must contain only letters and numbers';
          }
          return null;
        },
      });

      if (!code) {
        return;
      }

      // Fetch snippet
      vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          title: 'Importing snippet...',
          cancellable: false,
        },
        async () => {
          const snippet = await this.apiService.getSnippetByCode(code.toLowerCase());

          // Insert into active editor
          const editor = vscode.window.activeTextEditor;
          if (editor) {
            editor.edit((editBuilder) => {
              const position = editor.selection.active;
              editBuilder.insert(position, snippet.code);
            });

            vscode.window.showInformationMessage(
              `✓ Imported snippet: ${snippet.title}`
            );
          } else {
            // No active editor, create new file
            const doc = await vscode.workspace.openTextDocument({
              content: snippet.code,
              language: this.mapLanguageToVSCode(snippet.language),
            });
            await vscode.window.showTextDocument(doc);
            vscode.window.showInformationMessage(
              `✓ Imported snippet: ${snippet.title}`
            );
          }
        }
      );
    } catch (error: any) {
      if (error.message.includes('expired')) {
        vscode.window.showErrorMessage(
          '⏰ Share code has expired. Please generate a new code from the web app.'
        );
      } else if (error.message.includes('not found')) {
        vscode.window.showErrorMessage(
          '❌ Invalid share code. Please check and try again.'
        );
      } else {
        vscode.window.showErrorMessage(
          `Failed to import snippet: ${error.message}`
        );
      }
    }
  }

  /**
   * Export selected code as a snippet to the platform
   */
  async exportSnippet(): Promise<void> {
    try {
      const isAuth = await this.apiService.isAuthenticated();
      if (!isAuth) {
        vscode.window.showWarningMessage('Please login first');
        return;
      }

      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showWarningMessage('No active editor');
        return;
      }

      const selection = editor.selection;
      const code = editor.document.getText(selection);

      if (!code) {
        vscode.window.showWarningMessage('Please select some code to export');
        return;
      }

      // Get snippet details from user
      const title = await vscode.window.showInputBox({
        prompt: 'Enter snippet title',
        placeHolder: 'My Awesome Snippet',
      });

      if (!title) {
        return;
      }

      const description = await vscode.window.showInputBox({
        prompt: 'Enter snippet description (optional)',
        placeHolder: 'Description of what this snippet does...',
      });

      const visibility = await vscode.window.showQuickPick(['PUBLIC', 'PRIVATE'], {
        placeHolder: 'Select visibility',
      });

      if (!visibility) {
        return;
      }

      const tags = await vscode.window.showInputBox({
        prompt: 'Enter tags (comma separated, optional)',
        placeHolder: 'react, typescript, hook',
      });

      const languageId = editor.document.languageId;

      // Create snippet
      await vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          title: 'Exporting snippet...',
          cancellable: false,
        },
        async () => {
          const result = await this.apiService.createSnippet({
            title,
            description: description || undefined,
            code,
            language: this.mapVSCodeLanguageToApi(languageId),
            visibility: visibility as 'PUBLIC' | 'PRIVATE',
            tags: tags ? tags.split(',').map((t) => t.trim()) : undefined,
          });

          // Calculate minutes until expiration
          const expiresAt = new Date(result.expiresAt);
          const now = new Date();
          const minutesRemaining = Math.round((expiresAt.getTime() - now.getTime()) / 60000);

          // Show success message with share code
          const action = await vscode.window.showInformationMessage(
            `✓ Snippet "${title}" exported successfully!\n\n⚡ Temporary Share Code: ${result.shareCode}\n\n⏰ Expires in ${minutesRemaining} minutes`,
            'Copy Code',
            'OK'
          );

          if (action === 'Copy Code') {
            await vscode.env.clipboard.writeText(result.shareCode);
            vscode.window.showInformationMessage('✓ Share code copied to clipboard!');
          }
        }
      );
    } catch (error: any) {
      vscode.window.showErrorMessage(
        `Failed to export snippet: ${error.message}`
      );
    }
  }

  /**
   * View and manage user's snippets
   */
  async viewMySnippets(): Promise<void> {
    try {
      const isAuth = await this.apiService.isAuthenticated();
      if (!isAuth) {
        vscode.window.showWarningMessage('Please login first');
        return;
      }

      const snippets = await vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          title: 'Loading snippets...',
          cancellable: false,
        },
        async () => {
          return await this.apiService.getMySnippets();
        }
      );

      if (snippets.length === 0) {
        vscode.window.showInformationMessage('You have no snippets yet');
        return;
      }

      // Show quick pick with snippets
      const items = snippets.map((snippet) => ({
        label: snippet.title,
        description: snippet.language,
        detail: snippet.description || 'No description',
        snippet,
      }));

      const selected = await vscode.window.showQuickPick(items, {
        placeHolder: 'Select a snippet to insert',
      });

      if (selected) {
        // Insert snippet into editor
        const editor = vscode.window.activeTextEditor;
        if (editor) {
          editor.edit((editBuilder) => {
            const position = editor.selection.active;
            editBuilder.insert(position, selected.snippet.code);
          });
        } else {
          // Create new file
          const doc = await vscode.workspace.openTextDocument({
            content: selected.snippet.code,
            language: this.mapLanguageToVSCode(selected.snippet.language),
          });
          await vscode.window.showTextDocument(doc);
        }
      }
    } catch (error: any) {
      vscode.window.showErrorMessage(
        `Failed to load snippets: ${error.message}`
      );
    }
  }

  /**
   * Sync all snippets (placeholder for future implementation)
   */
  async syncAll(): Promise<void> {
    vscode.window.showInformationMessage(
      'Full sync feature coming soon! Use import/export for now.'
    );
  }

  private mapLanguageToVSCode(language: string): string {
    const mapping: Record<string, string> = {
      javascript: 'javascript',
      typescript: 'typescript',
      python: 'python',
      java: 'java',
      cpp: 'cpp',
      go: 'go',
      rust: 'rust',
      html: 'html',
      css: 'css',
      json: 'json',
    };
    return mapping[language.toLowerCase()] || 'plaintext';
  }

  private mapVSCodeLanguageToApi(languageId: string): string {
    const mapping: Record<string, string> = {
      javascript: 'javascript',
      typescript: 'typescript',
      python: 'python',
      java: 'java',
      cpp: 'cpp',
      c: 'cpp',
      go: 'go',
      rust: 'rust',
      html: 'html',
      css: 'css',
      json: 'json',
      jsx: 'javascript',
      tsx: 'typescript',
    };
    return mapping[languageId] || 'other';
  }
}
