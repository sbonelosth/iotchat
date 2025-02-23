import React, { useState } from 'react';

interface SuggestionsProps {
  onSuggestionClick: (suggestion: string) => void;
}

const initialSuggestions = [
  { label: 'IoT career choices', question: 'What are some career choices in IoT?' },
  { label: 'Today\'s timetable', question: 'Show me today\'s lectures and venues.' },
  { label: 'My semester lecturers', question: 'Who are my lecturers this semester?' },
];

export function Suggestions({ onSuggestionClick }: SuggestionsProps) {
  const [suggestions, setSuggestions] = useState(initialSuggestions);

  const handleSuggestionClick = (question: string, label: string) => {
    onSuggestionClick(question);
    setSuggestions(suggestions.filter(suggestion => suggestion.label !== label));
  };

  return (
    <div className="flex gap-2 overflow-x-auto pl-2 env(safe-area-inset-bottom) hide-scrollbar">
      {suggestions.map((suggestion) => (
        <button
          key={suggestion.label}
          onClick={() => handleSuggestionClick(suggestion.question, suggestion.label)}
          className="p-1 px-6 bg-gradient-to-r from-pink-300 to-blue-400 text-gray-800 text-nowrap font-semibold rounded-full hover:opacity-80 transition-opacity"
        >
          {suggestion.label}
        </button>
      ))}
    </div>
  );
}