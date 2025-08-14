# Configuración de Base de Datos con Supabase

Este proyecto ahora soporta almacenamiento de efemérides en Supabase con funcionalidad de **efemérides del día actual** basadas en el campo `display_date`, con respaldo local en caso de que la base de datos no esté disponible.

## 🚀 Configuración Rápida de Supabase

### 1. Crear proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com) y crea una cuenta
2. Crea un nuevo proyecto
3. Guarda la URL del proyecto y la clave anónima (anon key)

### 2. Configurar variables de entorno

1. Copia `.env.local.example` a `.env.local`
2. Reemplaza los valores con los de tu proyecto:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anonima
```

### 3. Crear la tabla en Supabase

1. Ve al editor SQL de Supabase
2. Ejecuta el contenido de `database/create_ephemerides_table.sql`
3. Ejecuta el contenido de `database/insert_ephemerides_data.sql`
4. (Opcional) Ejecuta `database/add_display_date.sql` si necesitas actualizar una tabla existente

## 📊 Estructura de la Tabla

```sql
CREATE TABLE ephemerides (
  id UUID PRIMARY KEY,
  date DATE NOT NULL,
  event TEXT NOT NULL,
  display_date VARCHAR(10) NOT NULL, -- Formato MM-DD
  category VARCHAR(50) DEFAULT 'programming',
  language VARCHAR(10) DEFAULT 'es',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🎯 Funcionalidad de Display Date

El campo `display_date` permite mostrar efemérides basadas en el día del año (formato MM-DD):

- **14-08**: Para eventos del 14 de agosto de cualquier año
- **01-01**: Para eventos del 1 de enero de cualquier año
- **12-25**: Para eventos del 25 de diciembre de cualquier año

## 🔧 Funciones Disponibles

- `getTodayEphemerides()` - Obtener efemérides del día actual
- `getTodayRandomEphemeris()` - Obtener una efeméride aleatoria del día actual
- `getEphemerisByDisplayDate(displayDate)` - Obtener efemérides por día específico (MM-DD)
- `getRandomEphemeris()` - Obtener una efeméride aleatoria de cualquier día
- `addEphemeris(ephemeris)` - Agregar nueva efeméride
- `getAvailableDates()` - Obtener todas las fechas disponibles

## 🎮 Comandos de Terminal

La aplicación ahora soporta:

- `today` / `hoy` - Muestra efemérides del día actual
- `random` - Muestra una efeméride aleatoria de cualquier día
- `refresh` - Alias para `random`
- `help` - Muestra la ayuda
- `history` - Muestra historial de comandos
- `clear` - Limpia la pantalla
- `exit` - Mensaje de salida

## 🛡️ Respaldo Local

Si Supabase no está configurado o no está disponible, la aplicación usará automáticamente los datos hardcodeados como respaldo, asegurando que siempre funcione.

## 🔒 Seguridad

- Row Level Security (RLS) habilitado
- Lectura pública permitida
- Escritura solo para usuarios autenticados
- Variables de entorno para credenciales

## 📝 Agregar Nuevas Efemérides

Puedes agregar nuevas efemérides directamente en Supabase o usar la función `addEphemeris()`:

```typescript
import { addEphemeris } from '@/lib/supabase'

await addEphemeris({
  date: '2024-08-14',
  event: 'Nueva efeméride de programación',
  display_date: '08-14' // Se calcula automáticamente si no se proporciona
})
```

## 🗓️ Ejemplo de Datos

```sql
INSERT INTO ephemerides (date, event, display_date) VALUES
('2024-08-14', 'Se lanza una nueva versión de la aplicación', '08-14'),
('1991-08-06', 'Tim Berners-Lee publica la primera página web', '08-06');
```

Esto permitirá que cualquier 14 de agosto se muestre la primera efeméride, y cualquier 6 de agosto se muestre la segunda.
