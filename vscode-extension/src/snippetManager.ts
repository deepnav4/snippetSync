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

      // Get share slug from user
      const slug = await vscode.window.showInputBox({
        prompt: 'Enter snippet share slug or URL',
        placeHolder: 'e.g., abc123 or full URL',
      });

      if (!slug) {
        return;
      }

      // Extract slug from URL if provided
      const extractedSlug = this.extractSlugFromUrl(slug);

      // Fetch snippet
      vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          title: 'Importing snippet...',
          cancellable: false,
        },
        async () => {
          const snippet = await this.apiService.getSnippetBySlug(extractedSlug);

          // Insert into active editor
          const editor = vscode.window.activeTextEditor;
          if (editor) {
            editor.edit((editBuilder) => {
              const position = editor.selection.active;
              editBuilder.insert(position, snippet.code);
            });

            vscode.window.showInformationMessage(
              `Imported snippet: ${snippet.title}`
            );
          } else {
            // No active editor, create new file
            const doc = await vscode.workspace.openTextDocument({
              content: snippet.code,
              language: this.mapLanguageToVSCode(snippet.language),
            });
            await vscode.window.showTextDocument(doc);
            vscode.window.showInformationMessage(
              `Imported snippet: ${snippet.title}`
            );
          }
        }
      );
    } catch (error: any) {
      vscode.window.showErrorMessage(
        `Failed to import snippet: ${error.message}`
      );
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
          await this.apiService.createSnippet({
            title,
            description: description || undefined,
            code,
            language: this.mapVSCodeLanguageToApi(languageId),
            visibility: visibility as 'PUBLIC' | 'PRIVATE',
            tags: tags ? tags.split(',').map((t) => t.trim()) : undefined,
          });

          vscode.window.showInformationMessage(
            `Snippet "${title}" exported successfully!`
          );
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

  private extractSlugFromUrl(input: string): string {
    // If it's a full URL, extract the slug
    if (input.includes('http')) {
      const parts = input.split('/');
      return parts[parts.length - 1];
    }
    return input.trim();
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
