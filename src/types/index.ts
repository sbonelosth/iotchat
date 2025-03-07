export interface User {
  username: string;
  name: string;
  email: string;
  password: string;
  faculty: string;
  department: string;
  course: string;
  verified: boolean;
  joined: string;
  code?: string;
  accessToken?: string;
}

export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: number;
  status: 'sent' | 'error' | 'editing';
  feedback?: 'like' | 'dislike';
  attachment?: {
    name: string;
    type: string;
  };
}

export interface FileAttachment {
  file: File;
  name: string;
  size: number;
  type: string;
}

export interface AuthContextType {
  user: Partial<User> | null;
  setUser: React.Dispatch<React.SetStateAction<Partial<User> | null>>;
  isAuthenticated: boolean;
  authError: { title: string; message: string };
  setAuthError: React.Dispatch<React.SetStateAction<{ title: string; message: string }>>;
  isLoading: boolean;
  isRefreshing: boolean;
  login: (identifier: string, password: string) => Promise<{ success: boolean; data?: any; error?: any }>;
  signup: (signupData: Partial<User>) => Promise<{ success: boolean; data?: any; error?: any }>;
  verify: (email: string, otp: any) => Promise<{ success: boolean; data?: any; error?: any }>;
  viewportHeight: number;
  setViewportHeight: React.Dispatch<React.SetStateAction<number>>;
  logout: () => void;
}

export interface ChatContextType {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  suggestions: Suggestion[];
  setSuggestions: React.Dispatch<React.SetStateAction<Suggestion[]>>;
  isResponseLoading: boolean;
  setIsResponseLoading: React.Dispatch<React.SetStateAction<boolean>>;
  editingMessageId: string | null;
  setEditingMessageId: React.Dispatch<React.SetStateAction<string | null>>;
  sendQuestion: (text: string, attachment: FileAttachment | null, messageId?: string) => Promise<void>;
  handleSendQuestion: (e: React.FormEvent, attachment: FileAttachment | null) => Promise<void>;
  handleRetry: (message: Message) => Promise<void>;
  handleEditQuestion: (message: Message) => void;
  handleSendEdit: (e: React.FormEvent, attachment: FileAttachment | null) => Promise<void>;
  handleClearMessages: () => void;
}

export interface Suggestion {
  label: string;
  question: string;
}

export interface RouteConfig {
  path: string;
  element: React.ReactNode;
}