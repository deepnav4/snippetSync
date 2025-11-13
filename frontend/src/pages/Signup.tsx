import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    fullName: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signup(formData.username, formData.email, formData.password, formData.fullName);
      // Small delay to ensure state propagates
      setTimeout(() => {
        navigate('/dashboard');
      }, 100);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Join <span className="bg-[#B9FF66] px-2">SnippetSync</span>
          </h1>
          <p className="text-gray-600">Create your account and start organizing code</p>
        </div>

        {/* Form Card */}
        <div className="bg-white border-2 border-gray-900 rounded-2xl p-8 shadow-[8px_8px_0_#191A23]">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 border-2 border-red-600 text-red-600 px-4 py-3 rounded-lg font-medium text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Username *
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={e => setFormData({ ...formData, username: e.target.value })}
                required
                className="w-full px-4 py-3 border-2 border-gray-900 rounded-lg focus:outline-none focus:border-[#B9FF66] focus:ring-2 focus:ring-[#B9FF66] transition-all"
                placeholder="johndoe"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full px-4 py-3 border-2 border-gray-900 rounded-lg focus:outline-none focus:border-[#B9FF66] focus:ring-2 focus:ring-[#B9FF66] transition-all"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-900 rounded-lg focus:outline-none focus:border-[#B9FF66] focus:ring-2 focus:ring-[#B9FF66] transition-all"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Password *
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                required
                minLength={6}
                className="w-full px-4 py-3 border-2 border-gray-900 rounded-lg focus:outline-none focus:border-[#B9FF66] focus:ring-2 focus:ring-[#B9FF66] transition-all"
                placeholder="••••••••"
              />
              <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full px-6 py-4 bg-[#B9FF66] text-gray-900 font-bold text-lg rounded-lg hover:bg-[#a3e655] transition-colors border-2 border-gray-900 shadow-[4px_4px_0_#191A23] hover:shadow-[2px_2px_0_#191A23] hover:translate-x-[2px] hover:translate-y-[2px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-gray-900 font-semibold hover:text-[#B9FF66] transition-colors">
                Login
              </Link>
            </p>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="mt-8 flex justify-center gap-2">
          <div className="w-3 h-3 bg-gray-900 rounded-full"></div>
          <div className="w-3 h-3 bg-[#B9FF66] rounded-full"></div>
          <div className="w-3 h-3 bg-gray-900 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
