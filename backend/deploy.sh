#!/usr/bin/env bash
#
# Deploys the dashboard or the public site from a tarball on stdin. Installed on the VPS as
# /opt/ifleon/deploy.sh and used as the *forced command* of the GitHub Actions SSH key
# (authorized_keys: restrict,command="/opt/ifleon/deploy.sh" ssh-ed25519 ...), so that key can do
# nothing else. The workflow runs:
#
#   tar -cz -C dashboard . | ssh root@vps dashboard
#
# Steps: unpack into a staging folder, back up the database (dashboard only, migrations may run),
# swap the folder in (keeping the previous one), rebuild that one service, wait for its health check,
# and roll back to the previous version if it doesn't come up healthy.
set -euo pipefail

ROOT=/opt/ifleon
COMPOSE_DIR=$ROOT/backend
target="${SSH_ORIGINAL_COMMAND:-${1:-}}"

case "$target" in
  dashboard) dir=$ROOT/dashboard; services="migrate dashboard"; container=ifleon-dashboard ;;
  site)      dir=$ROOT/site;      services="site";              container=ifleon-site ;;
  *) echo "usage: <tarball on stdin> | deploy.sh dashboard|site" >&2; exit 2 ;;
esac

log() { echo "[deploy $target $(date -u +%H:%M:%S)] $*"; }

# One deploy at a time.
exec 9>"$ROOT/.deploy.lock"
flock -w 900 9 || { log "another deploy is still running"; exit 1; }

stage=$(mktemp -d "$ROOT/.stage-$target-XXXXXX")
trap 'rm -rf "$stage"' EXIT

log "receiving code"
tar -xz --no-same-owner -C "$stage"
[[ -f $stage/package.json && -f $stage/Dockerfile ]] || { log "tarball has no package.json/Dockerfile, aborting"; exit 1; }

if [[ $target == dashboard ]]; then
  log "backing up the database before migrations"
  "$ROOT/backup.sh" >/dev/null
fi

log "switching code"
rm -rf "$dir.prev"
[[ -d $dir ]] && mv "$dir" "$dir.prev"
mv "$stage" "$dir"
trap - EXIT

wait_healthy() {
  for _ in $(seq 1 60); do
    status=$(docker inspect -f '{{.State.Health.Status}}' "$container" 2>/dev/null || echo missing)
    [[ $status == healthy ]] && return 0
    [[ $status == unhealthy ]] && return 1
    sleep 3
  done
  return 1
}

cd "$COMPOSE_DIR"
log "building and starting: $services"
if docker compose up -d --build $services && wait_healthy; then
  log "healthy, deployed"
  docker image prune -f >/dev/null 2>&1 || true
  exit 0
fi

log "new version failed; rolling back"
docker logs --tail 40 "$container" 2>&1 || true
if [[ -d $dir.prev ]]; then
  rm -rf "$dir.failed"
  mv "$dir" "$dir.failed"
  mv "$dir.prev" "$dir"
  docker compose up -d --build $services && wait_healthy && log "rolled back to the previous version" || log "ROLLBACK ALSO FAILED, check the server"
fi
exit 1
