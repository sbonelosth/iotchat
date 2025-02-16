import React, { useState, useEffect, useRef } from 'react';
import { AppBar } from './components/AppBar';
import { MessageList } from './components/MessageList';
import { InputArea } from './components/InputArea';
import { Message, ContextType, FileAttachment } from './types';

const API_BASE_URL = import.meta.env.VITE_BASE_URL;
const STORAGE_KEY = import.meta.env.VITE_HISTORY;
const MAX_STORAGE_SIZE = 5 * 1024 * 1024; // 5MB limit

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const chatAreaRef = useRef<HTMLDivElement>(null);

  // Load messages from localStorage on initial render
  useEffect(() => {
    try {
      const savedMessages = localStorage.getItem(STORAGE_KEY);
      if (savedMessages) {
        const parsedMessages = JSON.parse(savedMessages);
        if (Array.isArray(parsedMessages) && parsedMessages.every(isValidMessage)) {
          setMessages(parsedMessages);
        } else {
          console.error('Invalid message format in localStorage');
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch (error) {
      console.error('Error loading messages from localStorage:', error);
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    try {
      const messagesJSON = JSON.stringify(messages);
      if (messagesJSON.length <= MAX_STORAGE_SIZE) {
        localStorage.setItem(STORAGE_KEY, messagesJSON);
      } else {
        // If exceeding size limit, remove oldest messages until it fits
        const trimmedMessages = [...messages];
        while (JSON.stringify(trimmedMessages).length > MAX_STORAGE_SIZE && trimmedMessages.length > 0) {
          trimmedMessages.shift();
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedMessages));
        setMessages(trimmedMessages);
      }
    } catch (error) {
      console.error('Error saving messages to localStorage:', error);
    }
  }, [messages]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle viewport changes
  useEffect(() => {
    const handleResize = () => {
      // Adjust viewport height for mobile
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  const isValidMessage = (message: any): message is Message => {
    return (
      typeof message === 'object' &&
      typeof message.id === 'string' &&
      typeof message.text === 'string' &&
      typeof message.isUser === 'boolean' &&
      typeof message.timestamp === 'number' &&
      ['sent', 'error', 'editing'].includes(message.status)
    );
  };

  const generateMessageId = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const sendMessage = async (
    text: string,
    context: ContextType,
    attachment: FileAttachment | null,
    messageId?: string
  ) => {
    const id = messageId || generateMessageId();
    const userMessage: Message = {
      id,
      text,
      isUser: true,
      timestamp: Date.now(),
      status: 'sent',
      attachment: attachment ? {
        name: attachment.name,
        type: attachment.type
      } : undefined
    };

    if (!messageId) {
      setMessages(prev => [...prev, userMessage]);
    }
    
    setInput('');
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('question', text);
      formData.append('context', context);
      formData.append('history', JSON.stringify(messages));
      
      if (attachment) {
        formData.append('attachment', attachment.file);
      }

      const response = await fetch(`${API_BASE_URL}/ask`, {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      const formattedText = data.response
        .replace(/(\*\*[^*]+\*\*)/g, (match: string) => `<b>${match.slice(2, -2)}</b>`)
        .replace(/\n/g, '<br />');
      
      const aiMessage: Message = {
        id: generateMessageId(),
        text: formattedText || 'Sorry, I could not process your request.',
        isUser: false,
        timestamp: Date.now(),
        status: 'sent',
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: generateMessageId(),
        text: 'Sorry, there was an error processing your request.',
        isUser: false,
        timestamp: Date.now(),
        status: 'error',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (
    e: React.FormEvent,
    context: ContextType,
    attachment: FileAttachment | null
  ) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    if (editingMessageId) {
      await handleEditSubmit(e, context, attachment);
    } else {
      await sendMessage(input, context, attachment);
    }
  };

  const handleRetry = async (message: Message) => {
    const messageIndex = messages.findIndex(m => m.id === message.id);
    if (messageIndex !== -1) {
      setMessages(prev => prev.slice(0, messageIndex));
      await sendMessage(message.text, 'MAIN', null);
    }
  };

  const handleEdit = (message: Message) => {
    setEditingMessageId(message.id);
    setInput(message.text);
  };

  const handleEditSubmit = async (
    e: React.FormEvent,
    context: ContextType,
    attachment: FileAttachment | null
  ) => {
    e.preventDefault();
    if (!input.trim() || !editingMessageId) return;

    const messageIndex = messages.findIndex(m => m.id === editingMessageId);
    if (messageIndex !== -1) {
      setMessages(prev => prev.slice(0, messageIndex));
      await sendMessage(input, context, attachment);
    }

    setEditingMessageId(null);
  };

  const handleClearMessages = () => {
    localStorage.removeItem(STORAGE_KEY);
    setMessages([]);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800">
      {/* App Bar */}
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
            onClick={handleClearMessages}
            className="p-2 rounded-full text-white hover:text-red-300 transition-colors"
            title="Clear Messages"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div ref={chatAreaRef} className="flex-1 overflow-y-auto p-4 pb-[85px] max-w-4xl w-full mx-auto">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}        
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div className="group relative">
                <div
                  className={`max-w-[70vw] sm:max-w-lg p-4 rounded-2xl ${
                    message.isUser
                      ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white'
                      : 'bg-gradient-to-r from-blue-100 to-white text-blue-900'
                  } shadow-md`}
                >
                  <p className="text-md md:text-base" dangerouslySetInnerHTML={{ __html: message.text }} />
                  {/*<div className="text-xs opacity-60 mt-1">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </div>*/}
                </div>
                {message.isUser && (
                  <div className="absolute top-0 right-full pr-2 hidden group-hover:flex items-center gap-1">
                    <button
                      onClick={() => handleRetry(message)}
                      className="p-2 rounded-full bg-blue-800 text-white hover:bg-blue-700 transition-colors"
                      title="Retry"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEdit(message)}
                      className="p-2 rounded-full bg-blue-800 text-white hover:bg-blue-700 transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
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
      </div>

      <InputArea
        input={input}
        isLoading={isLoading}
        editingMessageId={editingMessageId}
        onSubmit={handleSubmit}
        onInputChange={(e) => setInput(e.target.value)}
      />
    </div>
  );
}

export default App;