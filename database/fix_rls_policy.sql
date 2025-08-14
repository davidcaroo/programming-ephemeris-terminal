-- Política más permisiva para permitir inserciones desde la API
-- Primero, eliminar la política restrictiva existente
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON ephemerides;

-- Crear nueva política que permita inserción desde la API
CREATE POLICY "Enable insert for API and authenticated users" ON ephemerides FOR INSERT
WITH
    CHECK (
        auth.role () = 'authenticated'
        OR auth.role () = 'anon'
    );

-- Alternativamente, si quieres ser más específico, puedes usar:
-- CREATE POLICY "Enable insert for service role" ON ephemerides
--   FOR INSERT WITH CHECK (auth.role() = 'service_role');