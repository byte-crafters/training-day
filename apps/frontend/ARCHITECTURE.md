# Frontend — архитектура и обзор

Клиентское приложение **Training Day** — трекер силовых тренировок, работающий
как **Telegram Mini App**. Пользователь собирает тренировку из упражнений,
фиксирует подходы (вес/повторения), запускает таймер и просматривает статистику
с разбивкой нагрузки по группам мышц.

## Технологический стек

| Категория          | Технология                              | Назначение                                  |
| ------------------ | --------------------------------------- | ------------------------------------------- |
| Язык               | TypeScript 5.6 (strict)                 | Статическая типизация                       |
| UI-библиотека      | React 18                                | Компонентный UI                             |
| Сборщик / dev      | Vite 5                                  | Dev-сервер, сборка                          |
| Состояние          | Redux Toolkit 2 + React-Redux 9         | Глобальное состояние, slices                |
| Маршрутизация      | React Router 7                          | Клиентский роутинг                          |
| UI-компоненты      | MUI 7 (`@mui/material`, `@mui/icons-material`) | Готовые компоненты, тема             |
| Графики            | `@mui/x-charts`                         | Radar-чарт распределения нагрузки           |
| Стилизация         | Emotion (через MUI) + SCSS              | Тема MUI + scoped-стили компонентов         |
| Telegram SDK       | `@tma.js/sdk`, `@tma.js/sdk-react`      | Получение Telegram initData                 |
| Аналитика          | Firebase Analytics                      | Трекинг событий и воронки                   |
| Мониторинг         | `@sentry/react`                         | Ошибки, session replay, error boundary      |
| Тестирование       | Storybook 10 + Vitest + Playwright      | Компонентные тесты через истории            |
| Моки               | MSW (Mock Service Worker)               | Подмена API при разработке/тестах           |
| Прочее             | `uuid`                                  | Генерация идентификаторов                   |

## Структура каталогов

```
src/
├── main.tsx              # Точка входа: Sentry, Firebase, Redux Provider, рендер
├── app/App.tsx           # Аутентификация через Telegram + дерево маршрутов
├── pages/                # Экраны приложения (по папке на страницу)
│   ├── WorkoutTracker/   # Главный экран — список тренировок
│   ├── SelectExercises/  # Выбор упражнений для тренировки
│   ├── MyWorkout/        # Текущая тренировка
│   ├── ExerciseDetail/   # Запись подходов конкретного упражнения
│   ├── WorkoutResults/   # Итоги завершённой тренировки
│   ├── FeedBackPage/     # Форма обратной связи
│   └── NotFound/
├── components/           # Переиспользуемые компоненты и layout-обёртки
│   ├── DefaultLayout/    # Layout с шапкой (Header, BackButton, FeedbackButton)
│   ├── NavigationLayout/ # Layout с нижней навигацией
│   ├── TimerLayout/      # Layout с таймером тренировки
│   ├── ExerciseCard/, WorkoutCard/, SetForm/, MuscleRadarChart/ ...
├── store/index.ts        # Redux store: все slices и middleware в одном файле
├── hooks/                # use-timer, use-header
├── utils/                # api, firebase, analytics, storage, stats, time, ...
├── mocks/                # MSW handlers, тестовые данные, мок Telegram SDK
├── sentry/instrument.js  # Инициализация Sentry
└── theme.ts              # Тёмная тема MUI
```

## Архитектурные подходы

### Организация по фичам: «папка на единицу»

Каждый компонент и страница — это отдельная папка с собственными файлами:

```
ExerciseCard/
├── ExerciseCard.tsx          # Реализация
├── ExerciseCard.scss         # Стили (опционально)
├── ExerciseCard.stories.ts   # Storybook-история (опционально)
└── index.ts                  # Реэкспорт для коротких импортов
```

Файл `index.ts` позволяет импортировать как `import ExerciseCard from "../components/ExerciseCard"`.

### Маршрутизация и вложенные layout'ы

Маршруты описаны в `App.tsx` через React Router 7. Используется вложенность
layout-маршрутов с `<Outlet />`:

- `NavigationLayout` — экраны с нижней навигацией (главная, прогресс, профиль).
- `DefaultLayout` — экраны с шапкой; внутри неё `TimerLayout` добавляет таймер
  для экранов активной тренировки (`/my-workout`, `/exercise-detail`,
  `/select-exercises`).

Дерево маршрутов рендерится только после успешной аутентификации.

### Аутентификация через Telegram

Пароли не используются. При старте `App.tsx`:

1. Получает `initDataRaw` через хук `useRawInitData()` из `@tma.js/sdk-react`.
2. Сохраняет его в `sessionStorage['initData']` — оттуда его берёт API-слой.
3. Вызывает `POST /api/auth/telegram` для создания/обновления пользователя.
4. Пока идёт авторизация — показывает спиннер; при ошибке — экран с сообщением;
   при успехе — рендерит приложение и подгружает тренировки и упражнения.

Каждый API-запрос автоматически добавляет заголовок
`Authorization: tma <initData>` (см. `utils/api.ts`).

### Управление состоянием (Redux Toolkit)

Весь store сосредоточен в `store/index.ts` и состоит из четырёх slices:

