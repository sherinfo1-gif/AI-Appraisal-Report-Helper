const state = {
  route: "dashboard",
  metadata: null,
  dashboard: null,
  cases: [],
  selectedCase: null,
  selectedArtifactId: null,
  selectedReportSectionId: null,
  createMode: "single",
  selectedDirection: "real_estate",
  draftGroups: []
};

const app = document.getElementById("app");
const pageTitle = document.getElementById("page-title");
const breadcrumb = document.getElementById("breadcrumb");
const modal = document.getElementById("case-modal");
const form = document.getElementById("case-form");

boot();

async function boot() {
  bindShell();
  setDefaultDates();
  try {
    const [metadata, dashboard, cases] = await Promise.all([
      api("/api/meta"),
      api("/api/dashboard"),
      api("/api/cases")
    ]);
    state.metadata = metadata;
    state.dashboard = dashboard;
    state.cases = cases;
    populateUsers();
    renderDirectionPicker();
    renderAssetGroups();
    updateCaseCount();
    renderDashboard();
  } catch (error) {
    renderFatal(error);
  }
}

function bindShell() {
  document.querySelectorAll("[data-route]").forEach(element => {
    element.addEventListener("click", event => {
      event.preventDefault();
      navigate(element.dataset.route);
    });
  });
  document.getElementById("open-create-case").addEventListener("click", openCreateModal);
  document.getElementById("close-case-modal").addEventListener("click", closeCreateModal);
  document.getElementById("cancel-case-modal").addEventListener("click", closeCreateModal);
  modal.addEventListener("click", event => {
    if (event.target === modal) closeCreateModal();
  });
  document.querySelectorAll("[data-case-mode]").forEach(button => {
    button.addEventListener("click", () => setCreateMode(button.dataset.caseMode));
  });
  document.getElementById("add-asset-group").addEventListener("click", addDraftGroup);
  document.getElementById("object-type-select").addEventListener("change", suggestGroupTitle);
  document.querySelectorAll("input[name='releaseStrategy']").forEach(input => {
    input.addEventListener("change", renderReleaseSelection);
  });
  form.addEventListener("submit", submitCase);
  document.getElementById("global-search").addEventListener("input", event => {
    if (state.route !== "cases") navigate("cases");
    renderCases(event.target.value);
  });
}

function navigate(route) {
  state.route = route;
  state.selectedCase = null;
  document.querySelectorAll(".nav-item[data-route]").forEach(item => {
    item.classList.toggle("active", item.dataset.route === route);
  });
  if (route === "dashboard") return renderDashboard();
  if (route === "cases") return renderCases();
  return renderPlaceholder(route);
}

function renderDashboard() {
  state.route = "dashboard";
  setHeader("Главная", "Рабочий кабинет");
  const metrics = state.dashboard || { total: 0, active: 0, inReview: 0, issued: 0 };
  const recent = state.cases.slice(0, 5);
  app.innerHTML = `
    <section class="hero">
      <div>
        <span class="hero-kicker"><i></i> Рабочая среда оценщика</span>
        <h2>Составляйте отчет<br>в едином рабочем пространстве</h2>
        <p>Разделы отчета, исходные данные, расчеты и методика связаны между собой и сохраняют историю изменений.</p>
      </div>
      <div class="hero-panel">
        <span>Платформа запущена</span>
        <strong>Локальная база данных</strong>
        <small>Данные хранятся на инфраструктуре компании</small>
      </div>
    </section>

    <section class="metric-grid">
      ${metric("▤", metrics.total, "всего оценочных дел", "blue")}
      ${metric("◷", metrics.active, "в активной работе", "violet")}
      ${metric("⌁", metrics.inReview, "на внутренней проверке", "amber")}
      ${metric("✓", metrics.issued, "выпущено", "green")}
    </section>

    <section class="dashboard-layout">
      <article class="panel">
        <header class="panel-header"><div><span class="eyebrow">Последние изменения</span><h3>Оценочные дела</h3></div><button class="text-button" data-show-cases>Все дела →</button></header>
        <div class="case-list">${recent.length ? recent.map(caseRow).join("") : emptyCases()}</div>
      </article>
      <aside class="panel foundation-panel">
        <header class="panel-header"><div><span class="eyebrow">Первый рабочий инкремент</span><h3>Основа платформы</h3></div></header>
        <div class="foundation-list">
          ${foundationItem("01", "Редактор разделов отчета", "Работает")}
          ${foundationItem("02", "Версии ручных изменений", "Работает")}
          ${foundationItem("03", "Обычные и составные отчеты", "Работает")}
          ${foundationItem("04", "Источники и расчетные привязки", "Следующий модуль")}
          ${foundationItem("05", "ТЗ и договор по шаблонам", "Запланировано")}
        </div>
      </aside>
    </section>

    <section class="panel direction-panel">
      <header class="panel-header"><div><span class="eyebrow">Профили оценки</span><h3>Шесть независимых направлений</h3></div><span class="soft-badge">Версия 1</span></header>
      <div class="direction-overview">${state.metadata.directions.map(directionCard).join("")}</div>
    </section>`;
  bindRenderedActions();
}

