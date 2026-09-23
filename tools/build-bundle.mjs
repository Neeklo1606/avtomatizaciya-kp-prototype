/* Пересборка prototype/app/bundle.css и bundle.js (для публикации HTML-ноды стенда).
   Запуск: node tools/build-bundle.mjs */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const app = join(root, 'prototype', 'app');
const read = f => readFileSync(join(app, f), 'utf8');

const css = [read('styles.css'), read('stand.css')].map(s => s.trim()).join('\n\n');
const js = ['data.js','ui.js','views1.js','views2.js','views3.js','actions.js','shell.js']
  .map(f => '/* ===== ' + f + ' ===== */\n' + read(f).trim())
  .join('\n\n');

writeFileSync(join(app, 'bundle.css'), css + '\n', 'utf8');
writeFileSync(join(app, 'bundle.js'), js + '\n', 'utf8');
console.log('bundle.css', css.length, 'bundle.js', js.length);
