# Backend API

Backend сервер для Training Day приложения, использующий Supabase в качестве базы данных.

## Настройка

### 1. Создайте проект в Supabase

1. Зарегистрируйтесь на [supabase.com](https://supabase.com)
2. Создайте новый проект
3. Дождитесь завершения инициализации проекта

### 2. Получите ключи доступа

В Supabase Dashboard:
- **Project URL**: Settings → API → Project URL
- **Service Role Key**: Settings → API → service_role key (секретный ключ!)

### 3. Настройте переменные окружения

Создайте файл `.env` в папке `apps/backend/`:

```env
SUPABASE_URL=your-project-url-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
TELEGRAM_BOT_TOKEN=your-telegram-bot-token-here
JWT_SECRET=your-jwt-secret-key-here
JWT_REFRESH_SECRET=your-jwt-refresh-secret-key-here
PORT=3001
```

### 4. Создайте таблицы в базе данных

Откройте Supabase Dashboard → SQL Editor и выполните SQL скрипты:

1. **Таблица users** (для авторизации): `migration_users.sql`
   - Создает таблицу пользователей Telegram

2. **Таблицы упражнений и тренировок**: `src/db/schema.sql` (если существует)
   - `exercises` - упражнения
   - `workouts` - тренировки
   - `activities` - упражнения в тренировке
   - `sets` - сеты упражнений

### 5. Запустите сервер

```bash
# Из корня монорепозитория
pnpm dev:backend

# Или из папки backend
cd apps/backend
pnpm dev
```

## Структура проекта

```
src/
├── db/
│   ├── supabase.ts      # Инициализация Supabase клиента
│   └── schema.sql        # SQL схема для создания таблиц
├── services/
│   ├── exerciseService.ts  # Бизнес-логика для упражнений
│   └── workoutService.ts   # Бизнес-логика для тренировок
├── controllers/
│   ├── exerciseController.ts  # HTTP контроллеры для упражнений
│   └── workoutController.ts   # HTTP контроллеры для тренировок
├── routes/
│   └── index.ts          # Определение всех API роутов
└── index.ts              # Точка входа приложения
```

## API Endpoints

### Exercises
- `GET /api/exercises` - Получить все упражнения
- `GET /api/exercises/:id` - Получить упражнение по ID
- `POST /api/exercises` - Создать упражнение
- `PUT /api/exercises/:id` - Обновить упражнение
- `DELETE /api/exercises/:id` - Удалить упражнение

### Workouts
- `GET /api/workouts` - Получить все тренировки
- `GET /api/workouts/:id` - Получить тренировку по ID
- `POST /api/workouts` - Создать тренировку
- `PUT /api/workouts/:id` - Обновить тренировку
- `DELETE /api/workouts/:id` - Удалить тренировку

### Health
- `GET /api/health` - Проверка работоспособности сервера

## Важные замечания

- **Service Role Key** обходит Row Level Security (RLS) - используйте только на backend!
- Не коммитьте `.env` файл в git (он уже в `.gitignore`)
- Все данные хранятся в Supabase PostgreSQL базе данных

