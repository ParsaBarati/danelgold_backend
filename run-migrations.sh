#!/bin/sh

# Wait for Postgres to be ready
while ! nc -z db 5432; do
  echo "Waiting for database to be ready..."
  sleep 2
done

# Run migrations
npm run typeorm migration:run


echo "Starting the application..."
npm run start:dev