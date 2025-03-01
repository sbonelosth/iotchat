import { useEffect, useRef } from 'react';
import { MessageItem } from './MessageItem';
import { Message } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface MessageListProps {
  messages: Message[];
  onRetry: (message: Message) => void;
  onEdit: (message: Message) => void;
  isResponseLoading: boolean;
}

export function MessageList({ messages, onRetry, onEdit, isResponseLoading }: MessageListProps) {
  const { viewportHeight } = useAuth();
  const chatAreaRef = useRef<HTMLDivElement>(null);
  
  const handleLike = (message: Message) => {
    message.feedback = message.feedback === 'like' ? undefined : 'like';
  };

  const handleDislike = (message: Message) => {
    message.feedback = message.feedback === 'dislike' ? undefined : 'dislike';
  };

  const nonUserMessages = messages.filter(m => !m.isUser);
  const latestAiMessage = nonUserMessages[nonUserMessages.length - 1];

  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [viewportHeight, messages]);

  return (
    <div ref={chatAreaRef} style={{ height: `calc(${viewportHeight}px - 64px)` }} className="flex flex-col gap-2 p-4 pb-[145px] overflow-y-auto">
      <div className="flex justify-center">
        <p className="text-xl text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-200 to-blue-400 font-bold">Hello, how can I help you today?</p>
      </div>
      {messages.map((message) => (
        <MessageItem
          key={message.id}
          message={message}
          isLatest={!message.isUser && message.id === latestAiMessage?.id}
          onRetry={onRetry}
          onEdit={onEdit}
          onLike={handleLike}
          onDislike={handleDislike}
        />
      ))}
      {isResponseLoading && (
        <div className="flex justify-start">
          <div className="bg-gradient-to-r from-blue-100 to-white p-4 rounded-2xl shadow-md">
            <div className="flex gap-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-.3s]" />
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-.5s]" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}