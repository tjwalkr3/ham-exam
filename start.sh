#!/bin/bash

set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname "$0")" && pwd)"
COMPOSE_FILE="$SCRIPT_DIR/docker-compose.yml"
ENV_FILE="$SCRIPT_DIR/.env"

if [ ! -f "$COMPOSE_FILE" ]; then
	echo "docker-compose.yml not found at $COMPOSE_FILE" >&2
	exit 1
fi

if [ ! -f "$ENV_FILE" ]; then
	echo ".env not found at $ENV_FILE" >&2
	exit 1
fi

if [ -z "${AI_TOKEN:-}" ]; then
	echo "Please export AI_TOKEN in your shell before running start.sh" >&2
	exit 1
fi

cd "$SCRIPT_DIR"
exec docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" up --build