import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';

const [profile, directory] = process.argv.slice(2);
assert.ok(['legacy', 'production'].includes(profile) && directory, 'Usage: node scripts/check-branding-build.mjs legacy|production <build-directory>');
const root = path.resolve(import.meta.dirname, '..');
const build = path.resolve(directory);
const read = name => fs.readFileSync(path.join(build, name));
const manifest = JSON.parse(read('manifest.json'));
const html = read('index.html').toString();
const prefix = profile === 'production' ? '/branding/production/' : '/';
assert.deepEqual(manifest.icons.map(i => i.src), ['pwa-64x64.png', 'pwa-192x192.png', 'pwa-512x512.png', 'maskable-icon-512x512.png'].map(n => prefix + n));
assert.equal(manifest.icons[3].purpose, 'maskable');
assert.equal(manifest.id, '/'); assert.equal(manifest.start_url, '/'); assert.equal(manifest.scope, '/');
assert.equal(manifest.theme_color, profile === 'production' ? '#0F228F' : '#7A3E6B');
assert.equal(manifest.background_color, profile === 'production' ? '#FFF9F2' : '#F7F1F5');
assert.ok(html.includes(`href="${prefix}favicon.ico"`));
assert.ok(html.includes(`href="${prefix}apple-touch-icon-180x180.png"`));
assert.ok(html.includes(`name="theme-color" content="${manifest.theme_color}"`));
const push = read('push-notifications-sw.js').toString();
assert.ok(push.includes(`icon: "${prefix}pwa-192x192.png"`));
assert.ok(push.includes(`badge: "${prefix}pwa-64x64.png"`));
if (profile === 'legacy') {
  const snapshot = JSON.parse(fs.readFileSync(path.join(root, 'tests/legacy-branding.snapshot.json')));
  for (const [file, sha] of Object.entries(snapshot.assets)) assert.equal(createHash('sha256').update(read(file)).digest('hex'), sha, file);
  assert.deepEqual(read('push-notifications-sw.js'), fs.readFileSync(path.join(root, 'public/push-notifications-sw.js')));
  assert.ok(!fs.existsSync(path.join(build, 'branding')));
} else {
  const sw = read('sw.js').toString();
  for (const name of fs.readdirSync(path.join(root, 'branding/production'))) {
    const file = 'branding/production/' + name;
    assert.deepEqual(read(file), fs.readFileSync(path.join(root, file)));
    const md5 = createHash('md5').update(read(file)).digest('hex');
    assert.ok(sw.includes(`url:"${file}",revision:"${md5}"`), 'Missing/current precache revision: ' + file);
  }
}
const files = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? files(path.join(dir, e.name)) : [path.join(dir, e.name)]);
assert.ok(files(build).every(f => !f.toLowerCase().endsWith('.pdf') && !path.relative(build, f).split(path.sep).includes('logo-source')));
console.log(`PASS ${profile}: icons, metadata, Push, source exclusion and ${profile === 'legacy' ? 'unchanged legacy asset bytes' : 'current offline asset revisions'}`);
