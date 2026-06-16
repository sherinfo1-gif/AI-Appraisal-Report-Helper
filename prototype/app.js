const cases = [
  {
    id: "APT-026",
    type: "Квартира",
    icon: "▦",
    title: "Квартира, ул. Шота Руставели, 53",
    customer: "ООО «ORIENT FINANCE»",
    status: "В работе",
    statusClass: "status-progress",
    progress: 64,
    deadline: "16 июня",
    overdue: false,
    value: "1 284 000 000 сум"
  },
  {
    id: "COM-011",
    type: "Имущественный комплекс",
    icon: "▥",
    title: "Имущественный комплекс, ул. Мукимий, 9",
    customer: "ООО «MODERN CITY CONSTRUCT»",
    status: "На проверке",
    statusClass: "status-review",
    progress: 88,
    deadline: "Сегодня",
    overdue: false,
    value: "187 292 000 000 сум"
  },
  {
    id: "APT-024",
    type: "Квартира",
    icon: "▦",
    title: "Квартира, массив Чиланзар, 12",
    customer: "АКБ «ASIA ALLIANCE BANK»",
    status: "Возвращен",
    statusClass: "status-returned",
    progress: 76,
    deadline: "11 июня",
    overdue: true,
    value: "980 000 000 сум"
  },
  {
    id: "LAND-019",
    type: "Участок",
    icon: "◇",
    title: "Земельный участок, Юнусабад",
    customer: "ООО «URBAN DEVELOPMENT»",
    status: "Выпущен",
    statusClass: "status-issued",
    progress: 100,
    deadline: "9 июня",
    overdue: false,
    value: "7 540 000 000 сум"
  }
];

const stages = [
  "Задание и договор", "Документы", "Объект", "Осмотр", "Рынок", "Аналоги",
  "Корректировки", "Результат", "Текст отчета", "Контроль", "Проверка", "Выпуск"
];

const valuationProfiles = {
  real_estate: {
    label: "Недвижимость",
    icon: "⌂",
    description: "Земельные участки, здания, помещения и имущественные комплексы.",
    objects: ["Квартира", "Жилой дом", "Коммерческий объект", "Земельный участок", "Комплекс недвижимости"],
    templates: ["Квартира для залогового обеспечения · версия 3.2", "Коммерческая недвижимость · версия 2.6", "Земельный участок · версия 1.9"],
    workflow: [["Задание и договор", 1], ["Документы", 1], ["Объект и права", 0], ["Осмотр", 0], ["Рынок", 0], ["Подходы", 0], ["Расчеты", 0], ["Согласование", 0], ["Текст отчета", 1], ["Контроль", 1], ["Проверка", 1], ["Выпуск", 1]],
    modules: ["Кадастр и права", "Осмотр и фото", "Аналоги и корректировки", "Доходный подход", "Затратный подход", "Земля"]
  },
  equipment: {
    label: "Оборудование",
    icon: "⚙",
    description: "Машины, технологические линии, комплексы и группы оборудования.",
    objects: ["Отдельная машина", "Производственная линия", "Технологический комплекс", "Группа оборудования", "Специальное оборудование"],
    templates: ["Машины и оборудование · проект", "Производственная линия · проект"],
    workflow: [["Задание и договор", 1], ["Документы", 1], ["Инвентаризация", 0], ["Техническое состояние", 0], ["Комплектность", 0], ["Рынок", 0], ["Износ и устаревание", 0], ["Расчеты", 0], ["Согласование", 0], ["Текст отчета", 1], ["Проверка", 1], ["Выпуск", 1]],
    modules: ["Паспорт и серийные номера", "Физический износ", "Функциональное устаревание", "Экономическое устаревание", "Стоимость замещения", "Рыночные аналоги"]
  },
  vehicles: {
    label: "Автотранспорт",
    icon: "▱",
    description: "Легковые, грузовые и коммерческие автомобили, автобусы, прицепы и автопарки.",
    objects: ["Легковой автомобиль", "Грузовой автомобиль", "Автобус", "Прицеп или полуприцеп", "Автопарк"],
    templates: ["Автотранспорт · проект", "Автопарк · проект"],
    workflow: [["Задание и договор", 1], ["Документы", 1], ["Идентификация", 0], ["Осмотр и повреждения", 0], ["Пробег и комплектация", 0], ["Рынок", 0], ["Аналоги", 0], ["Износ и корректировки", 0], ["Результат", 0], ["Текст отчета", 1], ["Проверка", 1], ["Выпуск", 1]],
    modules: ["Регистрация и VIN", "Пробег", "Комплектация", "История повреждений", "Рыночные аналоги", "Модель износа"]
  },
  special_machinery: {
    label: "Спецтехника",
    icon: "▰",
    description: "Строительные, дорожные, сельскохозяйственные, подъемные и иные самоходные машины.",
    objects: ["Строительная техника", "Дорожная техника", "Сельскохозяйственная техника", "Подъемная техника", "Парк спецтехники"],
    templates: ["Спецтехника · проект", "Парк спецтехники · проект"],
    workflow: [["Задание и договор", 1], ["Документы", 1], ["Идентификация и регистрация", 0], ["Осмотр рабочего оборудования", 0], ["Моточасы и наработка", 0], ["Техническое состояние", 0], ["Рынок и аналоги", 0], ["Износ и устаревание", 0], ["Расчеты", 0], ["Текст отчета", 1], ["Проверка", 1], ["Выпуск", 1]],
    modules: ["Заводской номер и регистрация", "Моточасы и наработка", "Навесное оборудование", "Техническая диагностика", "Стоимость замещения", "Рыночные аналоги"]
  },
  business: {
    label: "Бизнес",
    icon: "▤",
    description: "Компания, доля участия, группа компаний или отдельное направление бизнеса.",
    objects: ["100% компании", "Доля участия", "Действующий бизнес", "Группа компаний", "Бизнес-направление"],
    templates: ["Оценка бизнеса · проект", "Оценка доли участия · проект"],
    workflow: [["Задание и договор", 1], ["Периметр и права", 0], ["Корпоративные документы", 0], ["Финансовая отчетность", 0], ["Нормализация", 0], ["Отрасль и рынок", 0], ["Прогноз", 0], ["Подходы и методы", 0], ["DCF и мультипликаторы", 0], ["Согласование", 0], ["Текст и контроль", 1], ["Выпуск", 1]],
    modules: ["Финансовая отчетность", "Нормализация", "Прогноз денежных потоков", "WACC и DCF", "Рыночные мультипликаторы", "Чистые активы"]
  },
  intangibles: {
    label: "Нематериальные активы",
    icon: "◇",
    description: "Бренды, программное обеспечение, патенты, лицензии и иные права.",
    objects: ["Товарный знак или бренд", "Программное обеспечение", "Патент или технология", "Лицензия", "Клиентские отношения"],
    templates: ["Нематериальный актив · проект", "Бренд и товарный знак · проект"],
    workflow: [["Задание и договор", 1], ["Идентификация актива", 0], ["Права и защита", 0], ["Коммерческое использование", 0], ["Срок полезной жизни", 0], ["Экономические выгоды", 0], ["Подходы и методы", 0], ["Специальный расчет", 0], ["Согласование", 0], ["Текст отчета", 1], ["Проверка", 1], ["Выпуск", 1]],
    modules: ["Relief from Royalty", "MPEEM", "With-and-Without", "Инкрементальный поток", "Затраты на воспроизводство", "Contributory Asset Charges"]
  }
};

