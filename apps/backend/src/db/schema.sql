-- Создание таблиц для Training Day приложения
-- Выполните этот SQL в Supabase Dashboard -> SQL Editor

-- Таблица упражнений (exercises)
CREATE TABLE IF NOT EXISTS exercises (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    strength BOOLEAN NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('chest', 'legs', 'back', 'cardio')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица тренировок (workouts)
CREATE TABLE IF NOT EXISTS workouts (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    date TEXT NOT NULL,
    duration TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица активностей (activities) - упражнения в тренировке
-- Это связующая таблица между workouts и exercises
CREATE TABLE IF NOT EXISTS activities (
    id TEXT PRIMARY KEY,
    workout_id TEXT NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
    exercise_id TEXT NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
    name TEXT NOT NULL, -- Дублируем для быстрого доступа
    strength BOOLEAN NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('chest', 'legs', 'back', 'cardio')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица сетов (sets) - сеты упражнений
CREATE TABLE IF NOT EXISTS sets (
    id TEXT PRIMARY KEY,
    activity_id TEXT NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
    reps INTEGER NOT NULL,
    weight NUMERIC(10, 2) NOT NULL,
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Индексы для оптимизации запросов
CREATE INDEX IF NOT EXISTS idx_activities_workout_id ON activities(workout_id);
CREATE INDEX IF NOT EXISTS idx_activities_exercise_id ON activities(exercise_id);
CREATE INDEX IF NOT EXISTS idx_sets_activity_id ON sets(activity_id);
CREATE INDEX IF NOT EXISTS idx_workouts_date ON workouts(date);

-- Функция для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Триггер для автоматического обновления updated_at в workouts
CREATE TRIGGER update_workouts_updated_at BEFORE UPDATE ON workouts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

