import React, { createContext, useContext, useEffect, useState } from 'react';
import { ChatContextType, Message, FileAttachment } from '../types/index';
import { useAuth } from './AuthContext';
import { dummyService } from '../services/dummyService';

export const ChatContext = createContext<ChatContextType | undefined>(undefined);

const API_BASE_URL = import.meta.env.VITE_BASE_URL;
const STORAGE_KEY = import.meta.env.VITE_HISTORY;
const MAX_STORAGE_SIZE = 5 * 1024 * 1024; // 5MB limit


export function ChatProvider({ children }: { children: React.ReactNode }) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isResponseLoading, setIsResponseLoading] = useState(false);
    const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
    const { user } = useAuth();
    const initialSuggestions = [
      { label: 'IoT career choices', question: 'What are some career choices in IoT?' },
      { label: 'Today\'s timetable', question: 'Show me today\'s lectures and venues.' },
      { label: 'My semester lecturers', question: `Show me ${user?.course} lecturers this semester?` },
      { label: 'Academic record fee', question: 'How much is the academic transcript?' },
    ];
    
    const guestSuggestions = [
      { label: 'Falculties', question: 'How many faculties does DUT have and what are they?' },
      { label: 'Qualifications offered', question: 'What are the qualifications by department offered in DUT?' },
      { label: 'Registration fees', question: 'What are DUT\'s registration fees for both tuition and residence for full-time students?' },
      { label: 'General enquiries contacts', question: 'What are contact details for general enquiries?' },
    ];
    const [suggestions, setSuggestions] = useState(initialSuggestions);

    useEffect(() => {
        const wakeup = async () => {
            await dummyService.wakeup();
        };
        wakeup();
    }, []);

    // Load messages from localStorage on initial render
    useEffect(() => {
        try {
            const savedMessages = localStorage.getItem(STORAGE_KEY);
            const savedSuggestions = localStorage.getItem('suggestions');

            if (savedSuggestions) {
                const parsedSuggestions = JSON.parse(savedSuggestions);
                if (Array.isArray(parsedSuggestions)) {
                    setSuggestions(parsedSuggestions);
                } else {
                    console.error('Invalid suggestion format in localStorage');
                    localStorage.removeItem('suggestions');
                }
            }

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
                localStorage.setItem('suggestions', JSON.stringify(suggestions));
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

    useEffect(() => {
        if (user?.course?.startsWith("BICIOT")) {
            setSuggestions(initialSuggestions);
        } else {
            setSuggestions(guestSuggestions);
        }
    }, [user]);

    useEffect(() => {
        
    }, [])

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

    const sendQuestion = async (
        text: string,
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
        setIsResponseLoading(true);

        try {
            const formData = new FormData();
            formData.append('question', `${text}`);
            formData.append('history', JSON.stringify(messages));
            formData.append('course', user?.course || 'guest');
            formData.append('now', new Date().toDateString());
            
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
            setIsResponseLoading(false);
        }
    };

    const handleSendQuestion = async (
        e: React.FormEvent,
        attachment: FileAttachment | null
    ) => {
        e.preventDefault();
        if (!input.trim()) return;

        if (editingMessageId) {
            await handleSendEdit(e, attachment);
        } else {
            await sendQuestion(input, attachment);
        }
    };

    const handleRetry = async (message: Message) => {
        const messageIndex = messages.findIndex(m => m.id === message.id);
        if (messageIndex !== -1) {
            setMessages(prev => prev.slice(0, messageIndex));
            await sendQuestion(message.text, null);
        }
    };

    const handleEditQuestion = (message: Message) => {
        setEditingMessageId(message.id);
        setInput(message.text);
    };

    const handleSendEdit = async (
        e: React.FormEvent,
        attachment: FileAttachment | null
    ) => {
        e.preventDefault();
        if (!input.trim() || !editingMessageId) return;

        const messageIndex = messages.findIndex(m => m.id === editingMessageId);
        if (messageIndex !== -1) {
            setMessages(prev => prev.slice(0, messageIndex));
            await sendQuestion(input, attachment);
        }

        setEditingMessageId(null);
    };

    const handleClearMessages = () => {
        localStorage.removeItem(STORAGE_KEY);
        setMessages([]);
    };


    return (
        <ChatContext.Provider value={{ messages, setMessages, input, setInput, suggestions, setSuggestions, isResponseLoading, setIsResponseLoading, editingMessageId, setEditingMessageId, sendQuestion, handleSendQuestion, handleRetry, handleEditQuestion, handleSendEdit, handleClearMessages }}>
            {children}
        </ChatContext.Provider>
    );
}

export const useChat = () => {
    const context = useContext(ChatContext);
    if (context === undefined) {
        throw new Error('useChat must be used within an ChatProvider');
    }
    return context;
}