const reportSections = [
  {
    id: "assignment",
    number: "1",
    title: "Задание на оценку",
    status: "linked",
    source: "Поля дела · НСО №2",
    text: "Основанием для проведения оценки является договор на оказание оценочных услуг. Цель оценки — определение рыночной стоимости объекта для залогового обеспечения."
  },
  {
    id: "object",
    number: "3",
    title: "Описание объекта",
    status: "linked",
    source: "Кадастр · осмотр · подтвержденные поля",
    text: "Объект оценки представляет собой трехкомнатную квартиру общей площадью 84,60 м², расположенную на пятом этаже девятиэтажного жилого дома."
  },
  {
    id: "approaches",
    number: "5.1",
    title: "Выбор подходов и методов",
    status: "manual",
    source: "Шаблон · методика · решение оценщика",
    text: "Для определения рыночной стоимости применен сравнительный подход. Доходный и затратный подходы не применялись ввиду отсутствия достаточных данных и ограниченной применимости к оцениваемому объекту."
  },
  {
    id: "comparison",
    number: "5.2.1",
    title: "Сравнительный подход",
    status: "calculated",
    source: "Расчет · аналоги · корректировки",
    text: "Для определения рыночной стоимости применен метод сравнения продаж. Отобраны три сопоставимых объекта, а цены предложений приведены к условиям объекта оценки путем последовательного внесения обоснованных корректировок."
  },
  {
    id: "conclusion",
    number: "6",
    title: "Итоговое заключение",
    status: "calculated",
    source: "Итог расчета · округление",
    text: "По результатам проведенных расчетов рыночная стоимость объекта оценки по состоянию на 12 июня 2026 года составляет 1 284 000 000 сум."
  }
];

const appraiserWorkflowMaterials = [
  { icon: "SRC", name: "Cadastral extract", meta: "Uploaded source material - static demo", state: "Ready for review" },
  { icon: "IMG", name: "Inspection photo set", meta: "12 exterior and interior photos - static demo", state: "Linked to object" },
  { icon: "TXT", name: "Draft report text", meta: "Working copy assembled from template sections", state: "Needs findings review" },
  { icon: "REF", name: "Market evidence notes", meta: "Comparable listing notes - no calculations in prototype", state: "Prepared" }
];

const appraiserFindings = [
  {
    id: "F-01",
    severity: "warning",
    title: "Source missing for discount range",
    section: "5.2.1 Sales comparison approach",
    summary: "The helper marks the bargaining discount explanation as incomplete.",
    detail: "The report text mentions a market discount range, but the source reference is not shown in the section notes.",
    source: "Draft report text - market evidence notes"
  },
  {
    id: "F-02",
    severity: "review",
    title: "Object address wording differs across materials",
    section: "3 Object description",
    summary: "The cadastral extract and draft report use slightly different address wording.",
    detail: "The appraiser should confirm the preferred wording before the section is sent for review.",
    source: "Cadastral extract - draft report text"
  },
  {
    id: "F-03",
    severity: "info",
    title: "Report section still needs appraiser decision",
    section: "6 Final conclusion",
    summary: "The conclusion is present as working text and is not marked ready for final review.",
    detail: "This is a static workflow marker showing that final report text remains under appraiser control.",
    source: "Draft report text"
  }
];

let state = {
  view: "dashboard",
  caseId: null,
  stage: 0,
  context: "ai",
  reportSection: "approaches",
  workflowTab: "overview",
  selectedFindingId: "F-01",
  findingDecisions: {},
  calculationMode: "native",
  valuationDirection: "real_estate",
  objectType: "Квартира",
  engagementDocument: "assignment",
  caseMode: "single",
  compositeGroups: [
    { id: 1, direction: "real_estate", objectType: "Комплекс недвижимости" },
    { id: 2, direction: "equipment", objectType: "Группа оборудования" }
  ]
};

const main = document.getElementById("main-content");
const title = document.getElementById("page-title");
const breadcrumb = document.getElementById("breadcrumb");
const modal = document.getElementById("new-case-modal");

function setPage(pageTitle, crumb = "Рабочий кабинет") {
  title.textContent = pageTitle;
  breadcrumb.textContent = crumb;
}

function statCard(icon, number, label) {
  return `<article class="stat-card">
    <div class="stat-icon">${icon}</div>
    <div><strong>${number}</strong><span>${label}</span></div>
  </article>`;
}

function valuationDirectionCards() {
  return Object.entries(valuationProfiles).map(([id, profile], index) => `
    <button class="direction-card ${index === 0 ? "current" : ""}" data-new-profile="${id}">
      <span class="direction-card-icon">${profile.icon}</span>
      <span><strong>${profile.label}</strong><small>${profile.description}</small></span>
      <i>${index === 0 ? "Используется" : "Профиль подготовлен"}</i>
    </button>`).join("");
}

function caseRow(item) {
  return `<div class="case-row" data-open-case="${item.id}">
    <div class="case-title">
      <div class="case-type">${item.icon}</div>
      <div>
        <strong>${item.title}</strong>
        <span>${item.id} · ${item.customer}</span>
      </div>
    </div>
    <div>
      <span class="meta">Готовность ${item.progress}%</span>
      <div class="progress-track"><div class="progress-bar" style="width:${item.progress}%"></div></div>
    </div>
    <div><span class="status-pill ${item.statusClass}">${item.status}</span></div>
    <div class="deadline ${item.overdue ? "overdue" : ""}">${item.deadline}</div>
  </div>`;
}

function renderDashboard() {
  setPage("Главная");
  main.innerHTML = `
    <section class="executive-hero">
      <div class="hero-copy">
        <span class="hero-kicker"><i></i> Рабочая среда оценщика</span>
        <h2>Добрый день, Алексей</h2>
        <p>Все отчеты, замечания и контрольные точки собраны в одном рабочем пространстве.</p>
      </div>
      <div class="hero-overview">
        <div><span>План месяца</span><strong>14 / 18</strong></div>
        <div class="hero-progress"><i style="width:78%"></i></div>
        <small>78% выполнено</small>
      </div>
    </section>
    <section class="panel direction-overview">
      <div class="panel-header">
        <div><span class="eyebrow">Направления оценки</span><h2>Единая платформа, разные рабочие процессы</h2></div>
        <span class="profile-note">Сначала направление, затем тип объекта</span>
      </div>
      <div class="direction-card-grid">${valuationDirectionCards()}</div>
    </section>
    <section class="stats-grid">
      ${statCard("▤", "8", "активных отчетов")}
      ${statCard("◷", "3", "ожидают проверки")}
      ${statCard("!", "2", "требуют внимания")}
      ${statCard("✓", "14", "выпущено в июне")}
    </section>
    <section class="dashboard-grid">
      <div class="panel">
        <div class="panel-header">
          <h2>Мои текущие отчеты</h2>
          <button class="link-button" data-view-link="cases">Все отчеты →</button>
        </div>
        <div class="case-list">${cases.slice(0,3).map(caseRow).join("")}</div>
      </div>
      <div class="panel">
        <div class="panel-header"><h2>Задачи и замечания</h2><span class="status-pill status-review">5</span></div>
        <div class="task-list">
          <div class="task"><div class="task-dot">!</div><div><strong>Уточнить источник корректировки</strong><span>APT-024 · Проверяющий · 2 часа назад</span></div></div>
          <div class="task"><div class="task-dot">2</div><div><strong>Два отчета ожидают проверки</strong><span>Срок проверки — сегодня</span></div></div>
          <div class="task"><div class="task-dot">↻</div><div><strong>Подтвердить данные OCR</strong><span>Кадастровый документ · APT-026</span></div></div>
        </div>
      </div>
    </section>
    <section class="panel" style="margin-top:16px">
      <div class="panel-header"><h2>Недавние выпуски</h2><button class="link-button" data-view-link="archive">Открыть архив →</button></div>
      <div class="case-list">${cases.slice(3).map(caseRow).join("")}</div>
    </section>`;
  bindCommonActions();
}

function renderCases() {
  setPage("Оценочные дела", "Оценка");
  main.innerHTML = `
    <div class="toolbar">
      <div class="filters">
        <button class="filter-chip active">Все 8</button>
        <button class="filter-chip">В работе 4</button>
        <button class="filter-chip">На проверке 3</button>
        <button class="filter-chip">Возвращены 1</button>
      </div>
      <button class="secondary-button">⇩ Экспорт списка</button>
    </div>
    <section class="table-panel">
      <table class="data-table">
        <thead><tr><th>Объект и заказчик</th><th>Тип</th><th>Результат</th><th>Статус</th><th>Срок</th></tr></thead>
        <tbody>${cases.map(item => `<tr data-open-case="${item.id}">
          <td><div class="case-title"><div class="case-type">${item.icon}</div><div><strong>${item.title}</strong><span>${item.id} · ${item.customer}</span></div></div></td>
          <td>${item.type}</td><td><strong>${item.value}</strong></td>
          <td><span class="status-pill ${item.statusClass}">${item.status}</span></td>
          <td class="deadline ${item.overdue ? "overdue" : ""}">${item.deadline}</td>
        </tr>`).join("")}</tbody>
      </table>
    </section>`;
  bindCommonActions();
}

