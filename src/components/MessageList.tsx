import React from 'react';
import { MessageItem } from './MessageItem';
import { Message } from '../types';

interface MessageListProps {
  messages: Message[];
  onRetry: (message: Message) => void;
  onEdit: (message: Message) => void;
  isLoading: boolean;
}

export function MessageList({ messages, onRetry, onEdit, isLoading }: MessageListProps) {
  const handleLike = (message: Message) => {
    message.feedback = message.feedback === 'like' ? undefined : 'like';
  };

  const handleDislike = (message: Message) => {
    message.feedback = message.feedback === 'dislike' ? undefined : 'dislike';
  };

  const nonUserMessages = messages.filter(m => !m.isUser);
  const latestAiMessage = nonUserMessages[nonUserMessages.length - 1];

  return (
    <div className="space-y-4">
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
      {isLoading && (
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