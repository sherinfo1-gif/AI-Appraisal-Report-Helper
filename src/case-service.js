import { randomUUID } from "node:crypto";
import {
  caseStatuses,
  defaultReportSections,
  getDirection,
  getObjectType,
  releaseStrategies,
  valuationCatalog
} from "./catalog.js";

const allowedTransitions = {
  draft: ["in_progress"],
  in_progress: ["in_review"],
  in_review: ["returned", "approved"],
  returned: ["in_review"],
  approved: ["issued"],
  issued: ["archived"],
  archived: []
};

const trainingPilotArtifacts = [
  {
    key: "document-register",
    type: "document_register",
    title: "Реестр документов",
    description: "Какие материалы получены, чего не хватает и что требует проверки.",
    content: "Документы пока не загружены.\n\nПервый шаг: перечислить имеющиеся правоустанавливающие, технические и идентификационные документы."
  },
  {
    key: "confirmed-facts",
    type: "facts",
    title: "Подтвержденные факты",
    description: "Только сведения, подтвержденные документом или оценщиком.",
    content: "Объект: учебная квартира.\nСтатус данных: требуется заполнение и подтверждение.\n\nНеподтвержденные предположения сюда не включаются."
  },
  {
    key: "open-questions",
    type: "gaps",
    title: "Недостающие сведения",
    description: "Вопросы заказчику и данные, без которых нельзя продолжать расчет.",
    content: "1. Уточнить точный адрес и кадастровый номер.\n2. Подтвердить состав оцениваемых прав.\n3. Получить площадь и технические характеристики.\n4. Зафиксировать состояние объекта и дату осмотра."
  },
  {
    key: "assignment-draft",
    type: "assignment",
    title: "Проект задания на оценку",
    description: "Рабочий проект ТЗ на основе подтвержденных данных дела.",
    content: "Объект оценки: учебная квартира.\nЦель оценки: определяется оценщиком.\nВид стоимости: рыночная стоимость.\nДата оценки: берется из карточки дела.\n\nПроект требует проверки оценщиком."
  },
  {
    key: "legal-sources",
    type: "legal_sources",
    title: "Нормативные источники",
    description: "Официальные источники с датой действия и областью применения.",
    content: "1. Единый национальный стандарт оценки Республики Узбекистан, редакция должна быть проверена на дату оценки.\n\nПравовые выводы без подтвержденного официального источника не принимаются."
  },
  {
    key: "methodology-decisions",
    type: "methodology",
    title: "Методические решения",
    description: "Применение норм и профессиональные решения по конкретному делу.",
    content: "Предварительно: для типовой квартиры рассматривается сравнительный подход.\n\nВыбор подходов и отказ от их применения должны быть отдельно обоснованы и приняты оценщиком."
  },
  {
    key: "calculation-model",
    type: "calculation",
    title: "Расчетная модель",
    description: "Входные данные, логика расчета, версия XLSX и утвержденные результаты.",
    content: "Расчетная модель пока не создана.\n\nПлан: таблица объекта, таблица аналогов, корректировки, расчет удельной стоимости и итоговое округление."
  },
  {
    key: "report-draft",
    type: "report",
    title: "Черновик отчета",
    description: "Связь утвержденных фактов, методики и расчета с разделами отчета.",
    content: "Черновик отчета формируется только из принятых артефактов. Ручные редакции разделов хранятся отдельно и не перезаписываются автоматически."
  }
];

export class ValidationError extends Error {
  constructor(message, details = []) {
    super(message);
    this.name = "ValidationError";
    this.details = details;
  }
}

export function getMetadata(db) {
  return {
    directions: valuationCatalog,
    statuses: caseStatuses,
    releaseStrategies,
    users: db.prepare(`
      SELECT id, full_name AS fullName, role
      FROM users
      WHERE active = 1
      ORDER BY full_name
    `).all()
  };
}

