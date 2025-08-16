// Eventos verificados manualmente (fuente de la verdad)

const VERIFIED_EVENTS: Record<string, string> = {
  "08-16": "Se lanza la primera versión del navegador web Internet Explorer incluido con Windows 95 Plus! Pack (1995)",
  "08-15": "IBM anuncia el retiro de su mainframe System/390 modelo G5 y G6 para dar paso a la nueva serie zSeries (2000)",
  "01-15": "Se lanza Wikipedia, la enciclopedia libre en línea (2001)",
  // Agregar más eventos aquí...
}

/**
 * Devuelve un evento verificado para la fecha dada si existe
 */
export function getVerifiedEventForDate(displayDate: string): string | null {
  return VERIFIED_EVENTS[displayDate] ?? null
}
