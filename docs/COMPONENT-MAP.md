# Карта компонентов — «Автоматизация КП»

Стек: React 18, TypeScript, Vite, Tailwind, shadcn/ui, Framer Motion, Node.js, PostgreSQL, VPS.
Стенд — HTML/CSS/JS, классы ниже = источник дизайна; в React каждый элемент становится компонентом.

## 1. Глобальные компоненты

| Компонент | Классы стенда | Назначение | Состояния |
|---|---|---|---|
| `AppShell` | `.app` | каркас: сайдбар + шапка + контент | — |
| `Sidebar` | `.side`, `.side-top`, `.brand-mark`, `.brand-txt`, `.side-sec`, `.nav-i`, `.cnt`, `.side-foot` | навигация по разделам, счётчики, сворачивание 264↔76 px | expanded / collapsed / mobile-drawer |
| `Topbar` | `.top`, `.crumb`, `.ibtn` | хлебные крошки, тема, уведомления, профиль | — |
| `GlobalSearch` | `.search`, `.sres`, `.s-kbd` | поиск по номерам, клиентам, артикулам; `/` — фокус | idle / фокус / результаты / пусто |
| `NotificationsPanel` | `.noti`, `.panel` | панель уведомлений | — |
| `ProfilePanel` | `.prof-i`, `.ava` | профиль, роль, тема | — |
| `Button` | `.btn` (`.primary`, `.dark`, `.danger`, `.ghost`, `.sm`) | действия | default / hover / active / disabled / loading |
| `IconButton` | `.ibtn` | иконочные действия | — |
| `Card` | `.card`, `.card-h`, `.card-b`, `.card.pad` | контейнер контента | — |
| `StatCard` | `.stat` (+ `.ok .warn .info .bad .link`) | метрика с тоном и переходом | — |
| `Badge` | `.badge`, `.b-ok .b-warn .b-info .b-bad .b-neutral` | статус-плашка | 5 тонов |
| `Chip` | `.chip`, `.chip.on`, `.chip.static` | фильтр-переключатель / перечисление | off / on / static |
| `SegmentedControl` | `.seg` | переключатель режимов | — |
| `Pills` | `.pills` | горизонтальный ряд фильтров (моб.) | — |
| `DataTable` | `.tw`, `.toolbar`, `.tscroll`, `table.tbl`, `th.sortable`, `.ar` | Excel-подобная таблица: сортировка, выделение, разворачивание позиций | data / loading (`.sk`) / empty / error / selected |
| `EditableCell` | `.cell-in`, `.cell-sel`, `.badge-sel`, `.save-flag` | инлайн-редактирование с автосохранением | idle / editing / saving / saved |
| `MobileCards` | `.mcards`, `.mcard`, `.mc-top`, `.mc-row` | карточная замена таблицы ≤860 px | — |
| `Kanban` | `.kan`, `.kcol`, `.kcol-b`, `.kcard`, `.kstatus-chips` | воронка с drag-and-drop | drag / over / drop; недопустимый переход → тост |
| `Timeline` | `.timeline`, `.tl-i`, `.tl-d`, `.tl-t` | лента событий запроса | — |
| `FormField` | `.field`, `.inp`, `.sel`, `.radio-i`, `.switch`, `.ferr` | поля ввода, валидация | default / focus / invalid / disabled |
| `Dialog` | `.scrim`, `.dlg`, `.dlg-h`, `.dlg-b`, `.dlg-f` | модальное окно | open / closed |
| `SideSheet` | `.sheet`, `.sheet-btn` | выезжающая панель (фильтры) | — |
| `Toast` | `.toast`, `.toasts` | уведомления (`ok`/`warn`/`bad`/`info`) | 4 тона |
| `Skeleton` | `.sk` | загрузка | — |
| `EmptyState` | `.empty`, `.ei` | пустое состояние | — |
| `ErrorState` | `.err-state` | ошибка + повтор | — |
| `Pagination` | `.pager`, `.pg`, `.pg.on` | постраничный вывод | — |
| `Progress` | `.prog` | прогресс/доли | — |
| `KeyValue` | `.kv` | пары ключ-значение | — |
| `Toolbar` | `.toolbar`, `.gsearch`, `.filters`, `.state-sel` | надстройка над таблицей | — |
| `DiffView` | `.diff`, `.diff del/ins` | сравнение версий КП | — |
| `AiAssistant` | `.ai-bar`, `.ai-msg`, `.ai-log`, `.ai-out`, `.ai-chips` | ИИ-помощник, правка письма | idle / thinking / результат |

## 2. Компоненты по этапам

### Э1 — ядро «запрос → КП»
| Компонент | Где | Назначение |
|---|---|---|
| `RecognitionAlert` | `.card.pad` + `.chips` | низкая уверенность распознавания; клиенты чипами, кнопка «Показать их» |
| `ReviewQueue` | карточка + таблица | очередь запросов на проверку менеджером |
| `WaitingList` | `.card-b > .col > .row` | запросы в ожидании поставщика/клиента |
| `DailyStats` | `.card-b > .grid` | метрики дня плитками-сегментами |
| `EmailViewer` | `.mail`, `.mail-h`, `.mail-body`, `.hit` | письмо, подсветка найденных артикулов |
| `PositionZone` | `.grid` + таблица | позиции: правки, артикул, цена, уверенность |
| `QuotePreview` | `.card` + таблица | предпросмотр КП по XLS-шаблону, версии |
| `SpecFromPO` | таблица | спецификация из PO |
| `ClientsTable` | `tr.rowclick` | клиенты; **вся строка кликабельна** |

### Э2 — поставщики и контроль
| Компонент | Где | Назначение |
|---|---|---|
| `SupplierStats` | `.grid` + `.stat` | запросы, время ответа, доля отказов |
| `SupplierRequests` | таблица | цепочки запросов поставщикам, дни ожидания |
| `Funnel` | `.kan` | воронка статусов с drag-and-drop (11 колонок) |
| `Calendar` | `.grid` | календарь задач и сроков |

### Э3 — документы, аналитика, рассылка
| Компонент | Где | Назначение |
|---|---|---|
| `SpecsMaster` | таблица | мастер спецификаций из PO |
| `Analytics` | `.prog` + графики | метрики, доли, динамика |
| `Newsletter` | формы + предпросмотр | рассылка NEWS |
| `Connections` | карточки | подключения с проверкой статуса |

## 3. Компоненты настроек
`PriceListManager`, `PricingRules` (пошлина 5%), `Templates` (шаблоны КП/писем), `UsersAndRoles`, `AuditLog`.

## 4. Правила реализации

- Один компонент — одна ответственность; всё из раздела 1 переиспользуется на всех экранах.
- Каждый экран и каждый компонент имеет состояния **loading / empty / error**.
- Человек в контуре: **ничего не уходит клиенту или поставщику без подтверждения менеджера**. Все отправки — через диалог подтверждения.
- Роли: гость, менеджер, админ (в прототипе также руководитель). Доступ к разделу проверяется `roleCan(route)`.
- Никакого хардкода цветов — только токены из `DESIGN-TOKENS.md`.