function selectValuationProfile(profileId) {
  const profile = valuationProfiles[profileId] || valuationProfiles.real_estate;
  state.valuationDirection = profileId;
  state.objectType = profile.objects[0];

  document.querySelectorAll("[data-direction]").forEach(button => {
    button.classList.toggle("selected", button.dataset.direction === profileId);
  });

  const grid = document.getElementById("object-type-grid");
  grid.innerHTML = profile.objects.map((name, index) => `
    <button class="object-type ${index === 0 ? "selected" : ""}" data-object-type="${name}">
      <span class="object-icon">${profile.icon}</span>
      <strong>${name}</strong>
      <small>${index === 0 ? "Рекомендуемый стартовый профиль" : "Отдельная схема данных"}</small>
    </button>`).join("");

  document.getElementById("direction-description").textContent = profile.description;
  document.getElementById("template-select").innerHTML = profile.templates.map(name => `<option>${name}</option>`).join("");
  document.getElementById("workflow-preview").innerHTML = `
    <div class="workflow-preview-head"><strong>Маршрут: ${profile.label}</strong><span>${profile.workflow.length} этапов</span></div>
    <div class="workflow-preview-steps">${profile.workflow.map(([name, shared], index) => `<span class="${shared ? "shared" : "specialized"}"><i>${index + 1}</i>${name}</span>`).join("")}</div>`;

  grid.querySelectorAll("[data-object-type]").forEach(button => button.addEventListener("click", () => {
    grid.querySelectorAll("[data-object-type]").forEach(item => item.classList.remove("selected"));
    button.classList.add("selected");
    state.objectType = button.dataset.objectType;
  }));
}

function renderCompositionBuilder() {
  const builder = document.getElementById("composition-builder");
  if (!builder) return;
  builder.classList.toggle("hidden", state.caseMode !== "composite");
  document.getElementById("workflow-preview")?.classList.toggle("hidden", state.caseMode === "composite");

  const list = document.getElementById("composition-list");
  list.innerHTML = state.compositeGroups.map((group, index) => {
    const profile = valuationProfiles[group.direction];
    return `<article class="composition-item">
      <span class="composition-index">${index + 1}</span>
      <span class="composition-icon">${profile.icon}</span>
      <div><strong>${profile.label}</strong><small>${group.objectType} · отдельные данные, расчет и глава</small></div>
      <button class="composition-remove" data-remove-group="${group.id}" aria-label="Удалить группу">×</button>
    </article>`;
  }).join("");

  list.querySelectorAll("[data-remove-group]").forEach(button => button.addEventListener("click", () => {
    state.compositeGroups = state.compositeGroups.filter(group => group.id !== Number(button.dataset.removeGroup));
    renderCompositionBuilder();
  }));
}

function setCaseMode(mode) {
  state.caseMode = mode;
  document.querySelectorAll("[data-case-mode]").forEach(button => {
    button.classList.toggle("active", button.dataset.caseMode === mode);
  });
  document.getElementById("modal-title").textContent = mode === "composite"
    ? "Соберите состав оценочного дела"
    : "Выберите направление оценки";
  renderCompositionBuilder();
}

function openCreateValuation(profileId = "real_estate") {
  modal.classList.remove("hidden");
  selectValuationProfile(profileId);
  setCaseMode(state.caseMode);
}

function renderProfileBlueprint(profileId) {
  const profile = valuationProfiles[profileId] || valuationProfiles.real_estate;
  state.view = "profile";
  state.caseId = null;
  document.querySelectorAll(".nav-item").forEach(el => el.classList.remove("active"));
  setPage("Новая оценка", `Оценка / ${profile.label}`);
  main.innerHTML = `
    <section class="profile-hero">
      <div class="profile-hero-icon">${profile.icon}</div>
      <div><span class="eyebrow">Профиль рабочего процесса</span><h2>${profile.label}</h2><p>${state.objectType} · структура дела загружена из версионного профиля направления.</p></div>
      <button class="secondary-button" data-change-profile>Изменить направление</button>
    </section>
    <section class="profile-layout">
      <div class="panel profile-workflow-panel">
        <div class="panel-header"><div><span class="eyebrow">Переходы по делу</span><h2>Маршрут оценки</h2></div><span class="status-pill status-progress">${profile.workflow.length} этапов</span></div>
        <div class="profile-stage-grid">${profile.workflow.map(([name, shared], index) => `
          <article class="profile-stage ${shared ? "shared" : "specialized"}">
            <span>${String(index + 1).padStart(2, "0")}</span><strong>${name}</strong><small>${shared ? "Общий этап платформы" : `Специализировано: ${profile.label}`}</small>
          </article>`).join("")}
        </div>
      </div>
      <aside class="panel profile-modules">
        <div class="panel-header"><div><span class="eyebrow">Подключаемые блоки</span><h2>Данные и расчеты</h2></div></div>
        ${profile.modules.map(module => `<div class="profile-module"><span>+</span><div><strong>${module}</strong><small>Модуль профиля и привязки к отчету</small></div></div>`).join("")}
        <div class="profile-warning"><strong>Методика не подменяется прототипом</strong><span>Формулы и проверки включаются после загрузки примеров, стандартов и утверждения методологом.</span></div>
      </aside>
    </section>`;
  document.querySelector("[data-change-profile]")?.addEventListener("click", () => openCreateValuation(profileId));
}

function renderCompositeBlueprint() {
  state.view = "profile";
  state.caseId = null;
  document.querySelectorAll(".nav-item").forEach(el => el.classList.remove("active"));
  setPage("Новое составное дело", "Оценка / Составной отчет");
  const groups = state.compositeGroups.length ? state.compositeGroups : [
    { id: 1, direction: state.valuationDirection, objectType: state.objectType }
  ];
  main.innerHTML = `
    <section class="profile-hero composite-hero">
      <div class="profile-hero-icon">▦</div>
      <div><span class="eyebrow">Единое оценочное дело</span><h2>Составной отчет</h2><p>${groups.length} группы объектов · общие ТЗ, договор, заказчик и дата оценки.</p></div>
      <button class="secondary-button" data-change-composition>Изменить состав</button>
    </section>
    <section class="composite-blueprint">
      <div class="panel composite-groups-panel">
        <div class="panel-header"><div><span class="eyebrow">Независимые расчетные контуры</span><h2>Группы объектов</h2></div><span class="status-pill status-progress">${groups.length}</span></div>
        <div class="composite-group-grid">${groups.map((group, index) => {
          const profile = valuationProfiles[group.direction];
          return `<article class="composite-group-card">
            <div class="composite-group-top"><span>${profile.icon}</span><i>Группа ${index + 1}</i></div>
            <h3>${profile.label}</h3><p>${group.objectType}</p>
            <div class="group-route"><span>${profile.workflow.length} этапов</span><span>${profile.modules.length} модулей</span></div>
            <strong>Собственная глава и результат</strong>
          </article>`;
        }).join("")}</div>
      </div>
      <aside class="panel release-strategy">
        <div class="panel-header"><div><span class="eyebrow">Стратегия выпуска</span><h2>Как формировать документы</h2></div></div>
        <label class="release-option selected"><input type="radio" checked name="release-strategy"><span><strong>Один объединенный отчет</strong><small>Общая вводная часть, главы по группам и сводное заключение.</small></span></label>
        <label class="release-option"><input type="radio" name="release-strategy"><span><strong>Отдельные отчеты + общий пакет</strong><small>Самостоятельный отчет по каждой группе и единое сопроводительное заключение.</small></span></label>
        <div class="release-rule"><strong>Рекомендуемый вариант</strong><span>Для имущественного комплекса используем единый отчет, сохраняя независимость расчетов и выводов по каждой группе.</span></div>
      </aside>
    </section>
    <section class="assembly-flow panel">
      <div class="assembly-step"><i>1</i><strong>Общие данные</strong><span>ТЗ, договор, заказчик, цель и даты</span></div>
      <div class="assembly-arrow">→</div>
      <div class="assembly-step"><i>2</i><strong>Группы объектов</strong><span>Свои документы, осмотр и расчеты</span></div>
      <div class="assembly-arrow">→</div>
      <div class="assembly-step"><i>3</i><strong>Сводный результат</strong><span>Итоги групп и контроль двойного учета</span></div>
      <div class="assembly-arrow">→</div>
      <div class="assembly-step"><i>4</i><strong>Единый выпуск</strong><span>DOCX, PDF, XLSX и QR</span></div>
    </section>`;
  document.querySelector("[data-change-composition]")?.addEventListener("click", () => openCreateValuation(state.valuationDirection));
  document.querySelectorAll(".release-option").forEach(option => option.addEventListener("click", () => {
    document.querySelectorAll(".release-option").forEach(item => item.classList.remove("selected"));
    option.classList.add("selected");
  }));
}

