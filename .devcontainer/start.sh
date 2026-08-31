#!/usr/bin/env bash
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"
if ! pgrep -f "tsx src/server/queue/workers.ts" >/dev/null; then
  nohup npm run worker >/tmp/careeros-worker.log 2>&1 &
fi
if ! pgrep -f "next dev" >/dev/null; then
  nohup npm run dev -- --hostname 0.0.0.0 >/tmp/careeros-web.log 2>&1 &
fi
printf 'CareerOS services started. Logs: /tmp/careeros-web.log and /tmp/careeros-worker.log\n'
