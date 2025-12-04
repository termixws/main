import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Navbar } from './components/Navbar';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { Dashboard } from './components/Dashboard';
import { FadeIn } from './components/AnimatedContainer';
import { Toaster } from './components/ui/sonner';

function AppContent() {
  const [showRegister, setShowRegister] = useState(false);
  const { isAuthenticated, loading } = useAuth();

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  // Show dashboard if authenticated
  if (isAuthenticated) {
    return <Dashboard />;
  }

  // Show auth screens
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="flex items-center justify-center px-4 py-12">
        <AnimatePresence mode="wait">
          {showRegister ? (
            <FadeIn key="register">
              <Register onSwitchToLogin={() => setShowRegister(false)} />
            </FadeIn>
          ) : (
            <FadeIn key="login">
              <Login onSwitchToRegister={() => setShowRegister(true)} />
            </FadeIn>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function App() {
  // Initialize dark theme on mount
  useEffect(() => {
    const theme = localStorage.getItem('salon-theme') || 'dark';
    document.documentElement.classList.add(theme);
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
