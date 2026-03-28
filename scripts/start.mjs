import { execSync } from 'child_process';

try {
    console.log("Verifying DB schema state...");
    
    // Run the compiled migration script
    execSync('node scripts/migrate.mjs', { stdio: 'inherit' });

    console.log('Starting Nuxt server...');
    execSync('node .output/server/index.mjs', { stdio: 'inherit' });
} catch (error) {
    console.error('Startup error:', error);
    process.exit(1);
}