function renderCases(query = "") {
  state.route = "cases";
  setHeader("Оценочные дела", "Оценка");
  const normalizedQuery = query.trim().toLowerCase();
  const cases = state.cases.filter(item => {
    if (!normalizedQuery) return true;
    return [item.caseNumber, item.title, item.customerName, ...item.directionNames]
      .join(" ").toLowerCase().includes(normalizedQuery);
  });
  app.innerHTML = `
    <section class="page-intro">
      <div><span class="eyebrow">Реестр</span><h2>Все оценочные дела</h2><p>Данные загружаются из локальной SQLite-базы.</p></div>
      <button class="primary-button" data-create-case>+ Новая оценка</button>
    </section>
    <section class="panel cases-table-panel">
      <div class="table-toolbar">
        <span>${cases.length} ${plural(cases.length, "дело", "дела", "дел")}</span>
        <label class="inline-search"><span>⌕</span><input id="case-search" value="${escapeHtml(query)}" placeholder="Номер, объект или заказчик"></label>
      </div>
      ${cases.length ? `
        <div class="table-scroll"><table class="cases-table">
          <thead><tr><th>Дело</th><th>Состав</th><th>Заказчик</th><th>Статус</th><th>Срок</th></tr></thead>
          <tbody>${cases.map(tableRow).join("")}</tbody>
        </table></div>` : emptyCases()}
    </section>`;
  bindRenderedActions();
  document.getElementById("case-search")?.addEventListener("input", event => renderCases(event.target.value));
}

async function renderCaseDetail(id) {
  app.innerHTML = `<div class="loading-card">Загрузка оценочного дела…</div>`;
  try {
    const valuationCase = await api(`/api/cases/${id}`);
    state.route = "case";
    state.selectedCase = valuationCase;
    if (!valuationCase.artifacts.some(artifact => artifact.id === state.selectedArtifactId)) {
      state.selectedArtifactId = valuationCase.artifacts[0]?.id || null;
    }
    if (!valuationCase.reportSections.some(section => section.id === state.selectedReportSectionId)) {
      state.selectedReportSectionId = valuationCase.reportSections[0]?.id || null;
    }
    setHeader(valuationCase.caseNumber, `Оценочные дела / ${valuationCase.caseMode === "composite" ? "Составное" : "Обычное"}`);
    app.innerHTML = `
      <section class="case-heading">
        <div>
          <span class="eyebrow">${escapeHtml(valuationCase.customerName)}</span>
          <h2>${escapeHtml(valuationCase.title)}</h2>
          <p>${formatDate(valuationCase.valuationDate)} · ${escapeHtml(valuationCase.purpose)} · ${escapeHtml(valuationCase.valueType)}</p>
        </div>
        <div class="case-heading-actions">
          ${statusBadge(valuationCase.status)}
          ${nextStatusButton(valuationCase.status)}
        </div>
      </section>

      ${pilotWorkspace(valuationCase)}

      ${reportWorkspace(valuationCase)}

      <section class="case-summary-grid">
        ${summaryCard("Режим дела", valuationCase.caseMode === "composite" ? "Составное" : "Один профиль", `${valuationCase.assetGroups.length} ${plural(valuationCase.assetGroups.length, "группа", "группы", "групп")}`)}
        ${summaryCard("Стратегия выпуска", state.metadata.releaseStrategies[valuationCase.releaseStrategy], "Закреплена на уровне дела")}
        ${summaryCard("Ответственные", valuationCase.appraiserName, valuationCase.reviewerName || "Проверяющий не назначен")}
        ${summaryCard("Договорный пакет", "Черновик", "ТЗ и договор будут следующим модулем")}
      </section>

      <section class="case-detail-layout">
        <article class="panel">
          <header class="panel-header"><div><span class="eyebrow">Независимые расчетные контуры</span><h3>Группы объектов</h3></div><span class="soft-badge">${valuationCase.assetGroups.length}</span></header>
          <div class="group-cards">${valuationCase.assetGroups.map(groupDetailCard).join("")}</div>
        </article>
        <aside class="panel">
          <header class="panel-header"><div><span class="eyebrow">Неизменяемая история</span><h3>Журнал действий</h3></div></header>
          <div class="audit-list">${valuationCase.audit.map(auditRow).join("")}</div>
        </aside>
      </section>

      <section class="panel next-module">
        <div><span class="eyebrow">Следующий практический модуль</span><h3>Исходные данные и расчетные таблицы</h3><p>Поля объекта, источники и результаты расчетов будут вставляться в выбранные разделы с контролем происхождения.</p></div>
        <span class="next-module-state">Запланировано</span>
      </section>`;
    bindRenderedActions();
  } catch (error) {
    renderFatal(error);
  }
}

