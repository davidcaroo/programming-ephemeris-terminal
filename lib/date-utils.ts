// Utilidades para manejar fechas y validaciones

/**
 * Devuelve fecha en formato MM-DD (ej: "08-16")
 */
export function formatDisplayDate(date: Date): string {
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
}

/**
 * Devuelve fecha en formato "D de mes" (ej: "16 de agosto")
 */
export function formatHumanDate(date: Date): string {
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
  })
}

/**
 * Devuelve fecha completa en formato YYYY-MM-DD
 */
export function formatFullDate(date: Date): string {
  return date.toISOString().split('T')[0]
}

/**
 * Valida que la fecha tenga formato YYYY-MM-DD y sea una fecha válida
 */
export function isValidDate(dateString: string): boolean {
  const regex = /^\d{4}-\d{2}-\d{2}$/
  if (!regex.test(dateString)) return false

  const date = new Date(dateString)
  return !isNaN(date.getTime())
}

/**
 * Valida el contenido de un evento para evitar cosas inválidas
 */
export function validateEventContent(content: string): boolean {
  if (!content) return false
  if (content.length > 180) return false
  if (/^\d{1,2} de /.test(content)) return false // evitar que empiece con fecha
  if (/NO_EVENT/i.test(content)) return false
  return true
}
