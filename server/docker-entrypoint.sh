#!/bin/sh
set -e

echo "Waiting for Postgres to be ready..."
node ./wait-for-db.js

echo "Running migrations and seeds"
npm run migrate-and-seed

echo "Starting server"
exec "$@"
