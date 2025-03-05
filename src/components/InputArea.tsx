import React, { useState, useRef, ChangeEvent, useEffect } from 'react';
import { Send, Paperclip, X, Sparkles } from 'lucide-react';
import { FileAttachment } from '../types';
import { useChat } from '../contexts/ChatContext';
import { Suggestions } from './Suggestions';

interface InputAreaProps {
  input: string;
  isResponseLoading: boolean;
  editingMessageId: string | null;
  onSubmit: (e: React.FormEvent, attachment: FileAttachment | null) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

export function InputArea({
  input,
  isResponseLoading,
  editingMessageId,
  onSubmit,
  onInputChange,
}: InputAreaProps) {
  const { sendQuestion } = useChat();
  const [attachment, setAttachment] = useState<FileAttachment | null>(null);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(e, attachment);
    setAttachment(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError('');

    if (!file) return;

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setError('Invalid file type. Please upload PDF or DOCX files only.');
      e.target.value = '';
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError('File size exceeds 5MB limit.');
      e.target.value = '';
      return;
    }

    setAttachment({
      file,
      name: file.name,
      size: file.size,
      type: file.type
    });
  };

  const handleSuggestionClick = (question: string) => {
    sendQuestion(question, null);
  };

  const removeAttachment: () => void = () => {
    setAttachment(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 via-gray-900 to-transparent p-2 pt-1">
      <div className="max-w-4xl mx-auto space-y-3">
        <div className="flex items-center relative">
          <Sparkles className="w-12 pr-2 aspect-square text-pink-300" />
          <Suggestions onSuggestionClick={handleSuggestionClick} />
        </div>
        {error && (
          <div className="text-red-400 text-sm bg-red-900/20 p-2 rounded-lg">
            {error}
          </div>
        )}

        {attachment && (
          <div className="flex items-center gap-2 bg-blue-900/20 p-2 rounded-lg text-blue-200">
            <Paperclip className="w-4 h-4" />
            <span className="text-sm flex-1 truncate">{attachment.name}</span>
            <button
              onClick={removeAttachment}
              className="p-1 hover:bg-blue-800 rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={onInputChange}
              placeholder={editingMessageId ? "Edit your message" : "Message"}
              className="flex-1 bg-blue-950 text-white placeholder-blue-400 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={isResponseLoading || !input.trim()}
              className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
            </div>
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="flex items-center gap-2 text-blue-200 hover:text-blue-100 cursor-pointer text-sm"
              >
                <Paperclip className="w-4 h-4" />
                <span>Attach File</span>
              </label>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}