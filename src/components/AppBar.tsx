import { useState, useEffect, useRef } from 'react';
import { Bot, RefreshCcwDot, User, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface AppBarProps {
  onClearMessages: () => void;
}

export function AppBar({ onClearMessages }: AppBarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showAccountModal, setShowAccountModal] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleAuthClick = () => {
    if (user) {
      setShowAccountModal(true);
      return;
    }

    navigate('/auth');
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      setShowAccountModal(false);
    }
  };

  useEffect(() => {
    if (showAccountModal) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showAccountModal]);

  return (
    <div className="sticky top-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 shadow-lg px-6 py-2 z-10 env(safe-area-inset-top)">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Bot className="w-8 h-8 text-gray-900 bg-gradient-to-r from-pink-200 to-blue-400 p-1 rounded-full" />
          <div>
            <h1 className="text-md sm:text-xl font-bold text-white">Campus AI</h1>
            <p className="text-blue-200 text-sm">{user?.course || 'Guest'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onClearMessages}
            className="p-2 rounded-full text-gray-300 hover:text-white-100 transition-colors"
            title="Clear Messages"
          >
            <RefreshCcwDot className="w-5 h-5" />
          </button>
          <button
            onClick={handleAuthClick}
            className="p-2 rounded-full text-gray-300 hover:text-white-100 transition-colors relative"
            title={user ? "Account" : "Login"}
          >
            <User className="w-5 h-5" />
            {user && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-gray-900"></span>
            )}
          </button>
          <div className='relative'>
            {showAccountModal && (
              <div ref={modalRef} className="absolute top-10 right-0 min-w-[300px] bg-gray-800 text-white p-4 rounded-lg shadow-lg z-10">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold">Logged in as:</h2>
                  <button
                    onClick={() => setShowAccountModal(false)}
                    className="p-2 rounded-full text-gray-300 border border-gray-600 hover:text-white-100 transition-colors"
                    title="Close"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
                <p>{user?.name}</p>
                <p>{user?.username}</p>
                <p>{user?.department}</p>
                <p>{user?.faculty}</p>
                <p>{user?.course}</p>
                <button
                  onClick={() => {
                    setShowAccountModal(false);
                    logout();
                  }}
                  className="mt-4 px-4 py-2 bg-transparent border border-red-500/50 text-white rounded-md"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}