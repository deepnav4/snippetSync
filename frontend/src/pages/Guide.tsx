import { Link } from 'react-router-dom';

export default function Guide() {
  return (
    <div className="min-h-screen bg-gray-100 py-8 sm:py-10 md:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
            VS Code <span className="bg-[#B9FF66] px-2">Extension</span> Guide
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600">
            Learn how to import and export code snippets directly from VS Code
          </p>
        </div>

        {/* Installation Section */}
        <div className="bg-white border-2 border-gray-900 rounded-2xl shadow-[8px_8px_0_#191A23] p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <span className="text-3xl sm:text-4xl">📦</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Step 1: Install Extension</h2>
          </div>
          
          <div className="space-y-4">
            <p className="text-gray-700 text-lg">
              Install the SnippetSync extension from the VS Code marketplace:
            </p>
            
            <div className="bg-gray-900 text-[#B9FF66] p-6 rounded-xl border-2 border-gray-900 font-mono">
              <div className="mb-2 text-white">Method 1: Via Command Palette</div>
              <div className="pl-4">1. Press <kbd className="bg-gray-800 px-2 py-1 rounded">Ctrl+Shift+P</kbd></div>
              <div className="pl-4">2. Type "Extensions: Install Extensions"</div>
              <div className="pl-4">3. Search for "SnippetSync"</div>
              <div className="pl-4">4. Click Install</div>
            </div>

            <div className="bg-gray-900 text-[#B9FF66] p-6 rounded-xl border-2 border-gray-900 font-mono">
              <div className="mb-2 text-white">Method 2: Via Extensions Tab</div>
              <div className="pl-4">1. Click Extensions icon in sidebar or press <kbd className="bg-gray-800 px-2 py-1 rounded">Ctrl+Shift+X</kbd></div>
              <div className="pl-4">2. Search "SnippetSync"</div>
              <div className="pl-4">3. Click Install</div>
            </div>
          </div>
        </div>

        {/* Configuration Section */}
        <div className="bg-white border-2 border-gray-900 rounded-2xl shadow-[8px_8px_0_#191A23] p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-4xl">⚙️</span>
            <h2 className="text-3xl font-bold text-gray-900">Step 2: Configure Extension</h2>
          </div>
          
          <div className="space-y-4">
            <p className="text-gray-700 text-lg">
              Set up your SnippetSync account in VS Code:
            </p>
            
            <div className="bg-gray-50 border-2 border-gray-300 rounded-xl p-6">
              <ol className="space-y-3 text-gray-700">
                <li className="flex gap-3">
                  <span className="bg-[#B9FF66] text-gray-900 font-bold px-3 py-1 rounded-full border-2 border-gray-900 flex-shrink-0">1</span>
                  <span>Open Command Palette with <kbd className="bg-gray-200 px-2 py-1 rounded border border-gray-400">Ctrl+Shift+P</kbd></span>
                </li>
                <li className="flex gap-3">
                  <span className="bg-[#B9FF66] text-gray-900 font-bold px-3 py-1 rounded-full border-2 border-gray-900 flex-shrink-0">2</span>
                  <span>Type <strong>"SnippetSync: Login"</strong></span>
                </li>
                <li className="flex gap-3">
                  <span className="bg-[#B9FF66] text-gray-900 font-bold px-3 py-1 rounded-full border-2 border-gray-900 flex-shrink-0">3</span>
                  <span>Enter your email and password</span>
                </li>
                <li className="flex gap-3">
                  <span className="bg-[#B9FF66] text-gray-900 font-bold px-3 py-1 rounded-full border-2 border-gray-900 flex-shrink-0">4</span>
                  <span>Your access token will be saved securely</span>
                </li>
              </ol>
            </div>
          </div>
        </div>

        {/* Export Section */}
        <div className="bg-white border-2 border-gray-900 rounded-2xl shadow-[8px_8px_0_#191A23] p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-4xl">📤</span>
            <h2 className="text-3xl font-bold text-gray-900">Exporting Snippets</h2>
          </div>
          
          <div className="space-y-6">
            <p className="text-gray-700 text-lg">
              Share your code snippets from VS Code to SnippetSync:
            </p>
            
            <div className="bg-gray-50 border-2 border-gray-300 rounded-xl p-6">
              <h3 className="font-bold text-xl text-gray-900 mb-4">📝 Export Selected Code</h3>
              <ol className="space-y-3 text-gray-700">
                <li className="flex gap-3">
                  <span className="bg-[#B9FF66] text-gray-900 font-bold px-3 py-1 rounded-full border-2 border-gray-900 flex-shrink-0">1</span>
                  <span>Select the code you want to export in your editor</span>
                </li>
                <li className="flex gap-3">
                  <span className="bg-[#B9FF66] text-gray-900 font-bold px-3 py-1 rounded-full border-2 border-gray-900 flex-shrink-0">2</span>
                  <span>Right-click and choose <strong>"SnippetSync: Export Selection"</strong></span>
                </li>
                <li className="flex gap-3">
                  <span className="bg-[#B9FF66] text-gray-900 font-bold px-3 py-1 rounded-full border-2 border-gray-900 flex-shrink-0">3</span>
                  <span>Enter a title for your snippet</span>
                </li>
                <li className="flex gap-3">
                  <span className="bg-[#B9FF66] text-gray-900 font-bold px-3 py-1 rounded-full border-2 border-gray-900 flex-shrink-0">4</span>
                  <span>Add a description (optional)</span>
                </li>
                <li className="flex gap-3">
                  <span className="bg-[#B9FF66] text-gray-900 font-bold px-3 py-1 rounded-full border-2 border-gray-900 flex-shrink-0">5</span>
                  <span>Choose visibility (Public/Private)</span>
                </li>
                <li className="flex gap-3">
                  <span className="bg-[#B9FF66] text-gray-900 font-bold px-3 py-1 rounded-full border-2 border-gray-900 flex-shrink-0">6</span>
                  <span>Add tags (optional)</span>
                </li>
                <li className="flex gap-3">
                  <span className="bg-[#B9FF66] text-gray-900 font-bold px-3 py-1 rounded-full border-2 border-gray-900 flex-shrink-0">7</span>
                  <span>Click Export - Your snippet is now saved!</span>
                </li>
              </ol>
            </div>

            <div className="bg-[#B9FF66] border-2 border-gray-900 rounded-xl p-6">
              <h3 className="font-bold text-xl text-gray-900 mb-3">⌨️ Keyboard Shortcut</h3>
              <p className="text-gray-900">
                Press <kbd className="bg-white px-3 py-1 rounded border-2 border-gray-900">Ctrl+Shift+E</kbd> to quickly export selected code
              </p>
            </div>
          </div>
        </div>

        {/* Import Section */}
        <div className="bg-white border-2 border-gray-900 rounded-2xl shadow-[8px_8px_0_#191A23] p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-4xl">📥</span>
            <h2 className="text-3xl font-bold text-gray-900">Importing Snippets</h2>
          </div>
          
          <div className="space-y-6">
            <p className="text-gray-700 text-lg">
              Import code snippets from SnippetSync directly into VS Code:
            </p>
            
            <div className="bg-gray-50 border-2 border-gray-300 rounded-xl p-6">
              <h3 className="font-bold text-xl text-gray-900 mb-4">🔑 Using Share Code</h3>
              <ol className="space-y-3 text-gray-700">
                <li className="flex gap-3">
                  <span className="bg-[#B9FF66] text-gray-900 font-bold px-3 py-1 rounded-full border-2 border-gray-900 flex-shrink-0">1</span>
                  <span>On the SnippetSync website, open any snippet</span>
                </li>
                <li className="flex gap-3">
                  <span className="bg-[#B9FF66] text-gray-900 font-bold px-3 py-1 rounded-full border-2 border-gray-900 flex-shrink-0">2</span>
                  <span>Click <strong>"Generate Share Code"</strong> button</span>
                </li>
                <li className="flex gap-3">
                  <span className="bg-[#B9FF66] text-gray-900 font-bold px-3 py-1 rounded-full border-2 border-gray-900 flex-shrink-0">3</span>
                  <span>Copy the 6-character code (e.g., <code className="bg-gray-200 px-2 py-1 rounded">ABC123</code>)</span>
                </li>
                <li className="flex gap-3">
                  <span className="bg-[#B9FF66] text-gray-900 font-bold px-3 py-1 rounded-full border-2 border-gray-900 flex-shrink-0">4</span>
                  <span>In VS Code, press <kbd className="bg-gray-200 px-2 py-1 rounded border border-gray-400">Ctrl+Shift+P</kbd></span>
                </li>
                <li className="flex gap-3">
                  <span className="bg-[#B9FF66] text-gray-900 font-bold px-3 py-1 rounded-full border-2 border-gray-900 flex-shrink-0">5</span>
                  <span>Type <strong>"SnippetSync: Import Snippet"</strong></span>
                </li>
                <li className="flex gap-3">
                  <span className="bg-[#B9FF66] text-gray-900 font-bold px-3 py-1 rounded-full border-2 border-gray-900 flex-shrink-0">6</span>
                  <span>Paste the share code</span>
                </li>
                <li className="flex gap-3">
                  <span className="bg-[#B9FF66] text-gray-900 font-bold px-3 py-1 rounded-full border-2 border-gray-900 flex-shrink-0">7</span>
                  <span>The snippet will be inserted at your cursor position!</span>
                </li>
              </ol>
            </div>

            <div className="bg-[#B9FF66] border-2 border-gray-900 rounded-xl p-6">
              <h3 className="font-bold text-xl text-gray-900 mb-3">⚠️ Important Note</h3>
              <p className="text-gray-900">
                Share codes expire after <strong>5 minutes</strong> for security. Generate a new code if yours has expired.
              </p>
            </div>
          </div>
        </div>

        {/* Browse Section */}
        <div className="bg-white border-2 border-gray-900 rounded-2xl shadow-[8px_8px_0_#191A23] p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-4xl">🔍</span>
            <h2 className="text-3xl font-bold text-gray-900">Browse Your Snippets</h2>
          </div>
          
          <div className="space-y-4">
            <p className="text-gray-700 text-lg">
              View and manage all your snippets directly in VS Code:
            </p>
            
            <div className="bg-gray-50 border-2 border-gray-300 rounded-xl p-6">
              <ol className="space-y-3 text-gray-700">
                <li className="flex gap-3">
                  <span className="bg-[#B9FF66] text-gray-900 font-bold px-3 py-1 rounded-full border-2 border-gray-900 flex-shrink-0">1</span>
                  <span>Open Command Palette <kbd className="bg-gray-200 px-2 py-1 rounded border border-gray-400">Ctrl+Shift+P</kbd></span>
                </li>
                <li className="flex gap-3">
                  <span className="bg-[#B9FF66] text-gray-900 font-bold px-3 py-1 rounded-full border-2 border-gray-900 flex-shrink-0">2</span>
                  <span>Type <strong>"SnippetSync: Browse My Snippets"</strong></span>
                </li>
                <li className="flex gap-3">
                  <span className="bg-[#B9FF66] text-gray-900 font-bold px-3 py-1 rounded-full border-2 border-gray-900 flex-shrink-0">3</span>
                  <span>Select any snippet to insert it into your editor</span>
                </li>
              </ol>
            </div>
          </div>
        </div>

        {/* Troubleshooting */}
        <div className="bg-white border-2 border-gray-900 rounded-2xl shadow-[8px_8px_0_#191A23] p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-4xl">🔧</span>
            <h2 className="text-3xl font-bold text-gray-900">Troubleshooting</h2>
          </div>
          
          <div className="space-y-4">
            <div className="border-l-4 border-[#B9FF66] bg-gray-50 p-4 rounded-r-lg">
              <h3 className="font-bold text-gray-900 mb-2">❌ "Not authenticated" error</h3>
              <p className="text-gray-700">Run <strong>"SnippetSync: Login"</strong> again and re-enter your credentials</p>
            </div>

            <div className="border-l-4 border-[#B9FF66] bg-gray-50 p-4 rounded-r-lg">
              <h3 className="font-bold text-gray-900 mb-2">❌ "Share code expired" error</h3>
              <p className="text-gray-700">Generate a new share code from the website. Codes expire after 5 minutes.</p>
            </div>

            <div className="border-l-4 border-[#B9FF66] bg-gray-50 p-4 rounded-r-lg">
              <h3 className="font-bold text-gray-900 mb-2">❌ "Failed to export" error</h3>
              <p className="text-gray-700">Check your internet connection and ensure you're logged in</p>
            </div>

            <div className="border-l-4 border-[#B9FF66] bg-gray-50 p-4 rounded-r-lg">
              <h3 className="font-bold text-gray-900 mb-2">❌ Commands not appearing</h3>
              <p className="text-gray-700">Restart VS Code after installing the extension</p>
            </div>
          </div>
        </div>

        {/* Quick Reference */}
        <div className="bg-gray-900 text-white border-2 border-gray-900 rounded-2xl shadow-[8px_8px_0_#191A23] p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-4xl">⚡</span>
            <h2 className="text-3xl font-bold">Quick Reference</h2>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center bg-gray-800 p-3 rounded-lg">
              <span>Export Selection</span>
              <kbd className="bg-gray-700 px-3 py-1 rounded border border-gray-600">Ctrl+Shift+E</kbd>
            </div>
            <div className="flex justify-between items-center bg-gray-800 p-3 rounded-lg">
              <span>Import Snippet</span>
              <span className="text-[#B9FF66]">Ctrl+Shift+P → Import Snippet</span>
            </div>
            <div className="flex justify-between items-center bg-gray-800 p-3 rounded-lg">
              <span>Browse Snippets</span>
              <span className="text-[#B9FF66]">Ctrl+Shift+P → Browse My Snippets</span>
            </div>
            <div className="flex justify-between items-center bg-gray-800 p-3 rounded-lg">
              <span>Login</span>
              <span className="text-[#B9FF66]">Ctrl+Shift+P → Login</span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link to="/explore">
            <button className="px-8 py-4 bg-[#B9FF66] text-gray-900 font-bold text-lg rounded-lg hover:bg-[#a3e655] transition-colors border-2 border-gray-900 shadow-[6px_6px_0_#191A23] hover:shadow-[3px_3px_0_#191A23] hover:translate-x-[3px] hover:translate-y-[3px]">
              Explore Snippets →
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
