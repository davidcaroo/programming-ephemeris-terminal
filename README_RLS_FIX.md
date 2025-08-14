## 🔧 Problema de RLS (Row Level Security) en Supabase

### Problema Actual
El API está generando efemérides correctamente con OpenRouter/GPT-4o, pero hay un error de permisos en Supabase:

```
new row violates row-level security policy for table "ephemerides"
```

### Solución
Ejecuta este script en el **SQL Editor** de tu consola de Supabase:

```sql
-- Eliminar política restrictiva actual
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON ephemerides;

-- Crear nueva política que permita inserción desde la API
CREATE POLICY "Enable insert for API and authenticated users" ON ephemerides
  FOR INSERT WITH CHECK (
    auth.role() = 'authenticated' OR 
    auth.role() = 'anon'
  );
```

### Estado Actual del Sistema ✅

1. **OpenRouter + GPT-4o**: ✅ Funcionando correctamente
2. **API de generación**: ✅ Generando efemérides válidas  
3. **Terminal simplificado**: ✅ Solo 5 comandos como solicitaste
4. **Problema**: ❌ Solo el RLS policy bloquea la inserción

### Para Probar Después de Ejecutar el SQL

1. Ve a la consola de Supabase
2. Navega al SQL Editor
3. Ejecuta el script de `database/fix_rls_policy.sql`
4. Prueba el comando `refresh` en http://localhost:3001

### Comandos Disponibles (Final)
- `help` - Mostrar ayuda
- `refresh` - Refrescar y generar nueva efeméride del día con IA
- `history` - Ver historial
- `clear` - Limpiar pantalla  
- `exit` - Salir del sistema
