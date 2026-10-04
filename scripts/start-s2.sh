#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
SECRET_FILE="$PROJECT_ROOT/.env.s2"

if [ ! -f "$SECRET_FILE" ]; then
    ACCESS_SECRET=$(openssl rand -base64 48)
    REFRESH_SECRET=$(openssl rand -base64 48)
    cat <<EOF > "$SECRET_FILE"
S2_JWT_ACCESS_SECRET=$ACCESS_SECRET
S2_JWT_REFRESH_SECRET=$REFRESH_SECRET
EOF
    echo "Secretos JWT locales creados en .env.s2 (ignorado por Git)."
fi

cd "$PROJECT_ROOT"
docker compose --env-file .env --env-file .env.s2 -f docker-compose.yml -f docker-compose.s2.yml up -d

echo "Frontend: http://localhost:5173 | API: http://localhost:8080/actuator/health"
