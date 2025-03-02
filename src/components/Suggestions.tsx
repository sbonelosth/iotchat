import { useChat } from "../contexts/ChatContext";

interface SuggestionsProps {
  onSuggestionClick: (suggestion: string) => void;
}

export function Suggestions({ onSuggestionClick }: SuggestionsProps) {
  const { suggestions, setSuggestions } = useChat();
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