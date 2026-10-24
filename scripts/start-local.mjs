import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import net from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const stateDir = path.join(root, '.wrangler', 'state');
const schemaMarker = path.join(stateDir, '.schwyz-schema-v1');
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const wranglerArgs = [
  '--import', './scripts/sites-env.mjs',
  './node_modules/wrangler/bin/wrangler.js',
  'd1', 'execute', 'DB', '--local',
  '--config', 'dist/server/wrangler.json',
  '--persist-to', '.wrangler/state',
];

function checkNodeVersion() {
  const [major, minor] = process.versions.node.split('.').map(Number);
  if (major < 22 || (major === 22 && minor < 13)) {
    throw new Error('Node.js 22.13 oder neuer ist nötig: https://nodejs.org/en/download');
  }
}

function launch(command, args, options) {
  if (process.platform === 'win32' && command === npm) {
    return spawn('cmd.exe', ['/d', '/s', '/c', `npm.cmd ${args.join(' ')}`], options);
  }
  return spawn(command, args, options);
}

function run(command, args, label) {
  console.log(`\n${label}`);
  return new Promise((resolve, reject) => {
    const child = launch(command, args, { cwd: root, stdio: 'inherit' });
    child.once('error', reject);
    child.once('exit', (code) => code === 0 ? resolve() : reject(new Error(`${label} fehlgeschlagen (Code ${code}).`)));
  });
}

function capture(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd: root, stdio: ['ignore', 'pipe', 'pipe'] });
    let output = '';
    child.stdout.on('data', chunk => { output += chunk; });
    child.stderr.on('data', chunk => { output += chunk; });
    child.once('error', reject);
    child.once('exit', code => code === 0 ? resolve(output) : reject(new Error(output.trim())));
  });
}

async function prepareLocalDatabase() {
  if (existsSync(schemaMarker)) return;
  console.log('\nPrüfe lokale Datenbank ...');
  const result = await capture(process.execPath, [
    ...wranglerArgs,
    '--command', "SELECT name FROM sqlite_master WHERE type='table' AND name='accounts'",
  ]);
  if (!/"name"\s*:\s*"accounts"/.test(result)) {
    await run(process.execPath, [...wranglerArgs, '--file', 'drizzle/0000_elite_jackpot.sql'], 'Richte die lokale Datenbank ein ...');
  }
  await mkdir(stateDir, { recursive: true });
  await writeFile(schemaMarker, '0000_elite_jackpot\n');
}

function portIsFree(port) {
  return new Promise(resolve => {
    const server = net.createServer();
    server.once('error', () => resolve(false));
    server.listen(port, '127.0.0.1', () => server.close(() => resolve(true)));
  });
}

async function choosePort() {
  for (const port of [4185, 4191, 4192, 4193, 4194]) {
    if (await portIsFree(port)) return port;
  }
  throw new Error('Kein freier Port zwischen 4185 und 4194 gefunden.');
}

function openBrowser(url) {
  if (process.platform === 'win32') {
    const child = spawn('cmd.exe', ['/d', '/s', '/c', `start "" "${url}"`], {
      cwd: root, stdio: 'ignore', windowsHide: true, detached: true,
    });
    child.unref();
  } else {
    console.log(`Bitte im Browser öffnen: ${url}`);
  }
}

async function waitForSite(url, child) {
  for (let attempt = 0; attempt < 90; attempt++) {
    if (child.exitCode !== null) throw new Error('Der Webserver wurde vor dem Start beendet.');
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(1500) });
      if (response.ok) return;
    } catch { /* Server startet noch. */ }
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  throw new Error('Die Website hat nach 90 Sekunden nicht geantwortet.');
}

async function main() {
  checkNodeVersion();
  if (!existsSync(path.join(root, 'node_modules', '.package-lock.json'))) {
    await run(npm, ['ci'], 'Installiere Pakete (beim ersten Start einige Minuten) ...');
  }
  if (!existsSync(path.join(root, 'dist', 'server', 'wrangler.json'))) {
    await run(process.execPath, ['scripts/run-framework.mjs', 'build'], 'Bereite die Website vor ...');
  }
  await prepareLocalDatabase();
  const port = await choosePort();
  const url = `http://127.0.0.1:${port}/signin-with-chatgpt?return_to=/`;
  console.log(`\nStarte die lokale Demo: ${url}`);
  console.log('Dieses Fenster offen lassen. Mit Strg+C beenden.');
  const server = spawn(process.execPath, ['scripts/run-framework.mjs', 'dev', '--port', String(port)], {
    cwd: root,
    stdio: 'inherit',
  });
  try {
    await waitForSite(url, server);
    openBrowser(url);
    console.log(`\nWebsite geöffnet: ${url}\n`);
    const code = await new Promise(resolve => server.once('exit', resolve));
    if (code !== 0) throw new Error(`Webserver beendet (Code ${code}).`);
  } catch (error) {
    if (server.exitCode === null) server.kill();
    throw error;
  }
}

main().catch(error => {
  console.error(`\nFehler: ${error.message}`);
  process.exitCode = 1;
});
