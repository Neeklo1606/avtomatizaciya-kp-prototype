/* Сборка автономного стенда prototype/app/stand-app-standalone.html из исходников.
   Весь CSS и JS инлайнятся — файл работает офлайн и на GitHub Pages.
   Запуск: node tools/build-standalone.mjs */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const app = join(root, 'prototype', 'app');
const read = f => readFileSync(join(app, f), 'utf8');

const CSS = [read('styles.css'), read('stand.css'), read('premium.css')];
const JS = ['data.js', 'ui.js', 'views1.js', 'views2.js', 'views3.js', 'actions.js', 'shell.js'];

/* лёгкая безопасная минификация: убираем пустые строки */
function mini(src) {
  return src.split('\n').filter(l => l.trim() !== '').join('\n');
}

const BOOT_CSS = `
#boot{position:fixed;inset:0;z-index:9999;font:15px/1.5 Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif;
color:#E8E6DF;background:#14171A;display:grid;place-items:center;margin:0;text-align:center}
#boot b{display:block;font-size:22px;letter-spacing:-.02em;margin-bottom:8px}
#boot span{color:#9AA3A8}`;

const BOOT_HTML = '<div id="boot"><div><b>Автоматизация КП</b><span>Загружаю рабочий прототип…</span></div></div>';

const BOOT_JS = `(function(){
  function hide(){var b=document.getElementById('boot');
    if(b&&window.UI&&window.UI.render){b.remove();return true;} return false;}
  var t=setInterval(function(){ if(hide()) clearInterval(t); },100);
  setTimeout(hide,6000);
})();`;

function build({ minify = false } = {}) {
  const base = read('stand-app.html');
  const head = base.slice(0, base.indexOf('<link rel="stylesheet"'));
  const css = (minify ? mini(CSS.join('\n')) : CSS.join('\n')).trim() + '\n' + BOOT_CSS.trim();
  const js = JS.map(f => '/* ===== ' + f + ' ===== */\n' + (minify ? mini(read(f)) : read(f).trim())).join('\n\n');
  return head +
    '<style>\n' + css + '\n</style>\n' +
    '</head>\n<body>\n' + BOOT_HTML + '\n<div id="app" class="app"></div>\n' +
    '<noscript><p style="padding:20px">Для прототипа нужен включённый JavaScript.</p></noscript>\n' +
    '<script>\n' + js + '\n</script>\n' +
    '<script>\n' + BOOT_JS + '\n</script>\n</body>\n</html>\n';
}

writeFileSync(join(app, 'stand-app-standalone.html'), build(), 'utf8');
writeFileSync(join(app, 'stand-app-standalone.min.html'), build({ minify: true }), 'utf8');
console.log('built stand-app-standalone.html + .min.html');
