import { AuthProvider } from './contexts/AuthContext';
import { ChatProvider } from './contexts/ChatContext';
import ChatView from './views/ChatView';

function App() {
  return (
    <AuthProvider>
      <ChatProvider>
        <ChatView />
      </ChatProvider>
    </AuthProvider>
  );
}

export default App;