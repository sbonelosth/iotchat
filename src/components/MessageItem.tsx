import { useState, useEffect } from 'react';
import { RefreshCw, Edit2, ThumbsUp, ThumbsDown, Copy, Check, Paperclip, CheckCircle, InfoIcon, LucideIcon } from 'lucide-react';
import { Message } from '../types';
import { Toast } from './Toast';
import { useChat } from '../contexts/ChatContext';

interface MessageItemProps {
  message: Message;
  isLatest: boolean;
  latestUserMessage?: Message | null;
  onRetry?: (message: Message) => void;
  onEdit?: (message: Message) => void;
  onLike?: (message: Message) => void;
  onDislike?: (message: Message) => void;
}

export function MessageItem({ message, isLatest, onRetry, latestUserMessage, onEdit, onLike, onDislike }: MessageItemProps) {
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [copied, setCopied] = useState(false);
  const [previousFeedback, setPreviousFeedback] = useState<string | null>(null);
  const { isResponseLoading } = useChat();
  const [selectedIcon, setSelectedIcon] = useState<LucideIcon | undefined>(undefined);

  useEffect(() => {
    setPreviousFeedback(message.feedback ?? null);
  }, [message]);

  const handleLike = () => {
    if (previousFeedback === 'like') {
      setPreviousFeedback(null);
      onLike?.({ ...message, feedback: undefined });
    } else {
      setPreviousFeedback('like');
      setToastMessage("Feedback received.");
      setSelectedIcon(CheckCircle);
      setShowToast(true);
      onLike?.({ ...message, feedback: 'like' });
    }
  };

  const handleDislike = () => {
    if (previousFeedback === 'dislike') {
      setPreviousFeedback(null);
      onDislike?.({ ...message, feedback: undefined });
    } else {
      setPreviousFeedback('dislike');
      setToastMessage("Retry for better responses.");
      setSelectedIcon(InfoIcon);
      setShowToast(true);
      onDislike?.({ ...message, feedback: 'dislike' });
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.text.replace(/<[^>]*>/g, ''));
      setCopied(true);
      setToastMessage("Message copied to clipboard");
      setSelectedIcon(CheckCircle);
      setShowToast(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setToastMessage("Failed to copy message");
      setSelectedIcon(InfoIcon);
      setShowToast(true);
    }
  };

  return (
    <>
      <div className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
        <div className="group relative">
          <div
            className={`max-w-[70vw] sm:max-w-lg p-4 rounded-2xl ${message.isUser
                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md'
                : 'max-w-[80vw] bg-transparent p-0'
              }`}
          >
            <p
              className="text-md text-blue-200 md:text-base"
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
                onClick={() => onEdit?.(message)}
                className="p-2 rounded-full bg-blue-800 text-white hover:bg-blue-700 transition-colors"
                title="Edit"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className={`flex gap-2 mt-2 justify-start ${!isLatest && 'hidden group-hover:flex'}`}>
              {isLatest && !isResponseLoading ? (
                <>
                  <button
                    onClick={handleLike}
                    className={`p-2 rounded-full transition-colors ${previousFeedback === 'like'
                        ? 'bg-blue-500 text-white'
                        : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                      }`}
                    title="Like"
                  >
                    <ThumbsUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleDislike}
                    className={`p-2 rounded-full transition-colors ${previousFeedback === 'dislike'
                        ? 'bg-blue-500 text-white'
                        : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                      }`}
                    title="Dislike"
                  >
                    <ThumbsDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => latestUserMessage && onRetry?.(latestUserMessage)}
                    className="p-2 rounded-full bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
                    title="Retry"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </>
              ) : null}
              {!isResponseLoading && <button
                onClick={handleCopy}
                className="p-2 rounded-full bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
                title="Copy message"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>}
            </div>
          )}
        </div>
      </div>

      <Toast
        message={toastMessage}
        icon={selectedIcon}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </>
  );
}