// Logger simple centralizado

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

const isDev = process.env.NODE_ENV !== 'production'

function log(level: LogLevel, message: string, ...args: any[]) {
  if (level === 'debug' && !isDev) return // debug solo en dev
  const prefix = {
    debug: '🐞',
    info: 'ℹ️',
    warn: '⚠️',
    error: '❌',
  }[level]
  console[level](`[${prefix} ${level.toUpperCase()}] ${message}`, ...args)
}

export const logger = {
  debug: (msg: string, ...args: any[]) => log('debug', msg, ...args),
  info: (msg: string, ...args: any[]) => log('info', msg, ...args),
  warn: (msg: string, ...args: any[]) => log('warn', msg, ...args),
  error: (msg: string, ...args: any[]) => log('error', msg, ...args),
}
