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
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const api_1 = require("./api");
const snippetManager_1 = require("./snippetManager");
let apiService;
let snippetManager;
function activate(context) {
    console.log('SnippetSync extension is now active!');
    // Initialize services
    apiService = new api_1.ApiService(context);
    snippetManager = new snippetManager_1.SnippetManager(context, apiService);
    // Register commands
    // Login command
    const loginCommand = vscode.commands.registerCommand('snippet-sync.login', async () => {
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
            await vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: 'Logging in...',
                cancellable: false,
            }, async () => {
                const result = await apiService.login({ email, password });
                vscode.window.showInformationMessage(`Welcome back, ${result.user.username}!`);
            });
        }
        catch (error) {
            vscode.window.showErrorMessage(`Login failed: ${error.response?.data?.error || error.message}`);
        }
    });
    // Logout command
    const logoutCommand = vscode.commands.registerCommand('snippet-sync.logout', async () => {
        try {
            await apiService.logout();
            vscode.window.showInformationMessage('Logged out successfully');
        }
        catch (error) {
            vscode.window.showErrorMessage(`Logout failed: ${error.message}`);
        }
    });
    // Import snippet command
    const importSnippetCommand = vscode.commands.registerCommand('snippet-sync.importSnippet', () => snippetManager.importSnippet());
    // Export snippet command
    const exportSnippetCommand = vscode.commands.registerCommand('snippet-sync.exportSnippet', () => snippetManager.exportSnippet());
    // View my snippets command
    const viewMySnippetsCommand = vscode.commands.registerCommand('snippet-sync.viewMySnippets', () => snippetManager.viewMySnippets());
    // Sync all command
    const syncAllCommand = vscode.commands.registerCommand('snippet-sync.syncAll', () => snippetManager.syncAll());
    // Add all commands to subscriptions
    context.subscriptions.push(loginCommand, logoutCommand, importSnippetCommand, exportSnippetCommand, viewMySnippetsCommand, syncAllCommand);
    // Show welcome message
    vscode.window.showInformationMessage('SnippetSync is ready! Use Ctrl+Shift+P and search for "SnippetSync" to get started.');
}
function deactivate() {
    console.log('SnippetSync extension is now deactivated');
}
//# sourceMappingURL=extension.js.map