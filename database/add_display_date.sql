-- Agregar columna display_date a la tabla ephemerides
ALTER TABLE ephemerides 
ADD COLUMN display_date VARCHAR(10);

-- Crear índice para búsquedas por display_date
CREATE INDEX idx_ephemerides_display_date ON ephemerides(display_date);

-- Actualizar registros existentes con formato MM-DD
UPDATE ephemerides SET display_date = TO_CHAR(date, 'MM-DD');

-- Función para obtener efemérides por día del año (MM-DD)
CREATE OR REPLACE FUNCTION get_ephemerides_by_day(day_of_year VARCHAR(10))
RETURNS TABLE(
  id UUID,
  date DATE,
  event TEXT,
  category VARCHAR(50),
  language VARCHAR(10),
  display_date VARCHAR(10),
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT e.id, e.date, e.event, e.category, e.language, e.display_date, e.created_at, e.updated_at
  FROM ephemerides e
  WHERE e.display_date = day_of_year
  ORDER BY e.date ASC;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener efemérides del día actual
CREATE OR REPLACE FUNCTION get_today_ephemerides()
RETURNS TABLE(
  id UUID,
  date DATE,
  event TEXT,
  category VARCHAR(50),
  language VARCHAR(10),
  display_date VARCHAR(10),
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT e.id, e.date, e.event, e.category, e.language, e.display_date, e.created_at, e.updated_at
  FROM ephemerides e
  WHERE e.display_date = TO_CHAR(CURRENT_DATE, 'MM-DD')
  ORDER BY e.date ASC;
END;
$$ LANGUAGE plpgsql;
