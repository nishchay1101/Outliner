#!/bin/sh
set -e

echo ""
echo "  ╔══════════════════════════════════════╗"
echo "  ║      DocToPage — Starting Server     ║"
echo "  ╚══════════════════════════════════════╝"
echo ""

# Seed the Two Pointer lecture page on first boot
echo "  → Seeding initial page data..."
node /app/server/seed-page.mjs || echo "  ℹ  Seed skipped (already exists or error)."

echo "  → Starting server..."
echo ""

# rootDir is ".." so tsc outputs server/src/index.ts → dist/server/src/index.js
exec node /app/server/dist/server/src/index.js
