-- SQL скрипт для заполнения таблиц начальными данными
-- Выполните этот SQL в Supabase Dashboard -> SQL Editor

-- ============================================
-- 1. ВСТАВКА УПРАЖНЕНИЙ (exercises)
-- ============================================

INSERT INTO exercises (id, name, strength, type) VALUES
    ('exercise-1', 'Bench Press', true, 'chest'),
    ('exercise-2', 'Running', false, 'cardio'),
    ('exercise-3', 'Push Ups', true, 'chest'),
    ('exercise-4', 'Squats', true, 'legs'),
    ('exercise-5', 'Deadlift', true, 'back'),
    ('exercise-6', 'Pull Ups', true, 'back'),
    ('exercise-7', 'Dumbbell Rows', true, 'back'),
    ('exercise-8', 'Shoulder Press', true, 'chest'),
    ('exercise-9', 'Leg Press', true, 'legs'),
    ('exercise-10', 'Jump Rope', false, 'cardio')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 2. ВСТАВКА ТРЕНИРОВОК (workouts)
-- ============================================

INSERT INTO workouts (id, name, date, duration) VALUES
    ('workout-1', 'Full Body Workout', '2024-01-15', '45 mins'),
    ('workout-2', 'Cardio Session', '2024-01-14', '30 mins'),
    ('workout-3', 'Upper Body Strength', '2024-01-13', '50 mins'),
    ('workout-4', 'Leg Day', '2024-01-12', '55 mins')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 3. ВСТАВКА АКТИВНОСТЕЙ (activities) - упражнения в тренировках
-- ============================================

-- Workout 1: Full Body Workout
INSERT INTO activities (id, workout_id, exercise_id, name, strength, type) VALUES
    ('activity-1-1', 'workout-1', 'exercise-1', 'Bench Press', true, 'chest'),
    ('activity-1-2', 'workout-1', 'exercise-4', 'Squats', true, 'legs'),
    ('activity-1-3', 'workout-1', 'exercise-5', 'Deadlift', true, 'back')
ON CONFLICT (id) DO NOTHING;

-- Workout 2: Cardio Session
INSERT INTO activities (id, workout_id, exercise_id, name, strength, type) VALUES
    ('activity-2-1', 'workout-2', 'exercise-2', 'Running', false, 'cardio'),
    ('activity-2-2', 'workout-2', 'exercise-10', 'Jump Rope', false, 'cardio')
ON CONFLICT (id) DO NOTHING;

-- Workout 3: Upper Body Strength
INSERT INTO activities (id, workout_id, exercise_id, name, strength, type) VALUES
    ('activity-3-1', 'workout-3', 'exercise-3', 'Push Ups', true, 'chest'),
    ('activity-3-2', 'workout-3', 'exercise-6', 'Pull Ups', true, 'back'),
    ('activity-3-3', 'workout-3', 'exercise-7', 'Dumbbell Rows', true, 'back'),
    ('activity-3-4', 'workout-3', 'exercise-8', 'Shoulder Press', true, 'chest')
ON CONFLICT (id) DO NOTHING;

-- Workout 4: Leg Day
INSERT INTO activities (id, workout_id, exercise_id, name, strength, type) VALUES
    ('activity-4-1', 'workout-4', 'exercise-4', 'Squats', true, 'legs'),
    ('activity-4-2', 'workout-4', 'exercise-9', 'Leg Press', true, 'legs')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 4. ВСТАВКА СЕТОВ (sets) - сеты упражнений
-- ============================================

-- Sets для Bench Press (activity-1-1)
INSERT INTO sets (id, activity_id, reps, weight, note) VALUES
    ('set-1-1-1', 'activity-1-1', 10, 80.00, NULL),
    ('set-1-1-2', 'activity-1-1', 8, 85.00, NULL),
    ('set-1-1-3', 'activity-1-1', 6, 90.00, 'Last set was tough')
ON CONFLICT (id) DO NOTHING;

-- Sets для Squats (activity-1-2)
INSERT INTO sets (id, activity_id, reps, weight, note) VALUES
    ('set-1-2-1', 'activity-1-2', 12, 100.00, NULL),
    ('set-1-2-2', 'activity-1-2', 10, 110.00, NULL),
    ('set-1-2-3', 'activity-1-2', 8, 120.00, NULL)
