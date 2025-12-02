/**
 * Telegram Authentication for Web Cards
 * Validates access from authorized Telegram users
 */

export interface TelegramAuthData {
    sessionToken: string;
    expiresAt: string;
    user: {
        id: number;
        username: string;
        firstName: string;
    };
    cardId: string;
}

/**
 * Validates authentication from Telegram WebApp
 * @returns Session data if valid, null if invalid
 */
export const authenticateFromTelegram = async (): Promise<TelegramAuthData | null> => {
    // Verify we're in Telegram WebApp
    if (!window.Telegram?.WebApp) {
        console.error('[TelegramAuth] Not in Telegram WebApp');
        return null;
    }

    const WebApp = window.Telegram.WebApp;
    const initData = WebApp.initData;

    if (!initData) {
        console.error('[TelegramAuth] No initData available');
        return null;
    }

    // Get card_id and access_token from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const cardId = urlParams.get('card_id');
    const accessToken = urlParams.get('access_token');

    if (!cardId || !accessToken) {
        console.error('[TelegramAuth] Missing card_id or access_token in URL');
        WebApp.showAlert('Token de acceso inválido. Por favor, solicita uno nuevo desde el bot.');
        return null;
    }

    try {
        // Call backend to validate
        const apiUrl = import.meta.env.VITE_API_URL || '/api/v1';
        const response = await fetch(`${apiUrl}/web-cards/auth/telegram`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                initData,
                cardId,
                accessToken
            })
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('[TelegramAuth] Validation failed:', error.error);

            // Show user-friendly error
            if (error.error === 'Token expired - request a new one from the bot') {
                WebApp.showAlert('Token expirado. Por favor, solicita uno nuevo desde el bot.');
            } else if (error.error === 'User not authorized for this card') {
                WebApp.showAlert('No tienes acceso a esta tarjeta. Contacta al administrador.');
            } else if (error.error === 'Card not found or inactive') {
                WebApp.showAlert('Tarjeta no disponible. Contacta al administrador.');
            } else if (error.error === 'Maximum users reached for this card') {
                WebApp.showAlert('Esta tarjeta alcanzó el máximo de usuarios permitidos.');
            } else {
                WebApp.showAlert('Error de autenticación: ' + error.error);
            }

            return null;
        }

        const data: TelegramAuthData = await response.json();

        // Store session
        localStorage.setItem('web_card_session', data.sessionToken);
        localStorage.setItem('web_card_session_exp', data.expiresAt);
        localStorage.setItem('web_card_user', JSON.stringify(data.user));
        localStorage.setItem('web_card_id', data.cardId);

        // Clean URL (remove tokens)
        window.history.replaceState({}, '', window.location.pathname);

        console.log('[TelegramAuth] ✅ Authenticated as', data.user.firstName);

        return data;
    } catch (error) {
        console.error('[TelegramAuth] Network error:', error);
        WebApp.showAlert('Error de red. Verifica tu conexión.');
        return null;
    }
};

/**
 * Checks if there's a valid session
 */
export const hasValidSession = (): boolean => {
    const token = localStorage.getItem('web_card_session');
    const exp = localStorage.getItem('web_card_session_exp');

    if (!token || !exp) return false;

    // Check expiration
    const expiresAt = new Date(exp);
    const now = new Date();

    if (expiresAt <= now) {
        console.log('[TelegramAuth] Session expired');
        clearSession();
        return false;
    }

    return true;
};

/**
 * Gets current session token
 */
export const getSessionToken = (): string | null => {
    if (!hasValidSession()) return null;
    return localStorage.getItem('web_card_session');
};

/**
 * Gets current user data
 */
export const getCurrentUser = (): TelegramAuthData['user'] | null => {
    if (!hasValidSession()) return null;

    const userJson = localStorage.getItem('web_card_user');
    if (!userJson) return null;

    try {
        return JSON.parse(userJson);
    } catch {
        return null;
    }
};

/**
 * Gets current card ID
 */
export const getCurrentCardId = (): string | null => {
    if (!hasValidSession()) return null;
    return localStorage.getItem('web_card_id');
};

/**
 * Clears session
 */
export const clearSession = (): void => {
    localStorage.removeItem('web_card_session');
    localStorage.removeItem('web_card_session_exp');
    localStorage.removeItem('web_card_user');
    localStorage.removeItem('web_card_id');
    console.log('[TelegramAuth] Session cleared');
};

/**
 * Enforces Telegram-only access (blocks direct browser access)
 * Except for localhost (development mode)
 */
export const enforceTelegramOnly = (): void => {
    // Permitir acceso desde localhost para desarrollo
    const isLocalhost = window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1';

    if (!window.Telegram?.WebApp && !isLocalhost) {
        document.body.innerHTML = `
            <div style="
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100vh;
                text-align: center;
                padding: 2rem;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
            ">
                <div style="font-size: 4rem; margin-bottom: 1rem;">🔒</div>
                <h1 style="font-size: 1.5rem; margin-bottom: 1rem;">Acceso Solo por Telegram</h1>
                <p style="margin-bottom: 0.5rem; opacity: 0.9;">Esta aplicación solo es accesible desde Telegram.</p>
                <p style="opacity: 0.9;">Abre el <strong>Bot</strong> en Telegram para acceder.</p>
            </div>
        `;
        throw new Error('Not in Telegram WebApp');
    }

    // Si es localhost, mostrar mensaje informativo en consola
    if (isLocalhost && !window.Telegram?.WebApp) {
        console.log('🔧 [DEV MODE] Accediendo desde localhost - Telegram Auth deshabilitado');
    }
};

/**
 * Auto-logout on session expiration
 */
export const watchSessionExpiration = (onExpire: () => void): () => void => {
    const interval = setInterval(() => {
        if (!hasValidSession()) {
            onExpire();
        }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
};

export default {
    authenticateFromTelegram,
    hasValidSession,
    getSessionToken,
    getCurrentUser,
    getCurrentCardId,
    clearSession,
    enforceTelegramOnly,
    watchSessionExpiration
};
