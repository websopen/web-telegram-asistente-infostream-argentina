export { };

declare global {
    interface Window {
        Telegram?: {
            WebApp?: {
                initData: string;
                initDataUnsafe: any;
                ready: () => void;
                expand: () => void;
                close: () => void;
                platform: string;
                colorScheme: 'light' | 'dark';
                themeParams: any;
                isExpanded: boolean;
                viewportHeight: number;
                viewportStableHeight: number;
                onEvent: (eventType: string, eventHandler: Function) => void;
                offEvent: (eventType: string, eventHandler: Function) => void;
                sendData: (data: any) => void;
            };
        };
    }
}
