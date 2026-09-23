/* ===== data.js ===== */
/* Моковые данные по ТЗ, раздел 11. Реалистичные наборы для демонстрации. */
window.MOCK = (function () {
  const BRANDS = ['Thermo Fisher','Sigma-Aldrich','Eppendorf','Bio-Rad','Sartorius','VWR','Merck','Corning'];
  const CATS = ['Реактивы','Лабораторные наборы','Посуда','Приборы','Расходные материалы'];
  const UNITS = ['шт','уп','л','мл','кг','набор'];
  const CUR = ['USD','EUR','INR','RUB'];
  const NAMES = [
    ['Р-1001','Буферный раствор PBS 10x, 1 л','Реактивы'],
    ['Р-1002','Агароза молекулярной биологии, 500 г','Реактивы'],
    ['Р-1003','Трипсин-ЭДТА 0,25%, 100 мл','Реактивы'],
    ['Р-1004','Антитела anti-CD3, 100 мкг','Реактивы'],
    ['Р-1005','Среда DMEM высокоглюкозная, 500 мл','Реактивы'],
    ['Н-2001','Набор для выделения ДНК, 50 проб','Лабораторные наборы'],
    ['Н-2002','Набор для ПЦР в реальном времени, 200 реакций','Лабораторные наборы'],
    ['Н-2003','Набор для ИФА, 96 лунок','Лабораторные наборы'],
    ['П-3001','Пробирки 15 мл стерильные, 500 шт','Посуда'],
    ['П-3002','Планшеты 96-луночные, 50 шт','Посуда'],
    ['П-3003','Наконечники 200 мкл, 1000 шт','Расходные материалы'],
    ['П-3004','Пипетка механическая 100-1000 мкл','Приборы'],
    ['П-3005','Термостат лабораторный, 1 шт','Приборы'],
    ['П-3006','Перчатки нитриловые M, 100 шт','Расходные материалы']
  ];
  const CLIENTS = [
    ['Клиника «МедЛаб»','medlab.ru','Москва'],
    ['НИИ биоорганической химии','ibch.ru','Москва'],
    ['ГК «Биотест»','biotest.ru','Санкт-Петербург'],
    ['ФГБУ «НМИЦ онкологии»','oncocentr.ru','Москва'],
    ['АО «Фармсинтез»','pharmsintez.ru','Новосибирск'],
    ['ООО «ГенЭксперт»','genexpert.ru','Казань'],
    ['Центр «Вирусология»','virology.ru','Новосибирск'],
    ['Клиника «Здоровье+»','zdorovie-plus.ru','Екатеринбург']
  ];
  const SUPPLIERS = [
    ['Thermo Fisher Scientific','orders@thermofisher.com',['Thermo Fisher'],2.4,0.06],
    ['Sigma-Aldrich','emea.orders@sial.com',['Sigma-Aldrich','Merck'],3.1,0.11],
    ['Eppendorf AG','order@eppendorf.com',['Eppendorf'],1.8,0.03],
    ['Bio-Rad Laboratories','orders@bio-rad.com',['Bio-Rad'],4.2,0.14],
    ['Sartorius Stedim','sales@sartorius.com',['Sartorius'],2.9,0.08],
    ['VWR International','ru@vwr.com',['VWR','Corning'],2.2,0.05],
    ['MedSupply India','sales@medsupply.in',['MedSupply'],6.5,0.19]
  ];
  const MANAGERS = [['m1','Клочко Н.'],['m2','Сергеева А.'],['m3','Петров Д.']];
  const STATUS = [
    ['new','Новый','neutral'],['parsed','Распознан','info'],['need_article','Нужен артикул','warn'],
    ['waiting_supplier','Ждём поставщика','info'],['review','На проверке','warn'],
    ['quote_sent','КП отправлено','ok'],['waiting_client','Ждём ответа клиента','info'],
    ['invoice_requested','Запрошен счёт','info'],['won','Выигран','ok'],['lost','Проигран','bad'],
    ['closed','Закрыт','neutral']
  ];
  const STATUS_MAP = Object.fromEntries(STATUS.map(s => [s[0], { label: s[1], tone: s[2] }]));
  const TRANSITIONS = {
    new:['parsed','closed'], parsed:['need_article','waiting_supplier','review','closed'],
    need_article:['parsed','review','closed'], waiting_supplier:['review','need_article','closed'],
    review:['quote_sent','waiting_supplier','closed'], quote_sent:['waiting_client','won','lost','closed'],
    waiting_client:['invoice_requested','won','lost','closed'],
    invoice_requested:['won','lost','closed'], won:['closed'], lost:['closed'], closed:[]
  };
  const ACTIVITY = [
    ['system','Письмо получено','Входящее от клиники «МедЛаб»'],
    ['system','Распознано 6 позиций','Средняя уверенность 0,82'],
    ['m1','Правка позиции','Р-1003: количество 2 → 3'],
    ['m1','Запрос поставщику отправлен','Sigma-Aldrich, 4 артикула'],
    ['system','Ответ поставщика получен','Sigma-Aldrich, 4 позиции, 2 дня'],
    ['m1','КП сформировано','КП-2026-0912, 171 800 ₽'],
    ['m1','КП отправлено клиенту','medlab.ru, вложение XLS']
  ];

  let seed = 20260923;
  const rnd = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
  const pick = a => a[Math.floor(rnd() * a.length)];
  const int = (a, b) => a + Math.floor(rnd() * (b - a + 1));

  function positions(n, hard) {
    const out = [], used = new Set();
    for (let i = 0; i < n; i++) {
      let it; do { it = pick(NAMES); } while (used.has(it[0]) && used.size < NAMES.length);
      used.add(it[0]);
      const qty = int(1, 6);
      const hasArticle = hard ? rnd() > 0.35 : rnd() > 0.08;
      const hasPrice = hard ? rnd() > 0.4 : rnd() > 0.12;
      const conf = hard ? +(0.55 + rnd() * 0.35).toFixed(2) : +(0.8 + rnd() * 0.19).toFixed(2);
      const cur = pick(CUR.slice(0, 3));
      const sp = +(int(40, 900) + rnd()).toFixed(2);
      const rate = cur === 'USD' ? 92.5 : cur === 'EUR' ? 100.2 : 1.11;
      const duty = it[2] === 'Реактивы' || it[2] === 'Лабораторные наборы' ? 5 : 0;
      const client = hasPrice ? +(sp * rate * (1 + duty / 100) * 1.18).toFixed(0) : undefined;
      out.push({
        id: 'p' + i, article: hasArticle ? it[0] : '', name: it[1], brand: hasArticle ? pick(BRANDS) : '',
        qty, unit: pick(UNITS), category: it[2], supplierPrice: hasPrice ? sp : undefined,
        supplierCurrency: hasPrice ? cur : undefined,
        priceSource: hasPrice ? (rnd() > 0.5 ? 'pricelist' : 'supplier_reply') : undefined,
        dutyPct: duty, clientPriceRub: client, totalRub: client ? client * qty : undefined,
        confidence: conf, reviewed: conf >= 0.7
      });
    }
    return out;
  }

  const REQUESTS = [];
  const subjects = [
    'Запрос КП на реактивы и расходные материалы',
    'Коммерческое предложение: наборы для ПЦР',
    'Нужны цены на антитела и среды',
    'Запрос на лабораторную посуду и наконечники',
    'КП на приборы: термостат, пипетки',
    'Закупка реагентов на IV квартал'
  ];
  for (let i = 0; i < 30; i++) {
    const st = STATUS[i % 11][0];
    const n = int(2, 7);
    const hard = ['need_article','waiting_supplier','review','new'].includes(st) && i % 3 === 0;
    const cl = CLIENTS[i % CLIENTS.length];
    const mgr = MANAGERS[i % MANAGERS.length];
    const pos = positions(n, hard);
    const minConf = Math.min(...pos.map(p => p.confidence));
    const total = pos.reduce((s, p) => s + (p.totalRub || 0), 0);
    const day = 1 + (i % 23), hr = 9 + (i % 9);
    REQUESTS.push({
      id: 'r' + (1000 + i), number: 2026 - 1000 + i, client: { id: 'c' + i, name: cl[0], domain: cl[1] },
      subject: pick(subjects), status: st, assignee: { id: mgr[0], name: mgr[1] },
      positions: pos, positionsCount: n, minConfidence: minConf,
      quoteTotalRub: ['quote_sent','waiting_client','invoice_requested','won','lost'].includes(st) ? total : undefined,
      receivedAt: `2026-09-${String(day).padStart(2,'0')}T${String(hr).padStart(2,'0')}:${String(int(10,59))}:00+03:00`,
      updatedAt: `2026-09-${String(Math.min(23, day + 1)).padStart(2,'0')}T${String(hr).padStart(2,'0')}:30:00+03:00`,
      unread: i % 5 === 0,
      email: {
        from: `zakupki@${cl[1]}`, to: 'sales@neeklo-lab.ru', date: `2026-09-${String(day).padStart(2,'0')} ${hr}:${String(int(10,59))}`,
        subject: `Запрос КП — ${cl[0]}`,
        body: [
          `Добрый день!`,
          ``,
          `Просим предоставить коммерческое предложение на следующие позиции:`,
          ...pos.slice(0, 4).map((p, k) => `${k + 1}. ${p.name}${p.article ? ' (арт. ' + p.article + ')' : ''} — ${p.qty} ${p.unit}`),
          ``,
          pos.length > 4 ? `Остальные позиции ${pos.length - 4} шт. см. во вложении.` : ``,
          `Срок поставки просим указать. Оплата по факту поставки.`,
          `С уважением, отдел закупок ${cl[0]}`].filter(Boolean).join('\n'),
        attachments: [{ name: 'Заявка.xlsx', size: '24 КБ', type: 'xls' }, { name: 'ТЗ на поставку.pdf', size: '180 КБ', type: 'pdf' }]
      }
    });
  }

  const PRICELISTS = [
    ['Thermo Fisher — прайс 2026 Q3','Thermo Fisher','USD',1842,'2026-09-22T08:10:00+03:00','ok'],
    ['Sigma-Aldrich — реакции','Sigma-Aldrich','EUR',3104,'2026-09-21T19:40:00+03:00','ok'],
    ['МедСнаб — расходные материалы','MedSupply','INR',742,'2026-09-14T11:05:00+03:00','stale'],
    ['Eppendorf — приборы','Eppendorf','EUR',96,'2026-09-19T09:20:00+03:00','warn']
  ].map((r, i) => ({ id: 'pl' + i, name: r[0], supplier: r[1], currency: r[2], rows: r[3], syncedAt: r[4], status: r[5] }));

  const RULES = [
    { cat: 'Реактивы', duty: 5, markup: 18 },
    { cat: 'Лабораторные наборы', duty: 5, markup: 18 },
    { cat: 'Посуда', duty: 0, markup: 15 },
    { cat: 'Приборы', duty: 0, markup: 12 },
    { cat: 'Расходные материалы', duty: 0, markup: 15 }
  ];
  const RATES = [{ code: 'USD', rate: 92.5 }, { code: 'EUR', rate: 100.2 }, { code: 'INR', rate: 1.11 }];

  const SPECS = [
    ['СП-2026-0041','ФГБУ «НМИЦ онкологии»','2026-09-20',4,'sent'],
    ['СП-2026-0042','ГК «Биотест»','2026-09-21',7,'draft'],
    ['СП-2026-0043','ООО «ГенЭксперт»','2026-09-22',3,'sent']
  ].map((s, i) => ({ id: 'sp' + i, number: s[0], client: s[1], date: s[2], positions: s[3], status: s[4], version: 1 }));

  const NEWSLETTERS = [
    ['NEWS: поступление реактивов, сентябрь','2026-09-22',340,340,0,'sent'],
    ['NEWS: обновление прайса Thermo Fisher','2026-09-18',340,338,2,'sent'],
    ['NEWS: новые наборы для ПЦР','2026-09-24',340,0,0,'queued'],
    ['NEWS: график работы в праздники','2026-09-10',338,338,0,'sent']
  ].map((n, i) => ({ id: 'nl' + i, subject: n[0], date: n[1], total: n[2], sent: n[3], errors: n[4], status: n[5] }));

  const USERS = [
    ['Клочко Никита','klochko@neeklo-lab.ru','admin','2026-09-23 09:14','active'],
    ['Сергеева Анна','sergeeva@neeklo-lab.ru','manager','2026-09-23 08:52','active'],
    ['Петров Дмитрий','petrov@neeklo-lab.ru','manager','2026-09-22 18:40','active'],
    ['Смирнова Ольга','smirnova@neeklo-lab.ru','head','2026-09-23 10:05','active'],
    ['Иванов Пётр','ivanov@neeklo-lab.ru','manager','2026-07-14 12:00','blocked']
  ].map((u, i) => ({ id: 'u' + i, name: u[0], email: u[1], role: u[2], lastLogin: u[3], status: u[4] }));

  const AUDIT = [];
  const acts = ['Вход в систему','Правка позиции','Отправка КП','Смена статуса','Синхронизация прайса','Изменение правила расчёта','Приглашение пользователя','Создание спецификации'];
  const objs = ['Запрос № 2026-1002','КП-2026-0912','Прайс Thermo Fisher','Запрос № 2026-1005','Спецификация СП-2026-0041'];
  for (let i = 0; i < 40; i++) {
    AUDIT.push({
      id: 'a' + i, at: `2026-09-${String(23 - (i % 5)).padStart(2,'0')} ${String(9 + (i % 9)).padStart(2,'0')}:${String(int(10,59))}`,
      actor: i % 4 === 0 ? 'Система' : MANAGERS[i % 3][1], action: pick(acts), object: pick(objs)
    });
  }

  const CONNECTIONS = [
    ['Почтовый ящик','sales@neeklo-lab.ru','connected','2026-09-23 08:00'],
    ['Папка «Запросы»','INBOX/Zaprosy','connected','2026-09-23 08:00'],
    ['Папка «NEWS»','INBOX/NEWS','connected','2026-09-23 08:00'],
    ['Яндекс Диск','/Лаборатория/Прайсы','connected','2026-09-22 07:30'],
    ['Языковая модель','для распознавания писем','connected','2026-09-23 08:00'],
    ['Поиск по артикулам','индекс 4 812 позиций','error','2026-09-23 06:12']
  ].map((c, i) => ({ id: 'cn' + i, name: c[0], detail: c[1], status: c[2], checkedAt: c[3] }));

  return { BRANDS, CATS, UNITS, CUR, NAMES, CLIENTS, SUPPLIERS, MANAGERS, STATUS, STATUS_MAP,
    TRANSITIONS, ACTIVITY, REQUESTS, PRICELISTS, RULES, RATES, SPECS, NEWSLETTERS, USERS, AUDIT, CONNECTIONS };
})();

