import { useState, useEffect } from 'react';
import { Bot, RefreshCcwDot, User } from 'lucide-react';
import { useChat } from '../contexts/ChatContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface AppBarProps {
  onClearMessages: () => void;
}

export function AppBar({ onClearMessages }: AppBarProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [contextLabel, setContextLabel] = useState<string>('Answering IoT course');

  useEffect(() => {
    setContextLabel('Ask about your IoT enrollment');
  }, []);

  const handleAuthClick = () => {
    navigate('/auth');
  };

  return (
    <div className="sticky top-0 bg-transparent shadow-lg px-6 py-2 z-10 env(safe-area-inset-top)">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Bot className="w-8 h-8 text-gray-900 bg-gradient-to-r from-pink-200 to-blue-400 p-1 rounded-full" />
          <div>
            <h1 className="text-md sm:text-xl font-bold text-white">Campus AI</h1>
            <p className="text-blue-200 text-sm">Guest</p>
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
        </div>
      </div>
    </div>
  );
}