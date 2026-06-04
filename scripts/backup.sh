#!/bin/bash
# scripts/backup.sh
# Creates a timestamped PostgreSQL backup

set -e

BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
DB_CONTAINER="freebucks-postgres-1" # Adjust if your docker-compose project name differs
DB_USER="freebucks"
DB_NAME="freebucks"

mkdir -p "$BACKUP_DIR"

echo "Starting database backup..."
docker exec -t $DB_CONTAINER pg_dump -U $DB_USER -d $DB_NAME -F c -f /tmp/db_backup.dump
docker cp $DB_CONTAINER:/tmp/db_backup.dump "$BACKUP_DIR/db_backup_$TIMESTAMP.dump"
docker exec -t $DB_CONTAINER rm /tmp/db_backup.dump

echo "Backup completed: $BACKUP_DIR/db_backup_$TIMESTAMP.dump"
