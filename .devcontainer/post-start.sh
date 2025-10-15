#!/bin/bash
set -e

echo "🔄 Starting Knowledge Graph Studio services..."

# Wait for database services to be ready
echo "⏳ Waiting for PostgreSQL..."
until pg_isready -h postgres -p 5432 -U kguser; do
    sleep 1
done
echo "✅ PostgreSQL is ready!"

echo "⏳ Waiting for Neo4j..."
until curl -s http://neo4j:7474 > /dev/null; do
    sleep 1
done
echo "✅ Neo4j is ready!"

echo "⏳ Waiting for Redis..."
until redis-cli -h redis ping > /dev/null 2>&1; do
    sleep 1
done
echo "✅ Redis is ready!"

# Run database migrations if they exist
if [ -f "scripts/migrate.sh" ]; then
    echo "🔄 Running database migrations..."
    bash scripts/migrate.sh
fi

# Start background services if needed
if [ -f "scripts/start-workers.sh" ]; then
    echo "🔄 Starting background workers..."
    bash scripts/start-workers.sh &
fi

echo "✅ All services are ready!"
echo ""
echo "🚀 You can now start developing!"
echo "   Run 'pnpm dev' to start the development servers"
echo ""