function stageAssignment() {
  const isAssignment = state.engagementDocument === "assignment";
  return `
    <div class="engagement-summary">
      <div><span class="eyebrow">Пакет до начала оценки</span><h4>Задание и договор формируются из общих данных</h4><p>Подтвержденные сведения автоматически используются в оценочном деле и соответствующих разделах отчета.</p></div>
      <div class="engagement-progress"><strong>18 / 20</strong><span>обязательных полей</span><i><b style="width:90%"></b></i></div>
    </div>
    <div class="engagement-workspace">
      <aside class="engagement-documents">
        <button class="engagement-document ${isAssignment ? "active" : ""}" data-engagement-document="assignment">
          <span class="file-icon">ТЗ</span><div><strong>Задание на оценку</strong><small>Версия 1.3 · готово к формированию</small></div><i>90%</i>
        </button>
        <button class="engagement-document ${!isAssignment ? "active" : ""}" data-engagement-document="contract">
          <span class="file-icon">DOC</span><div><strong>Договор на оценку</strong><small>Версия 2.1 · требуется цена</small></div><i>85%</i>
        </button>
        <div class="engagement-rule"><strong>Единый источник данных</strong><span>Изменение заказчика, объекта или срока помечает оба документа как требующие обновления.</span></div>
      </aside>
      <section class="engagement-editor">
        <div class="engagement-editor-head">
          <div><span class="eyebrow">${isAssignment ? "Шаблон задания · версия 1.3" : "Шаблон договора · версия 2.1"}</span><h4>${isAssignment ? "Задание на проведение оценки" : "Договор на оказание оценочных услуг"}</h4></div>
          <span class="status-pill ${isAssignment ? "status-progress" : "status-returned"}">${isAssignment ? "Готово" : "2 поля"}</span>
        </div>
        <div class="form-grid compact-form">
          ${field(isAssignment ? "Номер задания" : "Номер договора", isAssignment ? "TZ-APT-026/06" : "DOG-026/06", true)}
          ${field("Дата документа", "12 июня 2026", true)}
          ${field("Заказчик", "ООО «ORIENT FINANCE»", true)}
          ${field("Исполнитель", "CONSULTING & ASSESSMENT SERVICE", true)}
          ${field("Объект оценки", "Квартира, ул. Шота Руставели, 53", true, "wide")}
          ${field("Цель и назначение", "Определение рыночной стоимости для залогового обеспечения", true, "wide")}
          ${isAssignment
            ? `${field("Дата оценки", "12 июня 2026", true)}${field("Вид стоимости", "Рыночная стоимость", true)}${field("Оцениваемые права", "Право собственности", true)}${field("Срок подготовки", "5 рабочих дней", true)}`
            : `${field("Стоимость услуг", "Указать стоимость", true)}${field("Порядок оплаты", "50% аванс / 50% после передачи", true)}${field("Срок оказания услуг", "5 рабочих дней", true)}${field("Формат передачи", "DOCX + PDF", true)}`}
          ${field(isAssignment ? "Специальные допущения" : "Дополнительные условия", isAssignment ? "Отсутствуют" : "Конфиденциальность согласно шаблону договора", false, "wide", true)}
        </div>
        <div class="engagement-preview">
          <div class="preview-paper">
            <span>${isAssignment ? "ЗАДАНИЕ НА ОЦЕНКУ" : "ДОГОВОР НА ОКАЗАНИЕ ОЦЕНОЧНЫХ УСЛУГ"}</span>
            <strong>${isAssignment ? "№ TZ-APT-026/06" : "№ DOG-026/06"}</strong>
            <p>${isAssignment ? "Заказчик поручает определить рыночную стоимость указанного объекта оценки. Состав задания сформирован из подтвержденных данных оценочного дела." : "Исполнитель обязуется оказать услуги по оценке объекта, а Заказчик принять и оплатить услуги на условиях настоящего договора."}</p>
            <div><i></i><i></i><i></i><i></i></div>
          </div>
          <div class="engagement-actions">
            <button class="secondary-button">Предпросмотр</button>
            <button class="secondary-button">История версий</button>
            <button class="primary-button" data-generate-engagement>Сформировать DOCX + PDF</button>
          </div>
        </div>
      </section>
    </div>`;
}

function field(label, value, required = false, extraClass = "", textarea = false) {
  return `<div class="field ${extraClass}"><label class="${required ? "required" : ""}">${label}</label>
    ${textarea ? `<textarea>${value}</textarea>` : `<input value="${value}">`}</div>`;
}

function stageDocuments() {
  return `
    <div class="warning-callout"><strong>Требуется подтверждение</strong><span>OCR распознал 12 полей. Два значения имеют низкую уверенность.</span></div>
    <div class="document-card">
      <div class="file-icon">PDF</div><div><strong>Кадастровый паспорт.pdf</strong><span>18 страниц · загружен сегодня · OCR завершен</span></div>
      <div class="document-actions"><button class="mini-button">Сверить поля</button><button class="mini-button">Открыть</button></div>
    </div>
    <div class="document-card">
      <div class="file-icon">DOC</div><div><strong>Договор на оценку.docx</strong><span>Договор № 026/06 · данные подтверждены</span></div>
      <div class="document-actions"><button class="mini-button">Открыть</button></div>
    </div>
    <div class="upload-zone"><strong>Добавить документы объекта</strong>Перетащите PDF, DOCX, XLSX или изображения</div>`;
}

function stageObject() {
  return `<div class="form-grid">
    ${field("Адрес", "г. Ташкент, Яккасарайский район, ул. Шота Руставели, 53", true, "wide")}
    ${field("Кадастровый номер", "10:05:04:02:01:0088", true)}
    ${field("Назначение", "Жилое помещение", true)}
    ${field("Общая площадь, м²", "84,60", true)}
    ${field("Жилая площадь, м²", "51,20")}
    ${field("Количество комнат", "3", true)}
    ${field("Этаж / этажность", "5 / 9", true)}
    ${field("Год постройки", "2018")}
    ${field("Материал стен", "Монолитный железобетон")}
    ${field("Состояние", "Хорошее", true)}
    ${field("Инженерные коммуникации", "Электричество, газ, вода, отопление", false, "wide")}
  </div>`;
}

function stageInspection() {
  return `
    <div class="success-callout"><strong>Осмотр проведен</strong><span>12 июня 2026, 10:30 · геолокация и 18 фотографий сохранены.</span></div>
    <div class="form-grid">
      ${field("Дата и время", "12 июня 2026, 10:30", true)}
      ${field("Проводил осмотр", "Алексей Салиев", true)}
      ${field("Присутствовал", "Представитель собственника")}
      ${field("Соответствие документам", "Соответствует")}
      ${field("Фактическое состояние", "Хорошее. Косметический ремонт выполнен в 2022 году.", true, "wide", true)}
      ${field("Выявленные ограничения", "Не выявлены", false, "wide", true)}
    </div>
    <div class="upload-zone" style="margin-top:15px"><strong>18 фотографий осмотра</strong>Фасад, подъезд, комнаты, кухня, санузел и вид из окон</div>`;
}

function stageMarket() {
  return `
    <div class="info-callout"><strong>Рыночные источники</strong><span>Для каждого объявления сохраняются URL, дата доступа и локальный снимок страницы.</span></div>
    ${[1,2,3].map((n,i) => `<div class="document-card">
      <div class="file-icon">WEB</div><div><strong>Аналог ${n}: квартира в Яккасарайском районе</strong><span>OLX.uz · доступ 12.06.2026 · снимок сохранен · ${[92,78,88][i]} м²</span></div>
      <div class="document-actions"><button class="mini-button">Проверить данные</button><button class="mini-button">Снимок</button></div>
    </div>`).join("")}
    <div class="upload-zone"><strong>Добавить рыночный источник</strong>Вставьте ссылку или приложите PDF/скриншот объявления</div>`;
}

