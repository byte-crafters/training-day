# Backend — архитектура и обзор

API-сервер приложения **Training Day** (трекер тренировок в виде Telegram Mini App).
Отвечает за аутентификацию через Telegram, хранение тренировок/упражнений в Supabase
и отправку обратной связи в Telegram.

> Этот документ описывает технологии и подходы. Инструкции по настройке окружения —
> в [`README.md`](./README.md) и [`SETUP.md`](./SETUP.md).

## Технологический стек

| Категория        | Технология                          | Назначение                                          |
| ---------------- | ------------------------------------ | --------------------------------------------------- |
| Язык             | TypeScript 5.6 (strict)              | Статическая типизация                               |
| Рантайм          | Node.js 20+, ESM (`"type": "module"`)| Исполнение                                          |
| HTTP-фреймворк   | Express 4                            | Маршрутизация, middleware                           |
| База данных      | Supabase (PostgreSQL) через `@supabase/supabase-js` | Хранение данных          |
| Аутентификация   | `@tma.js/init-data-node`             | Валидация Telegram Mini App initData                |
| JWT              | `jsonwebtoken`                       | Утилиты для токенов (см. примечание ниже)           |
| Мониторинг       | `@sentry/node`                       | Трекинг ошибок и структурное логирование            |
| Прочее           | `cors`, `cookie-parser`, `dotenv`, `uuid` | CORS, парсинг cookies, env-переменные, генерация ID |
| Dev-инструменты  | `tsx` (watch-режим), ESLint 9, Prettier   | Разработка, линтинг, форматирование            |

Сборка: `tsc` компилирует `src/` в `dist/`, файл `instrument.mjs` копируется отдельно
скриптом в `package.json` (его нельзя обрабатывать TypeScript-компилятором, т.к. он
должен загружаться раньше всех модулей).

## Структура каталогов

```
src/
├── index.ts              # Точка входа: настройка Express, CORS, запуск сервера
├── routes/index.ts       # Единый файл со всеми маршрутами /api/*
├── controllers/          # Обработка HTTP: парсинг запроса, коды ответов, логирование
│   ├── authController.ts
│   ├── exerciseController.ts
│   ├── workoutController.ts
│   └── feedbackController.ts
├── services/             # Бизнес-логика и работа с БД
│   ├── authService.ts    # Валидация initData, создание/обновление пользователя
│   ├── userService.ts
│   ├── exerciseService.ts
│   ├── workoutService.ts # Самый сложный — работа со связанными таблицами
│   └── feedbackService.ts
├── middleware/
│   └── authMiddleware.ts # Проверка Telegram initData для защищённых маршрутов
├── db/
│   └── supabase.ts       # Инициализация Supabase-клиента (Service Role Key)
├── utils/
│   ├── jwt.ts            # Генерация/валидация JWT-токенов
│   └── telegram.ts       # Отправка сообщений через Telegram Bot API
└── sentry/
    └── instrument.mjs    # Инициализация Sentry (импортируется первым)
```

## Архитектурные подходы

### Слоистая архитектура: Route → Controller → Service → DB

- **Routes** (`routes/index.ts`) — декларативное описание всех эндпоинтов в одном месте,
  здесь же навешивается `authMiddleware` на защищённые маршруты.
- **Controllers** — статические классы (`ExerciseController`, `WorkoutController` и т.д.).
  Отвечают только за HTTP: читают `req`, валидируют входные данные на уровне формата,
  выбирают HTTP-код, формируют ответ. Бизнес-логики не содержат.
- **Services** — статические классы с бизнес-логикой. Напрямую обращаются к Supabase,
  бросают `Error` с понятными сообщениями. Не знают про `req`/`res`.
- **DB** — единственный экземпляр Supabase-клиента, экспортируемый из `db/supabase.ts`.

Контроллеры и сервисы оформлены как классы со `static`-методами — это пространства имён,
а не объекты с состоянием (экземпляры не создаются).

### Аутентификация через Telegram Mini App

Приложение не использует пароли. Аутентификация построена на механизме Telegram Mini Apps:

1. Клиент передаёт `initData` в заголовке `Authorization: tma <initDataRaw>`.
2. `authService.validateInitDataAndGetUser()` проверяет подпись через
   `@tma.js/init-data-node` с токеном бота `TELEGRAM_BETA_BOT_TOKEN`
   (срок действия initData — 24 часа).
3. Из проверенных данных извлекается Telegram-пользователь, который
   создаётся или обновляется в таблице `users` (upsert по `telegram_user_id`).
4. `authMiddleware` кладёт `userId`, `telegramUserId`, `initData` в `res.locals`
   для использования в контроллерах.

Логика валидации вынесена в общую функцию, которую переиспользуют и `authMiddleware`,
и `AuthController.initTelegram` (эндпоинт `POST /api/auth/telegram`).

Ошибки представлены типизированными классами (`InitDataValidationError`,
`MissingBotTokenError`), что позволяет различать причины и возвращать корректные
HTTP-коды (401 при невалидных данных, 500 при отсутствии токена бота).

> **Примечание про JWT.** В `utils/jwt.ts` реализованы генерация/проверка
> access/refresh-токенов, но в текущих маршрутах они не задействованы — активная
> схема аутентификации основана на Telegram initData. Файл можно рассматривать
> как заготовку либо legacy-код.

### Разграничение доступа к данным

