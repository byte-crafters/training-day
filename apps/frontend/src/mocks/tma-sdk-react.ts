/**
 * Мок @tma.js/sdk-react для локальной разработки без Telegram.
 * Подключается через Vite alias только в mode === 'development'.
 * InitData берётся из VITE_MOCK_INIT_DATA в .env, иначе — дефолтная строка (подпись невалидна для бэкенда).
 */

export function useRawInitData(): string | undefined {
  return import.meta.env.VITE_MOCK_INIT_DATA;
}
