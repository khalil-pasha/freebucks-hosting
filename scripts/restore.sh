#!/bin/bash
# scripts/restore.sh
# Restores a PostgreSQL backup from a given dump file
# Usage: ./restore.sh ./backups/db_backup_2026...dump

set -e

if [ -z "$1" ]; then
  echo "Usage: ./restore.sh <path_to_dump_file>"
  exit 1
fi

DUMP_FILE=$1
DB_CONTAINER="freebucks-postgres-1" # Adjust if your docker-compose project name differs
DB_USER="freebucks"
DB_NAME="freebucks"

if [ ! -f "$DUMP_FILE" ]; then
  echo "Error: File $DUMP_FILE not found."
  exit 1
fi

echo "Starting database restore from $DUMP_FILE..."

# Copy dump into container
docker cp "$DUMP_FILE" $DB_CONTAINER:/tmp/db_restore.dump

# Drop schema public and recreate to ensure clean restore (Optional but recommended)
docker exec -it $DB_CONTAINER psql -U $DB_USER -d $DB_NAME -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"

# Restore dump
docker exec -it $DB_CONTAINER pg_restore -U $DB_USER -d $DB_NAME -1 /tmp/db_restore.dump || true

# Cleanup
docker exec -t $DB_CONTAINER rm /tmp/db_restore.dump

echo "Restore completed."
