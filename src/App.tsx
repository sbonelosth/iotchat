import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ChatProvider } from './contexts/ChatContext';
import ChatView from './views/ChatView';
import AuthPage from './pages/AuthPage';
import VerificationPage from './pages/VerificationPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ChatProvider>
          <Routes>
            <Route path="/" element={<ChatView />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/verify" element={<VerificationPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ChatProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;