import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAnalytics, logEvent as firebaseLogEvent, type Analytics } from 'firebase/analytics';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

let app: FirebaseApp | null = null;
let analytics: Analytics | null = null;

/**
 * Инициализация Firebase App и Analytics.
 * Вызывается один раз при старте приложения.
 * Если конфиг не задан (нет measurementId), Analytics не инициализируется.
 */
export function initFirebase(): void {
    const hasConfig =
        firebaseConfig.apiKey &&
        firebaseConfig.projectId &&
        firebaseConfig.appId &&
        firebaseConfig.measurementId;

    if (!hasConfig) {
        if (import.meta.env.DEV) {
            console.info('[Firebase] Analytics disabled: missing VITE_FIREBASE_* env vars');
        }
        return;
    }

    try {
        app = initializeApp(firebaseConfig);
        analytics = getAnalytics(app);
        if (import.meta.env.DEV) {
            console.info('[Firebase] Analytics initialized');
        }
    } catch (e) {
        console.error('[Firebase] Failed to initialize:', e);
    }
}

/**
 * Получить экземпляр Analytics (может быть null, если не инициализирован).
 */
export function getFirebaseAnalytics(): Analytics | null {
    return analytics;
}

/**
 * Отправить событие в Firebase Analytics.
 * Ничего не делает, если Analytics не инициализирован.
 *
 * @example
 * logAnalyticsEvent('login', { method: 'telegram' });
 * logAnalyticsEvent('select_content', { content_type: 'workout', content_id: workoutId });
 */
export function logAnalyticsEvent(
    eventName: string,
    eventParams?: Record<string, string | number | boolean>,
): void {
    if (!analytics) return;
    try {
        firebaseLogEvent(analytics, eventName, eventParams);
    } catch (e) {
        if (import.meta.env.DEV) {
            console.warn('[Firebase] logEvent failed:', e);
        }
    }
}
