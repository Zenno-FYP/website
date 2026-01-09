import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { Sparkles, Mail, Lock, User, Github, Eye, EyeOff } from "lucide-react";

interface AuthPageProps {
  theme: 'light' | 'dark';
  onLogin: () => void;
}

export function AuthPage({ theme, onLogin }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate authentication
    onLogin();
  };

  const handleSocialLogin = (provider: 'google' | 'github') => {
    // Simulate social login
    console.log(`Logging in with ${provider}`);
    onLogin();
  };

  return (
    <div className={`min-h-screen flex items-center justify-center relative overflow-hidden transition-colors duration-500 py-8 ${
      theme === 'dark' 
        ? 'bg-[#0a0a0f]' 
        : 'bg-gradient-to-br from-[#E8EAFF] via-[#F5F3FF] to-[#FDF4FF]'
    }`}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Subtle grid pattern overlay */}
        {theme === 'dark' && (
          <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}></div>
        )}
        
        {/* Gradient overlays */}
        <div className={`absolute inset-0 ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-[#1a1a2e]/30 via-transparent to-transparent'
            : ''
        }`}></div>
        
        <div className={`absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse ${
          theme === 'dark' 
            ? 'bg-gradient-to-br from-purple-600/20 to-blue-600/10' 
            : 'bg-gradient-to-br from-purple-400/10 to-purple-300/5'
        }`}></div>
        <div className={`absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse ${
          theme === 'dark' 
            ? 'bg-gradient-to-br from-purple-600/20 to-[#7C4DFF]/10' 
            : 'bg-gradient-to-br from-purple-400/10 to-purple-300/5'
        }`} style={{ animationDelay: '2s' }}></div>
        
        {/* Diagonal accent */}
        {theme === 'dark' && (
          <div className="absolute top-0 right-0 w-full h-full">
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-purple-600/5 to-transparent rotate-12 transform translate-x-1/3 -translate-y-1/3 blur-2xl"></div>
          </div>
        )}
      </div>

      {/* Main Auth Card */}
      <div className="relative z-10 w-full max-w-md px-6">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="relative group">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#5B6FD8] to-[#7C4DFF] flex items-center justify-center shadow-2xl group-hover:shadow-purple-500/30 group-hover:scale-105 transition-all duration-300">
              <Sparkles className="w-8 h-8 text-white drop-shadow-md" />
            </div>
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent opacity-50"></div>
          </div>
        </div>

        {/* Welcome Text */}
        <div className="text-center mb-6">
          <h1 className={`text-3xl font-bold mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Welcome to Zenno
          </h1>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            {isLogin ? 'Sign in to access your developer analytics' : 'Create your account to get started'}
          </p>
        </div>

        {/* Auth Card */}
        <Card className={`p-5 rounded-3xl shadow-2xl backdrop-blur-2xl border transition-all ${
          theme === 'dark' ? 'bg-gray-900/80 border-white/10' : 'bg-white/80 border-white/60'
        }`}>
          {/* Toggle Tabs */}
          <div className={`flex rounded-2xl p-1 mb-4 ${
            theme === 'dark' ? 'bg-white/5' : 'bg-gray-100/80'
          }`}>
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-1.5 px-4 rounded-xl font-medium text-sm transition-all duration-300 ${
                isLogin
                  ? 'bg-gradient-to-r from-[#5B6FD8] to-[#7C4DFF] text-white shadow-lg'
                  : theme === 'dark' 
                    ? 'text-gray-400 hover:text-white' 
                    : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-1.5 px-4 rounded-xl font-medium text-sm transition-all duration-300 ${
                !isLogin
                  ? 'bg-gradient-to-r from-[#5B6FD8] to-[#7C4DFF] text-white shadow-lg'
                  : theme === 'dark' 
                    ? 'text-gray-400 hover:text-white' 
                    : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-2.5">
            {/* Name Field (Only for Signup) */}
            {!isLogin && (
              <div className="space-y-1">
                <label className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Full Name
                </label>
                <div className="relative">
                  <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <Input
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`pl-10 py-4 rounded-xl backdrop-blur-xl transition-all ${
                      theme === 'dark'
                        ? 'border-white/10 bg-white/5 hover:bg-white/10 focus:bg-white/10 text-white placeholder:text-gray-400 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20'
                        : 'border-gray-200/50 bg-white/40 hover:bg-white/60 focus:bg-white/60 placeholder:text-gray-500 focus:border-[#5B6FD8]/50 focus:ring-2 focus:ring-[#5B6FD8]/20'
                    }`}
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1">
              <label className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Email Address
              </label>
              <div className="relative">
                <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`pl-10 py-4 rounded-xl backdrop-blur-xl transition-all ${
                    theme === 'dark'
                      ? 'border-white/10 bg-white/5 hover:bg-white/10 focus:bg-white/10 text-white placeholder:text-gray-400 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20'
                      : 'border-gray-200/50 bg-white/40 hover:bg-white/60 focus:bg-white/60 placeholder:text-gray-500 focus:border-[#5B6FD8]/50 focus:ring-2 focus:ring-[#5B6FD8]/20'
                  }`}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Password
              </label>
              <div className="relative">
                <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className={`pl-10 pr-10 py-4 rounded-xl backdrop-blur-xl transition-all ${
                    theme === 'dark'
                      ? 'border-white/10 bg-white/5 hover:bg-white/10 focus:bg-white/10 text-white placeholder:text-gray-400 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20'
                      : 'border-gray-200/50 bg-white/40 hover:bg-white/60 focus:bg-white/60 placeholder:text-gray-500 focus:border-[#5B6FD8]/50 focus:ring-2 focus:ring-[#5B6FD8]/20'
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                    theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Forgot Password (Only for Login) */}
            {isLogin && (
              <div className="flex justify-end">
                <button
                  type="button"
                  className={`text-xs font-medium transition-colors ${
                    theme === 'dark'
                      ? 'text-purple-400 hover:text-purple-300'
                      : 'text-[#5B6FD8] hover:text-[#7C4DFF]'
                  }`}
                >
                  Forgot password?
                </button>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[#5B6FD8] to-[#7C4DFF] hover:from-[#4d5fc7] hover:to-[#6b3eef] text-white font-medium shadow-lg hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300 mt-4"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-4">
            <div className={`absolute inset-0 flex items-center ${
              theme === 'dark' ? 'opacity-20' : 'opacity-100'
            }`}>
              <div className={`w-full border-t ${
                theme === 'dark' ? 'border-white/10' : 'border-gray-200'
              }`}></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className={`px-2 ${
                theme === 'dark' ? 'bg-gray-900/80 text-gray-400' : 'bg-white/80 text-gray-500'
              }`}>
                Or continue with
              </span>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* Google */}
            <button
              type="button"
              onClick={() => handleSocialLogin('google')}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl font-medium text-sm transition-all duration-300 ${
                theme === 'dark'
                  ? 'bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white'
                  : 'bg-white/60 hover:bg-white/80 border border-gray-200/50 hover:border-gray-300 text-gray-700'
              }`}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  opacity="0.9"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  opacity="0.7"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  opacity="0.5"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  opacity="0.6"
                />
              </svg>
              Google
            </button>

            {/* GitHub */}
            <button
              type="button"
              onClick={() => handleSocialLogin('github')}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl font-medium text-sm transition-all duration-300 ${
                theme === 'dark'
                  ? 'bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white'
                  : 'bg-white/60 hover:bg-white/80 border border-gray-200/50 hover:border-gray-300 text-gray-700'
              }`}
            >
              <Github className="w-5 h-5" />
              GitHub
            </button>
          </div>
        </Card>

        {/* Footer */}
        <div className="mt-5 text-center">
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className={`font-medium transition-colors ${
                theme === 'dark'
                  ? 'text-purple-400 hover:text-purple-300'
                  : 'text-[#5B6FD8] hover:text-[#7C4DFF]'
              }`}
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}