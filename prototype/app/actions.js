/* Реализация всех действий (data-act). Каждая кнопка интерфейса имеет обработчик. */
(function () {
  'use strict';
  const U = window.UI, T = U.T, DB = U.DB, esc = U.esc, icon = U.icon, D = U.define, toast = U.toast;
  const v1 = window.__views1, v2 = window.__views2, v3 = window.__views3;
  const re = () => U.render(true);

  /* ---------- навигация и оболочка ---------- */
  D('go', k => U.go(k));
  D('denied', k => toast(T.accessDeniedD, 'warn'));
  D('soon', () => toast('Появится на следующем этапе.', 'info'));
  D('noop', () => {});
  D('navToggle', () => {
    if (window.matchMedia('(max-width:860px)').matches) { document.getElementById('side').classList.toggle('open'); }
    else { U.S.collapsed = !U.S.collapsed; U.saveState(); re(); }
  });
  D('sideClose', () => document.getElementById('side').classList.remove('open'));
  D('collapseSide', () => { U.S.collapsed = !U.S.collapsed; U.saveState(); re(); });
  D('setTheme', k => { U.S.theme = k || (U.S.theme === 'dark' ? 'light' : 'dark'); U.saveState(); toast('Тема: ' + (U.S.theme === 'light' ? T.themeLight : T.themeDark) + '.', 'ok'); re(); });
  D('themeToggle', () => D['setTheme']());
  D('setRole', k => {
    const r = k || (document.querySelector('input[name=roleS]:checked') || document.querySelector('input[name=role]:checked') || document.querySelector('input[name=role2]:checked') || {}).value || 'manager';
    U.S.role = r; U.saveState();
    const cur = U.cur();
    toast('Роль: ' + ({ manager: T.manager, head: T.head, admin: T.admin }[r]) + '.', 'ok');
    if (!U.roleCan(cur)) U.go('today'); else re();
  });
  D('switchRole', () => U.overlay('dlgRole'));
  D('logout', () => { U.S.authed = false; U.saveState(); toast('Вы вышли из системы.', 'ok'); U.go('login'); });
  D('resetDemo', () => { DB.reset(); toast('Демо-данные восстановлены.', 'ok'); re(); });

  /* ---------- оверлеи ---------- */
  D('closeDlg', id => { U.closeOverlay(); });
  D('closeSheet', id => { U.closeOverlay(); });
  D('noti', () => U.togglePanel('pnNoti'));
  D('profileMenu', () => U.togglePanel('pnProfile'));
  D('openFilterSheet', () => U.overlay('shFilters'));

  /* ---------- глобальный поиск ---------- */
  let sq = '', scur = -1, sres = [];
  D('focusSearch', () => { const i = document.querySelector('#gSearch input'); if (i) i.focus(); });
  D('searchClear', () => { const i = document.querySelector('#gSearch input'); if (i) { i.value = ''; sq = ''; renderSearch(); } });
  D('sresPick', k => { const it = sres[+k]; if (!it) return; U.closeSearch(); it.fn(); });
  D('searchAll', () => { U.closeSearch(); U.go('requests'); toast('Показаны все запросы. Уточните поиск строкой поиска.', 'info'); });

  /* ---------- список запросов ---------- */
  const F = U.F.requests;
  D('fStatusSet', v => { F.status = v; F.page = 1; re(); });
  D('fAssigneeSet', v => { F.assignee = v; F.page = 1; re(); });
  D('fClientSet', v => { F.client = v; F.page = 1; re(); });
  D('fPeriodSet', v => { F.period = v; F.page = 1; re(); toast(v ? 'Период: последние ' + v + ' дней.' : 'Период: весь.', 'ok'); });
  D('toggleAction', () => { F.action = !F.action; F.page = 1; re(); toast(F.action ? 'Фильтр: только требующие действия.' : 'Фильтр снят.', 'ok'); });
  D('toggleLowConf', () => { F.low = !F.low; F.page = 1; re(); toast(F.low ? 'Фильтр: низкая уверенность.' : 'Фильтр снят.', 'ok'); });
  D('resetFilters', () => { F.status = F.assignee = F.client = F.period = ''; F.action = F.low = false; F.page = 1; re(); toast('Фильтры сброшены.', 'ok'); });
  D('sortBy', k => { if (F.sort === k) F.dir = -F.dir; else { F.sort = k; F.dir = k === 'client' || k === 'status' ? 1 : -1; } re(); });
  D('sortDir', () => { F.dir = -F.dir; re(); });
  D('perPage', v => { F.per = +v; F.page = 1; re(); });
  D('pager', k => { const pages = Math.max(1, Math.ceil(rowsFiltered().length / F.per)); F.page = k === 'prev' ? Math.max(1, F.page - 1) : k === 'next' ? Math.min(pages, F.page + 1) : +k; re(); });
  function rowsFiltered() {
    let rows = DB.requests.slice();
    if (F.status) rows = rows.filter(r => r.status === F.status);
    if (F.assignee) rows = rows.filter(r => r.assignee.name === F.assignee);
    if (F.client) rows = rows.filter(r => r.client.name === F.client);
    if (F.action) rows = rows.filter(r => ['review','need_article','waiting_supplier'].indexOf(r.status) >= 0);
    if (F.low) rows = rows.filter(r => r.minConfidence < 0.7);
    return rows;
  }
  D('selectAll', (v, el) => { const rows = rowsFiltered().slice((F.page - 1) * F.per, F.page * F.per); rows.forEach(r => F.sel[r.id] = el.checked); re(); });
  D('toggleSel', (v, el) => { const id = el.getAttribute('data-id'); F.sel[id] = el.checked; re(); });
  D('bulkClear', () => { F.sel = {}; re(); toast('Выбор снят.', 'ok'); });
  D('bulkAssign', () => {
    const ids = Object.keys(F.sel).filter(k => F.sel[k]); if (!ids.length) return toast('Ничего не выбрано.', 'warn');
    ids.forEach(id => { const r = DB.req(id); if (r) { r.assignee = { id: 'm1', name: 'Клочко Н.' }; DB.addActivity(r, 'Клочко Н.', 'Назначен ответственный'); } });
    DB.log('Назначение ответственного', ids.length + ' запросов');
    F.sel = {}; toast('Назначено ответственным: ' + ids.length + ' запросов.', 'ok'); re();
  });
  D('bulkClose', () => {
    const ids = Object.keys(F.sel).filter(k => F.sel[k]); if (!ids.length) return toast('Ничего не выбрано.', 'warn');
    ids.forEach(id => { const r = DB.req(id); if (r) { r.status = 'closed'; DB.addActivity(r, 'Клочко Н.', 'Запрос закрыт'); } });
    DB.log('Закрытие запросов', ids.length + ' запросов'); DB.persist();
    F.sel = {}; toast('Закрыто: ' + ids.length + ' запросов.', 'ok'); re();
  });
  D('toggleCol', (v, el) => { F.cols[el.getAttribute('data-id')] = el.checked; re(); });
  D('openCols', () => U.overlay('dlgCols'));
  D('exportRequests', () => U.exportXls('Запросы_' + new Date().toISOString().slice(0, 10),
    ['№','Дата','Клиент','Тема','Позиций','Уверенность','Сумма КП','Статус','Ответственный'],
    rowsFiltered().map(r => [2026 + '-' + r.number, U.dt(r.receivedAt), r.client.name, r.subject, r.positionsCount,
      U.num(r.minConfidence), r.quoteTotalRub || '', (window.MOCK.STATUS_MAP[r.status] || {}).label, r.assignee.name])));
  D('filterLowConf', () => { F.low = true; F.page = 1; U.go('requests'); toast('Показаны запросы с низкой уверенностью.', 'ok'); });

  /* ---------- карточка запроса ---------- */
  D('openReq', id => { U.go('requests'); location.hash = '#/request/' + id; });
  D('cardTab', k => { window.__views1.CTAB(k); re(); });
  D('setAssignee', (v, el) => {
    const [id, name] = el.getAttribute('data-id').split('|');
    const r = DB.req(id); if (!r) return;
    r.assignee = { id: 'm2', name: name }; DB.addActivity(r, 'Клочко Н.', 'Назначен ответственный', name);
    DB.log('Назначение ответственного', 'Запрос ' + id); toast('Ответственный: ' + name + '.', 'ok'); re();
  });
  D('closeRequest', id => {
    const r = DB.req(id); if (!r) return;
    const prev = r.status; r.status = 'closed'; DB.addActivity(r, 'Клочко Н.', 'Запрос закрыт'); DB.log('Закрытие запроса', '№ 2026-' + r.number); DB.persist(); re();
    U.undoToast('Запрос закрыт.', () => { r.status = prev; DB.persist(); re(); });
  });
  D('openAssign', () => U.overlay('dlgAssign'));
  D('showImages', (k, el) => { const r = curReq(); if (r) r.__imgs = true; re(); toast('Изображения загружены (санитизированы).', 'ok'); });
  D('openAtt', name => toast('Вложение «' + name + '» открыто в безопасном просмотрщике.', 'info'));
  D('openRawMail', () => toast('Оригинал письма открыт в отдельном окне (только чтение).', 'info'));
  D('posFromMail', article => {
    window.__views1.CTAB('positions');
    re();
    setTimeout(() => { const el = Array.prototype.slice.call(document.querySelectorAll('input[data-edit=setPosArticle]')).filter(i => i.value === article)[0]; if (el) { el.scrollIntoView({ block: 'center' }); el.focus(); } }, 60);
    toast('Позиция с артикулом ' + article + ' — в таблице.', 'info');
  });
  const curReq = () => DB.req(location.hash.split('/')[2]) || DB.requests[0];

  /* правки позиций — автосохранение */
  D('setPosArticle', (v, el) => { const [id, pid] = el.getAttribute('data-id').split('|'); const p = pos(id, pid); if (p) { p.article = v.trim(); if (p.article && !p.brand) p.brand = window.MOCK.BRANDS[0]; DB.persist(); } });
  D('setPosName', (v, el) => { const [id, pid] = el.getAttribute('data-id').split('|'); const p = pos(id, pid); if (p) { p.name = v; DB.persist(); } });
  D('setPosBrand', (v, el) => { const [id, pid] = el.getAttribute('data-id').split('|'); const p = pos(id, pid); if (p) { p.brand = v; DB.persist(); } });
  D('setPosQty', (v, el) => { const [id, pid] = el.getAttribute('data-id').split('|'); const p = pos(id, pid); if (p) { const was = p.qty; p.qty = Math.max(1, +v || 1); recalc(p); DB.persist(); refreshTotals(id); if (was !== p.qty) DB.addActivity(DB.req(id), 'Клочко Н.', 'Правка позиции', p.article + ': количество ' + was + ' → ' + p.qty); } });
  D('setPosPrice', (v, el) => { const [id, pid] = el.getAttribute('data-id').split('|'); const p = pos(id, pid); if (p) { p.supplierPrice = v === '' ? undefined : +v; if (p.supplierPrice !== undefined && !p.supplierCurrency) p.supplierCurrency = 'USD'; p.priceSource = 'manual'; recalc(p); DB.persist(); refreshTotals(id); } });
  D('setPosUnit', (v, el) => { const [id, pid] = el.getAttribute('data-id').split('|'); const p = pos(id, pid); if (p) { p.unit = v; DB.persist(); } });
  D('setPosCat', (v, el) => { const [id, pid] = el.getAttribute('data-id').split('|'); const p = pos(id, pid); if (p) { p.category = v; recalc(p); DB.persist(); refreshTotals(id); } });
  D('toggleReviewed', (v, el) => { const [id, pid] = el.getAttribute('data-id').split('|'); const p = pos(id, pid); if (p) { p.reviewed = el.checked; if (el.checked && p.confidence < 0.7) p.confidence = 0.92; const r = DB.req(id); r.positions.forEach(x => { if (!x.reviewed && x.confidence >= 0.7) x.reviewed = true; }); DB.persist(); re(); toast(el.checked ? 'Позиция проверена.' : 'Отметка проверки снята.', 'ok'); } });
  D('delPos', k => {
    const [id, pid] = k.split('|'); const r = DB.req(id); if (!r) return;
    const i = r.positions.findIndex(p => p.id === pid); if (i < 0) return;
    const removed = r.positions.splice(i, 1)[0];
    DB.addActivity(r, 'Клочко Н.', 'Позиция удалена', removed.name); DB.persist(); re();
    U.undoToast('Позиция «' + removed.name + '» удалена.', () => { r.positions.splice(i, 0, removed); DB.persist(); re(); });
  });
  D('addPos', id => {
    const r = DB.req(id); if (!r) return;
    r.positions.push({ id: 'p' + Date.now(), article: '', name: 'Новая позиция', brand: '', qty: 1, unit: 'шт',
      category: 'Реактивы', dutyPct: 5, confidence: 0.95, reviewed: true });
    DB.addActivity(r, 'Клочко Н.', 'Добавлена позиция вручную'); DB.persist(); re(); toast('Позиция добавлена — заполните артикул и цену.', 'ok');
  });
  D('mergePos', id => {
    const r = DB.req(id); if (!r) return;
    const seen = {}, dups = [];
    r.positions.forEach(p => { const k = (p.article || p.name).toLowerCase(); if (seen[k]) dups.push(p); else seen[k] = p; });
    const body = document.getElementById('dupBody');
    if (body) body.innerHTML = dups.length
      ? '<div class="col" style="gap:8px">' + dups.map(d => '<label class="radio-i"><input type="checkbox" checked style="accent-color:var(--accent)"><span class="small grow">' + esc(d.name) + ' — объединить количество</span></label>').join('') + '</div>'
      : '<div>Дублей по артикулу и наименованию не найдено. Таблица уже консолидирована.</div>';
    U.overlay('dlgDup');
  });
  D('applyMerge', () => {
    const r = curReq(); const seen = {}, out = [];
    r.positions.forEach(p => { const k = (p.article || p.name).toLowerCase(); if (seen[k]) { seen[k].qty += p.qty; recalc(seen[k]); } else { seen[k] = p; out.push(p); } });
    const removed = r.positions.length - out.length;
    r.positions = out; DB.addActivity(r, 'Клочко Н.', 'Объединены дубли', 'удалено ' + removed);
    DB.persist(); U.closeOverlay(); re(); toast(removed ? 'Дубли объединены: ' + removed + ' строк.' : 'Дублей не было.', 'ok');
  });
  function pos(id, pid) { const r = DB.req(id); return r ? r.positions.filter(p => p.id === pid)[0] : null; }
  function recalc(p) { DB.recalc(p); }
  function refreshTotals(id) {
    const r = DB.req(id); if (!r) return;
    const t = DB.totals(r);
    const nodes = document.querySelectorAll('.kv');
    const total = Array.prototype.slice.call(nodes).filter(n => n.textContent.indexOf(T.totalNet) >= 0)[0];
    if (total) { const dds = total.querySelectorAll('dd'); if (dds[0]) dds[0].textContent = U.money(t.net); if (dds[1]) dds[1].textContent = U.money(t.duty); if (dds[2]) dds[2].textContent = U.money(t.total); }
  }

  /* запросы клиенту и поставщику */
  D('reqArticle', k => { const [id, pid] = k.split('|'); reqArticleDialog(id, pid); });
  D('reqArticleAll', () => { const r = curReq(); reqArticleDialog(r.id, null); });
  D('reqPrice', k => { const [id, pid] = k.split('|'); reqPriceDialog(id, pid); });
  D('reqAllPrices', id => { const r = DB.req(id) || curReq(); reqPriceDialog(r.id, null); });
  D('sendArticleReq', () => {
    const r = curReq(); const body = (document.getElementById('arBody') || {}).value || '';
    DB.addActivity(r, 'Клочко Н.', 'Запрошены артикулы у клиента', 'письмо подтверждено и отправлено');
    DB.log('Запрос артикула', '№ 2026-' + r.number); DB.persist(); U.closeOverlay(); re();
    toast('Письмо клиенту отправлено: запрос артикулов.', 'ok');
  });
  D('sendPriceReq', () => {
    const r = curReq(); const sel = document.getElementById('prSup');
    const sup = sel ? sel.value : 'Thermo Fisher Scientific';
    DB.addActivity(r, 'Клочко Н.', 'Запрос поставщику отправлен', sup);
    if (r.status === 'review' || r.status === 'parsed') r.status = 'waiting_supplier';
    DB.log('Запрос поставщику', '№ 2026-' + r.number); DB.persist(); U.closeOverlay(); re();
    toast('Запрос отправлен поставщику: ' + sup + '.', 'ok');
  });
  function reqArticleDialog(id, pid) {
    const r = DB.req(id); if (!r) return;
    const items = pid ? r.positions.filter(p => p.id === pid) : r.positions.filter(p => !p.article);
    const list = items.map(p => '· ' + p.name).join('\n') || '· (все позиции имеют артикул)';
    const html = '<div class="ai-bar"><span class="ai-t">' + icon('sparkles', 'ic-sm') + ' ИИ</span>' +
      '<button class="btn sm" data-act="aiEmail" data-k="polite">Вежливее</button>' +
      '<button class="btn sm" data-act="aiEmail" data-k="short">Короче</button></div>' +
      '<div class="field"><label>Кому</label><input class="inp" value="' + esc(r.email.from) + '"></div>' +
      '<div class="field"><label>Тема</label><input class="inp" value="Уточнение артикулов по запросу № 2026-' + r.number + '"></div>' +
      '<div class="field"><label>Текст письма</label><textarea class="inp" id="arBody" style="min-height:180px">' +
      esc('Добрый день!\n\nДля точного расчёта уточните, пожалуйста, артикулы по позициям:\n\n' + list + '\n\nС уважением,\nКлочко Никита\nneeklo-lab') + '</textarea></div>' +
      '<div class="fhint">' + icon('shield', 'ic-sm') + ' Письмо уйдёт только после нажатия «Отправить». Предпросмотр выше — финальный.</div>';
    mountDlg('dlgReqArt', 'Запрос артикулов у клиента', html,
      '<button class="btn" data-act="closeDlg">' + T.cancel + '</button>' +
      '<button class="btn primary" data-act="sendArticleReq">' + icon('send', 'ic-sm') + ' ' + T.send + '</button>');
  }
  function reqPriceDialog(id, pid) {
    const r = DB.req(id); if (!r) return;
    const items = pid ? r.positions.filter(p => p.id === pid) : r.positions.filter(p => p.clientPriceRub === undefined);
    const list = items.map(p => '· ' + (p.article ? p.article + ' — ' : '') + p.name + ' (' + p.qty + ' ' + p.unit + ')').join('\n') || '· (все позиции имеют цену)';
    const html = '<div class="ai-bar"><span class="ai-t">' + icon('sparkles', 'ic-sm') + ' ИИ</span>' +
      '<button class="btn sm" data-act="aiSupplier" data-k="en">Составить на английском</button>' +
      '<button class="btn sm" data-act="aiSupplier" data-k="ru">На русском</button></div>' +
      '<div class="field"><label>Поставщик</label><select class="inp" id="prSup">' +
      window.MOCK.SUPPLIERS.map(s => '<option>' + esc(s[0]) + '</option>').join('') + '</select></div>' +
      '<div class="field"><label>Тема</label><input class="inp" value="Quotation request — ' + items.length + ' items"></div>' +
      '<div class="field"><label>Текст письма</label><textarea class="inp" id="prBody" style="min-height:180px">' +
      esc('Dear colleagues,\n\nPlease provide a quotation for the following items:\n\n' + list + '\n\nPlease specify the delivery time and payment terms.\n\nKind regards,\nProcurement Department\nneeklo-lab') + '</textarea></div>' +
      '<div class="fhint">' + icon('shield', 'ic-sm') + ' Отправка после подтверждения. Ответ вернётся в карточку поставщика и разберётся автоматически.</div>';
    mountDlg('dlgReqPrice', 'Запрос цен у поставщика', html,
      '<button class="btn" data-act="closeDlg">' + T.cancel + '</button>' +
      '<button class="btn primary" data-act="sendPriceReq">' + icon('send', 'ic-sm') + ' ' + T.send + '</button>');
  }
  function mountDlg(id, title, body, footer) {
    const old = document.getElementById(id); if (old) old.remove();
    const d = document.createElement('div');
    d.className = 'dlg'; d.id = id; d.setAttribute('role', 'dialog'); d.setAttribute('aria-modal', 'true');
    d.innerHTML = '<div class="dlg-h"><b class="h2">' + esc(title) + '</b><div class="grow"></div>' +
      '<button class="ibtn" data-act="closeDlg" aria-label="' + T.close + '">' + icon('x') + '</button></div>' +
      '<div class="dlg-b">' + body + '</div>' +
      '<div class="dlg-f">' + (footer || '<button class="btn" data-act="closeDlg">' + T.close + '</button>') + '</div>';
    document.body.appendChild(d);
    U.overlay(id);
  }
  window.UI.mountDlg = mountDlg;

  /* ---------- КП и отправка ---------- */
  D('openQuote', id => {
    const r = DB.req(id) || curReq();
    const t = DB.totals(r);
    const d = document.getElementById('dlgQuote');
    if (d) { const ttl = d.querySelector('.h2'); if (ttl) ttl.textContent = 'КП-2026-0' + (900 + r.number); }
    U.overlay('dlgQuote');
  });
  D('openSend', id => {
    const r = DB.req(id) || curReq();
    const to = document.getElementById('sdTo'), sub = document.getElementById('sdSubj'), att = document.getElementById('sdAtt');
    if (to) to.textContent = r.email.from;
    if (sub) sub.textContent = 'КП-2026-0' + (900 + r.number) + ' — ' + r.client.name;
    if (att) att.textContent = 'КП-2026-0' + (900 + r.number) + '.xls';
    U.overlay('dlgSend');
  });
  D('confirmSend', () => {
    const r = curReq();
    r.quote = { id: 'q' + Date.now(), version: (r.quote && r.quote.version || 0) + 1, status: 'sent',
      totalRub: DB.totals(r).total, sentAt: U.dt(new Date().toISOString()), fileUrl: '/КП/2026/КП-2026-0' + (900 + r.number) + '.xls' };
    const prev = r.status; r.status = 'quote_sent';
    DB.addActivity(r, 'Клочко Н.', 'КП отправлено клиенту', 'КП-2026-0' + (900 + r.number) + ' v' + r.quote.version);
    DB.log('Отправка КП', 'КП-2026-0' + (900 + r.number)); DB.persist();
    U.closeOverlay(); re();
    toast('КП отправлено клиенту ' + r.client.name + '.', 'ok');
  });
  D('downloadQuoteXls', id => {
    const r = DB.req(id) || curReq();
    U.exportXls('КП-2026-0' + (900 + r.number),
      ['№','Артикул','Наименование','Бренд','Кол-во','Ед.','Цена для клиента','Сумма'],
      r.positions.map((p, i) => [i + 1, p.article || '', p.name, p.brand || '', p.qty, p.unit, p.clientPriceRub || 0, p.totalRub || 0]));
  });
  D('saveQuoteDraft', () => { const r = curReq(); r.quote = r.quote || {}; r.quote.version = (r.quote.version || 1); r.quote.status = 'draft'; DB.persist(); toast('Черновик КП сохранён.', 'ok'); });
  D('setQuoteField', (v, el) => { const r = curReq(); r.quote = r.quote || {}; r.quote[el.getAttribute('data-id')] = v; DB.persist(); });
  D('setQuoteBody', v => { const r = curReq(); r.quote = r.quote || {}; r.quote.body = v; DB.persist(); });
  D('openVersion', v => toast('Открыта версия v' + v + ' КП для просмотра.', 'info'));

  /* ---------- ИИ ---------- */
  D('aiChat', k => {
    const log = document.getElementById('aiLog');
    if (log && !log.dataset.ready) {
      log.dataset.ready = '1';
      addAi('bot', 'Здравствуйте! Я помогу с письмами, артикулами, ценами и сроками.\n\nСпросите своими словами или выберите подсказку ниже.\n\nВсе мои предложения применяются только после вашего подтверждения.');
    }
    U.overlay('dlgAi');
  });
  D('aiChip', q => { aiAsk(q); });
  D('aiSend', () => { const i = document.getElementById('aiIn'); if (i && i.value.trim()) { aiAsk(i.value.trim()); i.value = ''; } });
  function aiAsk(q) {
    addAi('me', q);
    addAi('bot', '…');
    const log = document.getElementById('aiLog');
    setTimeout(() => {
      const last = log && log.lastElementChild;
      if (last) last.textContent = U.AI.chat(q, { req: U.cur() === 'request' ? curReq() : null });
      if (log) log.scrollTop = log.scrollHeight;
    }, 420);
  }
  function addAi(cls, text) {
    const log = document.getElementById('aiLog'); if (!log) return;
    const d = document.createElement('div'); d.className = 'ai-msg ' + cls; d.textContent = text;
    log.appendChild(d); log.scrollTop = log.scrollHeight;
  }
  function aiOut(html) { const o = document.getElementById('aiOut'); if (o) o.innerHTML = '<div class="ai-out" style="margin-top:11px">' + html + '</div>'; }
  D('aiSummary', () => { const r = curReq(); const s = U.AI.summary(r); aiOut('<b>Сводка по запросу</b>\n\n' + esc(s)); toast('ИИ подготовил сводку по запросу.', 'ok'); });
  D('aiReply', () => {
    const r = curReq(); const t = U.AI.reply(r);
    mountDlg('dlgAiReply', 'ИИ: ответ клиенту',
      '<div class="ai-bar"><span class="ai-t">' + icon('sparkles', 'ic-sm') + ' Черновик от ИИ</span>' +
      '<button class="btn sm" data-act="aiEmail" data-k="formal">Формально</button>' +
      '<button class="btn sm" data-act="aiEmail" data-k="short">Короче</button>' +
      '<button class="btn sm" data-act="aiCopyText" data-k="aiReplyBody">Копировать</button></div>' +
      '<textarea class="inp" id="aiReplyBody" style="min-height:260px">' + esc(t) + '</textarea>' +
      '<div class="fhint">' + icon('shield', 'ic-sm') + ' Правьте текст прямо здесь. Отправка — после подтверждения.</div>',
      '<button class="btn" data-act="closeDlg">' + T.cancel + '</button>' +
      '<button class="btn primary" data-act="aiReplySend">' + icon('send', 'ic-sm') + ' Отправить ответ</button>');
  });
  D('aiReplySend', () => {
    const r = curReq(); const body = (document.getElementById('aiReplyBody') || {}).value || '';
    DB.addActivity(r, 'Клочко Н.', 'Ответ клиенту отправлен', 'черновик подготовлен ИИ, подтверждён менеджером');
    if (r.status === 'need_article') r.status = 'review';
    DB.log('Отправка ответа', '№ 2026-' + r.number); DB.persist(); U.closeOverlay(); re();
    toast('Ответ клиенту отправлен.', 'ok');
  });
  D('aiEmail', mode => {
    const ta = document.getElementById('aiReplyBody') || document.getElementById('arBody') ||
      document.getElementById('prBody') || document.getElementById('tplBody') ||
      document.querySelector('textarea[data-edit=setQuoteBody]');
    if (!ta) return toast('Откройте письмо, чтобы применить ИИ-правку.', 'warn');
    const out = U.AI.improve(ta.value, mode === 'formal' ? 'formal' : mode === 'short' ? 'short' : mode === 'translate' ? 'translate' : mode === 'extract' ? 'extract' : 'polite');
    if (mode === 'extract') {
      mountDlg('dlgAiExtract', 'ИИ: распознанные позиции из текста',
        '<div class="ai-out">' + esc(out) + '</div>' +
        '<div class="fhint" style="margin-top:10px">Позиции можно добавить в таблицу запроса.</div>',
        '<button class="btn" data-act="closeDlg">' + T.cancel + '</button>' +
        '<button class="btn primary" data-act="aiExtractApply">' + icon('plus', 'ic-sm') + ' ' + T.aiApply + '</button>');
      return;
    }
    ta.value = out; ta.dispatchEvent(new Event('input', { bubbles: true }));
    toast('ИИ обновил текст. Проверьте и отправьте.', 'ok');
  });
  D('aiExtractApply', () => {
    const r = curReq(); let n = 0;
    U.AI.suggestArticles(['Буферный раствор','Набор для ПЦР','Наконечники']).forEach(s => {
      r.positions.push({ id: 'p' + Date.now() + n, article: s.article, name: s.name, brand: s.brand, qty: 1,
        unit: 'шт', category: s.cat, supplierPrice: 120, supplierCurrency: 'USD', priceSource: 'pricelist',
        dutyPct: 5, confidence: 0.78, reviewed: true });
      DB.recalc(r.positions[r.positions.length - 1]); n++;
    });
    DB.addActivity(r, 'Клочко Н.', 'ИИ добавил позиции из текста', n + ' позиций'); DB.persist();
    U.closeOverlay(); re(); toast('ИИ добавил позиций: ' + n + '. Проверьте цены и артикулы.', 'ok');
  });
  D('aiSuggest', () => {
    const r = curReq();
    const noArt = r.positions.filter(p => !p.article);
    if (!noArt.length) return toast('Все позиции уже имеют артикул.', 'ok');
    const sug = U.AI.suggestArticles(noArt.map(p => p.name));
    mountDlg('dlgAiSug', 'ИИ: предложенные артикулы',
      '<div class="tscroll"><table class="tbl" style="min-width:0"><thead><tr><th>Было</th><th>Артикул</th><th>Наименование</th><th>Бренд</th></tr></thead><tbody>' +
      sug.map(s => '<tr><td class="small muted">' + esc(s.query) + '</td><td class="mono">' + esc(s.article) + '</td>' +
        '<td class="small">' + esc(s.name) + '</td><td class="small">' + esc(s.brand) + '</td></tr>').join('') +
      '</tbody></table></div><div class="fhint" style="margin-top:10px">ИИ сопоставил позиции с номенклатурой. Значения можно поправить в таблице.</div>',
      '<button class="btn" data-act="closeDlg">' + T.cancel + '</button>' +
      '<button class="btn primary" data-act="aiSuggestApply">' + icon('check', 'ic-sm') + ' ' + T.aiApply + '</button>');
  });
  D('aiSuggestApply', () => {
    const r = curReq(); const noArt = r.positions.filter(p => !p.article);
    const sug = U.AI.suggestArticles(noArt.map(p => p.name));
    noArt.forEach((p, i) => { if (sug[i]) { p.article = sug[i].article; p.brand = sug[i].brand; p.category = sug[i].cat; DB.recalc(p); } });
    DB.addActivity(r, 'Клочко Н.', 'ИИ проставил артикулы', noArt.length + ' позиций'); DB.persist();
    U.closeOverlay(); re(); toast('Артикулы проставлены: ' + noArt.length + '.', 'ok');
  });
  D('aiSupplier', lang => {
    const ta = document.getElementById('prBody') || document.getElementById('sqBody');
    if (!ta) return toast('Откройте письмо поставщику.', 'warn');
    const r = curReq();
    const items = r.positions.filter(p => p.clientPriceRub === undefined).map(p => (p.article ? p.article + ' — ' : '') + p.name + ' (' + p.qty + ' ' + p.unit + ')');
    const list = (items.length ? items : ['(все позиции имеют цену)']).join('\n');
    ta.value = lang === 'ru'
      ? 'Добрый день!\n\nПросим предоставить цены на следующие позиции:\n\n' + list + '\n\nПросьба указать срок поставки и условия оплаты.\n\nС уважением,\nотдел закупок neeklo-lab'
      : 'Dear colleagues,\n\nPlease provide a quotation for the following items:\n\n' + list + '\n\nPlease specify the delivery time and payment terms.\n\nKind regards,\nProcurement Department\nneeklo-lab';
    toast('ИИ составил письмо поставщику (' + (lang === 'ru' ? 'русский' : 'английский') + ').', 'ok');
  });
  D('aiTpl', mode => D['aiEmail'](mode));
  D('aiCopyText', id => { const el = document.getElementById(id); if (el) { el.select(); try { document.execCommand('copy'); } catch (e) {} toast('Текст скопирован в буфер обмена.', 'ok'); } });
  D('aiApply', () => { toast('Применено.', 'ok'); re(); });
  D('aiGen', () => D['aiEmail']('polite'));
  D('aiThinking', () => toast(T.aiThinking, 'info'));

  /* ---------- поставщики ---------- */
  D('openSupplier', id => { try { localStorage.setItem('kp-sup', id); } catch (e) {} v2.CSEL(id); re(); });
  D('backSuppliers', () => { v2.CSEL(null); re(); });
  D('writeSupplier', i => toast('Черновик письма поставщику создан.', 'info'));
  D('openSupplierReq', i => U.overlay('dlgSupReq'));
  D('openSupplierReqTop', () => U.overlay('dlgSupReq'));
  D('sendSupplierReq', () => {
    const to = (document.getElementById('sqTo') || {}).value || 'поставщик';
    const subj = (document.getElementById('sqSubj') || {}).value || '';
    U.exportXls('Запрос_поставщику', ['Получатель','Тема','Тело письма'],
      [[to, subj, ((document.getElementById('sqBody') || {}).value || '').slice(0, 900)]]);
    toast('Запрос поставщику отправлен: ' + to + '.', 'ok'); U.closeOverlay();
  });
  D('reqAllSuppliers', () => U.overlay('dlgSupReq'));
  D('remindSupplier', () => { toast('Напоминание отправлено поставщику.', 'ok'); toast('Статус запроса: «Напоминание отправлено».', 'ok'); });
  D('reSendSupplier', () => toast('Запрос отправлен повторно.', 'ok'));
  D('parseReply', (k, el) => {
    v2.CSEL(String(k).split('|')[0]); re();
    setTimeout(() => toast('Ответ поставщика разобран: цена, срок, условия.', 'ok'), 50);
  });
  D('acceptParsed', i => {
    const r = DB.requests[3] || DB.requests[0];
    let done = 0;
    r.positions.forEach(p => { if (p.clientPriceRub === undefined) { p.supplierPrice = p.supplierPrice || 148; p.supplierCurrency = p.supplierCurrency || 'USD'; p.priceSource = 'supplier_reply'; DB.recalc(p); done++; } });
    DB.addActivity(r, 'Клочко Н.', 'Ответ поставщика принят', done + ' позиций получили цену'); DB.persist();
    toast('Данные перенесены в позиции: ' + done + '.', 'ok'); re();
  });
  D('exportSuppliers', () => U.exportXls('Поставщики', ['Поставщик','Email','Бренды','Запросов','Время ответа','Доля отказов'],
    window.MOCK.SUPPLIERS.map((s, i) => [s[0], s[1], s[2].join(', '), 4 + (i * 7) % 14, U.num(s[3], 1), Math.round(s[4] * 100) + '%'])));
  D('newSupplier', () => toast('Форма нового поставщика — заполните контакты и бренды.', 'info'));

  /* ---------- воронка ---------- */
  D('pipeView', v => { U.F.pipe.view = v; re(); });
  D('pipeAuto', () => { U.F.pipe.view = 'waiting_supplier'; re(); toast('Показаны запросы, требующие внимания.', 'ok'); });
  D('pipeMove', id => {
    const r = DB.req(id);
    const allowed = window.MOCK.TRANSITIONS[r.status] || [];
    const body = document.getElementById('mvBody');
    if (body) body.innerHTML = '<div class="small muted" style="margin-bottom:9px">Текущий статус: ' + (window.MOCK.STATUS_MAP[r.status] || {}).label + '</div>' +
      (allowed.length ? '<div class="radio-list">' + allowed.map(a => '<label class="radio-i"><input type="radio" name="mv" value="' + a + '"> ' +
        '<span class="grow small">' + (window.MOCK.STATUS_MAP[a] || {}).label + '</span></label>').join('') + '</div>'
        : '<div class="badge b-bad">Из этого статуса переходов нет — запрос завершён</div>') +
      '<div class="fhint" style="margin-top:11px">' + icon('info', 'ic-sm') + ' Показаны только разрешённые переходы. Остальные запрещены правилами.</div>';
    const d = document.getElementById('dlgMove');
    const f = d && d.querySelector('.dlg-f');
    if (f) f.innerHTML = '<button class="btn" data-act="closeDlg">' + T.cancel + '</button>' +
      '<button class="btn primary" data-act="pipeMoveApply" data-k="' + r.id + '">' + T.confirm + '</button>';
    U.overlay('dlgMove');
  });
  D('pipeMoveApply', id => {
    const sel = document.querySelector('input[name=mv]:checked');
    if (!sel) return toast('Выберите новый статус.', 'warn');
    const r = DB.req(id), prev = r.status, next = sel.value;
    if ((window.MOCK.TRANSITIONS[prev] || []).indexOf(next) < 0) { toast(T.invalidMove + ': ' + (window.MOCK.STATUS_MAP[prev] || {}).label + ' → ' + (window.MOCK.STATUS_MAP[next] || {}).label, 'bad'); return; }
    r.status = next; DB.addActivity(r, 'Клочко Н.', 'Смена статуса', (window.MOCK.STATUS_MAP[prev] || {}).label + ' → ' + (window.MOCK.STATUS_MAP[next] || {}).label);
    DB.log('Смена статуса', '№ 2026-' + r.number); DB.persist(); U.closeOverlay(); re();
    toast('Статус изменён: ' + (window.MOCK.STATUS_MAP[next] || {}).label + '.', 'ok');
  });
  D('exportPipeline', () => U.exportXls('Воронка', ['Статус','Клиент','Сумма','Дней в статусе','Ответственный'],
    DB.requests.map(r => [(window.MOCK.STATUS_MAP[r.status] || {}).label, r.client.name, r.quoteTotalRub || 0, 1 + (r.number % 5), r.assignee.name])));

  /* drag&drop воронки */
  document.addEventListener('dragstart', e => { const c = e.target.closest('.kcard'); if (c) { c.classList.add('drag'); e.dataTransfer.setData('text/plain', c.getAttribute('data-drag')); } });
  document.addEventListener('dragend', e => { const c = e.target.closest('.kcard'); if (c) c.classList.remove('drag'); document.querySelectorAll('.kcol.over').forEach(x => x.classList.remove('over')); });
  document.addEventListener('dragover', e => { const col = e.target.closest('.kcol-b'); if (col) { e.preventDefault(); col.parentNode.classList.add('over'); } });
  document.addEventListener('dragleave', e => { const col = e.target.closest('.kcol'); if (col) col.classList.remove('over'); });
  document.addEventListener('drop', e => {
    const col = e.target.closest('.kcol-b'); if (!col) return;
    e.preventDefault(); col.parentNode.classList.remove('over');
    const id = e.dataTransfer.getData('text/plain'), next = col.getAttribute('data-drop');
    const r = DB.req(id); if (!r) return;
    if ((window.MOCK.TRANSITIONS[r.status] || []).indexOf(next) < 0) {
      toast(T.invalidMove + ': ' + (window.MOCK.STATUS_MAP[r.status] || {}).label + ' → ' + (window.MOCK.STATUS_MAP[next] || {}).label + '. ' + 'Смените статус через кнопку «Статус».', 'bad');
      return;
    }
    const prev = r.status; r.status = next;
    DB.addActivity(r, 'Клочко Н.', 'Смена статуса', (window.MOCK.STATUS_MAP[prev] || {}).label + ' → ' + (window.MOCK.STATUS_MAP[next] || {}).label);
    DB.log('Смена статуса', '№ 2026-' + r.number); DB.persist(); re();
    toast('Статус изменён: ' + (window.MOCK.STATUS_MAP[next] || {}).label + '.', 'ok');
  });

  /* ---------- календарь ---------- */
  D('calToday', () => toast('Показана текущая неделя: 21–27 сентября.', 'ok'));
  D('exportCalendar', () => U.exportXls('Календарь_сроков', ['Клиент','№','Статус','Срок','Срок_поставки_дн'],
    DB.requests.slice(0, 18).map(r => [r.client.name, '2026-' + r.number, (window.MOCK.STATUS_MAP[r.status] || {}).label, U.dOnly(r.receivedAt), 14])));

  /* ---------- прайсы ---------- */
  D('syncAll', () => { DB.pricelists.forEach(p => { p.status = 'ok'; p.syncedAt = new Date().toISOString(); }); DB.log('Синхронизация прайсов', 'все источники'); toast('Все прайсы синхронизированы.', 'ok'); re(); });
  D('syncOne', id => {
    const p = DB.pricelists.filter(x => x.id === id)[0]; if (!p) return;
    p.status = 'ok'; p.syncedAt = new Date().toISOString(); DB.log('Синхронизация прайса', p.name); re();
    setTimeout(() => { const b = document.getElementById('impBody'); if (b) b.innerHTML = importReport(p); U.overlay('dlgImport'); }, 60);
    toast('Прайс «' + p.name + '» синхронизирован.', 'ok');
  });
  D('openImportReport', id => {
    const p = DB.pricelists.filter(x => x.id === id)[0]; if (!p) return;
    const b = document.getElementById('impBody'); if (b) b.innerHTML = importReport(p);
    U.overlay('dlgImport');
  });
  function importReport(p) {
    return '<div class="kv"><dt>Прайс</dt><dd>' + esc(p.name) + '</dd><dt>Загружено строк</dt><dd>' + p.rows.toLocaleString('ru-RU') + '</dd>' +
      '<dt>Пропущено</dt><dd>' + Math.round(p.rows * 0.012) + '</dd><dt>Дата синхронизации</dt><dd>' + U.dt(p.syncedAt) + '</dd></div>' +
      '<div class="small" style="font-weight:600;margin:14px 0 7px">Причины пропуска</div>' +
      '<div class="col" style="gap:6px">' +
      ['нет артикула — ' + Math.round(p.rows * 0.007) + ' строк','некорректная цена — ' + Math.round(p.rows * 0.005) + ' строк'].map(x =>
        '<div class="row" style="gap:9px"><span style="color:var(--warn)">' + icon('alertT', 'ic-sm') + '</span><span class="small grow">' + x + '</span></div>').join('') + '</div>';
  }
  D('openMapping', () => U.overlay('dlgMapping'));
  D('setMap', () => {});
  D('saveMapping', () => { U.closeOverlay(); toast('Сопоставление колонок сохранено для прайса.', 'ok'); });
  D('openFindArticle', () => U.overlay('dlgFind'));
  D('findArticle', v => { if (v && v.length > 3) runFind(v); });
  D('runFindArticle', () => { const i = document.getElementById('faQ'); runFind(i ? i.value : 'Р-1001'); });
  function runFind(q) {
    const b = document.getElementById('faBody'); if (!b) return;
    const hits = DB.pricelists.slice(0, 3).map((p, i) => ({ p: p, price: (140 + i * 37).toFixed(2), cur: p.currency }));
    b.innerHTML = '<div class="small" style="font-weight:600;margin-bottom:8px">Найдено в ' + hits.length + ' прайсах</div>' +
      '<div class="col" style="gap:8px">' + hits.map(h => '<div class="att"><span style="color:var(--accent)">' + icon('db', 'ic-sm') + '</span>' +
        '<span class="grow"><span class="small" style="font-weight:600">' + esc(h.p.name) + '</span>' +
        '<span class="tiny muted" style="display:block">' + U.num(+h.price) + ' ' + h.cur + ' · прайс от ' + U.dOnly(h.p.syncedAt) + '</span></span>' +
        '<span class="badge b-ok">найдено</span></div>').join('') + '</div>' +
      '<div class="fhint" style="margin-top:10px">Артикул «' + esc(q) + '» найден. Цена подставляется в позицию автоматически.</div>';
  }
  D('setMatrixCat', (v, el) => { DB.log('Правка категории', 'артикул ' + el.getAttribute('data-id')); toast('Категория обновлена.', 'ok'); });

  /* ---------- правила расчёта ---------- */
  D('setDuty', (v, el) => { const i = +el.getAttribute('data-id'); DB.rules[i].duty = +v; DB.log('Изменение правила расчёта', DB.rules[i].cat + ' пошлина ' + v + '%'); });
  D('setMarkup', (v, el) => { const i = +el.getAttribute('data-id'); DB.rules[i].markup = +v; DB.log('Изменение правила расчёта', DB.rules[i].cat + ' наценка ' + v + '%'); });
  D('setRate', (v, el) => { const i = +el.getAttribute('data-id'); DB.rates[i].rate = +v; const o = document.getElementById('rate-out-' + i); if (o) o.textContent = U.num(+v) + ' ₽'; });
  D('setRateSource', v => toast('Источник курса: ' + v + '.', 'ok'));
  D('setRounding', v => toast('Округление: ' + v + '.', 'ok'));
  D('saveRules', () => { DB.log('Сохранение правил расчёта', 'категории и курсы'); toast('Правила сохранены и применятся к новым КП.', 'ok'); });
  D('exportRules', () => U.exportXls('Правила_расчёта', ['Категория','Пошлина, %','Наценка, %'], DB.rules.map(r => [r.cat, r.duty, r.markup])));
  D('runCalc', () => {
    const price = +(document.getElementById('cPrice') || {}).value || 0;
    const cur = (document.getElementById('cCur') || {}).value || 'USD';
    const cat = (document.getElementById('cCat') || {}).value || 'Реактивы';
    const qty = +(document.getElementById('cQty') || {}).value || 1;
    const rule = DB.rules.filter(r => r.cat === cat)[0] || { duty: 0, markup: 18 };
    const rate = DB.rateFor(cur);
    const afterRate = price * rate, afterDuty = afterRate * (1 + rule.duty / 100), client = afterDuty * (1 + rule.markup / 100);
    const rounded = Math.round(client / 100) * 100;
    const out = document.getElementById('calcOut');
    if (out) out.innerHTML = '<div class="card pad" style="background:var(--surface-2)"><div class="kv">' +
      '<dt>Цена поставщика</dt><dd class="mono">' + U.money2(price, cur) + '</dd>' +
      '<dt>× курс ' + cur + '</dt><dd class="mono">' + U.num(rate) + ' ₽</dd>' +
      '<dt>= в рублях</dt><dd class="mono">' + U.money(afterRate) + '</dd>' +
      '<dt>+ пошлина ' + rule.duty + '%</dt><dd class="mono">' + U.money(afterDuty) + '</dd>' +
      '<dt>+ наценка ' + rule.markup + '%</dt><dd class="mono">' + U.money(client) + '</dd>' +
      '<dt>округление до 100 ₽</dt><dd class="mono">' + U.money(rounded) + '</dd>' +
      '<dt><b>Цена для клиента</b></dt><dd class="mono" style="font-size:16px;font-weight:700">' + U.money(rounded) + '</dd>' +
      '<dt>Итого × ' + qty + '</dt><dd class="mono" style="font-weight:700">' + U.money(rounded * qty) + '</dd>' +
      '</div><div class="fhint" style="margin-top:10px">Именно этот расчёт увидит клиент на приёмке в разделе «Правила расчёта».</div></div>';
    toast('Расчёт выполнен по шагам.', 'ok');
  });

  /* ---------- шаблоны ---------- */
  D('tplPick', i => { v2.TPL(+i); re(); });
  D('tplInsert', v => { const t = document.getElementById('tplBody'); if (t) { const s = t.selectionStart; t.value = t.value.slice(0, s) + v + t.value.slice(s); t.focus(); } toast('Переменная ' + v + ' вставлена.', 'ok'); });
  D('tplSubject', v => { v2.TPLS[v2.TPL()][1] = v; toast('Тема шаблона сохранена.', 'ok'); });
  D('tplBody', v => { v2.TPLS[v2.TPL()][2] = v; });
  D('tplSave', () => { DB.log('Сохранение шаблона', v2.TPLS[v2.TPL()][0]); toast('Шаблон сохранён.', 'ok'); });
  D('tplNew', () => { v2.TPLS.push(['Новый шаблон', 'Тема', 'Текст письма']); v2.TPL(v2.TPLS.length - 1); re(); toast('Создан новый шаблон.', 'ok'); });
  D('tplPreview', () => {
    const t = v2.TPLS[v2.TPL()];
    const out = document.getElementById('tplOut');
    if (out) out.innerHTML = '<div class="kv" style="margin-bottom:10px"><dt>Кому</dt><dd>zakupki@medlab.ru</dd><dt>Тема</dt><dd>' +
      esc(subst(t[1])) + '</dd></div><div class="ai-out">' + esc(subst(t[2])) + '</div>';
    U.overlay('dlgTpl');
  });
  function subst(s) {
    const r = DB.requests[0];
    return String(s).replace('{клиент}', r.client.name).replace('{номер_КП}', 'КП-2026-0900')
      .replace('{артикулы}', r.positions.slice(0, 3).map(p => p.article || p.name).join(', '))
      .replace('{менеджер}', 'Клочко Никита').replace('{дата}', '23.09.2026')
      .replace('{сумма}', U.money(DB.totals(r).total)).replace('{срок_поставки}', '3–5 недель')
      .replace('{условия_оплаты}', '100% предоплата');
  }
  D('tplTest', () => { U.closeOverlay(); toast('Тестовое письмо отправлено на klochko@neeklo-lab.ru.', 'ok'); });
  D('tplUpload', () => toast('XLS-шаблон загружен, все обязательные поля найдены.', 'ok'));

  /* ---------- пользователи ---------- */
  D('openInvite', () => U.overlay('dlgInvite'));
  D('invite', () => U.overlay('dlgInvite'));
  D('invitesend', () => {
    const em = ((document.getElementById('invEmail') || {}).value || '').trim();
    const nm = ((document.getElementById('invName') || {}).value || '').trim() || em.split('@')[0];
    const rl = (document.getElementById('invRole') || {}).value || 'manager';
    if (!em || em.indexOf('@') < 0) { toast('Укажите корректный email.', 'bad'); return; }
    DB.users.push({ id: 'u' + Date.now(), name: nm, email: em, role: rl, lastLogin: '—', status: 'invited' });
    DB.log('Приглашение пользователя', em + ' (' + rl + ')');
    U.closeOverlay(); re();
    toast('Приглашение отправлено на ' + em + '.', 'ok');
  });
  D('userRole', id => {
    const u = DB.users.filter(x => x.id === id)[0]; if (!u) return;
    const b = document.getElementById('urBody');
    if (b) b.innerHTML = '<div class="kv"><dt>Пользователь</dt><dd>' + esc(u.name) + '</dd><dt>Email</dt><dd class="mono">' + esc(u.email) + '</dd>' +
      '<dt>Текущая роль</dt><dd>' + ({ manager: T.manager, head: T.head, admin: T.admin }[u.role] || u.role) + '</dd></div>';
    const s = document.getElementById('urSel'); if (s) s.value = u.role;
    const d = document.getElementById('dlgUserRole'); if (d) { d.dataset.uid = id; }
    U.overlay('dlgUserRole');
  });
  D('userRoleApply', () => {
    const d = document.getElementById('dlgUserRole'); const id = d && d.dataset.uid;
    const u = DB.users.filter(x => x.id === id)[0];
    const v = (document.getElementById('urSel') || {}).value || 'manager';
    if (!u) return toast('Пользователь не выбран.', 'warn');
    const prev = u.role; u.role = v; DB.log('Смена роли', u.email + ': ' + prev + ' → ' + v);
    U.closeOverlay(); re(); toast('Роль изменена: ' + ({ manager: T.manager, head: T.head, admin: T.admin }[v]) + '.', 'ok');
  });
  D('userBlock', id => {
    const u = DB.users.filter(x => x.id === id)[0]; if (!u) return;
    const blocking = u.status === 'active';
    u.status = blocking ? 'blocked' : 'active';
    DB.log(blocking ? 'Блокировка пользователя' : 'Разблокировка пользователя', u.email);
    re(); toast((blocking ? 'Пользователь заблокирован: ' : 'Пользователь разблокирован: ') + u.name + '.', blocking ? 'warn' : 'ok');
  });
  D('block', id => D['userBlock'](id));
  D('exportUsers', () => U.exportXls('Пользователи', ['Имя','Email','Роль','Последний вход','Статус'],
    DB.users.map(u => [u.name, u.email, ({ manager: T.manager, head: T.head, admin: T.admin }[u.role] || u.role), u.lastLogin, u.status])));

  /* ---------- журнал ---------- */
  D('auditUser', v => { v2.AF.user = v; re(); });
  D('auditAction', v => { v2.AF.action = v; re(); });
  D('auditPeriod', v => { v2.AF.period = v; re(); toast(v ? 'Период: ' + v + ' дн.' : 'Период: весь.', 'ok'); });
  D('auditReset', () => { v2.AF.user = v2.AF.action = v2.AF.period = ''; re(); toast('Фильтры журнала сброшены.', 'ok'); });
  D('auditOpen', obj => toast('Объект «' + obj + '» открыт из журнала.', 'info'));
  D('auditSheet', () => toast('Фильтры журнала доступны в строке фильтров сверху.', 'info'));
  D('exportAudit', () => U.exportXls('Журнал_действий', ['Время','Пользователь','Действие','Объект'], DB.audit.map(a => [a.at, a.actor, a.action, a.object])));

  /* ---------- клиенты ---------- */
  D('openClient', name => { v1.CSEL(name); re(); });
  D('backClients', () => { v1.CSEL(null); re(); });
  D('copyToClip', v => { try { navigator.clipboard.writeText(v); } catch (e) {} toast('Скопировано: ' + v, 'ok'); });
  D('newReqFor', name => {
    const n = 1000 + DB.requests.length;
    const r = { id: 'r' + Date.now(), number: n % 1000, client: { id: 'c' + Date.now(), name: name, domain: (name || '').slice(0, 6).toLowerCase() + '.ru' },
      subject: 'Новый запрос (создан вручную)', status: 'new', assignee: { id: 'm1', name: 'Клочко Н.' },
      positions: [], positionsCount: 0, minConfidence: 0.95, unread: false,
      receivedAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
      email: { from: 'zakupki@' + (name || '').slice(0, 6).toLowerCase() + '.ru', to: 'sales@neeklo-lab.ru',
        date: U.dt(new Date().toISOString()), subject: 'Новый запрос', body: 'Запрос создан вручную менеджером.', attachments: [] } };
    DB.requests.unshift(r); DB.log('Создание запроса', name); DB.persist();
    toast('Создан запрос для ' + name + '.', 'ok'); U.go('requests');
  });
  D('mergeClients', () => {
    const names = DB.clientNames(); if (names.length < 2) return toast('Дублей клиентов не найдено.', 'ok');
    mountDlg('dlgMergeCli', 'Объединение дублей клиентов',
      '<div class="fhint" style="margin-bottom:10px">Показаны пары с похожими названиями. Объединение перенесёт запросы на основную карточку.</div>' +
      '<div class="radio-list"><label class="radio-i on"><input type="radio" name="mcli" checked style="accent-color:var(--accent)"> ' +
      '<span class="grow"><b class="small">' + esc(names[0]) + '</b><div class="tiny muted">основная карточка · ' + DB.requests.filter(r => r.client.name === names[0]).length + ' запросов</div></span></label>' +
      '<label class="radio-i"><input type="radio" name="mcli" style="accent-color:var(--accent)"> ' +
      '<span class="grow"><b class="small">' + esc(names[1]) + '</b><div class="tiny muted">будет присоединена · ' + DB.requests.filter(r => r.client.name === names[1]).length + ' запросов</div></span></label></div>',
      '<button class="btn" data-act="closeDlg">' + T.cancel + '</button>' +
      '<button class="btn primary" data-act="mergeClientsApply">' + icon('merge', 'ic-sm') + ' Объединить</button>');
  });
  D('mergeClientsApply', () => {
    const names = DB.clientNames();
    const to = names[0], from = names[1];
    DB.requests.forEach(r => { if (r.client.name === from) { r.client.name = to; DB.addActivity(r, 'Клочко Н.', 'Клиент объединён', from + ' → ' + to); } });
    DB.log('Объединение клиентов', from + ' → ' + to); DB.persist(); U.closeOverlay(); re();
    toast('Клиенты объединены: ' + from + ' → ' + to + '.', 'ok');
  });
  D('exportClients', () => {
    const by = {};
    DB.requests.forEach(r => { by[r.client.name] = by[r.client.name] || { d: r.client.domain, n: 0, s: 0, w: 0, l: '' };
      by[r.client.name].n++; if (r.quoteTotalRub) by[r.client.name].s++; if (r.status === 'won') by[r.client.name].w++;
      if (r.receivedAt > by[r.client.name].l) by[r.client.name].l = r.receivedAt; });
    U.exportXls('Клиенты', ['Клиент','Домен','Запросов','КП отправлено','Выиграно','Последний контакт'],
      Object.keys(by).map(k => [k, by[k].d, by[k].n, by[k].s, by[k].w, U.dt(by[k].l)]));
  });
  D('clientStat', name => toast('Статистика клиента — в разделе «Аналитика».', 'info'));

  /* ---------- спецификации ---------- */
  D('specStep', n => { U.F.spec.step = +n; re(); toast('Шаг ' + n + ' из 3.', 'info'); });
  D('specBack', () => { U.F.spec.step = Math.max(1, U.F.spec.step - 1); re(); });
  D('specNew', () => { U.F.spec.step = 1; re(); toast('Мастер спецификации открыт на шаге 1.', 'ok'); });
  D('specUpload', () => { U.F.spec.step = 2; re(); toast('PO разобран: позиции загружены в свод.', 'ok'); });
  D('specPickMail', id => { const r = DB.req(id); U.F.spec.step = 2; re(); toast('Выбрано письмо: ' + (r ? r.client.name : '') + '. Позиции в своде.', 'ok'); });
  D('specPickPrice', k => toast(k === 'low' ? 'Выбрана меньшая цена.' : 'Выбрана большая цена. Расхождение отмечено.', 'ok'));
  D('specAiCheck', () => { const p = document.querySelectorAll('.low').length; toast('ИИ проверил свод: расхождений ' + p + ', критичных нет.', 'ok'); });
  D('specSend', () => { const n = 'СП-2026-' + (44 + DB.specs.length); DB.specs.unshift({ id: 'sp' + Date.now(), number: n, client: DB.requests[0].client.name, date: U.dOnly(new Date().toISOString()), positions: 5, status: 'sent', version: 1 }); DB.log('Отправка спецификации', n); re(); toast('Спецификация ' + n + ' отправлена клиенту.', 'ok'); });
  D('specExport', () => U.exportXls('Спецификация', ['Артикул','Наименование','Кол-во','Ед.','Цена','Сумма'],
    DB.requests[0].positions.map((p, i) => [p.article || '', p.name, p.qty, p.unit, p.clientPriceRub || 0, p.totalRub || 0])));
  D('specPrint', () => { toast('Документ отправлен на печать.', 'ok'); try { window.print(); } catch (e) {} });
  D('specView', id => {
    const s = DB.specs.filter(x => x.id === id)[0]; if (!s) return;
    const b = document.getElementById('specBody'), t = document.getElementById('specTitle');
    if (t) t.textContent = 'Спецификация ' + s.number;
    if (b) b.innerHTML = '<div class="kv"><dt>Клиент</dt><dd>' + esc(s.client) + '</dd><dt>Дата</dt><dd>' + esc(s.date) + '</dd>' +
      '<dt>Позиций</dt><dd>' + s.positions + '</dd><dt>Версия</dt><dd>v' + s.version + '</dd>' +
      '<dt>Статус</dt><dd>' + (s.status === 'sent' ? 'Отправлена' : 'Черновик') + '</dd></div>' +
      '<div class="ai-out" style="margin-top:12px">Факсимиле подписи и печати применяются при экспорте в XLS.</div>';
    U.overlay('dlgSpec');
  });
  D('specVer', id => {
    const s = DB.specs.filter(x => x.id === id)[0]; if (!s) return;
    toast('Версии ' + s.number + ': v1 — текущая.', 'info');
  });
  D('exportSpecs', () => U.exportXls('Спецификации', ['Номер','Клиент','Дата','Позиций','Версия','Статус'],
    DB.specs.map(s => [s.number, s.client, s.date, s.positions, 'v' + s.version, s.status])));
  D('specOpenNew', () => D['specNew']());

  /* ---------- аналитика ---------- */
  D('anPeriod', v => { v3.ANPER(v); re(); toast('Период обновлён.', 'ok'); });
  D('anManager', v => { v3.ANMGR(v); re(); toast(v ? 'Фильтр: ' + v : 'Все менеджеры.', 'ok'); });
  D('exportAnalytics', () => U.exportXls('Аналитика', ['Клиент','Запросов','Сумма КП'],
    (function () { const c = {}; DB.requests.forEach(r => { c[r.client.name] = c[r.client.name] || { n: 0, s: 0 }; c[r.client.name].n++; c[r.client.name].s += r.quoteTotalRub || 0; });
      return Object.keys(c).map(k => [k, c[k].n, c[k].s]); })()));
  D('chartOpen', () => toast('График открыт в полном размере.', 'info'));

  /* ---------- рассылки ---------- */
  D('newsOpen', id => {
    const n = DB.newsletters.filter(x => x.id === id)[0]; if (!n) return;
    const t = document.getElementById('newsTitle'), b = document.getElementById('newsBody');
    if (t) t.textContent = n.subject;
    if (b) b.innerHTML = '<div class="row wrap" style="gap:8px;margin-bottom:12px">' +
      '<span class="badge ' + (n.status === 'sent' ? 'b-ok' : 'b-warn') + '">' + (n.status === 'sent' ? 'Отправлена' : 'В очереди') + '</span>' +
      '<span class="badge b-neutral">' + n.total + ' получателей</span>' +
      '<span class="badge b-ok">' + n.sent + ' отправлено</span>' +
      (n.errors ? '<span class="badge b-bad">' + n.errors + ' ошибок</span>' : '') + '</div>' +
      '<div class="small" style="font-weight:600;margin-bottom:6px">' + T.previewMail + '</div>' +
      '<div class="mail"><div class="mail-h"><div class="h3">' + esc(n.subject) + '</div>' +
      '<div class="mail-meta">news@neeklo-lab.ru → 340 получателей · ' + esc(n.date) + '</div></div>' +
      '<div class="mail-body">Добрый день!\n\nОбновляем информацию по поступлению и ценам.\n\nПолный список позиций — во вложении.\n\nС уважением,\nneeklo-lab</div></div>' +
      '<div class="small" style="font-weight:600;margin:14px 0 7px">Получатели (первые 6)</div>' +
      '<div class="col" style="gap:5px">' + window.MOCK.CLIENTS.slice(0, 6).map(c =>
        '<div class="row" style="gap:9px"><span class="grow small mono">zakupki@' + esc(c[1]) + '</span>' +
        '<span class="badge ' + (n.status === 'sent' ? 'b-ok' : 'b-neutral') + '">' + (n.status === 'sent' ? 'доставлено' : 'в очереди') + '</span></div>').join('') +
      '</div>';
    U.overlay('dlgNews');
  });
  D('newsPause', id => {
    const list = DB.newsletters.filter(n => n.status === 'queued');
    const q = (id && DB.newsletters.filter(n => n.id === id)[0]) || list[0];
    if (q && q.status === 'queued') { q.status = 'paused'; DB.log('Пауза рассылки', q.subject); re(); toast('Рассылка «' + q.subject + '» на паузе.', 'ok'); }
    else toast('Активной очереди нет.', 'info');
  });
  D('newsCancel', id => {
    const pool = DB.newsletters.filter(n => n.status === 'queued' || n.status === 'paused');
    const q = (id && DB.newsletters.filter(n => n.id === id)[0]) || pool[0];
    if (q && (q.status === 'queued' || q.status === 'paused')) {
      q.status = 'cancelled'; DB.log('Отмена рассылки', q.subject); re();
      toast('Рассылка «' + q.subject + '» отменена. Отправка остановлена.', 'warn');
    } else toast('Нечего отменять.', 'info');
  });
  D('newsSend', id => {
    const q = (id && DB.newsletters.filter(n => n.id === id)[0]) || DB.newsletters.filter(n => n.status === 'queued' || n.status === 'paused')[0];
    if (!q) return toast('Очереди нет.', 'info');
    q.status = 'sent'; q.sent = q.total; q.errors = q.errors || 0;
    DB.log('Отправка рассылки', q.subject); U.closeOverlay(); re();
    toast('Рассылка «' + q.subject + '» отправлена: ' + q.sent + ' из ' + q.total + '.', 'ok');
  });
  D('newsImport', () => toast('Файл получателей загружен: 340 адресов.', 'ok'));
  D('newsNew', () => {
    mountDlg('dlgNewsNew', 'Новая рассылка',
      '<div class="field"><label>Тема</label><input class="inp" id="nnSubj" placeholder="NEWS: ..."></div>' +
      '<div class="field"><label>Текст</label><textarea class="inp" id="nnBody" style="min-height:170px">Добрый день!\n\nОбновляем информацию по поступлению и ценам.\n\nС уважением,\nneeklo-lab</textarea></div>' +
      '<div class="field"><label>Получатели</label><input class="inp" value="340 адресов из файла recipients.xlsx" readonly></div>' +
      '<div class="ai-bar" style="margin-bottom:0"><span class="ai-t">' + icon('sparkles', 'ic-sm') + ' ИИ</span>' +
      '<button class="btn sm" data-act="aiEmail" data-k="polite">Улучшить текст</button></div>',
      '<button class="btn" data-act="closeDlg">' + T.cancel + '</button>' +
      '<button class="btn primary" data-act="newsCreate">' + icon('plus', 'ic-sm') + ' Создать и поставить в очередь</button>');
  });
  D('newsCreate', () => {
    const s = ((document.getElementById('nnSubj') || {}).value || 'NEWS: новая рассылка');
    DB.newsletters.unshift({ id: 'nl' + Date.now(), subject: s, date: U.dOnly(new Date().toISOString()), total: 340, sent: 0, errors: 0, status: 'queued' });
    DB.log('Создание рассылки', s); U.closeOverlay(); re(); toast('Рассылка создана и поставлена в очередь.', 'ok');
  });

  /* ---------- подключения ---------- */
  D('checkConn', id => {
    const c = DB.connections.filter(x => x.id === id)[0]; if (!c) return;
    c.status = 'connected'; c.checkedAt = U.dt(new Date().toISOString());
    DB.log('Проверка подключения', c.name); re(); toast('Подключение «' + c.name + '»: работает.', 'ok');
  });
  D('checkAllConn', () => { DB.connections.forEach(c => { c.status = 'connected'; c.checkedAt = U.dt(new Date().toISOString()); }); DB.log('Проверка подключений', 'все'); re(); toast('Все подключения проверены. Ошибок нет.', 'ok'); });

  /* ---------- вход / профиль ---------- */
  D('doLogin', () => {
    const em = ((document.getElementById('lgEmail') || {}).value || '').trim();
    const pw = ((document.getElementById('lgPass') || {}).value || '');
    if (!em || em.indexOf('@') < 0) return toast('Введите корректный email.', 'bad');
    if (pw.length < 4) return toast('Пароль слишком короткий.', 'bad');
    U.S.authed = true; U.saveState(); toast('Вы вошли в систему как ' + ({ manager: T.manager, head: T.head, admin: T.admin }[U.S.role]) + '.', 'ok');
    U.go('today');
  });
  D('forgotPass', () => toast('Ссылка восстановления пароля отправлена на ' + ((document.getElementById('lgEmail') || {}).value || 'ваш email') + '.', 'ok'));
  D('openStand', () => toast('Стенды: ' + Object.keys(U.ROUTES).slice(0, 6).join(', ') + ' — переключаются из меню слева.', 'info'));
  D('hotNext', d => {
    const rows = Array.prototype.slice.call(document.querySelectorAll('[data-act=openReq]'));
    if (rows.length < 2) return;
    const cur = document.querySelector('[data-act=openReq].cur-i');
    let i = cur ? rows.indexOf(cur) + d : (d > 0 ? 0 : rows.length - 1);
    i = Math.max(0, Math.min(rows.length - 1, i));
    rows.forEach(r => r.classList.remove('cur-i'));
    rows[i].classList.add('cur-i'); rows[i].scrollIntoView({ block: 'center' });
    rows[i].style.outline = '2px solid var(--accent)'; setTimeout(() => rows[i].style.outline = '', 900);
  });
  D('hotConfirm', () => { if (U.isOpen('dlgSend')) D['confirmSend'](); else toast('Горячая клавиша работает в диалоге подтверждения отправки.', 'info'); });
  D('openVersionHistory', () => toast('История версий КП — в правой колонке вкладки «КП».', 'info'));
  D('help', () => toast('Подсказки: / — поиск, J/K — навигация, Ctrl+Enter — подтвердить отправку.', 'info'));

  /* ---------- глобальный поиск: рендер ---------- */
  document.addEventListener('input', function (e) {
    if (e.target.closest('#gSearch')) { sq = e.target.value.trim(); renderSearch(); }
    const el = e.target.closest('[data-edit]'); if (el && el.hasAttribute('data-k') && el.getAttribute('data-edit') === 'findArticle') { if (el.value.length > 3) runFind(el.value); }
  }, false);
  function renderSearch() {
    let r = document.getElementById('sres');
    if (!sq) { if (r) r.remove(); return; }
    const q = sq.toLowerCase();
    const reqs = DB.requests.filter(x => String(x.number).indexOf(q) >= 0 || x.client.name.toLowerCase().indexOf(q) >= 0 || x.subject.toLowerCase().indexOf(q) >= 0).slice(0, 5);
    const arts = [];
    DB.requests.forEach(x => (x.positions || []).forEach(p => { if ((p.article || '').toLowerCase().indexOf(q) >= 0 || p.name.toLowerCase().indexOf(q) >= 0) arts.push({ a: p.article, n: p.name, r: x }); }));
    const uniq = [], seen = {};
    arts.forEach(a => { const k = a.a + a.n; if (!seen[k] && uniq.length < 4) { seen[k] = 1; uniq.push(a); } });
    const cli = DB.clientNames().filter(c => c.toLowerCase().indexOf(q) >= 0).slice(0, 3);
    const sup = window.MOCK.SUPPLIERS.filter(s => s[0].toLowerCase().indexOf(q) >= 0).slice(0, 3);
    sres = [];
    let html = '';
    if (reqs.length) {
      html += '<div class="sres-sec">Запросы</div>';
      reqs.forEach(x => { const i = sres.length; sres.push({ fn: () => { U.go('requests'); location.hash = '#/request/' + x.id; } });
        html += '<button class="sres-i" data-act="sresPick" data-k="' + i + '">' + icon('inbox', 'ic-sm') +
          '<span class="grow"><span class="t">№ 2026-' + x.number + ' · ' + esc(x.client.name) + '</span>' +
          '<span class="s" style="display:block">' + esc(x.subject) + '</span></span>' + U.statusBadge(x.status) + '</button>'; });
    }
    if (uniq.length) {
      html += '<div class="sres-sec">Артикулы</div>';
      uniq.forEach(a => { const i = sres.length; sres.push({ fn: () => { U.go('requests'); location.hash = '#/request/' + a.r.id; } });
        html += '<button class="sres-i" data-act="sresPick" data-k="' + i + '">' + icon('tag', 'ic-sm') +
          '<span class="grow"><span class="t mono">' + esc(a.a || '—') + '</span><span class="s" style="display:block">' + esc(a.n) + '</span></span></button>'; });
    }
    if (cli.length) {
      html += '<div class="sres-sec">Клиенты</div>';
      cli.forEach(c => { const i = sres.length; sres.push({ fn: () => { v1.CSEL(c); U.go('clients'); } });
        html += '<button class="sres-i" data-act="sresPick" data-k="' + i + '">' + icon('building', 'ic-sm') +
          '<span class="grow"><span class="t">' + esc(c) + '</span></span></button>'; });
    }
    if (sup.length) {
      html += '<div class="sres-sec">Поставщики</div>';
      sup.forEach((s, k) => { const i = sres.length; sres.push({ fn: () => { v2.CSEL('s' + window.MOCK.SUPPLIERS.indexOf(s)); U.go('suppliers'); } });
        html += '<button class="sres-i" data-act="sresPick" data-k="' + i + '">' + icon('truck', 'ic-sm') +
          '<span class="grow"><span class="t">' + esc(s[0]) + '</span><span class="s" style="display:block">' + esc(s[1]) + '</span></span></button>'; });
    }
    if (!html) html = '<div class="sres-empty">' + T.nothingFound + ' по запросу «' + esc(sq) + '»<br><span class="tiny">Попробуйте номер запроса, клиента, артикул или поставщика</span></div>';
    else html += '<div style="padding:6px"><button class="btn sm wide" data-act="searchAll">Показать все запросы</button></div>';
    if (!r) { r = document.createElement('div'); r.className = 'sres'; r.id = 'sres'; const s = document.getElementById('gSearch'); if (s) s.appendChild(r); }
    r.innerHTML = html;
  }
  U.renderSearch = renderSearch;

  /* ---------- hotkeys ---------- */
  document.addEventListener('keydown', function (e) {
    if (e.target.closest('#gSearch')) {
      const items = document.querySelectorAll('#sres [data-act=sresPick]');
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); scur = Math.max(-1, Math.min(items.length - 1, scur + (e.key === 'ArrowDown' ? 1 : -1))); items.forEach((x, i) => x.classList.toggle('on-cursor', i === scur)); return; }
      if (e.key === 'Enter') { const el = items[scur >= 0 ? scur : 0]; if (el) { e.preventDefault(); U.ACT['sresPick'](el.getAttribute('data-k')); } return; }
    }
  }, true);
})();
