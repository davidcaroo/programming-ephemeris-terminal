-- SCRIPT PARA ARREGLAR EL PROBLEMA DE RLS EN SUPABASE
-- Ejecuta este script en el SQL Editor de tu consola de Supabase
-- 1. Eliminar políticas existentes que pueden estar causando problemas
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON ephemerides;

DROP POLICY IF EXISTS "Enable insert for API and authenticated users" ON ephemerides;

DROP POLICY IF EXISTS "Enable read access for all users" ON ephemerides;

DROP POLICY IF EXISTS "Enable update for authenticated users only" ON ephemerides;

-- 2. Crear nuevas políticas más permisivas para desarrollo
-- Política para permitir lectura a todos (incluyendo anónimos)
CREATE POLICY "Public read access" ON ephemerides FOR
SELECT
    USING (true);

-- Política para permitir inserción desde cualquier rol (incluyendo anónimos)
CREATE POLICY "Public insert access" ON ephemerides FOR INSERT
WITH
    CHECK (true);

-- Política para permitir actualización desde cualquier rol autenticado
CREATE POLICY "Authenticated update access" ON ephemerides FOR
UPDATE USING (auth.role () = 'authenticated');

-- 3. Verificar que RLS esté habilitado
ALTER TABLE ephemerides ENABLE ROW LEVEL SECURITY;

-- 4. Verificar la estructura de la tabla
SELECT
    column_name,
    data_type,
    is_nullable
FROM
    information_schema.columns
WHERE
    table_name = 'ephemerides'
ORDER BY
    ordinal_position;