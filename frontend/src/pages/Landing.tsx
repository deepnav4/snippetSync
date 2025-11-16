import { Link } from 'react-router-dom';
import { CodeBrackets, GridDots, FloatingCode } from '../svgs';

export default function Landing() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gray-100 py-12 sm:py-16 md:py-20 px-4 relative overflow-hidden">
        {/* Decorative SVGs */}
        <div className="absolute top-10 left-10 opacity-30 hidden md:block">
          <GridDots color="#B9FF66" />
        </div>
        <div className="absolute top-20 right-20 floating-animation opacity-20 hidden lg:block">
          <CodeBrackets color="#191A23" />
        </div>
        <div className="absolute bottom-10 right-40 floating-animation opacity-15 hidden lg:block" style={{ animationDelay: '2s' }}>
          <FloatingCode color="#191A23" />
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 md:mb-6 leading-tight">
                Store, Share & Sync Your Code
                <span className="inline-block mt-2 bg-[#B9FF66] px-2 sm:px-3 py-1 text-3xl sm:text-4xl md:text-5xl lg:text-6xl">Snippets</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 md:mb-8">
                The ultimate platform for developers to organize, share, and access code snippets. 
                Import directly into VS Code with one click.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link to="/signup" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-[#B9FF66] text-gray-900 font-bold text-base sm:text-lg rounded-lg hover:bg-[#a3e655] transition-colors border-2 border-gray-900 shadow-[6px_6px_0_#191A23] hover:shadow-[3px_3px_0_#191A23] hover:translate-x-[3px] hover:translate-y-[3px]">
                    Get Started Free
                  </button>
                </Link>
                <Link to="/guide" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white text-gray-900 font-bold text-base sm:text-lg rounded-lg hover:bg-gray-100 transition-colors border-2 border-gray-900 shadow-[6px_6px_0_#191A23] hover:shadow-[3px_3px_0_#191A23] hover:translate-x-[3px] hover:translate-y-[3px]">
                    View Guide →
                  </button>
                </Link>
              </div>
            </div>
            <div className="bg-white border-2 border-gray-900 rounded-2xl p-4 sm:p-6 md:p-8 shadow-[8px_8px_0_#191A23]">
              <pre className="bg-gray-900 text-[#B9FF66] p-4 sm:p-6 rounded-xl font-mono text-xs sm:text-sm overflow-x-auto">
{`// Save your code snippets
function quickSort(arr) {
  if (arr.length <= 1) return arr;
  
  const pivot = arr[arr.length - 1];
  const left = arr.filter((x, i) => 
    x <= pivot && i < arr.length - 1
  );
  const right = arr.filter(x => x > pivot);
  
  return [...quickSort(left), 
          pivot, 
          ...quickSort(right)];
}`}
              </pre>
              <div className="mt-4 text-center">
                <span className="text-sm text-gray-600">Import to VS Code with share code:</span>
                <code className="block mt-2 bg-[#B9FF66] text-gray-900 px-4 py-2 rounded-lg font-bold text-xl border-2 border-gray-900">
                  ABC123
                </code>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 bg-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-40 left-5 opacity-20">
          <FloatingCode color="#B9FF66" />
        </div>
        <div className="absolute bottom-20 right-10 opacity-15">
          <GridDots color="#191A23" />
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
              Why Choose <span className="bg-[#B9FF66] px-2">SnippetSync</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage your code snippets efficiently
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-100 border-2 border-gray-900 rounded-2xl p-8 hover:shadow-[8px_8px_0_#191A23] hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">VS Code Integration</h3>
              <p className="text-gray-600 mb-4">
                Import and export snippets directly from VS Code. No more copy-pasting between browser and editor.
              </p>
              <Link to="/guide" className="text-gray-900 font-bold hover:text-[#B9FF66]">
                Learn More →
              </Link>
            </div>

            {/* Feature 2 */}
            <div className="bg-gray-100 border-2 border-gray-900 rounded-2xl p-8 hover:shadow-[8px_8px_0_#191A23] hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all">
              <div className="text-5xl mb-4">🔒</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Public & Private</h3>
              <p className="text-gray-600 mb-4">
                Share snippets publicly with the community or keep them private for personal use. Full control over visibility.
              </p>
              <Link to="/explore" className="text-gray-900 font-bold hover:text-[#B9FF66]">
                Explore Snippets →
              </Link>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-100 border-2 border-gray-900 rounded-2xl p-8 hover:shadow-[8px_8px_0_#191A23] hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all">
              <div className="text-5xl mb-4">🏷️</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Smart Organization</h3>
              <p className="text-gray-600 mb-4">
                Tag, search, and filter your snippets by language. Find what you need in seconds, not minutes.
              </p>
              <Link to="/signup" className="text-gray-900 font-bold hover:text-[#B9FF66]">
                Get Started →
              </Link>
            </div>

            {/* Feature 4 */}
            <div className="bg-gray-100 border-2 border-gray-900 rounded-2xl p-8 hover:shadow-[8px_8px_0_#191A23] hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all">
              <div className="text-5xl mb-4">🔗</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Share Codes</h3>
              <p className="text-gray-600 mb-4">
                Generate temporary share codes (valid 5 mins) to safely share snippets with teammates without exposing your account.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-gray-100 border-2 border-gray-900 rounded-2xl p-8 hover:shadow-[8px_8px_0_#191A23] hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all">
              <div className="text-5xl mb-4">👥</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Community Driven</h3>
              <p className="text-gray-600 mb-4">
                Discover, upvote, and comment on snippets from developers worldwide. Learn from the best code examples.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-gray-100 border-2 border-gray-900 rounded-2xl p-8 hover:shadow-[8px_8px_0_#191A23] hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all">
              <div className="text-5xl mb-4">📊</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Track Everything</h3>
              <p className="text-gray-600 mb-4">
                View your stats, most used languages, top snippets, and contribution history. Monitor your coding library growth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 sm:py-16 md:py-20 px-4 bg-gray-100 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-10 right-20 floating-animation opacity-25 hidden lg:block">
          <CodeBrackets color="#B9FF66" />
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
              How It <span className="bg-[#B9FF66] px-2">Works</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600">Simple 3-step process to get started</p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {/* Step 1 */}
            <div className="bg-white border-2 border-gray-900 rounded-2xl p-6 sm:p-8 shadow-[6px_6px_0_#191A23]">
              <div className="bg-[#B9FF66] text-gray-900 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-2xl sm:text-3xl font-bold border-2 border-gray-900 mb-4 sm:mb-6">
                01
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Create Account</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                Sign up for free in seconds. No credit card required. Start with unlimited public and private snippets.
              </p>
              <Link to="/signup">
                <button className="w-full px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors">
                  Sign Up Now
                </button>
              </Link>
            </div>

            {/* Step 2 */}
            <div className="bg-white border-2 border-gray-900 rounded-2xl p-8 shadow-[6px_6px_0_#191A23]">
              <div className="bg-[#B9FF66] text-gray-900 w-16 h-16 rounded-full flex items-center justify-center text-3xl font-bold border-2 border-gray-900 mb-6">
                02
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Install Extension</h3>
              <p className="text-gray-600 mb-4">
                Install our VS Code extension from the marketplace. Login once and start syncing your code snippets instantly.
              </p>
              <Link to="/guide">
                <button className="w-full px-6 py-3 bg-[#B9FF66] text-gray-900 font-semibold rounded-lg hover:bg-[#a3e655] transition-colors border-2 border-gray-900">
                  View Guide
                </button>
              </Link>
            </div>

            {/* Step 3 */}
            <div className="bg-white border-2 border-gray-900 rounded-2xl p-8 shadow-[6px_6px_0_#191A23]">
              <div className="bg-[#B9FF66] text-gray-900 w-16 h-16 rounded-full flex items-center justify-center text-3xl font-bold border-2 border-gray-900 mb-6">
                03
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Start Syncing</h3>
              <p className="text-gray-600 mb-4">
                Export snippets with Ctrl+Shift+E, import with share codes, browse your library - all from VS Code!
              </p>
              <Link to="/explore">
                <button className="w-full px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors">
                  Explore Now
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* VS Code Integration Highlight */}
      <section className="py-12 sm:py-16 md:py-20 px-4 bg-[#B9FF66]">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white border-2 border-gray-900 rounded-2xl p-6 sm:p-8 md:p-12 shadow-[8px_8px_0_#191A23]">
            <div className="grid md:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center">
              <div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
                  Seamless VS Code Integration
                </h2>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <span className="text-2xl">✅</span>
                    <div>
                      <strong className="text-gray-900">Export Selected Code</strong>
                      <p className="text-gray-600">Press Ctrl+Shift+E to instantly save any code selection</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-2xl">✅</span>
                    <div>
                      <strong className="text-gray-900">Import with Share Codes</strong>
                      <p className="text-gray-600">Use 6-character codes to import snippets in seconds</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-2xl">✅</span>
                    <div>
                      <strong className="text-gray-900">Browse Your Library</strong>
                      <p className="text-gray-600">Access all your snippets without leaving VS Code</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-2xl">✅</span>
                    <div>
                      <strong className="text-gray-900">Auto Language Detection</strong>
                      <p className="text-gray-600">Automatically detects and tags the programming language</p>
                    </div>
                  </li>
                </ul>
                <Link to="/guide">
                  <button className="px-8 py-4 bg-[#B9FF66] text-gray-900 font-bold text-lg rounded-lg hover:bg-[#a3e655] transition-colors border-2 border-gray-900 shadow-[6px_6px_0_#191A23] hover:shadow-[3px_3px_0_#191A23] hover:translate-x-[3px] hover:translate-y-[3px]">
                    Read Full Guide →
                  </button>
                </Link>
              </div>
              <div className="bg-gray-900 border-2 border-gray-900 rounded-xl p-6">
                <div className="bg-gray-800 text-white px-4 py-2 rounded-t-lg mb-4 font-mono text-sm">
                  📁 VS Code - Extension Demo
                </div>
                <pre className="text-[#000] font-mono text-sm leading-relaxed">
{`> SnippetSync: Export Selection

✓ Code exported successfully!
  Title: "Quick Sort Algorithm"
  Language: JavaScript
  Share Code: XYZ789 (expires in 5m)

> SnippetSync: Import Snippet

Enter share code: ABC123
✓ Snippet imported at cursor!`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 sm:py-16 md:py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
              Loved by <span className="bg-[#B9FF66] px-2">Developers</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600">See what our users are saying</p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {/* Testimonial 1 */}
            <div className="bg-gray-100 border-2 border-gray-900 rounded-2xl p-6 sm:p-8 shadow-[6px_6px_0_#191A23]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#B9FF66] rounded-full flex items-center justify-center text-xl sm:text-2xl font-bold border-2 border-gray-900">
                  S
                </div>
                <div>
                  <div className="font-bold text-gray-900">Sarah Chen</div>
                  <div className="text-sm text-gray-600">Full Stack Developer</div>
                </div>
              </div>
              <div className="text-yellow-500 text-xl mb-3">★★★★★</div>
              <p className="text-gray-700 italic">
                "The VS Code integration is a game-changer! I used to waste so much time copying snippets between browser and editor. Now it's instant."
              </p>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-gray-100 border-2 border-gray-900 rounded-2xl p-8 shadow-[6px_6px_0_#191A23]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-[#B9FF66] rounded-full flex items-center justify-center text-2xl font-bold border-2 border-gray-900">
                  M
                </div>
                <div>
                  <div className="font-bold text-gray-900">Michael Rodriguez</div>
                  <div className="text-sm text-gray-600">Senior Engineer</div>
                </div>
              </div>
              <div className="text-yellow-500 text-xl mb-3">★★★★★</div>
              <p className="text-gray-700 italic">
                "Finally, a snippet manager that actually works! The share codes feature is perfect for team collaboration. Highly recommend!"
              </p>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-gray-100 border-2 border-gray-900 rounded-2xl p-8 shadow-[6px_6px_0_#191A23]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-[#B9FF66] rounded-full flex items-center justify-center text-2xl font-bold border-2 border-gray-900">
                  A
                </div>
                <div>
                  <div className="font-bold text-gray-900">Aisha Patel</div>
                  <div className="text-sm text-gray-600">Freelance Developer</div>
                </div>
              </div>
              <div className="text-yellow-500 text-xl mb-3">★★★★★</div>
              <p className="text-gray-700 italic">
                "I've tried many snippet tools, but SnippetSync is by far the best. Clean UI, fast sync, and the tagging system is perfect for organization."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 text-center">
            <div>
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#B9FF66] mb-2">10K+</div>
              <div className="text-white text-sm sm:text-base">Active Users</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#B9FF66] mb-2">50K+</div>
              <div className="text-white text-sm sm:text-base">Snippets Shared</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#B9FF66] mb-2">100K+</div>
              <div className="text-white text-sm sm:text-base">Code Imports</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#B9FF66] mb-2">24/7</div>
              <div className="text-white text-sm sm:text-base">Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 bg-[#B9FF66]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
            Ready to Organize Your Code?
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-900 mb-6 sm:mb-8">
            Join thousands of developers who trust SnippetSync for their code management
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <Link to="/signup" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 bg-gray-900 text-white font-bold text-lg sm:text-xl rounded-lg hover:bg-gray-800 transition-colors border-2 border-gray-900 shadow-[8px_8px_0_#191A23] hover:shadow-[4px_4px_0_#191A23] hover:translate-x-[4px] hover:translate-y-[4px]">
                Start Free Today
              </button>
            </Link>
            <Link to="/explore">
              <button className="px-10 py-5 bg-white text-gray-900 font-bold text-xl rounded-lg hover:bg-gray-100 transition-colors border-2 border-gray-900 shadow-[8px_8px_0_#191A23] hover:shadow-[4px_4px_0_#191A23] hover:translate-x-[4px] hover:translate-y-[4px]">
                Explore Snippets
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 sm:py-10 md:py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
            <div>
              <div className="text-2xl font-bold mb-4">
                <span className="bg-[#B9FF66] text-gray-900 px-2 py-1 rounded">Snippet</span>
                <span>Sync</span>
              </div>
              <p className="text-gray-400">
                The ultimate code snippet manager for modern developers.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/explore" className="hover:text-[#B9FF66]">Explore</Link></li>
                <li><Link to="/guide" className="hover:text-[#B9FF66]">Guide</Link></li>
                <li><Link to="/signup" className="hover:text-[#B9FF66]">Sign Up</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-[#B9FF66]">Documentation</a></li>
                <li><a href="#" className="hover:text-[#B9FF66]">API Reference</a></li>
                <li><a href="#" className="hover:text-[#B9FF66]">Support</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Connect</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-[#B9FF66]">GitHub</a></li>
                <li><a href="#" className="hover:text-[#B9FF66]">Twitter</a></li>
                <li><a href="#" className="hover:text-[#B9FF66]">Discord</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>© 2025 SnippetSync. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
