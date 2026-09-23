/* Оболочка стенда: сайдбар, топбар, таббар, панели, подстраховка диалогов, запуск. */
(function () {
  'use strict';
  const U = window.UI, T = U.T, DB = U.DB, esc = U.esc, icon = U.icon;

  /* ---------- вспомогательные ---------- */
  const badgeFor = r => {
    const c = DB.counts();
    if (r === 'requests') return (c.review + c.needArticle) || '';
    if (r === 'pipeline') return c.supplier || '';
    if (r === 'suppliers') return c.supplier || '';
    return '';
  };

  function sideNav() {
    const nav = document.getElementById('nav');
    if (!nav) return;
    const secs = [];
    Object.keys(U.ROUTES).forEach(k => {
      if (k === 'login') return;
      const it = U.ROUTES[k];
      if (secs.indexOf(it.sec) < 0) secs.push(it.sec);
    });
    let html = '';
    secs.forEach(sec => {
      const items = Object.keys(U.ROUTES).filter(k => k !== 'login' && U.ROUTES[k].sec === sec && U.roleCan(k));
      if (!items.length) return;
      html += '<div class="side-sec">' + esc(sec) + '</div>';
      items.forEach(k => {
        const it = U.ROUTES[k], b = badgeFor(k);
        html += '<button class="nav-i' + (U.S.route === k ? ' on' : '') + '" data-act="go" data-k="' + k + '"' +
          (U.S.collapsed ? ' title="' + esc(it.t) + '"' : '') + '>' + icon(it.icon) +
          '<span class="lbl grow">' + esc(it.t) + '</span>' +
          (b !== '' && b !== 0 ? '<span class="cnt">' + b + '</span>' : '') + '</button>';
      });
    });
    nav.innerHTML = html;
  }

  function topbar() {
    const c = DB.counts();
    return '<button class="ibtn navToggle" data-act="navToggle" aria-label="Меню">' + icon('menu') + '</button>' +
      '<div class="search" id="gSearch">' +
        '<span class="s-ic">' + icon('search', 'ic-sm') + '</span>' +
        '<input type="search" placeholder="' + esc(T.searchPh) + '" aria-label="' + esc(T.searchPh) + '">' +
        '<span class="s-kbd">/</span>' +
      '</div>' +
      '<div class="grow"></div>' +
      '<select class="sel state-sel hide-sm" data-act-change="stateMenu" aria-label="' + esc(T.stateLabel) + '" title="' + esc(T.stateLabel) + '">' +
        [['data', T.stateData], ['loading', T.stateLoading], ['empty', T.stateEmpty], ['error', T.stateError]].map(o =>
          '<option value="' + o[0] + '"' + (U.mock() === o[0] ? ' selected' : '') + '>' + esc(o[1]) + '</option>').join('') +
      '</select>' +
      '<button class="btn sm hide-sm" data-act="aiChat" data-k="top">' + icon('sparkles', 'ic-sm') + ' ИИ</button>' +
      '<button class="ibtn" data-act="noti" aria-label="Уведомления">' + icon('bell') +
        (c.unread ? '<span class="dot"></span>' : '') + '</button>' +
      '<button class="ibtn" data-act="profileMenu" aria-label="Профиль"><span class="ava" style="width:30px;height:30px;font-size:12px">КН</span></button>';
  }

  function panels() {
    const roleName = { manager: T.manager, head: T.head, admin: T.admin }[U.S.role];
    const noti = DB.audit.slice(0, 7).map(a =>
      '<button class="noti" data-act="go" data-k="audit"><span class="ni" style="background:var(--info-bg);color:var(--info)">' + icon('history', 'ic-sm') + '</span>' +
      '<span class="grow"><span class="nt">' + esc(a.action) + '</span><span class="nd">' + esc(a.object) + ' · ' + esc(a.at) + '</span></span></button>').join('');
    return '<div class="panel" id="pnNoti" role="dialog" aria-label="Уведомления">' +
        '<div class="panel-h"><b class="h3 grow">Уведомления</b><button class="ibtn" data-act="closeDlg" aria-label="' + T.close + '">' + icon('x') + '</button></div>' +
        '<div class="panel-b">' + noti + '</div></div>' +
      '<div class="panel" id="pnProfile" role="dialog" aria-label="Профиль">' +
        '<div class="panel-h"><div class="row grow" style="gap:10px"><span class="ava">КН</span>' +
        '<span class="grow"><b class="small">Клочко Никита</b><span class="tiny muted" style="display:block">' + esc(roleName) + ' · klochko@neeklo-lab.ru</span></span></div>' +
        '<button class="ibtn" data-act="closeDlg" aria-label="' + T.close + '">' + icon('x') + '</button></div>' +
        '<div class="panel-b">' +
          [['profile', 'user', T.profile, 'Реквизиты, тема, роль'], ['more', 'grid', T.more, 'Все разделы системы']].map(i =>
            '<button class="prof-i" data-act="go" data-k="' + i[0] + '">' + icon(i[1]) +
            '<span class="grow"><span class="pi-t">' + esc(i[2]) + '</span><span class="pi-s">' + esc(i[3]) + '</span></span>' + icon('chevR', 'ic-sm') + '</button>').join('') +
          '<button class="prof-i" data-act="switchRole">' + icon('userPlus') +
            '<span class="grow"><span class="pi-t">Сменить роль</span><span class="pi-s">Менеджер · Руководитель · Администратор</span></span>' + icon('chevR', 'ic-sm') + '</button>' +
          '<button class="prof-i" data-act="setTheme">' + icon(U.S.theme === 'dark' ? 'sun' : 'moon') +
            '<span class="grow"><span class="pi-t">Тема: ' + (U.S.theme === 'dark' ? T.themeLight : T.themeDark) + '</span><span class="pi-s">Переключить оформление</span></span></button>' +
          '<button class="prof-i" data-act="help">' + icon('help') +
            '<span class="grow"><span class="pi-t">' + T.hotkeys + '</span><span class="pi-s">/ · J · K · Ctrl+Enter</span></span></button>' +
          '<button class="prof-i" data-act="logout">' + icon('logout') +
            '<span class="grow"><span class="pi-t">' + T.logout + '</span><span class="pi-s">Вернуться на экран входа</span></span></button>' +
        '</div></div>';
  }

  function tabbar() {
    const items = [['today', 'home', T.today], ['requests', 'inbox', T.requests], ['pipeline', 'kanban', T.pipeline], ['specs', 'file', T.specs], ['more', 'grid', T.more]];
    return items.map(i => {
      const b = badgeFor(i[0]);
      return '<button class="tb' + (U.S.route === i[0] ? ' on' : '') + '" data-act="go" data-k="' + i[0] + '">' +
        (b !== '' && b !== 0 ? '<span class="badge-n">' + b + '</span>' : '') + icon(i[1]) + '<span>' + esc(i[2]) + '</span></button>';
    }).join('');
  }

  /* ---------- подстраховка диалогов, которые живут внутри конкретных экранов ---------- */
  const dlg = {
    dlgRole: () => '<div class="dlg-h"><b class="h2">Сменить роль</b><div class="grow"></div>' +
      '<button class="ibtn" data-act="closeDlg" aria-label="' + T.close + '">' + icon('x') + '</button></div>' +
      '<div class="dlg-b"><div class="radio-list">' +
      [['manager', T.manager, 'Запросы, КП, клиенты, поставщики, спецификации'],
       ['head', T.head, 'Всё, кроме управления пользователями'],
       ['admin', T.admin, 'Все разделы и настройки']].map(r =>
        '<label class="radio-i' + (U.S.role === r[0] ? ' on' : '') + '"><input type="radio" name="roleS" data-act-change="setRole" value="' + r[0] + '"' + (U.S.role === r[0] ? ' checked' : '') + '>' +
        '<span class="grow"><b class="small">' + r[1] + '</b><div class="tiny muted">' + r[2] + '</div></span></label>').join('') +
      '</div><div class="fhint" style="margin-top:10px">Права проверяются на бэкенде. Недоступные разделы скрыты в меню.</div></div>' +
      '<div class="dlg-f"><button class="btn" data-act="closeDlg">' + T.close + '</button></div>',
    dlgAi: () => '<div class="dlg-h"><span style="color:var(--accent)">' + icon('sparkles') + '</span><b class="h2">' + T.aiTitle + '</b><div class="grow"></div>' +
      '<button class="ibtn" data-act="closeDlg" aria-label="' + T.close + '">' + icon('x') + '</button></div>' +
      '<div class="dlg-b"><div class="ai-log" id="aiLog"></div>' +
      '<div class="ai-chips" style="margin-top:10px">' +
      ['Сводка по запросам', 'Кто быстрее отвечает', 'Как считается цена', 'Где нет артикулов', 'Что просрочено'].map(q =>
        '<button class="chip" data-act="aiChip" data-k="' + esc(q) + '">' + esc(q) + '</button>').join('') + '</div>' +
      '<div class="row" style="gap:8px;margin-top:10px"><input class="inp grow" id="aiIn" placeholder="Спросите про запросы, поставщиков, цены…" aria-label="Вопрос ИИ">' +
      '<button class="btn primary" data-act="aiSend">' + icon('send', 'ic-sm') + '</button></div></div>' +
      '<div class="dlg-f"><span class="fhint grow">' + icon('shield', 'ic-sm') + ' ИИ предлагает — вы подтверждаете.</span>' +
      '<button class="btn" data-act="closeDlg">' + T.close + '</button></div>',
    shFilters: () => '<div class="sheet-h"><b class="h3 grow">' + T.filters + '</b>' +
      '<button class="ibtn" data-act="closeSheet" aria-label="' + T.close + '">' + icon('x') + '</button></div>' +
      '<div class="sheet-b"><div class="field"><label>' + T.status + '</label><select class="inp sel" data-act-change="fStatusSet">' +
      '<option value="">Все</option>' + (window.MOCK.STATUS || []).map(s => '<option value="' + s[0] + '">' + esc(s[1]) + '</option>').join('') + '</select></div>' +
      '<div class="field"><label>' + T.client + '</label><select class="inp sel" data-act-change="fClientSet"><option value="">Все</option>' +
      DB.clientNames().map(c => '<option>' + esc(c) + '</option>').join('') + '</select></div>' +
      '<label class="switch" style="margin-top:6px"><input type="checkbox" data-act-change="toggleAction"><span class="tr"></span><span class="small">' + T.onlyAction + '</span></label>' +
      '<label class="switch"><input type="checkbox" data-act-change="toggleLowConf"><span class="tr"></span><span class="small">' + T.lowConf + '</span></label>' +
      '<button class="btn" style="margin-top:10px" data-act="resetFilters">' + icon('rotate', 'ic-sm') + ' ' + T.reset + '</button></div>' +
      '<div class="sheet-f"><button class="btn primary grow" data-act="closeSheet">' + T.confirm + '</button></div>',
    dlgInvite: () => '<div class="dlg-h"><b class="h2">' + T.invite + '</b><div class="grow"></div>' +
      '<button class="ibtn" data-act="closeDlg" aria-label="' + T.close + '">' + icon('x') + '</button></div>' +
      '<div class="dlg-b"><div class="field"><label>Имя</label><input class="inp" id="invName" placeholder="Иван Петров"></div>' +
      '<div class="field"><label>Email</label><input class="inp" id="invEmail" placeholder="ivan@neeklo-lab.ru"></div>' +
      '<div class="field"><label>' + T.role + '</label><select class="inp" id="invRole">' +
      '<option value="manager">' + T.manager + '</option><option value="head">' + T.head + '</option><option value="admin">' + T.admin + '</option></select></div>' +
      '<div class="fhint">' + icon('shield', 'ic-sm') + ' Приглашение отправит письмо со ссылкой на вход. Права появятся после принятия.</div></div>' +
      '<div class="dlg-f"><button class="btn" data-act="closeDlg">' + T.cancel + '</button>' +
      '<button class="btn primary" data-act="invitesend">' + icon('send', 'ic-sm') + ' ' + T.inviteSend + '</button></div>',
    dlgSupReq: () => '<div class="dlg-h"><b class="h2">' + T.requestSupplier + '</b><div class="grow"></div>' +
      '<button class="ibtn" data-act="closeDlg" aria-label="' + T.close + '">' + icon('x') + '</button></div>' +
      '<div class="dlg-b"><div class="field"><label>' + T.suppliers + '</label><select class="inp" id="sqTo">' +
      window.MOCK.SUPPLIERS.map(s => '<option>' + esc(s[0]) + ' — ' + esc(s[1]) + '</option>').join('') + '</select></div>' +
      '<div class="field"><label>Тема</label><input class="inp" id="sqSubj" value="Quotation request — 4 items"></div>' +
      '<div class="field"><label>Текст письма</label><textarea class="inp" id="sqBody" style="min-height:150px">Dear colleagues,</textarea>' +
      '<div class="ai-bar"><span class="ai-t">' + icon('sparkles', 'ic-sm') + ' ИИ</span>' +
      '<button class="btn sm" data-act="aiSupplier" data-k="en">Составить на английском</button>' +
      '<button class="btn sm" data-act="aiSupplier" data-k="ru">На русском</button></div></div>' +
      '<div class="fhint">' + icon('shield', 'ic-sm') + ' Отправка после подтверждения. Ответ разберётся автоматически.</div></div>' +
      '<div class="dlg-f"><button class="btn" data-act="closeDlg">' + T.cancel + '</button>' +
      '<button class="btn primary" data-act="sendSupplierReq">' + icon('send', 'ic-sm') + ' ' + T.send + '</button></div>',
    dlgCols: () => '<div class="dlg-h"><b class="h2">' + T.cols + '</b><div class="grow"></div>' +
      '<button class="ibtn" data-act="closeDlg" aria-label="' + T.close + '">' + icon('x') + '</button></div>' +
      '<div class="dlg-b"><div class="col" style="gap:8px">' +
      [['number', '№'], ['receivedAt', 'Дата'], ['client', T.client], ['subject', T.subject], ['positionsCount', T.positions],
       ['minConfidence', T.confidence], ['quoteTotalRub', T.sum], ['status', T.status], ['assignee', T.assignee], ['updatedAt', T.updated]]
        .map(c => '<label class="radio-i"><input type="checkbox" data-act-change="toggleCol" data-id="' + c[0] + '"' + (U.F.requests.cols[c[0]] ? ' checked' : '') + '>' +
          '<span class="grow small">' + esc(c[1]) + '</span></label>').join('') + '</div></div>' +
      '<div class="dlg-f"><button class="btn" data-act="closeDlg">' + T.close + '</button>' +
      '<button class="btn primary" data-act="closeDlg">' + T.save + '</button></div>',
    dlgSend: () => '<div class="dlg-h"><b class="h2">' + T.confirmSend + '</b><div class="grow"></div>' +
      '<button class="ibtn" data-act="closeDlg" aria-label="' + T.close + '">' + icon('x') + '</button></div>' +
      '<div class="dlg-b"><div class="row-t"><span style="color:var(--warn)">' + icon('alertT') + '</span><p class="small">' + T.confirmSendD + '</p></div>' +
      '<div class="kv" style="margin-top:12px"><dt>Кому</dt><dd id="sdTo">—</dd><dt>Тема</dt><dd id="sdSubj">—</dd>' +
      '<dt>Вложение</dt><dd id="sdAtt">КП.xls</dd></div></div>' +
      '<div class="dlg-f"><button class="btn" data-act="closeDlg">' + T.no + '</button>' +
      '<button class="btn primary" data-act="confirmSend">' + icon('send', 'ic-sm') + ' ' + T.yes + '</button></div>',
    dlgQuote: () => '<div class="dlg-h"><b class="h2">КП</b><div class="grow"></div>' +
      '<button class="ibtn" data-act="closeDlg" aria-label="' + T.close + '">' + icon('x') + '</button></div>' +
      '<div class="dlg-b"><div class="fhint">Черновик КП формируется из проверенных позиций запроса.</div>' +
      '<div id="quoteFallback" class="col" style="gap:8px;margin-top:10px"></div></div>' +
      '<div class="dlg-f"><button class="btn" data-act="downloadQuoteXls">' + icon('download', 'ic-sm') + ' ' + T.downloadXls + '</button>' +
      '<button class="btn" data-act="saveQuoteDraft">' + T.saveDraft + '</button>' +
      '<button class="btn primary" data-act="openSend">' + icon('send', 'ic-sm') + ' ' + T.sendClient + '</button></div>',
    dlgAssign: () => '<div class="dlg-h"><b class="h2">' + T.assign + '</b><div class="grow"></div>' +
      '<button class="ibtn" data-act="closeDlg" aria-label="' + T.close + '">' + icon('x') + '</button></div>' +
      '<div class="dlg-b"><div class="radio-list">' + DB.users.filter(u => u.role !== 'admin').map(u =>
        '<label class="radio-i"><input type="radio" name="asg" data-act-change="setAssignee" data-id="' + u.id + '|' + esc(u.name) + '"><span class="grow small">' + esc(u.name) + '</span></label>').join('') + '</div></div>' +
      '<div class="dlg-f"><button class="btn" data-act="closeDlg">' + T.close + '</button></div>',
    dlgDup: () => '<div class="dlg-h"><b class="h2">' + T.mergeDup + '</b><div class="grow"></div>' +
      '<button class="ibtn" data-act="closeDlg" aria-label="' + T.close + '">' + icon('x') + '</button></div>' +
      '<div class="dlg-b"><div id="dupBody" class="small muted">Поиск дублей…</div></div>' +
      '<div class="dlg-f"><button class="btn" data-act="closeDlg">' + T.cancel + '</button>' +
      '<button class="btn primary" data-act="applyMerge">' + T.mergeDup + '</button></div>',
    dlgMove: () => '<div class="dlg-h"><b class="h2">Смена статуса</b><div class="grow"></div>' +
      '<button class="ibtn" data-act="closeDlg" aria-label="' + T.close + '">' + icon('x') + '</button></div>' +
      '<div class="dlg-b"><div id="mvBody"></div></div>' +
      '<div class="dlg-f"><button class="btn" data-act="closeDlg">' + T.cancel + '</button></div>',
    dlgImport: () => '<div class="dlg-h"><b class="h2">' + T.importReport + '</b><div class="grow"></div>' +
      '<button class="ibtn" data-act="closeDlg" aria-label="' + T.close + '">' + icon('x') + '</button></div>' +
      '<div class="dlg-b" id="impBody"></div>' +
      '<div class="dlg-f"><button class="btn" data-act="closeDlg">' + T.close + '</button></div>',
    dlgMapping: () => '<div class="dlg-h"><b class="h2">' + T.mapping + '</b><div class="grow"></div>' +
      '<button class="ibtn" data-act="closeDlg" aria-label="' + T.close + '">' + icon('x') + '</button></div>' +
      '<div class="dlg-b"><div class="col" style="gap:10px">' +
      ['Артикул', 'Наименование', 'Цена', 'Валюта', 'Единица'].map((f, i) =>
        '<div class="field" style="margin:0"><label>' + f + ' в системе</label><select class="inp"><option>Колонка ' + (i + 1) + ' — ' + f + '</option>' +
        '<option>Колонка ' + (i + 3) + ' — ' + f + ' (alt)</option></select></div>').join('') + '</div>' +
      '<div class="fhint" style="margin-top:10px">Сопоставление сохранится для файла и применится при следующей синхронизации.</div></div>' +
      '<div class="dlg-f"><button class="btn" data-act="closeDlg">' + T.cancel + '</button>' +
      '<button class="btn primary" data-act="saveMapping">' + T.save + '</button></div>',
    dlgFind: () => '<div class="dlg-h"><b class="h2">' + T.findArticle + '</b><div class="grow"></div>' +
      '<button class="ibtn" data-act="closeDlg" aria-label="' + T.close + '">' + icon('x') + '</button></div>' +
      '<div class="dlg-b"><div class="row" style="gap:8px"><input class="inp grow" id="faQ" placeholder="Например, Р-1001" data-edit="findArticle" data-k="1">' +
      '<button class="btn primary" data-act="runFindArticle">' + icon('search', 'ic-sm') + ' Найти</button></div>' +
      '<div id="faBody" style="margin-top:12px"></div></div>' +
      '<div class="dlg-f"><button class="btn" data-act="closeDlg">' + T.close + '</button></div>',
    dlgSpec: () => '<div class="dlg-h"><b class="h2" id="specTitle">Спецификация</b><div class="grow"></div>' +
      '<button class="ibtn" data-act="closeDlg" aria-label="' + T.close + '">' + icon('x') + '</button></div>' +
      '<div class="dlg-b" id="specBody"></div>' +
      '<div class="dlg-f"><button class="btn" data-act="specExport">' + icon('download', 'ic-sm') + ' ' + T.downloadXls + '</button>' +
      '<button class="btn" data-act="specPrint">' + icon('printer', 'ic-sm') + ' Печать</button>' +
      '<button class="btn primary" data-act="closeDlg">' + T.close + '</button></div>',
    dlgNews: () => '<div class="dlg-h"><b class="h2" id="newsTitle">Рассылка</b><div class="grow"></div>' +
      '<button class="ibtn" data-act="closeDlg" aria-label="' + T.close + '">' + icon('x') + '</button></div>' +
      '<div class="dlg-b" id="newsBody"></div>' +
      '<div class="dlg-f"><button class="btn" data-act="newsPause">' + icon('pause', 'ic-sm') + ' ' + T.pauseQueue + '</button>' +
      '<button class="btn" data-act="newsSend">' + icon('send', 'ic-sm') + ' Отправить</button>' +
      '<button class="btn danger" data-act="newsCancel">' + T.cancelQueue + '</button></div>',
    dlgUserRole: () => '<div class="dlg-h"><b class="h2">' + T.roleChange + '</b><div class="grow"></div>' +
      '<button class="ibtn" data-act="closeDlg" aria-label="' + T.close + '">' + icon('x') + '</button></div>' +
      '<div class="dlg-b"><div id="urBody"></div>' +
      '<div class="field" style="margin-top:12px"><label>Новая роль</label><select class="inp" id="urSel">' +
      '<option value="manager">' + T.manager + '</option><option value="head">' + T.head + '</option><option value="admin">' + T.admin + '</option></select></div></div>' +
      '<div class="dlg-f"><button class="btn" data-act="closeDlg">' + T.cancel + '</button>' +
      '<button class="btn primary" data-act="userRoleApply">' + T.save + '</button></div>'
  };

  function ensureDialogs() {
    Object.keys(dlg).forEach(id => {
      if (document.getElementById(id)) return;
      const d = document.createElement('div');
      d.className = 'dlg' + (id === 'dlgNews' || id === 'dlgSpec' ? ' wide' : id === 'dlgRole' || id === 'dlgSend' || id === 'dlgDup' ? ' narrow' : '');
      d.id = id; d.dataset.fb = '1'; d.setAttribute('role', 'dialog'); d.setAttribute('aria-modal', 'true');
      d.innerHTML = dlg[id]();
      document.body.appendChild(d);
    });
    if (!document.getElementById('shFilters')) {
      const s = document.createElement('div');
      s.className = 'sheet'; s.id = 'shFilters'; s.dataset.fb = '1'; s.setAttribute('role', 'dialog'); s.setAttribute('aria-modal', 'true');
      s.innerHTML = dlg.shFilters();
      document.body.appendChild(s);
    }
  }

  /* ---------- каркас ---------- */
  function boot() {
    U.DB.init();
    const app = document.getElementById('app');
    app.className = 'app';
    app.innerHTML =
      '<aside class="side" id="side">' +
        '<div class="side-top">' +
          '<span class="brand-mark">КП</span>' +
          '<span class="brand-txt grow"><b>' + esc(T.app) + '</b><span>' + esc(T.appSub) + '</span></span>' +
          '<button class="ibtn collapser" data-act="collapseSide" aria-label="Свернуть меню">' + icon('chevL') + '</button>' +
          '<button class="ibtn side-x" data-act="sideClose" aria-label="' + T.close + '">' + icon('x') + '</button>' +
        '</div>' +
        '<nav class="nav" id="nav"></nav>' +
        '<div class="side-foot">' +
          '<button class="nav-i" data-act="help">' + icon('help') + '<span class="lbl grow">' + T.hotkeys + '</span></button>' +
          '<button class="nav-i" data-act="openStand">' + icon('external') + '<span class="lbl grow">' + T.stages + '</span></button>' +
          '<div class="tiny" style="padding:8px 10px 0">Прототип · демо-данные локально · v2.0</div>' +
        '</div>' +
      '</aside>' +
      '<div class="main">' +
        '<header class="top" id="top"></header>' +
        '<div id="view"></div>' +
        '<nav class="tabbar" id="tabbar"></nav>' +
      '</div>';
    document.body.insertAdjacentHTML('beforeend', panels());
    document.getElementById('top').innerHTML = topbar();
    document.getElementById('tabbar').innerHTML = tabbar();
    sideNav();
    document.getElementById('side').classList.toggle('collapsed', !!U.S.collapsed);

    /* закрываем панели и листы при действии внутри них */
    document.addEventListener('click', function (e) {
      const inPanel = e.target.closest('.panel');
      if (inPanel && e.target.closest('[data-act]')) U.closeOverlay();
      const inSheet = e.target.closest('.sheet');
      if (inSheet && e.target.closest('[data-act-change]')) return;
    }, true);

    window.__afterRender = function () {
      /* если экран принёс собственную версию диалога, убираем подстраховочную копию */
      ['dlgRole','dlgAi','dlgMove','dlgImport','dlgMapping','dlgFind','dlgSpec','dlgNews','dlgUserRole','dlgInvite','dlgSend','dlgQuote','dlgAssign','dlgDup','dlgCols','dlgSupReq','shFilters'].forEach(id => {
        const inView = document.querySelector('#view #' + id);
        const fb = document.querySelector('body > #' + id + '[data-fb]');
        if (inView && fb) fb.remove();
      });
      fillQuoteFallback();
      sideNav();
      document.getElementById('tabbar').innerHTML = tabbar();
      document.getElementById('top').innerHTML = topbar();
      document.getElementById('side').classList.toggle('collapsed', !!U.S.collapsed);
      document.body.classList.toggle('no-auth', !U.S.authed);
      document.getElementById('side').classList.remove('open');
      ensureDialogs();
      if (!U.S.authed) U.closeOverlay();
    };

    if (!location.hash) location.hash = '#/today';
    U.render(true);
  }

  /* наполняем подстраховочный диалог КП данными текущего запроса */
  function fillQuoteFallback() {
    const box = document.getElementById('quoteFallback');
    if (!box) return;
    const id = (location.hash || '').split('/')[2];
    const r = DB.req(id) || DB.requests[0];
    if (!r) { box.innerHTML = ''; return; }
    const t = DB.totals(r);
    box.innerHTML = '<div class="kv"><dt>' + T.client + '</dt><dd>' + esc(r.client.name) + '</dd>' +
      '<dt>№</dt><dd class="mono">2026-' + r.number + '</dd>' +
      '<dt>' + T.positions + '</dt><dd>' + r.positions.length + '</dd>' +
      '<dt>' + T.total + '</dt><dd class="mono"><b>' + U.money(t.total) + '</b></dd></div>' +
      '<div class="fhint">' + icon('info', 'ic-sm') + ' Откройте карточку запроса, чтобы увидеть полную таблицу КП и версии.</div>';
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