function renderPlaceholder(route) {
  const labels = {
    archive: ["Архив", "Неизменяемые выпуски, файлы и контрольные хеши."],
    templates: ["Шаблоны", "Версии шаблонов ТЗ, договоров и отчетов."],
    methodology: ["Методика", "Стандарты, формулы, коэффициенты и правила контроля."],
    references: ["Справочники", "Курсы, классификаторы и нормативные показатели."],
    settings: ["Настройки", "Организация, пользователи, роли и хранилище."]
  };
  const [title, description] = labels[route];
  setHeader(title, "Платформа");
  app.innerHTML = `<section class="placeholder"><span>Модуль</span><h2>${title}</h2><p>${description}</p><strong>Будет подключен следующим рабочим инкрементом.</strong></section>`;
}

function openCreateModal() {
  state.createMode = "single";
  state.selectedDirection = "real_estate";
  state.draftGroups = [];
  form.reset();
  setDefaultDates();
  setCreateMode("single");
  renderDirectionPicker();
  renderAssetGroups();
  hideFormError();
  modal.classList.remove("hidden");
}

function closeCreateModal() {
  modal.classList.add("hidden");
}

function setCreateMode(mode) {
  state.createMode = mode;
  document.querySelectorAll("[data-case-mode]").forEach(button => {
    button.classList.toggle("active", button.dataset.caseMode === mode);
  });
  document.getElementById("release-section").classList.toggle("hidden", mode !== "composite");
  if (mode === "single" && state.draftGroups.length > 1) state.draftGroups = state.draftGroups.slice(0, 1);
  renderAssetGroups();
}

function renderDirectionPicker() {
  if (!state.metadata) return;
  const grid = document.getElementById("direction-grid");
  grid.innerHTML = state.metadata.directions.map(direction => `
    <button type="button" class="direction-choice ${direction.code === state.selectedDirection ? "active" : ""}" data-direction="${direction.code}">
      <span>${direction.icon}</span><strong>${direction.name}</strong><small>${direction.description}</small>
    </button>`).join("");
  grid.querySelectorAll("[data-direction]").forEach(button => {
    button.addEventListener("click", () => {
      state.selectedDirection = button.dataset.direction;
      renderDirectionPicker();
      populateObjectTypes();
    });
  });
  populateObjectTypes();
}

function populateObjectTypes() {
  const direction = getDirection(state.selectedDirection);
  const select = document.getElementById("object-type-select");
  select.innerHTML = direction.objectTypes.map(([code, name]) => `<option value="${code}">${name}</option>`).join("");
  suggestGroupTitle();
}

function suggestGroupTitle() {
  const direction = getDirection(state.selectedDirection);
  const objectType = direction.objectTypes.find(([code]) => code === document.getElementById("object-type-select").value);
  document.getElementById("group-title").placeholder = objectType?.[1] || direction.name;
}

function addDraftGroup() {
  const objectTypeCode = document.getElementById("object-type-select").value;
  const direction = getDirection(state.selectedDirection);
  const objectType = direction.objectTypes.find(([code]) => code === objectTypeCode);
  const titleInput = document.getElementById("group-title");
  const group = {
    localId: crypto.randomUUID(),
    directionCode: direction.code,
    objectTypeCode,
    title: titleInput.value.trim() || objectType[1]
  };
  if (state.createMode === "single") state.draftGroups = [group];
  else state.draftGroups.push(group);
  titleInput.value = "";
  renderAssetGroups();
}