function comparisonTable(adjustments = false) {
  const rows = adjustments ? [
    ["Цена предложения, сум", "—", "1 480 000 000", "1 260 000 000", "1 390 000 000"],
    ["Торг", "—", '<span class="adjustment">−5%</span>', '<span class="adjustment">−5%</span>', '<span class="adjustment">−5%</span>'],
    ["Местоположение", "Ш. Руставели", '<span class="adjustment">0%</span>', '<span class="adjustment">+3%</span>', '<span class="adjustment">−2%</span>'],
    ["Площадь", "84,6 м²", '<span class="adjustment">+2%</span>', '<span class="adjustment">−1%</span>', '<span class="adjustment">0%</span>'],
    ["Состояние", "Хорошее", '<span class="adjustment">−3%</span>', '<span class="adjustment">0%</span>', '<span class="adjustment">−2%</span>'],
    ["Скорректированная цена", "—", '<strong>1 388 268 000</strong>', '<strong>1 221 444 000</strong>', '<strong>1 267 756 000</strong>']
  ] : [
    ["Источник", "—", "OLX.uz", "OLX.uz", "Uybor.uz"],
    ["Цена предложения", "—", "1,48 млрд", "1,26 млрд", "1,39 млрд"],
    ["Общая площадь", "84,6 м²", "92 м²", "78 м²", "88 м²"],
    ["Комнаты", "3", "3", "3", "3"],
    ["Этаж / этажность", "5 / 9", "4 / 9", "6 / 9", "5 / 9"],
    ["Состояние", "Хорошее", "Отличное", "Хорошее", "Отличное"],
    ["Расстояние", "—", "0,7 км", "1,2 км", "0,5 км"]
  ];
  return `<div class="comparison-wrap"><table class="comparison-table">
    <thead><tr><th>Параметр</th><th>Объект оценки</th><th>Аналог 1</th><th>Аналог 2</th><th>Аналог 3</th></tr></thead>
    <tbody>${rows.map(row => `<tr>${row.map((v,i) => `<td class="${i > 1 ? "input-value" : ""}">${v}</td>`).join("")}</tr>`).join("")}</tbody>
  </table></div>`;
}

function stageComparables() {
  return `<div class="success-callout"><strong>3 аналога выбраны</strong><span>Минимальное требование методики выполнено. Все источники имеют сохраненные снимки.</span></div>${comparisonTable(false)}`;
}

function stageAdjustments() {
  return `<div class="warning-callout"><strong>Профессиональное суждение</strong><span>Каждая ручная корректировка требует обоснования и ссылки на методику или исследование.</span></div>
    ${comparisonTable(true)}
    <div class="form-grid" style="margin-top:15px">
      ${field("Обоснование корректировки на торг", "Применена скидка 5% на основании анализа разницы цен предложения и сделок.", true, "wide", true)}
    </div>`;
}

function stageResult() {
  return `<div class="result-hero">
    <div class="value-card"><span>Рыночная стоимость квартиры</span><strong>1 284 000 000 сум</strong><span>Округлено до 1 000 000 сум · 12.06.2026</span></div>
    <div class="metric-grid">
      <div class="metric"><span>Стоимость 1 м²</span><strong>15 177 305 сум</strong></div>
      <div class="metric"><span>Диапазон аналогов</span><strong>1,22–1,39 млрд</strong></div>
      <div class="metric"><span>Курс ЦБ</span><strong>12 684,00</strong></div>
      <div class="metric"><span>Уверенность данных</span><strong>Высокая</strong></div>
    </div>
  </div>
  <div class="info-callout" style="margin-top:15px"><strong>Проверка AI</strong><span>Итог находится внутри скорректированного диапазона. Необычных отклонений не обнаружено.</span></div>
  <div class="calculation-workspace">
    <div class="calculation-head">
      <div><span class="eyebrow">Расчетный модуль</span><h4>Способ работы с расчетом</h4></div>
      <button class="secondary-button">⇩ Выгрузить XLSX</button>
    </div>
    <div class="calculation-modes">
      <button class="calculation-mode ${state.calculationMode === "native" ? "active" : ""}" data-calc-mode="native">
        <span class="mode-icon">▦</span><strong>Таблица в системе</strong><small>Контролируемые формулы, история изменений и автоматическая интеграция в отчет.</small>
      </button>
      <button class="calculation-mode ${state.calculationMode === "xlsx" ? "active" : ""}" data-calc-mode="xlsx">
        <span class="mode-icon">X</span><strong>Связанный Excel</strong><small>Работа с версионным XLSX через ONLYOFFICE и именованные диапазоны.</small>
      </button>
    </div>
    <div class="calculation-note"><strong>Рекомендуемая модель:</strong> типовые расчеты выполняются в системе, сложные и индивидуальные модели — в связанном XLSX. Оба варианта выгружаются в Excel и фиксируются в выпуске.</div>
  </div>`;
}

function stageReport() {
  const active = reportSections.find(section => section.id === state.reportSection) || reportSections[0];
  return `
    <div class="report-composer">
      <aside class="report-outline">
        <div class="outline-head"><span>Структура шаблона</span><strong>Квартира · версия 3.2</strong></div>
        ${reportSections.map(section => `<button class="outline-item ${section.id === active.id ? "active" : ""}" data-report-section="${section.id}">
          <span>${section.number}</span><div><strong>${section.title}</strong><small>${section.source}</small></div><i class="section-state ${section.status}"></i>
        </button>`).join("")}
      </aside>
      <div class="section-editor">
        <div class="editor-head">
          <div><span class="eyebrow">Раздел ${active.number}</span><h4>${active.title}</h4></div>
          <div class="editor-actions"><button class="mini-button">История</button><button class="mini-button">Вставить данные</button></div>
        </div>
        <div class="editor-toolbar">
          <button><strong>B</strong></button><button><i>I</i></button><button>≡</button><button>• Список</button>
          <span></span><button>Вставить поле</button><button>Вставить таблицу расчета</button>
        </div>
        <div class="integration-strip">
          <span class="integration-badge ${active.status}">${active.status === "manual" ? "Ручной текст" : active.status === "calculated" ? "Связан с расчетом" : "Связан с данными"}</span>
          <span>${active.source}</span>
        </div>
        <textarea class="report-textarea">${active.text}</textarea>
        <div class="editor-footer">
          <span>Изменения сохраняются как новая версия раздела</span>
          <div><button class="secondary-button">Вернуть текст шаблона</button><button class="primary-button">Сохранить раздел</button></div>
        </div>
      </div>
    </div>`;
}

function stageCompliance() {
  return `<div class="check-list">
    ${check("ok", "Задание на оценку заполнено", "НСО №2 · все обязательные поля присутствуют", "Пройдено")}
    ${check("ok", "Объект однозначно идентифицирован", "Кадастровый номер, адрес, права и характеристики подтверждены", "Пройдено")}
    ${check("ok", "Осмотр и фотографии приложены", "Дата оценки совпадает с датой осмотра", "Пройдено")}
    ${check("ok", "Использовано не менее трех аналогов", "Приложение №5, пункт 21", "Пройдено")}
    ${check("warning", "Обоснование одной корректировки краткое", "Рекомендуется добавить источник диапазона скидки на торг", "Замечание")}
    ${check("error", "Не приложена копия страхового полиса", "НСО №4, пункт 59 · блокирует выпуск", "Ошибка")}
  </div>`;
}

function check(type, name, description, status) {
  const icon = type === "ok" ? "✓" : type === "warning" ? "!" : "×";
  return `<div class="check-row"><div class="check-icon check-${type}">${icon}</div><div><strong>${name}</strong><span>${description}</span></div><span class="status-pill ${type === "ok" ? "status-issued" : type === "warning" ? "status-review" : "status-returned"}">${status}</span></div>`;
}

