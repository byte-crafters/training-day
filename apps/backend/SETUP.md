# Пошаговая инструкция по настройке Supabase

## Шаг 1: Создание проекта в Supabase

1. Перейдите на [supabase.com](https://supabase.com) и зарегистрируйтесь/войдите
2. Нажмите "New Project"
3. Заполните:
   - **Name**: training-day (или любое другое)
   - **Database Password**: придумайте надежный пароль (сохраните его!)
   - **Region**: выберите ближайший регион
4. Нажмите "Create new project"
5. Дождитесь завершения инициализации (2-3 минуты)

## Шаг 2: Получение ключей доступа

1. В Dashboard вашего проекта перейдите в **Settings** → **API**
2. Найдите следующие значения:
   - **Project URL** - скопируйте этот URL
   - **service_role key** - скопируйте этот ключ (⚠️ секретный!)

## Шаг 3: Настройка .env файла

1. В папке `apps/backend/` создайте файл `.env`
2. Добавьте следующие строки:

```env
SUPABASE_URL=https://ваш-project-id.supabase.co
SUPABASE_KEY=ваш-service-role-key
PORT=3001
```

**Пример:**
```env
SUPABASE_URL=https://abcdefghijklmnop.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
PORT=3001
```

**Примечание:** Можно использовать либо `SUPABASE_KEY`, либо `SUPABASE_SERVICE_ROLE_KEY` - код поддерживает оба варианта.

## Шаг 4: Создание таблиц в базе данных

1. В Supabase Dashboard перейдите в **SQL Editor**
2. Откройте файл `apps/backend/src/db/schema.sql`
3. Скопируйте весь SQL код
4. Вставьте в SQL Editor в Supabase
5. Нажмите "Run" (или Ctrl+Enter)
6. Должно появиться сообщение об успешном выполнении

## Шаг 5: Включение Row Level Security (RLS)

**Важно:** После создания таблиц они будут показывать статус "unrestricted" (RLS отключен).

1. В Supabase Dashboard → **SQL Editor** откройте файл `apps/backend/src/db/rls-policies.sql`
2. Скопируйте весь SQL код
3. Вставьте в SQL Editor и выполните
4. Теперь в **Table Editor** таблицы должны показывать статус "🔒 Restricted" (RLS включен)

**Примечание:** 
- Service Role Key (используется на backend) **обходит RLS**, поэтому backend будет работать в любом случае
- RLS политики нужны для безопасности, если планируете использовать анонимный ключ на frontend
- Сейчас настроены публичные политики (все могут читать/писать)

## Шаг 6: Проверка подключения

1. Запустите backend:
   ```bash
   pnpm dev:backend
   ```

2. Должны увидеть:
   ```
   🚀 Backend server running on http://localhost:3001
   📊 Supabase connected: ✅
   ```

3. Проверьте API:
   ```bash
   curl http://localhost:3001/api/health
   ```
   Должен вернуть: `{"status":"ok"}`

## Готово! 🎉

Теперь ваш backend подключен к Supabase и готов к работе.

## Что дальше?

- Данные теперь сохраняются в Supabase PostgreSQL базе
- Все CRUD операции работают через Supabase API
- Данные персистентны (не теряются при перезапуске)

