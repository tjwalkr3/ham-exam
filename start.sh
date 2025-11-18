#!/bin/bash

set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname "$0")" && pwd)"
ASPIRE_DIR="$SCRIPT_DIR/aspire"
APP_HOST_CSproj="$ASPIRE_DIR/HamExamAspire.AppHost/HamExamAspire.AppHost.csproj"

# Load .env file if it exists
if [ -f "$SCRIPT_DIR/.env" ]; then
	set -a
	source "$SCRIPT_DIR/.env"
	set +a
fi

if [ ! -f "$APP_HOST_CSproj" ]; then
	echo "Aspire AppHost project not found at $APP_HOST_CSproj" >&2
	exit 1
fi

cd "$ASPIRE_DIR"
exec dotnet watch --project "$APP_HOST_CSproj" run