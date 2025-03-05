import { useEffect, useRef, useState } from 'react';
import { MessageItem } from './MessageItem';
import { Message } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useChat } from '../contexts/ChatContext';
import { jelly } from 'ldrs'

interface MessageListProps {
  messages: Message[];
  onRetry: (message: Message) => void;
  onEdit: (message: Message) => void;
  isResponseLoading: boolean;
}

export function MessageList({ messages, onRetry, onEdit, isResponseLoading }: MessageListProps) {
  const { viewportHeight } = useAuth();
  const chatAreaRef = useRef<HTMLDivElement>(null);
  const { suggestions } = useChat();
  const [latestUserMessage, setLatestUserMessage] = useState<Message | null>(null);

  const handleLike = (message: Message) => {
    message.feedback = message.feedback === 'like' ? undefined : 'like';
  };

  const handleDislike = (message: Message) => {
    message.feedback = message.feedback === 'dislike' ? undefined : 'dislike';
  };

  const nonUserMessages = messages.filter(m => !m.isUser);
  const latestAiMessage = nonUserMessages[nonUserMessages.length - 1];

  useEffect(() => {
    const userMessages = messages.filter(m => m.isUser);
    if (userMessages.length > 0) {
      setLatestUserMessage(userMessages[userMessages.length - 1]);
    }
  }, [messages]);

  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [viewportHeight, messages]);

  jelly.register()

  return (
    <div ref={chatAreaRef} style={{ height: `calc(${viewportHeight}px - 64px)` }} className={`flex flex-col gap-2 p-4 ${suggestions.length === 0 ? 'pb-[100px]' : 'pb-[145px]'} overflow-y-auto`}>
      {!messages.length && <div className="flex justify-center">
        <p className="text-4xl text-transparent bg-clip-text bg-gradient-to-r from-pink-200 to-blue-400 font-bold">Hello, how can I help you today?</p>
      </div>}
      {messages.map((message) => (
        <MessageItem
          key={message.id}
          message={message}
          isLatest={!message.isUser && message.id === latestAiMessage?.id}
          latestUserMessage={latestUserMessage}
          onRetry={onRetry}
          onEdit={onEdit}
          onLike={handleLike}
          onDislike={handleDislike}
        />
      ))}
      {isResponseLoading && (
        <div className="flex justify-start">
          <div className="bg-transparent">
            <l-jelly
              size="30"
              speed="0.9"
              color="aliceblue"
            ></l-jelly>
          </div>
        </div>
      )}
    </div>
  );
}