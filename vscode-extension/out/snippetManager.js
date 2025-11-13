"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.SnippetManager = void 0;
const vscode = __importStar(require("vscode"));
class SnippetManager {
    constructor(context, apiService) {
        this.context = context;
        this.apiService = apiService;
    }
    /**
     * Import a snippet from the platform and insert into editor
     */
    async importSnippet() {
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
            vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: 'Importing snippet...',
                cancellable: false,
            }, async () => {
                const snippet = await this.apiService.getSnippetByCode(code.toLowerCase());
                // Insert into active editor
                const editor = vscode.window.activeTextEditor;
                if (editor) {
                    editor.edit((editBuilder) => {
                        const position = editor.selection.active;
                        editBuilder.insert(position, snippet.code);
                    });
                    vscode.window.showInformationMessage(`✓ Imported snippet: ${snippet.title}`);
                }
                else {
                    // No active editor, create new file
                    const doc = await vscode.workspace.openTextDocument({
                        content: snippet.code,
                        language: this.mapLanguageToVSCode(snippet.language),
                    });
                    await vscode.window.showTextDocument(doc);
                    vscode.window.showInformationMessage(`✓ Imported snippet: ${snippet.title}`);
                }
            });
        }
        catch (error) {
            if (error.message.includes('expired')) {
                vscode.window.showErrorMessage('⏰ Share code has expired. Please generate a new code from the web app.');
            }
            else if (error.message.includes('not found')) {
                vscode.window.showErrorMessage('❌ Invalid share code. Please check and try again.');
            }
            else {
                vscode.window.showErrorMessage(`Failed to import snippet: ${error.message}`);
            }
        }
    }
    /**
     * Export selected code as a snippet to the platform
     */
    async exportSnippet() {
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
            await vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: 'Exporting snippet...',
                cancellable: false,
            }, async () => {
                const result = await this.apiService.createSnippet({
                    title,
                    description: description || undefined,
                    code,
                    language: this.mapVSCodeLanguageToApi(languageId),
                    visibility: visibility,
                    tags: tags ? tags.split(',').map((t) => t.trim()) : undefined,
                });
                // Calculate minutes until expiration
                const expiresAt = new Date(result.expiresAt);
                const now = new Date();
                const minutesRemaining = Math.round((expiresAt.getTime() - now.getTime()) / 60000);
                // Show success message with share code
                const action = await vscode.window.showInformationMessage(`✓ Snippet "${title}" exported successfully!\n\n⚡ Temporary Share Code: ${result.shareCode}\n\n⏰ Expires in ${minutesRemaining} minutes`, 'Copy Code', 'OK');
                if (action === 'Copy Code') {
                    await vscode.env.clipboard.writeText(result.shareCode);
                    vscode.window.showInformationMessage('✓ Share code copied to clipboard!');
                }
            });
        }
        catch (error) {
            vscode.window.showErrorMessage(`Failed to export snippet: ${error.message}`);
        }
    }
    /**
     * View and manage user's snippets
     */
    async viewMySnippets() {
        try {
            const isAuth = await this.apiService.isAuthenticated();
            if (!isAuth) {
                vscode.window.showWarningMessage('Please login first');
                return;
            }
            const snippets = await vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: 'Loading snippets...',
                cancellable: false,
            }, async () => {
                return await this.apiService.getMySnippets();
            });
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
                }
                else {
                    // Create new file
                    const doc = await vscode.workspace.openTextDocument({
                        content: selected.snippet.code,
                        language: this.mapLanguageToVSCode(selected.snippet.language),
                    });
                    await vscode.window.showTextDocument(doc);
                }
            }
        }
        catch (error) {
            vscode.window.showErrorMessage(`Failed to load snippets: ${error.message}`);
        }
    }
    /**
     * Sync all snippets (placeholder for future implementation)
     */
    async syncAll() {
        vscode.window.showInformationMessage('Full sync feature coming soon! Use import/export for now.');
    }
    mapLanguageToVSCode(language) {
        const mapping = {
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
    mapVSCodeLanguageToApi(languageId) {
        const mapping = {
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
exports.SnippetManager = SnippetManager;
//# sourceMappingURL=snippetManager.js.map