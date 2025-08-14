import { addEphemeris, getEphemerisByDisplayDate } from '@/lib/supabase'

// Función helper para testing y generación manual de efemérides
export async function testEphemerisGeneration() {
  try {
    // Generar efeméride para mañana
    const response = await fetch('/api/generate-ephemeris', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Agrega el header de autorización si tienes CRON_SECRET configurado
        // 'Authorization': `Bearer ${process.env.CRON_SECRET}`
      },
    })

    const result = await response.json()
    
    if (response.ok) {
      console.log('✅ Efeméride generada exitosamente:', result)
      return result
    } else {
      console.error('❌ Error generando efeméride:', result)
      return null
    }
  } catch (error) {
    console.error('❌ Error en la solicitud:', error)
    return null
  }
}

// Función para generar efeméride para una fecha específica
export async function generateEphemerisForSpecificDate(date: string) {
  try {
    const response = await fetch(`/api/generate-ephemeris?date=${date}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const result = await response.json()
    
    if (response.ok) {
      console.log(`✅ Efeméride generada para ${date}:`, result)
      return result
    } else {
      console.error(`❌ Error generando efeméride para ${date}:`, result)
      return null
    }
  } catch (error) {
    console.error('❌ Error en la solicitud:', error)
    return null
  }
}

// Función para verificar efemérides existentes
export async function checkExistingEphemerides() {
  try {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    const tomorrowDisplayDate = `${(tomorrow.getMonth() + 1).toString().padStart(2, '0')}-${tomorrow.getDate().toString().padStart(2, '0')}`
    
    const existing = await getEphemerisByDisplayDate(tomorrowDisplayDate)
    
    console.log(`📅 Efemérides existentes para mañana (${tomorrowDisplayDate}):`, existing.length)
    existing.forEach((ephemeris, index) => {
      console.log(`${index + 1}. ${ephemeris.event}`)
    })
    
    return existing
  } catch (error) {
    console.error('❌ Error verificando efemérides:', error)
    return []
  }
}

// Función para agregar efeméride manualmente
export async function addManualEphemeris(date: string, event: string) {
  try {
    const targetDate = new Date(date)
    const displayDate = `${(targetDate.getMonth() + 1).toString().padStart(2, '0')}-${targetDate.getDate().toString().padStart(2, '0')}`
    
    const newEphemeris = await addEphemeris({
      date: date,
      event: event,
      display_date: displayDate,
      category: 'programming',
      language: 'es'
    })
    
    if (newEphemeris) {
      console.log('✅ Efeméride agregada manualmente:', newEphemeris)
      return newEphemeris
    } else {
      console.error('❌ Error agregando efeméride manualmente')
      return null
    }
  } catch (error) {
    console.error('❌ Error:', error)
    return null
  }
}

// Para usar en la consola del navegador:
// Descomenta las siguientes líneas si quieres que estén disponibles globalmente
// if (typeof window !== 'undefined') {
//   (window as any).testEphemerisGeneration = testEphemerisGeneration
//   (window as any).generateEphemerisForSpecificDate = generateEphemerisForSpecificDate
//   (window as any).checkExistingEphemerides = checkExistingEphemerides
//   (window as any).addManualEphemeris = addManualEphemeris
// }