| Slice            | Содержимое                                                      |
| ---------------- | --------------------------------------------------------------- |
| `workouts`       | Список сохранённых тренировок (загружается с API)               |
| `currentWorkout` | Тренировка, которая выполняется прямо сейчас (может быть `null`) |
| `exercises`      | Справочник доступных упражнений                                 |
| `timer`          | Состояние таймера (`startedAt`, `accumulated`)                  |

Особенности:

- **Кастомный `persistMiddleware`** — после каждого изменения `currentWorkout`
  или `timer` сохраняет текущую тренировку в `localStorage` (с подставленным
  `elapsedMs` из таймера). При перезагрузке тренировка восстанавливается.
- **Типизированные хуки** `useAppDispatch` / `useAppSelector` вместо стандартных.
- **Модель таймера без интервалов в state**: хранятся только метка старта и
  накопленное время; хук `use-timer` сам тикает через `setInterval` и форматирует
  значение. Это устойчиво к перезагрузке страницы и сворачиванию приложения.

### Слой работы с API

`utils/api.ts` инкапсулирует всё взаимодействие с backend:

- Базовая функция `fetchAPI()` добавляет заголовки, обрабатывает ошибки,
  парсит JSON.
- Базовый URL выбирается по окружению (`localhost:3001` в dev, `VITE_API_URL` в prod).
- **Нормализация данных**: `duration` в БД хранится строкой —
  `normalizeWorkoutFromAPI` / `normalizeWorkoutForAPI` приводят его к нужному типу
  на границе приложения.

### Стилизация: два уровня

1. **Тема MUI** (`theme.ts`) — единая тёмная тема: палитра (акцент `#00E5FF`),
   типографика, скруглённые «iOS-стиль» кнопки и карточки, CSS-переменные.
2. **SCSS-файлы по компонентам** — для специфичной вёрстки, с именованием в стиле
   BEM (`exercise-card__content`, `exercise-card__action`).

### Аналитика (Firebase)

`utils/firebase.ts` инициализирует Firebase Analytics (тихо отключается, если не
заданы `VITE_FIREBASE_*`). `utils/analytics.ts` содержит константы событий, экранов
и параметров. Заложена воронка:
`workout_start_clicked → workout_started → set_recorded → workout_completed`,
плюс `screen_view` на каждом экране и `login`.

### Наблюдаемость (Sentry)

`sentry/instrument.js` импортируется в `main.tsx` и настраивает: трекинг ошибок,
session replay (100% сэмплирование), интеграцию feedback. Всё приложение обёрнуто
в `Sentry.ErrorBoundary`. После авторизации в Sentry прокидывается контекст
пользователя (`Sentry.setUser`).

### Тестирование и разработка без Telegram

- **Storybook** — основной инструмент для разработки и тестирования компонентов;
  истории (`*.stories.ts`) одновременно служат тестами через `@storybook/addon-vitest`
  (запуск в реальном браузере Chromium через Playwright).
- **MSW** (`mocks/`) — перехват сетевых запросов мок-данными.
- **Мок Telegram SDK** — в режиме `development` Vite через alias подменяет
  `@tma.js/sdk-react` на `mocks/tma-sdk-react.ts`, который отдаёт initData из
  `VITE_MOCK_INIT_DATA`. Это позволяет запускать приложение в обычном браузере
  без Telegram.

## Ключевые пользовательские сценарии

1. **Старт тренировки** — на главной (`WorkoutTracker`) выбираются упражнения
   (`SelectExercises`), создаётся `currentWorkout`, запускается таймер.
2. **Запись подходов** — на `ExerciseDetail` через `SetForm` добавляются подходы
   (вес, повторения, заметка); они складываются в `currentWorkout` в Redux.
3. **Незавершённая тренировка** — благодаря `persistMiddleware` сохраняется в
   `localStorage`; на главной показывается `ContinueWorkoutCard` для продолжения.
4. **Итоги** — `WorkoutResults` показывает статистику (объём, плотность, число
   подходов, макс. вес) и `MuscleRadarChart` — распределение нагрузки по группам
   мышц (расчёты в `utils/stats.ts`).
5. **Обратная связь** — `FeedBackPage` отправляет сообщение на backend, который
   пересылает его администратору в Telegram.

## Переменные окружения

| Переменная                  | Назначение                                          |
| --------------------------- | --------------------------------------------------- |
| `VITE_API_URL`              | URL backend API в production                        |
| `VITE_MOCK_INIT_DATA`       | Мок Telegram initData для разработки без Telegram    |
| `VITE_FIREBASE_*`           | Конфигурация Firebase Analytics (apiKey, projectId, appId, measurementId и др.) |

## Запуск

```bash
pnpm dev              # Vite dev-сервер (порт 5173)
pnpm build            # tsc + сборка Vite в dist/
pnpm preview          # Предпросмотр production-сборки
pnpm storybook        # Storybook (порт 6006)
pnpm build-storybook  # Сборка статического Storybook
pnpm lint             # ESLint
pnpm format           # Prettier
```

## Общий пакет

Типы предметной области (`Exercise`, `Workout`, `Activity`, `Set`, `ExerciseType`,
`Timer`) импортируются из `@training-day/shared` — единого источника правды,
который используют и frontend, и backend.
