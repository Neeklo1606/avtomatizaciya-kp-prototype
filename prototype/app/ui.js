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
