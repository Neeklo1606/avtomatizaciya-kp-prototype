/* Экраны 2: Поставщики, Воронка, Календарь, Прайсы, Правила расчёта, Шаблоны, Пользователи, Журнал. */
(function () {
  'use strict';
  const U = window.UI, T = U.T, DB = U.DB, esc = U.esc, icon = U.icon;
  const R = U.RENDERERS, toast = U.toast;
  const v1 = window.__views1;
  const head = v1.head, card = v1.card;

  /* ============================================================ ПОСТАВЩИКИ (Э2) */
  let SUPSEL = null;
  R.suppliers = function () {
    if (SUPSEL) return supplierCard(SUPSEL);
    const rows = window.MOCK.SUPPLIERS.map((s, i) => ({ id: 's' + i, name: s[0], email: s[1], brands: s[2], days: s[3], refuse: s[4],
      reqs: 4 + ((i * 7) % 14) }));
    return '<div class="content">' +
      head('Поставщики', rows.length + ' поставщиков · запросы, ответы и сроки') +
      '<div class="grid rv" style="grid-template-columns:repeat(auto-fit,minmax(190px,1fr));margin-bottom:16px">' +
      '<div class="stat"><span class="k">Запросов отправлено</span><span class="v">' + rows.reduce((a, r) => a + r.reqs, 0) + '</span></div>' +
      '<div class="stat info"><span class="k">Среднее время ответа</span><span class="v" style="font-size:22px">' + U.num(rows.reduce((a, r) => a + r.days, 0) / rows.length, 1) + ' дн.</span></div>' +
      '<div class="stat warn"><span class="k">Доля отказов</span><span class="v" style="font-size:22px">' + Math.round(rows.reduce((a, r) => a + r.refuse, 0) / rows.length * 100) + '%</span></div>' +
      '<div class="stat ok"><span class="k">Активных</span><span class="v">' + rows.length + '</span></div></div>' +
      '<div class="tw rv"><div class="toolbar"><span class="small muted">Клик по поставщику — карточка с историей запросов и разобранными ответами</span>' +
      '<div class="grow"></div><button class="btn sm primary" data-act="newSupplier">' + icon('plus', 'ic-sm') + ' ' + T.supplierNew + '</button>' +
      '<button class="btn sm" data-act="exportSuppliers">' + icon('download', 'ic-sm') + ' ' + T.exportXls + '</button>' +
      '<button class="btn sm" data-act="reqAllSuppliers">' + icon('send', 'ic-sm') + ' Разослать запросы</button></div>' +
      '<div class="tscroll desk"><table class="tbl" style="min-width:900px"><thead><tr>' +
      '<th>Поставщик</th><th>Email</th><th>Бренды</th><th>Запросов</th><th>' + T.responseTime + '</th><th>' + T.refusalRate + '</th><th class="act"></th>' +
      '</tr></thead><tbody>' + rows.map(s => '<tr>' +
        '<td><b>' + esc(s.name) + '</b></td><td class="mono small">' + esc(s.email) + '</td>' +
        '<td>' + s.brands.map(b => '<span class="chip" style="min-height:24px;font-size:11.5px">' + esc(b) + '</span> ').join('') + '</td>' +
        '<td class="num">' + s.reqs + '</td><td class="num">' + U.num(s.days, 1) + ' дн.</td>' +
        '<td class="num">' + Math.round(s.refuse * 100) + '%</td>' +
        '<td class="act"><button class="btn sm" data-act="openSupplier" data-k="' + s.id + '">Открыть</button></td></tr>').join('') +
      '</tbody></table></div>' +
      '<div class="mcards">' + rows.map(s => '<button class="mcard" data-act="openSupplier" data-k="' + s.id + '">' +
        '<div class="mc-top"><div><div class="mc-t">' + esc(s.name) + '</div><div class="mc-s mono">' + esc(s.email) + '</div></div>' +
        '<span class="badge b-' + (s.days < 3 ? 'ok' : s.days < 5 ? 'warn' : 'bad') + '">' + U.num(s.days, 1) + ' дн.</span></div>' +
        '<div class="mc-row"><span>Запросов <b>' + s.reqs + '</b></span><span>Отказов <b>' + Math.round(s.refuse * 100) + '%</b></span>' +
        '<span>Бренды <b>' + esc(s.brands.join(', ')) + '</b></span></div></button>').join('') + '</div></div>' +
      dlgSupplierReq() + '</div>';
  };
  function supplierCard(id) {
    const i = +String(id).replace('s', '');
    const s = window.MOCK.SUPPLIERS[i];
    const chains = [
      ['Р-1001, Р-1002, Н-2001', '2026-09-21', 'reply', 2, 148.4],
      ['П-3003, П-3006', '2026-09-19', 'remind', 4, 0],
      ['Р-1004', '2026-09-16', 'refused', 7, 0],
      ['Н-2002, Н-2003', '2026-09-22', 'sent', 1, 0]
    ];
    const stMap = { sent: ['b-info','Отправлен'], remind: ['b-warn','Напоминание отправлено'], reply: ['b-ok','Ответ получен'], refused: ['b-bad','Отказ'] };
    return '<div class="content">' +
      '<div class="row wrap" style="margin-bottom:12px"><button class="btn" data-act="backSuppliers">' + icon('arrowLeft', 'ic-sm') + ' Поставщики</button></div>' +
      head(s[0], s[1] + ' · бренды: ' + s[2].join(', '),
        '<button class="btn" data-act="writeSupplier" data-k="' + i + '">' + icon('mail', 'ic-sm') + ' Написать</button>' +
        '<button class="btn primary" data-act="openSupplierReq" data-k="' + i + '">' + icon('send', 'ic-sm') + ' Новый запрос</button>') +
      '<div class="grid rv" style="grid-template-columns:repeat(auto-fit,minmax(180px,1fr));margin-bottom:16px">' +
      '<div class="stat"><span class="k">Запросов</span><span class="v">' + (4 + (i * 7) % 14) + '</span></div>' +
      '<div class="stat info"><span class="k">' + T.responseTime + '</span><span class="v" style="font-size:22px">' + U.num(s[3], 1) + ' дн.</span></div>' +
      '<div class="stat warn"><span class="k">' + T.refusalRate + '</span><span class="v" style="font-size:22px">' + Math.round(s[4] * 100) + '%</span></div>' +
      '<div class="stat ok"><span class="k">В ожидании</span><span class="v">1</span></div></div>' +
      '<div class="grid" style="grid-template-columns:minmax(0,1.6fr) minmax(300px,1fr)">' +
      '<div class="card"><div class="card-h"><div class="h3">Запросы поставщикам</div></div><div class="card-b" style="padding:0">' +
      '<div class="tscroll"><table class="tbl" style="min-width:700px"><thead><tr><th>Артикулы</th><th>Отправлен</th><th>Статус</th><th>Дней в ожидании</th><th class="act"></th></tr></thead><tbody>' +
      chains.map((c, k) => '<tr><td class="mono small">' + esc(c[0]) + '</td><td class="small nowrap">' + esc(c[1]) + '</td>' +
        '<td><span class="badge ' + stMap[c[2]][0] + '">' + stMap[c[2]][1] + '</span></td>' +
        '<td class="num">' + c[3] + '</td>' +
        '<td class="act">' + (c[2] === 'reply' ? '<button class="btn sm primary" data-act="parseReply" data-k="' + i + '|' + k + '">Разобрать ответ</button>'
          : c[2] === 'sent' || c[2] === 'remind' ? '<button class="btn sm" data-act="remindSupplier" data-k="' + i + '|' + k + '">Напомнить</button>'
          : '<button class="btn sm" data-act="reSendSupplier" data-k="' + i + '|' + k + '">Повторить</button>') + '</td></tr>').join('') +
      '</tbody></table></div></div></div>' +
      '<div class="col" style="gap:14px">' +
      '<div class="card pad"><div class="h3">' + T.parsedReply + '</div>' +
      '<div class="fhint" style="margin-top:6px">Ответ поставщика разбирается автоматически: цена, срок, условия. Менеджер подтверждает — данные уходят в позиции запроса.</div>' +
      '<div class="col" style="gap:8px;margin-top:11px">' +
      ['Р-1001 — 92,00 USD', 'Р-1002 — 148,00 USD', 'Н-2001 — 310,00 EUR', 'Р-1004 — отказ'].map(r =>
        '<label class="radio-i"><input type="checkbox" checked style="accent-color:var(--accent)"> <span class="small grow">' + esc(r) + '</span></label>').join('') +
      '</div>' +
      '<button class="btn primary wide" style="margin-top:11px" data-act="acceptParsed" data-k="' + i + '">' + icon('check', 'ic-sm') + ' ' + T.accept + ' и перенести в позиции</button>' +
      '</div>' +
      '<div class="card pad"><div class="h3">Ссылка на оригинал письма</div>' +
      '<button class="att" style="width:100%" data-act="openRawMail"><span style="color:var(--accent)">' + icon('mailOpen', 'ic-sm') + '</span>' +
      '<span class="grow small" style="font-weight:600">Ответ от ' + esc(s[1]) + '</span>' + icon('ext', 'ic-sm') + '</button></div>' +
      '</div></div>' +
      dlgSupplierReq() + '</div>';
  }
  function dlgSupplierReq() {
    return '<div class="dlg" id="dlgSupReq" role="dialog" aria-modal="true" aria-label="Запрос поставщику">' +
      '<div class="dlg-h"><b class="h2">Запрос поставщику (EN)</b><div class="grow"></div>' +
      '<button class="ibtn" data-act="closeDlg" data-k="dlgSupReq" aria-label="' + T.close + '">' + icon('x') + '</button></div>' +
      '<div class="dlg-b">' +
      '<div class="ai-bar"><span class="ai-t">' + icon('sparkles', 'ic-sm') + ' ИИ</span>' +
      '<button class="btn sm" data-act="aiSupplier" data-k="en">Составить запрос на английском</button>' +
      '<button class="btn sm" data-act="aiSupplier" data-k="ru">На русском</button></div>' +
      '<div class="field"><label>Кому</label><input class="inp" id="sqTo" value="orders@thermofisher.com"></div>' +
      '<div class="field"><label>Тема</label><input class="inp" id="sqSubj" value="Quotation request — 4 items"></div>' +
      '<div class="field"><label>Текст</label><textarea class="inp" id="sqBody" style="min-height:170px">Dear colleagues,\n\nPlease provide a quotation for the following items:\n\n1. PBS buffer 10x, 1 L — 3 units\n2. Agarose molecular biology, 500 g — 2 units\n3. DNA extraction kit, 50 tests — 1 unit\n4. Anti-CD3 antibody, 100 µg — 2 units\n\nPlease specify the delivery time and payment terms.\n\nKind regards,\nProcurement Department\nneeklo-lab</textarea></div>' +
      '<div class="fhint">' + icon('shield', 'ic-sm') + ' Письмо уйдёт только после вашего подтверждения.</div>' +
      '</div><div class="dlg-f"><button class="btn" data-act="closeDlg" data-k="dlgSupReq">' + T.cancel + '</button>' +
      '<button class="btn primary" data-act="sendSupplierReq">' + icon('send', 'ic-sm') + ' ' + T.send + '</button></div></div>';
  }

  /* ============================================================ ВОРОНКА (Э2) */
  R.pipeline = function () {
    const R2 = DB.requests;
    const cols = window.MOCK.STATUS;
    const late = r => r.status === 'waiting_supplier';
    return '<div class="content">' +
      head('Воронка', 'Канбан по статусам запроса · перетаскивание только между разрешёнными переходами',
        '<button class="btn" data-act="pipeAuto">' + icon('zap', 'ic-sm') + ' Показать проблемные</button>' +
        '<button class="btn" data-act="exportPipeline">' + icon('download', 'ic-sm') + ' ' + T.exportXls + '</button>') +
      '<div class="fhint rv" style="margin-bottom:10px">' + icon('info', 'ic-sm') + ' ' + T.dragHint + '. Недопустимый переход подсветится подсказкой. Смена статуса доступна и через меню карточки.</div>' +
      '<div class="kstatus-chips rv">' + cols.map(c => '<button class="chip' + (U.F.pipe.view === c[0] ? ' on' : '') + '" data-act="pipeView" data-k="' + c[0] + '">' +
        esc(c[1]) + ' · ' + R2.filter(r => r.status === c[0]).length + '</button>').join('') +
        '<button class="chip' + (U.F.pipe.view === 'all' ? ' on' : '') + '" data-act="pipeView" data-k="all">Все</button></div>' +
      '<div class="kan rv" id="kan">' + cols.map(c => {
        const items = R2.filter(r => r.status === c[0] && (U.F.pipe.view === 'all' || U.F.pipe.view === c[0]));
        const total = items.reduce((a, r) => a + (r.quoteTotalRub || 0), 0);
        return '<div class="kcol' + (c[0] === 'waiting_supplier' ? ' late' : '') + '" data-col="' + c[0] + '">' +
          '<div class="kcol-h"><span class="badge ' + U.toneCls[c[2]] + '"><i class="bd"></i>' + esc(c[1]) + '</span>' +
          '<span class="grow"></span><span class="tiny muted">' + items.length + ' · ' + U.money(total) + '</span></div>' +
          '<div class="kcol-b" data-drop="' + c[0] + '">' + items.map(r =>
            '<div class="kcard" draggable="true" data-drag="' + r.id + '">' +
            '<button class="kc-c" data-act="openReq" data-k="' + r.id + '" style="text-align:left;font:inherit">' + esc(r.client.name) + '</button>' +
            '<div class="kc-m"><span>' + U.money(r.quoteTotalRub) + '</span><span>' + (1 + (r.number % 5)) + ' дн.</span><span>' + esc(r.assignee.name) + '</span></div>' +
            '<div class="row" style="gap:6px;margin-top:8px"><button class="btn sm" data-act="pipeMove" data-k="' + r.id + '">' + icon('arrowRight', 'ic-sm') + ' Статус</button>' +
            '<button class="btn sm ghost" data-act="openReq" data-k="' + r.id + '">' + icon('eye', 'ic-sm') + '</button></div></div>').join('') +
          '</div></div>';
      }).join('') + '</div>' +
      dlgMove() + '</div>';
  };
  function dlgMove() {
    return '<div class="dlg narrow" id="dlgMove" role="dialog" aria-modal="true" aria-label="Смена статуса">' +
      '<div class="dlg-h"><b class="h2">Смена статуса</b><div class="grow"></div>' +
      '<button class="ibtn" data-act="closeDlg" data-k="dlgMove" aria-label="' + T.close + '">' + icon('x') + '</button></div>' +
      '<div class="dlg-b"><div id="mvBody"></div></div>' +
      '<div class="dlg-f"><button class="btn" data-act="closeDlg" data-k="dlgMove">' + T.cancel + '</button></div></div>';
  }

  /* ============================================================ КАЛЕНДАРЬ (Э2) */
  let CALW = 'this';
  R.calendar = function () {
    const R2 = DB.requests.slice(0, 24);
    /* текущий месяц стенда — сентябрь 2026 */
    const YEAR = 2026, MONTH = 8; /* 8 = сентябрь */
    const MONTHS = ['январь','февраль','март','апрель','май','июнь','июль','август','сентябрь','октябрь','ноябрь','декабрь'];
    const WD = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'];
    const TODAY = 23;
    const daysInMonth = new Date(YEAR, MONTH + 1, 0).getDate();
    /* неделя начинается с понедельника */
    const firstDow = (new Date(YEAR, MONTH, 1).getDay() + 6) % 7;
    const prevDays = new Date(YEAR, MONTH, 0).getDate();

    /* раскладываем запросы по дням получения (срок ответа поставщика — +14 дней) */
    const byDay = {};
    const push = (day, ev) => { (byDay[day] = byDay[day] || []).push(ev); };
    R2.forEach(r => {
      const m = String(r.receivedAt).match(/^\d{4}-(\d{2})-(\d{2})/);
      if (!m) return;
      const d = parseInt(m[2], 10);
      const waiting = r.status === 'waiting_supplier';
      push(d, {
        txt: U.shortName(r.client.name),
        tone: waiting ? 'bad' : (r.minConfidence < 0.7 ? 'warn' : 'info'),
        id: r.id,
        label: waiting ? T.overdue : 'в срок'
      });
    });

    const stats = {
      over: R2.filter(r => r.status === 'waiting_supplier').length,
      week: Object.keys(byDay).filter(d => +d >= TODAY && +d <= TODAY + 6).reduce((a, d) => a + byDay[d].length, 0),
      rem: Object.keys(byDay).reduce((a, d) => a + byDay[d].length, 0),
      done: 87
    };

    /* строим ячейки: хвост прошлого месяца, текущий, начало следующего */
    let cells = '';
    const cell = (day, out, evs) => {
      const isToday = !out && day === TODAY;
      const shown = (evs || []).slice(0, 2);
      const rest = (evs || []).length - shown.length;
      return '<button class="cal-cell' + (out ? ' out' : '') + (isToday ? ' today' : '') + '"' +
        ' data-act="calDay" data-k="' + day + '" aria-label="' + day + ' ' + MONTHS[MONTH] + '">' +
        '<span class="cal-d">' + day + '</span>' +
        shown.map(e => '<span class="cal-ev ' + e.tone + '" title="' + esc(e.txt) + '">' + esc(e.txt) + '</span>').join('') +
        (rest > 0 ? '<span class="cal-more">ещё ' + rest + '</span>' : '') +
        '</button>';
    };
    for (let i = firstDow - 1; i >= 0; i--) cells += cell(prevDays - i, true, null);
    for (let d = 1; d <= daysInMonth; d++) cells += cell(d, false, byDay[d]);
    const tail = (7 - ((firstDow + daysInMonth) % 7)) % 7;
    for (let d = 1; d <= tail; d++) cells += cell(d, true, null);

    return '<div class="content">' +
      head('Календарь сроков', 'Сроки ответов поставщиков, напоминания и просрочки',
        '<button class="btn" data-act="calToday">' + icon('target', 'ic-sm') + ' Сегодня</button>' +
        '<button class="btn" data-act="exportCalendar">' + icon('download', 'ic-sm') + ' ' + T.exportXls + '</button>') +
      '<div class="grid rv" style="grid-template-columns:repeat(auto-fit,minmax(180px,1fr));margin-bottom:16px">' +
      '<div class="stat bad"><span class="k">Просрочено</span><span class="v">' + stats.over + '</span></div>' +
      '<div class="stat warn"><span class="k">На этой неделе</span><span class="v">' + stats.week + '</span></div>' +
      '<div class="stat info"><span class="k">Напоминаний</span><span class="v">' + stats.rem + '</span></div>' +
      '<div class="stat ok"><span class="k">Закрыто в срок</span><span class="v">' + stats.done + '%</span></div></div>' +

      '<div class="cal-bar">' +
        '<button class="ibtn" data-act="calPrev" aria-label="Предыдущий месяц">' + icon('chevL') + '</button>' +
        '<span class="cal-title">' + MONTHS[MONTH] + ' ' + YEAR + '</span>' +
        '<button class="ibtn" data-act="calNext" aria-label="Следующий месяц">' + icon('chevR') + '</button>' +
        '<div class="grow"></div>' +
        '<span class="legend">' +
          '<span class="att"><i class="dot dot-bad"></i> просрочено</span>' +
          '<span class="att"><i class="dot dot-warn"></i> низкая уверенность</span>' +
          '<span class="att"><i class="dot dot-info"></i> в срок</span>' +
        '</span>' +
      '</div>' +

      '<div class="cal-month rv">' +
        '<div class="cal-head">' + WD.map(w => '<span>' + w + '</span>').join('') + '</div>' +
        '<div class="cal-grid" id="cal-this">' + cells + '</div>' +
      '</div>' +

      '<div class="card rv" style="margin-top:16px"><div class="card-h"><div class="h3 grow">Ближайшие сроки</div>' +
      '<span class="tiny muted">' + R2.length + ' записей</span></div>' +
      '<div class="card-b cal-list" style="padding:0">' +
      R2.slice(0, 6).map(r => {
        const over = r.status === 'waiting_supplier';
        return '<div class="row">' +
          '<span class="badge ' + (over ? 'b-bad' : 'b-info') + '">' + (over ? T.overdue : 'в срок') + '</span>' +
          '<div class="grow"><div class="small" style="font-weight:600">' + esc(r.client.name) + ' · № 2026-' + r.number + '</div>' +
          '<div class="tiny muted">' + esc(r.subject) + '</div></div>' +
          '<span class="small muted nowrap">' + U.dOnly(r.receivedAt) + '</span>' +
          U.statusBadge(r.status) +
          '<button class="btn sm" data-act="openReq" data-k="' + r.id + '">Открыть</button></div>';
      }).join('') + '</div></div>' +
    '</div>';
  };


  /* ============================================================ ПРАЙСЫ (Э1 настройки) */
  R.pricelists = function () {
    const pl = DB.pricelists;
    const ST = { ok: ['b-ok', 'ОК'], warn: ['b-warn', 'Есть ошибки'], stale: ['b-bad', 'Не обновлялся 9 дней'],
      error: ['b-bad', 'Ошибка импорта'] };
    const stMap = new Proxy(ST, { get: (t, k) => t[k] || ['b-neutral', String(k)] });
    return '<div class="content">' +
      head('Прайсы и номенклатура', 'Файлы на Яндекс Диске, статус синхронизации и сопоставление колонок',
        '<button class="btn" data-act="openMapping">' + icon('cols', 'ic-sm') + ' ' + T.mapping + '</button>' +
        '<button class="btn primary" data-act="syncAll">' + icon('refresh', 'ic-sm') + ' ' + T.syncNow + '</button>') +
      '<div class="grid rv" style="grid-template-columns:repeat(auto-fit,minmax(190px,1fr));margin-bottom:16px">' +
      '<div class="stat"><span class="k">Источников</span><span class="v">' + pl.length + '</span></div>' +
      '<div class="stat info"><span class="k">Строк всего</span><span class="v">' + pl.reduce((a, p) => a + p.rows, 0).toLocaleString('ru-RU') + '</span></div>' +
      '<div class="stat warn"><span class="k">С ошибками</span><span class="v">' + pl.filter(p => p.status !== 'ok').length + '</span></div>' +
      '<div class="stat ok"><span class="k">Найдено по артикулу</span><span class="v">4 812</span></div></div>' +
      card('Источники прайсов', '', '<button class="btn sm" data-act="openFindArticle">' + icon('search', 'ic-sm') + ' ' + T.findArticle + '</button>',
        '<div class="tscroll"><table class="tbl" style="min-width:940px"><thead><tr>' +
        '<th>Прайс</th><th>Поставщик</th><th>Валюта</th><th>Строк</th><th>' + T.lastSync + '</th><th>Статус</th><th class="act"></th></tr></thead><tbody>' +
        pl.map(p => '<tr><td><b>' + esc(p.name) + '</b></td><td class="small">' + esc(p.supplier) + '</td>' +
          '<td><span class="badge b-neutral">' + esc(p.currency) + '</span></td><td class="num">' + p.rows.toLocaleString('ru-RU') + '</td>' +
          '<td class="small nowrap">' + U.dt(p.syncedAt) + '</td>' +
          '<td><span class="badge ' + stMap[p.status][0] + '">' + stMap[p.status][1] + '</span></td>' +
          '<td class="act"><div class="row" style="gap:4px">' +
          '<button class="btn sm" data-act="syncOne" data-k="' + p.id + '">' + icon('refresh', 'ic-sm') + ' Синхр.</button>' +
          '<button class="btn sm ghost" data-act="openImportReport" data-k="' + p.id + '">Отчёт</button></div></td></tr>').join('') +
        '</tbody></table></div>' +
        '<div class="mcards">' + pl.map(p => '<button class="mcard" data-act="syncOne" data-k="' + p.id + '">' +
          '<div class="mc-top"><div><div class="mc-t">' + esc(p.name) + '</div><div class="mc-s">' + esc(p.supplier) + '</div></div>' +
          '<span class="badge ' + stMap[p.status][0] + '">' + stMap[p.status][1] + '</span></div>' +
          '<div class="mc-row"><span>Строк <b>' + p.rows.toLocaleString('ru-RU') + '</b></span><span>Валюта <b>' + esc(p.currency) + '</b></span>' +
          '<span>Обновлён <b>' + U.dOnly(p.syncedAt) + '</b></span></div></button>').join('') + '</div>') +
      '<div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(320px,1fr));margin-top:16px">' +
      card('Ассортиментная матрица', 'Артикул → категория, ручная правка', '',
        '<div class="tscroll"><table class="tbl" style="min-width:0"><thead><tr><th>Артикул</th><th>Наименование</th><th>Категория</th></tr></thead><tbody>' +
        window.MOCK.NAMES.slice(0, 8).map(n => '<tr><td class="mono small">' + n[0] + '</td><td class="small">' + esc(n[1]) + '</td>' +
          '<td><select class="cell-sel" data-act-change="setMatrixCat" data-id="' + n[0] + '">' +
          window.MOCK.CATS.map(c => '<option' + (c === n[2] ? ' selected' : '') + '>' + c + '</option>').join('') + '</select></td></tr>').join('') +
        '</tbody></table></div>') +
      '</div>' +
      dlgImport() + dlgMapping() + dlgFind() + '</div>';
  };
  function dlgImport() {
    return '<div class="dlg" id="dlgImport" role="dialog" aria-modal="true" aria-label="' + T.importReport + '">' +
      '<div class="dlg-h"><b class="h2">' + T.importReport + '</b><div class="grow"></div>' +
      '<button class="ibtn" data-act="closeDlg" data-k="dlgImport" aria-label="' + T.close + '">' + icon('x') + '</button></div>' +
      '<div class="dlg-b"><div id="impBody"></div></div>' +
      '<div class="dlg-f"><button class="btn" data-act="closeDlg" data-k="dlgImport">' + T.close + '</button></div></div>';
  }
  function dlgMapping() {
    const cols = ['A','B','C','D','E','F','G'];
    return '<div class="dlg" id="dlgMapping" role="dialog" aria-modal="true" aria-label="' + T.mapping + '">' +
      '<div class="dlg-h"><b class="h2">' + T.mapping + '</b><div class="grow"></div>' +
      '<button class="ibtn" data-act="closeDlg" data-k="dlgMapping" aria-label="' + T.close + '">' + icon('x') + '</button></div>' +
      '<div class="dlg-b"><div class="fhint" style="margin-bottom:12px">Укажите, какая колонка файла содержит артикул, наименование, цену и валюту. Настройки сохраняются для каждого прайса.</div>' +
      [['Артикул','art','A'],['Наименование','name','B'],['Бренд','brand','C'],['Цена','price','F'],['Валюта','cur','G'],['Кол-во','qty','D']].map(f =>
        '<div class="field"><label>' + f[0] + '</label><select class="inp" data-act-change="setMap" data-id="' + f[1] + '">' +
        cols.map(c => '<option' + (c === f[2] ? ' selected' : '') + '>Колонка ' + c + '</option>').join('') + '</select></div>').join('') +
      '<div class="row" style="margin-top:6px"><span class="badge b-ok">' + icon('check', 'ic-sm') + ' Все обязательные поля найдены</span></div>' +
      '</div><div class="dlg-f"><button class="btn" data-act="closeDlg" data-k="dlgMapping">' + T.cancel + '</button>' +
      '<button class="btn primary" data-act="saveMapping">' + T.save + '</button></div></div>';
  }
  function dlgFind() {
    return '<div class="dlg narrow" id="dlgFind" role="dialog" aria-modal="true" aria-label="' + T.findArticle + '">' +
      '<div class="dlg-h"><b class="h2">' + T.findArticle + '</b><div class="grow"></div>' +
      '<button class="ibtn" data-act="closeDlg" data-k="dlgFind" aria-label="' + T.close + '">' + icon('x') + '</button></div>' +
      '<div class="dlg-b"><div class="field"><label>Артикул</label>' +
      '<input class="inp" id="faQ" data-edit="findArticle" placeholder="например, Р-1001" value="Р-1001"></div>' +
      '<div id="faBody" class="small muted">Введите артикул — покажем, в каких прайсах он найден, цена и дата прайса.</div></div>' +
      '<div class="dlg-f"><button class="btn" data-act="closeDlg" data-k="dlgFind">' + T.close + '</button>' +
      '<button class="btn primary" data-act="runFindArticle">' + icon('search', 'ic-sm') + ' Найти</button></div></div>';
  }

  /* ============================================================ ПРАВИЛА РАСЧЁТА (Э1) */
  R.pricing = function () {
    return '<div class="content">' +
      head('Правила расчёта', 'Пошлина по категориям, наценка, курсы и калькулятор-проверка',
        '<button class="btn" data-act="exportRules">' + icon('download', 'ic-sm') + ' ' + T.exportXls + '</button>' +
        '<button class="btn primary" data-act="saveRules">' + icon('save', 'ic-sm') + ' ' + T.save + '</button>') +
      '<div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(330px,1fr))">' +
      card('Категории, пошлина и наценка', 'Изменения логируются и применяются к новым КП', '',
        '<div class="tscroll"><table class="tbl" style="min-width:0"><thead><tr><th>Категория</th><th>' + T.dutyPct + '</th><th>' + T.markup + '</th></tr></thead><tbody>' +
        DB.rules.map((r, i) => '<tr><td><b>' + esc(r.cat) + '</b></td>' +
          '<td><input class="cell-in mono" type="number" step="0.5" data-edit="setDuty" data-id="' + i + '" value="' + r.duty + '"></td>' +
          '<td><input class="cell-in mono" type="number" step="0.5" data-edit="setMarkup" data-id="' + i + '" value="' + r.markup + '"></td></tr>').join('') +
        '</tbody></table></div>') +
      card('Валюты и курсы', 'Источник курса: ЦБ РФ + надбавка', '',
        '<div class="tscroll"><table class="tbl" style="min-width:0"><thead><tr><th>Валюта</th><th>Курс, ₽</th><th>Надбавка</th><th>Итог</th></tr></thead><tbody>' +
        DB.rates.map((r, i) => '<tr><td><b>' + r.code + '</b></td>' +
          '<td><input class="cell-in mono" type="number" step="0.01" data-edit="setRate" data-id="' + i + '" value="' + r.rate + '"></td>' +
          '<td class="num small">0%</td><td class="num" id="rate-out-' + i + '">' + U.num(r.rate) + ' ₽</td></tr>').join('') +
        '</tbody></table></div>' +
        '<div class="field" style="margin-top:12px"><label>' + T.rateSource + '</label>' +
        '<select class="inp" data-act-change="setRateSource"><option>ЦБ РФ</option><option>Ручной ввод</option></select></div>' +
        '<div class="field"><label>' + T.rounding + '</label><select class="inp" data-act-change="setRounding">' +
        ['до 1 ₽','до 10 ₽','до 100 ₽','без округления'].map(o => '<option' + (o === 'до 100 ₽' ? ' selected' : '') + '>' + o + '</option>').join('') +
        '</select></div>') +
      card('Калькулятор-проверка', 'Введите цену поставщика — увидите расчёт по шагам', '',
        '<div class="field"><label>Цена поставщика</label><input class="inp" id="cPrice" type="number" step="0.01" value="120"></div>' +
        '<div class="field"><label>Валюта</label><select class="inp" id="cCur"><option>USD</option><option>EUR</option><option>INR</option></select></div>' +
        '<div class="field"><label>Категория</label><select class="inp" id="cCat">' +
        window.MOCK.CATS.map(c => '<option' + (c === 'Реактивы' ? ' selected' : '') + '>' + c + '</option>').join('') + '</select></div>' +
        '<div class="field"><label>Количество</label><input class="inp" id="cQty" type="number" value="3"></div>' +
        '<button class="btn primary wide" data-act="runCalc">' + icon('calc', 'ic-sm') + ' Рассчитать</button>' +
        '<div id="calcOut" style="margin-top:12px"></div>') +
      '</div></div>';
  };

  /* ============================================================ ШАБЛОНЫ (Э1) */
  let TPL = 0;
  const TPLS = [
    ['КП клиенту', 'Тема: КП-{номер_КП} — {клиент}', 'Добрый день!\n\nНаправляем коммерческое предложение по вашему запросу.\nВложение: КП в формате XLS.\n\nСрок действия: 14 дней.\n\nС уважением,\n{менеджер}'],
    ['Запрос артикула', 'Тема: Уточнение артикулов по запросу', 'Добрый день!\n\nДля точного расчёта уточните, пожалуйста, артикулы по позициям:\n{артикулы}\n\nС уважением,\n{менеджер}'],
    ['Запрос поставщику (EN)', 'Subject: Quotation request — {артикулы}', 'Dear colleagues,\n\nPlease provide a quotation for the following items:\n{артикулы}\n\nPlease specify the delivery time and payment terms.\n\nKind regards,\nProcurement Department'],
    ['Напоминание поставщику', 'Subject: Reminder — quotation request', 'Dear colleagues,\n\nKind reminder regarding our quotation request sent on {дата}.\nCould you please provide the pricing?\n\nKind regards,\nProcurement Department'],
    ['Отказ клиенту', 'Тема: По запросу {номер_КП}', 'Добрый день!\n\nК сожалению, по позиции {артикулы} поставка невозможна: производитель снял её с производства.\n\nПредлагаем аналог — напишите, подойдёт ли.\n\nС уважением,\n{менеджер}'],
    ['Follow-up клиенту', 'Тема: Напоминание по КП-{номер_КП}', 'Добрый день!\n\nНапоминаем о направленном КП по вашему запросу.\nДействует до {дата}. Подскажите, нужно ли скорректировать состав?\n\nС уважением,\n{менеджер}']
  ];
  R.templates = function () {
    const t = TPLS[TPL];
    return '<div class="content">' +
      head('Шаблоны', 'Письма с переменными и шаблоны документов',
        '<button class="btn" data-act="tplNew">' + icon('plus', 'ic-sm') + ' Новый шаблон</button>' +
        '<button class="btn primary" data-act="tplSave">' + icon('save', 'ic-sm') + ' ' + T.save + '</button>') +
      '<div class="tabs rv" style="margin-bottom:14px">' + TPLS.map((x, i) =>
        '<button class="tab' + (i === TPL ? ' on' : '') + '" data-act="tplPick" data-k="' + i + '">' + esc(x[0]) + '</button>').join('') + '</div>' +
      '<div class="grid" style="grid-template-columns:minmax(0,1.4fr) minmax(280px,1fr)">' +
      card('Редактор шаблона', t[0], '',
        '<div class="field"><label>Тема</label><input class="inp" data-edit="tplSubject" value="' + esc(t[1]) + '"></div>' +
        '<div class="field"><label>Текст письма</label><textarea class="inp" id="tplBody" data-edit="tplBody" style="min-height:230px">' + esc(t[2]) + '</textarea></div>' +
        '<div class="fhint">Переменные вставляются из списка справа. В шаблоне есть автоподстановка из карточки запроса.</div>' +
        '<div class="row" style="margin-top:11px;gap:8px"><button class="btn" data-act="tplPreview">' + icon('eye', 'ic-sm') + ' ' + T.preview + '</button>' +
        '<button class="btn" data-act="aiTpl" data-k="polite">' + icon('sparkles', 'ic-sm') + ' ' + T.aiEdit + '</button>' +
        '<button class="btn" data-act="tplTest">' + icon('mail', 'ic-sm') + ' Тестовое письмо</button></div>') +
      '<div class="col" style="gap:14px">' +
      card('Переменные', '', '',
        '<div class="col" style="gap:6px">' + ['{клиент}','{номер_КП}','{артикулы}','{менеджер}','{дата}','{сумма}','{срок_поставки}','{условия_оплаты}'].map(v =>
          '<button class="btn sm" style="justify-content:flex-start" data-act="tplInsert" data-k="' + esc(v) + '">' + icon('plus', 'ic-sm') + ' ' + esc(v) + '</button>').join('') +
        '</div>') +
      card('Шаблоны документов', 'XLS-шаблоны КП и спецификации', '',
        '<div class="col" style="gap:8px">' +
        ['КП (XLS) — 12 полей','Спецификация (XLS) — 9 полей'].map(d => '<div class="att"><span style="color:var(--ok)">' + icon('check', 'ic-sm') + '</span>' +
          '<span class="grow small" style="font-weight:600">' + d + '</span></div>').join('') +
        '</div><div class="fhint" style="margin-top:10px">Все обязательные поля найдены при проверке шаблона.</div>' +
        '<button class="btn wide" style="margin-top:11px" data-act="tplUpload">' + icon('upload', 'ic-sm') + ' Загрузить шаблон</button>') +
      '</div></div>' +
      dlgTplPreview() + '</div>';
  };
  function dlgTplPreview() {
    return '<div class="dlg" id="dlgTpl" role="dialog" aria-modal="true" aria-label="' + T.preview + '">' +
      '<div class="dlg-h"><b class="h2">' + T.preview + ' с тестовыми данными</b><div class="grow"></div>' +
      '<button class="ibtn" data-act="closeDlg" data-k="dlgTpl" aria-label="' + T.close + '">' + icon('x') + '</button></div>' +
      '<div class="dlg-b"><div id="tplOut"></div></div>' +
      '<div class="dlg-f"><button class="btn" data-act="closeDlg" data-k="dlgTpl">' + T.close + '</button>' +
      '<button class="btn primary" data-act="tplTest">' + icon('send', 'ic-sm') + ' Отправить тест</button></div></div>';
  }

  /* ============================================================ ПОЛЬЗОВАТЕЛИ (Э1) */
  R.users = function () {
    const roleMap = { manager: ['b-info', T.manager], head: ['b-neutral', T.head], admin: ['b-warn', T.admin] };
    return '<div class="content">' +
      head('Пользователи и роли', DB.users.length + ' пользователей · приглашение по email и блокировка',
        '<button class="btn" data-act="exportUsers">' + icon('download', 'ic-sm') + ' ' + T.exportXls + '</button>' +
        '<button class="btn primary" data-act="openInvite">' + icon('userPlus', 'ic-sm') + ' ' + T.invite + '</button>') +
      '<div class="tw rv"><div class="tscroll desk"><table class="tbl" style="min-width:900px"><thead><tr>' +
      '<th>Имя</th><th>Email</th><th>' + T.role + '</th><th>' + T.lastLogin + '</th><th>Статус</th><th class="act"></th></tr></thead><tbody>' +
      DB.users.map(u => '<tr>' +
        '<td class="row" style="gap:9px"><span class="ava" style="width:30px;height:30px;font-size:11px">' + esc(initials(u.name)) + '</span><b>' + esc(u.name) + '</b></td>' +
        '<td class="mono small">' + esc(u.email) + '</td>' +
        '<td><span class="badge ' + roleMap[u.role][0] + '">' + roleMap[u.role][1] + '</span></td>' +
        '<td class="small nowrap">' + esc(u.lastLogin) + '</td>' +
        '<td>' + (u.status === 'active' ? '<span class="badge b-ok"><i class="bd"></i>Активен</span>' : '<span class="badge b-bad"><i class="bd"></i>Заблокирован</span>') + '</td>' +
        '<td class="act"><div class="row" style="gap:4px">' +
        '<button class="btn sm" data-act="userRole" data-k="' + u.id + '">' + icon('key', 'ic-sm') + ' ' + T.roleChange + '</button>' +
        '<button class="btn sm' + (u.status === 'active' ? ' danger' : '') + '" data-act="userBlock" data-k="' + u.id + '">' + icon(u.status === 'active' ? 'ban' : 'check', 'ic-sm') + ' ' + (u.status === 'active' ? T.block : T.unblock) + '</button>' +
        '</div></td></tr>').join('') +
      '</tbody></table></div>' +
      '<div class="mcards">' + DB.users.map(u => '<button class="mcard" data-act="userRole" data-k="' + u.id + '">' +
        '<div class="mc-top"><div><div class="mc-t">' + esc(u.name) + '</div><div class="mc-s mono">' + esc(u.email) + '</div></div>' +
        '<span class="badge ' + roleMap[u.role][0] + '">' + roleMap[u.role][1] + '</span></div>' +
        '<div class="mc-row"><span>Вход <b>' + esc(u.lastLogin) + '</b></span><span>Статус <b>' + (u.status === 'active' ? 'активен' : 'заблокирован') + '</b></span></div></button>').join('') + '</div></div>' +
      dlgInvite() + dlgUserRole() + '</div>';
  };
  const initials = n => String(n).split(/\s+/).map(x => x[0]).slice(0, 2).join('').toUpperCase();
  function dlgInvite() {
    return '<div class="dlg narrow" id="dlgInvite" role="dialog" aria-modal="true" aria-label="' + T.invite + '">' +
      '<div class="dlg-h"><b class="h2">' + T.invite + '</b><div class="grow"></div>' +
      '<button class="ibtn" data-act="closeDlg" data-k="dlgInvite" aria-label="' + T.close + '">' + icon('x') + '</button></div>' +
      '<div class="dlg-b">' +
      '<div class="field"><label>Email</label><input class="inp" id="invEmail" placeholder="name@neeklo-lab.ru"></div>' +
      '<div class="field"><label>Имя</label><input class="inp" id="invName" placeholder="Имя и фамилия"></div>' +
      '<div class="field"><label>' + T.role + '</label><select class="inp" id="invRole"><option value="manager">' + T.manager + '</option><option value="head">' + T.head + '</option><option value="admin">' + T.admin + '</option></select></div>' +
      '<div class="fhint">' + icon('mail', 'ic-sm') + ' Приглашение уйдёт на указанный email со ссылкой для входа.</div>' +
      '</div><div class="dlg-f"><button class="btn" data-act="closeDlg" data-k="dlgInvite">' + T.cancel + '</button>' +
      '<button class="btn primary" data-act="invitesend">' + icon('send', 'ic-sm') + ' ' + T.inviteSend + '</button></div></div>';
  }
  function dlgUserRole() {
    return '<div class="dlg narrow" id="dlgUserRole" role="dialog" aria-modal="true" aria-label="' + T.roleChange + '">' +
      '<div class="dlg-h"><b class="h2">' + T.roleChange + '</b><div class="grow"></div>' +
      '<button class="ibtn" data-act="closeDlg" data-k="dlgUserRole" aria-label="' + T.close + '">' + icon('x') + '</button></div>' +
      '<div class="dlg-b"><div id="urBody"></div>' +
      '<div class="field" style="margin-top:12px"><label>Новая роль</label><select class="inp" id="urSel">' +
      '<option value="manager">' + T.manager + '</option><option value="head">' + T.head + '</option><option value="admin">' + T.admin + '</option></select></div>' +
      '</div><div class="dlg-f"><button class="btn" data-act="closeDlg" data-k="dlgUserRole">' + T.cancel + '</button>' +
      '<button class="btn primary" data-act="userRoleApply">' + T.save + '</button></div></div>';
  }

  /* ============================================================ ЖУРНАЛ (Э1) */
  const AF = { user: '', action: '', period: '' };
  R.audit = function () {
    let rows = DB.audit.slice();
    if (AF.user) rows = rows.filter(r => r.actor === AF.user);
    if (AF.action) rows = rows.filter(r => r.action === AF.action);
    const acts = Array.from(new Set(DB.audit.map(r => r.action)));
    return '<div class="content">' +
      head('Журнал действий', rows.length + ' записей · только чтение',
        '<button class="btn" data-act="auditReset">' + icon('rotate', 'ic-sm') + ' ' + T.reset + '</button>' +
        '<button class="btn" data-act="exportAudit">' + icon('download', 'ic-sm') + ' ' + T.exportXls + '</button>') +
      '<div class="tw rv"><div class="toolbar"><div class="filters desk">' +
      '<select class="sel" data-act-change="auditUser" aria-label="Пользователь"><option value="">Пользователь: все</option>' +
      ['Система'].concat(window.MOCK.MANAGERS.map(m => m[1])).map(u => '<option value="' + esc(u) + '"' + (AF.user === u ? ' selected' : '') + '>' + esc(u) + '</option>').join('') + '</select>' +
      '<select class="sel" data-act-change="auditAction" aria-label="Тип действия"><option value="">Действие: все</option>' +
      acts.map(a => '<option value="' + esc(a) + '"' + (AF.action === a ? ' selected' : '') + '>' + esc(a) + '</option>').join('') + '</select>' +
      '<select class="sel" data-act-change="auditPeriod" aria-label="Период"><option value="">Период: весь</option>' +
      ['1','7','30'].map(p => '<option value="' + p + '"' + (AF.period === p ? ' selected' : '') + '>' + p + ' дн.</option>').join('') + '</select>' +
      '</div><button class="btn sheet-btn" data-act="auditSheet">' + icon('filter', 'ic-sm') + ' ' + T.filters + '</button>' +
      '<div class="grow"></div><span class="tiny muted">' + icon('lock', 'ic-sm') + ' Журнал нельзя изменить</span></div>' +
      '<div class="tscroll desk"><table class="tbl" style="min-width:820px"><thead><tr>' +
      '<th>Время</th><th>Пользователь</th><th>Действие</th><th>Объект</th></tr></thead><tbody>' +
      rows.slice(0, 40).map(r => '<tr><td class="small nowrap mono">' + esc(r.at) + '</td>' +
        '<td class="small">' + (r.actor === 'Система' ? '<span class="badge b-info">Система</span>' : esc(r.actor)) + '</td>' +
        '<td class="small">' + esc(r.action) + '</td>' +
        '<td class="small"><button class="btn sm ghost" data-act="auditOpen" data-k="' + esc(r.object) + '">' + esc(r.object) + '</button></td></tr>').join('') +
      '</tbody></table></div>' +
      '<div class="mcards">' + rows.slice(0, 20).map(r => '<div class="mcard">' +
        '<div class="mc-top"><div><div class="mc-t">' + esc(r.action) + '</div><div class="mc-s">' + esc(r.object) + '</div></div>' +
        '<span class="badge b-neutral">' + esc(r.at.split(' ')[1]) + '</span></div>' +
        '<div class="mc-row"><span>Кто <b>' + esc(r.actor) + '</b></span><span>Дата <b>' + esc(r.at.split(' ')[0]) + '</b></span></div></div>').join('') + '</div></div></div>';
  };
  window.__views2 = { CALSET: function (v) { if (v !== undefined) CALW = v; return CALW; }, CSEL: function (v) { if (v !== undefined) SUPSEL = v; return SUPSEL; }, TPL: function (v) { if (v !== undefined) TPL = v; return TPL; }, TPLS: TPLS, AF: AF };
})();
