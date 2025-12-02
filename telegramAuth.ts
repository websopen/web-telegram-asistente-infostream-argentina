/**
 * TelegramWebAppAuth - Autenticación para Web Cards de Telegram
 * 
 * Flujo de autenticación:
 * 1. Usuario abre la webapp desde Telegram
 * 2. La webapp valida initData con el backend
 * 3. El backend verifica el access_token (código de asociación)
 * 4. Si es válido, retorna un JWT
 * 5. La webapp guarda el JWT y permite el acceso
 */

export interface TelegramUser {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    language_code?: string;
    is_premium?: boolean;
    photo_url?: string;
}

export interface AuthResponse {
    success: boolean;
    token?: string;
    user?: TelegramUser;
    error?: string;
}

export interface WebCardAuthConfig {
    apiBaseUrl: string;
    cardId: string; // ID del bot en la base de datos
    onAuthSuccess?: (token: string, user: TelegramUser) => void | Promise<void>;
    onAuthError?: (error: string) => void;
}

/**
 * Obtener los datos de Telegram WebApp
 */
const getTelegramWebAppData = (): string | null => {
    if (typeof window === 'undefined' || !window.Telegram?.WebApp) {
        console.warn('[TelegramAuth] window.Telegram.WebApp no está disponible');
        return null;
    }

    const initData = window.Telegram.WebApp.initData;

    if (!initData) {
        console.warn('[TelegramAuth] initData vacío');
        return null;
    }

    return initData;
};

/**
 * Obtener el access_token de la URL
 */
const getAccessTokenFromUrl = (): string | null => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('access_token');
};

/**
 * Limpiar el access_token de la URL
 */
const cleanAccessTokenFromUrl = (): void => {
    const url = new URL(window.location.href);
    url.searchParams.delete('access_token');
    window.history.replaceState({}, document.title, url.toString());
};

/**
 * Autenticar usuario con el backend
 */
const authenticateWithBackend = async (
    config: WebCardAuthConfig,
    initData: string,
    accessToken: string
): Promise<AuthResponse> => {
    try {
        const response = await fetch(`${config.apiBaseUrl}/web-cards/auth/telegram`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                card_id: config.cardId,
                init_data: initData,
                access_token: accessToken,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                success: false,
                error: data.error || 'Error de autenticación',
            };
        }

        return {
            success: true,
            token: data.data.token,
            user: data.data.user,
        };
    } catch (error) {
        console.error('[TelegramAuth] Error en petición:', error);
        return {
            success: false,
            error: 'Error de conexión con el servidor',
        };
    }
};

/**
 * Guardar token en localStorage
 */
const saveAuthToken = (token: string): void => {
    localStorage.setItem('web_card_token', token);
    console.log('[TelegramAuth] ✅ Token guardado');
};

/**
 * Obtener token guardado
 */
export const getStoredAuthToken = (): string | null => {
    return localStorage.getItem('web_card_token');
};

/**
 * Verificar si hay token válido
 */
export const hasValidAuth = (): boolean => {
    const token = getStoredAuthToken();
    return !!token;
};

/**
 * Cerrar sesión
 */
export const logout = (): void => {
    localStorage.removeItem('web_card_token');
    localStorage.removeItem('telegram_user');
    console.log('[TelegramAuth] 👋 Sesión cerrada');
};

/**
 * Inicializar autenticación de Telegram WebApp
 * 
 * Ejemplo de uso:
 * ```typescript
 * useEffect(() => {
 *   initTelegramWebAppAuth({
 *     apiBaseUrl: 'https://api.tudominio.com/api/v1',
 *     cardId: '29', // ID del bot en la base de datos
 *     onAuthSuccess: async (token, user) => {
 *       console.log('Usuario autenticado:', user);
 *       setAuthToken(token);
 *       setUser(user);
 *     },
 *     onAuthError: (error) => {
 *       console.error('Error de autenticación:', error);
 *       alert('No se pudo autenticar. Por favor, accede desde Telegram.');
 *     }
 *   });
 * }, []);
 * ```
 */
export const initTelegramWebAppAuth = async (
    config: WebCardAuthConfig
): Promise<AuthResponse> => {
    console.log('[TelegramAuth] 🔐 Iniciando autenticación...');

    // Verificar si ya hay token guardado
    const storedToken = getStoredAuthToken();
    if (storedToken) {
        console.log('[TelegramAuth] ✅ Token existente encontrado');

        // TODO: Aquí podrías verificar el token con el backend si quieres
        // Por ahora asumimos que es válido

        const storedUser = localStorage.getItem('telegram_user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            if (config.onAuthSuccess) {
                await config.onAuthSuccess(storedToken, user);
            }
            return {
                success: true,
                token: storedToken,
                user,
            };
        }
    }

    // Obtener initData de Telegram
    const initData = getTelegramWebAppData();
    if (!initData) {
        const error = 'Esta aplicación solo funciona desde Telegram';
        console.error('[TelegramAuth]', error);
        if (config.onAuthError) {
            config.onAuthError(error);
        }
        return {
            success: false,
            error,
        };
    }

    // Obtener access_token de la URL
    const accessToken = getAccessTokenFromUrl();
    if (!accessToken) {
        const error = 'Falta el código de acceso. Por favor, abre la app desde el bot de Telegram.';
        console.error('[TelegramAuth]', error);
        if (config.onAuthError) {
            config.onAuthError(error);
        }
        return {
            success: false,
            error,
        };
    }

    console.log('[TelegramAuth] 📡 Validando con el backend...');

    // Autenticar con el backend
    const authResult = await authenticateWithBackend(config, initData, accessToken);

    if (authResult.success && authResult.token && authResult.user) {
        // Guardar token y usuario
        saveAuthToken(authResult.token);
        localStorage.setItem('telegram_user', JSON.stringify(authResult.user));

        // Limpiar URL
        cleanAccessTokenFromUrl();

        console.log('[TelegramAuth] ✅ Autenticación exitosa');
        console.log('[TelegramAuth] Usuario:', authResult.user.first_name);

        // Callback de éxito
        if (config.onAuthSuccess) {
            await config.onAuthSuccess(authResult.token, authResult.user);
        }
    } else {
        console.error('[TelegramAuth] ❌ Error:', authResult.error);
        if (config.onAuthError) {
            config.onAuthError(authResult.error || 'Error desconocido');
        }
    }

    return authResult;
};

/**
 * Obtener usuario guardado
 */
export const getStoredUser = (): TelegramUser | null => {
    const storedUser = localStorage.getItem('telegram_user');
    if (storedUser) {
        try {
            return JSON.parse(storedUser);
        } catch {
            return null;
        }
    }
    return null;
};

/**
 * Expandir Telegram WebApp a pantalla completa
 */
export const expandTelegramWebApp = (): void => {
    if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.expand();
        window.Telegram.WebApp.ready();
    }
};

export default {
    initTelegramWebAppAuth,
    getStoredAuthToken,
    getStoredUser,
    hasValidAuth,
    logout,
    expandTelegramWebApp,
};
