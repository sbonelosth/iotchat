import React from 'react';
import { Bot, Trash2 } from 'lucide-react';

interface AppBarProps {
  onClearMessages: () => void;
}

export function AppBar({ onClearMessages }: AppBarProps) {
  return (
    <div className="sticky top-0 bg-gradient-to-r from-blue-900 to-blue-800 shadow-lg px-6 py-2 z-10">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Bot className="w-8 h-8 text-blue-200" />
          <div>
            <h1 className="text-lg sm:text-2xl font-bold text-white">Information Systems Chat</h1>
            <p className="text-blue-200 text-sm">Ask me anything related to the IoT course</p>
          </div>
        </div>
        <button
          onClick={onClearMessages}
          className="p-2 rounded-full text-white hover:text-red-300 transition-colors"
          title="Clear Messages"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}