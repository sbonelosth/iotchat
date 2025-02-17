import { useState, useEffect } from 'react';
import { Bot, Trash2 } from 'lucide-react';
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
        setContextLabel('General IoT chat');
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
    <div className="sticky top-0 bg-gradient-to-r from-blue-900 to-blue-800 shadow-lg px-6 py-2 z-10 env(safe-area-inset-top)">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Bot className="w-8 h-8 text-blue-200" />
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-white">AI Chat - BICIOT Lvl 3</h1>
            <p className="text-blue-200 text-sm">{contextLabel}</p>
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