export function getDashboard(db) {
  const counts = Object.fromEntries(
    db.prepare("SELECT status, COUNT(*) AS count FROM valuation_cases GROUP BY status")
      .all()
      .map(row => [row.status, Number(row.count)])
  );
  return {
    total: Object.values(counts).reduce((sum, count) => sum + count, 0),
    active: (counts.draft || 0) + (counts.in_progress || 0) + (counts.returned || 0),
    inReview: counts.in_review || 0,
    issued: counts.issued || 0,
    counts
  };
}

export function listCases(db) {
  const rows = db.prepare(`
    SELECT
      c.id,
      c.case_number AS caseNumber,
      c.title,
      c.case_mode AS caseMode,
      c.release_strategy AS releaseStrategy,
      c.status,
      c.created_at AS createdAt,
      c.updated_at AS updatedAt,
      e.customer_name AS customerName,
      e.purpose,
      e.valuation_date AS valuationDate,
      e.deadline,
      u.full_name AS appraiserName,
      COUNT(g.id) AS groupCount,
      GROUP_CONCAT(DISTINCT d.name) AS directionNames
    FROM valuation_cases c
    JOIN engagements e ON e.id = c.engagement_id
    JOIN users u ON u.id = c.appraiser_id
    LEFT JOIN asset_groups g ON g.case_id = c.id
    LEFT JOIN valuation_directions d ON d.code = g.direction_code
    GROUP BY c.id
    ORDER BY c.updated_at DESC
  `).all();

  return rows.map(row => ({
    ...row,
    groupCount: Number(row.groupCount),
    directionNames: row.directionNames ? row.directionNames.split(",") : []
  }));
}

export function getCase(db, id) {
  const valuationCase = db.prepare(`
    SELECT
      c.id,
      c.case_number AS caseNumber,
      c.title,
      c.case_mode AS caseMode,
      c.release_strategy AS releaseStrategy,
      c.status,
      c.created_at AS createdAt,
      c.updated_at AS updatedAt,
      c.appraiser_id AS appraiserId,
      c.reviewer_id AS reviewerId,
      e.id AS engagementId,
      e.customer_name AS customerName,
      e.purpose,
      e.value_type AS valueType,
      e.valuation_date AS valuationDate,
      e.deadline,
      e.status AS engagementStatus,
      e.terms_json AS termsJson,
      appraiser.full_name AS appraiserName,
      reviewer.full_name AS reviewerName
    FROM valuation_cases c
    JOIN engagements e ON e.id = c.engagement_id
    JOIN users appraiser ON appraiser.id = c.appraiser_id
    LEFT JOIN users reviewer ON reviewer.id = c.reviewer_id
    WHERE c.id = ?
  `).get(id);

  if (!valuationCase) return null;

  const groups = db.prepare(`
    SELECT
      g.id,
      g.sequence_number AS sequenceNumber,
      g.direction_code AS directionCode,
      d.name AS directionName,
      d.icon,
      g.object_type_code AS objectTypeCode,
      o.name AS objectTypeName,
      g.workflow_profile_id AS workflowProfileId,
      g.title,
      g.status,
      g.approved_value_minor AS approvedValueMinor,
      g.currency
    FROM asset_groups g
    JOIN valuation_directions d ON d.code = g.direction_code
    JOIN object_type_definitions o ON o.code = g.object_type_code
    WHERE g.case_id = ?
    ORDER BY g.sequence_number
  `).all(id);

  const audit = db.prepare(`
    SELECT
      a.id,
      a.event_type AS eventType,
      a.entity_type AS entityType,
      a.entity_id AS entityId,
      a.payload_json AS payloadJson,
      a.created_at AS createdAt,
      u.full_name AS actorName
    FROM audit_events a
    JOIN users u ON u.id = a.actor_id
    WHERE a.case_id = ?
    ORDER BY a.id DESC
    LIMIT 50
  `).all(id).map(event => ({ ...event, payload: JSON.parse(event.payloadJson) }));

  const reportSections = db.prepare(`
    SELECT
      s.id,
      s.asset_group_id AS assetGroupId,
      s.section_key AS sectionKey,
      s.sequence_number AS sequenceNumber,
      s.section_number AS sectionNumber,
      s.title,
      s.content,
      s.origin,
      s.status,
      s.version,
      s.updated_at AS updatedAt,
      u.full_name AS updatedByName
    FROM report_sections s
    JOIN users u ON u.id = s.updated_by
    WHERE s.case_id = ?
    ORDER BY s.sequence_number
  `).all(id);

  const artifacts = db.prepare(`
    SELECT
      a.id,
      a.artifact_key AS artifactKey,
      a.artifact_type AS artifactType,
      a.title,
      a.description,
      a.content,
      a.version,
      a.review_status AS reviewStatus,
      a.updated_at AS updatedAt,
      u.full_name AS updatedByName,
      (
        SELECT r.comment
        FROM artifact_reviews r
        WHERE r.artifact_id = a.id
        ORDER BY r.created_at DESC
        LIMIT 1
      ) AS reviewComment
    FROM artifacts a
    JOIN users u ON u.id = a.updated_by
    WHERE a.case_id = ?
    ORDER BY
      CASE a.artifact_type
        WHEN 'document_register' THEN 1
        WHEN 'facts' THEN 2
        WHEN 'gaps' THEN 3
        WHEN 'assignment' THEN 4
        WHEN 'legal_sources' THEN 5
        WHEN 'methodology' THEN 6
        WHEN 'calculation' THEN 7
        WHEN 'report' THEN 8
      END
  `).all(id);

  const agentTasks = db.prepare(`
    SELECT
      t.id,
      t.prompt,
      t.status,
      t.created_at AS createdAt,
      t.updated_at AS updatedAt,
      u.full_name AS createdByName
    FROM agent_tasks t
    JOIN users u ON u.id = t.created_by
    WHERE t.case_id = ?
    ORDER BY t.created_at DESC
    LIMIT 20
  `).all(id);

  return {
    ...valuationCase,
    terms: JSON.parse(valuationCase.termsJson),
    assetGroups: groups,
    reportSections,
    artifacts,
    agentTasks,
    audit
  };
}

