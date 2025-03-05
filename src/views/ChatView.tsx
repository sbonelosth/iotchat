import { AppBar } from '../components/AppBar';
import { MessageList } from '../components/MessageList';
import { InputArea } from '../components/InputArea';
import { useChat } from '../contexts/ChatContext';

export default function ChatView() {
    const { 
        messages,
        input, 
        setInput, 
        isResponseLoading, 
        editingMessageId, 
        handleClearMessages, 
        handleSendQuestion, 
        handleRetry, 
        handleEditQuestion 
    } = useChat();
    
    return (
        <div className="flex flex-col bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 min-h-screen">
            <AppBar onClearMessages={handleClearMessages} />

            <div className="flex-1 overflow-y-auto max-w-4xl w-full mx-auto">
                <MessageList
                    messages={messages}
                    onRetry={handleRetry}
                    onEdit={handleEditQuestion}
                    isResponseLoading={isResponseLoading}
                />
            </div>

            <InputArea
                input={input}
                isResponseLoading={isResponseLoading}
                editingMessageId={editingMessageId}
                onSubmit={handleSendQuestion}
                onInputChange={(e) => setInput(e.target.value)}
            />
        </div>
    );
}