function stageReview() {
  return `
    <div class="warning-callout"><strong>1 замечание открыто</strong><span>После исправления этап можно повторно отправить на проверку.</span></div>
    <div class="document-card">
      <div class="avatar">МК</div><div><strong>Добавьте источник корректировки на торг</strong><span>Малика Каримова · Корректировки · сегодня, 11:24</span></div>
      <div class="document-actions"><button class="mini-button">Перейти</button><button class="mini-button">Ответить</button></div>
    </div>
    <div class="document-card">
      <div class="check-icon check-ok">✓</div><div><strong>Данные объекта проверены</strong><span>Раздел утвержден проверяющим</span></div>
    </div>`;
}

function stageIssue() {
  return `
    <div class="danger-callout"><strong>Выпуск пока заблокирован</strong><span>Устраните обязательную ошибку: приложите страховой полис.</span></div>
    <div class="release-package">
      <div class="document-card"><div class="file-icon">DOCX</div><div><strong>Отчет APT-026_черновик.docx</strong><span>Структура и стили шаблона 3.2 · 38 страниц</span></div><div class="document-actions"><button class="mini-button">Скачать</button></div></div>
      <div class="document-card"><div class="file-icon">PDF</div><div><strong>Отчет APT-026_черновик.pdf</strong><span>QR-код проверки встроен · готов к подписанию</span></div><div class="document-actions"><button class="mini-button">Открыть</button></div></div>
      <div class="document-card"><div class="file-icon">XLSX</div><div><strong>Расчет APT-026.xlsx</strong><span>Формулы, исходные данные и версия расчета зафиксированы</span></div><div class="document-actions"><button class="mini-button">Скачать</button></div></div>
    </div>
    <div class="release-security">
      <div class="qr-preview" aria-label="Макет QR-кода"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
      <div><span class="eyebrow">Проверка подлинности</span><h4>QR-код ведет на карточку выпуска</h4><p>Карточка показывает номер отчета, дату, хеши файлов и статус электронной подписи без раскрытия конфиденциальных данных.</p></div>
      <div class="signature-state"><span>ЭЦП</span><strong>Подключение после пилота</strong><small>Провайдер подписи будет выбран отдельно</small></div>
    </div>
    <div class="form-grid" style="margin-top:15px">
      ${field("Номер выпуска", "1", true)}
      ${field("Дата выпуска", "12 июня 2026", true)}
      ${field("Комментарий к выпуску", "Первичный отчет", false, "wide")}
    </div>`;
}

function complexContent() {
  return `
    <div class="info-callout"><strong>Составной имущественный комплекс</strong><span>Одно дело содержит недвижимость, оборудование, автотранспорт и спецтехнику. Каждая группа рассчитывается независимо, затем результаты входят в единое заключение.</span></div>
    <div class="report-strategy-bar">
      <div><span class="eyebrow">Текущая стратегия выпуска</span><strong>Один объединенный отчет</strong><small>Общие разделы + четыре самостоятельные главы + сводная стоимость</small></div>
      <button class="secondary-button">Настроить состав</button>
    </div>
    <div class="component-grid">
      <div class="component-card"><strong>Недвижимость</strong><span>Земля, здания и сооружения</span><span class="component-value">11 объектов · 146,2 млрд</span></div>
      <div class="component-card"><strong>Оборудование</strong><span>Технологическая линия и вспомогательные машины</span><span class="component-value">28 позиций · 32,8 млрд</span></div>
      <div class="component-card"><strong>Автотранспорт</strong><span>Грузовые и служебные автомобили</span><span class="component-value">7 единиц · 4,1 млрд</span></div>
      <div class="component-card"><strong>Спецтехника</strong><span>Погрузчики и строительные машины</span><span class="component-value">5 единиц · 4,2 млрд</span></div>
    </div>
    <div class="consolidated-total"><span>Сводная рыночная стоимость комплекса</span><strong>187,3 млрд сум</strong><small>После контроля состава, исключения дублирования и учета взаимосвязанных компонентов</small></div>
    <div class="module-grid">
      ${moduleCard("Сравнительный подход", "3 аналога", "168,42 млрд сум")}
      ${moduleCard("Доходный подход", "Аренда и капитализация", "193,45 млрд сум")}
      ${moduleCard("Затратный подход", "Земля, здания и износ", "199,64 млрд сум")}
      ${moduleCard("Земля", "3 земельных аналога", "176,26 млрд сум")}
      ${moduleCard("Износ", "10 ведомостей", "Рассчитан")}
      ${moduleCard("Согласование", "34% / 33% / 33%", "187,29 млрд сум")}
    </div>
    <div class="onlyoffice">
      <div class="onlyoffice-head"><span>расчет-Мукимий Асакабанк 11.25.xlsx · ONLYOFFICE</span><span>Сохранено 12:14</span></div>
      <div class="sheet-grid">
        <div class="sheet-head"></div><div class="sheet-head">Показатель</div><div class="sheet-head">Объект</div><div class="sheet-head">Аналог 1</div><div class="sheet-head">Аналог 2</div><div class="sheet-head">Аналог 3</div>
        <div class="sheet-head">7</div><div>Источник</div><div>—</div><div class="sheet-input">OLX.uz</div><div class="sheet-input">OLX.uz</div><div class="sheet-input">OLX.uz</div>
        <div class="sheet-head">8</div><div>Цена предложения, USD</div><div>—</div><div class="sheet-input">17 400 000</div><div class="sheet-input">10 000 000</div><div class="sheet-input">7 500 000</div>
        <div class="sheet-head">10</div><div>Цена предложения, сум</div><div>—</div><div class="sheet-formula">207 768 180 000</div><div class="sheet-formula">119 407 000 000</div><div class="sheet-formula">89 555 250 000</div>
      </div>
    </div>`;
}

function moduleCard(name, meta, value) {
  return `<div class="module-card"><strong>${name}</strong><span>${meta}</span><em>${value}</em></div>`;
}

function stageContent(item) {
  if (item.id === "COM-011") return complexContent();
  return [
    stageAssignment, stageDocuments, stageObject, stageInspection, stageMarket,
    stageComparables, stageAdjustments, stageResult, stageReport,
    stageCompliance, stageReview, stageIssue
  ][state.stage]();
}

function contextPanel() {
  const ai = `<div class="ai-panel">
    <div class="ai-intro"><div class="ai-orb">AI</div><div><strong>Контекстный помощник</strong><span>Видит только текущий этап и подтвержденные данные</span></div></div>
    <div class="ai-card"><h4>Предложение для раздела</h4><p>Описание объекта согласовано с кадастровыми данными и результатами осмотра. Расхождений по площади и назначению не выявлено.</p><span class="source-tag">Кадастровый паспорт · Осмотр 12.06.2026</span><div class="ai-actions"><button class="mini-button">Принять</button><button class="mini-button">Изменить</button><button class="mini-button">Отклонить</button></div></div>
    <div class="ai-card"><h4>Проверка данных</h4><p>Одно замечание: в обосновании скидки на торг не указан источник диапазона.</p><span class="source-tag">ЕНСО · Приложение №5</span></div>
  </div>`;
  const preview = `<div class="a4-wrap"><article class="a4-page">
    <h4>ОТЧЕТ ОБ ОЦЕНКЕ<br>РЫНОЧНОЙ СТОИМОСТИ КВАРТИРЫ</h4>
    <p><b>Объект оценки:</b> квартира общей площадью 84,60 м².</p>
    <p><b>Адрес:</b> г. Ташкент, Яккасарайский район, ул. Шота Руставели, 53.</p>
    <h5>5.2.1 Сравнительный подход</h5>
    <p>Для определения рыночной стоимости объекта применен метод сравнения продаж. Были отобраны три сопоставимых объекта-аналога.</p>
    <table class="a4-table"><tr><td>Показатель</td><td>Аналог 1</td><td>Аналог 2</td><td>Аналог 3</td></tr><tr><td>Площадь</td><td>92</td><td>78</td><td>88</td></tr><tr><td>Скорректированная цена</td><td>1 388</td><td>1 221</td><td>1 268</td></tr></table>
    <h5>Итоговая стоимость</h5><p><b>1 284 000 000 (один миллиард двести восемьдесят четыре миллиона) сум.</b></p>
  </article></div>`;
  return `<aside class="context-panel">
    <div class="context-tabs"><button class="context-tab ${state.context === "ai" ? "active" : ""}" data-context="ai">AI-помощник</button><button class="context-tab ${state.context === "preview" ? "active" : ""}" data-context="preview">Предпросмотр</button></div>
    <div class="context-content">${state.context === "ai" ? ai : preview}</div>
  </aside>`;
}