/* ===== ui.js ===== */
/* Базовый слой: иконки, словарь, форматирование, оверлеи, тосты, ИИ, роутер, реестр действий. */
(function () {
  'use strict';

  /* ---------------- иконки (lucide-подобные) ---------------- */
  const I = {
    home:'<path d="M3 10.5L12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M10 21v-6h4v6"/>',
    inbox:'<path d="M4 4h16v16H4z"/><path d="M4 13h4l2 3h4l2-3h4"/>',
    users:'<circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-5 6-5s6 1.7 6 5"/><path d="M17 11.2c1.7.4 3 1.6 3 3.6M16 5.3a3 3 0 010 5.4"/>',
    user:'<circle cx="12" cy="8" r="3.6"/><path d="M5 20c0-3.6 3.1-5.6 7-5.6s7 2 7 5.6"/>',
    box:'<path d="M12 3l8 4.2v9.6L12 21l-8-4.2V7.2z"/><path d="M4 7.2l8 4.3 8-4.3M12 21v-9.5"/>',
    truck:'<path d="M2 7h11v9H2z"/><path d="M13 10h4l3 3v3h-7z"/><circle cx="6" cy="18.5" r="1.8"/><circle cx="17" cy="18.5" r="1.8"/>',
    kanban:'<path d="M4 4h4v12H4zM10 4h4v16h-4zM16 4h4v8h-4z"/>',
    calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    file:'<path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h4"/>',
    chart:'<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    send:'<path d="M21 3L10.5 13.5"/><path d="M21 3l-6.8 18-3.7-7.5L3 9.8z"/>',
    plug:'<path d="M9 3v6M15 3v6"/><path d="M6 9h12v3a6 6 0 01-12 0z"/><path d="M12 18v3"/>',
    list:'<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
    sliders:'<path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h.5"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>',
    settings:'<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1"/>',
    bell:'<path d="M18 15V10a6 6 0 10-12 0v5l-1.5 3h15z"/><path d="M10 21h4"/>',
    search:'<circle cx="11" cy="11" r="7"/><path d="M20.5 20.5L16.3 16.3"/>',
    menu:'<path d="M3 6h18M3 12h18M3 18h18"/>',
    chevL:'<path d="M14 6l-6 6 6 6"/>',
    chevR:'<path d="M10 6l6 6-6 6"/>',
    chevD:'<path d="M6 9l6 6 6-6"/>',
    plus:'<path d="M12 5v14M5 12h14"/>',
    trash:'<path d="M4 7h16M10 11v6M14 11v6"/><path d="M6 7l1 13h10l1-13"/><path d="M9 7V4h6v3"/>',
    edit:'<path d="M15.5 4.5l4 4L8 20H4v-4z"/><path d="M13.5 6.5l4 4"/>',
    x:'<path d="M6 6l12 12M18 6L6 18"/>',
    check:'<path d="M5 13l4.5 4.5L19 7"/>',
    checkCircle:'<circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.5 2.5L16 9.5"/>',
    alertT:'<path d="M12 4l9 16H3z"/><path d="M12 10v4M12 17h.01"/>',
    alertC:'<circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/>',
    info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
    refresh:'<path d="M20 12a8 8 0 11-2.3-5.6"/><path d="M20 4v5h-5"/>',
    download:'<path d="M12 3v12M7 11l5 5 5-5"/><path d="M4 20h16"/>',
    upload:'<path d="M12 21V9M7 13l5-5 5 5"/><path d="M4 4h16"/>',
    eye:'<path d="M2 12s3.8-6.5 10-6.5S22 12 22 12s-3.8 6.5-10 6.5S2 12 2 12z"/><circle cx="12" cy="12" r="2.6"/>',
    mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
    mailOpen:'<path d="M3 9l9-5 9 5v10a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><path d="M3 9l9 6 9-6"/>',
    clip:'<path d="M20 11l-8.5 8.5a4.6 4.6 0 01-6.5-6.5l9-9a3.2 3.2 0 014.5 4.5l-9 9a1.8 1.8 0 01-2.5-2.5l8-8"/>',
    sparkles:'<path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6z"/><path d="M18.5 15.5l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z"/>',
    wand:'<path d="M4 20L16 8"/><path d="M14 4l1 2 2 1-2 1-1 2-1-2-2-1 2-1z"/><path d="M19 12l.7 1.6L21 14l-1.3.7L19 16l-.7-1.3L17 14l1.3-.4z"/>',
    copy:'<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 012-2h8"/>',
    filter:'<path d="M3 5h18l-7 8v6l-4-2v-4z"/>',
    sort:'<path d="M7 4v16M4 17l3 3 3-3"/><path d="M14 7h6M14 12h5M14 17h4"/>',
    more:'<circle cx="12" cy="5" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="12" cy="19" r="1.4"/>',
    arrowUp:'<path d="M12 20V5M6 11l6-6 6 6"/>',
    arrowDown:'<path d="M12 4v15M6 13l6 6 6-6"/>',
    arrowRight:'<path d="M4 12h15M13 6l6 6-6 6"/>',
    arrowLeft:'<path d="M20 12H5M11 6l-6 6 6 6"/>',
    ext:'<path d="M14 4h6v6"/><path d="M20 4l-9 9"/><path d="M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5"/>',
    logout:'<path d="M14 4h4a2 2 0 012 2v12a2 2 0 01-2 2h-4"/><path d="M9 12h11M16 8l4 4-4 4"/>',
    login:'<path d="M10 4H6a2 2 0 00-2 2v12a2 2 0 002 2h4"/><path d="M20 12H9M13 8l-4 4 4 4"/>',
    sun:'<circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6L7 7M17 17l1.4 1.4M18.4 5.6L17 7M7 17l-1.4 1.4"/>',
    moon:'<path d="M20 14.5A8 8 0 019.5 4a8 8 0 1010.5 10.5z"/>',
    shield:'<path d="M12 3l8 3.5v6c0 4.8-3.3 7.6-8 8.5-4.7-.9-8-3.7-8-8.5v-6z"/><path d="M9 12.5l2 2 4-4.5"/>',
    clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7.5V12l3.5 2"/>',
    building:'<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M9 8h.01M15 8h.01M9 12h.01M15 12h.01M10 21v-4h4v4"/>',
    tag:'<path d="M20 12.5L12.5 20 4 11.5V4h7.5z"/><circle cx="8" cy="8" r="1.4"/>',
    merge:'<path d="M7 21V8a5 5 0 015-5h5"/><path d="M14 6l3-3-3-3" transform="translate(0 3)"/><path d="M14 9l3-3-3-3"/>',
    save:'<path d="M5 4h11l4 4v12H5z"/><path d="M9 4v6h6V4M8 20v-6h8v6"/>',
    play:'<path d="M7 4l13 8-13 8z"/>',
    pause:'<path d="M8 5v14M16 5v14"/>',
    ban:'<circle cx="12" cy="12" r="9"/><path d="M6 18L18 6"/>',
    key:'<circle cx="8" cy="14" r="4"/><path d="M11 11l8-8M17 5l2 2M15 7l2 2"/>',
    percent:'<path d="M6 6l12 12"/><circle cx="7.5" cy="7.5" r="2.2"/><circle cx="16.5" cy="16.5" r="2.2"/>',
    calc:'<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15v3"/>',
    zap:'<path d="M13 2L5 13h6l-1 9 8-11h-6z"/>',
    book:'<path d="M4 4h7a3 3 0 013 3v13a2.5 2.5 0 00-2.5-2.5H4z"/><path d="M20 4h-6a3 3 0 00-3 3v13a2.5 2.5 0 012.5-2.5H20z"/>',
    folder:'<path d="M3 6a2 2 0 012-2h4l2 2.5h8a2 2 0 012 2V18a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>',
    link:'<path d="M10 13a4 4 0 005.7 0l2.6-2.6A4 4 0 0012.6 4.7L11 6.3"/><path d="M14 11a4 4 0 00-5.7 0L5.7 13.6a4 4 0 005.7 5.7l1.6-1.6"/>',
    globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 2.5 15.4 0 18M12 3c-2.5 2.6-2.5 15.4 0 18"/>',
    db:'<ellipse cx="12" cy="6" rx="8" ry="3"/><path d="M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6"/><path d="M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/>',
    layers:'<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5M3 17l9 5 9-5"/>',
    hash:'<path d="M5 9h14M5 15h14M10 3L8 21M16 3l-2 18"/>',
    at:'<circle cx="12" cy="12" r="4"/><path d="M16 12v1.5a2.5 2.5 0 005 0V12a9 9 0 10-3.3 7"/>',
    phone:'<path d="M6 3h4l2 5-2.5 1.5a12 12 0 005 5L16 12l5 2v4a2 2 0 01-2 2A16 16 0 014 5a2 2 0 012-2z"/>',
    pin:'<path d="M12 21s7-6.3 7-11a7 7 0 10-14 0c0 4.7 7 11 7 11z"/><circle cx="12" cy="10" r="2.6"/>',
    bot:'<rect x="4" y="8" width="16" height="11" rx="3"/><path d="M12 4v4M8 13h.01M16 13h.01M9 16h6"/>',
    chat:'<path d="M21 12a8 8 0 01-8 8H8l-5 3 1.5-5A8 8 0 1121 12z"/>',
    history:'<path d="M3 12a9 9 0 109-9 9 9 0 00-7 3.4"/><path d="M3 4v4h4"/><path d="M12 8v4.5l3 1.8"/>',
    userPlus:'<circle cx="9.5" cy="8" r="3.4"/><path d="M3 20c0-3.3 2.8-5.2 6.5-5.2S16 16.7 16 20"/><path d="M18 8v6M15 11h6"/>',
    rotate:'<path d="M3 12a9 9 0 019-9 9 9 0 016.7 3"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 01-9 9 9 9 0 01-6.7-3"/><path d="M3 21v-5h5"/>',
    printer:'<path d="M7 9V3h10v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M7 17h10v4H7z"/>',
    lock:'<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 018 0v3"/>',
    star:'<path d="M12 3.5l2.6 5.6 6 .8-4.4 4.2 1.1 6-5.3-3-5.3 3 1.1-6L3.4 9.9l6-.8z"/>',
    help:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.6 2.6 0 014.9 1c0 1.8-2.4 2-2.4 3.8"/><path d="M12 17h.01"/>',
    grid:'<rect x="3" y="3" width="7.5" height="7.5" rx="1.5"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5"/><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5"/>',
    cols:'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M15 3v18"/>',
    split:'<path d="M12 3v18"/><path d="M5 8l3-3 3 3M8 21V5"/><path d="M16 12h5"/>',
    image:'<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9.5" r="1.8"/><path d="M4 18l5.5-5 3.5 3 3-2.5L20 18"/>',
    trending:'<path d="M3 17l6-6 4 3 8-8"/><path d="M15 6h6v6"/>',
    activity:'<path d="M3 12h4l3-7 4 14 3-7h4"/>',
    target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.4"/>',
    flag:'<path d="M5 21V4h9l-1 3h6l-1.5 4L19 15h-8l-1-3H5"/>',
    archive:'<rect x="3" y="4" width="18" height="5" rx="1.5"/><path d="M5 9v10a2 2 0 002 2h10a2 2 0 002-2V9"/><path d="M10 13h4"/>',
    external:'<path d="M15 3h6v6"/><path d="M21 3l-8 8"/><path d="M19 14v6H4V5h6"/>',
    scale:'<path d="M12 3v18"/><path d="M6 6h12"/><path d="M6 6L3 13h6zM18 6l-3 7h6z"/>',
    droplet:'<path d="M12 3s6 6.3 6 10.5A6 6 0 016 13.5C6 9.3 12 3 12 3z"/>',
    thermometer:'<path d="M14 14.8V5a2 2 0 10-4 0v9.8a4 4 0 104 0z"/><path d="M12 17h.01"/>',
    flask:'<path d="M9 3h6M10 3v6L5 19a2 2 0 001.8 3h10.4A2 2 0 0019 19l-5-10V3"/><path d="M7.5 14h9"/>',
    dna:'<path d="M7 3c0 6 10 6 10 12M17 3c0 6-10 6-10 12M7 21c0-2 1-3.5 2.5-5M17 21c0-2-1-3.5-2.5-5"/><path d="M9 6h4M11 9h5M10 15h5M9 18h4"/>',
    micro:'<path d="M9 3v8a3 3 0 006 0V3"/><path d="M5 10a7 7 0 0014 0"/><path d="M12 17v4M9 21h6"/>'
  };
  function icon(name, cls) {
    const p = I[name] || I.help;
    return '<svg class="' + (cls || 'ic') + '" viewBox="0 0 24 24" aria-hidden="true">' + p + '</svg>';
  }

  /* ---------------- словарь текстов (ТЗ: все строки в одном месте) ---------------- */
  const T = {
    app:'Автоматизация КП', appSub:'Дистрибьютор лабораторных товаров',
    today:'Сегодня', requests:'Входящие запросы', pipeline:'Воронка', clients:'Клиенты',
    suppliers:'Поставщики', calendar:'Календарь сроков', specs:'Спецификации',
    analytics:'Аналитика', newsletters:'Рассылки NEWS', pricelists:'Прайсы и номенклатура',
    pricing:'Правила расчёта', templates:'Шаблоны', users:'Пользователи и роли',
    audit:'Журнал действий', connections:'Подключения', profile:'Профиль', more:'Ещё',
    login:'Вход', logout:'Выйти', role:'Роль', theme:'Тема', themeLight:'Светлая', themeDark:'Тёмная',
    manager:'Менеджер', head:'Руководитель', admin:'Администратор',
    save:'Сохранить', cancel:'Отмена', close:'Закрыть', confirm:'Подтвердить', send:'Отправить',
    del:'Удалить', add:'Добавить', edit:'Редактировать', open:'Открыть', back:'Назад',
    loading:'Загрузка…', retry:'Повторить', empty:'Пусто', errorT:'Не удалось загрузить данные',
    errorD:'Проверьте соединение и повторите запрос.', accessDenied:'Доступ закрыт',
    accessDeniedD:'У вашей роли нет доступа к этому разделу. Обратитесь к администратору.',
    noAccess:'Раздел недоступен для текущей роли',
    searchPh:'Поиск: номер, клиент, артикул…',
    saved:'Сохранено', unsaved:'Есть несохранённые изменения',
    inTable:'Поиск по таблице: клиент, тема, артикул…', presets:'Мои представления', presetSave:'Сохранить представление',
    presetName:'Название представления', expandPos:'Показать позиции', collapsePos:'Скрыть позиции',
    activeFilters:'Активных фильтров', inlineHint:'Статус и ответственного можно менять прямо в строке.',
    discount:'Скидка, %', aiEditMail:'ИИ-редактор письма', aiImprove:'Улучшить', aiShorten:'Сократить',
    aiFormal:'Официальный тон', aiTranslate:'Перевести на русский', aiCheckArt:'Проверить артикулы',
    aiDiff:'Что изменит ИИ', aiApply:'Применить', aiCancel:'Оставить как было', mailDraft:'Черновик письма',
    rawMail:'Оригинал письма', requisites:'Реквизиты', position:'Должность', phone:'Телефон',
    saveRequisites:'Сохранить реквизиты', helpTitle:'Горячие клавиши и подсказки',
    supplierNew:'Новый поставщик', supplierAdded:'Поставщик добавлен', chartBig:'График', newsFile:'Выбрать файл получателей',
    mailSavedToast:'Черновик письма сохранён.', aiAppliedToast:'Изменения ИИ применены к письму.',
    discountApplied:'Скидка применена к позиции.', articleNotFound:'В номенклатуре такого артикула нет — введите вручную.',
    applyShort:'Применить', mailEmpty:'Текст письма пуст.', presetNamePh:'Например: Просрочка поставщиков',
    emptyTitle:'Здесь пока пусто', emptyText:'Данных для этого раздела нет. Измените фильтры или вернитесь на «Сегодня».',
    emptyAction:'Показать данные', errorTitle:'Не удалось загрузить данные',
    errorText:'Сервис не ответил. Проверьте подключение и повторите — ничего не потеряно.', errorRetry:'Повторить',
    stateLabel:'Состояние экрана', stateData:'Обычное', stateLoading:'Загрузка', stateEmpty:'Пусто', stateError:'Ошибка',
    nothingFound:'Ничего не найдено', nothingFoundD:'Измените запрос или сбросьте фильтры.',
    allDone:'Все запросы обработаны', allDoneD:'Новых писем нет. Последняя проверка почты: сегодня в 09:12.',
    requiresAction:'Требует действия', queueReview:'Очередь на проверку', waiting:'Ожидание',
    dayStats:'Статистика дня', positions:'Позиций', confidence:'Уверенность', status:'Статус',
    client:'Клиент', subject:'Тема письма', sum:'Сумма КП', assignee:'Ответственный', updated:'Обновлено',
    received:'Получено', number:'№', actions:'Действия', filters:'Фильтры', reset:'Сбросить',
    onlyAction:'Только требующие действия', lowConf:'Низкая уверенность', period:'Период',
    sortDate:'По дате', sortSum:'По сумме', sortStatus:'По статусу', sortClient:'По клиенту',
    exportXls:'Выгрузить XLSX', cols:'Колонки', selected:'Выбрано', assign:'Назначить', closeReq:'Закрыть',
    perPage:'на странице', found:'найдено', of:'из',
    email:'Письмо клиента', recognized:'Распознанные позиции', quote:'КП', history:'История',
    article:'Артикул', name:'Наименование', brand:'Бренд', qty:'Кол-во', unit:'Ед.',
    category:'Категория', supPrice:'Цена поставщика', source:'Источник цены', duty:'Пошлина',
    clientPrice:'Цена для клиента', amount:'Сумма', conf:'Уверенность',
    needArticle:'Нужен артикул', needPrice:'Цена не найдена', requestClient:'Запросить у клиента',
    requestSupplier:'Запросить у поставщика', addPos:'Добавить позицию', mergeDup:'Объединить дубли',
    totalNet:'Итого без пошлины', totalDuty:'Пошлина', total:'Итого', rate:'Курс',
    formQuote:'Сформировать КП', previewSend:'Предпросмотр и отправка', checkPos:'Проверьте позиции',
    unchecked:'непроверенных', aiEdit:'Улучшить письмо с ИИ', aiReply:'Составить ответ с ИИ',
    aiSummary:'Сводка по запросу с ИИ', aiTranslate:'Перевести на английский', aiAsk:'Спросить ИИ',
    aiTitle:'ИИ-помощник', aiHint:'Помогает с письмами, артикулами и расчётами. Все изменения применяются только после подтверждения.',
    aiApply:'Применить', aiCopy:'Копировать', aiGen:'Сгенерировать', aiThinking:'ИИ думает…',
    downloadXls:'Скачать XLS', saveDraft:'Сохранить черновик', sendClient:'Отправить клиенту',
    version:'Версия', versions:'Версии КП',
    syncNow:'Синхронизировать сейчас', lastSync:'Последняя синхронизация', rows:'Строк',
    importReport:'Отчёт об импорте', mapping:'Сопоставление колонок', findArticle:'Поиск по артикулам',
    matrix:'Ассортиментная матрица', dutyPct:'Пошлина по категории', markup:'Наценка',
    rateSource:'Источник курса', cbrf:'ЦБ РФ', manual:'Вручную', rounding:'Правило округления',
    calcCheck:'Калькулятор-проверка', applyRules:'Применить правила',
    tplEmail:'Шаблоны писем', tplDoc:'Шаблоны документов', vars:'Переменные', preview:'Предпросмотр',
    tplQuote:'КП клиенту', tplAskArticle:'Запрос артикула', tplAskSupplier:'Запрос поставщику (EN)',
    tplRemind:'Напоминание поставщику', tplRefuse:'Отказ клиенту', tplFollow:'Follow-up клиенту',
    invite:'Пригласить пользователя', inviteSend:'Отправить приглашение', block:'Блокировать',
    unblock:'Разблокировать', lastLogin:'Последний вход', roleChange:'Сменить роль',
    dragHint:'Перетащите карточку между разрешёнными статусами', invalidMove:'Переход не разрешён',
    daysInStatus:'дней в статусе', overdue:'Просрочено', waitingSupplier:'Ждём поставщика',
    responseTime:'Среднее время ответа', refusalRate:'Доля отказов', chains:'История запросов',
    parsedReply:'Разобранный ответ поставщика', accept:'Принять', reject:'Отклонить',
    step:'Шаг', step1:'Выбор PO', step2:'Свод позиций', step3:'Предпросмотр',
    choosePo:'Загрузите PO или выберите письмо', discrepancies:'Расхождения', mergeQty:'Суммы количеств',
    facsimile:'Факсимиле подписи и печати', createSpec:'Создать спецификацию',
    kpi:'Ключевые показатели', requestsCount:'Запросов', quotesSent:'КП отправлено',
    conversion:'Конверсия КП в заказ', avgTime:'Среднее время обработки', ordersSum:'Сумма заказов',
    byWeeks:'Запросы и КП по неделям', funnel:'Воронка статусов', topArticles:'Топ артикулов',
    topClients:'Топ клиентов', exportAny:'Любую таблицу можно выгрузить в XLSX',
    newslettersList:'Список рассылок', recipients:'Получателей', sentOk:'Отправлено', errors:'Ошибок',
    pauseQueue:'Пауза очереди', cancelQueue:'Отменить очередь', previewMail:'Предпросмотр письма',
    connectionsList:'Статус и проверка подключений', checkConn:'Проверить подключение',
    lastError:'Последняя ошибка', connected:'Подключено', noSecrets:'Секреты не показываются',
    profileAbout:'О системе и профиле', profileRole:'Текущая роль', profileTheme:'Оформление',
    stages:'Этапы системы', openStand:'Открыть стенд', hotkeys:'Горячие клавиши',
    undo:'Отменить', undoDone:'Действие отменено', confirmSend:'Подтвердите отправку',
    confirmSendD:'Письмо уйдёт клиенту только после вашего подтверждения. Проверьте адресата и вложение.',
    confirmClose:'Закрыть запрос?', confirmDel:'Удалить позицию?', yes:'Да, подтверждаю', no:'Нет'
  };

  /* ---------------- форматирование ---------------- */
  const nf = new Intl.NumberFormat('ru-RU');
  function money(v, cur) {
    if (v === undefined || v === null || v === '') return '—';
    if (cur && cur !== 'RUB') return nf.format(+v.toFixed(2)) + ' ' + cur;
    return nf.format(Math.round(v)) + ' ₽';
  }
  function money2(v, cur) { return v === undefined ? '—' : nf.format(+v.toFixed(2)) + ' ' + (cur || 'RUB'); }
  function num(v, d) { return v === undefined || v === null ? '—' : (+v).toFixed(d === undefined ? 2 : d).replace('.', ','); }
  function dt(iso) {
    if (!iso) return '—';
    const d = new Date(iso); if (isNaN(d)) return iso;
    const p = n => String(n).padStart(2, '0');
    return p(d.getDate()) + '.' + p(d.getMonth() + 1) + '.' + d.getFullYear() + ' ' + p(d.getHours()) + ':' + p(d.getMinutes());
  }
  function dOnly(iso) { return dt(iso).split(' ')[0]; }
  const esc = s => String(s === undefined || s === null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  function conf(p) {
    if (p >= 0.9) return { cls: 'c-hi', t: 'Уверенно' };
    if (p >= 0.7) return { cls: 'c-mid', t: 'Проверьте' };
    return { cls: 'c-lo', t: 'Нужна проверка' };
  }
  function confBadge(p) {
    const c = conf(p);
    return '<span class="conf ' + c.cls + '" title="' + num(p) + '"><i class="bd"></i>' + c.t + '</span>';
  }
  const toneCls = { warn: 'b-warn', info: 'b-info', ok: 'b-ok', bad: 'b-bad', neutral: 'b-neutral' };
  function statusBadge(code) {
    const m = window.MOCK.STATUS_MAP[code] || { label: code, tone: 'neutral' };
    return '<span class="badge ' + (toneCls[m.tone] || 'b-neutral') + '"><i class="bd"></i>' + esc(m.label) + '</span>';
  }

  /* ---------------- состояние ---------------- */
  const LS = 'kp-state-v1';
  const DEF = { theme: 'light', role: 'admin', collapsed: false, route: 'today', authed: true };
  let S = Object.assign({}, DEF);
  try { const raw = localStorage.getItem(LS); if (raw) S = Object.assign(S, JSON.parse(raw)); } catch (e) {}
  const saveState = () => { try { localStorage.setItem(LS, JSON.stringify(S)); } catch (e) {} };

  function roleCan(route) {
    /* служебные экраны доступны всем ролям: вход и карточка запроса */
    if (route === 'login' || route === 'request') return true;
    const R = {
      manager: ['today','requests','pipeline','clients','suppliers','calendar','specs','profile','more'],
      head: ['today','requests','pipeline','clients','suppliers','calendar','specs','analytics','newsletters','pricelists','pricing','audit','profile','more'],
      admin: ['today','requests','pipeline','clients','suppliers','calendar','specs','analytics','newsletters','pricelists','pricing','templates','users','audit','connections','profile','more']
    };
    return (R[S.role] || R.manager).indexOf(route) >= 0;
  }

  /* ---------------- тосты ---------------- */
  let toastBox;
  function toast(msg, tone, action) {
    if (!toastBox) { toastBox = document.createElement('div'); toastBox.className = 'toasts'; document.body.appendChild(toastBox); }
    const el = document.createElement('div');
    el.className = 'toast';
    const ic = tone === 'bad' ? 'alertC' : tone === 'warn' ? 'alertT' : tone === 'info' ? 'info' : 'checkCircle';
    el.innerHTML = '<span style="color:' + (tone === 'bad' ? 'var(--bad)' : tone === 'warn' ? 'var(--warn)' : 'var(--ok)') + '">' + icon(ic, 'ic-sm') + '</span><span class="grow">' + esc(msg) + '</span>';
    if (action) {
      const b = document.createElement('button');
      b.className = 'tact'; b.textContent = action.label;
      b.addEventListener('click', () => { action.fn(); el.remove(); });
      el.appendChild(b);
    }
    toastBox.appendChild(el);
    setTimeout(() => { el.style.opacity = '0'; el.style.transform = 'translateY(6px)'; setTimeout(() => el.remove(), 200); }, action ? 5200 : 3000);
  }
  function undoToast(msg, fn) { toast(msg, 'info', { label: T.undo, fn: function () { fn(); toast(T.undoDone, 'ok'); } }); }

  /* ---------------- оверлеи ---------------- */
  let scrim = null, openEl = null;
  function ensureScrim() {
    if (!scrim) {
      scrim = document.createElement('div'); scrim.className = 'scrim';
      scrim.addEventListener('click', closeOverlay);
      document.body.appendChild(scrim);
    }
    return scrim;
  }
  function openOverlay(el) {
    if (openEl && openEl !== el) openEl.classList.remove('on');
    ensureScrim().classList.add('on');
    el.classList.add('on'); openEl = el;
    const f = el.querySelector('input:not([type=hidden]),select,textarea,button');
    if (f && window.matchMedia('(min-width:861px)').matches) setTimeout(() => f.focus(), 60);
  }
  function closeOverlay() {
    if (openEl) openEl.classList.remove('on');
    if (scrim) scrim.classList.remove('on');
    openEl = null;
  }
  function overlay(id) { const el = document.getElementById(id); if (el) openOverlay(el); }
  function isOpen(id) { const el = document.getElementById(id); return !!(el && el.classList.contains('on')); }
  function togglePanel(id) { const el = document.getElementById(id); if (!el) return; if (el.classList.contains('on')) closeOverlay(); else openOverlay(el); }

  /* ---------------- ИИ-движок (эмуляция) ---------------- */
  const AI = {
    /* ИИ-редактор письма */
    improve(text, mode) {
      const base = String(text || '');
      const out = {
        polite: 'Добрый день!\n\n' + clean(base) + '\n\nБлагодарим за обращение. Готовы уточнить сроки и условия поставки — напишите удобный для вас канал связи.\n\nС уважением,\nотдел продаж neeklo-lab',
        short: shorten(base),
        formal: formalize(base),
        translate: translate(base),
        extract: extract(base)
      };
      return out[mode] || out.polite;
    },
    /* ИИ-ответ на письмо клиента */
    reply(req) {
      const pos = (req.positions || []).slice(0, 5);
      const missing = pos.filter(p => !p.article);
      const noPrice = pos.filter(p => !p.clientPriceRub);
      const L = [];
      L.push('Добрый день!');
      L.push('');
      L.push('Спасибо за запрос № ' + (2026 - 1000 + (req.number || 0)) + '. Мы приняли его в работу.');
      if (missing.length) L.push('Уточните, пожалуйста, артикулы по позициям: ' + missing.map(p => p.name).join('; ') + '.');
      if (noPrice.length) L.push('По ' + noPrice.length + ' поз. запрашиваем цены у производителя — вернёмся с подтверждением в течение 2 рабочих дней.');
      else L.push('Цены подтверждены по прайсам поставщиков, КП будет направлено сегодня.');
      L.push('');
      L.push('Ориентировочный срок поставки — 3–5 недель с момента оплаты. Условия оплаты: 100% предоплата.');
      L.push('');
      L.push('С уважением,');
      L.push((S.role === 'admin' ? 'Клочко Никита' : 'Сергеева Анна'));
      L.push('neeklo-lab · отдел продаж');
      return L.join('\n');
    },
    /* Сводка по запросу */
    summary(req) {
      const pos = req.positions || [];
      const noArt = pos.filter(p => !p.article).length;
      const noPrice = pos.filter(p => !p.clientPriceRub).length;
      const low = pos.filter(p => p.confidence < 0.7).length;
      const cat = {};
      pos.forEach(p => { cat[p.category] = (cat[p.category] || 0) + 1; });
      const L = [];
      L.push('Запрос № ' + (2026 - 1000 + (req.number || 0)) + ' от ' + dOnly(req.receivedAt) + ', ' + req.client.name + '.');
      L.push('Позиций: ' + pos.length + '. Состав: ' + Object.keys(cat).map(k => k + ' — ' + cat[k]).join(', ') + '.');
      if (noArt) L.push('Без артикула: ' + noArt + ' поз. — нужен запрос клиенту.');
      if (noPrice) L.push('Без цены: ' + noPrice + ' поз. — нужен запрос поставщику.');
      if (low) L.push('С низкой уверенностью распознавания: ' + low + ' поз. — проверить вручную.');
      if (!noArt && !noPrice && !low) L.push('Все позиции распознаны уверенно и имеют цену — можно формировать КП.');
      L.push('Итог: ' + (req.quoteTotalRub ? money(req.quoteTotalRub) : 'сумма считается в карточке запроса') + '.');
      return L.join('\n');
    },
    /* Рекомендации по артикулам */
    suggestArticles(names) {
      const M = window.MOCK.NAMES;
      const out = [];
      (names || []).forEach(n => {
        const q = String(n).toLowerCase().slice(0, 12);
        const hit = M.filter(m => m[1].toLowerCase().indexOf(q.slice(0, 6)) >= 0)[0] || M[out.length % M.length];
        out.push({ query: n, article: hit[0], name: hit[1], brand: window.MOCK.BRANDS[out.length % window.MOCK.BRANDS.length], cat: hit[2] });
      });
      return out;
    },
    /* Чат-движок */
    chat(q, ctx) {
      const s = String(q || '').toLowerCase();
      const R = window.MOCK.REQUESTS;
      if (/сводк|итог|сколько|статус/.test(s)) {
        const by = {}; R.forEach(r => { by[r.status] = (by[r.status] || 0) + 1; });
        return 'Сейчас в системе ' + R.length + ' запросов.\n' + Object.keys(by).map(k => '· ' + (window.MOCK.STATUS_MAP[k] || {}).label + ': ' + by[k]).join('\n') +
          '\n\nТребуют вашего действия: ' + R.filter(r => r.status === 'review').length + ' на проверке и ' + R.filter(r => r.status === 'need_article').length + ' без артикула.';
      }
      if (/поставщик|supplier/.test(s)) {
        const sp = window.MOCK.SUPPLIERS.slice().sort((a, b) => a[3] - b[3]);
        return 'Быстрее всех отвечают:\n' + sp.slice(0, 3).map(x => '· ' + x[0] + ' — ' + num(x[3], 1) + ' дн., отказов ' + Math.round(x[4] * 100) + '%').join('\n') +
          '\n\nМедленнее всех: ' + sp[sp.length - 1][0] + ' — ' + num(sp[sp.length - 1][3], 1) + ' дн.';
      }
      if (/цен|курс|пошлин|расчёт|расчет/.test(s)) {
        const r = window.MOCK.RATES.map(x => x.code + ' ' + num(x.rate) + ' ₽').join(', ');
        return 'Текущие курсы: ' + r + ' (источник: ЦБ РФ + надбавка 0%).\nПошлина 5% применяется к категориям «Реактивы» и «Лабораторные наборы».\n\nПример: 120 USD × 92,50 × 1,05 × 1,18 = ' + money(120 * 92.5 * 1.05 * 1.18) + ' за единицу.';
      }
      if (/артикул|номенклатур/.test(s)) {
        const noArt = [];
        R.forEach(r => (r.positions || []).forEach(p => { if (!p.article) noArt.push(r.client.name + ': ' + p.name); }));
        return 'Без артикула ' + noArt.length + ' позиций:\n' + noArt.slice(0, 6).map(x => '· ' + x).join('\n') +
          '\n\nНажмите «Запросить у клиента» в карточке запроса — письмо подставится автоматически.';
      }
      if (/срок|просроч|календар/.test(s)) {
        return 'В календаре ' + R.filter(r => r.status === 'waiting_supplier').length + ' запросов в ожидании поставщика.\n' +
          'Просрочены: ' + R.filter(r => r.status === 'waiting_supplier' && Math.random() > 0.6).length + ' (ожидание больше 5 дней).\n\n' +
          'Откройте раздел «Календарь сроков», чтобы увидеть сроки по неделям.';
      }
      if (/конверси|аналитик|kpi/.test(s)) {
        const sent = R.filter(r => r.quoteTotalRub).length;
        const won = R.filter(r => r.status === 'won').length;
        return 'КП отправлено: ' + sent + '\nВыиграно: ' + won + '\nКонверсия: ' + Math.round(won / Math.max(1, sent) * 100) + '%\n\n' +
          'Подробные графики — в разделе «Аналитика».';
      }
      if (ctx && ctx.req) return 'По запросу ' + ctx.req.client.name + ':\n\n' + AI.summary(ctx.req);
      return 'Могу помочь по системе:\n· «сводка по запросам» — сколько и в каких статусах\n· «поставщики» — кто быстрее отвечает\n· «цены и курс» — как считается цена для клиента\n· «артикулы» — где не хватает артикулов\n· «сроки» — что просрочено\n· «аналитика» — конверсия и показатели\n\nСпросите своими словами — отвечу по данным системы.';
    }
  };
  function clean(s) { return s.replace(/\s+/g, ' ').replace(/Добрый день!?/gi, '').trim(); }
  function shorten(s) {
    const t = clean(s).split(/(?<=[.!?])\s+/).slice(0, 3).join(' ');
    return 'Кратко:\n\n' + t + '\n\nДетали — во вложении.';
  }
  function formalize(s) {
    return 'Уважаемые коллеги!\n\n' + clean(s)
      .replace(/просим/gi, 'просим Вас').replace(/нужн/gi, 'необходимо')
      .replace(/спасибо/gi, 'благодарим') + '\n\nС уважением,\nотдел продаж neeklo-lab';
  }
  function translate(s) {
    return 'Dear colleagues,\n\n' + clean(s)
      .replace(/Добрый день!?/gi, '').replace(/Просим предоставить коммерческое предложение на следующие позиции/gi,
        'Please provide a quotation for the following items')
      .replace(/Срок поставки просим указать/gi, 'Please specify the delivery time')
      .replace(/Оплата по факту поставки/gi, 'Payment upon delivery')
      .replace(/С уважением, отдел закупок/gi, 'Best regards, procurement department')
      .replace(/—/g, '-') + '\n\nKind regards,\nProcurement Department';
  }
  function extract(s) {
    const lines = clean(s).split(/\s*·\s*|\s*;\s*/);
    const found = [];
    const re = /([А-Яа-яЁёA-Za-z0-9\-\s,\.()%«»"]{6,80})[—-]\s*(\d+)\s*(шт|уп|л|мл|кг|набор)/g;
    let m; while ((m = re.exec(s)) !== null) found.push({ name: m[1].trim(), qty: +m[2], unit: m[3] });
    if (!found.length) return 'Явных позиций с количеством в тексте не найдено.\n\nПроверьте вложение «Заявка.xlsx» — вероятно, позиции перечислены в файле.';
    return 'Найдено позиций: ' + found.length + '\n\n' + found.map((f, i) => (i + 1) + '. ' + f.name + ' — ' + f.qty + ' ' + f.unit).join('\n') +
      '\n\nНажмите «Применить», чтобы добавить их в таблицу позиций.';
  }

  /* ---------------- экспорт XLSX (в формате Excel-совместимого CSV с BOM) ---------------- */
  function exportXls(name, head, rows) {
    const q = v => '"' + String(v === undefined || v === null ? '' : v).replace(/"/g, '""') + '"';
    const csv = '\uFEFF' + [head.map(q).join(';')].concat(rows.map(r => r.map(q).join(';'))).join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name + '.csv';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    toast('Файл «' + name + '.csv» выгружен. Открывается в Excel.', 'ok');
  }

  /* ---------------- реестр действий ---------------- */
  const ACT = {};
  const define = (name, fn) => { ACT[name] = fn; };
  /* действия, требующие предварительного ввода в поле data-k, получают его первым аргументом */
  document.addEventListener('click', function (e) {
    const el = e.target.closest('[data-act]');
    if (el) {
      const a = el.getAttribute('data-act');
      const k = el.getAttribute('data-k') || el.getAttribute('data-id') || '';
      if (ACT[a]) { e.preventDefault(); ACT[a](k, el, e); return; }
      if (a === 'soon') { toast('Раздел появится на следующем этапе — уже в плане работ.', 'info'); return; }
    }
    if (openEl && !e.target.closest('.dlg,.sheet,.panel,[data-act]')) closeOverlay();
  }, false);

  /* автосохранение редактируемых ячеек */
  document.addEventListener('input', function (e) {
    const el = e.target.closest('[data-edit]');
    if (!el) return;
    const k = el.getAttribute('data-edit');
    const flag = el.closest('td,.field') && el.closest('td,.field').querySelector('[data-flag]');
    if (flag) { flag.innerHTML = 'Изменения…'; flag.className = 'muted tiny'; }
    clearTimeout(el.__t);
    el.__t = setTimeout(function () {
      if (ACT[k]) ACT[k](el.value, el);
      if (flag) { flag.innerHTML = icon('check', 'ic-sm') + ' ' + T.saved; flag.className = 'save-flag'; }
    }, 650);
  }, false);
  document.addEventListener('change', function (e) {
    const el = e.target.closest('[data-act-change]');
    if (!el) return;
    const a = el.getAttribute('data-act-change');
    if (ACT[a]) ACT[a](el.value, el, e);
  }, false);
  /* живой ввод: поиск по таблице и другие поля с мгновенной реакцией */
  document.addEventListener('input', function (e) {
    const el = e.target.closest('[data-act-input]');
    if (!el) return;
    const a = el.getAttribute('data-act-input');
    clearTimeout(el.__it);
    el.__it = setTimeout(function () { if (ACT[a]) ACT[a](el.value, el, e); }, 160);
  }, false);
  document.addEventListener('keydown', function (e) {
    const el = e.target.closest && e.target.closest('[data-act-input]');
    if (el && e.key === 'Escape') { el.value = ''; const a = el.getAttribute('data-act-input'); if (ACT[a]) ACT[a]('', el, e); el.blur(); }
  }, true);

  /* клавиатура: Esc, / — поиск, J/K — навигация по списку, Ctrl+Enter — подтвердить */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeOverlay(); closeSearch(); return; }
    const typing = /INPUT|TEXTAREA|SELECT/.test(document.activeElement && document.activeElement.tagName);
    if (e.key === '/' && !typing) { e.preventDefault(); focusSearch(); return; }
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey) && ACT['hotConfirm']) { ACT['hotConfirm'](); return; }
    if ((e.ctrlKey || e.metaKey) && (e.key === 'b' || e.key === 'B') && ACT['hotSide']) { e.preventDefault(); ACT['hotSide'](); return; }
    if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K') && ACT['hotAi']) { e.preventDefault(); ACT['hotAi'](); return; }
    if (!typing && (e.key === 'j' || e.key === 'J') && ACT['hotNext']) ACT['hotNext'](1);
    if (!typing && (e.key === 'k' || e.key === 'K') && ACT['hotNext']) ACT['hotNext'](-1);
  });

  function focusSearch() {
    const i = document.querySelector('#gSearch input');
    if (i) { i.focus(); i.select(); }
  }
  function closeSearch() {
    const s = document.getElementById('gSearch');
    if (s) s.classList.remove('on');
    const r = document.getElementById('sres'); if (r) r.remove();
  }

  /* ---------------- анимация появления ---------------- */
  let io = null;
  function reveal(root) {
    const els = (root || document).querySelectorAll('.rv:not(.in)');
    if (!('IntersectionObserver' in window)) { els.forEach(x => x.classList.add('in')); return; }
    if (!io) io = new IntersectionObserver(function (en) {
      en.forEach(function (x) {
        if (!x.isIntersecting) return;
        const sibs = Array.prototype.slice.call(x.target.parentNode.children).filter(c => c.classList && c.classList.contains('rv'));
        x.target.style.transitionDelay = (Math.min(8, Math.max(0, sibs.indexOf(x.target))) * 55) + 'ms';
        x.target.classList.add('in'); io.unobserve(x.target);
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.08 });
    els.forEach(x => io.observe(x));
  }

  /* ---------------- доступ к данным с состоянием ---------------- */
  const DB = {
    requests: null, pricelists: null, rules: null, rates: null, specs: null,
    newsletters: null, users: null, audit: null, connections: null, activity: null,
    init() {
      const M = window.MOCK;
      const saved = (function () { try { return JSON.parse(localStorage.getItem('kp-db-v1') || 'null'); } catch (e) { return null; } })();
      this.requests = saved && saved.requests ? saved.requests : JSON.parse(JSON.stringify(M.REQUESTS));
      this.pricelists = JSON.parse(JSON.stringify(M.PRICELISTS));
      this.rules = JSON.parse(JSON.stringify(M.RULES));
      this.rates = JSON.parse(JSON.stringify(M.RATES));
      this.specs = JSON.parse(JSON.stringify(M.SPECS));
      this.newsletters = JSON.parse(JSON.stringify(M.NEWSLETTERS));
      this.users = JSON.parse(JSON.stringify(M.USERS));
      this.audit = JSON.parse(JSON.stringify(M.AUDIT));
      this.connections = JSON.parse(JSON.stringify(M.CONNECTIONS));
      this.activity = JSON.parse(JSON.stringify(M.ACTIVITY));
    },
    persist() { try { localStorage.setItem('kp-db-v1', JSON.stringify({ requests: this.requests })); } catch (e) {} },
    reset() { try { localStorage.removeItem('kp-db-v1'); } catch (e) {} this.init(); },
    req(id) { return this.requests.filter(r => r.id === id)[0]; },
    byNumber(n) { return n ? this.requests.filter(r => '2026-' + r.number === String(n))[0] || this.requests.filter(r => String(r.number) === String(n).replace(/\D/g, ''))[0] : null; },
    clientNames() { const s = {}; this.requests.forEach(r => { s[r.client.name] = (s[r.client.name] || 0) + 1; }); return Object.keys(s).sort(); },
    log(action, object) {
      this.audit.unshift({ id: 'a' + Date.now(), at: dt(new Date().toISOString()), actor: 'Клочко Н.', action: action, object: object || '—' });
    },
    addActivity(req, actor, action, details) {
      if (!req.act) req.act = [];
      req.act.unshift({ at: dt(new Date().toISOString()), actor: actor, action: action, details: details || '' });
    },
    totals(req) {
      let net = 0, dutySum = 0, withDuty = 0, missingPrice = 0;
      req.positions.forEach(p => {
        if (p.clientPriceRub === undefined) { missingPrice++; return; }
        const gross = p.supplierPrice * (this.rateFor(p.supplierCurrency)) * (1 + (p.dutyPct || 0) / 100);
        const netUnit = p.clientPriceRub / 1.18;
        net += netUnit * p.qty; dutySum += (netUnit - netUnit / (1 + (p.dutyPct || 0) / 100)) * p.qty;
        withDuty += p.totalRub || 0;
      });
      return { net: Math.round(net / 100) * 100, duty: Math.round(dutySum / 100) * 100, total: Math.round(withDuty), missingPrice: missingPrice };
    },
    rateFor(cur) { const r = this.rates.filter(x => x.code === cur)[0]; return r ? r.rate : 1; },
    recalc(p) {
      if (p.supplierPrice === undefined || !p.supplierCurrency) { p.clientPriceRub = undefined; p.totalRub = undefined; return; }
      const rule = this.rules.filter(r => r.cat === p.category)[0] || { duty: 5, markup: 18 };
      p.dutyPct = rule.duty;
      const disc = Math.max(0, Math.min(90, +(p.discount || 0)));
      const base = p.supplierPrice * this.rateFor(p.supplierCurrency) * (1 + rule.duty / 100) * (1 + rule.markup / 100);
      p.clientPriceRub = Math.round(base * (1 - disc / 100));
      p.totalRub = p.clientPriceRub * p.qty;
    },
    /* номенклатура для автокомплита артикулов: артикул → {name, brand, cat, price, cur} */
    articleIndex() {
      if (this.__artIdx) return this.__artIdx;
      const idx = {};
      (this.pricelists || []).forEach(pl => (pl.rows || []).forEach(r => {
        if (r && r.article) idx[r.article] = { name: r.name, brand: r.brand, cat: r.cat, price: r.price, cur: r.cur };
      }));
      (this.requests || []).forEach(rq => (rq.positions || []).forEach(pp => { if (pp.article) idx[pp.article] = { name: pp.name, brand: pp.brand, cat: pp.category, price: pp.supplierPrice, cur: pp.supplierCurrency || 'USD' }; }));
      this.__artIdx = idx;
      return idx;
    },
    articleSuggest(q) {
      const idx = this.articleIndex(); const qq = String(q || '').toLowerCase();
      return Object.keys(idx).filter(a => a.toLowerCase().indexOf(qq) >= 0).slice(0, 8).map(a => ({ article: a, info: idx[a] }));
    },
    /* поставщики: базовые из моков + добавленные пользователем */
    suppliers() {
      const extra = (function () { try { return JSON.parse(localStorage.getItem('kp-sup-extra') || '[]'); } catch (e) { return []; } })();
      return (window.MOCK.SUPPLIERS || []).concat(extra);
    },
    addSupplier(row) {
      const extra = (function () { try { return JSON.parse(localStorage.getItem('kp-sup-extra') || '[]'); } catch (e) { return []; } })();
      extra.push(row);
      try { localStorage.setItem('kp-sup-extra', JSON.stringify(extra)); } catch (e) {}
    },
    counts() {
      const R = this.requests;
      return {
        review: R.filter(r => r.status === 'review').length,
        needArticle: R.filter(r => r.status === 'need_article').length,
        supplier: R.filter(r => r.status === 'waiting_supplier').length,
        late: R.filter(r => r.status === 'waiting_supplier').length,
        quoteSent: R.filter(r => r.status === 'quote_sent').length,
        newToday: R.filter(r => r.receivedAt.indexOf('2026-09-23') === 0 || r.receivedAt.indexOf('2026-09-22') === 0).length,
        unread: R.filter(r => r.unread).length,
        lowConf: R.filter(r => r.minConfidence < 0.7).length
      };
    }
  };

  /* ---------------- роутер ---------------- */
  const ROUTES = {
    today:      { t: T.today,      sec: 'Работа',     icon: 'home' },
    requests:   { t: T.requests,   sec: 'Работа',     icon: 'inbox' },
    pipeline:   { t: T.pipeline,   sec: 'Работа',     icon: 'kanban' },
    clients:    { t: T.clients,    sec: 'Работа',     icon: 'users' },
    suppliers:  { t: T.suppliers,  sec: 'Этап 2',     icon: 'truck' },
    calendar:   { t: T.calendar,   sec: 'Этап 2',     icon: 'calendar' },
    specs:      { t: T.specs,      sec: 'Этап 3',     icon: 'file' },
    analytics:  { t: T.analytics,  sec: 'Этап 3',     icon: 'chart' },
    newsletters:{ t: T.newsletters,sec: 'Этап 3',     icon: 'send' },
    connections:{ t: T.connections,sec: 'Этап 3',     icon: 'plug' },
    pricelists: { t: T.pricelists, sec: 'Настройки',  icon: 'db' },
    pricing:    { t: T.pricing,    sec: 'Настройки',  icon: 'percent' },
    templates:  { t: T.templates,  sec: 'Настройки',  icon: 'book' },
    users:      { t: T.users,      sec: 'Настройки',  icon: 'userPlus' },
    audit:      { t: T.audit,      sec: 'Настройки',  icon: 'history' },
    profile:    { t: T.profile,    sec: 'Профиль',    icon: 'user' },
    more:       { t: T.more,       sec: 'Профиль',    icon: 'grid' },
    login:      { t: T.login,      sec: 'Профиль',    icon: 'login' }
  };

  function cur() {
    const h = (location.hash || '').replace(/^#\/?/, '');
    const base = h.split('/')[0];
    if (base === 'request') return 'request';
    return ROUTES[h] ? h : 'today';
  }
  let renderFn = null, lastRender = 0;
  function go(route, opts) {
    const r = ROUTES[route] ? route : 'today';
    if (!roleCan(r)) { toast(T.noAccess, 'warn'); }
    S.route = r; saveState();
    if (location.hash !== '#/' + r) {
      if (opts && opts.replace && history.replaceState) history.replaceState(null, '', '#/' + r);
      else location.hash = '#/' + r;
    }
    render(true);
  }
  const RENDERERS = {};

  /* Состояния экрана: data (обычное), loading, empty, error — по ТЗ раздел 10.
     Переключение: ?mock=loading|empty|error (как у остальных стендов) или UI.MOCK(). */
  const STATES = ['data', 'loading', 'empty', 'error'];
  let MOCKSTATE = 'data';
  let mockTimer = null;
  function readMockFromUrl() {
    try {
      const q = new URLSearchParams(location.search).get('mock');
      if (STATES.indexOf(q) >= 0) MOCKSTATE = q;
    } catch (e) {}
  }
  function setMock(v) {
    MOCKSTATE = STATES.indexOf(v) >= 0 ? v : 'data';
    try {
      const u = new URL(location.href);
      if (MOCKSTATE === 'data') u.searchParams.delete('mock'); else u.searchParams.set('mock', MOCKSTATE);
      history.replaceState(null, '', u.toString());
    } catch (e) {}
    if (mockTimer) { clearTimeout(mockTimer); mockTimer = null; }
    render(true);
    if (MOCKSTATE === 'loading') mockTimer = setTimeout(() => setMock('data'), 2600);
  }
  readMockFromUrl();

  function skeleton(route) {
    const rows = route === 'requests' ? 8 : 4;
    return '<div class="content">' +
      '<div class="row" style="align-items:flex-end;gap:16px;margin-bottom:16px">' +
        '<div class="grow"><div class="sk" style="height:26px;width:280px;border-radius:6px"></div>' +
        '<div class="sk" style="height:14px;width:380px;max-width:60%;border-radius:6px;margin-top:9px"></div></div>' +
        '<div class="sk" style="height:38px;width:120px;border-radius:var(--r-sm)"></div>' +
        '<div class="sk" style="height:38px;width:120px;border-radius:var(--r-sm)"></div></div>' +
      '<div class="grid rv" style="grid-template-columns:repeat(auto-fit,minmax(190px,1fr));margin-bottom:16px">' +
        [0, 1, 2, 3].map(() => '<div class="card pad"><div class="sk" style="height:12px;width:70%;border-radius:6px"></div>' +
          '<div class="sk" style="height:22px;width:45%;border-radius:6px;margin-top:10px"></div></div>').join('') +
      '</div>' +
      '<div class="tw"><div class="toolbar"><span class="small muted">Загружаю данные…</span>' +
        '<div class="grow"></div><span class="small muted">Осталось немного</span></div>' +
        '<div style="padding:14px">' + Array.from({ length: rows }).map(() => '<div class="sk sk-row"></div>').join('') + '</div></div></div>';
  }
  function stateWrap(kind, title, text, actions) {
    const cls = kind === 'error' ? 'err-state' : 'empty';
    return '<div class="content"><div class="' + cls + '">' +
      '<span class="ei">' + icon(kind === 'error' ? 'alertC' : 'search') + '</span>' +
      '<h3 class="h2">' + esc(title) + '</h3><p class="muted">' + esc(text) + '</p>' +
      '<div class="row" style="margin-top:6px">' + actions + '</div></div></div>';
  }
  function stateView(route) {
    if (MOCKSTATE === 'loading') return skeleton(route);
    if (MOCKSTATE === 'empty') {
      return stateWrap('empty', T.emptyTitle, T.emptyText,
        '<button class="btn primary" data-act="mockSet" data-k="data">' + icon('refresh', 'ic-sm') + ' ' + T.emptyAction + '</button>' +
        '<button class="btn" data-act="go" data-k="today">' + icon('home', 'ic-sm') + ' На «Сегодня»</button>');
    }
    if (MOCKSTATE === 'error') {
      return stateWrap('error', T.errorTitle, T.errorText,
        '<button class="btn primary" data-act="mockRetry">' + icon('refresh', 'ic-sm') + ' ' + T.errorRetry + '</button>' +
        '<button class="btn" data-act="go" data-k="today">' + icon('home', 'ic-sm') + ' На «Сегодня»</button>');
    }
    return null;
  }

  function render(force) {
    const r = S.authed ? cur() : 'login';
    const t = Date.now();
    if (!force && t - lastRender < 40) return;
    lastRender = t;
    document.documentElement.setAttribute('data-theme', S.theme);
    document.documentElement.setAttribute('data-role', S.role);
    const view = document.getElementById('view');
    if (!view) return;
    const fn = RENDERERS[r] || RENDERERS.today;
    const st = stateView(r);
    if (!roleCan(r)) { view.innerHTML = shell.accessDenied(r); }
    else view.innerHTML = st || fn();
    view.querySelector('.content') && view.querySelector('.content').scrollIntoView({ block: 'start' });
    window.scrollTo({ top: 0, behavior: 'auto' });
    reveal(view);
    if (window.__afterRender) window.__afterRender(r);
  }
  const shell = {
    accessDenied(route) {
      return '<div class="content"><div class="err-state">' +
        '<span class="ei">' + icon('lock') + '</span>' +
        '<h3 class="h2">' + T.accessDenied + '</h3>' +
        '<p class="muted">' + T.accessDeniedD + '</p>' +
        '<div class="row" style="margin-top:6px">' +
        '<button class="btn primary" data-act="switchRole">' + icon('user', 'ic-sm') + ' Сменить роль</button>' +
        '<button class="btn" data-act="go" data-k="today">' + icon('home', 'ic-sm') + ' На «Сегодня»</button>' +
        '</div></div></div>';
    }
  };

  window.addEventListener('hashchange', function () { render(true); });

  /* ---------------- публичный API ---------------- */
  window.UI = {
    I: I, icon: icon, T: T, S: S, saveState: saveState, DB: DB, ACT: ACT, define: define,
    go: go, cur: cur, render: render, RENDERERS: RENDERERS, ROUTES: ROUTES, roleCan: roleCan,
    toast: toast, undoToast: undoToast, openOverlay: openOverlay, closeOverlay: closeOverlay,
    overlay: overlay, isOpen: isOpen, togglePanel: togglePanel, reveal: reveal,
    money: money, money2: money2, num: num, dt: dt, dOnly: dOnly, esc: esc,
    conf: conf, confBadge: confBadge, statusBadge: statusBadge, toneCls: toneCls,
    exportXls: exportXls, AI: AI, shell: shell, closeSearch: closeSearch,
    mock: () => MOCKSTATE, setMock: setMock
  };
})();

/* ===== views1.js ===== */
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
        '<div class="small muted" style="margin-top:3px">Требуют ручной проверки позиций: ' + low.length + '</div>' +
        '<div class="chips" style="margin-top:8px">' + low.slice(0, 4).map(r => '<span class="chip static">' + esc(r.client.name) + '</span>').join('') +
        (low.length > 4 ? '<span class="chip static">+' + (low.length - 4) + '</span>' : '') + '</div>' +
        '<button class="btn sm" style="margin-top:12px" data-act="filterLowConf">' + icon('filter', 'ic-sm') + ' Показать их</button>' +
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
      '</tr></thead><tbody>' + rows.map(c => '<tr class="rowclick" data-act="openClient" data-k="' + esc(c.name) + '">' +
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

/* ===== views2.js ===== */
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
    const R2 = DB.requests.slice(0, 18);
    const weeks = [['21–27 сентября', 0], ['28 сентября — 4 октября', 7], ['5–11 октября', 14], ['12–18 октября', 21]];
    return '<div class="content">' +
      head('Календарь сроков', 'Сроки ответов поставщиков, напоминания и просрочки',
        '<button class="btn" data-act="calToday">' + icon('target', 'ic-sm') + ' Сегодня</button>' +
        '<button class="btn" data-act="exportCalendar">' + icon('download', 'ic-sm') + ' ' + T.exportXls + '</button>') +
      '<div class="grid rv" style="grid-template-columns:repeat(auto-fit,minmax(190px,1fr));margin-bottom:16px">' +
      '<div class="stat bad"><span class="k">Просрочено</span><span class="v">' + R2.filter(r => r.status === 'waiting_supplier').length + '</span></div>' +
      '<div class="stat warn"><span class="k">На этой неделе</span><span class="v">' + R2.filter(r => r.status === 'waiting_supplier').length + 3 + '</span></div>' +
      '<div class="stat info"><span class="k">Напоминаний</span><span class="v">4</span></div>' +
      '<div class="stat ok"><span class="k">Закрыто в срок</span><span class="v">87%</span></div></div>' +
      '<div class="col rv" style="gap:14px">' + weeks.map((w, wi) => {
        const items = R2.slice(wi * 4, wi * 4 + 4);
        return '<div class="card"' + (wi === 0 && CALW === 'this' ? ' id="cal-this"' : '') + '><div class="card-h"><div class="h3">' + esc(w[0]) + '</div>' +
          '<div class="grow"></div>' + (wi === 0 ? '<span class="badge b-warn">текущая неделя</span>' : '') + '</div>' +
          '<div class="card-b" style="padding:0">' + items.map(r => {
            const over = wi === 0 && r.status === 'waiting_supplier';
            return '<div class="row" style="padding:11px 15px;border-bottom:1px solid var(--line);gap:12px">' +
              '<span class="badge ' + (over ? 'b-bad' : 'b-info') + '">' + (over ? T.overdue : 'в срок') + '</span>' +
              '<div class="grow"><div class="small" style="font-weight:600">' + esc(r.client.name) + ' · № 2026-' + r.number + '</div>' +
              '<div class="tiny muted">' + esc(r.subject) + '</div></div>' +
              '<span class="small muted nowrap">' + U.dOnly(r.receivedAt) + '</span>' +
              U.statusBadge(r.status) +
              '<button class="btn sm" data-act="openReq" data-k="' + r.id + '">Открыть</button></div>';
          }).join('') + '</div></div>';
      }).join('') + '</div></div>';
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

/* ===== views3.js ===== */
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
      card(T.byWeeks, 'Запросы по неделям',
        '<button class="btn sm" data-act="chartOpen" data-k="Запросы по неделям">' + icon('ext', 'ic-sm') + ' Развернуть</button>', '<div class="mini-bar">' +
        weeks.map((w, i) => '<i style="height:' + Math.round(w / maxW * 100) + '%" title="Неделя ' + (i + 1) + ': ' + w + ' запросов"></i>').join('') +
        '</div><div class="legend"><span>' + icon('trending', 'ic-sm') + ' Средний рост +12% за неделю</span></div>') +
      card(T.funnel, 'Распределение по статусам',
        '<button class="btn sm" data-act="chartOpen" data-k="Статусы">' + icon('ext', 'ic-sm') + ' Развернуть</button>', '<div class="col" style="gap:9px">' +
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

/* ===== actions.js ===== */
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
  D('themeToggle', () => U.ACT['setTheme']());
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


  /* ---------- поиск, представления и инлайн-правка в таблице ---------- */
  D('tqSet', v => { F.q = String(v || ''); F.page = 1; re(); });
  D('tqClear', () => { F.q = ''; F.page = 1; re(); focusTableSearch(); });
  function focusTableSearch() { setTimeout(() => { const i = document.querySelector('[data-act-input=tqSet]'); if (i) i.focus(); }, 60); }
  D('toggleRow', id => { F.exp[id] = !F.exp[id]; re(); });
  D('statusInline', function (v, el) {
    const id = el.getAttribute('data-id'), r = DB.req(id); if (!r) return;
    const prev = r.status;
    if (prev === v) return;
    if ((window.MOCK.TRANSITIONS[prev] || []).indexOf(v) < 0) {
      toast(T.invalidMove + ': ' + (window.MOCK.STATUS_MAP[prev] || {}).label + ' → ' + (window.MOCK.STATUS_MAP[v] || {}).label, 'bad');
      re(); return;
    }
    r.status = v;
    if (v === 'won' || v === 'lost') r.updatedAt = new Date('2026-09-23T18:40:00+03:00').toISOString();
    DB.addActivity(r, 'Клочко Н.', 'Смена статуса', (window.MOCK.STATUS_MAP[prev] || {}).label + ' → ' + (window.MOCK.STATUS_MAP[v] || {}).label);
    DB.log('Смена статуса', '№ 2026-' + r.number); DB.persist(); re();
    toast('Статус 2026-' + r.number + ': ' + (window.MOCK.STATUS_MAP[v] || {}).label + '.', 'ok');
  });
  D('assigneeInline', function (v, el) {
    const id = el.getAttribute('data-id'), r = DB.req(id); if (!r) return;
    const prev = r.assignee.name; if (prev === v) return;
    r.assignee = { id: 'm' + (v.length % 9), name: v };
    DB.addActivity(r, 'Клочко Н.', 'Назначен ответственный', prev + ' → ' + v);
    DB.log('Назначение ответственного', '№ 2026-' + r.number); DB.persist(); re();
    toast('Ответственный: ' + v + '.', 'ok');
  });
  D('assignInline', id => {
    const r = DB.req(id); if (!r) return;
    const html = '<div class="radio-list">' + window.MOCK.MANAGERS.map(m =>
      '<label class="radio-i' + (r.assignee.name === m[1] ? ' on' : '') + '"><input type="radio" name="asg2" data-act-change="assignInlineSet" data-id="' + r.id + '|' + m[1] + '"' + (r.assignee.name === m[1] ? ' checked' : '') + '> ' + esc(m[1]) + '</label>').join('') + '</div>' +
      '<div class="fhint" style="margin-top:8px">' + icon('info', 'ic-sm') + ' ' + T.inlineHint + '</div>';
    mountDlg('dlgAsgInline', 'Назначить ответственного — 2026-' + r.number, html,
      '<button class="btn" data-act="closeDlg">' + T.close + '</button>');
  });
  D('assignInlineSet', function (v, el) {
    const [id, name] = el.getAttribute('data-id').split('|');
    const r = DB.req(id); if (!r) return;
    r.assignee = { id: 'm' + (name.length % 9), name: name };
    DB.addActivity(r, 'Клочко Н.', 'Назначен ответственный', name);
    DB.log('Назначение ответственного', '№ 2026-' + r.number); DB.persist();
    U.closeOverlay(); re(); toast('Ответственный: ' + name + '.', 'ok');
  });
  D('savePreset', () => {
    const cur = { status: F.status, assignee: F.assignee, client: F.client, period: F.period, q: F.q, action: F.action, low: F.low, sort: F.sort, dir: F.dir };
    mountDlg('dlgPreset', T.presetSave,
      '<div class="field"><label>' + T.presetName + '</label><input class="inp" id="psName" placeholder="' + esc(T.presetNamePh) + '"></div>' +
      '<div class="diff"><div class="d-h">Что сохранится</div><pre>' + esc([
        'Статус: ' + (F.status ? (window.MOCK.STATUS_MAP[F.status] || {}).label : 'все'),
        'Ответственный: ' + (F.assignee || 'все'),
        'Клиент: ' + (F.client || 'все'),
        'Период: ' + (F.period ? F.period + ' дней' : 'весь'),
        'Поиск: ' + (F.q || '—'),
        'Только требующие действия: ' + (F.action ? 'да' : 'нет'),
        'Низкая уверенность: ' + (F.low ? 'да' : 'нет')
      ].join('\n')) + '</pre></div>' +
      '<div class="fhint">' + icon('info', 'ic-sm') + ' Представление хранится локально в этом браузере.</div>',
      '<button class="btn" data-act="closeDlg">' + T.cancel + '</button>' +
      '<button class="btn primary" data-act="savePresetApply" data-k="' + encodeURIComponent(JSON.stringify(cur)) + '">' + icon('check', 'ic-sm') + ' ' + T.save + '</button>');
  });
  D('savePresetApply', (k, el) => {
    const name = ((document.getElementById('psName') || {}).value || '').trim();
    if (!name) return toast('Введите название представления.', 'warn');
    const list = window.__views1.loadPresets();
    list.push({ name: name, filter: JSON.parse(decodeURIComponent(k)) });
    try { localStorage.setItem('kp-presets-v1', JSON.stringify(list)); } catch (e) {}
    U.closeOverlay(); re(); toast('Представление «' + name + '» сохранено.', 'ok');
  });
  D('applyPreset', k => {
    const list = window.__views1.loadPresets(), p = list[+k]; if (!p) return;
    Object.keys(p.filter).forEach(x => { F[x] = p.filter[x]; });
    F.page = 1; re(); toast('Представление «' + p.name + '» применено.', 'ok');
  });
  D('delPreset', (k, el) => {
    const list = window.__views1.loadPresets(); const i = +k;
    if (!list[i]) return;
    const name = list[i].name; list.splice(i, 1);
    try { localStorage.setItem('kp-presets-v1', JSON.stringify(list)); } catch (e) {}
    re(); toast('Представление «' + name + '» удалено.', 'ok');
  });

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
  D('openRawMail', id => {
    const r = DB.req(id) || curReq(); if (!r) return;
    mountDlg('dlgRawMail', T.rawMail + ' — 2026-' + r.number,
      '<div class="row wrap" style="gap:8px;margin-bottom:10px">' +
        '<span class="badge b-neutral">Только чтение</span>' +
        '<span class="badge b-info">' + esc(r.email.from) + '</span>' +
        '<span class="badge b-neutral">' + esc(r.email.date) + '</span></div>' +
      '<div class="field"><label>От</label><input class="inp" value="' + esc(r.email.from) + '" readonly></div>' +
      '<div class="field"><label>Кому</label><input class="inp" value="' + esc(r.email.to) + '" readonly></div>' +
      '<div class="field"><label>Тема</label><input class="inp" value="' + esc(r.email.subject) + '" readonly></div>' +
      '<div class="field"><label>Тело письма</label><div class="mail-body" style="border:1px solid var(--line);border-radius:var(--r)">' + esc(r.email.body) + '</div></div>' +
      '<div class="field"><label>Вложения (' + r.email.attachments.length + ')</label><div class="col" style="gap:6px">' +
        r.email.attachments.map(a => '<div class="att" style="cursor:default"><span style="color:var(--accent)">' + icon(a.type === 'pdf' ? 'file' : 'grid', 'ic-sm') + '</span>' +
          '<span class="grow"><span class="small" style="font-weight:600">' + esc(a.name) + '</span><span class="tiny muted"> · ' + esc(a.size) + '</span></span></div>').join('') +
      '</div></div>' +
      '<div class="fhint">' + icon('shield', 'ic-sm') + ' HTML письма санитизирован: внешние изображения и скрипты заблокированы.</div>',
      '<button class="btn" data-act="closeDlg">' + T.close + '</button>' +
      '<button class="btn primary" data-act="mailEdit" data-k="' + r.id + '">' + icon('edit', 'ic-sm') + ' Редактировать</button>');
  });
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
  D('reqArticleAll', id => { const r = DB.req(id) || curReq(); if (r) reqArticleDialog(r.id, null); });
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
  D('aiTpl', mode => U.ACT['aiEmail'](mode));
  D('aiCopyText', id => { const el = document.getElementById(id); if (el) { el.select(); try { document.execCommand('copy'); } catch (e) {} toast('Текст скопирован в буфер обмена.', 'ok'); } });
  D('aiApply', () => { toast('Применено.', 'ok'); re(); });
  D('aiGen', () => U.ACT['aiEmail']('polite'));
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
  D('newSupplier', () => {
    mountDlg('dlgNewSup', T.supplierNew,
      '<div class="field"><label>Название</label><input class="inp" id="nsName" placeholder="Например, BioLegend"></div>' +
      '<div class="field"><label>Email для запросов</label><input class="inp" id="nsMail" type="email" placeholder="orders@company.com"></div>' +
      '<div class="field"><label>Бренды (через запятую)</label><input class="inp" id="nsBrands" placeholder="BioLegend, Sony"></div>' +
      '<div class="row" style="gap:10px"><div class="field grow"><label>Валюты</label><input class="inp" id="nsCur" value="USD" readonly></div>' +
      '<div class="field grow"><label>Срок ответа, дн.</label><input class="inp" id="nsDays" type="number" min="0" step="0.1" value="3"></div></div>' +
      '<div class="fhint">' + icon('info', 'ic-sm') + ' Поставщик попадёт в список запросов цен и в карточки поставщиков.</div>',
      '<button class="btn" data-act="closeDlg">' + T.cancel + '</button>' +
      '<button class="btn primary" data-act="newSupplierSave">' + icon('plus', 'ic-sm') + ' ' + T.save + '</button>');
  });
  D('newSupplierSave', () => {
    const g = id => ((document.getElementById(id) || {}).value || '').trim();
    const name = g('nsName'), mail = g('nsMail');
    if (!name) return toast('Укажите название поставщика.', 'warn');
    if (!mail || mail.indexOf('@') < 0) return toast('Укажите корректный email.', 'warn');
    DB.addSupplier([name, mail, g('nsBrands').split(',').map(x => x.trim()).filter(Boolean), +g('nsDays') || 3, 0]);
    DB.log('Добавлен поставщик', name); U.closeOverlay(); re();
    toast(T.supplierAdded + ': ' + name + '.', 'ok');
  });

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
  D('calToday', () => {
    window.__views2.CALSET('this');
    re();
    setTimeout(() => { const el = document.getElementById('cal-this'); if (el) el.scrollIntoView({ block: 'center', behavior: 'smooth' }); }, 80);
    toast('Показана текущая неделя: 21–27 сентября.', 'ok');
  });
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
  D('block', id => U.ACT['userBlock'](id));
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
  /* история версий спецификации: просмотр и откат (человек в контуре) */
  function specVersions(sp) {
    if (!sp.hist) sp.hist = [{ v: 1, at: sp.date, actor: 'Клочко Н.', what: 'Первая версия', positions: sp.positions }];
    return sp.hist;
  }
  D('specVer', id => {
    const s = DB.specs.filter(x => x.id === id)[0]; if (!s) return;
    const h = specVersions(s);
    const rows = h.slice().reverse().map(v =>
      '<div class="row" style="gap:12px;padding:10px 0;border-bottom:1px solid var(--line)">' +
      '<span class="badge ' + (v.v === s.version ? 'b-ok' : 'b-neutral') + '">v' + v.v + (v.v === s.version ? ' · текущая' : '') + '</span>' +
      '<div class="grow"><div class="small" style="font-weight:600">' + esc(v.what) + '</div>' +
      '<div class="tiny muted">' + esc(v.actor) + ' · ' + esc(v.at) + ' · позиций: ' + v.positions + '</div></div>' +
      (v.v !== s.version ? '<button class="btn sm" data-act="specRollback" data-k="' + s.id + '|' + v.v + '">' + icon('rotate', 'ic-sm') + ' Откатить</button>' : '') +
      '</div>').join('');
    mountDlg('dlgSpecVer', 'Версии ' + s.number,
      '<div class="row" style="gap:8px;margin-bottom:10px"><span class="badge b-info">' + esc(s.client) + '</span>' +
      '<span class="badge b-neutral">позиций: ' + s.positions + '</span>' +
      '<span class="badge ' + (s.status === 'sent' ? 'b-ok' : 'b-warn') + '">' + (s.status === 'sent' ? 'Отправлена' : 'Черновик') + '</span></div>' +
      '<div class="col" style="gap:0">' + rows + '</div>' +
      '<div class="field" style="margin-top:14px"><label>Комментарий к новой версии</label><input class="inp" id="spVerNote" placeholder="Например: обновили цену по прайсу от 22.09"></div>' +
      '<div class="fhint">' + icon('shield', 'ic-sm') + ' Новая версия не уходит клиенту автоматически — только после подтверждения менеджера в КП.</div>',
      '<button class="btn" data-act="closeDlg">' + T.close + '</button>' +
      '<button class="btn primary" data-act="specNewVer" data-k="' + s.id + '">' + icon('plus', 'ic-sm') + ' Новая версия</button>');
  });
  D('specNewVer', id => {
    const s = DB.specs.filter(x => x.id === id)[0]; if (!s) return;
    const note = ((document.getElementById('spVerNote') || {}).value || '').trim();
    const h = specVersions(s);
    s.version = s.version + 1;
    h.push({ v: s.version, at: '23.09.2026', actor: 'Клочко Н.', what: note || 'Правки по позициям и ценам', positions: s.positions });
    DB.log('Новая версия спецификации', s.number + ' → v' + s.version);
    U.closeOverlay(); re();
    toast('Создана версия v' + s.version + ' спецификации ' + s.number + '.', 'ok');
  });
  D('specRollback', k => {
    const [id, v] = String(k).split('|');
    const s = DB.specs.filter(x => x.id === id)[0]; if (!s) return;
    const h = specVersions(s);
    const target = h.filter(x => String(x.v) === String(v))[0]; if (!target) return;
    const hh = specVersions(s);
    hh.push({ v: s.version + 1, at: '23.09.2026', actor: 'Клочко Н.', what: 'Откат к v' + v + ' (' + target.what + ')', positions: s.positions });
    s.version = s.version + 1;
    DB.log('Откат спецификации', s.number + ' → откат к v' + v);
    U.closeOverlay(); re();
    toast('Спецификация ' + s.number + ' откатана к v' + v + '; создана новая версия v' + s.version + '.', 'ok');
  });
  D('exportSpecs', () => U.exportXls('Спецификации', ['Номер','Клиент','Дата','Позиций','Версия','Статус'],
    DB.specs.map(s => [s.number, s.client, s.date, s.positions, 'v' + s.version, s.status])));
  D('specOpenNew', () => U.ACT['specNew']());

  /* ---------- аналитика ---------- */
  D('anPeriod', v => { v3.ANPER(v); re(); toast('Период обновлён.', 'ok'); });
  D('anManager', v => { v3.ANMGR(v); re(); toast(v ? 'Фильтр: ' + v : 'Все менеджеры.', 'ok'); });
  D('exportAnalytics', () => U.exportXls('Аналитика', ['Клиент','Запросов','Сумма КП'],
    (function () { const c = {}; DB.requests.forEach(r => { c[r.client.name] = c[r.client.name] || { n: 0, s: 0 }; c[r.client.name].n++; c[r.client.name].s += r.quoteTotalRub || 0; });
      return Object.keys(c).map(k => [k, c[k].n, c[k].s]); })()));
  D('chartOpen', k => {
    const weeks = [4, 7, 5, 9, 6, 11, 8];
    const max = Math.max.apply(null, weeks);
    const R2 = DB.requests;
    const byCat = {};
    R2.forEach(r => (r.positions || []).forEach(pp => { byCat[pp.category] = (byCat[pp.category] || 0) + (pp.totalRub || 0); }));
    const cats = Object.keys(byCat).map(c => ({ c: c, v: byCat[c] })).sort((a, b) => b.v - a.v);
    const maxC = Math.max.apply(null, cats.map(x => x.v).concat([1]));
    mountDlg('dlgChart', T.chartBig + (k ? ': ' + k : ''),
      '<div class="diff"><div class="d-h">Запросы по неделям (шт.)</div><div style="padding:14px">' +
        '<div class="mini-bar" style="height:160px">' + weeks.map((w, i) => '<i style="height:' + Math.round(w / max * 100) + '%" title="Неделя ' + (i + 1) + ': ' + w + '"></i>').join('') + '</div>' +
        '<div class="legend" style="margin-top:8px"><span>' + icon('trending', 'ic-sm') + ' Итого за период: ' + weeks.reduce((a, b) => a + b, 0) + ' запросов</span></div></div></div>' +
      '<div class="diff"><div class="d-h">Сумма КП по категориям</div><div style="padding:12px">' +
        (cats.length ? cats.map(x => '<div style="margin-bottom:8px"><div class="row sp" style="margin-bottom:4px"><span class="small">' + esc(x.c) + '</span><span class="small muted mono">' + U.money(x.v) + '</span></div>' +
          '<div class="prog"><i style="width:' + Math.round(x.v / maxC * 100) + '%"></i></div></div>').join('') : '<span class="small muted">Нет данных за период.</span>') +
      '</div></div>',
      '<button class="btn" data-act="closeDlg">' + T.close + '</button>' +
      '<button class="btn primary" data-act="exportAnalytics">' + icon('download', 'ic-sm') + ' ' + T.exportXls + '</button>');
  });

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
  D('newsImport', () => {
    mountDlg('dlgNewsImp', T.newsFile,
      '<div class="field"><label>Файл с адресами (CSV, XLSX)</label><input class="inp" id="niFile" placeholder="recipients.xlsx" value="recipients.xlsx"></div>' +
      '<div class="field"><label>Колонка с email</label><input class="inp" value="B — E-mail" readonly></div>' +
      '<div class="diff"><div class="d-h">Предпросмотр разбора</div><pre>zakupki@medlab.ru\ninfo@bioclinic.ru\nsupply@labtech.ru\n… всего 340 адресов\nДубликаты: 4 — будут объединены.\nНекорректные: 2 — пропущены.</pre></div>' +
      '<div class="fhint">' + icon('shield', 'ic-sm') + ' Список применится к текущей рассылке только после подтверждения.</div>',
      '<button class="btn" data-act="closeDlg">' + T.cancel + '</button>' +
      '<button class="btn primary" data-act="newsImportApply">' + icon('upload', 'ic-sm') + ' ' + T.applyShort + '</button>');
  });
  D('newsImportApply', () => {
    const q = DB.newsletters.filter(n => n.status === 'queued' || n.status === 'paused')[0];
    const file = ((document.getElementById('niFile') || {}).value || 'recipients.xlsx');
    if (q) { q.total = 336; q.sent = Math.min(q.sent, 336); }
    DB.log('Импорт получателей', file + ': 336 адресов');
    U.closeOverlay(); re();
    toast('Файл «' + file + '» разобран: 336 адресов добавлено в рассылку.', 'ok');
  });
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
  D('forgotPass', () => {
    const em = ((document.getElementById('lgEmail') || {}).value || '').trim();
    if (!em || em.indexOf('@') < 0) return toast('Введите рабочий email — на него придёт ссылка.', 'warn');
    toast('Если адрес ' + em + ' зарегистрирован, ссылка восстановления отправлена.', 'ok');
  });
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
  D('hotConfirm', () => { if (U.isOpen('dlgSend')) U.ACT['confirmSend'](); else toast('Горячая клавиша работает в диалоге подтверждения отправки.', 'info'); });
  D('openVersionHistory', () => toast('История версий КП — в правой колонке вкладки «КП».', 'info'));
  D('help', () => {
    const rows = [
      ['/', 'Фокус в глобальный поиск'],
      ['↑ ↓', 'Навигация по результатам поиска'],
      ['Enter', 'Открыть выбранный результат'],
      ['Esc', 'Закрыть диалог, панель или очистить поле поиска'],
      ['Ctrl/⌘ + Enter', 'Подтвердить основное действие открытого диалога'],
      ['Ctrl/⌘ + B', 'Свернуть или развернуть левое меню'],
      ['Ctrl/⌘ + K', 'Открыть ИИ-помощника']
    ];
    mountDlg('dlgHelp', T.helpTitle,
      '<div class="col" style="gap:8px">' + rows.map(r =>
        '<div class="row" style="gap:12px;border-bottom:1px solid var(--line);padding-bottom:8px">' +
        '<span class="badge b-neutral mono" style="min-width:104px;justify-content:center">' + esc(r[0]) + '</span>' +
        '<span class="small grow">' + esc(r[1]) + '</span></div>').join('') + '</div>' +
      '<div class="fhint" style="margin-top:12px">' + icon('shield', 'ic-sm') + ' Прототип работает на локальных демо-данных. Ничего не отправляется клиентам и поставщикам без подтверждения менеджера.</div>',
      '<button class="btn" data-act="closeDlg">' + T.close + '</button>');
  });

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



  /* ---------- профиль и горячие клавиши ---------- */
  function profSave(patch) {
    let cur = {};
    try { cur = JSON.parse(localStorage.getItem('kp-profile-v1') || '{}'); } catch (e) { cur = {}; }
    Object.assign(cur, patch);
    try { localStorage.setItem('kp-profile-v1', JSON.stringify(cur)); } catch (e) {}
  }
  D('setProfileName', v => { profSave({ name: v }); re(); });
  D('setProfileRole', v => { profSave({ post: v }); re(); });
  D('setProfileMail', v => { profSave({ mail: v }); re(); });
  D('setProfilePhone', v => { profSave({ phone: v }); re(); });
  D('resetProfile', () => {
    try { localStorage.removeItem('kp-profile-v1'); } catch (e) {}
    re(); toast('Реквизиты возвращены к демо-значениям.', 'ok');
  });
  D('mockSet', k => U.setMock(k));
  D('mockRetry', () => {
    U.setMock('loading');
    setTimeout(() => { U.setMock('data'); toast('Данные загружены.', 'ok'); }, 900);
  });
  D('stateMenu', k => U.setMock(k || 'data'));
  D('openProfile', () => U.go('profile'));
  D('hotSide', () => { const f = U.ACT['collapseSide']; if (f) f(); });
  D('hotAi', () => { const f = U.ACT['aiChat']; if (f) f(U.cur() === 'request' ? ((DB.req(location.hash.split('/')[2]) || {}).id || 'top') : 'top'); });

  /* ---------- письмо: редактирование и ИИ-редактор с diff ---------- */
  let AIM = { id: null, mode: 'polite' };
  function aiMailText(r) { return (r.email.work !== undefined && r.email.work !== null) ? r.email.work : r.email.body; }
  function lineDiff(a, b) {
    const A = String(a).split('\n'), B = String(b).split('\n'), out = [];
    for (let i = 0; i < Math.max(A.length, B.length); i++) {
      const x = A[i], y = B[i];
      if (x === undefined) out.push('<ins>' + esc(y) + '</ins>');
      else if (y === undefined) out.push('<del>' + esc(x) + '</del>');
      else if (x === y) out.push(esc(x));
      else { out.push('<del>' + esc(x) + '</del>'); out.push('<ins>' + esc(y) + '</ins>'); }
    }
    return out.join('\n');
  }
  function aiMailDialog() {
    const r = DB.req(AIM.id); if (!r) return '';
    const orig = aiMailText(r);
    const out = U.AI.improve(orig, AIM.mode);
    AIM.out = out;
    const modeNames = { polite: T.aiImprove, short: T.aiShorten, formal: T.aiFormal, translate: T.aiTranslate, extract: T.aiCheckArt };
    return '<div class="ai-bar"><span class="ai-t">' + icon('sparkles', 'ic-sm') + ' ' + T.aiEditMail + '</span>' +
      Object.keys(modeNames).map(m => '<button class="btn sm' + (AIM.mode === m ? ' primary' : '') + '" data-act="aiMailMode" data-k="' + m + '">' + modeNames[m] + '</button>').join('') + '</div>' +
      '<div class="row" style="gap:10px;align-items:flex-start">' +
        '<div class="grow" style="min-width:0"><div class="tiny muted" style="margin-bottom:5px">' + T.mailDraft + ' (до правки)</div>' +
        '<div class="diff"><pre id="aiMailSrc">' + esc(orig) + '</pre></div></div>' +
      '</div>' +
      '<div style="margin-top:12px"><div class="tiny muted" style="margin-bottom:5px">' + T.aiDiff + '</div>' +
      '<div class="diff"><pre>' + lineDiff(orig, out) + '</pre></div></div>' +
      '<div class="fhint" style="margin-top:10px">' + icon('shield', 'ic-sm') + ' ИИ предлагает — менеджер подтверждает. В клиентскую переписку уходит только после «' + T.aiApply + '» и отправки.</div>';
  }
  function openAiMailDialog() { mountDlg('dlgAiMail', T.aiEditMail, aiMailDialog(),
    '<button class="btn" data-act="aiMailCancel">' + T.aiCancel + '</button>' +
    '<button class="btn primary" data-act="aiMailApply">' + icon('check', 'ic-sm') + ' ' + T.aiApply + '</button>'); }
  D('openAiMail', id => { const r = DB.req(id) || curReq(); if (!r) return; AIM = { id: r.id, mode: 'polite' }; openAiMailDialog(); });
  D('aiMailMode', k => { AIM.mode = k || 'polite'; openAiMailDialog(); });
  D('aiMailApply', () => {
    const r = DB.req(AIM.id); if (!r) return;
    r.email.work = AIM.out;
    DB.addActivity(r, 'Клочко Н.', 'Письмо отредактировано ИИ', 'режим: ' + AIM.mode + ', правка подтверждена менеджером');
    DB.log('ИИ-правка письма', '№ 2026-' + r.number); DB.persist();
    U.closeOverlay(); re(); toast(T.aiAppliedToast, 'ok');
  });
  D('aiMailCancel', () => { U.closeOverlay(); re(); toast('Письмо оставлено без изменений.', 'info'); });
  D('mailEdit', id => {
    const r = DB.req(id) || curReq(); if (!r) return;
    AIM = { id: r.id, mode: AIM.mode || 'polite' };
    const t = aiMailText(r);
    mountDlg('dlgMailEdit', 'Редактирование письма — 2026-' + r.number,
      '<div class="ai-bar"><span class="ai-t">' + icon('sparkles', 'ic-sm') + ' ИИ</span>' +
      '<button class="btn sm" data-act="mailEditAi">' + T.aiEditMail + '</button>' +
      '<button class="btn sm" data-act="mailEditOrig">Вернуть оригинал</button></div>' +
      '<div class="field"><label>Текст письма</label><textarea class="inp" id="meBody" style="min-height:300px">' + esc(t) + '</textarea></div>' +
      '<div class="fhint">' + icon('info', 'ic-sm') + ' Правка сохраняется как черновик. Оригинал письма остаётся доступен в «' + T.rawMail + '».</div>',
      '<button class="btn" data-act="closeDlg">' + T.cancel + '</button>' +
      '<button class="btn primary" data-act="mailEditSave" data-k="' + r.id + '">' + icon('check', 'ic-sm') + ' ' + T.mailDraft + '</button>');
  });
  D('mailEditAi', () => {
    const ta = document.getElementById('meBody'); if (ta) AIM.tmp = ta.value;
    if (!AIM.id) AIM.id = (location.hash.split('/')[2] || (DB.requests[0] || {}).id);
    openAiMailDialog0();
  });
  function openAiMailDialog0() {
    const r = DB.req(AIM.id); if (!r) return;
    if (AIM.tmp !== undefined) r.email.work = AIM.tmp;
    openAiMailDialog();
  }
  D('mailEditOrig', () => { const r = DB.req(location.hash.split('/')[2]) || DB.requests[0]; const ta = document.getElementById('meBody'); if (ta && r) ta.value = r.email.body; toast('Показан оригинал письма.', 'info'); });
  D('mailEditSave', id => {
    const r = DB.req(id) || curReq(); if (!r) return;
    const v = ((document.getElementById('meBody') || {}).value || '');
    if (!v.trim()) return toast(T.mailEmpty, 'warn');
    r.email.work = v;
    DB.addActivity(r, 'Клочко Н.', 'Письмо отредактировано вручную');
    DB.log('Правка письма', '№ 2026-' + r.number); DB.persist();
    U.closeOverlay(); re(); toast(T.mailSavedToast, 'ok');
  });
  D('mailDraftSave', id => {
    const r = DB.req(id) || curReq(); if (!r) return;
    if (r.email.work === undefined || r.email.work === null) r.email.work = r.email.body;
    DB.persist(); re(); toast(T.mailSavedToast, 'ok');
  });
  D('mailResetWork', id => {
    const r = DB.req(id) || curReq(); if (!r) return;
    delete r.email.work; DB.persist(); re(); toast('Показан оригинал письма.', 'info');
  });

  /* ---------- hotkeys ---------- */
  document.addEventListener('keydown', function (e) {
    if (e.target.closest('#gSearch')) {
      const items = document.querySelectorAll('#sres [data-act=sresPick]');
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); scur = Math.max(-1, Math.min(items.length - 1, scur + (e.key === 'ArrowDown' ? 1 : -1))); items.forEach((x, i) => x.classList.toggle('on-cursor', i === scur)); return; }
      if (e.key === 'Enter') { const el = items[scur >= 0 ? scur : 0]; if (el) { e.preventDefault(); U.ACT['sresPick'](el.getAttribute('data-k')); } return; }
    }
  }, true);
})();

/* ===== shell.js ===== */
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
