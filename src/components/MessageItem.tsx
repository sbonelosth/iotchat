import React, { useState, useEffect } from 'react';
import { RefreshCw, Edit2, ThumbsUp, ThumbsDown, Copy, Check, Paperclip } from 'lucide-react';
import { Message } from '../types';
import { Toast } from './Toast';

interface MessageItemProps {
  message: Message;
  isLatest: boolean;
  onRetry?: (message: Message) => void;
  onEdit?: (message: Message) => void;
  onLike?: (message: Message) => void;
  onDislike?: (message: Message) => void;
}

export function MessageItem({ message, isLatest, onRetry, onEdit, onLike, onDislike }: MessageItemProps) {
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [copied, setCopied] = useState(false);
  const [previousFeedback, setPreviousFeedback] = useState<string | null>(null);

  useEffect(() => {
    setPreviousFeedback(message.feedback ?? null);
  }, [message.feedback]);

  const handleLike = () => {
    if (previousFeedback !== 'like') {
      setToastMessage("I'm glad you like my response.");
      setShowToast(true);
    }
    onLike?.(message);
  };

  const handleDislike = () => {
    if (previousFeedback !== 'dislike') {
      setToastMessage("I'm sorry. Refresh your query to get a better response.");
      setShowToast(true);
    }
    onDislike?.(message);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.text.replace(/<[^>]*>/g, ''));
      setCopied(true);
      setToastMessage("Message copied to clipboard");
      setShowToast(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setToastMessage("Failed to copy message");
      setShowToast(true);
    }
  };

  return (
    <>
      <div className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
        <div className="group relative">
          <div
            className={`max-w-[70vw] sm:max-w-lg p-4 rounded-2xl ${
              message.isUser
                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white'
                : 'bg-gradient-to-r from-blue-100 to-white text-blue-900'
            } shadow-md`}
          >
            <p 
              className="text-md md:text-base" 
              dangerouslySetInnerHTML={{ __html: message.text }} 
            />
            {message.attachment && (
              <div className="flex items-center gap-2 mt-2 text-sm opacity-75">
                <Paperclip className="w-3 h-3" />
                <span>{message.attachment.name}</span>
              </div>
            )}
          </div>
          
          {message.isUser ? (
            <div className="absolute top-0 right-full pr-2 hidden group-hover:flex items-center gap-1">
              <button
                onClick={() => onRetry?.(message)}
                className="p-2 rounded-full bg-blue-800 text-white hover:bg-blue-700 transition-colors"
                title="Retry"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => onEdit?.(message)}
                className="p-2 rounded-full bg-blue-800 text-white hover:bg-blue-700 transition-colors"
                title="Edit"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className={`flex gap-2 mt-2 justify-end ${!isLatest && 'hidden group-hover:flex'}`}>
              {isLatest ? (
                <>
                  <button
                    onClick={handleLike}
                    className={`p-2 rounded-full transition-colors ${
                      message.feedback === 'like'
                        ? 'bg-blue-500 text-white'
                        : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                    }`}
                    title="Like"
                  >
                    <ThumbsUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleDislike}
                    className={`p-2 rounded-full transition-colors ${
                      message.feedback === 'dislike'
                        ? 'bg-blue-500 text-white'
                        : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                    }`}
                    title="Dislike"
                  >
                    <ThumbsDown className="w-4 h-4" />
                  </button>
                </>
              ) : null}
              <button
                onClick={handleCopy}
                className="p-2 rounded-full bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
                title="Copy message"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          )}
        </div>
      </div>

      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </>
  );
}