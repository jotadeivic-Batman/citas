#!/bin/sh
set -eu

: "${MYSQL_ROOT_PASSWORD:?MYSQL_ROOT_PASSWORD is required}"
: "${DB_NAME:?DB_NAME is required}"
: "${DB_USER:?DB_USER is required}"

case "$DB_NAME" in
  ''|*[!A-Za-z0-9_]*)
    echo "DB_NAME may contain only letters, digits, and underscores." >&2
    exit 1
    ;;
esac

case "$DB_USER" in
  ''|*[!A-Za-z0-9_]*)
    echo "DB_USER may contain only letters, digits, and underscores." >&2
    exit 1
    ;;
esac

export MYSQL_PWD="$MYSQL_ROOT_PASSWORD"

mysql --protocol=tcp --host=mysql --user=root <<SQL
CREATE DATABASE IF NOT EXISTS \`$DB_NAME\`;
GRANT ALL PRIVILEGES ON \`$DB_NAME\`.* TO '$DB_USER'@'%';
SQL

printf 'Database bootstrap completed.\n'