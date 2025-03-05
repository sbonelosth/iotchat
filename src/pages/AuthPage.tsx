import React, { useState } from 'react';
import { Bot, X } from 'lucide-react';
import { LoginForm } from '../components/auth/LoginForm';
import { SignupForm } from '../components/auth/SignupForm';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  // If user is already logged in, redirect to home
  if (user) {
    navigate('/');
    return null;
  }

  const handleCancelAuth = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 flex flex-col">
      <button
        onClick={handleCancelAuth}
        className="absolute top-4 right-4 p-2 rounded-full bg-gray-800/50 text-gray-300 hover:bg-gray-700"
      >
        <X className="w-6 h-6" />
      </button>
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="flex justify-center mb-4">
              <Bot className="w-16 h-16 text-gray-900 bg-gradient-to-r from-pink-200 to-blue-400 p-3 rounded-full" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-200 to-blue-400 mb-2">
              {isLogin ? 'Welcome Back' : 'New Account'}
            </h1>
            <p className="text-blue-200">
              {isLogin 
                ? 'Login to access your Campus AI account' 
                : 'Join Campus AI for a personalized experience'}
            </p>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-2xl p-6 sm:p-8">
            {isLogin ? (
              <LoginForm onToggleForm={() => setIsLogin(false)} />
            ) : (
              <SignupForm onToggleForm={() => setIsLogin(true)} />
            )}
          </div>

          <div className="mt-8 text-center text-gray-400 text-sm">
            <p>© 2025 Campus AI. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}