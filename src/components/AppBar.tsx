import { Bot, RefreshCcwDot } from 'lucide-react';

interface AppBarProps {
  onClearMessages: () => void;
}

export function AppBar({ onClearMessages }: AppBarProps) {
  return (
    <div className="sticky top-0 bg-transparent shadow-lg px-6 py-2 z-10 env(safe-area-inset-top)">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Bot className="w-8 h-8 text-gray-900 bg-gradient-to-r from-pink-200 to-blue-400 p-1 rounded-full" />
          <div>
            <h1 className="text-md sm:text-xl font-bold text-white">Campus - AI Chat</h1>
            <p className="text-blue-200 text-sm">BICIOT Level 3</p>
          </div>
        </div>
        <button
          onClick={onClearMessages}
          className="p-2 rounded-full text-gray-300 hover:text-white-100 transition-colors"
          title="Clear Messages"
        >
          <RefreshCcwDot className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}