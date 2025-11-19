export const appConfig = {
  apiBaseUrl:
    import.meta.env.VITE_API_URL?.replace(/\/$/, '') ?? 'http://127.0.0.1:8000',
  defaultSessionStorageKey: 'pictoamigos.chat.sessionId',
};
