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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiService = void 0;
const axios_1 = __importDefault(require("axios"));
const vscode = __importStar(require("vscode"));
class ApiService {
    constructor(context) {
        this.context = context;
        const config = vscode.workspace.getConfiguration('snippetSync');
        const apiUrl = config.get('apiUrl') || 'http://localhost:5000/api';
        this.api = axios_1.default.create({
            baseURL: apiUrl,
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        });
        // Add request interceptor to include auth token
        this.api.interceptors.request.use(async (config) => {
            const token = await this.getToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        }, (error) => Promise.reject(error));
        // Add response interceptor for error handling
        this.api.interceptors.response.use((response) => response, async (error) => {
            const originalRequest = error.config;
            // Don't retry on login or logout endpoints
            if (error.response?.status === 401 &&
                !originalRequest.url?.includes('/auth/login') &&
                !originalRequest.url?.includes('/auth/logout')) {
                await this.clearToken();
                vscode.window.showErrorMessage('Session expired. Please login again.');
            }
            return Promise.reject(error);
        });
    }
    async getToken() {
        return await this.context.secrets.get('snippetSync.accessToken');
    }
    async setToken(token) {
        await this.context.secrets.store('snippetSync.accessToken', token);
    }
    async clearToken() {
        await this.context.secrets.delete('snippetSync.accessToken');
    }
    async login(credentials) {
        const response = await this.api.post('/auth/login', credentials);
        const { accessToken } = response.data.data;
        // Store token BEFORE making profile request
        await this.setToken(accessToken);
        // Fetch user profile after login with explicit token
        const profileResponse = await this.api.get('/auth/profile', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return {
            user: profileResponse.data.data,
            accessToken
        };
    }
    async logout() {
        try {
            await this.api.post('/auth/logout');
        }
        catch (error) {
            // Ignore errors on logout
        }
        finally {
            await this.clearToken();
        }
    }
    async isAuthenticated() {
        const token = await this.getToken();
        return !!token;
    }
    async getMySnippets() {
        const response = await this.api.get('/snippets/my');
        return response.data.data;
    }
    async getSnippetById(id) {
        const response = await this.api.get(`/snippets/${id}`);
        return response.data.data;
    }
    async getSnippetByCode(code) {
        const response = await this.api.get(`/snippets/import/${code}`);
        return response.data.data;
    }
    async createSnippet(data) {
        const response = await this.api.post('/snippets', data);
        return response.data.data;
    }
    async deleteSnippet(id) {
        await this.api.delete(`/snippets/${id}`);
    }
}
exports.ApiService = ApiService;
//# sourceMappingURL=api.js.map