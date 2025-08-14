-- Tabla para almacenar efemérides de programación
CREATE TABLE ephemerides (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  event TEXT NOT NULL,
  display_date VARCHAR(10) NOT NULL, -- Formato MM-DD para consultas por día del año
  category VARCHAR(50) DEFAULT 'programming',
  language VARCHAR(10) DEFAULT 'es',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para optimizar consultas
CREATE INDEX idx_ephemerides_date ON ephemerides(date);
CREATE INDEX idx_ephemerides_display_date ON ephemerides(display_date);
CREATE INDEX idx_ephemerides_category ON ephemerides(category);

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_ephemerides_updated_at 
  BEFORE UPDATE ON ephemerides 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Política de seguridad RLS (Row Level Security)
ALTER TABLE ephemerides ENABLE ROW LEVEL SECURITY;

-- Política para permitir lectura pública
CREATE POLICY "Enable read access for all users" ON ephemerides
  FOR SELECT USING (true);

-- Política para permitir inserción autenticada (opcional)
CREATE POLICY "Enable insert for authenticated users only" ON ephemerides
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Política para permitir actualización autenticada (opcional)
CREATE POLICY "Enable update for authenticated users only" ON ephemerides
  FOR UPDATE USING (auth.role() = 'authenticated');
