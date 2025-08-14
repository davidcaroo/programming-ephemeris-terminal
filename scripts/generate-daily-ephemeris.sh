#!/bin/bash

# Script para generar efemérides diarias automáticamente
# Configura este script para ejecutarse diariamente usando cron

# Variables de configuración
APP_URL="http://localhost:3000"  # Cambia esto por tu URL de producción
CRON_SECRET="your_secret_key_for_cron_jobs"  # Debe coincidir con .env.local
LOG_FILE="/var/log/ephemeris-generator.log"

# Función para logging
log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> "$LOG_FILE"
}

# Función principal
generate_ephemeris() {
    log_message "Starting daily ephemeris generation"
    
    # Hacer la solicitud POST al endpoint
    response=$(curl -s -w "HTTPSTATUS:%{http_code}" \
        -X POST \
        -H "Authorization: Bearer $CRON_SECRET" \
        -H "Content-Type: application/json" \
        "$APP_URL/api/generate-ephemeris")
    
    # Extraer código de estado HTTP
    http_code=$(echo "$response" | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
    body=$(echo "$response" | sed -e 's/HTTPSTATUS\:.*//g')
    
    if [ "$http_code" -eq 200 ]; then
        log_message "SUCCESS: Ephemeris generated successfully"
        log_message "Response: $body"
    else
        log_message "ERROR: Failed to generate ephemeris (HTTP $http_code)"
        log_message "Response: $body"
        
        # Enviar notificación de error (opcional)
        # send_error_notification "$body"
    fi
}

# Función para enviar notificaciones de error (opcional)
send_error_notification() {
    local error_message="$1"
    # Aquí puedes agregar notificaciones por email, Slack, etc.
    echo "Error generating ephemeris: $error_message" | mail -s "Ephemeris Generator Error" admin@yourdomain.com
}

# Ejecutar la función principal
generate_ephemeris

log_message "Daily ephemeris generation completed"