export function createCase(db, input, actorId = "user-appraiser") {
  const normalized = normalizeCaseInput(input);
  const now = new Date().toISOString();
  const engagementId = randomUUID();
  const caseId = randomUUID();

  db.exec("BEGIN IMMEDIATE");
  try {
    const sequence = db.prepare(`
      INSERT INTO sequences (name, value) VALUES ('case', 1)
      ON CONFLICT(name) DO UPDATE SET value = value + 1
      RETURNING value
    `).get().value;
    const caseNumber = `AR-${new Date().getFullYear()}-${String(sequence).padStart(4, "0")}`;

    db.prepare(`
      INSERT INTO engagements (
        id, organization_id, customer_name, purpose, value_type,
        valuation_date, deadline, terms_json, status, created_at, updated_at
      ) VALUES (?, 'org-default', ?, ?, ?, ?, ?, ?, 'draft', ?, ?)
    `).run(
      engagementId,
      normalized.customerName,
      normalized.purpose,
      normalized.valueType,
      normalized.valuationDate,
      normalized.deadline,
      JSON.stringify(normalized.terms),
      now,
      now
    );

    db.prepare(`
      INSERT INTO valuation_cases (
        id, case_number, organization_id, engagement_id, title, case_mode,
        release_strategy, status, appraiser_id, reviewer_id, created_at, updated_at
      ) VALUES (?, ?, 'org-default', ?, ?, ?, ?, 'draft', ?, ?, ?, ?)
    `).run(
      caseId,
      caseNumber,
      engagementId,
      normalized.title,
      normalized.caseMode,
      normalized.releaseStrategy,
      normalized.appraiserId,
      normalized.reviewerId,
      now,
      now
    );

    const insertGroup = db.prepare(`
      INSERT INTO asset_groups (
        id, case_id, sequence_number, direction_code, object_type_code,
        workflow_profile_id, title, status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 'draft', ?, ?)
    `);
    normalized.assetGroups.forEach((group, index) => {
      insertGroup.run(
        randomUUID(),
        caseId,
        index + 1,
        group.directionCode,
        group.objectTypeCode,
        `${group.directionCode}:1`,
        group.title,
        now,
        now
      );
    });

    ensureReportSections(db, caseId, actorId, now);

    appendAudit(db, {
      caseId,
      actorId,
      eventType: "case.created",
      entityType: "valuation_case",
      entityId: caseId,
      payload: {
        caseNumber,
        caseMode: normalized.caseMode,
        releaseStrategy: normalized.releaseStrategy,
        assetGroupCount: normalized.assetGroups.length
      },
      now
    });
    db.exec("COMMIT");
    return getCase(db, caseId);
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

export function changeCaseStatus(db, id, nextStatus, actorId = "user-appraiser") {
  const current = db.prepare("SELECT status FROM valuation_cases WHERE id = ?").get(id);
  if (!current) return null;
  if (!caseStatuses[nextStatus]) throw new ValidationError("Неизвестный статус дела");
  if (!allowedTransitions[current.status].includes(nextStatus)) {
    throw new ValidationError(`Переход из статуса «${caseStatuses[current.status]}» в «${caseStatuses[nextStatus]}» недопустим`);
  }

  const now = new Date().toISOString();
  db.exec("BEGIN IMMEDIATE");
  try {
    db.prepare("UPDATE valuation_cases SET status = ?, updated_at = ? WHERE id = ?")
      .run(nextStatus, now, id);
    appendAudit(db, {
      caseId: id,
      actorId,
      eventType: "case.status_changed",
      entityType: "valuation_case",
      entityId: id,
      payload: { previousStatus: current.status, nextStatus },
      now
    });
    db.exec("COMMIT");
    return getCase(db, id);
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

export function updateReportSection(db, caseId, sectionId, input, actorId = "user-appraiser") {
  const section = db.prepare(`
    SELECT s.*, c.status AS case_status
    FROM report_sections s
    JOIN valuation_cases c ON c.id = s.case_id
    WHERE s.id = ? AND s.case_id = ?
  `).get(sectionId, caseId);
  if (!section) return null;
  if (["issued", "archived"].includes(section.case_status)) {
    throw new ValidationError("Выпущенный или архивный отчет нельзя редактировать");
  }

  const content = String(input?.content || "").trim();
  if (!content) throw new ValidationError("Текст раздела не может быть пустым");
  if (content.length > 100_000) throw new ValidationError("Текст раздела превышает 100 000 символов");
  const changeNote = String(input?.changeNote || "Ручная корректировка оценщика").trim();
  const nextVersion = Number(section.version) + 1;
  const now = new Date().toISOString();

  db.exec("BEGIN IMMEDIATE");
  try {
    db.prepare(`
      UPDATE report_sections
      SET content = ?, origin = 'manual', status = 'draft',
          version = ?, updated_by = ?, updated_at = ?
      WHERE id = ?
    `).run(content, nextVersion, actorId, now, sectionId);
    db.prepare(`
      INSERT INTO report_section_versions (
        id, section_id, version, content, origin,
        author_id, change_note, created_at
      ) VALUES (?, ?, ?, ?, 'manual', ?, ?, ?)
    `).run(randomUUID(), sectionId, nextVersion, content, actorId, changeNote, now);
    db.prepare("UPDATE valuation_cases SET updated_at = ? WHERE id = ?").run(now, caseId);
    appendAudit(db, {
      caseId,
      actorId,
      eventType: "report_section.updated",
      entityType: "report_section",
      entityId: sectionId,
      payload: { sectionKey: section.section_key, previousVersion: section.version, nextVersion },
      now
    });
    db.exec("COMMIT");
    return getCase(db, caseId).reportSections.find(item => item.id === sectionId);
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

export function createAgentTask(db, caseId, input, actorId = "user-appraiser") {
  const valuationCase = db.prepare("SELECT id, status FROM valuation_cases WHERE id = ?").get(caseId);
  if (!valuationCase) return null;
  if (["issued", "archived"].includes(valuationCase.status)) {
    throw new ValidationError("В выпущенном или архивном деле нельзя создавать новые поручения");
  }

  const prompt = String(input?.prompt || "").trim();
  if (!prompt) throw new ValidationError("Опишите поручение для ассистента");
  if (prompt.length > 10_000) throw new ValidationError("Поручение превышает 10 000 символов");

  const id = randomUUID();
  const now = new Date().toISOString();
  db.exec("BEGIN IMMEDIATE");
  try {
    db.prepare(`
      INSERT INTO agent_tasks (
        id, case_id, prompt, status, created_by, created_at, updated_at
      ) VALUES (?, ?, ?, 'planned', ?, ?, ?)
    `).run(id, caseId, prompt, actorId, now, now);
    db.prepare("UPDATE valuation_cases SET updated_at = ? WHERE id = ?").run(now, caseId);
    appendAudit(db, {
      caseId,
      actorId,
      eventType: "agent_task.created",
      entityType: "agent_task",
      entityId: id,
      payload: { status: "planned" },
      now
    });
    db.exec("COMMIT");
    return getCase(db, caseId).agentTasks.find(task => task.id === id);
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

export function updateArtifact(db, caseId, artifactId, input, actorId = "user-appraiser") {
  const artifact = db.prepare(`
    SELECT a.*, c.status AS case_status
    FROM artifacts a
    JOIN valuation_cases c ON c.id = a.case_id
    WHERE a.id = ? AND a.case_id = ?
  `).get(artifactId, caseId);
  if (!artifact) return null;
  if (["issued", "archived"].includes(artifact.case_status)) {
    throw new ValidationError("Выпущенный или архивный проект нельзя редактировать");
  }

  const content = String(input?.content || "").trim();
  if (!content) throw new ValidationError("Содержание артефакта не может быть пустым");
  if (content.length > 100_000) throw new ValidationError("Содержание артефакта превышает 100 000 символов");
  const changeNote = String(input?.changeNote || "Ручная редакция оценщика").trim();
  const nextVersion = Number(artifact.version) + 1;
  const now = new Date().toISOString();

  db.exec("BEGIN IMMEDIATE");
  try {
    db.prepare(`
      UPDATE artifacts
      SET content = ?, version = ?, review_status = 'proposed',
          updated_by = ?, updated_at = ?
      WHERE id = ?
    `).run(content, nextVersion, actorId, now, artifactId);
    db.prepare(`
      INSERT INTO artifact_versions (
        id, artifact_id, version, content, author_id, change_note, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(randomUUID(), artifactId, nextVersion, content, actorId, changeNote, now);
    db.prepare("UPDATE valuation_cases SET updated_at = ? WHERE id = ?").run(now, caseId);
    appendAudit(db, {
      caseId,
      actorId,
      eventType: "artifact.updated",
      entityType: "artifact",
      entityId: artifactId,
      payload: { artifactKey: artifact.artifact_key, previousVersion: artifact.version, nextVersion },
      now
    });
    db.exec("COMMIT");
    return getCase(db, caseId).artifacts.find(item => item.id === artifactId);
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

export function reviewArtifact(db, caseId, artifactId, input, actorId = "user-appraiser") {
  const artifact = db.prepare(`
    SELECT a.*, c.status AS case_status
    FROM artifacts a
    JOIN valuation_cases c ON c.id = a.case_id
    WHERE a.id = ? AND a.case_id = ?
  `).get(artifactId, caseId);
  if (!artifact) return null;
  if (["issued", "archived"].includes(artifact.case_status)) {
    throw new ValidationError("Выпущенный или архивный проект нельзя изменять");
  }

  const status = String(input?.status || "");
  if (!["accepted", "rejected", "revision"].includes(status)) {
    throw new ValidationError("Неизвестное решение по артефакту");
  }
  const comment = String(input?.comment || "").trim();
  if (status !== "accepted" && !comment) {
    throw new ValidationError("Для возврата или отклонения укажите комментарий");
  }

  const reviewId = randomUUID();
  const now = new Date().toISOString();
  db.exec("BEGIN IMMEDIATE");
  try {
    db.prepare("UPDATE artifacts SET review_status = ?, updated_at = ? WHERE id = ?")
      .run(status, now, artifactId);
    db.prepare(`
      INSERT INTO artifact_reviews (
        id, artifact_id, status, comment, reviewer_id, created_at
      ) VALUES (?, ?, ?, ?, ?, ?)
    `).run(reviewId, artifactId, status, comment, actorId, now);
    db.prepare("UPDATE valuation_cases SET updated_at = ? WHERE id = ?").run(now, caseId);
    appendAudit(db, {
      caseId,
      actorId,
      eventType: "artifact.reviewed",
      entityType: "artifact",
      entityId: artifactId,
      payload: { artifactKey: artifact.artifact_key, status },
      now
    });
    db.exec("COMMIT");
    return getCase(db, caseId).artifacts.find(item => item.id === artifactId);
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

export function createTrainingPilot(db, actorId = "user-appraiser") {
  const title = "[Учебный пилот] Квартира в Ташкенте";
  const existing = db.prepare("SELECT id FROM valuation_cases WHERE title = ? ORDER BY created_at LIMIT 1").get(title);
  if (existing) {
    initializeTrainingPilotWorkspace(db, existing.id, actorId);
    return getCase(db, existing.id);
  }

  const today = new Date().toISOString().slice(0, 10);
  const created = createCase(db, {
    title,
    customerName: "Учебный заказчик (вымышленные данные)",
    purpose: "Тестирование рабочего процесса оценки",
    valueType: "Рыночная стоимость",
    valuationDate: today,
    appraiserId: actorId,
    reviewerId: "user-reviewer",
    caseMode: "single",
    releaseStrategy: "unified",
    notes: "Учебный объект. Не использовать для реального заключения.",
    assetGroups: [
      { directionCode: "real_estate", objectTypeCode: "apartment", title: "Учебная квартира" }
    ]
  }, actorId);

  initializeTrainingPilotWorkspace(db, created.id, actorId);
  createAgentTask(db, created.id, {
    prompt: "Подготовить рабочий план оценки учебной квартиры: определить необходимые документы, факты, вопросы, методику сравнительного подхода и структуру расчета."
  }, actorId);
  return getCase(db, created.id);
}

function normalizeCaseInput(input = {}) {
  const errors = [];
  const required = ["title", "customerName", "purpose", "valueType", "valuationDate", "appraiserId"];
  for (const field of required) {
    if (!String(input[field] || "").trim()) errors.push(`Поле ${field} обязательно`);
  }

  const caseMode = input.caseMode === "composite" ? "composite" : "single";
  const assetGroups = Array.isArray(input.assetGroups) ? input.assetGroups : [];
  if (caseMode === "single" && assetGroups.length !== 1) {
    errors.push("Обычное дело должно содержать одну группу объектов");
  }
  if (caseMode === "composite" && assetGroups.length < 2) {
    errors.push("Составное дело должно содержать минимум две группы объектов");
  }

  const normalizedGroups = assetGroups.map((group, index) => {
    const direction = getDirection(group.directionCode);
    const objectType = getObjectType(group.directionCode, group.objectTypeCode);
    if (!direction) errors.push(`Группа ${index + 1}: неизвестное направление`);
    if (!objectType) errors.push(`Группа ${index + 1}: неизвестный тип объекта`);
    return {
      directionCode: group.directionCode,
      objectTypeCode: group.objectTypeCode,
      title: String(group.title || objectType?.[1] || `Группа ${index + 1}`).trim()
    };
  });

  const releaseStrategy = input.releaseStrategy === "separate" ? "separate" : "unified";
  if (errors.length) throw new ValidationError("Не удалось создать оценочное дело", errors);

  return {
    title: String(input.title).trim(),
    customerName: String(input.customerName).trim(),
    purpose: String(input.purpose).trim(),
    valueType: String(input.valueType).trim(),
    valuationDate: input.valuationDate,
    deadline: input.deadline || null,
    appraiserId: input.appraiserId,
    reviewerId: input.reviewerId || null,
    caseMode,
    releaseStrategy,
    assetGroups: normalizedGroups,
    terms: {
      reportFormat: input.reportFormat || "DOCX и PDF",
      copies: Number(input.copies || 1),
      notes: String(input.notes || "").trim()
    }
  };
}

function appendAudit(db, { caseId, actorId, eventType, entityType, entityId, payload, now }) {
  db.prepare(`
    INSERT INTO audit_events (
      organization_id, case_id, actor_id, event_type,
      entity_type, entity_id, payload_json, created_at
    ) VALUES ('org-default', ?, ?, ?, ?, ?, ?, ?)
  `).run(caseId, actorId, eventType, entityType, entityId, JSON.stringify(payload), now);
}

function ensureReportSections(db, caseId, actorId = "user-appraiser", timestamp = new Date().toISOString()) {
  const existingCount = Number(
    db.prepare("SELECT COUNT(*) AS count FROM report_sections WHERE case_id = ?").get(caseId)?.count || 0
  );
  if (existingCount) return;

  const groups = db.prepare(`
    SELECT id, sequence_number AS sequenceNumber, title, direction_code AS directionCode
    FROM asset_groups
    WHERE case_id = ?
    ORDER BY sequence_number
  `).all(caseId);
  if (!groups.length) return;

  const definitions = [
    ...defaultReportSections.filter(section => !["conclusion", "appendices"].includes(section.key)),
    ...groups.map((group, index) => ({
      key: `asset_group:${group.id}`,
      number: `5.${index + 1}`,
      title: `${group.title}: описание, анализ и расчеты`,
      origin: "manual",
      assetGroupId: group.id,
      content: `Подготовьте описание группы «${group.title}», укажите использованные документы и источники, обоснуйте выбор подходов, изложите расчеты и результат.`
    })),
    ...defaultReportSections.filter(section => ["conclusion", "appendices"].includes(section.key))
  ];

  const insertSection = db.prepare(`
    INSERT OR IGNORE INTO report_sections (
      id, case_id, asset_group_id, section_key, sequence_number,
      section_number, title, content, origin, status, version,
      updated_by, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'draft', 1, ?, ?, ?)
  `);
  const insertVersion = db.prepare(`
    INSERT OR IGNORE INTO report_section_versions (
      id, section_id, version, content, origin,
      author_id, change_note, created_at
    ) VALUES (?, ?, 1, ?, ?, ?, 'Создание раздела из структуры отчета', ?)
  `);

  definitions.forEach((definition, index) => {
    const sectionId = randomUUID();
    const result = insertSection.run(
      sectionId,
      caseId,
      definition.assetGroupId || null,
      definition.key,
      index + 1,
      definition.number,
      definition.title,
      definition.content,
      definition.origin,
      actorId,
      timestamp,
      timestamp
    );
    if (Number(result.changes)) {
      insertVersion.run(
        randomUUID(),
        sectionId,
        definition.content,
        definition.origin,
        actorId,
        timestamp
      );
    }
  });
}

function initializeTrainingPilotWorkspace(db, caseId, actorId = "user-appraiser", timestamp = new Date().toISOString()) {
  const existingCount = Number(
    db.prepare("SELECT COUNT(*) AS count FROM artifacts WHERE case_id = ?").get(caseId)?.count || 0
  );
  if (existingCount) return;

  const insertArtifact = db.prepare(`
    INSERT OR IGNORE INTO artifacts (
      id, case_id, artifact_key, artifact_type, title, description,
      content, version, review_status, updated_by, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, 1, 'proposed', ?, ?, ?)
  `);
  const insertVersion = db.prepare(`
    INSERT OR IGNORE INTO artifact_versions (
      id, artifact_id, version, content, author_id, change_note, created_at
    ) VALUES (?, ?, 1, ?, ?, 'Стартовая структура учебного проекта', ?)
  `);

  for (const definition of trainingPilotArtifacts) {
    const artifactId = randomUUID();
    const result = insertArtifact.run(
      artifactId,
      caseId,
      definition.key,
      definition.type,
      definition.title,
      definition.description,
      definition.content,
      actorId,
      timestamp,
      timestamp
    );
    if (Number(result.changes)) {
      insertVersion.run(randomUUID(), artifactId, definition.content, actorId, timestamp);
    }
  }
}
