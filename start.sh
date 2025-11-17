#!/bin/bash

set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname "$0")" && pwd)"
ASPIRE_DIR="$SCRIPT_DIR/aspire"
APP_HOST_CSproj="$ASPIRE_DIR/HamExamAspire.AppHost/HamExamAspire.AppHost.csproj"
ENV_FILE="$SCRIPT_DIR/.env"

if [ ! -f "$APP_HOST_CSproj" ]; then
	echo "Aspire AppHost project not found at $APP_HOST_CSproj" >&2
	exit 1
fi

if [ -f "$ENV_FILE" ]; then
	echo "Loading environment variables from $ENV_FILE"
	set -a
	# shellcheck disable=SC1090
	source "$ENV_FILE"
	set +a
else
	echo "Environment file $ENV_FILE not found; please create it with the required values." >&2
	exit 1
fi

if [ -z "${JWK_URI:-}" ]; then
	echo "Please export JWK_URI before running Aspire so the API can reach your IdP." >&2
	exit 1
fi

cd "$ASPIRE_DIR"
exec dotnet watch --project "$APP_HOST_CSproj" run