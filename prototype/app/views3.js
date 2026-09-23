/* Экраны 3: Спецификации (мастер), Аналитика, Рассылки NEWS, Подключения, Вход. */
(function () {
  'use strict';
  const U = window.UI, T = U.T, DB = U.DB, esc = U.esc, icon = U.icon;
  const R = U.RENDERERS, toast = U.toast;
  const v1 = window.__views1, v2 = window.__views2;
  const head = v1.head, card = v1.card;

  /* ============================================================ СПЕЦИФИКАЦИИ (мастер, Э3) */
  R.specs = function () {
    const step = U.F.spec.step;
    const steps = ['Выбор PO', 'Свод позиций', 'Предпросмотр'];
    const pos = specPositions();
    return '<div class="content">' +
      head('Спецификации', 'Мастер из 3 шагов: PO → свод → предпросмотр с факсимиле',
        '<button class="btn" data-act="exportSpecs">' + icon('download', 'ic-sm') + ' ' + T.exportXls + '</button>' +
        '<button class="btn primary" data-act="specNew">' + icon('plus', 'ic-sm') + ' ' + T.createSpec + '</button>') +
      '<div class="card rv" style="margin-bottom:14px"><div class="card-b">' +
        '<div class="row" style="gap:0">' + steps.map((s, i) => {
          const n = i + 1, on = n === step, done = n < step;
          return '<div class="row grow" style="gap:8px">' +
            '<button class="row grow" data-act="specStep" data-k="' + n + '" style="gap:9px;justify-content:flex-start;min-height:44px">' +
            '<span style="width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;' +
            (on ? 'background:var(--accent);color:#fff' : done ? 'background:var(--ok-bg);color:var(--ok)' : 'background:var(--surface-3);color:var(--muted)') + '">' +
            (done ? icon('check', 'ic-sm') : n) + '</span>' +
            '<span class="' + (on ? 'h3' : 'small') + (on ? '' : ' muted') + '">' + esc(s) + '</span></button>' +
            (i < steps.length - 1 ? '<span style="width:100%;max-width:60px;height:1px;background:var(--line-2);align-self:center"></span>' : '') +
            '</div>';
        }).join('') + '</div></div></div>' +

      (step === 1 ? specStep1() : step === 2 ? specStep2(pos) : specStep3(pos)) +

      card('Созданные спецификации', DB.specs.length + ' документов с версиями', '',
        '<div class="tscroll"><table class="tbl" style="min-width:860px"><thead><tr>' +
        '<th>Номер</th><th>Клиент</th><th>Дата</th><th>Позиций</th><th>Версия</th><th>Статус</th><th class="act"></th></tr></thead><tbody>' +
        DB.specs.map(s => '<tr><td class="mono">' + esc(s.number) + '</td><td>' + esc(s.client) + '</td>' +
          '<td class="small nowrap">' + esc(s.date) + '</td><td class="num">' + s.positions + '</td>' +
          '<td><span class="badge b-neutral">v' + s.version + '</span></td>' +
          '<td>' + (s.status === 'sent' ? '<span class="badge b-ok"><i class="bd"></i>Отправлена</span>' : '<span class="badge b-warn"><i class="bd"></i>Черновик</span>') + '</td>' +
          '<td class="act"><div class="row" style="gap:4px">' +
          '<button class="btn sm" data-act="specView" data-k="' + s.id + '">' + icon('eye', 'ic-sm') + ' Просмотр</button>' +
          '<button class="btn sm" data-act="specExport" data-k="' + s.id + '">' + icon('download', 'ic-sm') + '</button>' +
          '<button class="btn sm ghost" data-act="specVer" data-k="' + s.id + '">Версии</button></div></td></tr>').join('') +
        '</tbody></table></div>') +
      dlgSpec() + '</div>';
  };
  function specPositions() {
    const r = DB.requests[3] || DB.requests[0];
    return (r.positions || []).map((p, i) => ({
      article: p.article || '—', name: p.name, qty: p.qty + (i % 2), unit: p.unit,
      price: p.clientPriceRub || 12300, sum: (p.clientPriceRub || 12300) * (p.qty + (i % 2)),
      diff: i % 3 === 1
    }));
  }
  function specStep1() {
    const mails = DB.requests.slice(0, 5);
    return '<div class="grid rv" style="grid-template-columns:minmax(0,1.2fr) minmax(300px,1fr)">' +
      card(T.step1, 'Загрузите PO или выберите письмо', '',
        '<div style="border:2px dashed var(--line-2);border-radius:var(--r);padding:26px;text-align:center">' +
        '<span style="color:var(--accent);display:inline-block">' + icon('upload') + '</span>' +
        '<div class="h3" style="margin-top:9px">Перетащите PO сюда</div>' +
        '<div class="fhint" style="margin-top:4px">Поддерживаются XLS, XLSX, PDF. Файл разбирается и позиции попадают в свод.</div>' +
        '<button class="btn primary" style="margin-top:12px" data-act="specUpload">' + icon('folder', 'ic-sm') + ' Выбрать файл</button></div>' +
        '<div class="small muted" style="margin:16px 0 8px">Или выберите письмо с PO</div>' +
        '<div class="col" style="gap:8px">' + mails.map(m => '<button class="att" style="width:100%" data-act="specPickMail" data-k="' + m.id + '">' +
          '<span style="color:var(--accent)">' + icon('mailOpen', 'ic-sm') + '</span>' +
          '<span class="grow"><span class="small" style="font-weight:600">' + esc(m.client.name) + '</span>' +
          '<span class="tiny muted" style="display:block">' + esc(m.subject) + ' · ' + U.dOnly(m.receivedAt) + ' · ' + m.positionsCount + ' поз.</span></span>' +
          icon('chevR', 'ic-sm') + '</button>').join('') + '</div>') +
      '<div class="col" style="gap:14px">' +
      card('Что будет дальше', '', '<div class="col" style="gap:9px">' +
        [['grid','Позиции PO объединяются по артикулу'],['alertT','Расхождения цен подсвечиваются'],['printer','Готовый документ с печатью и подписью']].map(x =>
          '<div class="row" style="gap:10px"><span style="color:var(--accent)">' + icon(x[0], 'ic-sm') + '</span><span class="small grow">' + x[1] + '</span></div>').join('') +
        '</div>') +
      '</div></div>';
  }
  function specStep2(pos) {
    return '<div class="grid rv" style="grid-template-columns:minmax(0,1.6fr) minmax(280px,1fr)">' +
      '<div class="tw"><div class="toolbar"><span class="small muted">' + T.mergeQty + ' · ' + T.discrepancies + ' подсвечены</span>' +
      '<div class="grow"></div><button class="btn sm" data-act="specBack">' + icon('arrowLeft', 'ic-sm') + ' ' + T.back + '</button>' +
      '<button class="btn sm primary" data-act="specStep" data-k="3">Далее · предпросмотр' + icon('arrowRight', 'ic-sm') + '</button></div>' +
      '<div class="tscroll"><table class="tbl" style="min-width:760px"><thead><tr>' +
      '<th>Артикул</th><th>Наименование</th><th>Кол-во</th><th>Ед.</th><th>Цена</th><th>Сумма</th><th>Расхождение</th></tr></thead><tbody>' +
      pos.map((p, i) => '<tr class="' + (p.diff ? 'low' : '') + '">' +
        '<td class="mono small">' + esc(p.article) + '</td><td>' + esc(p.name) + '</td>' +
        '<td class="num">' + p.qty + '</td><td>' + esc(p.unit) + '</td>' +
        '<td class="num">' + U.money(p.price) + '</td><td class="num">' + U.money(p.sum) + '</td>' +
        '<td>' + (p.diff ? '<span class="badge b-warn">разные цены на артикул</span>' : '<span class="badge b-ok">совпадает</span>') + '</td></tr>').join('') +
      '</tbody></table></div>' +
      '<div class="pager"><span class="small muted">' + pos.length + ' позиций после объединения</span>' +
      '<span class="h3">Итого: ' + U.money(pos.reduce((a, p) => a + p.sum, 0)) + '</span></div></div>' +
      '<div class="col" style="gap:14px">' +
      card('Расхождения', pos.filter(p => p.diff).length + ' позиций с разными ценами', '',
        '<div class="col" style="gap:8px">' + (pos.filter(p => p.diff).length ? pos.filter(p => p.diff).map(p =>
          '<div class="card pad" style="background:var(--warn-bg);border-color:var(--warn)">' +
          '<div class="small" style="font-weight:600">' + esc(p.name) + '</div>' +
          '<div class="tiny muted">В PO разные цены на один артикул. Выберите, какая верна.</div>' +
          '<div class="row" style="gap:6px;margin-top:8px"><button class="btn sm" data-act="specPickPrice" data-k="low">Меньшая</button>' +
          '<button class="btn sm primary" data-act="specPickPrice" data-k="high">Большая</button></div></div>').join('')
          : '<div class="small muted">Расхождений нет.</div>') + '</div>') +
      '</div></div>';
  }
  function specStep3(pos) {
    return '<div class="grid rv" style="grid-template-columns:minmax(0,1.5fr) minmax(290px,1fr)">' +
      card('Предпросмотр по шаблону', 'Факсимиле подписи и печати', '',
        '<div class="card" style="border:1px solid var(--line-2);padding:22px">' +
        '<div class="row sp"><div><div class="h2">Спецификация СП-2026-0044</div>' +
        '<div class="tiny muted">к договору поставки от 23.09.2026</div></div>' +
        '<div style="text-align:right"><div class="small" style="font-weight:600">neeklo-lab</div><div class="tiny muted">ИНН 7712345678</div></div></div>' +
        '<div class="tscroll" style="margin-top:14px"><table class="tbl" style="min-width:560px"><thead><tr>' +
        '<th>№</th><th>Наименование</th><th>Кол-во</th><th>Цена</th><th>Сумма</th></tr></thead><tbody>' +
        pos.slice(0, 7).map((p, i) => '<tr><td class="mono">' + (i + 1) + '</td><td class="small">' + esc(p.name) + '</td>' +
          '<td class="num">' + p.qty + ' ' + esc(p.unit) + '</td><td class="num">' + U.money(p.price) + '</td>' +
          '<td class="num">' + U.money(p.sum) + '</td></tr>').join('') +
        '</tbody></table></div>' +
        '<div class="row sp" style="margin-top:14px"><span class="h3">Итого</span><span class="h3">' + U.money(pos.reduce((a, p) => a + p.sum, 0)) + '</span></div>' +
        '<div class="row sp" style="margin-top:26px;gap:20px">' +
        '<div><div style="border-bottom:1px solid var(--line-2);width:180px;height:44px;position:relative">' +
          '<span style="position:absolute;bottom:4px;left:8px;color:var(--accent);font-size:26px;font-style:italic;transform:rotate(-8deg);opacity:.75">Клочко Н.</span></div>' +
        '<div class="tiny muted" style="margin-top:4px">подпись поставщика</div></div>' +
        '<div style="width:104px;height:104px;border:2px solid var(--accent);border-radius:50%;display:flex;align-items:center;justify-content:center;text-align:center;color:var(--accent);font-size:10px;font-weight:700;opacity:.72;line-height:1.25">' +
        'neeklo-lab<br>ОТДЕЛ<br>ПРОДАЖ<br>Москва</div></div>' +
        '</div>') +
      '<div class="col" style="gap:14px">' +
      card('Действия', '', '<div class="col" style="gap:8px">' +
        '<button class="btn primary wide" data-act="specSend">' + icon('send', 'ic-sm') + ' Отправить клиенту</button>' +
        '<button class="btn wide" data-act="specExport" data-k="new">' + icon('download', 'ic-sm') + ' Скачать ' + T.downloadXls.replace('XLS','XLS') + '</button>' +
        '<button class="btn wide" data-act="specPrint">' + icon('printer', 'ic-sm') + ' Печать</button>' +
        '<button class="btn wide" data-act="specStep" data-k="2">' + icon('arrowLeft', 'ic-sm') + ' Назад к своду</button>' +
        '</div>') +
      card('Согласование', 'Нужно подтверждение', '<div class="col" style="gap:8px">' +
        '<label class="radio-i"><input type="checkbox" checked style="accent-color:var(--accent)"><span class="small grow">Проверить расхождения цен</span></label>' +
        '<label class="radio-i"><input type="checkbox" checked style="accent-color:var(--accent)"><span class="small grow">Проверить реквизиты клиента</span></label>' +
        '<label class="radio-i"><input type="checkbox" style="accent-color:var(--accent)"><span class="small grow">Согласовать скидку с руководителем</span></label>' +
        '</div><div class="ai-bar" style="margin-top:11px;margin-bottom:0"><span class="ai-t">' + icon('sparkles', 'ic-sm') + ' ИИ</span>' +
        '<button class="btn sm" data-act="specAiCheck">Проверить свод</button></div>') +
      '</div></div>';
  }
  function dlgSpec() {
    return '<div class="dlg" id="dlgSpec" role="dialog" aria-modal="true" aria-label="Спецификация">' +
      '<div class="dlg-h"><b class="h2" id="specTitle">Спецификация</b><div class="grow"></div>' +
      '<button class="ibtn" data-act="closeDlg" data-k="dlgSpec" aria-label="' + T.close + '">' + icon('x') + '</button></div>' +
      '<div class="dlg-b"><div id="specBody"></div></div>' +
      '<div class="dlg-f"><button class="btn" data-act="closeDlg" data-k="dlgSpec">' + T.close + '</button>' +
      '<button class="btn primary" data-act="specExport" data-k="dlg">' + icon('download', 'ic-sm') + ' Скачать</button></div></div>';
  }

  /* ============================================================ АНАЛИТИКА (Э3) */
  let ANPER = '30', ANMGR = '';
  R.analytics = function () {
    const R2 = DB.requests;
    const sent = R2.filter(r => r.quoteTotalRub);
    const won = R2.filter(r => r.status === 'won');
    const sum = R2.reduce((a, r) => a + (r.quoteTotalRub || 0), 0);
    const conv = Math.round(won.length / Math.max(1, sent.length) * 100);
    const byStatus = window.MOCK.STATUS.map(s => ({ s: s[0], label: s[1], tone: s[2], n: R2.filter(r => r.status === s[0]).length }));
    const maxS = Math.max.apply(null, byStatus.map(x => x.n).concat([1]));
    const weeks = [4, 7, 5, 9, 6, 11, 8];
    const maxW = Math.max.apply(null, weeks);
    const arts = {};
    R2.forEach(r => (r.positions || []).forEach(p => { arts[p.name] = (arts[p.name] || 0) + p.qty; }));
    const topArt = Object.keys(arts).map(k => ({ k: k, n: arts[k] })).sort((a, b) => b.n - a.n).slice(0, 8);
    const cli = {};
    R2.forEach(r => { cli[r.client.name] = cli[r.client.name] || { req: 0, sum: 0 }; cli[r.client.name].req++; cli[r.client.name].sum += r.quoteTotalRub || 0; });
    const topCli = Object.keys(cli).map(k => ({ k: k, n: cli[k].req, sum: cli[k].sum })).sort((a, b) => b.n - a.n).slice(0, 8);
    const maxC = Math.max.apply(null, topCli.map(c => c.n).concat([1]));

    return '<div class="content">' +
      head('Аналитика', 'Период и фильтр по менеджеру · любую таблицу можно выгрузить в XLSX',
        '<button class="btn" data-act="exportAnalytics">' + icon('download', 'ic-sm') + ' ' + T.exportXls + '</button>') +
      '<div class="row wrap rv" style="margin-bottom:16px;gap:8px">' +
        '<select class="sel" data-act-change="anPeriod" aria-label="Период">' +
        [['7','7 дней'],['30','30 дней'],['90','90 дней'],['all','Весь период']].map(p =>
          '<option value="' + p[0] + '"' + (ANPER === p[0] ? ' selected' : '') + '>' + p[1] + '</option>').join('') + '</select>' +
        '<select class="sel" data-act-change="anManager" aria-label="Менеджер"><option value="">Все менеджеры</option>' +
        window.MOCK.MANAGERS.map(m => '<option value="' + m[1] + '"' + (ANMGR === m[1] ? ' selected' : '') + '>' + esc(m[1]) + '</option>').join('') + '</select>' +
        '<span class="chip on">' + icon('calendar', 'ic-sm') + ' 22.08–23.09.2026</span>' +
      '</div>' +
      '<div class="grid rv" style="grid-template-columns:repeat(auto-fit,minmax(180px,1fr));margin-bottom:16px">' +
      '<div class="stat"><span class="k">' + T.requestsCount + '</span><span class="v">' + R2.length + '</span></div>' +
      '<div class="stat info"><span class="k">' + T.quotesSent + '</span><span class="v">' + sent.length + '</span></div>' +
      '<div class="stat ok"><span class="k">' + T.conversion + '</span><span class="v">' + conv + '%</span></div>' +
      '<div class="stat warn"><span class="k">' + T.avgTime + '</span><span class="v" style="font-size:22px">38 мин</span></div>' +
      '<div class="stat"><span class="k">' + T.ordersSum + '</span><span class="v" style="font-size:20px">' + U.money(sum) + '</span></div></div>' +

      '<div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(340px,1fr))">' +
      card(T.byWeeks, 'Запросы по неделям', '', '<div class="mini-bar">' +
        weeks.map((w, i) => '<i style="height:' + Math.round(w / maxW * 100) + '%" title="Неделя ' + (i + 1) + ': ' + w + ' запросов"></i>').join('') +
        '</div><div class="legend"><span>' + icon('trending', 'ic-sm') + ' Средний рост +12% за неделю</span></div>') +
      card(T.funnel, 'Распределение по статусам', '', '<div class="col" style="gap:9px">' +
        byStatus.filter(x => x.n).map(x => '<div><div class="row sp" style="margin-bottom:4px">' +
          '<span class="small">' + esc(x.label) + '</span><span class="small muted">' + x.n + '</span></div>' +
          '<div class="prog"><i style="width:' + Math.round(x.n / maxS * 100) + '%"></i></div></div>').join('') + '</div>') +
      card(T.topArticles, 'Повторяющиеся позиции за период', '',
        '<div class="col" style="gap:7px">' + topArt.map(a => '<div class="row" style="gap:10px">' +
          '<span class="grow small ellip">' + esc(a.k) + '</span><b class="small mono">' + a.n + '</b></div>').join('') + '</div>') +
      card(T.topClients, 'По количеству запросов', '',
        '<div class="col" style="gap:9px">' + topCli.map(c => '<div><div class="row sp" style="margin-bottom:4px">' +
          '<span class="small ellip">' + esc(c.k) + '</span><span class="small muted mono">' + c.n + ' · ' + U.money(c.sum) + '</span></div>' +
          '<div class="prog"><i style="width:' + Math.round(c.n / maxC * 100) + '%"></i></div></div>').join('') + '</div>') +
      '</div></div>';
  };

  /* ============================================================ РАССЫЛКИ (Э3) */
  R.newsletters = function () {
    const nl = DB.newsletters;
    const ST = { sent: ['b-ok', 'Отправлена'], queued: ['b-warn', 'В очереди'],
      paused: ['b-neutral', 'На паузе'], draft: ['b-neutral', 'Черновик'], cancelled: ['b-bad', 'Отменена'] };
    const st = k => ST[k] || ['b-neutral', k || '—'];
    const stMap = { sent: st('sent'), queued: st('queued') };
    return '<div class="content">' +
      head('Рассылки NEWS', nl.length + ' рассылок · получатели из файла, пауза и отмена очереди',
        '<button class="btn" data-act="newsImport">' + icon('upload', 'ic-sm') + ' Загрузить получателей</button>' +
        '<button class="btn primary" data-act="newsNew">' + icon('plus', 'ic-sm') + ' Новая рассылка</button>') +
      '<div class="grid rv" style="grid-template-columns:repeat(auto-fit,minmax(190px,1fr));margin-bottom:16px">' +
      '<div class="stat"><span class="k">Рассылок</span><span class="v">' + nl.length + '</span></div>' +
      '<div class="stat ok"><span class="k">' + T.sentOk + '</span><span class="v">' + nl.reduce((a, n) => a + n.sent, 0) + '</span></div>' +
      '<div class="stat bad"><span class="k">' + T.errors + '</span><span class="v">' + nl.reduce((a, n) => a + n.errors, 0) + '</span></div>' +
      '<div class="stat warn"><span class="k">В очереди</span><span class="v">' + nl.filter(n => n.status === 'queued').length + '</span></div>' +
      (nl.filter(n => n.status === 'paused').length ? '<div class="stat"><span class="k">На паузе</span><span class="v">' + nl.filter(n => n.status === 'paused').length + '</span></div>' : '') + '</div>' +
      '<div class="tw rv"><div class="toolbar"><span class="small muted">В очереди сейчас: ' +
      (nl.filter(n => n.status === 'queued')[0] ? esc(nl.filter(n => n.status === 'queued')[0].subject) : 'нет активных') + '</span>' +
      '<div class="grow"></div>' +
      '<button class="btn sm" data-act="newsPause">' + icon('pause', 'ic-sm') + ' ' + T.pauseQueue + '</button>' +
      '<button class="btn sm" data-act="newsCancel">' + icon('ban', 'ic-sm') + ' ' + T.cancelQueue + '</button></div>' +
      '<div class="tscroll desk"><table class="tbl" style="min-width:900px"><thead><tr>' +
      '<th>Тема</th><th>Дата</th><th>' + T.recipients + '</th><th>' + T.sentOk + '</th><th>' + T.errors + '</th><th>Статус</th><th class="act"></th></tr></thead><tbody>' +
      nl.map(n => '<tr><td><b>' + esc(n.subject) + '</b></td><td class="small nowrap">' + esc(n.date) + '</td>' +
        '<td class="num">' + n.total + '</td><td class="num">' + n.sent + '</td>' +
        '<td class="num">' + (n.errors ? '<span style="color:var(--bad);font-weight:600">' + n.errors + '</span>' : '0') + '</td>' +
        '<td><span class="badge ' + st(n.status)[0] + '">' + st(n.status)[1] + '</span></td>' +
        '<td class="act"><div class="row" style="gap:4px">' +
        '<button class="btn sm" data-act="newsOpen" data-k="' + n.id + '">' + icon('eye', 'ic-sm') + ' Открыть</button>' +
        (n.status === 'queued' ? '<button class="btn sm" data-act="newsPause" data-k="' + n.id + '">' + icon('pause', 'ic-sm') + '</button>' +
          '<button class="btn sm danger" data-act="newsCancel" data-k="' + n.id + '">' + icon('ban', 'ic-sm') + '</button>' : '') +
        '</div></td></tr>').join('') +
      '</tbody></table></div>' +
      '<div class="mcards">' + nl.map(n => '<button class="mcard" data-act="newsOpen" data-k="' + n.id + '">' +
        '<div class="mc-top"><div><div class="mc-t">' + esc(n.subject) + '</div><div class="mc-s">' + esc(n.date) + '</div></div>' +
        '<span class="badge ' + st(n.status)[0] + '">' + st(n.status)[1] + '</span></div>' +
        '<div class="mc-row"><span>Всего <b>' + n.total + '</b></span><span>Отправлено <b>' + n.sent + '</b></span>' +
        '<span>Ошибок <b>' + n.errors + '</b></span></div></button>').join('') + '</div></div>' +
      dlgNews() + '</div>';
  };
  function dlgNews() {
    return '<div class="dlg" id="dlgNews" role="dialog" aria-modal="true" aria-label="Рассылка">' +
      '<div class="dlg-h"><b class="h2" id="newsTitle">Рассылка</b><div class="grow"></div>' +
      '<button class="ibtn" data-act="closeDlg" data-k="dlgNews" aria-label="' + T.close + '">' + icon('x') + '</button></div>' +
      '<div class="dlg-b"><div id="newsBody"></div></div>' +
      '<div class="dlg-f"><button class="btn" data-act="newsPause">' + icon('pause', 'ic-sm') + ' ' + T.pauseQueue + '</button>' +
      '<button class="btn danger" data-act="newsCancel">' + icon('ban', 'ic-sm') + ' ' + T.cancelQueue + '</button>' +
      '<button class="btn primary" data-act="newsSend">' + icon('send', 'ic-sm') + ' Отправить очередь</button></div></div>';
  }

  /* ============================================================ ПОДКЛЮЧЕНИЯ (Э3) */
  R.connections = function () {
    return '<div class="content">' +
      head('Подключения', 'Статус и проверка. Секреты не показываются — только «подключено» и дата',
        '<button class="btn primary" data-act="checkAllConn">' + icon('refresh', 'ic-sm') + ' ' + T.checkConn + ' всё</button>') +
      '<div class="grid rv" style="grid-template-columns:repeat(auto-fit,minmax(320px,1fr))">' +
      DB.connections.map(c => '<div class="card pad">' +
        '<div class="row"><span style="color:' + (c.status === 'connected' ? 'var(--ok)' : 'var(--bad)') + '">' +
        icon(c.status === 'connected' ? 'checkCircle' : 'alertC') + '</span>' +
        '<div class="grow"><div class="h3">' + esc(c.name) + '</div>' +
        '<div class="tiny muted mono">' + esc(c.detail) + '</div></div></div>' +
        '<div class="kv" style="margin-top:12px"><dt>Статус</dt><dd>' +
        (c.status === 'connected' ? '<span class="badge b-ok">' + T.connected + '</span>' : '<span class="badge b-bad">Ошибка</span>') + '</dd>' +
        '<dt>Проверено</dt><dd class="small">' + esc(c.checkedAt) + '</dd></div>' +
        (c.status !== 'connected' ? '<div class="card pad" style="margin-top:11px;background:var(--bad-bg);border-color:var(--bad)">' +
          '<div class="small" style="font-weight:600">' + T.lastError + '</div>' +
          '<div class="tiny mono" style="margin-top:3px">HTTP 503: индекс недоступен, повтор через 5 минут</div></div>' : '') +
        '<button class="btn wide" style="margin-top:12px" data-act="checkConn" data-k="' + c.id + '">' + icon('refresh', 'ic-sm') + ' ' + T.checkConn + '</button>' +
        '</div>').join('') +
      '</div>' +
      '<div class="card pad rv" style="margin-top:14px"><div class="row-t">' + icon('shield') +
      '<div><div class="h3">Безопасность</div><div class="small muted" style="margin-top:4px">' +
      'Токены и пароли хранятся на сервере и не передаются во фронтенд. HTML писем рендерится через санитайзер, внешние изображения заблокированы до подтверждения.</div></div></div></div>' +
      '</div>';
  };

  /* ============================================================ ВХОД */
  R.login = function () {
    return '<div class="content" style="max-width:440px;margin:0 auto;padding-top:40px">' +
      '<div class="card pad rv">' +
      '<div class="row" style="gap:11px;margin-bottom:18px"><span class="brand-mark" style="background:var(--accent)">КП</span>' +
      '<div><div class="h2">Вход в систему</div><div class="tiny muted">' + esc(T.appSub) + '</div></div></div>' +
      '<div class="field"><label>Email</label><input class="inp" id="lgEmail" value="klochko@neeklo-lab.ru" autocomplete="username"></div>' +
      '<div class="field"><label>Пароль</label><input class="inp" type="password" id="lgPass" value="demo1234" autocomplete="current-password">' +
      '<span class="fhint">Демо-режим: вход выполняется по кнопке ниже.</span></div>' +
      '<label class="switch" style="margin-bottom:14px"><input type="checkbox" checked><span class="tr"></span><span class="small">Запомнить меня</span></label>' +
      '<button class="btn primary wide" data-act="doLogin">' + icon('login', 'ic-sm') + ' Войти</button>' +
      '<button class="btn ghost wide" style="margin-top:8px" data-act="forgotPass">Забыли пароль?</button>' +
      '</div></div>';
  };
  window.__views3 = { ANPER: function (v) { if (v !== undefined) ANPER = v; return ANPER; }, ANMGR: function (v) { if (v !== undefined) ANMGR = v; return ANMGR; } };
})();
