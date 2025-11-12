import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Landing.css';

function Landing() {
  const { user } = useAuth();

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-icon">✨</span>
            <span>Your Personal Code Library</span>
          </div>
          
          <h1 className="hero-title">
            Manage & Share Your
            <span className="gradient-text"> Code Snippets</span>
            <br />
            Seamlessly
          </h1>
          
          <p className="hero-description">
            SnippetSync helps developers organize, share, and access code snippets instantly. 
            With VS Code integration and powerful search, never lose a snippet again.
          </p>
          
          <div className="hero-buttons">
            {user ? (
              <>
                <Link to="/explore" className="btn btn-primary btn-large">
                  <span>🚀 Explore Snippets</span>
                </Link>
                <Link to="/create" className="btn btn-secondary btn-large">
                  <span>➕ Create Snippet</span>
                </Link>
              </>
            ) : (
              <>
                <Link to="/signup" className="btn btn-primary btn-large">
                  <span>Get Started Free</span>
                  <span className="btn-arrow">→</span>
                </Link>
                <Link to="/explore" className="btn btn-secondary btn-large">
                  <span>Browse Public Snippets</span>
                </Link>
              </>
            )}
          </div>

          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number">1000+</div>
              <div className="stat-label">Code Snippets</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-number">50+</div>
              <div className="stat-label">Languages</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-number">500+</div>
              <div className="stat-label">Developers</div>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="code-window">
            <div className="window-header">
              <div className="window-dots">
                <span className="dot red"></span>
                <span className="dot yellow"></span>
                <span className="dot green"></span>
              </div>
              <div className="window-title">snippet.js</div>
            </div>
            <div className="window-content">
              <pre><code>{`// Quick sort algorithm
function quickSort(arr) {
  if (arr.length <= 1) return arr;
  
  const pivot = arr[0];
  const left = [];
  const right = [];
  
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < pivot) {
      left.push(arr[i]);
    } else {
      right.push(arr[i]);
    }
  }
  
  return [
    ...quickSort(left),
    pivot,
    ...quickSort(right)
  ];
}`}</code></pre>
            </div>
          </div>
          
          <div className="floating-card card-1">
            <div className="card-icon">⚡</div>
            <div className="card-text">Lightning Fast Search</div>
          </div>
          
          <div className="floating-card card-2">
            <div className="card-icon">🔒</div>
            <div className="card-text">Secure & Private</div>
          </div>
          
          <div className="floating-card card-3">
            <div className="card-icon">🎯</div>
            <div className="card-text">VS Code Integration</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h2 className="section-title">
            Everything You Need to
            <span className="gradient-text"> Manage Code</span>
          </h2>
          <p className="section-description">
            Powerful features designed for developers who value efficiency
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <span className="icon-emoji">💾</span>
            </div>
            <h3 className="feature-title">Store & Organize</h3>
            <p className="feature-description">
              Keep all your code snippets in one place. Organize with tags, search instantly, and never lose a snippet again.
            </p>
          </div>

          <div className="feature-card feature-highlight">
            <div className="feature-badge">Most Popular</div>
            <div className="feature-icon">
              <span className="icon-emoji">🔌</span>
            </div>
            <h3 className="feature-title">VS Code Extension</h3>
            <p className="feature-description">
              Import and export snippets directly in VS Code. No context switching. Just a share slug and you're done.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <span className="icon-emoji">🌐</span>
            </div>
            <h3 className="feature-title">Share Publicly</h3>
            <p className="feature-description">
              Share snippets with the community or keep them private. Get feedback through comments and upvotes.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <span className="icon-emoji">🔍</span>
            </div>
            <h3 className="feature-title">Advanced Search</h3>
            <p className="feature-description">
              Filter by language, tags, or search by keywords. Find exactly what you need in seconds.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <span className="icon-emoji">🎨</span>
            </div>
            <h3 className="feature-title">Syntax Highlighting</h3>
            <p className="feature-description">
              Beautiful code rendering with support for 50+ programming languages. Read code comfortably.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <span className="icon-emoji">🔐</span>
            </div>
            <h3 className="feature-title">Secure & Private</h3>
            <p className="feature-description">
              Your private snippets stay private. Bank-level encryption and secure authentication protect your code.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="section-header">
          <h2 className="section-title">
            How It
            <span className="gradient-text"> Works</span>
          </h2>
          <p className="section-description">
            Get started in minutes, not hours
          </p>
        </div>

        <div className="steps-container">
          <div className="step-card">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3 className="step-title">Sign Up Free</h3>
              <p className="step-description">
                Create your account in seconds. No credit card required.
              </p>
            </div>
          </div>

          <div className="step-arrow">→</div>

          <div className="step-card">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3 className="step-title">Add Your Snippets</h3>
              <p className="step-description">
                Create snippets from the web or directly in VS Code.
              </p>
            </div>
          </div>

          <div className="step-arrow">→</div>

          <div className="step-card">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3 className="step-title">Access Anywhere</h3>
              <p className="step-description">
                Use your snippets on any device, anytime you need them.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">
            Ready to Boost Your
            <span className="gradient-text"> Productivity?</span>
          </h2>
          <p className="cta-description">
            Join thousands of developers who trust SnippetSync for their code management
          </p>
          <div className="cta-buttons">
            {user ? (
              <Link to="/create" className="btn btn-primary btn-large">
                <span>Create Your First Snippet</span>
                <span className="btn-arrow">→</span>
              </Link>
            ) : (
              <>
                <Link to="/signup" className="btn btn-primary btn-large">
                  <span>Start Free Today</span>
                  <span className="btn-arrow">→</span>
                </Link>
                <Link to="/explore" className="btn btn-outline btn-large">
                  <span>Explore Snippets</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <h3>📝 SnippetSync</h3>
            <p>Manage your code snippets with ease</p>
          </div>
          <div className="footer-links">
            <div className="footer-column">
              <h4>Product</h4>
              <Link to="/explore">Explore</Link>
              <Link to="/signup">Sign Up</Link>
              <Link to="/login">Login</Link>
            </div>
            <div className="footer-column">
              <h4>Resources</h4>
              <a href="#features">Features</a>
              <a href="#how-it-works">How It Works</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 SnippetSync. Built with ❤️ for developers.</p>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
