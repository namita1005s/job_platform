
import React, { useState, useEffect } from 'react';
import { UserRole } from '../types';
import { authService } from '../authService';

interface AuthPageProps {
  initialMode?: 'login' | 'signup';
  onAuthSuccess: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ initialMode = 'login', onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<UserRole>(UserRole.CANDIDATE);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsLogin(initialMode === 'login');
  }, [initialMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await authService.login(formData.email, formData.password);
      } else {
        await authService.signup(formData.name, formData.email, formData.password, role);
      }
      onAuthSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const sunsetGradient = "bg-gradient-to-r from-[#ff9966] to-[#ff5e62]";
  const sunsetShadow = "shadow-lg shadow-orange-200/50";

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-slate-100 animate-scale-up">
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-12 h-12 ${sunsetGradient} rounded-xl mb-4 shadow-lg ${sunsetShadow}`}>
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
          <p className="text-slate-500 mt-2">{isLogin ? 'Enter your credentials to access HireStream' : 'Join our network of top talent and recruiters'}</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 text-rose-600 rounded-xl text-sm font-medium flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 px-1">Full Name</label>
                <input
                  required
                  type="text"
                  className="w-full bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-[#ff5e62]/20 border border-slate-200 rounded-xl px-4 py-3 outline-none transition-all"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 px-1">I am a...</label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-50 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setRole(UserRole.CANDIDATE)}
                    className={`py-2 rounded-lg text-sm font-bold transition-all ${role === UserRole.CANDIDATE ? 'bg-white text-[#ff5e62] shadow-sm' : 'text-slate-500'}`}
                  >
                    Candidate
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole(UserRole.HR)}
                    className={`py-2 rounded-lg text-sm font-bold transition-all ${role === UserRole.HR ? 'bg-white text-[#ff5e62] shadow-sm' : 'text-slate-500'}`}
                  >
                    Recruiter
                  </button>
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 px-1">Email Address</label>
            <input
              required
              type="email"
              className="w-full bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-[#ff5e62]/20 border border-slate-200 rounded-xl px-4 py-3 outline-none transition-all"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 px-1">Password</label>
            <div className="relative">
              <input
                required
                type={showPassword ? "text" : "password"}
                className="w-full bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-[#ff5e62]/20 border border-slate-200 rounded-xl px-4 py-3 outline-none transition-all pr-12"
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#ff5e62] transition-colors"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            disabled={loading}
            type="submit"
            className={`w-full py-4 ${sunsetGradient} text-white rounded-xl font-bold ${sunsetShadow} hover:brightness-110 transition-all disabled:opacity-50 active:scale-95`}
          >
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div className="mt-8 text-center text-sm">
          <span className="text-slate-500">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </span>
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="ml-2 font-bold text-[#ff5e62] hover:opacity-80 underline underline-offset-4"
          >
            {isLogin ? 'Sign Up' : 'Log In'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