Защищённые операции с тренировками всегда фильтруются по `user_id` текущего
пользователя (`.eq('user_id', userId)` в каждом запросе). Пользователь не может
получить или изменить чужую тренировку — для него она «не найдена» (404).
Упражнения (`exercises`) — это общий справочник без привязки к пользователю.

### Безопасность Supabase

Backend использует **Service Role Key**, который обходит Row Level Security (RLS).
Поэтому ключ должен оставаться только на сервере, а проверка прав доступа выполняется
на уровне приложения (фильтрация по `user_id`). Клиент Supabase создаётся с
отключённой авто-сессией (`autoRefreshToken: false`, `persistSession: false`).

### Работа со связанными данными (workouts)

Тренировка — это агрегат из трёх таблиц: `workouts` → `activities` → `sets`.
Supabase не даёт многооператорных транзакций, поэтому `WorkoutService.create()`
выполняет вставки последовательно и при ошибке вручную откатывает уже созданные
записи (компенсирующее удаление). Удаление тренировки полагается на каскадное
удаление связанных строк на уровне БД.

### Наблюдаемость (Sentry)

- `sentry/instrument.mjs` импортируется **первым** в `index.ts` — это требование
  Sentry для корректного инструментирования.
- В каждом обработчике на scope выставляется атрибут `handler` (`exercise_getAll`
  и т.п.) для удобной группировки.
- Используется структурное логирование `Sentry.logger.info/warn` и
  `Sentry.captureException` для исключений.
- `Sentry.setupExpressErrorHandler(app)` подключает глобальный обработчик ошибок.

### Обработка ошибок

Единый паттерн в контроллерах: `try/catch`, извлечение сообщения
(`error instanceof Error ? error.message : 'Unknown error'`), логирование в Sentry,
ответ с подходящим HTTP-кодом. Сервисы бросают `Error` с префиксом
(`Failed to fetch workouts: ...`), а специфичные ситуации (запись не найдена —
код Supabase `PGRST116`) обрабатываются явно.

## API-эндпоинты

| Метод  | Путь                   | Auth | Описание                          |
| ------ | ---------------------- | ---- | --------------------------------- |
| GET    | `/api/exercises`       | —    | Все упражнения (справочник)       |
| GET    | `/api/exercises/:id`   | —    | Упражнение по ID                  |
| POST   | `/api/exercises`       | —    | Создать упражнение                |
| PUT    | `/api/exercises/:id`   | —    | Обновить упражнение               |
| DELETE | `/api/exercises/:id`   | —    | Удалить упражнение                |
| GET    | `/api/workouts`        | ✅   | Тренировки текущего пользователя  |
| GET    | `/api/workouts/:id`    | ✅   | Тренировка по ID                  |
| POST   | `/api/workouts`        | ✅   | Создать тренировку                |
| PUT    | `/api/workouts/:id`    | ✅   | Обновить тренировку               |
| DELETE | `/api/workouts/:id`    | ✅   | Удалить тренировку                |
| POST   | `/api/auth/telegram`   | ✅*  | Создать/обновить пользователя     |
| POST   | `/api/feedback`        | ✅   | Отправить feedback админу в TG    |
| GET    | `/api/health`          | —    | Health-check (`{"status":"ok"}`)  |

`✅` — требуется заголовок `Authorization: tma <initData>`.
`✅*` — `/auth/telegram` проверяет initData внутри обработчика, а не через middleware.

## Модель данных

Таблицы PostgreSQL в Supabase:

- **users** — `id`, `telegram_user_id`, `username`, `first_name`, `last_name`, таймстемпы.
- **exercises** — общий справочник упражнений (`id`, `name`, `strength`, `type`).
- **workouts** — тренировка (`id`, `name`, `date`, `duration` хранится как текст,
  `user_id`).
- **activities** — упражнение внутри тренировки (`workout_id`, `exercise_id`, `name`,
  `strength`, `type`).
- **sets** — подход (`activity_id`, `reps`, `weight`, `note`).

Типы данных (`Exercise`, `Workout`, `Activity`, `Set`, `ExerciseType`) описаны в общем
пакете `@training-day/shared` и используются и backend, и frontend.

## Переменные окружения

| Переменная                                | Назначение                                      |
| ------------------------------------------ | ----------------------------------------------- |
| `SUPABASE_URL`                             | URL проекта Supabase                            |
| `SUPABASE_KEY` / `SUPABASE_SERVICE_ROLE_KEY` | Service Role Key (поддерживаются оба имени)  |
| `TELEGRAM_BETA_BOT_TOKEN`                  | Токен бота для валидации initData               |
| `TELEGRAM_BOT_TOKEN`                       | Токен бота для отправки feedback                |
| `TELEGRAM_ADMIN_CHAT_ID`                   | Chat ID администратора для получения feedback   |
| `JWT_SECRET`, `JWT_REFRESH_SECRET`         | Секреты для JWT (заготовка, см. примечание выше)|
| `CORS_ORIGIN`                              | Список разрешённых origin через запятую         |
| `PORT`                                     | Порт сервера (по умолчанию 3001)                |

## Запуск

```bash
pnpm dev      # tsx watch — режим разработки с авто-перезапуском
pnpm build    # tsc + копирование instrument.mjs в dist/
pnpm start    # запуск собранной версии из dist/
pnpm lint     # ESLint
pnpm format   # Prettier
```
