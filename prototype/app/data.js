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