function workflowDecisionLabel(decision) {
  if (decision === "corrected") return "Corrected";
  if (decision === "disagree") return "Disagree";
  if (decision === "escalate") return "Escalated to director";
  return "Open";
}

function workflowDecisionClass(decision) {
  if (decision === "corrected") return "status-issued";
  if (decision === "disagree") return "status-returned";
  if (decision === "escalate") return "status-review";
  return "status-progress";
}

function workflowStatusSummary() {
  const decisions = appraiserFindings.map(finding => state.findingDecisions[finding.id]);
  const corrected = decisions.filter(decision => decision === "corrected").length;
  const disagree = decisions.filter(decision => decision === "disagree").length;
  const escalated = decisions.filter(decision => decision === "escalate").length;
  const open = appraiserFindings.length - decisions.filter(Boolean).length;
  const ready = open === 0 && escalated === 0;

  return {
    corrected,
    disagree,
    escalated,
    open,
    ready,
    label: ready ? "Ready for review" : escalated ? "Director attention" : "Appraiser review",
    className: ready ? "status-issued" : escalated ? "status-review" : "status-progress"
  };
}

function workflowTabs() {
  const tabs = [
    ["overview", "Overview"],
    ["materials", "Materials"],
    ["report", "Report sections"],
    ["findings", "Helper findings"],
    ["status", "Status summary"]
  ];
  return `<div class="workflow-tabs">${tabs.map(([id, label]) => `
    <button class="workflow-tab ${state.workflowTab === id ? "active" : ""}" data-workflow-tab="${id}">${label}</button>
  `).join("")}</div>`;
}

function workflowOverview(item) {
  return `
    <div class="workflow-card-grid">
      <article class="workflow-card"><span>Case</span><strong>${item.id}</strong><small>${item.customer}</small></article>
      <article class="workflow-card"><span>Object</span><strong>Apartment valuation</strong><small>Static prototype case workspace</small></article>
      <article class="workflow-card"><span>Current role</span><strong>Appraiser</strong><small>Decisions are local demo state only</small></article>
      <article class="workflow-card"><span>Deadline</span><strong>${item.deadline}</strong><small>${item.status}</small></article>
    </div>
    <div class="info-callout"><strong>Initial appraiser path</strong><span>Open a case, review source materials, inspect the report outline, resolve helper findings, then check the case status summary.</span></div>
    <div class="workflow-lane">
      ${["Dashboard", "Case overview", "Materials", "Report structure", "Findings", "Decision", "Status"].map((step, index) => `
        <div class="workflow-step ${index < 2 ? "done" : ""}"><i>${index + 1}</i><strong>${step}</strong></div>
      `).join("")}
    </div>`;
}

function workflowMaterials() {
  return `
    <div class="workflow-card-grid materials">
      ${appraiserWorkflowMaterials.map(material => `
        <article class="workflow-card material-card">
          <div class="file-icon">${material.icon}</div>
          <div><span>${material.state}</span><strong>${material.name}</strong><small>${material.meta}</small></div>
        </article>
      `).join("")}
    </div>
    <div class="warning-callout"><strong>Static materials only</strong><span>These cards are demo artifacts inside the clickable prototype. They do not upload, parse, generate, or persist files.</span></div>`;
}

function workflowReportSections() {
  return `
    <div class="workflow-outline">
      ${reportSections.map(section => `
        <article class="workflow-outline-row">
          <span>${section.number}</span>
          <div><strong>${section.title}</strong><small>${section.source}</small></div>
          <i class="section-state ${section.status}"></i>
        </article>
      `).join("")}
    </div>`;
}

function workflowFindings() {
  const active = appraiserFindings.find(finding => finding.id === state.selectedFindingId) || appraiserFindings[0];
  const decision = state.findingDecisions[active.id];

  return `
    <div class="workflow-findings-layout">
      <div class="workflow-findings-list">
        ${appraiserFindings.map(finding => {
          const findingDecision = state.findingDecisions[finding.id];
          return `<button class="finding-row ${finding.id === active.id ? "active" : ""}" data-finding-id="${finding.id}">
            <span class="finding-severity ${finding.severity}"></span>
            <div><strong>${finding.title}</strong><small>${finding.section}</small><em>${finding.summary}</em></div>
            <i class="status-pill ${workflowDecisionClass(findingDecision)}">${workflowDecisionLabel(findingDecision)}</i>
          </button>`;
        }).join("")}
      </div>
      <article class="finding-detail">
        <span class="eyebrow">${active.id} · ${active.section}</span>
        <h3>${active.title}</h3>
        <p>${active.detail}</p>
        <div class="source-tag">${active.source}</div>
        <div class="decision-actions">
          ${[
            ["corrected", "Corrected"],
            ["disagree", "Disagree"],
            ["escalate", "Escalate to director"]
          ].map(([id, label]) => `<button class="${decision === id ? "primary-button" : "secondary-button"}" data-finding-action="${id}">${label}</button>`).join("")}
        </div>
      </article>
    </div>`;
}

function workflowStatus() {
  const summary = workflowStatusSummary();
  return `
    <div class="workflow-card-grid">
      <article class="workflow-card"><span>Open findings</span><strong>${summary.open}</strong><small>Need appraiser action</small></article>
      <article class="workflow-card"><span>Corrected</span><strong>${summary.corrected}</strong><small>Marked ready by appraiser</small></article>
      <article class="workflow-card"><span>Disagree</span><strong>${summary.disagree}</strong><small>Appraiser rejected helper note</small></article>
      <article class="workflow-card"><span>Director</span><strong>${summary.escalated}</strong><small>Escalated for attention</small></article>
    </div>
    <div class="${summary.ready ? "success-callout" : summary.escalated ? "warning-callout" : "info-callout"}">
      <strong>${summary.label}</strong><span>${summary.ready ? "All helper findings have an appraiser decision." : "The case remains in the appraiser workflow until findings are resolved or escalated."}</span>
    </div>
    <div class="check-list">
      ${appraiserFindings.map(finding => check(
        state.findingDecisions[finding.id] ? "ok" : "warning",
        finding.title,
        finding.section,
        workflowDecisionLabel(state.findingDecisions[finding.id])
      )).join("")}
    </div>`;
}

function workflowContent(item) {
  if (state.workflowTab === "materials") return workflowMaterials();
  if (state.workflowTab === "report") return workflowReportSections();
  if (state.workflowTab === "findings") return workflowFindings();
  if (state.workflowTab === "status") return workflowStatus();
  return workflowOverview(item);
}

function workflowStatusPanel() {
  const summary = workflowStatusSummary();
  return `<aside class="context-panel workflow-summary-panel">
    <div class="panel-header"><div><span class="eyebrow">Case status</span><h2>${summary.label}</h2></div><span class="status-pill ${summary.className}">${summary.open} open</span></div>
    <div class="workflow-summary-list">
      <div><span>Materials</span><strong>4 ready</strong></div>
      <div><span>Report sections</span><strong>${reportSections.length} mapped</strong></div>
      <div><span>Helper findings</span><strong>${appraiserFindings.length} total</strong></div>
      <div><span>Escalations</span><strong>${summary.escalated}</strong></div>
    </div>
    <button class="primary-button" data-workflow-tab="status">Open status summary</button>
  </aside>`;
}

function renderAppraiserWorkflow(id = "APT-026") {
  const item = cases.find(c => c.id === id) || cases[0];
  state.view = "appraiser-workflow";
  state.caseId = item.id;
  document.querySelectorAll(".nav-item").forEach(el => el.classList.remove("active"));
  setPage("Appraiser workflow", `Cases / ${item.id}`);
  main.innerHTML = `
    <div class="case-head">
      <div><span class="eyebrow">${item.customer}</span><h2>${item.title}</h2><p>First appraiser workflow · static clickable prototype</p></div>
      <div class="case-head-actions"><span class="status-pill ${item.statusClass}">${item.status}</span><button class="secondary-button" data-back-to-cases>Case list</button></div>
    </div>
    ${workflowTabs()}
    <div class="case-layout appraiser-workflow-layout">
      <section class="case-main">
        <div class="section-header"><div><h3>${state.workflowTab === "overview" ? "Case overview" : state.workflowTab === "materials" ? "Materials overview" : state.workflowTab === "report" ? "Report section structure" : state.workflowTab === "findings" ? "Helper findings" : "Case status summary"}</h3><p>Prototype-only appraiser walkthrough for an active valuation case</p></div></div>
        <div class="section-body">${workflowContent(item)}</div>
      </section>
      ${workflowStatusPanel()}
    </div>`;
  bindAppraiserWorkflowActions();
}

