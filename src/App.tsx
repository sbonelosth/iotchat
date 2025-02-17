import { AuthProvider } from './contexts/AuthContext';
import { ChatProvider } from './contexts/ChatContext';
import Chat from './views/Chat';

function App() {
  return (
    <AuthProvider>
      <ChatProvider>
        <Chat />
      </ChatProvider>
    </AuthProvider>
  );
}

export default App;