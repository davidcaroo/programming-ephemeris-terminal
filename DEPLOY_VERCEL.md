# 🚀 GUÍA DE DESPLIEGUE EN VERCEL

## 📋 **PREREQUISITOS**

✅ Proyecto funcionando localmente  
✅ Cuenta de GitHub  
✅ Cuenta de Vercel  
✅ Variables de entorno configuradas localmente

## 🛠️ **PASOS PARA EL DESPLIEGUE**

### 1. **Preparar el repositorio de GitHub**

```powershell
# Navegar al directorio del proyecto
cd "c:\Users\Ingca\Downloads\programming-ephemerisV1"

# Inicializar Git (si no está inicializado)
git init

# Agregar todos los archivos
git add .

# Hacer commit inicial
git commit -m "feat: Programming Ephemeris Terminal with AI generation"

# Agregar origen remoto (reemplaza con tu repositorio)
git remote add origin https://github.com/TU_USUARIO/programming-ephemeris.git

# Subir a GitHub
git push -u origin main
```

### 2. **Configurar Vercel**

1. Ve a [vercel.com](https://vercel.com)
2. Inicia sesión con GitHub
3. Haz clic en **"Add New"** → **"Project"**
4. Selecciona tu repositorio `programming-ephemeris`
5. Vercel detectará automáticamente que es un proyecto Next.js

### 3. **Configurar Variables de Entorno en Vercel**

En la página de configuración del proyecto, ve a **Settings** → **Environment Variables** y agrega:

```
OPENAI_API_KEY=sk-or-v1-TU_API_KEY_DE_OPENROUTER
NEXT_PUBLIC_SUPABASE_URL=https://TU_PROYECTO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=TU_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=TU_SERVICE_ROLE_KEY
CRON_SECRET=tu_secreto_para_cron
```

**⚠️ IMPORTANTE**: Asegúrate de marcar `SUPABASE_SERVICE_ROLE_KEY` y `CRON_SECRET` como **Production** y **Preview** para seguridad.

### 4. **Verificar la configuración de Supabase**

Verifica que las políticas RLS estén configuradas correctamente:

```sql
-- Ejecutar en Supabase SQL Editor si no lo has hecho
CREATE POLICY "Public read access" ON ephemerides
  FOR SELECT USING (true);

CREATE POLICY "Public insert access" ON ephemerides
  FOR INSERT WITH CHECK (true);

ALTER TABLE ephemerides ENABLE ROW LEVEL SECURITY;
```

### 5. **Desplegar**

1. Haz clic en **"Deploy"** en Vercel
2. Espera a que termine el build (2-3 minutos)
3. ¡Tu proyecto estará disponible en una URL como `https://programming-ephemeris.vercel.app`!

## 🔧 **CONFIGURACIÓN POST-DESPLIEGUE**

### **Probar el Cron Job**

Después del despliegue, puedes probar el cron job manualmente:

```bash
curl -X POST https://tu-proyecto.vercel.app/api/generate-ephemeris \
  -H "Authorization: Bearer tu_secreto_para_cron" \
  -H "Content-Type: application/json"
```

### **Verificar funcionalidad**

1. **Terminal**: Ve a tu URL y prueba el comando `refresh`
2. **Base de datos**: Verifica que se guarden las efemérides en Supabase
3. **Cron job**: A las 00:00 UTC se generará automáticamente la efeméride del siguiente día

## 📊 **LO QUE FUNCIONARÁ AUTOMÁTICAMENTE**

✅ **Efemérides diarias**: Se generarán automáticamente a medianoche  
✅ **Sistema híbrido**: Eventos verificados + IA como respaldo  
✅ **Base de datos**: Todas las efemérides se guardan en Supabase  
✅ **Terminal interactivo**: Los usuarios pueden usar comandos  
✅ **Responsive**: Funciona en móviles y desktop  

## 🎯 **COMANDOS ÚTILES POST-DESPLIEGUE**

```powershell
# Para actualizar el proyecto después de cambios
git add .
git commit -m "feat: descripción del cambio"
git push

# Vercel redesplegará automáticamente
```

## 🔍 **MONITOREO**

- **Logs de Vercel**: Ve a tu dashboard de Vercel → Functions → Ver logs
- **Base de datos**: Monitorea las inserciones en Supabase
- **Errores**: Revisa la consola del navegador y logs de Vercel

## 🚨 **TROUBLESHOOTING**

**Si el build falla:**
- Verifica que todas las variables de entorno estén configuradas
- Revisa los logs de build en Vercel
- Asegúrate de que no hay errores de TypeScript

**Si el cron job no funciona:**
- Verifica que `CRON_SECRET` esté configurado
- Revisa los logs de la función en Vercel
- Prueba el endpoint manualmente

¡Listo para desplegue! 🚀
