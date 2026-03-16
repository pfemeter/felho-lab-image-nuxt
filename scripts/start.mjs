import { execSync } from 'child_process';

try {
    console.log("starting db setup script");
    execSync('npx drizzle-kit push --config=drizzle.config.ts', { stdio: 'inherit' });

    console.log('db setup complete, starting nuxt server...');
    execSync('node .output/server/index.mjs', { stdio: 'inherit' });
} catch (error) {
    console.error('db setup error:', error);
    process.exit(1);
}