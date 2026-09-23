/* Сборка автономного стенда prototype/app/stand-app-standalone.html из исходников.
   Без внешних зависимостей. Запуск: node tools/build-standalone.mjs */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const app = join(root, 'prototype', 'app');
const read = f => readFileSync(join(app, f), 'utf8');

const CSS = [read('styles.css'), read('stand.css')];
const JS = ['data.js', 'ui.js', 'views1.js', 'views2.js', 'views3.js', 'actions.js', 'shell.js'];

/* лёгкая безопасная минификация: убираем построчные комментарии и пустые строки */
function mini(src) {
  return src
    .split('\n')
    .filter(l => l.trim() !== '')
    .join('\n');
}

function build({ minify = false } = {}) {
  const base = read('stand-app.html');
  const head = base.slice(0, base.indexOf('<link rel="stylesheet"'));
  const css = (minify ? mini(CSS.join('\n')) : CSS.join('\n')).trim();
  const js = JS.map(f => '/* ===== ' + f + ' ===== */\n' + (minify ? mini(read(f)) : read(f).trim())).join('\n\n');
  return head +
    '<style>\n' + css + '\n</style>\n' +
    '</head>\n<body>\n<div id="app" class="app"></div>\n' +
    '<noscript><p style="padding:20px">Для прототипа нужен включённый JavaScript.</p></noscript>\n' +
    '<script>\n' + js + '\n</script>\n</body>\n</html>\n';
}

writeFileSync(join(app, 'stand-app-standalone.html'), build(), 'utf8');
writeFileSync(join(app, 'stand-app-standalone.min.html'), build({ minify: true }), 'utf8');
console.log('built stand-app-standalone.html + .min.html');
