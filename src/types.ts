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

export type ContextType = 'MAIN' | 'FAI/IS' | 'BICIOT';

export interface FileAttachment {
  file: File;
  name: string;
  size: number;
  type: string;
}