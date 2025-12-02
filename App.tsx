import React, { useState, useEffect } from 'react';
import BottomNav from './components/BottomNav';
import YouTubeTab from './components/YouTubeTab';
import XTab from './components/XTab';
import FinanceTab from './components/FinanceTab';
import { Tab } from './types';
import {
  authenticateFromTelegram,
  hasValidSession,
  enforceTelegramOnly,
  watchSessionExpiration,
  clearSession
} from './telegramAuth';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.X);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Detectar si estamos en localhost
        const isLocalhost = window.location.hostname === 'localhost' ||
          window.location.hostname === '127.0.0.1';

        // Enforce Telegram-only access (pero permite localhost)
        enforceTelegramOnly();

        // Si es localhost, skip auth de Telegram
        if (isLocalhost) {
          console.log('🔧 [DEV MODE] Localhost detectado - Autenticación Telegram omitida');
          setIsAuthenticated(true);
          setIsLoading(false);
          return;
        }

        // Check existing session
        if (hasValidSession()) {
          setIsAuthenticated(true);
          setIsLoading(false);
          return;
        }

        // Authenticate from Telegram
        const authData = await authenticateFromTelegram();

        if (authData) {
          setIsAuthenticated(true);
        } else {
          // Auth failed - close WebApp
          if (window.Telegram?.WebApp) {
            window.Telegram.WebApp.close();
          }
        }
      } catch (error) {
        console.error('[App] Auth error:', error);
        // Error shown by enforceTelegramOnly
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // Watch for session expiration
  useEffect(() => {
    if (!isAuthenticated) return;

    const cleanup = watchSessionExpiration(() => {
      console.log('[App] Session expired');
      clearSession();
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.showAlert('Sesión expirada. Por favor, inicia sesión nuevamente.');
        window.Telegram.WebApp.close();
      }
    });

    return cleanup;
  }, [isAuthenticated]);

  const renderContent = () => {
    switch (activeTab) {
      case Tab.YOUTUBE:
        return <YouTubeTab />;
      case Tab.X:
        return <XTab />;
      case Tab.FINANCE:
        return <FinanceTab />;
      default:
        return <XTab />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-400">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Or custom access denied screen if enforceTelegramOnly didn't catch it
  }

  return (
    <div className="bg-black min-h-screen font-sans selection:bg-blue-500 selection:text-white">
      <main className="w-full bg-black min-h-screen relative">
        {renderContent()}
      </main>
      <div className="lg:hidden">
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
};

export default App;