ON CONFLICT (id) DO NOTHING;

-- Sets для Deadlift (activity-1-3)
INSERT INTO sets (id, activity_id, reps, weight, note) VALUES
    ('set-1-3-1', 'activity-1-3', 8, 120.00, NULL),
    ('set-1-3-2', 'activity-1-3', 6, 130.00, NULL),
    ('set-1-3-3', 'activity-1-3', 5, 140.00, 'PR!')
ON CONFLICT (id) DO NOTHING;

-- Sets для Running (activity-2-1)
INSERT INTO sets (id, activity_id, reps, weight, note) VALUES
    ('set-2-1-1', 'activity-2-1', 1, 0.00, '5km run')
ON CONFLICT (id) DO NOTHING;

-- Sets для Jump Rope (activity-2-2)
INSERT INTO sets (id, activity_id, reps, weight, note) VALUES
    ('set-2-2-1', 'activity-2-2', 100, 0.00, NULL),
    ('set-2-2-2', 'activity-2-2', 100, 0.00, NULL),
    ('set-2-2-3', 'activity-2-2', 100, 0.00, NULL)
ON CONFLICT (id) DO NOTHING;

-- Sets для Push Ups (activity-3-1)
INSERT INTO sets (id, activity_id, reps, weight, note) VALUES
    ('set-3-1-1', 'activity-3-1', 15, 0.00, NULL),
    ('set-3-1-2', 'activity-3-1', 12, 0.00, NULL),
    ('set-3-1-3', 'activity-3-1', 10, 0.00, NULL)
ON CONFLICT (id) DO NOTHING;

-- Sets для Pull Ups (activity-3-2)
INSERT INTO sets (id, activity_id, reps, weight, note) VALUES
    ('set-3-2-1', 'activity-3-2', 12, 0.00, NULL),
    ('set-3-2-2', 'activity-3-2', 10, 0.00, NULL),
    ('set-3-2-3', 'activity-3-2', 8, 0.00, NULL)
ON CONFLICT (id) DO NOTHING;

-- Sets для Dumbbell Rows (activity-3-3)
INSERT INTO sets (id, activity_id, reps, weight, note) VALUES
    ('set-3-3-1', 'activity-3-3', 12, 25.00, NULL),
    ('set-3-3-2', 'activity-3-3', 10, 30.00, NULL),
    ('set-3-3-3', 'activity-3-3', 8, 35.00, NULL)
ON CONFLICT (id) DO NOTHING;

-- Sets для Shoulder Press (activity-3-4)
INSERT INTO sets (id, activity_id, reps, weight, note) VALUES
    ('set-3-4-1', 'activity-3-4', 10, 20.00, NULL),
    ('set-3-4-2', 'activity-3-4', 8, 22.50, NULL),
    ('set-3-4-3', 'activity-3-4', 6, 25.00, NULL)
ON CONFLICT (id) DO NOTHING;

-- Sets для Squats (activity-4-1)
INSERT INTO sets (id, activity_id, reps, weight, note) VALUES
    ('set-4-1-1', 'activity-4-1', 12, 100.00, NULL),
    ('set-4-1-2', 'activity-4-1', 10, 110.00, NULL),
    ('set-4-1-3', 'activity-4-1', 8, 120.00, NULL),
    ('set-4-1-4', 'activity-4-1', 6, 130.00, NULL)
ON CONFLICT (id) DO NOTHING;

-- Sets для Leg Press (activity-4-2)
INSERT INTO sets (id, activity_id, reps, weight, note) VALUES
    ('set-4-2-1', 'activity-4-2', 15, 150.00, NULL),
    ('set-4-2-2', 'activity-4-2', 12, 170.00, NULL),
    ('set-4-2-3', 'activity-4-2', 10, 190.00, NULL)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- ПРОВЕРКА ДАННЫХ
-- ============================================

-- Проверить количество записей
-- SELECT 'exercises' as table_name, COUNT(*) as count FROM exercises
-- UNION ALL
-- SELECT 'workouts', COUNT(*) FROM workouts
-- UNION ALL
-- SELECT 'activities', COUNT(*) FROM activities
-- UNION ALL
-- SELECT 'sets', COUNT(*) FROM sets;