function renderAssetGroups() {
  const list = document.getElementById("asset-group-list");
  if (!list) return;
  if (!state.draftGroups.length) {
    list.innerHTML = `<div class="empty-groups">Добавьте ${state.createMode === "composite" ? "минимум две группы активов" : "одну группу объектов"}.</div>`;
    return;
  }
  list.innerHTML = state.draftGroups.map((group, index) => {
    const direction = getDirection(group.directionCode);
    const objectType = direction.objectTypes.find(([code]) => code === group.objectTypeCode);
    return `<article class="draft-group">
      <span class="group-number">${index + 1}</span><span class="group-icon">${direction.icon}</span>
      <div><strong>${escapeHtml(group.title)}</strong><small>${direction.name} · ${objectType[1]} · профиль v1</small></div>
      <button type="button" data-remove-group="${group.localId}" aria-label="Удалить">×</button>
    </article>`;
  }).join("");
  list.querySelectorAll("[data-remove-group]").forEach(button => {
    button.addEventListener("click", () => {
      state.draftGroups = state.draftGroups.filter(group => group.localId !== button.dataset.removeGroup);
      renderAssetGroups();
    });
  });
}

async function submitCase(event) {
  event.preventDefault();
  hideFormError();
  const formData = new FormData(form);
  const expectedGroups = state.createMode === "composite" ? 2 : 1;
  if (state.draftGroups.length < expectedGroups) {
    return showFormError(state.createMode === "composite"
      ? "Добавьте минимум две группы активов."
      : "Добавьте одну группу объектов.");
  }

  const submitButton = document.getElementById("create-case-submit");
  submitButton.disabled = true;
  submitButton.textContent = "Создание…";
  try {
    const created = await api("/api/cases", {
      method: "POST",
      body: JSON.stringify({
        title: formData.get("title"),
        customerName: formData.get("customerName"),
        purpose: formData.get("purpose"),
        valueType: formData.get("valueType"),
        valuationDate: formData.get("valuationDate"),
        deadline: formData.get("deadline"),
        appraiserId: formData.get("appraiserId"),
        reviewerId: formData.get("reviewerId") || null,
        caseMode: state.createMode,
        releaseStrategy: formData.get("releaseStrategy") || "unified",
        assetGroups: state.draftGroups.map(({ directionCode, objectTypeCode, title }) => ({ directionCode, objectTypeCode, title }))
      })
    });
    closeCreateModal();
    await refreshData();
    showToast(`${created.caseNumber} создано`);
    renderCaseDetail(created.id);
  } catch (error) {
    showFormError(error.details?.join(" ") || error.message);
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Создать оценочное дело";
  }
}

