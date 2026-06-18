(function () {
  const State = window.MockState;

  const dashboardScreen = document.getElementById("dashboard-screen");
  const createCaseScreen = document.getElementById("create-case-screen");
  const caseWorkspaceScreen = document.getElementById("case-workspace-screen");
  const pageTitle = document.getElementById("page-title");
  const casesTableBody = document.getElementById("cases-table-body");
  const caseCounter = document.getElementById("case-counter");
  const workflowStrip = document.getElementById("workflow-strip");
  const workspaceWorkflowStrip = document.getElementById("workspace-workflow-strip");
  const workspaceSummary = document.getElementById("workspace-summary");
  const aiProposalsList = document.getElementById("ai-proposals-list");
  const createCaseButton = document.getElementById("create-case-button");
  const backToDashboardButton = document.getElementById("back-to-dashboard-button");
  const runAiButton = document.getElementById("run-ai-button");
  const aiLoading = document.getElementById("ai-loading");
  const subjectAddressInput = document.getElementById("subject-address-input");
  const subjectAreaInput = document.getElementById("subject-area-input");
  const subjectRoomsInput = document.getElementById("subject-rooms-input");
  const valuationPurposeInput = document.getElementById("valuation-purpose-input");

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function caseStatusLabel(status) {
    const labels = {
      draft: "Черновик",
      "in-progress": "В работе",
      review: "На ревью",
      issued: "Выпущен"
    };

    return labels[status] || status;
  }

  function stepTitle(stepId) {
    const step = State.happyPathSteps.find((item) => item.id === stepId);
    return step ? step.title : stepId;
  }

  function objectTypeLabel(objectType) {
    const labels = {
      apartment: "Квартира"
    };

    return labels[objectType] || objectType;
  }

  function purposeLabel(purpose) {
    const labels = {
      collateral: "Залоговое обеспечение",
      sale: "Купля-продажа",
      internal: "Внутреннее решение заказчика"
    };

    return labels[purpose] || purpose;
  }

  function activeCase() {
    return State.cases[0];
  }

  function renderDashboard() {
    casesTableBody.innerHTML = State.cases.map((item) => `
      <tr>
        <td><span class="case-code">${escapeHtml(item.code)}</span></td>
        <td>
          <span class="case-title">${escapeHtml(objectTypeLabel(item.assignment.objectType))}</span>
          <span class="case-subtitle">${escapeHtml(item.subject.address)}</span>
        </td>
        <td>${escapeHtml(item.customer.name)}</td>
        <td>
          <span class="status-pill status-${escapeHtml(item.status)}">
            ${escapeHtml(caseStatusLabel(item.status))}
          </span>
        </td>
        <td>${escapeHtml(stepTitle(item.currentStep))}</td>
        <td>${escapeHtml(item.assignment.deadline)}</td>
      </tr>
    `).join("");

    caseCounter.textContent = State.cases.length;
  }

  function renderWorkflowStrip() {
    const markup = State.happyPathSteps.map((step) => `
      <span class="workflow-step ${step.id === State.session.currentStep ? "active" : ""}">
        ${escapeHtml(step.title)}
      </span>
    `).join("");

    workflowStrip.innerHTML = markup;
    workspaceWorkflowStrip.innerHTML = markup;
  }

  function fillBasicFields() {
    const item = activeCase();

    subjectAddressInput.value = item.subject.address;
    subjectAreaInput.value = item.subject.areaSqm;
    subjectRoomsInput.value = item.subject.rooms;
    valuationPurposeInput.value = item.assignment.purpose;
  }

  function saveBasicFields() {
    const item = activeCase();
    const address = subjectAddressInput.value.trim();
    const areaSqm = Number(subjectAreaInput.value);
    const rooms = Number(subjectRoomsInput.value);
    const purpose = valuationPurposeInput.value;

    item.subject.address = address;
    item.subject.areaSqm = Number.isFinite(areaSqm) ? areaSqm : item.subject.areaSqm;
    item.subject.rooms = Number.isFinite(rooms) ? rooms : item.subject.rooms;
    item.assignment.purpose = purpose;
    item.currentStep = "ai-proposals";
    item.status = "in-progress";

    item.aiProposals[0].proposedText =
      `Объект оценки представляет собой демонстрационную ${item.subject.rooms}-комнатную квартиру площадью ${item.subject.areaSqm} кв. м, расположенную по адресу: ${item.subject.address}.`;
    item.aiProposals[1].proposedText =
      `Оценка выполняется для цели "${purposeLabel(item.assignment.purpose)}" в рамках демонстрационного сценария frontend-прототипа.`;
  }

  function renderWorkspace() {
    const item = activeCase();

    workspaceSummary.innerHTML = `
      <div class="summary-item">
        <span>Кейс</span>
        <strong>${escapeHtml(item.code)}</strong>
      </div>
      <div class="summary-item">
        <span>Адрес</span>
        <strong>${escapeHtml(item.subject.address)}</strong>
      </div>
      <div class="summary-item">
        <span>Площадь</span>
        <strong>${escapeHtml(item.subject.areaSqm)} кв. м</strong>
      </div>
      <div class="summary-item">
        <span>Цель</span>
        <strong>${escapeHtml(purposeLabel(item.assignment.purpose))}</strong>
      </div>
    `;

    aiProposalsList.innerHTML = item.aiProposals.map((proposal) => `
      <article class="proposal-card">
        <div class="proposal-card-head">
          <h3>${escapeHtml(proposal.title)}</h3>
          <span class="ai-badge">Предложение ИИ</span>
        </div>
        <p>${escapeHtml(proposal.proposedText)}</p>
        <div class="proposal-meta">
          Confidence: ${escapeHtml(proposal.confidence)} · Status: ${escapeHtml(proposal.status)}
        </div>
      </article>
    `).join("");
  }

  function showScreen(screenName) {
    State.session.currentScreen = screenName;

    dashboardScreen.classList.toggle("hidden", screenName !== "dashboard");
    createCaseScreen.classList.toggle("hidden", screenName !== "create-case");
    caseWorkspaceScreen.classList.toggle("hidden", screenName !== "case-workspace");

    const titles = {
      dashboard: "Рабочий стол оценщика",
      "create-case": "Заполнение базовых данных",
      "case-workspace": "Рабочая область кейса"
    };

    pageTitle.textContent = titles[screenName] || "AI Report Helper";
  }

  createCaseButton.addEventListener("click", () => {
    State.session.currentStep = "basic-data";
    fillBasicFields();
    renderWorkflowStrip();
    showScreen("create-case");
  });

  backToDashboardButton.addEventListener("click", () => {
    showScreen("dashboard");
  });

  runAiButton.addEventListener("click", () => {
    saveBasicFields();
    renderDashboard();

    runAiButton.disabled = true;
    backToDashboardButton.disabled = true;
    aiLoading.classList.remove("hidden");

    window.setTimeout(() => {
      State.session.currentStep = "ai-proposals";
      renderWorkflowStrip();
      renderWorkspace();
      aiLoading.classList.add("hidden");
      runAiButton.disabled = false;
      backToDashboardButton.disabled = false;
      showScreen("case-workspace");
    }, 1700);
  });

  renderDashboard();
  fillBasicFields();
  renderWorkflowStrip();
  showScreen(State.session.currentScreen);
})();