function renderCase(id) {
  const item = cases.find(c => c.id === id) || cases[0];
  state.caseId = item.id;
  setPage(item.id, `Отчеты / ${item.type}`);
  const isComplex = item.id === "COM-011";
  main.innerHTML = `
    <div class="case-head">
      <div><span class="eyebrow">${item.customer}</span><h2>${item.title}</h2><p>${isComplex ? "Недвижимость · оборудование · автотранспорт · спецтехника" : "Квартира · сравнительный подход"} · оценка на 12.06.2026</p></div>
      <div class="case-head-actions"><span class="status-pill ${item.statusClass}">${item.status}</span><button class="secondary-button">История</button><button class="primary-button">${isComplex ? "Открыть расчет" : "На проверку →"}</button></div>
    </div>
    <div class="stage-strip">${stages.map((stage,i) => `<button class="stage-button ${i === state.stage ? "active" : ""} ${i < state.stage ? "done" : ""}" data-stage="${i}">${i+1}. ${stage}</button>`).join("")}</div>
    <div class="case-layout">
      <section class="case-main">
        <div class="section-header"><div><h3>${isComplex ? "Состав объекта и расчетные модули" : stages[state.stage]}</h3><p>${isComplex ? "Независимые группы, главы и сводный результат" : `Этап ${state.stage + 1} из ${stages.length}`}</p></div><span class="completion">${isComplex ? "4 группы · 51 объект" : Math.min(100, 70 + state.stage * 2) + "% заполнено"}</span></div>
        <div class="section-body">${stageContent(item)}</div>
        <div class="section-footer"><span class="save-state">✓ Изменения сохранены</span><div class="footer-actions"><button class="secondary-button" data-prev-stage ${state.stage === 0 ? "disabled" : ""}>← Назад</button><button class="primary-button" data-next-stage>${state.stage === stages.length - 1 ? "Завершить" : "Сохранить и продолжить →"}</button></div></div>
      </section>
      ${contextPanel()}
    </div>`;
  bindCaseActions();
}

function renderPlaceholder(view) {
  const labels = {
    archive: ["Архив", "□", "Поиск выпущенных отчетов, расчетов и исходных документов с неизменяемой историей версий."],
    templates: ["Шаблоны отчетов", "▧", "Версии DOCX-шаблонов, плейсхолдеры, таблицы и правила публикации."],
    methodology: ["Методика", "◫", "ЕНСО, внутренние правила, формулы, коэффициенты и ответы AI со ссылками на источники."],
    references: ["Справочники", "⌘", "Курсы валют, районы, типы объектов, конструктивные элементы и нормативные показатели."],
    settings: ["Настройки", "⚙", "Организация, пользователи, роли, интеграции, хранилище и резервное копирование."]
  };
  const [name, icon, description] = labels[view];
  setPage(name);
  main.innerHTML = `<section class="panel placeholder-panel"><div class="placeholder-icon">${icon}</div><h2>${name}</h2><p>${description}</p></section>`;
}

function navigate(view) {
  state.view = view;
  state.caseId = null;
  document.querySelectorAll(".nav-item").forEach(el => el.classList.toggle("active", el.dataset.view === view));
  if (view === "dashboard") renderDashboard();
  else if (view === "cases") renderCases();
  else renderPlaceholder(view);
}

function bindCommonActions() {
  document.querySelectorAll("[data-open-case]").forEach(el => el.addEventListener("click", () => {
    if (el.dataset.openCase === "APT-026") {
      state.workflowTab = "overview";
      renderAppraiserWorkflow(el.dataset.openCase);
      return;
    }
    state.stage = el.dataset.openCase === "COM-011" ? 7 : 0;
    renderCase(el.dataset.openCase);
  }));
  document.querySelectorAll("[data-view-link]").forEach(el => el.addEventListener("click", () => navigate(el.dataset.viewLink)));
  document.querySelectorAll("[data-new-profile]").forEach(el => el.addEventListener("click", () => openCreateValuation(el.dataset.newProfile)));
}

function bindAppraiserWorkflowActions() {
  document.querySelectorAll("[data-workflow-tab]").forEach(el => el.addEventListener("click", () => {
    state.workflowTab = el.dataset.workflowTab;
    renderAppraiserWorkflow(state.caseId);
  }));
  document.querySelectorAll("[data-finding-id]").forEach(el => el.addEventListener("click", () => {
    state.selectedFindingId = el.dataset.findingId;
    state.workflowTab = "findings";
    renderAppraiserWorkflow(state.caseId);
  }));
  document.querySelectorAll("[data-finding-action]").forEach(el => el.addEventListener("click", () => {
    state.findingDecisions[state.selectedFindingId] = el.dataset.findingAction;
    state.workflowTab = "status";
    renderAppraiserWorkflow(state.caseId);
  }));
  document.querySelector("[data-back-to-cases]")?.addEventListener("click", () => navigate("cases"));
}

function bindCaseActions() {
  document.querySelectorAll("[data-stage]").forEach(el => el.addEventListener("click", () => {
    state.stage = Number(el.dataset.stage);
    renderCase(state.caseId);
  }));
  document.querySelector("[data-prev-stage]")?.addEventListener("click", () => {
    if (state.stage > 0) state.stage--;
    renderCase(state.caseId);
  });
  document.querySelector("[data-next-stage]")?.addEventListener("click", () => {
    if (state.stage < stages.length - 1) state.stage++;
    renderCase(state.caseId);
  });
  document.querySelectorAll("[data-context]").forEach(el => el.addEventListener("click", () => {
    state.context = el.dataset.context;
    renderCase(state.caseId);
  }));
  document.querySelectorAll("[data-report-section]").forEach(el => el.addEventListener("click", () => {
    state.reportSection = el.dataset.reportSection;
    renderCase(state.caseId);
  }));
  document.querySelectorAll("[data-calc-mode]").forEach(el => el.addEventListener("click", () => {
    state.calculationMode = el.dataset.calcMode;
    renderCase(state.caseId);
  }));
  document.querySelectorAll("[data-engagement-document]").forEach(el => el.addEventListener("click", () => {
    state.engagementDocument = el.dataset.engagementDocument;
    renderCase(state.caseId);
  }));
  document.querySelector("[data-generate-engagement]")?.addEventListener("click", event => {
    event.currentTarget.textContent = "✓ DOCX и PDF сформированы";
    event.currentTarget.classList.add("generated");
  });
}

document.querySelectorAll(".nav-item[data-view]").forEach(el => el.addEventListener("click", () => navigate(el.dataset.view)));
document.getElementById("create-case").addEventListener("click", () => openCreateValuation("real_estate"));
document.getElementById("close-modal").addEventListener("click", () => modal.classList.add("hidden"));
document.getElementById("cancel-modal").addEventListener("click", () => modal.classList.add("hidden"));
document.getElementById("start-case").addEventListener("click", () => {
  modal.classList.add("hidden");
  state.stage = 0;
  if (state.caseMode === "composite") renderCompositeBlueprint();
  else {
    state.workflowTab = "overview";
    renderAppraiserWorkflow("APT-026");
  }
});
document.querySelectorAll("[data-direction]").forEach(el => el.addEventListener("click", () => selectValuationProfile(el.dataset.direction)));
document.querySelectorAll("[data-case-mode]").forEach(el => el.addEventListener("click", () => setCaseMode(el.dataset.caseMode)));
document.getElementById("add-composition-group").addEventListener("click", () => {
  state.compositeGroups.push({
    id: Date.now(),
    direction: state.valuationDirection,
    objectType: state.objectType
  });
  renderCompositionBuilder();
});
modal.addEventListener("click", event => {
  if (event.target === modal) modal.classList.add("hidden");
});

selectValuationProfile("real_estate");
renderDashboard();
