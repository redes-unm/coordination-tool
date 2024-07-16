#!/bin/sh

set -e

if [ "$1" = "--env" ]; then
    if [ -n "$2" ]; then
        echo Sourcing "$2" >&2
        . ./"$2"
    else
        echo Expected env file after --env >&2
        exit 1
    fi
fi

cd "$(dirname "$0")"


docker build \
    --build-arg NEXT_PUBLIC_SUPABASE_URL="${NEXT_PUBLIC_SUPABASE_URL:?missing env var NEXT_PUBLIC_SUPABASE_URL}" \
    --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY="${NEXT_PUBLIC_SUPABASE_ANON_KEY:?missing env var NEXT_PUBLIC_SUPABASE_ANON_KEY}" \
    --build-arg NEXT_PUBLIC_MAPBOX_TOKEN="${NEXT_PUBLIC_MAPBOX_TOKEN:?missing env var NEXT_PUBLIC_MAPBOX_TOKEN}" \
    --build-arg ADMIN_ID="$ADMIN_ID" \
    --tag coord-tool:latest \
    .
