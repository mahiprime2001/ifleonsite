#!/usr/bin/env bash
# Nightly IFLEON backup: database, uploaded images and the .env (holds the secret that decrypts
# saved API keys). Keeps the last 14 days in /opt/ifleon/backups/daily (root-only).
# Restore DB:      gunzip -c db-<time>.sql.gz | docker exec -i ifleon-db psql -U ifleon -d ifleon
# Restore uploads: docker run --rm -v ifleon_uploads:/data -v /opt/ifleon/backups/daily:/b alpine tar -xzf /b/uploads-<time>.tar.gz -C /data
set -euo pipefail
DIR=/opt/ifleon/backups/daily
KEEP_DAYS=14
TS=$(date +%Y%m%d-%H%M%S)
umask 077
mkdir -p "$DIR"

docker exec ifleon-db pg_dump -U ifleon -d ifleon | gzip > "$DIR/db-$TS.sql.gz.part"
gzip -t "$DIR/db-$TS.sql.gz.part" && mv "$DIR/db-$TS.sql.gz.part" "$DIR/db-$TS.sql.gz"

docker run --rm -v ifleon_uploads:/data:ro -v "$DIR":/backup alpine tar -czf "/backup/uploads-$TS.tar.gz.part" -C /data .
gzip -t "$DIR/uploads-$TS.tar.gz.part" && mv "$DIR/uploads-$TS.tar.gz.part" "$DIR/uploads-$TS.tar.gz"

cp /opt/ifleon/backend/.env "$DIR/env-$TS"
chmod 600 "$DIR"/*
find "$DIR" -maxdepth 1 -type f -mtime +"$KEEP_DAYS" -delete
echo "$(date -Is) backup ok: db $(du -h "$DIR/db-$TS.sql.gz" | cut -f1), uploads $(du -h "$DIR/uploads-$TS.tar.gz" | cut -f1)"
