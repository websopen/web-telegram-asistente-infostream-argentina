import React, { useState, useEffect } from 'react';
import BottomNav from './components/BottomNav';
import YouTubeTab from './components/YouTubeTab';
import XTab from './components/XTab';
import FinanceTab from './components/FinanceTab';
import { Tab } from './types';
import {
  initTelegramWebAppAuth,
  hasValidAuth,
  expandTelegramWebApp,
  getStoredUser
} from './telegramAuth';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.X);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Detectar si estamos en localhost
        const isLocalhost = window.location.hostname === 'localhost' ||
          window.location.hostname === '127.0.0.1';

        // Si es localhost, skip auth de Telegram
        if (isLocalhost) {
          console.log('🔧 [DEV MODE] Localhost detectado - Autenticación Telegram omitida');
          setIsAuthenticated(true);
          setIsLoading(false);
          return;
        }

        // Expandir Telegram WebApp
        expandTelegramWebApp();

        // Check existing session
        if (hasValidAuth()) {
          const user = getStoredUser();
          console.log('✅ Sesión existente:', user);
          setIsAuthenticated(true);
          setIsLoading(false);
          return;
        }

        // Authenticate with backend
        const result = await initTelegramWebAppAuth({
          apiBaseUrl: 'https://api.websopen.com/api/v1', // Cambiar por tu URL
          cardId: '29', // ID del bot creado anteriormente
          onAuthSuccess: async (token, user) => {
            console.log('✅ Autenticado como:', user.first_name);
            setIsAuthenticated(true);
            setIsLoading(false);
          },
          onAuthError: (error) => {
            console.error('❌ Error de autenticación:', error);
            setAuthError(error);
            setIsLoading(false);
          }
        });

        if (!result.success) {
          setAuthError(result.error || 'Error de autenticación');
          // Auth failed - close WebApp after showing error
          if (window.Telegram?.WebApp) {
            setTimeout(() => {
              window.Telegram.WebApp.close();
            }, 3000);
          }
        }
      } catch (error) {
        console.error('[App] Auth error:', error);
        setAuthError('Error inesperado durante la autenticación');
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

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
    if (authError) {
      return (
        <div className="min-h-screen bg-black flex items-center justify-center text-white p-6">
          <div className="max-w-md text-center">
            <div className="mb-6">
              <svg className="w-16 h-16 mx-auto text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-3">Error de Acceso</h2>
            <p className="text-gray-400 mb-4">{authError}</p>
            <p className="text-sm text-gray-500">La aplicación se cerrará automáticamente...</p>
          </div>
        </div>
      );
    }
    return null; // Or custom access denied screen
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
