import React, { useState } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { setAuth } from '@/store/authSlice';
import { authApi } from '@/api/services';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { X, Lock, Mail, User, Shield, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultMode = 'login',
}) => {
  const dispatch = useAppDispatch();
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
  const isGoogleConfigured = googleClientId && !googleClientId.startsWith('your_google_client_id');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'register') {
        if (!name.trim()) throw new Error('Please enter your full name.');
        if (password.length < 6) throw new Error('Password must be at least 6 characters.');
        
        const res = await authApi.register({ name, email, password });
        dispatch(setAuth({ user: res.user, token: res.access_token }));
        onClose();
      } else {
        const res = await authApi.login({ email, password });
        dispatch(setAuth({ user: res.user, token: res.access_token }));
        onClose();
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillQuickDemo = (role: 'customer' | 'admin') => {
    if (role === 'admin') {
      setEmail('admin@shopsphere.com');
      setPassword('admin123');
      setName('ShopSphere Admin');
    } else {
      setEmail('demo@shopsphere.com');
      setPassword('demo123');
      setName('Demo Customer');
    }
    setError(null);
  };

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) return;
    try {
      setError(null);
      setLoading(true);
      const res = await authApi.loginWithGoogle(credentialResponse.credential);
      dispatch(setAuth({ user: res.user, token: res.access_token }));
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Google sign-in failed on the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1C130E]/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="w-full max-w-md rounded-3xl bg-[#FAF7F2] p-6 sm:p-8 shadow-2xl border border-[#DFD5C6] relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-lg text-[#82746C] hover:text-[#1C130E] hover:bg-stone-200/60 transition"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center space-y-1 mb-6">
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#C24A2A] text-white font-black text-xl mb-2 shadow-md shadow-[#C24A2A]/25">
            S
          </div>
          <h2 className="text-2xl font-black text-[#1C130E] tracking-tight">
            {mode === 'login' ? 'Welcome back to ShopSphere' : 'Create your account'}
          </h2>
          <p className="text-xs text-[#82746C]">
            {mode === 'login'
              ? 'Enter your credentials to access your orders, cart and fast COD checkout.'
              : 'Sign up to shop curated products and track shipments.'}
          </p>
        </div>

        {/* Quick Demo Fill Buttons (For Examiner / Evaluator Demo) */}
        <div className="mb-5 p-3.5 rounded-2xl bg-white border border-[#EFE8DE] shadow-xs">
          <p className="text-[11px] font-bold text-[#4A3C33] mb-2 flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-[#C24A2A]" />
            <span>1-Click Evaluator Demo Accounts:</span>
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => fillQuickDemo('customer')}
              className="py-2 px-2.5 rounded-xl bg-[#FAF7F2] border border-[#DFD5C6] text-xs font-bold text-[#1C130E] hover:border-[#C24A2A] hover:text-[#C24A2A] hover:bg-[#FDF2EE] transition flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <User className="h-3 w-3 text-[#82746C]" />
              <span>Customer Demo</span>
            </button>
            <button
              type="button"
              onClick={() => fillQuickDemo('admin')}
              className="py-2 px-2.5 rounded-xl bg-[#FAF7F2] border border-[#DFD5C6] text-xs font-bold text-[#1C130E] hover:border-amber-600 hover:text-amber-800 hover:bg-amber-50 transition flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <Shield className="h-3 w-3 text-amber-600" />
              <span>Admin Demo</span>
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-500 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-[#4A3C33] mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#82746C]" />
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-[#DFD5C6] rounded-xl text-xs text-[#1C130E] placeholder:text-[#82746C] focus:outline-none focus:border-[#C24A2A] focus:ring-2 focus:ring-[#C24A2A]/15 transition"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-[#4A3C33] mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#82746C]" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-[#DFD5C6] rounded-xl text-xs text-[#1C130E] placeholder:text-[#82746C] focus:outline-none focus:border-[#C24A2A] focus:ring-2 focus:ring-[#C24A2A]/15 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#4A3C33] mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#82746C]" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-[#DFD5C6] rounded-xl text-xs text-[#1C130E] placeholder:text-[#82746C] focus:outline-none focus:border-[#C24A2A] focus:ring-2 focus:ring-[#C24A2A]/15 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#C24A2A] hover:bg-[#A83A1D] text-white font-bold text-xs shadow-md shadow-[#C24A2A]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating...' : mode === 'login' ? 'Sign In to ShopSphere' : 'Create Free Account'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        {/* Google OAuth Option */}
        {isGoogleConfigured && (
          <div className="mt-4 pt-4 border-t border-[#EFE8DE] flex flex-col items-center">
            <span className="text-[11px] text-[#82746C] mb-3">Or continue with Google</span>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Google sign-in popup closed or failed.')}
              shape="pill"
              size="medium"
              text={mode === 'login' ? 'signin_with' : 'signup_with'}
            />
          </div>
        )}

        {/* Toggle Mode */}
        <div className="mt-5 text-center text-xs text-[#82746C]">
          {mode === 'login' ? (
            <>
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setError(null);
                }}
                className="font-bold text-[#C24A2A] hover:underline"
              >
                Sign up free
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError(null);
                }}
                className="font-bold text-[#C24A2A] hover:underline"
              >
                Sign in
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
