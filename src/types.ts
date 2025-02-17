export interface User {
  id: string;
  name: string;
  email: string;
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

export type ChatScopeType = 'MAIN' | 'FAI/IS' | 'BICIOT';

export interface FileAttachment {
  file: File;
  name: string;
  size: number;
  type: string;
}

export interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  viewportHeight: number;
  setViewportHeight: (height: number) => void;
}

export interface ChatContextType {
  chatScope: ChatScopeType;
  setChatScope: (scope: ChatScopeType) => void;
  messages: Message[];
  setMessages: (messages: Message[]) => void;
  input: string;
  setInput: (input: string) => void;
  isResponseLoading: boolean;
  setIsResponseLoading: (isLoading: boolean) => void;
  editingMessageId: string | null;
  setEditingMessageId: (messageId: string | null) => void;
  sendQuestion: (text: string, chatScope: ChatScopeType, attachment: FileAttachment | null, messageId?: string) => void;
  handleClearMessages: () => void;
  handleRetry: (message: Message) => void;
  handleEditQuestion: (message: Message) => void;
  handleSendQuestion: (e: React.FormEvent, chatScope: ChatScopeType, attachment: FileAttachment | null) => void;
  handleSendEdit: (e: React.FormEvent, chatScope: ChatScopeType, attachment: FileAttachment | null) => void;
}

