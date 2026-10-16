import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, ShieldCheck, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { Button } from '../../components/common/Button.js';
import { useToast } from '../../context/ToastContext.js';

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await signIn(email, password);
      if (error) {
        toast.error('Authentication Failed', error.message || 'Invalid staff email or password');
      } else {
        toast.success('Welcome Back!', 'Logged in to Staff & Management Dashboard');
        navigate('/admin');
      }
    } catch (err: unknown) {
      toast.error('Login Error', (err as Error).message || 'An error occurred during authentication');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-950 text-slate-100 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md transition-all hover:bg-white/10 mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Public Website
        </Link>

        <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-white flex items-center justify-center mx-auto shadow-2xl mb-3">
          <ShieldCheck className="w-6 h-6 text-sky-400" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Staff & Management Portal
        </h1>
        <p className="mt-1 text-xs text-slate-400">
          Baba Anandeshwar Internet Cafe &bull; Authorized Personnel Only
        </p>
      </div>

      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="backdrop-blur-2xl bg-white/[0.04] border border-white/[0.12] shadow-2xl rounded-3xl p-6 sm:p-8 space-y-6">
          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Staff Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="Enter staff email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-400 hover:to-teal-400 text-white font-medium py-2.5 rounded-xl shadow-lg shadow-sky-500/20"
                isLoading={isLoading}
              >
                Sign In to Staff Dashboard
              </Button>
            </div>
          </form>

          {/* Secure Note */}
          <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/10 text-xs text-slate-400 space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-slate-200">
              <ShieldCheck className="w-4 h-4 text-sky-400" />
              <span>Restricted Business Portal</span>
            </div>
            <p className="leading-relaxed text-[11px] text-slate-400">
              Access is restricted to authorized cafe staff. All authentication attempts and operations are recorded for security.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
