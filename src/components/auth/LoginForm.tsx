import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import AuthModal from './AuthModal';

interface LoginFormProps {
  onToggleForm: () => void;
}

type AuthMode = 'login' | 'nopassword';

export const LoginForm: React.FC<LoginFormProps> = ({ onToggleForm }) => {
  const { user, login, verify, authError, setAuthError, isLoading } = useAuth();
  const [mode, setMode] = useState<AuthMode>('login');
  const [studentNumber, setStudentNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let result = await login(studentNumber, password);
    if (mode === 'login') {
      result = await login(studentNumber, password);
    } else {
      result = await verify(studentNumber, null);
    }

    if (!result.success) {
      if (result.error.message.includes('verified')) {
        setShowError(false);
        setShowVerificationModal(true);
      } else {
        setShowError(true);
        setAuthError(result.error);
      }

      return;
    }
  };

  const handleVerifyEmail = async () => {
    try {
      await verify(user?.email as string, null);
      setShowVerificationModal(false);
    } catch (error) {
      console.error('Verification error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {showError && (
        <div className="bg-red-900/30 border border-red-500 border-dotted text-red-200 px-4 py-2 mb-4 rounded-lg">
          {authError.message}
        </div>
      )}

      <Input
        label="Student Number"
        type="text"
        value={studentNumber}
        onChange={(e) => setStudentNumber(e.target.value)}
        placeholder=""
        icon={User}
        required
      />

      {mode === 'login' && <Input
        label="Password"
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder=""
        icon={Lock}
        rightIcon={showPassword ? EyeOff : Eye}
        onRightIconClick={() => setShowPassword(!showPassword)}
        required
      />}

      <div className="flex items-center justify-between my-2">
        <button
          type="button"
          onClick={() => setMode(mode === 'login' ? 'nopassword' : 'login')}
          className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
        >
          {mode === 'login' ? 'Login without a password' : 'Back to login'}
        </button>
      </div>

      <Button 
        type="submit" 
        fullWidth 
        isLoading={isLoading}
        icon={User}
      >
        Login
      </Button>

      <div className="text-center my-2">
        <button
          type="button"
          onClick={onToggleForm}
          className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
        >
          Don't have an account? Sign up
        </button>
      </div>
      <AuthModal
          title="Email Verification Required"
          message="You need to verify your email to gain access. Please check your email for the verification code."
          isOpen={showVerificationModal}
          onClose={() => setShowVerificationModal(false)}
          onConfirm={handleVerifyEmail}
          confirmButtonText="Resend Verification Email"
        />
    </form>
  );
};