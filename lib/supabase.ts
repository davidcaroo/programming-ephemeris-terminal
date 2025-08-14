import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env.local file and ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos TypeScript para la tabla ephemerides
export interface Ephemeris {
  id: string
  date: string
  event: string
  display_date?: string
  category?: string
  language?: string
  created_at?: string
  updated_at?: string
}

// Función para obtener todas las efemérides
export async function getEphemerides(): Promise<Ephemeris[]> {
  const { data, error } = await supabase
    .from('ephemerides')
    .select('*')
    .order('date', { ascending: true })

  if (error) {
    console.error('Error fetching ephemerides:', error)
    return []
  }

  return data || []
}

// Función para obtener efemérides del día actual (MM-DD)
export async function getTodayEphemerides(): Promise<Ephemeris[]> {
  const today = new Date()
  const displayDate = `${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`
  
  return getEphemerisByDisplayDate(displayDate)
}

// Función para obtener efemérides por display_date (formato MM-DD)
export async function getEphemerisByDisplayDate(displayDate: string): Promise<Ephemeris[]> {
  const { data, error } = await supabase
    .from('ephemerides')
    .select('*')
    .eq('display_date', displayDate)
    .order('date', { ascending: true })

  if (error) {
    console.error('Error fetching ephemerides by display date:', error)
    return []
  }

  return data || []
}

// Función para obtener una efeméride aleatoria del día actual
export async function getTodayRandomEphemeris(): Promise<Ephemeris | null> {
  const todayEphemerides = await getTodayEphemerides()
  
  if (todayEphemerides.length === 0) {
    // Si no hay efemérides para hoy, obtener una aleatoria de cualquier día
    return getRandomEphemeris()
  }
  
  const randomIndex = Math.floor(Math.random() * todayEphemerides.length)
  return todayEphemerides[randomIndex]
}

// Función para obtener una efeméride aleatoria de cualquier día
export async function getRandomEphemeris(): Promise<Ephemeris | null> {
  const { data, error } = await supabase
    .from('ephemerides')
    .select('*')

  if (error) {
    console.error('Error fetching random ephemeris:', error)
    return null
  }

  if (!data || data.length === 0) return null

  const randomIndex = Math.floor(Math.random() * data.length)
  return data[randomIndex]
}

// Función para agregar una nueva efeméride
export async function addEphemeris(ephemeris: Omit<Ephemeris, 'id' | 'created_at' | 'updated_at'>): Promise<Ephemeris | null> {
  // Si no se proporciona display_date, calcularlo desde la fecha
  if (!ephemeris.display_date && ephemeris.date) {
    const date = new Date(ephemeris.date)
    ephemeris.display_date = `${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
  }

  console.log('Attempting to insert ephemeris:', ephemeris)

  const { data, error } = await supabase
    .from('ephemerides')
    .insert([ephemeris])
    .select()
    .single()

  if (error) {
    console.error('Error adding ephemeris:', error)
    throw error // Lanzar el error para que se maneje en el API
  }

  console.log('Successfully inserted ephemeris:', data)
  return data
}

// Función para obtener efemérides por fecha específica
export async function getEphemerisByDate(date: string): Promise<Ephemeris[]> {
  const { data, error } = await supabase
    .from('ephemerides')
    .select('*')
    .eq('date', date)

  if (error) {
    console.error('Error fetching ephemerides by date:', error)
    return []
  }

  return data || []
}

// Función para obtener todas las fechas con efemérides (formato MM-DD)
export async function getAvailableDates(): Promise<string[]> {
  const { data, error } = await supabase
    .from('ephemerides')
    .select('display_date')
    .not('display_date', 'is', null)

  if (error) {
    console.error('Error fetching available dates:', error)
    return []
  }

  // Obtener fechas únicas
  const uniqueDates = [...new Set(data.map(item => item.display_date))]
  return uniqueDates.sort()
}
