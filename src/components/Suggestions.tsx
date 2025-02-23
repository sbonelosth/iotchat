import React, { useState } from 'react';

interface SuggestionsProps {
  onSuggestionClick: (suggestion: string) => void;
}

const initialSuggestions = [
  { label: 'IoT career choices', question: 'What are some career choices in IoT?' },
  { label: 'Next lecture', question: 'Show me details of the next lecture.' },
  { label: 'Test week', question: 'When is the test week?' },
];

export function Suggestions({ onSuggestionClick }: SuggestionsProps) {
  const [suggestions, setSuggestions] = useState(initialSuggestions);

  const handleSuggestionClick = (question: string, label: string) => {
    onSuggestionClick(question);
    setSuggestions(suggestions.filter(suggestion => suggestion.label !== label));
  };

  return (
    <div className="flex flex-col justify-center gap-2 mt-4">
      {suggestions.map((suggestion) => (
        <button
          key={suggestion.label}
          onClick={() => handleSuggestionClick(suggestion.question, suggestion.label)}
          className="p-1 px-6 bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 transition-colors"
        >
          {suggestion.label}
        </button>
      ))}
    </div>
  );
}