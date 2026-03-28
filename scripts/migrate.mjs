import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL.split('?')[0];

const migrationClient = postgres(connectionString, {
    max: 1,
    ssl: { rejectUnauthorized: false }
});

const db = drizzle(migrationClient);

async function runMigrations() {
    console.log('Checking database migrations...');
    const start = Date.now();

    await migrate(db, { migrationsFolder: './drizzle' });

    console.log(`Migrations complete in ${Date.now() - start}ms!`);
    process.exit(0);
}

runMigrations().catch((err) => {
    console.error('Migration failed:', err);
    process.exit(1);
});