# SnippetSync Frontend

Beautiful, modern React + TypeScript frontend for SnippetSync - A code snippet sharing platform with glassmorphic design and smooth animations.

## 🎨 Features

- **Modern UI/UX**: Glassmorphic design with dark theme and gradient effects
- **Smooth Animations**: Framer Motion animations throughout the app
- **Responsive Design**: Works seamlessly on all devices
- **Authentication**: Complete auth flow with JWT tokens
- **Code Snippets**: Create, view, edit, and delete snippets
- **Social Features**: Upvotes and comments on snippets
- **Public/Private Snippets**: Control visibility and share via links

## 🛠️ Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **TailwindCSS 4** - Utility-first CSS
- **Framer Motion** - Animation library
- **Axios** - HTTP client
- **React Router** - Routing
- **Lucide React** - Beautiful icons

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🚀 Getting Started

1. **Configure Backend URL**
   
   The `.env` file is already configured:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

2. **Start the Backend**
   
   Make sure your backend server is running on port 5000.

3. **Start Frontend**
   ```bash
   npm run dev
   ```

4. **Open Browser**
   
   Navigate to `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/          # Reusable components
├── context/            # React context
├── lib/                # Utilities and services
├── pages/              # Page components
├── App.tsx             # Main app with routing
└── index.css           # Global styles
```

## 🎯 Key Pages

- `/` - Home page with public snippets
- `/login` - Login page
- `/signup` - Signup page
- `/snippet/:id` - Snippet detail page
- `/create` - Create new snippet (protected)
- `/my-snippets` - User's snippets (protected)
- `/profile` - User profile (protected)

## 🎨 Design System

### Colors
- **Primary Gradient**: `from-indigo-500 via-purple-500 to-pink-500`
- **Background**: `from-gray-900 via-purple-900/20 to-gray-900`
- **Glass Effect**: `backdrop-blur-xl bg-white/5`

### Custom Classes
- `.glass-card` - Glassmorphic card
- `.gradient-text` - Gradient text effect
- `.neon-glow` - Neon glow effect
- `.btn-primary` - Primary gradient button
- `.btn-secondary` - Secondary glass button

## 📝 API Integration

Base URL: `http://localhost:5000/api`

### Services
- **Auth**: signup, login, logout, profile
- **Snippets**: CRUD operations, upvotes, comments

## 👤 Author

Built with ❤️ for the SnippetSync platform

