#!/bin/bash

set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname "$0")" && pwd)"
ASPIRE_DIR="$SCRIPT_DIR/aspire"
APP_HOST_CSproj="$ASPIRE_DIR/HamExamAspire.AppHost/HamExamAspire.AppHost.csproj"

if [ ! -f "$APP_HOST_CSproj" ]; then
	echo "Aspire AppHost project not found at $APP_HOST_CSproj" >&2
	exit 1
fi

cd "$ASPIRE_DIR"
exec dotnet watch --project "$APP_HOST_CSproj" run