import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Landing from './pages/Landing';
import Explore from './pages/Explore';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CreateSnippet from './pages/CreateSnippet.tsx';
import SnippetDetail from './pages/SnippetDetail.tsx';
import MySnippets from './pages/MySnippets.tsx';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user ? <>{children}</> : <Navigate to="/login" />;
}

function Navbar() {
  const { user, logout } = useAuth();
  
  return (
    <nav style={{ 
      background: 'white', 
      padding: '15px 0', 
      marginBottom: '30px', 
      borderBottom: '1px solid #e0e0e0',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
    }}>
      <div className="container" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <h2 style={{ color: '#007bff', margin: 0 }}>📝 SnippetSync</h2>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexWrap: 'wrap' }}>
          <Link to="/explore"><button style={{ background: 'transparent', color: '#333' }}>🔍 Explore</button></Link>
          {user ? (
            <>
              <Link to="/my-snippets"><button style={{ background: 'transparent', color: '#333' }}>📚 My Snippets</button></Link>
              <Link to="/create"><button>➕ Create</button></Link>
              <span style={{ 
                margin: '0 10px', 
                padding: '5px 12px',
                background: '#f0f0f0',
                borderRadius: '20px',
                fontSize: '14px'
              }}>
                👤 {user.username}
              </span>
              <button onClick={() => logout()} style={{ background: '#dc3545' }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login"><button>Login</button></Link>
              <Link to="/signup"><button>Sign Up</button></Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <div>
          <Navbar />
          <div className="container">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/snippet/:id" element={<SnippetDetail />} />
              <Route path="/create" element={<ProtectedRoute><CreateSnippet /></ProtectedRoute>} />
              <Route path="/my-snippets" element={<ProtectedRoute><MySnippets /></ProtectedRoute>} />
              <Route path="*" element={<div>404 Not Found</div>} />
            </Routes>
          </div>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;

