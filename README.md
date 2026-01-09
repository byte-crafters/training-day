# Training Day - Monorepo

Монорепозиторий для проекта Training Day с отдельными зависимостями для каждого приложения.

## Структура проекта

```
training-day/
├── apps/
│   ├── frontend/     # React + Vite приложение
│   └── backend/      # Express API сервер
├── packages/
│   └── shared/       # Общие типы и утилиты
└── package.json      # Корневой package.json для управления workspace
```

## Установка

```bash
# Установить pnpm (если еще не установлен)
npm install -g pnpm

# Установить все зависимости
pnpm install
```

## Разработка

### Запуск всех приложений одновременно
```bash
pnpm dev
```

### Запуск только frontend
```bash
pnpm dev:frontend
# или
cd apps/frontend && pnpm dev
```

### Запуск только backend
```bash
pnpm dev:backend
# или
cd apps/backend && pnpm dev
```

## Сборка

```bash
# Собрать все приложения
pnpm build

# Собрать только frontend
pnpm build:frontend

# Собрать только backend
pnpm build:backend
```

## Зависимости

Каждое приложение имеет свои собственные зависимости:
- **Frontend**: React, Vite, Material-UI, Redux Toolkit и др.
- **Backend**: Express, CORS и др.
- **Shared**: Только TypeScript (общие типы)

Все приложения используют общий пакет `@training-day/shared` для типов.

## Использование shared пакета

```typescript
// В frontend или backend
import { Exercise, Workout, ExerciseType } from '@training-day/shared';
```

