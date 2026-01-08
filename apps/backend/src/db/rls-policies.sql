-- Включение Row Level Security (RLS) и настройка политик безопасности
-- Выполните этот SQL в Supabase Dashboard -> SQL Editor ПОСЛЕ создания таблиц

-- Включаем RLS на всех таблицах
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE sets ENABLE ROW LEVEL SECURITY;

-- ============================================
-- ПОЛИТИКИ ДЛЯ ТАБЛИЦЫ exercises
-- ============================================

-- Разрешаем всем читать упражнения (публичный доступ)
CREATE POLICY "Allow public read access to exercises"
    ON exercises
    FOR SELECT
    USING (true);

-- Разрешаем Service Role создавать/обновлять/удалять (только через backend)
-- Service Role автоматически обходит RLS, поэтому эти политики не обязательны,
-- но они полезны если вы будете использовать анонимный ключ на frontend

-- ============================================
-- ПОЛИТИКИ ДЛЯ ТАБЛИЦЫ workouts
-- ============================================

-- Разрешаем всем читать тренировки (публичный доступ)
CREATE POLICY "Allow public read access to workouts"
    ON workouts
    FOR SELECT
    USING (true);

-- Разрешаем всем создавать тренировки (публичный доступ)
CREATE POLICY "Allow public insert to workouts"
    ON workouts
    FOR INSERT
    WITH CHECK (true);

-- Разрешаем всем обновлять тренировки (публичный доступ)
CREATE POLICY "Allow public update to workouts"
    ON workouts
    FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- Разрешаем всем удалять тренировки (публичный доступ)
CREATE POLICY "Allow public delete to workouts"
    ON workouts
    FOR DELETE
    USING (true);

-- ============================================
-- ПОЛИТИКИ ДЛЯ ТАБЛИЦЫ activities
-- ============================================

-- Разрешаем всем читать activities
CREATE POLICY "Allow public read access to activities"
    ON activities
    FOR SELECT
    USING (true);

-- Разрешаем всем создавать activities
CREATE POLICY "Allow public insert to activities"
    ON activities
    FOR INSERT
    WITH CHECK (true);

-- Разрешаем всем обновлять activities
CREATE POLICY "Allow public update to activities"
    ON activities
    FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- Разрешаем всем удалять activities
CREATE POLICY "Allow public delete to activities"
    ON activities
    FOR DELETE
    USING (true);

-- ============================================
-- ПОЛИТИКИ ДЛЯ ТАБЛИЦЫ sets
-- ============================================

-- Разрешаем всем читать sets
CREATE POLICY "Allow public read access to sets"
    ON sets
    FOR SELECT
    USING (true);

-- Разрешаем всем создавать sets
CREATE POLICY "Allow public insert to sets"
    ON sets
    FOR INSERT
    WITH CHECK (true);

-- Разрешаем всем обновлять sets
CREATE POLICY "Allow public update to sets"
    ON sets
    FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- Разрешаем всем удалять sets
CREATE POLICY "Allow public delete to sets"
    ON sets
    FOR DELETE
    USING (true);

-- ============================================
-- ПРИМЕЧАНИЯ:
-- ============================================
-- 1. Service Role Key (используется на backend) обходит все RLS политики
-- 2. Эти политики нужны если вы планируете использовать анонимный ключ на frontend
-- 3. Сейчас все таблицы открыты для чтения/записи всем (публичный доступ)
-- 4. В будущем можно добавить авторизацию и ограничить доступ по user_id

