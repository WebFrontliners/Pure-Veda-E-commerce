import { spawn } from 'node:child_process';
import path from 'node:path';
import process from 'node:process';

const isWindows = process.platform === 'win32';
const npmCmd = isWindows ? 'npm.cmd' : 'npm';

console.log('🌿 Starting Pure Veda Full-Stack Monorepo...\n');

// 1. Start Backend Server
const server = spawn(npmCmd, ['run', 'dev'], {
  cwd: path.resolve(process.cwd(), 'server'),
  stdio: 'inherit',
  shell: true,
});

// 2. Start Frontend Client
const client = spawn(npmCmd, ['run', 'dev'], {
  cwd: path.resolve(process.cwd(), 'client'),
  stdio: 'inherit',
  shell: true,
});

process.on('SIGINT', () => {
  console.log('\n🛑 Gracefully shutting down Pure Veda servers...');
  server.kill();
  client.kill();
  process.exit();
});

process.on('SIGTERM', () => {
  server.kill();
  client.kill();
  process.exit();
});
