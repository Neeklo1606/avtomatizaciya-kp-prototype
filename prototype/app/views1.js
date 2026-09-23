/* Экраны 1: Сегодня, Входящие запросы, Карточка запроса, Клиенты, Профиль. */
(function () {
  'use strict';
  const U = window.UI, T = U.T, DB = U.DB, esc = U.esc, icon = U.icon;
  const R = U.RENDERERS, define = U.define, toast = U.toast;

  /* локальное состояние списков */
  const F = {
    requests: { status: '', assignee: '', client: '', period: '', action: false, low: false, sort: 'date', dir: -1, page: 1,
      per: 12, cols: { number: 1, receivedAt: 1, client: 1, subject: 1, positionsCount: 1, minConfidence: 1, quoteTotalRub: 1, status: 1, assignee: 1, updatedAt: 0 },
      sel: {}, q: '', exp: {} },
    spec: { step: 1 }, pipe: { view: 'all' }
  };
  U.F = F;

  /* ============================================================ СЕГОДНЯ */
  function todayView() {
    const c = DB.counts(), R2 = DB.requests;
    const queue = R2.filter(r => r.status === 'review' || r.status === 'need_article').slice(0, 8);
    const waiting = R2.filter(r => r.status === 'waiting_supplier' || r.status === 'waiting_client');
    const low = R2.filter(r => r.minConfidence < 0.7);
    const sentToday = R2.filter(r => r.quoteTotalRub && r.receivedAt.indexOf('2026-09-23') === 0).length;
    return '<div class="content">' +
      head('Сегодня', 'Вторник, 23 сентября 2026 · 10:24 МСК',
        '<button class="btn primary" data-act="go" data-k="requests">' + icon('inbox', 'ic-sm') + ' К запросам</button>' +
        '<button class="btn" data-act="aiChat" data-k="top">' + icon('sparkles', 'ic-sm') + ' Спросить ИИ</button>') +

      '<div class="grid rv" style="grid-template-columns:repeat(auto-fit,minmax(210px,1fr));margin-bottom:16px">' +
        stat('На проверке', c.review, 'warn', 'Перейти к проверке', 'requests') +
        stat('Нужен артикул', c.needArticle, 'bad', 'Уточнить у клиентов', 'requests') +
        stat('Ждём поставщика', c.supplier, 'info', 'Открыть поставщиков', 'suppliers') +
        stat('КП отправлено', c.quoteSent, 'ok', 'Смотреть воронку', 'pipeline') +
      '</div>' +

      (low.length ? '<div class="card pad rv" style="border-color:var(--bad);margin-bottom:16px">' +
        '<div class="row-t"><span style="color:var(--bad)">' + icon('alertT') + '</span><div class="grow">' +
        '<div class="h3">Низкая уверенность распознавания</div>' +
        '<div class="small muted" style="margin-top:3px">' + low.length + ' запросов требуют ручной проверки позиций: ' +
        low.slice(0, 4).map(r => esc(r.client.name)).join(', ') + (low.length > 4 ? ' и другие' : '') + '.</div>' +
        '<button class="btn sm" style="margin-top:10px" data-act="filterLowConf">' + icon('filter', 'ic-sm') + ' Показать их</button>' +
        '</div></div></div>' : '') +

      '<div class="col rv" style="gap:16px">' +
        card('Очередь на проверку', queue.length ? 'Свежие запросы, которые ждут вашего решения' : '',
          '<button class="btn sm" data-act="go" data-k="requests">Все запросы</button>',
          queue.length ? '<div class="tscroll"><table class="tbl" style="min-width:760px"><thead><tr>' +
            '<th>№</th><th>Клиент</th><th>Позиций</th><th>Уверенность</th><th>Статус</th><th class="act">Действие</th>' +
            '</tr></thead><tbody>' + queue.map(r =>
              '<tr><td class="mono">2026-' + r.number + '</td>' +
              '<td><b>' + esc(r.client.name) + '</b><div class="tiny muted">' + esc(r.subject) + '</div></td>' +
              '<td class="num">' + r.positionsCount + '</td>' +
              '<td>' + U.confBadge(r.minConfidence) + '</td>' +
              '<td>' + U.statusBadge(r.status) + '</td>' +
              '<td class="act"><button class="btn sm primary" data-act="openReq" data-k="' + r.id + '">Проверить</button></td></tr>').join('') +
            '</tbody></table></div>' +
            '<div class="mcards">' + queue.map(mcard).join('') + '</div>'
          : '<div class="empty"><span class="ei">' + icon('checkCircle') + '</span><h3>' + T.allDone + '</h3><p>' + T.allDoneD + '</p></div>') +

        card('Ожидание', waiting.length + ' запросов ждут поставщика или клиента',
          '<button class="btn sm" data-act="go" data-k="pipeline">Воронка</button>',
          '<div class="col" style="gap:9px">' + waiting.slice(0, 6).map(r =>
            '<div class="row" style="border-bottom:1px solid var(--line);padding-bottom:9px">' +
            '<div class="grow"><div class="small" style="font-weight:600">' + esc(r.client.name) + '</div>' +
            '<div class="tiny muted">' + esc(r.subject) + '</div></div>' +
            U.statusBadge(r.status) +
            '<button class="btn sm" data-act="openReq" data-k="' + r.id + '">' + icon('arrowRight', 'ic-sm') + '</button></div>').join('') +
          '</div>') +

        card('Мини-статистика дня', '', '',
          '<div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(150px,1fr))">' +
          '<div><div class="tiny muted">Получено запросов</div><div class="h1" style="font-size:22px">' + c.newToday + '</div></div>' +
          '<div><div class="tiny muted">Отправлено КП</div><div class="h1" style="font-size:22px">' + sentToday + '</div></div>' +
          '<div><div class="tiny muted">Среднее время обработки</div><div class="h1" style="font-size:22px">38 мин</div></div>' +
          '<div><div class="tiny muted">Непрочитанных писем</div><div class="h1" style="font-size:22px">' + c.unread + '</div></div>' +
          '</div>' +
          '<div class="fhint" style="margin-top:12px">' + icon('help', 'ic-sm') + ' Быстрые клавиши: <b>/</b> — поиск, <b>J</b>/<b>K</b> — следующий и предыдущий запрос, <b>Ctrl+Enter</b> — подтвердить отправку.</div>') +
      '</div>';
  }
  function stat(k, v, tone, hint, route) {
    return '<button class="stat link ' + tone + ' rv" data-act="go" data-k="' + route + '">' +
      '<span class="k">' + k + '</span><span class="v">' + v + '</span>' +
      '<span class="tiny muted">' + esc(hint) + ' ' + icon('arrowRight', 'ic-sm') + '</span></button>';
  }
  function mcard(r) {
    return '<button class="mcard" data-act="openReq" data-k="' + r.id + '">' +
      '<div class="mc-top"><div><div class="mc-t">' + esc(r.client.name) + '</div>' +
      '<div class="mc-s">' + esc(r.subject) + '</div></div>' + U.statusBadge(r.status) + '</div>' +
      '<div class="mc-row"><span>№ <b class="mono">2026-' + r.number + '</b></span>' +
      '<span>Позиций <b>' + r.positionsCount + '</b></span>' +
      '<span>Уверенность <b>' + U.num(r.minConfidence) + '</b></span>' +
      (r.quoteTotalRub ? '<span>Сумма <b>' + U.money(r.quoteTotalRub) + '</b></span>' : '') + '</div></button>';
  }
  function card(title, sub, actions, body) {
    return '<div class="card"><div class="card-h"><div class="grow">' +
      '<div class="h2">' + esc(title) + '</div>' + (sub ? '<div class="tiny muted" style="margin-top:2px">' + esc(sub) + '</div>' : '') +
      '</div>' + (actions || '') + '</div>' + (body ? '<div class="card-b" style="padding:0">' + body + '</div>' : '') + '</div>';
  }
  function head(title, sub, actions) {
    return '<div class="page-head"><div><div class="h1">' + esc(title) + '</div>' +
      (sub ? '<div class="small muted" style="margin-top:4px">' + esc(sub) + '</div>' : '') + '</div>' +
      (actions ? '<div class="page-actions">' + actions + '</div>' : '') + '</div>';
  }
  R.today = todayView;

  /* ============================================================ ВХОДЯЩИЕ ЗАПРОСЫ */
  /* подсветка совпадений поиска в тексте ячейки */
  function hi(text, q) {
    const t = String(text === undefined || text === null ? '' : text);
    if (!q) return esc(t);
    const i = t.toLowerCase().indexOf(String(q).toLowerCase());
    if (i < 0) return esc(t);
    return esc(t.slice(0, i)) + '<mark class="hit">' + esc(t.slice(i, i + String(q).length)) + '</mark>' + esc(t.slice(i + String(q).length));
  }
  function fRows() {
    const f = F.requests; let rows = DB.requests.slice();
    if (f.status) rows = rows.filter(r => r.status === f.status);
    if (f.assignee) rows = rows.filter(r => r.assignee.name === f.assignee);
    if (f.client) rows = rows.filter(r => r.client.name === f.client);
    if (f.action) rows = rows.filter(r => ['review','need_article','waiting_supplier'].indexOf(r.status) >= 0);
    if (f.low) rows = rows.filter(r => r.minConfidence < 0.7);
    if (f.period) { const days = +f.period, ref = new Date('2026-09-23T23:59:59'); rows = rows.filter(r => (ref - new Date(r.receivedAt)) / 86400000 <= days); }
    if (f.q) {
      const q = f.q.toLowerCase();
      rows = rows.filter(r => {
        const inPos = (r.positions || []).some(pp => (pp.article || '').toLowerCase().indexOf(q) >= 0 || (pp.name || '').toLowerCase().indexOf(q) >= 0 || (pp.brand || '').toLowerCase().indexOf(q) >= 0);
        const inSup = (r.positions || []).some(pp => (pp.supplier || '').toLowerCase().indexOf(q) >= 0);
        return ('2026-' + r.number).indexOf(q) >= 0 || String(r.number).indexOf(q) >= 0 ||
          (r.client.name || '').toLowerCase().indexOf(q) >= 0 || (r.client.domain || '').toLowerCase().indexOf(q) >= 0 ||
          (r.subject || '').toLowerCase().indexOf(q) >= 0 || (r.email && r.email.subject || '').toLowerCase().indexOf(q) >= 0 ||
          (r.assignee.name || '').toLowerCase().indexOf(q) >= 0 || inPos || inSup;
      });
    }
    const s = f.sort, d = f.dir;
    rows.sort((a, b) => {
      let x, y;
      if (s === 'sum') { x = a.quoteTotalRub || 0; y = b.quoteTotalRub || 0; }
      else if (s === 'client') { x = a.client.name; y = b.client.name; }
      else if (s === 'status') { x = a.status; y = b.status; }
      else { x = a.receivedAt; y = b.receivedAt; }
      return (x > y ? 1 : x < y ? -1 : 0) * d;
    });
    return rows;
  }
  function activeFilterCount(f) {
    return [f.status, f.assignee, f.client, f.period, f.q].filter(Boolean).length + (f.action ? 1 : 0) + (f.low ? 1 : 0);
  }
  function presetsBar() {
    const list = loadPresets();
    return '<div class="toolbar" style="gap:8px;flex-wrap:wrap">' +
      '<span class="small muted">' + icon('book', 'ic-sm') + ' ' + T.presets + ':</span>' +
      (list.length ? list.map((p, i) => '<button class="chip" data-act="applyPreset" data-k="' + i + '" title="' + esc(p.name) + '">' + esc(p.name) + ' <span data-act="delPreset" data-k="' + i + '" class="x" role="button" aria-label="Удалить представление">×</span></button>').join('')
        : '<span class="tiny muted">Пока нет сохранённых представлений.</span>') +
      '<button class="btn sm" data-act="savePreset">' + icon('plus', 'ic-sm') + ' ' + T.presetSave + '</button>' +
      '</div>';
  }
  function loadPresets() { try { return JSON.parse(localStorage.getItem('kp-presets-v1') || '[]'); } catch (e) { return []; } }
  R.__loadPresets = loadPresets;

  function requestsView() {
    const f = F.requests, rows = fRows();
    const pages = Math.max(1, Math.ceil(rows.length / f.per));
    if (f.page > pages) f.page = pages;
    const page = rows.slice((f.page - 1) * f.per, f.page * f.per);
    const selCount = Object.keys(f.sel).filter(k => f.sel[k]).length;
    const NUMCOL = { positionsCount:1, minConfidence:1, quoteTotalRub:1 };
    const CICON = {
      number:'hash', receivedAt:'calendar', client:'users', subject:'mail', positionsCount:'grid',
      minConfidence:'percent', quoteTotalRub:'calc', status:'activity', assignee:'user', updatedAt:'history'
    };
    const C = [
      ['number','№'],['receivedAt','Дата'],['client','Клиент'],['subject','Тема'],['positionsCount','Позиций'],
      ['minConfidence','Уверенность'],['quoteTotalRub','Сумма КП'],['status','Статус'],['assignee','Ответственный'],['updatedAt','Обновлено']
    ].filter(c => f.cols[c[0]]).map(c => [c[0], (CICON[c[0]] ? icon(CICON[c[0]], 'ic-sm') + ' ' : '') + c[1]]);

    const afc = activeFilterCount(f);
    return '<div class="content">' +
      head('Входящие запросы', rows.length + ' запросов по текущему фильтру' + (afc ? ' · ' + T.activeFilters + ': ' + afc : ''),
        '<button class="btn" data-act="resetFilters"' + (afc ? '' : ' disabled') + '>' + icon('rotate', 'ic-sm') + ' Сбросить</button>' +
        '<button class="btn" data-act="exportRequests">' + icon('download', 'ic-sm') + ' ' + T.exportXls + '</button>' +
        '<button class="btn" data-act="openCols">' + icon('cols', 'ic-sm') + ' Колонки</button>') +

      '<div class="tw rv">' +
        '<div class="toolbar"><div class="gsearch">' + icon('search', 'ic-sm') +
          '<input type="search" value="' + esc(f.q) + '" data-act-input="tqSet" placeholder="' + esc(T.inTable) + '" aria-label="' + esc(T.inTable) + '">' +
          (f.q ? '<button class="ibtn" data-act="tqClear" aria-label="Очистить поиск">' + icon('x', 'ic-sm') + '</button>' : '') +
        '</div>' +
        '<span class="tiny muted hide-sm">' + icon('info', 'ic-sm') + ' ' + T.inlineHint + '</span>' +
        '<div class="grow"></div>' +
          '<div class="filters desk">' +
            sel('fStatus', 'Статус: все', [['','Статус: все']].concat(window.MOCK.STATUS.map(s => [s[0], s[1]])), f.status, 'fStatusSet') +
            sel('fAssignee', 'Ответственный: все', [['','Ответственный: все']].concat(window.MOCK.MANAGERS.map(m => [m[1], m[1]])), f.assignee, 'fAssigneeSet') +
            sel('fClient', 'Клиент: все', [['','Клиент: все']].concat(DB.clientNames().map(c => [c, c])), f.client, 'fClientSet') +
            sel('fPeriod', 'Период: весь', [['','Период: весь'],['7','7 дней'],['30','30 дней'],['90','90 дней']], f.period, 'fPeriodSet') +
            '<button class="chip' + (f.action ? ' on' : '') + '" data-act="toggleAction" aria-pressed="' + !!f.action + '">' + icon('alertT', 'ic-sm') + ' ' + T.onlyAction + '</button>' +
            '<button class="chip' + (f.low ? ' on' : '') + '" data-act="toggleLowConf" aria-pressed="' + !!f.low + '">' + icon('percent', 'ic-sm') + ' ' + T.lowConf + '</button>' +
          '</div>' +
          '<button class="btn sheet-btn" data-act="openFilterSheet">' + icon('filter', 'ic-sm') + ' ' + T.filters + '</button>' +
          '<div class="grow"></div>' +
          '<div class="seg" role="group" aria-label="Сортировка">' +
            '<button class="' + (f.sort === 'date' ? 'on' : '') + '" data-act="sortBy" data-k="date">' + T.sortDate + '</button>' +
            '<button class="' + (f.sort === 'sum' ? 'on' : '') + '" data-act="sortBy" data-k="sum">' + T.sortSum + '</button>' +
            '<button class="' + (f.sort === 'status' ? 'on' : '') + '" data-act="sortBy" data-k="status">' + T.sortStatus + '</button>' +
            '<button data-act="sortDir">' + (f.dir < 0 ? icon('arrowDown', 'ic-sm') : icon('arrowUp', 'ic-sm')) + '</button>' +
          '</div>' +
        '</div>' +

        presetsBar() +

        (selCount ? '<div class="toolbar" style="background:var(--accent-soft);border-bottom-color:var(--accent)">' +
          '<b class="small">' + T.selected + ': ' + selCount + '</b>' +
          '<button class="btn sm" data-act="bulkAssign">' + icon('userPlus', 'ic-sm') + ' ' + T.assign + '</button>' +
          '<button class="btn sm" data-act="bulkClose">' + icon('archive', 'ic-sm') + ' ' + T.closeReq + '</button>' +
          '<button class="btn sm ghost" data-act="bulkClear">' + icon('x', 'ic-sm') + ' ' + T.reset + '</button>' +
          '</div>' : '') +

        '<div class="tscroll desk"><table class="tbl"><thead><tr>' +
          '<th style="width:38px"><input type="checkbox" data-act-change="selectAll" aria-label="Выбрать все" style="accent-color:var(--accent);width:16px;height:16px"' + (page.length && page.every(r => f.sel[r.id]) ? ' checked' : '') + '></th>' +
          C.map(c => '<th class="sortable' + (NUMCOL[c[0]] ? ' num' : '') + (f.sort === mapSort(c[0]) ? ' on' : '') + '" data-act="sortBy" data-k="' + mapSort(c[0]) + '">' + c[1] +
            '<span class="ar">' + (f.dir < 0 ? '▼' : '▲') + '</span></th>').join('') +
          '<th class="act"></th></tr></thead><tbody>' +
          page.map(r => {
            const exp = !!f.exp[r.id];
            return '<tr class="' + (r.minConfidence < 0.7 ? 'low' : '') + (f.sel[r.id] ? ' sel' : '') + (exp ? ' exp' : '') + '">' +
            '<td><input type="checkbox" data-act-change="toggleSel" data-id="' + r.id + '"' + (f.sel[r.id] ? ' checked' : '') + ' aria-label="Выбрать строку" style="accent-color:var(--accent);width:16px;height:16px"></td>' +
            (f.cols.number ? '<td class="mono nowrap">' + (r.unread ? '<span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:var(--accent);margin-right:6px"></span>' : '') + '2026-' + hi(r.number, f.q) + '</td>' : '') +
            (f.cols.receivedAt ? '<td class="nowrap small">' + U.dt(r.receivedAt) + '</td>' : '') +
            (f.cols.client ? '<td><b>' + hi(r.client.name, f.q) + '</b><span class="tiny muted"> · ' + hi(r.client.domain, f.q) + '</span></td>' : '') +
            (f.cols.subject ? '<td><div class="ellip" style="max-width:280px" title="' + esc(r.subject) + '">' + hi(r.subject, f.q) + '</div></td>' : '') +
            (f.cols.positionsCount ? '<td class="num"><button class="lnk" data-act="toggleRow" data-k="' + r.id + '" title="' + esc(exp ? T.collapsePos : T.expandPos) + '">' + r.positionsCount + (exp ? ' ▾' : ' ▸') + '</button></td>' : '') +
            (f.cols.minConfidence ? '<td class="num">' + U.confBadge(r.minConfidence) + '</td>' : '') +
            (f.cols.quoteTotalRub ? '<td class="money">' + (r.quoteTotalRub ? U.money(r.quoteTotalRub) : '<span class="muted">—</span>') + '</td>' : '') +
            (f.cols.status ? '<td class="cell-edit">' + inlineSel('statusInline', r.id, window.MOCK.STATUS, r.status, 'st', 'badge-sel st-' + ((window.MOCK.STATUS_MAP[r.status] || {}).tone || 'neutral')) + '</td>' : '') +
            (f.cols.assignee ? '<td class="cell-edit">' + inlineSel('assigneeInline', r.id, window.MOCK.MANAGERS.map(m => [m[1], m[1]]), r.assignee.name, 'asg') + '</td>' : '') +
            (f.cols.updatedAt ? '<td class="small nowrap">' + U.dt(r.updatedAt) + '</td>' : '') +
            '<td class="act"><button class="btn sm" data-act="toggleRow" data-k="' + r.id + '" aria-label="' + esc(exp ? T.collapsePos : T.expandPos) + '">' + icon(exp ? 'chevD' : 'chevR', 'ic-sm') + '</button>' +
              '<button class="btn sm primary" data-act="openReq" data-k="' + r.id + '">' + T.open + '</button></td>' +
            '</tr>' + (exp ? expandRow(r) : '');
          }).join('') +
          '</tbody></table></div>' +

        '<div class="mcards">' + page.map(mcard).join('') + '</div>' +

        (page.length ? '' : '<div class="empty"><span class="ei">' + icon('search') + '</span><h3>' + T.nothingFound + '</h3><p>' + T.nothingFoundD + '</p>' +
          '<button class="btn primary" data-act="resetFilters">' + T.reset + ' фильтры</button></div>') +

        '<div class="pager"><span class="small muted">' + rows.length + ' ' + T.found + ' · стр. ' + f.page + ' ' + T.of + ' ' + pages + '</span>' +
        '<div class="row">' +
        '<select class="sel" data-act-change="perPage" aria-label="Записей на странице" style="min-height:34px">' +
          [12,25,50].map(n => '<option value="' + n + '"' + (f.per === n ? ' selected' : '') + '>' + n + ' ' + T.perPage + '</option>').join('') + '</select>' +
        '<div class="pg-btns">' +
          '<button class="pg" data-act="pager" data-k="prev"' + (f.page <= 1 ? ' disabled' : '') + '>' + icon('chevL', 'ic-sm') + '</button>' +
          range(1, pages).map(p => '<button class="pg' + (p === f.page ? ' on' : '') + '" data-act="pager" data-k="' + p + '">' + p + '</button>').join('') +
          '<button class="pg" data-act="pager" data-k="next"' + (f.page >= pages ? ' disabled' : '') + '>' + icon('chevR', 'ic-sm') + '</button>' +
        '</div></div></div>' +
      '</div>' +
      colsDialog() + filterSheet();
  }
  const mapSort = k => k === 'receivedAt' ? 'date' : k === 'quoteTotalRub' ? 'sum' : k === 'client' ? 'client' : k === 'status' ? 'status' : 'date';
  function range(a, b) { const o = []; for (let i = a; i <= Math.min(b, a + 4); i++) o.push(i); return o; }
  /* инлайн-выбор в ячейке строки: работает без ухода со страницы */
  function inlineSel(act, rid, opts, val, kind, extra) {
    return '<select class="cell-sel' + (extra ? ' ' + extra : '') + '" data-act-change="' + act + '" data-id="' + rid + '" data-kind="' + kind + '" aria-label="' + esc(act) + '">' +
      opts.map(o => '<option value="' + esc(o[0]) + '"' + (String(val) === String(o[0]) ? ' selected' : '') + '>' + esc(o[1]) + '</option>').join('') +
      '</select>';
  }
  /* быстрый просмотр позиций прямо в таблице */
  function expandRow(r) {
    const C = [['number','№'],['receivedAt','Дата'],['client','Клиент'],['subject','Тема'],['positionsCount','Позиций'],
      ['minConfidence','Уверенность'],['quoteTotalRub','Сумма КП'],['status','Статус'],['assignee','Ответственный'],['updatedAt','Обновлено']];
    const colspan = C.filter(c => F.requests.cols[c[0]]).length + 2;
    const total = r.positions.reduce((a, p) => a + (p.totalRub || 0), 0);
    return '<tr class="subrow"><td></td><td colspan="' + colspan + '">' +
      '<div class="subwrap">' +
        '<div class="row" style="gap:8px;flex-wrap:wrap;margin-bottom:8px">' +
          '<span class="badge b-info">Позиций: ' + r.positions.length + '</span>' +
          '<span class="badge b-neutral">Нет артикула: ' + r.positions.filter(p => !p.article).length + '</span>' +
          '<span class="badge b-warn">Нет цены: ' + r.positions.filter(p => p.clientPriceRub === undefined).length + '</span>' +
          '<span class="badge b-ok">Сумма: ' + U.money(total) + '</span>' +
        '</div>' +
        '<div class="tscroll"><table class="tbl sub"><thead><tr>' +
          '<th>' + icon('tag','ic-sm') + ' Артикул</th><th>' + icon('file','ic-sm') + ' Наименование</th>' +
          '<th>' + icon('grid','ic-sm') + ' Бренд</th><th>' + icon('hash','ic-sm') + ' Кол-во</th>' +
          '<th>' + icon('calc','ic-sm') + ' Цена поставщика</th>' +
          '<th>' + icon('check','ic-sm') + ' Цена клиенту' +
          '<span class="tiny muted" title="Пошлина 5% включена в цену клиенту"> +5%</span></th>' +
          '<th>' + icon('chart','ic-sm') + ' Сумма</th>' +
          '<th class="act"></th></tr></thead><tbody>' +
        r.positions.map(p => {
          const noArt = !p.article, noPr = p.clientPriceRub === undefined;
          return '<tr' + (p.confidence < 0.7 ? ' class="low"' : '') + '>' +
            '<td class="edit"><input class="cell-in' + (noArt ? ' err' : '') + '" data-edit="setPosArticle" data-id="' + r.id + '|' + p.id + '" value="' + esc(p.article) + '" placeholder="нет" aria-label="Артикул"></td>' +
            '<td class="edit"><input class="cell-in" data-edit="setPosName" data-id="' + r.id + '|' + p.id + '" value="' + esc(p.name) + '" aria-label="Наименование"></td>' +
            '<td class="edit"><input class="cell-in" data-edit="setPosBrand" data-id="' + r.id + '|' + p.id + '" value="' + esc(p.brand || '') + '" aria-label="Бренд"></td>' +
            '<td><input class="cell-in mono" type="number" min="1" data-edit="setPosQty" data-id="' + r.id + '|' + p.id + '" value="' + p.qty + '" aria-label="Количество"></td>' +
            '<td><input class="cell-in mono" type="number" step="0.01" data-edit="setPosPrice" data-id="' + r.id + '|' + p.id + '" value="' + (p.supplierPrice === undefined ? '' : p.supplierPrice) + '" placeholder="—" aria-label="Цена поставщика"></td>' +
            '<td class="num">' + (noPr ? '<span class="badge b-bad">нет цены</span>' : U.money(p.clientPriceRub)) + '</td>' +
            '<td class="num">' + (p.totalRub === undefined ? '—' : U.money(p.totalRub)) + '</td>' +
            '<td class="act"><div class="row" style="gap:3px">' +
              (noPr ? '<button class="ibtn" title="Запросить цену у поставщика" data-act="reqPrice" data-k="' + r.id + '|' + p.id + '" style="width:30px;height:30px">' + icon('truck','ic-sm') + '</button>' : '') +
              '<button class="ibtn" title="Удалить позицию" data-act="delPos" data-k="' + r.id + '|' + p.id + '" style="width:30px;height:30px;color:var(--bad)">' + icon('trash','ic-sm') + '</button>' +
            '</div></td></tr>';
        }).join('') +
        '</tbody></table></div>' +
        '<div class="row" style="gap:8px;margin-top:8px">' +
          '<button class="btn sm" data-act="addPos" data-k="' + r.id + '">' + icon('plus','ic-sm') + ' Добавить позицию</button>' +
          '<button class="btn sm" data-act="mergePos" data-k="' + r.id + '"' + (r.positions.length < 2 ? ' disabled' : '') + '>' + icon('merge','ic-sm') + ' Объединить дубли</button>' +
          '<span class="tiny muted">' + icon('info','ic-sm') + ' Правки сохраняются автоматически, цена клиенту пересчитывается с пошлиной</span>' +
        '</div>' +
        '<div class="row" style="gap:8px;margin-top:10px">' +
          '<button class="btn sm primary" data-act="openReq" data-k="' + r.id + '">' + icon('edit', 'ic-sm') + ' Открыть и доработать</button>' +
          '<button class="btn sm" data-act="reqArticleAll" data-k="' + r.id + '">' + icon('at', 'ic-sm') + ' Запросить артикулы</button>' +
          '<button class="btn sm" data-act="reqAllPrices" data-k="' + r.id + '">' + icon('truck', 'ic-sm') + ' Запросить цены</button>' +
          '<button class="btn sm" data-act="assignInline" data-k="' + r.id + '">' + icon('userPlus', 'ic-sm') + ' Назначить</button>' +
        '</div>' +
      '</div></td></tr>';
  }
  function sel(id, ph, opts, val, act) {
    return '<select class="sel" id="' + id + '" data-act-change="' + act + '" aria-label="' + esc(ph) + '">' +
      opts.map(o => '<option value="' + esc(o[0]) + '"' + (String(val) === String(o[0]) ? ' selected' : '') + '>' + esc(o[1]) + '</option>').join('') + '</select>';
  }
  function colsDialog() {
    const c = F.requests.cols;
    return '<div class="dlg" id="dlgCols" role="dialog" aria-modal="true" aria-label="Колонки таблицы">' +
      '<div class="dlg-h"><b class="h2">Колонки таблицы</b><div class="grow"></div>' +
      '<button class="ibtn" data-act="closeDlg" data-k="dlgCols" aria-label="' + T.close + '">' + icon('x') + '</button></div>' +
      '<div class="dlg-b"><div class="radio-list">' + Object.keys(c).map(k =>
        '<label class="radio-i' + (c[k] ? ' on' : '') + '"><input type="checkbox" data-act-change="toggleCol" data-id="' + k + '"' + (c[k] ? ' checked' : '') + '> ' + labelCol(k) + '</label>').join('') +
      '</div></div>' +
      '<div class="dlg-f"><button class="btn" data-act="closeDlg" data-k="dlgCols">' + T.close + '</button>' +
      '<button class="btn primary" data-act="closeDlg" data-k="dlgCols">' + T.save + '</button></div></div>';
  }
  const labelCol = k => ({ number: T.number, receivedAt: T.received, client: T.client, subject: T.subject, positionsCount: T.positions,
    minConfidence: T.confidence, quoteTotalRub: T.sum, status: T.status, assignee: T.assignee, updatedAt: T.updated })[k] || k;
  function filterSheet() {
    return '<div class="sheet" id="shFilters" role="dialog" aria-modal="true" aria-label="Фильтры">' +
      '<div class="sheet-h"><div class="h2">' + T.filters + '</div><div class="grow"></div>' +
      '<button class="ibtn" data-act="closeSheet" data-k="shFilters" aria-label="' + T.close + '">' + icon('x') + '</button></div>' +
      '<div class="sheet-b"><div class="field"><label>Статус</label>' +
      '<select class="inp" data-act-change="fStatusSet"><option value="">Все статусы</option>' +
      window.MOCK.STATUS.map(s => '<option value="' + s[0] + '"' + (F.requests.status === s[0] ? ' selected' : '') + '>' + esc(s[1]) + '</option>').join('') + '</select></div>' +
      '<div class="field"><label>Ответственный</label><select class="inp" data-act-change="fAssigneeSet"><option value="">Все</option>' +
      window.MOCK.MANAGERS.map(m => '<option value="' + m[1] + '"' + (F.requests.assignee === m[1] ? ' selected' : '') + '>' + esc(m[1]) + '</option>').join('') + '</select></div>' +
      '<div class="field"><label>Клиент</label><select class="inp" data-act-change="fClientSet"><option value="">Все</option>' +
      DB.clientNames().map(c => '<option value="' + esc(c) + '"' + (F.requests.client === c ? ' selected' : '') + '>' + esc(c) + '</option>').join('') + '</select></div>' +
      '<label class="switch" style="margin-top:6px"><input type="checkbox" data-act-change="toggleAction"' + (F.requests.action ? ' checked' : '') + '><span class="tr"></span><span class="small">' + T.onlyAction + '</span></label>' +
      '<label class="switch" style="margin-top:8px"><input type="checkbox" data-act-change="toggleLowConf"' + (F.requests.low ? ' checked' : '') + '><span class="tr"></span><span class="small">' + T.lowConf + '</span></label>' +
      '</div><div class="sheet-f"><button class="btn grow" data-act="resetFilters">' + T.reset + '</button>' +
      '<button class="btn primary grow" data-act="closeSheet" data-k="shFilters">Применить</button></div></div>';
  }
  R.requests = requestsView;

  /* ============================================================ КАРТОЧКА ЗАПРОСА */
  R.request = function () {
    const id = location.hash.replace(/^#\/?/, '').split('/')[1];
    const r = DB.req(id) || DB.requests[0];
    if (!r) return '<div class="content">' + T.nothingFound + '</div>';
    const tot = DB.totals(r);
    const unchecked = r.positions.filter(p => !p.reviewed).length;
    const missingArt = r.positions.filter(p => !p.article).length;
    const missingPrice = r.positions.filter(p => p.clientPriceRub === undefined).length;
    const hasQuote = r.status === 'quote_sent' || r.status === 'waiting_client' || r.status === 'invoice_requested' || r.status === 'won';
    const mainAct = unchecked ? { t: T.checkPos + ' (' + unchecked + ')', dis: true }
      : missingPrice ? { t: 'Запросить ' + missingPrice + ' цен', dis: false, act: 'reqAllPrices' }
      : hasQuote ? { t: T.previewSend, dis: false, act: 'openQuote' }
      : { t: T.formQuote, dis: false, act: 'openQuote' };

    return '<div class="content">' +
      '<div class="row wrap" style="margin-bottom:12px">' +
        '<button class="btn" data-act="go" data-k="requests">' + icon('arrowLeft', 'ic-sm') + ' ' + T.back + '</button>' +
        '<span class="crumb">' + esc(r.client.name) + ' · получено ' + U.dt(r.receivedAt) + '</span>' +
      '</div>' +

      '<div class="card pad rv" style="margin-bottom:14px">' +
        '<div class="row wrap" style="gap:14px">' +
          '<div class="grow"><div class="h1">Запрос № 2026-' + r.number + '</div>' +
          '<div class="row wrap" style="margin-top:7px">' + U.statusBadge(r.status) +
          '<span class="small muted">' + esc(r.client.name) + '</span>' +
          '<span class="small muted">·</span><span class="small muted">' + esc(r.subject) + '</span></div></div>' +
          '<div class="row"><button class="btn sm" data-act="openAssign">' + icon('userPlus', 'ic-sm') + ' ' + T.assign + '</button>' +
          '<button class="btn sm" data-act="closeRequest" data-k="' + r.id + '">' + icon('archive', 'ic-sm') + ' ' + T.closeReq + '</button>' +
          '<button class="btn sm" data-act="aiChat" data-k="' + r.id + '">' + icon('sparkles', 'ic-sm') + ' ИИ</button></div>' +
        '</div>' +
        '<div class="tabs" style="margin-top:12px">' +
          tab('email', T.email) + tab('positions', T.recognized + ' (' + r.positions.length + ')') +
          tab('quote', T.quote) + tab('history', T.history) +
        '</div>' +
      '</div>' +

      body(r, tot, unchecked, missingArt, missingPrice, mainAct) +
      dlgAssign(r) + dlgQuote(r, tot) + dlgSend() + dlgAi(r) + dlgDup();
  };
  let CTAB = 'positions';
  function tab(k, label) { return '<button class="tab' + (CTAB === k ? ' on' : '') + '" data-act="cardTab" data-k="' + k + '">' + esc(label) + '</button>'; }
  function body(r, tot, unchecked, missingArt, missingPrice, mainAct) {
    if (CTAB === 'email') return emailZone(r);
    if (CTAB === 'quote') return quoteZone(r, tot);
    if (CTAB === 'history') return historyZone(r);
    return posZone(r, tot, unchecked, missingArt, missingPrice, mainAct);
  }

  /* --- письмо --- */
  function emailZone(r) {
    const marks = r.positions.filter(p => p.article).map(p => p.article);
    const isDraft = !!r.email.work;
    let txt = esc(isDraft ? r.email.work : r.email.body);
    marks.forEach(a => { txt = txt.replace(new RegExp('(' + a + ')', 'g'), '<mark data-act="posFromMail" data-k="' + a + '">$1</mark>'); });
    return '<div class="grid rv" style="grid-template-columns:minmax(0,2fr) minmax(280px,1fr)">' +
      '<div class="mail"><div class="mail-h"><div class="row" style="gap:8px;flex-wrap:wrap">' +
          '<div class="h3 grow">' + esc(r.email.subject) + '</div>' +
          (isDraft ? '<span class="badge b-info">' + T.mailDraft + '</span>' : '<span class="badge b-neutral">Оригинал</span>') +
        '</div>' +
        '<div class="mail-meta" style="margin-top:6px">' + icon('mail', 'ic-sm') + ' ' + esc(r.email.from) + ' → ' + esc(r.email.to) +
        '<span>·</span><span>' + esc(r.email.date) + '</span></div>' +
        '<div class="toolbar" style="margin:10px -14px 0;border-top:1px solid var(--line);border-bottom:0;flex-wrap:wrap">' +
          '<button class="btn sm" data-act="mailEdit" data-k="' + r.id + '">' + icon('edit', 'ic-sm') + ' Редактировать текст</button>' +
          '<button class="btn sm primary" data-act="openAiMail" data-k="' + r.id + '">' + icon('wand', 'ic-sm') + ' ' + T.aiEditMail + '</button>' +
          '<button class="btn sm" data-act="mailDraftSave" data-k="' + r.id + '">' + icon('check', 'ic-sm') + ' ' + T.mailDraft + '</button>' +
          (isDraft ? '<button class="btn sm" data-act="mailResetWork" data-k="' + r.id + '">' + icon('rotate', 'ic-sm') + ' К оригиналу</button>' : '') +
          '<div class="grow"></div>' +
          '<button class="btn sm" data-act="openRawMail" data-k="' + r.id + '">' + icon('mail', 'ic-sm') + ' ' + T.rawMail + '</button>' +
        '</div>' +
        '</div>' +
        '<div class="mail-body">' + txt + '</div>' +
        '<div style="padding:0 14px 14px">' +
          (r.__imgs ? '<div class="blocked-img">' + icon('image', 'ic-sm') + ' Изображения загружены. </div>'
            : '<div class="blocked-img">' + icon('lock', 'ic-sm') + ' Внешние изображения заблокированы. ' +
              '<button class="btn sm" data-act="showImages">Показать изображения</button></div>') +
          '<div class="small muted" style="margin:12px 0 4px">Вложения (' + r.email.attachments.length + ')</div>' +
          r.email.attachments.map(a => '<button class="att" data-act="openAtt" data-k="' + esc(a.name) + '">' +
            '<span style="color:var(--accent)">' + icon(a.type === 'pdf' ? 'file' : 'grid', 'ic-sm') + '</span>' +
            '<span class="grow"><span class="small" style="font-weight:600">' + esc(a.name) + '</span>' +
            '<span class="tiny muted"> · ' + esc(a.size) + '</span></span>' + icon('download', 'ic-sm') + '</button>').join('') +
        '</div></div>' +
      '<div class="col">' + aiBar(r, 'email') +
        '<div class="card pad"><div class="h3">Подсветка распознанных позиций</div>' +
        '<div class="fhint" style="margin-top:6px">Фрагменты, из которых распознаны позиции, подсвечены в письме. Нажмите на подсветку — откроется строка в таблице позиций.</div>' +
        '<div class="col" style="gap:6px;margin-top:10px">' +
        (marks.length ? marks.map(a => '<button class="btn sm" style="justify-content:flex-start" data-act="posFromMail" data-k="' + a + '">' + icon('tag', 'ic-sm') + ' ' + esc(a) + '</button>').join('')
          : '<span class="small muted">Артикулы не распознаны — нужен ручной ввод или запрос клиенту.</span>') +
        '</div></div>' +
        '<div class="card pad"><div class="h3">Действия по письму</div><div class="col" style="gap:8px;margin-top:10px">' +
        '<button class="btn" data-act="aiReply">' + icon('wand', 'ic-sm') + ' ' + T.aiReply + '</button>' +
        '<button class="btn" data-act="aiSummary">' + icon('activity', 'ic-sm') + ' ' + T.aiSummary + '</button>' +
        '<button class="btn" data-act="reqArticleAll">' + icon('at', 'ic-sm') + ' Запросить артикулы (' + r.positions.filter(p => !p.article).length + ')</button>' +
        '<button class="btn" data-act="reqAllPrices">' + icon('truck', 'ic-sm') + ' Запросить цены (' + r.positions.filter(p => p.clientPriceRub === undefined).length + ')</button>' +
        '</div></div>' +
      '</div></div>';
  }

  /* --- позиции --- */
  function posZone(r, tot, unchecked, missingArt, missingPrice, mainAct) {
    return '<div class="grid rv" style="grid-template-columns:minmax(0,1fr) 320px">' +
      '<div class="tw"><div class="toolbar">' +
        '<span class="small muted">Правки сохраняются автоматически, с индикатором «' + T.saved + '»</span>' +
        '<div class="grow"></div>' +
        '<button class="btn sm" data-act="addPos" data-k="' + r.id + '">' + icon('plus', 'ic-sm') + ' ' + T.addPos + '</button>' +
        '<button class="btn sm" data-act="mergePos" data-k="' + r.id + '"' + (r.positions.length < 2 ? ' disabled' : '') + '>' + icon('merge', 'ic-sm') + ' ' + T.mergeDup + '</button>' +
      '</div>' +
      '<div class="tscroll"><table class="tbl" style="min-width:1180px"><thead><tr>' +
        '<th style="width:58px">' + T.article + '</th><th style="min-width:230px">' + T.name + '</th><th>Бренд</th>' +
        '<th style="width:76px">' + T.qty + '</th><th style="width:70px">' + T.unit + '</th><th>' + T.category + '</th>' +
        '<th>' + T.supPrice + '</th><th>' + T.source + '</th><th>' + T.duty + '</th><th>' + T.clientPrice + '</th>' +
        '<th>' + T.amount + '</th><th>' + T.conf + '</th><th class="act"></th></tr></thead><tbody>' +
        r.positions.map((p, i) => {
          const low = p.confidence < 0.7, noArt = !p.article, noPr = p.clientPriceRub === undefined;
          return '<tr class="' + (low ? 'low' : '') + '" id="row-' + p.id + '">' +
            '<td class="edit"><input class="cell-in' + (noArt ? ' err' : '') + '" data-edit="setPosArticle" data-id="' + r.id + '|' + p.id + '" value="' + esc(p.article) + '" placeholder="нет" aria-label="' + T.article + '"></td>' +
            '<td class="edit"><input class="cell-in" data-edit="setPosName" data-id="' + r.id + '|' + p.id + '" value="' + esc(p.name) + '" aria-label="' + T.name + '"></td>' +
            '<td class="edit"><input class="cell-in" data-edit="setPosBrand" data-id="' + r.id + '|' + p.id + '" value="' + esc(p.brand) + '" aria-label="' + T.brand + '"></td>' +
            '<td><input class="cell-in mono" type="number" min="1" data-edit="setPosQty" data-id="' + r.id + '|' + p.id + '" value="' + p.qty + '" aria-label="' + T.qty + '"></td>' +
            '<td class="edit"><select class="cell-sel" data-act-change="setPosUnit" data-id="' + r.id + '|' + p.id + '" aria-label="' + T.unit + '">' +
              window.MOCK.UNITS.map(u => '<option' + (u === p.unit ? ' selected' : '') + '>' + u + '</option>').join('') + '</select></td>' +
            '<td class="edit"><select class="cell-sel" data-act-change="setPosCat" data-id="' + r.id + '|' + p.id + '" aria-label="' + T.category + '">' +
              window.MOCK.CATS.map(c => '<option' + (c === p.category ? ' selected' : '') + '>' + c + '</option>').join('') + '</select></td>' +
            '<td><input class="cell-in mono" type="number" step="0.01" data-edit="setPosPrice" data-id="' + r.id + '|' + p.id + '" value="' + (p.supplierPrice === undefined ? '' : p.supplierPrice) + '" placeholder="—" aria-label="' + T.supPrice + '"></td>' +
            '<td class="small nowrap">' + srcLabel(p.priceSource) + '</td>' +
            '<td class="num">' + (noPr ? '<span class="badge b-bad">' + T.needPrice + '</span>' : U.money(p.clientPriceRub)) + '</td>' +
            '<td class="num">' + (p.totalRub === undefined ? '—' : U.money(p.totalRub)) + '</td>' +
            '<td>' + U.confBadge(p.confidence) + '</td>' +
            '<td class="act"><div class="row" style="gap:3px">' +
              (noArt ? '<button class="ibtn" title="' + T.requestClient + '" data-act="reqArticle" data-k="' + r.id + '|' + p.id + '" style="width:32px;height:32px">' + icon('at', 'ic-sm') + '</button>' : '') +
              (noPr ? '<button class="ibtn" title="' + T.requestSupplier + '" data-act="reqPrice" data-k="' + r.id + '|' + p.id + '" style="width:32px;height:32px">' + icon('truck', 'ic-sm') + '</button>' : '') +
              '<label class="ibtn" title="Проверено" style="width:32px;height:32px;cursor:pointer">' +
                '<input type="checkbox" data-act-change="toggleReviewed" data-id="' + r.id + '|' + p.id + '"' + (p.reviewed ? ' checked' : '') + ' style="accent-color:var(--accent);width:15px;height:15px" aria-label="Позиция проверена">' +
              '</label>' +
              '<button class="ibtn" title="' + T.del + '" data-act="delPos" data-k="' + r.id + '|' + p.id + '" style="width:32px;height:32px;color:var(--bad)">' + icon('trash', 'ic-sm') + '</button>' +
            '</div><span data-flag></span></td></tr>';
        }).join('') +
        '</tbody></table></div>' +
        '<div class="pager"><span class="small muted">' + r.positions.length + ' позиций · проверено ' + (r.positions.length - unchecked) + ' из ' + r.positions.length + '</span>' +
        '<span class="row" style="gap:10px">' +
          '<span class="tiny muted">Не проверено</span><b>' + unchecked + '</b>' +
          (missingArt ? '<span class="badge b-bad">без артикула ' + missingArt + '</span>' : '') +
          (missingPrice ? '<span class="badge b-warn">без цены ' + missingPrice + '</span>' : '') +
        '</span></div>' +
      '</div>' +

      /* правая колонка: итоги и действия */
      '<div class="col" style="gap:14px">' +
        aiBar(r, 'positions') +
        '<div class="card"><div class="card-h"><div class="h3">Итоги расчёта</div></div>' +
        '<div class="card-b"><div class="kv">' +
          '<dt>' + T.totalNet + '</dt><dd class="mono">' + U.money(tot.net) + '</dd>' +
          '<dt>' + T.totalDuty + '</dt><dd class="mono">' + U.money(tot.duty) + '</dd>' +
          '<dt><b>' + T.total + '</b></dt><dd class="mono" style="font-size:18px;font-weight:700">' + U.money(tot.total) + '</dd>' +
          '<dt>' + T.rate + '</dt><dd class="mono small">' + DB.rates.map(x => x.code + ' ' + U.num(x.rate)).join(' · ') + '</dd>' +
          '<dt>Округление</dt><dd class="small">до 100 ₽</dd>' +
        '</div>' +
        (tot.missingPrice ? '<div class="badge b-warn" style="margin-top:11px">' + T.needPrice + ': ' + tot.missingPrice + ' поз.</div>' : '') +
        '<button class="btn primary wide" style="margin-top:13px" data-act="' + (mainAct.act || 'noop') + '" data-k="' + r.id + '"' +
          (mainAct.dis ? ' disabled' : '') + '>' + icon(mainAct.act === 'openQuote' ? 'file' : 'truck', 'ic-sm') + ' ' + esc(mainAct.t) + '</button>' +
        '<div class="fhint" style="margin-top:8px">' + T.confirmSendD + '</div>' +
        '</div></div>' +
        '<div class="card"><div class="card-h"><div class="h3">' + T.history + '</div></div>' +
        '<div class="card-b"><div class="timeline">' + events(r).slice(0, 8).map(ev =>
          '<div class="tl-i"><span class="tl-d ' + (ev.actor === 'Система' ? 'sys' : 'me') + '"></span>' +
          '<div class="grow"><div class="tl-t">' + esc(ev.action) + '</div>' +
          '<div class="tl-s">' + esc(ev.actor) + ' · ' + esc(ev.at) + (ev.details ? ' · ' + esc(ev.details) : '') + '</div></div></div>').join('') +
        '</div></div></div>' +
      '</div></div>';
  }
  const srcLabel = s => s === 'pricelist' ? 'Прайс' : s === 'supplier_reply' ? 'Ответ поставщика' : s === 'manual' ? 'Вручную' : '—';

  /* --- КП --- */
  function quoteZone(r, tot) {
    const q = r.quote || {};
    const v = q.version || 1;
    return '<div class="grid rv" style="grid-template-columns:minmax(0,1.5fr) minmax(300px,1fr)">' +
      '<div class="card"><div class="card-h"><div class="h3">Предпросмотр КП · XLS-шаблон клиента</div>' +
        '<div class="grow"></div><span class="badge b-info">' + T.version + ' v' + v + '</span></div>' +
        '<div class="card-b" style="padding:0">' +
        '<div class="tscroll"><table class="tbl" style="min-width:760px"><thead><tr>' +
        '<th>№</th><th>Артикул</th><th>Наименование</th><th>Кол-во</th><th>Ед.</th><th>' + T.clientPrice + '</th><th>' + T.amount + '</th></tr></thead><tbody>' +
        r.positions.map((p, i) => '<tr><td class="mono">' + (i + 1) + '</td><td class="mono">' + esc(p.article || '—') + '</td>' +
          '<td>' + esc(p.name) + '</td><td class="num">' + p.qty + '</td><td>' + esc(p.unit) + '</td>' +
          '<td class="num">' + U.money(p.clientPriceRub) + '</td><td class="num">' + U.money(p.totalRub) + '</td></tr>').join('') +
        '</tbody></table></div>' +
        '<div class="card-b"><div class="row sp" style="font-size:16px;font-weight:700"><span>' + T.total + '</span><span class="mono">' + U.money(tot.total) + '</span></div>' +
        '<div class="fhint" style="margin-top:6px">Пошлина ' + (r.positions[0] ? r.positions[0].dutyPct : 5) + '% включена в цену для клиента. Валюты поставщиков пересчитаны по курсу ЦБ с надбавкой.</div></div>' +
        '</div></div>' +
      '<div class="col" style="gap:14px">' +
        '<div class="card"><div class="card-h"><div class="h3">Реквизиты КП</div></div><div class="card-b">' +
          field('Номер КП', 'quoteNumber', 'КП-2026-0' + (900 + r.number)) +
          field('Дата', 'quoteDate', '23.09.2026') +
          field('Срок действия', 'quoteValid', '14 дней') +
          field('Условия поставки', 'quoteTerms', '3–5 недель с момента оплаты') +
          field('Условия оплаты', 'quotePay', '100% предоплата') +
        '</div></div>' +
        '<div class="card"><div class="card-h"><div class="h3">Письмо клиенту</div></div><div class="card-b">' +
          field('Кому', 'mailTo', r.email.from) +
          field('Копия', 'mailCc', 'sales@neeklo-lab.ru') +
          field('Тема', 'mailSubject', 'КП-2026-0' + (900 + r.number) + ' — ' + r.client.name) +
          '<div class="field"><label>Текст</label><textarea class="inp" data-edit="setQuoteBody" style="min-height:130px">' +
          esc('Добрый день!\n\nНаправляем коммерческое предложение по вашему запросу.\nВложение: КП в формате XLS.\n\nС уважением,\nneeklo-lab') + '</textarea></div>' +
          '<div class="ai-bar"><span class="ai-t">' + icon('sparkles', 'ic-sm') + ' ИИ</span>' +
          '<button class="btn sm" data-act="aiEmail" data-k="polite">Вежливее</button>' +
          '<button class="btn sm" data-act="aiEmail" data-k="short">Короче</button>' +
          '<button class="btn sm" data-act="aiEmail" data-k="formal">Формально</button></div>' +
          '<div class="col" style="gap:8px">' +
          '<button class="btn primary wide" data-act="openSend" data-k="' + r.id + '">' + icon('send', 'ic-sm') + ' ' + T.sendClient + '</button>' +
          '<div class="row" style="gap:8px"><button class="btn grow" data-act="downloadQuoteXls" data-k="' + r.id + '">' + icon('download', 'ic-sm') + ' ' + T.downloadXls + '</button>' +
          '<button class="btn grow" data-act="saveQuoteDraft" data-k="' + r.id + '">' + icon('save', 'ic-sm') + ' ' + T.saveDraft + '</button></div>' +
          '</div>' +
          (q.sentAt ? '<div class="badge b-ok" style="margin-top:10px">' + icon('checkCircle', 'ic-sm') + ' Отправлено ' + esc(q.sentAt) + '</div>' +
            '<div class="fhint" style="margin-top:6px">Файл на Яндекс Диске: <span class="mono">/КП/2026/КП-2026-0' + (900 + r.number) + '.xls</span></div>' : '') +
        '</div></div>' +
        '<div class="card"><div class="card-h"><div class="h3">' + T.versions + '</div></div><div class="card-b">' +
          v === 1 ? '<div class="small muted">Это первая версия КП.</div>' :
          '<div class="col" style="gap:6px">' + Array.from({ length: v }, (_, i) => '<div class="row"><span class="badge b-neutral">v' + (i + 1) + '</span><span class="small grow">КП-2026-0' + (900 + r.number) + '</span><button class="btn sm" data-act="openVersion" data-k="' + (i + 1) + '">Просмотр</button></div>').join('') + '</div>' +
        '</div></div>' +
      '</div></div>';
  }
  function field(label, key, val) {
    return '<div class="field"><label>' + esc(label) + '</label>' +
      '<input class="inp" data-edit="setQuoteField" data-id="' + key + '" value="' + esc(val) + '"></div>';
  }
  function historyZone(r) {
    return '<div class="grid rv" style="grid-template-columns:minmax(0,1fr) minmax(280px,1fr)">' +
      '<div class="card"><div class="card-h"><div class="h3">Лента событий</div></div><div class="card-b">' +
      '<div class="timeline">' + events(r).map(ev =>
        '<div class="tl-i"><span class="tl-d ' + (ev.actor === 'Система' ? 'sys' : 'me') + '"></span>' +
        '<div class="grow"><div class="tl-t">' + esc(ev.action) + '</div>' +
        '<div class="tl-s">' + esc(ev.actor) + ' · ' + esc(ev.at) + (ev.details ? ' · ' + esc(ev.details) : '') + '</div></div></div>').join('') +
      '</div></div></div>' +
      '<div class="card pad"><div class="h3">Участники и объекты</div><div class="kv" style="margin-top:10px">' +
      '<dt>Клиент</dt><dd>' + esc(r.client.name) + '</dd>' +
      '<dt>Домен</dt><dd class="mono">' + esc(r.client.domain) + '</dd>' +
      '<dt>Ответственный</dt><dd>' + esc(r.assignee.name) + '</dd>' +
      '<dt>Получено</dt><dd>' + U.dt(r.receivedAt) + '</dd>' +
      '<dt>Обновлено</dt><dd>' + U.dt(r.updatedAt) + '</dd>' +
      '<dt>Позиций</dt><dd>' + r.positions.length + '</dd>' +
      '</div></div></div>';
  }
  function events(r) {
    const base = [{ at: U.dt(r.receivedAt), actor: 'Система', action: 'Письмо получено', details: esc(r.email.from) },
      { at: U.dt(r.receivedAt), actor: 'Система', action: 'Распознано позиций: ' + r.positions.length, details: 'мин. уверенность ' + U.num(r.minConfidence) }];
    return (r.act || []).concat(base);
  }

  /* --- ИИ-панель --- */
  function aiBar(r, place) {
    return '<div class="card pad"><div class="row" style="gap:8px">' +
      '<span style="color:var(--accent)">' + icon('sparkles') + '</span>' +
      '<div class="grow"><div class="h3">' + T.aiTitle + '</div>' +
      '<div class="fhint" style="margin-top:2px">' + T.aiHint + '</div></div></div>' +
      '<div class="ai-chips" style="margin-top:11px">' +
      '<button class="btn sm" data-act="aiSummary">' + icon('activity', 'ic-sm') + ' ' + T.aiSummary + '</button>' +
      '<button class="btn sm" data-act="aiReply">' + icon('wand', 'ic-sm') + ' ' + T.aiReply + '</button>' +
      (place === 'email' ? '<button class="btn sm" data-act="aiSuggest">' + icon('tag', 'ic-sm') + ' Определить артикулы</button>' : '') +
      (place === 'email' ? '<button class="btn sm primary" data-act="openAiMail" data-k="' + r.id + '">' + icon('edit', 'ic-sm') + ' ' + T.aiEditMail + '</button>' : '') +
      '<button class="btn sm" data-act="aiChat" data-k="' + r.id + '">' + icon('chat', 'ic-sm') + ' ' + T.aiAsk + '</button>' +
      '</div>' +
      '<div id="aiOut"></div></div>';
  }

  /* --- диалоги карточки --- */
  function dlgAssign(r) {
    return '<div class="dlg narrow" id="dlgAssign" role="dialog" aria-modal="true" aria-label="' + T.assign + '">' +
      '<div class="dlg-h"><b class="h2">' + T.assign + ' ответственного</b><div class="grow"></div>' +
      '<button class="ibtn" data-act="closeDlg" data-k="dlgAssign" aria-label="' + T.close + '">' + icon('x') + '</button></div>' +
      '<div class="dlg-b"><div class="radio-list">' + window.MOCK.MANAGERS.map(m =>
        '<label class="radio-i' + (r.assignee.name === m[1] ? ' on' : '') + '"><input type="radio" name="asg" data-act-change="setAssignee" data-id="' + r.id + '|' + m[1] + '" value="' + m[1] + '"' + (r.assignee.name === m[1] ? ' checked' : '') + '> ' + esc(m[1]) + '</label>').join('') +
      '</div></div>' +
      '<div class="dlg-f"><button class="btn" data-act="closeDlg" data-k="dlgAssign">' + T.cancel + '</button>' +
      '<button class="btn primary" data-act="closeDlg" data-k="dlgAssign">' + T.save + '</button></div></div>';
  }
  function dlgQuote(r, tot) {
    return '<div class="dlg wide" id="dlgQuote" role="dialog" aria-modal="true" aria-label="' + T.quote + '">' +
      '<div class="dlg-h"><b class="h2">КП-2026-0' + (900 + r.number) + '</b>' + U.statusBadge('quote_sent') + '<div class="grow"></div>' +
      '<button class="ibtn" data-act="closeDlg" data-k="dlgQuote" aria-label="' + T.close + '">' + icon('x') + '</button></div>' +
      '<div class="dlg-b">' +
      '<div class="row wrap" style="gap:10px;margin-bottom:12px">' +
        '<span class="badge b-neutral">Позиций: ' + r.positions.length + '</span>' +
        '<span class="badge b-info">' + T.total + ': ' + U.money(tot.total) + '</span>' +
        '<span class="badge b-neutral">Действует 14 дней</span></div>' +
      '<div class="tscroll"><table class="tbl" style="min-width:640px"><thead><tr>' +
      '<th>№</th><th>Наименование</th><th>Кол-во</th><th>' + T.clientPrice + '</th><th>' + T.amount + '</th></tr></thead><tbody>' +
      r.positions.map((p, i) => '<tr><td class="mono">' + (i + 1) + '</td><td>' + esc(p.name) + '</td><td class="num">' + p.qty + ' ' + esc(p.unit) + '</td>' +
        '<td class="num">' + U.money(p.clientPriceRub) + '</td><td class="num">' + U.money(p.totalRub) + '</td></tr>').join('') +
      '</tbody></table></div></div>' +
      '<div class="dlg-f"><button class="btn" data-act="downloadQuoteXls" data-k="' + r.id + '">' + icon('download', 'ic-sm') + ' ' + T.downloadXls + '</button>' +
      '<button class="btn" data-act="closeDlg" data-k="dlgQuote">' + T.saveDraft + '</button>' +
      '<button class="btn primary" data-act="openSend" data-k="' + r.id + '">' + icon('send', 'ic-sm') + ' ' + T.sendClient + '</button></div></div>';
  }
  function dlgSend() {
    return '<div class="dlg narrow" id="dlgSend" role="dialog" aria-modal="true" aria-label="' + T.confirmSend + '">' +
      '<div class="dlg-h"><b class="h2">' + T.confirmSend + '</b><div class="grow"></div>' +
      '<button class="ibtn" data-act="closeDlg" data-k="dlgSend" aria-label="' + T.close + '">' + icon('x') + '</button></div>' +
      '<div class="dlg-b"><div class="row-t"><span style="color:var(--warn)">' + icon('alertT') + '</span>' +
      '<p class="small">' + T.confirmSendD + '</p></div>' +
      '<div class="kv" style="margin-top:12px"><dt>Кому</dt><dd id="sdTo">—</dd><dt>Тема</dt><dd id="sdSubj">—</dd>' +
      '<dt>Вложение</dt><dd id="sdAtt">КП.xls</dd></div></div>' +
      '<div class="dlg-f"><button class="btn" data-act="closeDlg" data-k="dlgSend">' + T.no + '</button>' +
      '<button class="btn primary" data-act="confirmSend">' + icon('send', 'ic-sm') + ' ' + T.yes + '</button></div></div>';
  }
  function dlgAi(r) {
    return '<div class="dlg" id="dlgAi" role="dialog" aria-modal="true" aria-label="' + T.aiTitle + '">' +
      '<div class="dlg-h"><span style="color:var(--accent)">' + icon('sparkles') + '</span><b class="h2">' + T.aiTitle + '</b><div class="grow"></div>' +
      '<button class="ibtn" data-act="closeDlg" data-k="dlgAi" aria-label="' + T.close + '">' + icon('x') + '</button></div>' +
      '<div class="dlg-b"><div class="ai-log" id="aiLog"></div>' +
      '<div class="ai-chips" style="margin-top:10px">' +
      ['Сводка по запросам','Кто быстрее отвечает','Как считается цена','Где нет артикулов','Что просрочено'].map(q =>
        '<button class="chip" data-act="aiChip" data-k="' + esc(q) + '">' + esc(q) + '</button>').join('') + '</div>' +
      '<div class="row" style="gap:8px;margin-top:10px"><input class="inp grow" id="aiIn" placeholder="Спросите про запросы, поставщиков, цены…" aria-label="Вопрос ИИ">' +
      '<button class="btn primary" data-act="aiSend">' + icon('send', 'ic-sm') + '</button></div></div>' +
      '<div class="dlg-f"><span class="fhint grow">' + icon('shield', 'ic-sm') + ' ИИ предлагает — вы подтверждаете. Ничего не уходит клиенту автоматически.</span>' +
      '<button class="btn" data-act="closeDlg" data-k="dlgAi">' + T.close + '</button></div></div>';
  }
  function dlgDup() {
    return '<div class="dlg narrow" id="dlgDup" role="dialog" aria-modal="true" aria-label="' + T.mergeDup + '">' +
      '<div class="dlg-h"><b class="h2">' + T.mergeDup + '</b><div class="grow"></div>' +
      '<button class="ibtn" data-act="closeDlg" data-k="dlgDup" aria-label="' + T.close + '">' + icon('x') + '</button></div>' +
      '<div class="dlg-b"><div id="dupBody" class="small muted">Поиск дублей…</div></div>' +
      '<div class="dlg-f"><button class="btn" data-act="closeDlg" data-k="dlgDup">' + T.cancel + '</button>' +
      '<button class="btn primary" data-act="applyMerge">' + T.mergeDup + '</button></div></div>';
  }
  R.request_dialogs = true;

  /* ============================================================ КЛИЕНТЫ */
  let CSEL = null;
  R.clients = function () {
    if (CSEL) return clientCard(CSEL);
    const by = {};
    DB.requests.forEach(r => {
      const k = r.client.name;
      by[k] = by[k] || { name: k, domain: r.client.domain, req: 0, sent: 0, won: 0, sum: 0, last: '' };
      by[k].req++; by[k].sent += r.quoteTotalRub ? 1 : 0;
      if (r.status === 'won') { by[k].won++; by[k].sum += r.quoteTotalRub || 0; }
      if (r.receivedAt > by[k].last) by[k].last = r.receivedAt;
    });
    const rows = Object.keys(by).map(k => by[k]).sort((a, b) => b.req - a.req);
    return '<div class="content">' +
      head('Клиенты', rows.length + ' клиентов созданы автоматически из входящих писем по домену',
        '<button class="btn" data-act="exportClients">' + icon('download', 'ic-sm') + ' ' + T.exportXls + '</button>' +
        '<button class="btn" data-act="mergeClients">' + icon('merge', 'ic-sm') + ' Объединить дубли</button>') +
      '<div class="tw rv"><div class="tscroll desk"><table class="tbl" style="min-width:940px"><thead><tr>' +
      '<th>Клиент</th><th>Домен почты</th><th>Запросов</th><th>КП отправлено</th><th>Выиграно</th><th>Сумма заказов</th><th>Последний контакт</th><th class="act"></th>' +
      '</tr></thead><tbody>' + rows.map(c => '<tr>' +
        '<td><b>' + esc(c.name) + '</b></td><td class="mono small">' + esc(c.domain) + '</td>' +
        '<td class="num">' + c.req + '</td><td class="num">' + c.sent + '</td><td class="num">' + c.won + '</td>' +
        '<td class="num">' + U.money(c.sum) + '</td><td class="small nowrap">' + U.dt(c.last) + '</td>' +
        '<td class="act"><button class="btn sm" data-act="openClient" data-k="' + esc(c.name) + '">Открыть</button></td></tr>').join('') +
      '</tbody></table></div>' +
      '<div class="mcards">' + rows.map(c => '<button class="mcard" data-act="openClient" data-k="' + esc(c.name) + '">' +
        '<div class="mc-top"><div><div class="mc-t">' + esc(c.name) + '</div><div class="mc-s mono">' + esc(c.domain) + '</div></div>' +
        '<span class="badge b-neutral">' + c.req + ' запр.</span></div>' +
        '<div class="mc-row"><span>КП <b>' + c.sent + '</b></span><span>Выиграно <b>' + c.won + '</b></span>' +
        '<span>Сумма <b>' + U.money(c.sum) + '</b></span></div></button>').join('') + '</div></div></div>';
  };
  function clientCard(name) {
    const rs = DB.requests.filter(r => r.client.name === name);
    const sum = rs.reduce((s, r) => s + (r.quoteTotalRub || 0), 0);
    const won = rs.filter(r => r.status === 'won').length;
    const domain = rs[0] ? rs[0].client.domain : '';
    return '<div class="content">' +
      '<div class="row wrap" style="margin-bottom:12px"><button class="btn" data-act="backClients">' + icon('arrowLeft', 'ic-sm') + ' Клиенты</button></div>' +
      head(name, domain + ' · ' + rs.length + ' запросов',
        '<button class="btn" data-act="copyToClip" data-k="' + esc(domain) + '">' + icon('copy', 'ic-sm') + ' Копировать домен</button>' +
        '<button class="btn primary" data-act="newReqFor" data-k="' + esc(name) + '">' + icon('plus', 'ic-sm') + ' Новый запрос</button>') +
      '<div class="grid rv" style="grid-template-columns:repeat(auto-fit,minmax(190px,1fr));margin-bottom:16px">' +
      '<div class="stat"><span class="k">Запросов</span><span class="v">' + rs.length + '</span></div>' +
      '<div class="stat ok"><span class="k">Выиграно</span><span class="v">' + won + '</span></div>' +
      '<div class="stat info"><span class="k">Сумма заказов</span><span class="v" style="font-size:22px">' + U.money(sum) + '</span></div>' +
      '<div class="stat"><span class="k">Последний контакт</span><span class="v" style="font-size:18px">' + (rs[0] ? U.dOnly(rs[0].receivedAt) : '—') + '</span></div>' +
      '</div>' +
      '<div class="grid" style="grid-template-columns:minmax(0,2fr) minmax(280px,1fr)">' +
      '<div class="card"><div class="card-h"><div class="h3">История запросов и КП</div></div><div class="card-b" style="padding:0">' +
      '<div class="tscroll"><table class="tbl" style="min-width:700px"><thead><tr><th>№</th><th>Тема</th><th>Статус</th><th>Сумма</th><th>Дата</th><th class="act"></th></tr></thead><tbody>' +
      rs.map(r => '<tr><td class="mono">2026-' + r.number + '</td><td>' + esc(r.subject) + '</td><td>' + U.statusBadge(r.status) + '</td>' +
        '<td class="num">' + U.money(r.quoteTotalRub) + '</td><td class="small nowrap">' + U.dOnly(r.receivedAt) + '</td>' +
        '<td class="act"><button class="btn sm" data-act="openReq" data-k="' + r.id + '">Открыть</button></td></tr>').join('') +
      '</tbody></table></div></div></div>' +
      '<div class="card pad"><div class="h3">Реквизиты и контакты</div><div class="kv" style="margin-top:10px">' +
      '<dt>Название</dt><dd>' + esc(name) + '</dd><dt>Домен</dt><dd class="mono">' + esc(domain) + '</dd>' +
      '<dt>Почта закупок</dt><dd class="mono">zakupki@' + esc(domain) + '</dd>' +
      '<dt>Город</dt><dd>' + esc((window.MOCK.CLIENTS.filter(c => c[0] === name)[0] || [])[2] || 'Москва') + '</dd>' +
      '<dt>ИНН</dt><dd class="mono">77' + (1000000 + rs.length * 7777) + '</dd>' +
      '</div><div class="fhint" style="margin-top:10px">Реквизиты подтягиваются из справочника и используются в КП и спецификациях.</div></div>' +
      '</div></div>';
  }

  /* ============================================================ ПРОФИЛЬ и ЕЩЁ */
  R.profile = function () {
    const roleName = { manager: T.manager, head: T.head, admin: T.admin }[U.S.role];
    return '<div class="content" style="max-width:820px">' +
      head(T.profile, T.profileAbout) +
      '<div class="card pad rv" style="margin-bottom:14px"><div class="row" style="gap:14px">' +
      '<span class="ava" style="width:52px;height:52px;font-size:18px">' + esc(prof().name.split(' ').map(w => w[0] || '').slice(0, 2).join('')) + '</span>' +
      '<div class="grow"><div class="h2">' + esc(prof().name) + '</div><div class="small muted">' + esc(prof().mail) + ' · ' + esc(prof().post) + ' · ' + esc(roleName) + '</div></div>' +
      '<button class="btn" data-act="switchRole">' + icon('user', 'ic-sm') + ' Сменить роль</button></div></div>' +

      '<div class="card rv" style="margin-bottom:14px"><div class="card-h"><div class="h3">' + T.requisites + '</div></div>' +
      '<div class="card-b"><div class="row" style="gap:10px;flex-wrap:wrap">' +
        '<div class="field grow" style="min-width:200px"><label>ФИО</label><input class="inp" data-edit="setProfileName" value="' + esc(prof().name) + '" aria-label="ФИО"></div>' +
        '<div class="field grow" style="min-width:200px"><label>' + T.position + '</label><input class="inp" data-edit="setProfileRole" value="' + esc(prof().post) + '" aria-label="' + T.position + '"></div>' +
      '</div><div class="row" style="gap:10px;flex-wrap:wrap">' +
        '<div class="field grow" style="min-width:200px"><label>Email</label><input class="inp" data-edit="setProfileMail" value="' + esc(prof().mail) + '" aria-label="Email"></div>' +
        '<div class="field grow" style="min-width:200px"><label>' + T.phone + '</label><input class="inp" data-edit="setProfilePhone" value="' + esc(prof().phone) + '" aria-label="' + T.phone + '"></div>' +
      '</div>' +
      '<div class="row" style="gap:8px;margin-top:10px"><span data-flag class="save-flag">' + icon('check', 'ic-sm') + ' ' + T.saved + '</span>' +
      '<div class="grow"></div><button class="btn sm" data-act="resetProfile">Вернуть демо-значения</button></div>' +
      '<div class="fhint" style="margin-top:8px">' + icon('info', 'ic-sm') + ' Данные подставляются в подписи писем и в шаблоны ответов.</div></div></div>' +

      '<div class="card rv" style="margin-bottom:14px"><div class="card-h"><div class="h3">' + T.profileTheme + '</div></div>' +
      '<div class="card-b"><div class="seg"><button class="' + (U.S.theme === 'light' ? 'on' : '') + '" data-act="setTheme" data-k="light">' + icon('sun', 'ic-sm') + ' ' + T.themeLight + '</button>' +
      '<button class="' + (U.S.theme === 'dark' ? 'on' : '') + '" data-act="setTheme" data-k="dark">' + icon('moon', 'ic-sm') + ' ' + T.themeDark + '</button></div>' +
      '<div class="fhint" style="margin-top:8px">Основная тема светлая — менеджер работает с таблицами весь день. Тёмная включается здесь.</div></div></div>' +

      '<div class="card rv" style="margin-bottom:14px"><div class="card-h"><div class="h3">' + T.profileRole + '</div></div>' +
      '<div class="card-b"><div class="radio-list">' +
      [['manager', T.manager, 'Запросы, КП, клиенты, поставщики, спецификации'],
       ['head', T.head, 'Всё, кроме управления пользователями и подключений'],
       ['admin', T.admin, 'Все разделы, настройки и подключения']].map(r =>
        '<label class="radio-i' + (U.S.role === r[0] ? ' on' : '') + '"><input type="radio" name="role" data-act-change="setRole" value="' + r[0] + '"' + (U.S.role === r[0] ? ' checked' : '') + '>' +
        '<span class="grow"><b class="small">' + r[1] + '</b><div class="tiny muted">' + r[2] + '</div></span></label>').join('') +
      '</div><div class="fhint" style="margin-top:10px">Права проверяются на бэкенде. Интерфейс скрывает недоступные разделы: например, у менеджера нет «Аналитики» и настроек.</div></div></div>' +

      '<div class="card rv"><div class="card-h"><div class="h3">' + T.stages + '</div></div><div class="card-b">' +
      '<div class="col" style="gap:9px">' +
      stageRow('Э1', 'Ядро «запрос → КП»', 'today, requests, clients, pricelists, pricing, templates, users, audit', ['today','requests','clients','pricelists','pricing','templates','users','audit']) +
      stageRow('Э2', 'Поставщики и контроль', 'pipeline, suppliers, calendar', ['pipeline','suppliers','calendar']) +
      stageRow('Э3', 'Документы, аналитика, рассылка', 'specs, analytics, newsletters, connections', ['specs','analytics','newsletters','connections']) +
      '</div>' +
      '<div class="row" style="margin-top:12px;gap:8px"><button class="btn" data-act="openStand">' + icon('external', 'ic-sm') + ' ' + T.openStand + '</button>' +
      '<button class="btn" data-act="aiChat" data-k="top">' + icon('sparkles', 'ic-sm') + ' Спросить ИИ</button>' +
      '<button class="btn danger" data-act="resetDemo">' + icon('rotate', 'ic-sm') + ' Сбросить демо-данные</button></div>' +
      '</div></div>' +
      dlgAi(null) + dlgRole() + '</div>';
  };
  const PROF_DEF = { name: 'Клочко Никита', post: 'Руководитель отдела продаж', mail: 'klochko@neeklo-lab.ru', phone: '+7 495 123-45-67' };
  function prof() {
    try { return Object.assign({}, PROF_DEF, JSON.parse(localStorage.getItem('kp-profile-v1') || '{}')); } catch (e) { return PROF_DEF; }
  }
  function stageRow(code, name, routes, list) {
    return '<div class="row" style="border-bottom:1px solid var(--line);padding-bottom:9px">' +
      '<span class="badge b-info">' + code + '</span>' +
      '<div class="grow"><div class="small" style="font-weight:600">' + esc(name) + '</div><div class="tiny muted">' + esc(routes) + '</div></div>' +
      '<div class="row" style="gap:4px">' + list.map(r => '<button class="chip" data-act="go" data-k="' + r + '">' + esc((U.ROUTES[r] || {}).t) + '</button>').join('') + '</div></div>';
  }
  function dlgRole() {
    return '<div class="dlg narrow" id="dlgRole" role="dialog" aria-modal="true" aria-label="Роль">' +
      '<div class="dlg-h"><b class="h2">Сменить роль</b><div class="grow"></div>' +
      '<button class="ibtn" data-act="closeDlg" data-k="dlgRole" aria-label="' + T.close + '">' + icon('x') + '</button></div>' +
      '<div class="dlg-b"><div class="radio-list">' +
      [['manager', T.manager, 'Запросы, КП, клиенты, поставщики, спецификации'],
       ['head', T.head, 'Всё, кроме управления пользователями'],
       ['admin', T.admin, 'Все разделы и настройки']].map(r =>
        '<label class="radio-i' + (U.S.role === r[0] ? ' on' : '') + '"><input type="radio" name="role2" data-act-change="setRole" value="' + r[0] + '"' + (U.S.role === r[0] ? ' checked' : '') + '>' +
        '<span class="grow"><b class="small">' + r[1] + '</b><div class="tiny muted">' + r[2] + '</div></span></label>').join('') +
      '</div></div><div class="dlg-f"><button class="btn" data-act="closeDlg" data-k="dlgRole">' + T.close + '</button></div></div>';
  }
  R.more = function () {
    const items = [['profile','user',T.profile],['clients','users',T.clients],['suppliers','truck',T.suppliers],
      ['specs','file',T.specs],['calendar','calendar',T.calendar],['analytics','chart',T.analytics],
      ['newsletters','send',T.newsletters],['connections','plug',T.connections],['pricelists','db',T.pricelists],
      ['pricing','percent',T.pricing],['templates','book',T.templates],['users','userPlus',T.users],['audit','history',T.audit]];
    return '<div class="content" style="max-width:820px">' + head(T.more, 'Все разделы системы и профиль') +
      '<div class="grid rv" style="grid-template-columns:repeat(auto-fit,minmax(230px,1fr))">' +
      items.map(i => {
        const allowed = U.roleCan(i[0]);
        return '<button class="stat link" data-act="' + (allowed ? 'go' : 'denied') + '" data-k="' + i[0] + '"' + (allowed ? '' : ' style="opacity:.55"') + '>' +
          '<span class="row" style="gap:10px"><span style="color:var(--accent)">' + icon(i[1]) + '</span>' +
          '<span class="grow"><b>' + esc(i[2]) + '</b><span class="tiny muted" style="display:block">' + (allowed ? 'Доступно' : T.noAccess) + '</span></span>' +
          icon(allowed ? 'chevR' : 'lock', 'ic-sm') + '</span></button>';
      }).join('') + '</div></div>';
  };
  window.__views1 = { loadPresets: loadPresets, CTAB: function (v) { if (v) CTAB = v; return CTAB; }, CSEL: function (v) { if (v !== undefined) CSEL = v; return CSEL; }, F: F, mcard: mcard, head: head, card: card };
})();
