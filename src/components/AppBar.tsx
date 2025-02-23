import { useState, useEffect } from 'react';
import { Bot, RefreshCcwDot } from 'lucide-react';
import { useChat } from '../contexts/ChatContext';

interface AppBarProps {
  onClearMessages: () => void;
}

export function AppBar({ onClearMessages }: AppBarProps) {
  const { chatScope } = useChat();
  const [contextLabel, setContextLabel] = useState<string>('Answering IoT course');

  useEffect(() => {
    switch (chatScope) {
      case 'MAIN':
        setContextLabel('General chat');
        break;
      case 'FAI/IS':
        setContextLabel('Ask about your faculty and department');
        break;
      case 'BICIOT':
        setContextLabel(`Ask about your IoT enrollment`);
        break;
    }
  }, [chatScope]);

  return (
    <div className="sticky top-0 bg-transparent shadow-lg px-6 py-2 z-10 env(safe-area-inset-top)">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Bot className="w-8 h-8 text-gray-900 bg-gradient-to-r from-pink-200 to-blue-400 p-1 rounded-full" />
          <div>
            <h1 className="text-md sm:text-xl font-bold text-white">AI Chat - BICIOT Lvl 3</h1>
            <p className="text-blue-200 text-sm">{contextLabel}</p>
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