async function updateStatus(id, status) {
  try {
    await api(`/api/cases/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status })
    });
    await refreshData();
    showToast("Статус дела обновлен");
    renderCaseDetail(id);
  } catch (error) {
    showToast(error.message, true);
  }
}

async function refreshData() {
  [state.dashboard, state.cases] = await Promise.all([api("/api/dashboard"), api("/api/cases")]);
  updateCaseCount();
}

function bindRenderedActions() {
  document.querySelector("[data-show-cases]")?.addEventListener("click", () => navigate("cases"));
  document.querySelectorAll("[data-open-case]").forEach(element => {
    element.addEventListener("click", () => renderCaseDetail(element.dataset.openCase));
  });
  document.querySelectorAll("[data-create-case]").forEach(element => element.addEventListener("click", openCreateModal));
  document.querySelector("[data-next-status]")?.addEventListener("click", element => {
    updateStatus(state.selectedCase.id, element.currentTarget.dataset.nextStatus);
  });
  document.querySelectorAll("[data-report-section]").forEach(element => {
    element.addEventListener("click", () => {
      state.selectedReportSectionId = element.dataset.reportSection;
      renderCaseDetail(state.selectedCase.id);
    });
  });
  document.querySelector("[data-save-report-section]")?.addEventListener("click", saveReportSection);
  document.querySelectorAll("[data-artifact]").forEach(element => {
    element.addEventListener("click", () => {
      state.selectedArtifactId = element.dataset.artifact;
      renderCaseDetail(state.selectedCase.id);
    });
  });
  document.querySelector("[data-save-artifact]")?.addEventListener("click", saveArtifact);
  document.querySelectorAll("[data-review-artifact]").forEach(element => {
    element.addEventListener("click", () => reviewSelectedArtifact(element.dataset.reviewArtifact));
  });
  document.querySelector("[data-create-agent-task]")?.addEventListener("click", createPilotTask);
}

function populateUsers() {
  const appraisers = state.metadata.users.filter(user => ["appraiser", "administrator"].includes(user.role));
  const reviewers = state.metadata.users.filter(user => ["reviewer", "methodologist"].includes(user.role));
  document.getElementById("appraiser-select").innerHTML = appraisers.map(user => `<option value="${user.id}">${user.fullName}</option>`).join("");
  document.getElementById("reviewer-select").innerHTML = `<option value="">Не назначен</option>${reviewers.map(user => `<option value="${user.id}">${user.fullName}</option>`).join("")}`;
}

function renderReleaseSelection() {
  document.querySelectorAll(".release-option").forEach(option => {
    option.classList.toggle("active", option.querySelector("input").checked);
  });
}

function setDefaultDates() {
  const valuationDate = form.elements.valuationDate;
  const deadline = form.elements.deadline;
  if (!valuationDate) return;
  const today = new Date();
  const due = new Date(today);
  due.setDate(due.getDate() + 5);
  valuationDate.value = toDateInput(today);
  deadline.value = toDateInput(due);
}

function directionCard(direction) {
  return `<article class="direction-card"><span>${direction.icon}</span><div><strong>${direction.name}</strong><small>${direction.description}</small></div><i>${direction.objectTypes.length} типов</i></article>`;
}

function caseRow(item) {
  return `<button class="case-row" data-open-case="${item.id}">
    <span class="case-symbol">${item.caseMode === "composite" ? "▦" : getDirection(item.directionNames[0], true)?.icon || "◇"}</span>
    <span class="case-primary"><strong>${escapeHtml(item.title)}</strong><small>${item.caseNumber} · ${escapeHtml(item.customerName)}</small></span>
    <span class="case-directions">${item.directionNames.map(name => `<i>${name}</i>`).join("")}</span>
    ${statusBadge(item.status)}
  </button>`;
}

function tableRow(item) {
  return `<tr data-open-case="${item.id}">
    <td><strong>${escapeHtml(item.title)}</strong><small>${item.caseNumber}</small></td>
    <td><span>${item.caseMode === "composite" ? `${item.groupCount} группы` : item.directionNames[0] || "—"}</span><small>${item.directionNames.join(" · ")}</small></td>
    <td><span>${escapeHtml(item.customerName)}</span><small>${escapeHtml(item.appraiserName)}</small></td>
    <td>${statusBadge(item.status)}</td>
    <td>${item.deadline ? formatDate(item.deadline) : "Не задан"}</td>
  </tr>`;
}

function groupDetailCard(group) {
  return `<article class="group-detail-card">
    <header><span>${group.icon}</span><i>Группа ${group.sequenceNumber}</i></header>
    <h4>${escapeHtml(group.title)}</h4>
    <p>${group.directionName} · ${group.objectTypeName}</p>
    <div><span>Профиль</span><strong>${group.workflowProfileId}</strong></div>
    <div><span>Статус</span><strong>Черновик</strong></div>
    <button class="secondary-button" disabled>Открыть рабочий процесс</button>
  </article>`;
}

function auditRow(event) {
  const labels = {
    "case.created": "Оценочное дело создано",
    "case.status_changed": "Статус дела изменен",
    "report_section.updated": "Текст раздела отчета сохранен",
    "agent_task.created": "Создано поручение ассистенту",
    "artifact.updated": "Рабочий артефакт обновлен",
    "artifact.reviewed": "По артефакту принято решение"
  };
  return `<article class="audit-row"><span></span><div><strong>${labels[event.eventType] || event.eventType}</strong><small>${event.actorName} · ${formatDateTime(event.createdAt)}</small></div></article>`;
}

function pilotWorkspace(valuationCase) {
  const selected = valuationCase.artifacts.find(artifact => artifact.id === state.selectedArtifactId)
    || valuationCase.artifacts[0];
  if (!selected) return "";

  const statusLabels = {
    proposed: "Предложен",
    accepted: "Принят",
    rejected: "Отклонен",
    revision: "Требует доработки"
  };
  const typeLabels = {
    document_register: "Документы",
    facts: "Факты",
    gaps: "Вопросы",
    assignment: "ТЗ",
    legal_sources: "Нормы",
    methodology: "Методика",
    calculation: "Расчет",
    report: "Отчет"
  };
  const acceptedCount = valuationCase.artifacts.filter(artifact => artifact.reviewStatus === "accepted").length;
  const latestTasks = valuationCase.agentTasks.slice(0, 3);

  return `
    <section class="pilot-workbench panel">
      <header class="pilot-header">
        <div>
          <span class="eyebrow">Учебный пилот · недвижимость</span>
          <h3>Рабочий проект оценки</h3>
          <p>Двигайтесь от поручения и фактов к методике, расчету и отчету. CRM-статусы не управляют этой работой.</p>
        </div>
        <div class="pilot-progress"><strong>${acceptedCount}/${valuationCase.artifacts.length}</strong><span>артефактов принято</span></div>
      </header>

      <div class="pilot-columns">
        <aside class="artifact-rail">
          <div class="rail-caption"><strong>Материалы и результаты</strong><small>Проверяются отдельно</small></div>
          ${valuationCase.artifacts.map((artifact, index) => `
            <button class="artifact-link ${artifact.id === selected.id ? "active" : ""}" data-artifact="${artifact.id}">
              <span>${String(index + 1).padStart(2, "0")}</span>
              <div>
                <i>${typeLabels[artifact.artifactType]}</i>
                <strong>${escapeHtml(artifact.title)}</strong>
                <small>v${artifact.version} · ${statusLabels[artifact.reviewStatus]}</small>
              </div>
              <b class="artifact-state state-${artifact.reviewStatus}"></b>
            </button>`).join("")}
        </aside>

        <article class="artifact-editor">
          <div class="artifact-heading">
            <div><span class="eyebrow">${typeLabels[selected.artifactType]}</span><h3>${escapeHtml(selected.title)}</h3></div>
            <span class="review-badge review-${selected.reviewStatus}">${statusLabels[selected.reviewStatus]}</span>
          </div>
          <p class="artifact-description">${escapeHtml(selected.description)}</p>
          <div class="artifact-meta">
            <span>Версия ${selected.version}</span>
            <span>${escapeHtml(selected.updatedByName)} · ${formatDateTime(selected.updatedAt)}</span>
          </div>
          <textarea id="artifact-content" class="artifact-textarea" aria-label="Содержание рабочего артефакта">${escapeHtml(selected.content)}</textarea>
          <div class="artifact-save">
            <label><span>Комментарий к версии</span><input id="artifact-change-note" value="Ручная редакция оценщика"></label>
            <button class="primary-button" data-save-artifact>Сохранить версию</button>
          </div>
        </article>

        <aside class="assistant-panel">
          <span class="eyebrow">Ассистент проекта</span>
          <h4>Поставить поручение</h4>
          <p>Сейчас поручение фиксируется в деле и выполняется совместно вручную. AI-провайдер подключим после проверки процесса.</p>
          <textarea id="agent-task-prompt" aria-label="Поручение ассистенту" placeholder="Например: составь перечень документов для оценки квартиры"></textarea>
          <button class="secondary-button assistant-task-button" data-create-agent-task>Добавить поручение</button>

          <div class="review-box">
            <strong>Решение оценщика</strong>
            <textarea id="artifact-review-comment" aria-label="Комментарий к решению" placeholder="Комментарий обязателен при возврате или отклонении">${escapeHtml(selected.reviewComment || "")}</textarea>
            <div class="review-actions">
              <button data-review-artifact="accepted">Принять</button>
              <button data-review-artifact="revision">Вернуть</button>
              <button data-review-artifact="rejected">Отклонить</button>
            </div>
          </div>

          <div class="task-history">
            <strong>Последние поручения</strong>
            ${latestTasks.length ? latestTasks.map(task => `
              <article><span>${task.status === "planned" ? "Запланировано" : task.status}</span><p>${escapeHtml(task.prompt)}</p><small>${formatDateTime(task.createdAt)}</small></article>
            `).join("") : "<small>Поручений пока нет.</small>"}
          </div>
        </aside>
      </div>
    </section>`;
}

function reportWorkspace(valuationCase) {
  const selected = valuationCase.reportSections.find(section => section.id === state.selectedReportSectionId)
    || valuationCase.reportSections[0];
  if (!selected) return "";
  const originLabels = {
    template: "Текст шаблона",
    generated: "Связан с данными дела",
    calculated: "Результат расчета",
    manual: "Ручная редакция"
  };
  return `
    <section class="report-workbench panel">
      <header class="workbench-header">
        <div><span class="eyebrow">Практическая работа оценщика</span><h3>Составление отчета</h3></div>
        <div class="workbench-tabs">
          <button class="active">Текст отчета</button>
          <button disabled>Исходные данные</button>
          <button disabled>Расчеты</button>
        </div>
      </header>
      <div class="report-workspace">
        <aside class="report-outline">
          <div class="outline-caption"><strong>Структура документа</strong><small>${valuationCase.reportSections.length} разделов</small></div>
          ${valuationCase.reportSections.map(section => `
            <button class="outline-section ${section.id === selected.id ? "active" : ""}" data-report-section="${section.id}">
              <span>${section.sectionNumber}</span>
              <div><strong>${escapeHtml(section.title)}</strong><small>${originLabels[section.origin]} · v${section.version}</small></div>
              <i class="origin-dot ${section.origin}"></i>
            </button>`).join("")}
        </aside>
        <article class="report-editor">
          <div class="editor-heading">
            <div><span class="eyebrow">Раздел ${selected.sectionNumber}</span><h3>${escapeHtml(selected.title)}</h3></div>
            <span class="editor-version">Версия ${selected.version}</span>
          </div>
          <div class="source-strip">
            <span class="source-kind ${selected.origin}">${originLabels[selected.origin]}</span>
            <span>Последнее изменение: ${escapeHtml(selected.updatedByName)} · ${formatDateTime(selected.updatedAt)}</span>
          </div>
          <div class="editor-toolbar" aria-label="Панель форматирования">
            <button type="button" disabled><b>B</b></button>
            <button type="button" disabled><i>I</i></button>
            <button type="button" disabled>Список</button>
            <span></span>
            <button type="button" disabled>Вставить поле</button>
            <button type="button" disabled>Вставить расчет</button>
          </div>
          <textarea id="report-section-content" class="report-textarea" aria-label="Текст раздела">${escapeHtml(selected.content)}</textarea>
          <div class="editor-save-row">
            <label><span>Комментарий к изменению</span><input id="report-change-note" value="Ручная корректировка оценщика"></label>
            <div><span id="report-char-count">${selected.content.length} знаков</span><button class="primary-button" data-save-report-section>Сохранить новую версию</button></div>
          </div>
        </article>
        <aside class="report-context">
          <span class="eyebrow">Контекст раздела</span>
          <h4>Что будет подключено</h4>
          <div class="context-item"><span>01</span><div><strong>Поля оценочного дела</strong><small>Заказчик, даты, объект и права</small></div></div>
          <div class="context-item"><span>02</span><div><strong>Расчетные результаты</strong><small>Значения и таблицы утвержденного снимка</small></div></div>
          <div class="context-item"><span>03</span><div><strong>Методика</strong><small>Пункты стандарта и обоснования</small></div></div>
          <div class="editor-rule"><strong>Ручной текст защищен</strong><span>Автоматизация не заменит эту редакцию без решения оценщика.</span></div>
        </aside>
      </div>
    </section>`;
}

async function saveArtifact() {
  const artifactId = state.selectedArtifactId;
  const content = document.getElementById("artifact-content").value;
  const changeNote = document.getElementById("artifact-change-note").value;
  const button = document.querySelector("[data-save-artifact]");
  button.disabled = true;
  button.textContent = "Сохранение…";
  try {
    await api(`/api/cases/${state.selectedCase.id}/artifacts/${artifactId}`, {
      method: "PATCH",
      body: JSON.stringify({ content, changeNote })
    });
    showToast("Новая версия артефакта сохранена");
    await refreshData();
    await renderCaseDetail(state.selectedCase.id);
  } catch (error) {
    showToast(error.message, true);
    button.disabled = false;
    button.textContent = "Сохранить версию";
  }
}

async function reviewSelectedArtifact(status) {
  const comment = document.getElementById("artifact-review-comment").value;
  try {
    await api(`/api/cases/${state.selectedCase.id}/artifacts/${state.selectedArtifactId}/review`, {
      method: "POST",
      body: JSON.stringify({ status, comment })
    });
    showToast(status === "accepted" ? "Артефакт принят" : "Решение сохранено");
    await refreshData();
    await renderCaseDetail(state.selectedCase.id);
  } catch (error) {
    showToast(error.message, true);
  }
}

async function createPilotTask() {
  const input = document.getElementById("agent-task-prompt");
  const prompt = input.value.trim();
  if (!prompt) return showToast("Опишите поручение ассистенту", true);
  try {
    await api(`/api/cases/${state.selectedCase.id}/agent-tasks`, {
      method: "POST",
      body: JSON.stringify({ prompt })
    });
    showToast("Поручение добавлено в проект");
    await refreshData();
    await renderCaseDetail(state.selectedCase.id);
  } catch (error) {
    showToast(error.message, true);
  }
}

async function saveReportSection() {
  const sectionId = state.selectedReportSectionId;
  const content = document.getElementById("report-section-content").value;
  const changeNote = document.getElementById("report-change-note").value;
  const button = document.querySelector("[data-save-report-section]");
  button.disabled = true;
  button.textContent = "Сохранение…";
  try {
    await api(`/api/cases/${state.selectedCase.id}/report-sections/${sectionId}`, {
      method: "PATCH",
      body: JSON.stringify({ content, changeNote })
    });
    showToast("Новая версия раздела сохранена");
    await refreshData();
    await renderCaseDetail(state.selectedCase.id);
  } catch (error) {
    showToast(error.message, true);
    button.disabled = false;
    button.textContent = "Сохранить новую версию";
  }
}

function statusBadge(status) {
  const labels = state.metadata?.statuses || {};
  return `<span class="status-badge status-${status}">${labels[status] || status}</span>`;
}

function nextStatusButton(status) {
  const transitions = {
    draft: ["in_progress", "Начать работу →"],
    in_progress: ["in_review", "Передать на проверку →"],
    in_review: ["approved", "Утвердить →"],
    returned: ["in_review", "Повторно на проверку →"],
    approved: ["issued", "Выпустить →"],
    issued: ["archived", "В архив →"]
  };
  const transition = transitions[status];
  return transition ? `<button class="primary-button" data-next-status="${transition[0]}">${transition[1]}</button>` : "";
}

function metric(icon, value, label, tone) {
  return `<article class="metric-card"><span class="metric-icon ${tone}">${icon}</span><div><strong>${value}</strong><small>${label}</small></div></article>`;
}

function foundationItem(number, title, status) {
  return `<div class="foundation-item"><span>${number}</span><div><strong>${title}</strong><small>${status}</small></div></div>`;
}

function summaryCard(label, value, note) {
  return `<article class="summary-card"><span>${label}</span><strong>${escapeHtml(value)}</strong><small>${escapeHtml(note)}</small></article>`;
}

function emptyCases() {
  return `<div class="empty-state"><span>▤</span><strong>Оценочных дел пока нет</strong><p>Создайте первое обычное или составное дело.</p><button class="primary-button" data-create-case>+ Новая оценка</button></div>`;
}

function renderFatal(error) {
  setHeader("Ошибка запуска", "Система");
  app.innerHTML = `<section class="fatal-card"><strong>Не удалось загрузить приложение</strong><p>${escapeHtml(error.message)}</p><button class="secondary-button" data-reload>Повторить</button></section>`;
  document.querySelector("[data-reload]")?.addEventListener("click", () => location.reload());
}

function setHeader(title, crumb) {
  pageTitle.textContent = title;
  breadcrumb.textContent = crumb;
}

function updateCaseCount() {
  document.getElementById("case-count").textContent = state.cases.length;
}

function getDirection(codeOrName, byName = false) {
  return state.metadata.directions.find(direction => byName ? direction.name === codeOrName : direction.code === codeOrName);
}

function showFormError(message) {
  const element = document.getElementById("form-error");
  element.textContent = message;
  element.classList.remove("hidden");
}

function hideFormError() {
  document.getElementById("form-error").classList.add("hidden");
}

let toastTimeout;
function showToast(message, error = false) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.toggle("error", error);
  toast.classList.remove("hidden");
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.add("hidden"), 3200);
}

async function api(path, options = {}) {
  const response = await fetch(path, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options
  });
  const data = await response.json();
  if (!response.ok) {
    const error = new Error(data.error || "Ошибка запроса");
    error.details = data.details;
    throw error;
  }
  return data;
}

function formatDate(value) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long", year: "numeric" }).format(new Date(`${value}T00:00:00`));
}

function formatDateTime(value) {
  return new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(value));
}

function toDateInput(date) {
  return date.toISOString().slice(0, 10);
}

function plural(number, one, few, many) {
  const mod10 = number % 10;
  const mod100 = number % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
