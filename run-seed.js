const { execSync } = require('child_process');

try {
  console.log('🌱 Running seed script...');
  execSync('npx tsx prisma/seed.ts', { stdio: 'inherit' });
  console.log('✅ Seed completed successfully!');
} catch (error) {
  console.error('❌ Seed failed:', error.message);
  process.exit(1);
}
