import assert from "node:assert/strict";
import { afterEach, beforeEach, test } from "node:test";
import {
  changeCaseStatus,
  createAgentTask,
  createCase,
  createTrainingPilot,
  getCase,
  listCases,
  reviewArtifact,
  updateArtifact,
  updateReportSection,
  ValidationError
} from "../src/case-service.js";
import { openDatabase } from "../src/db.js";

let db;

beforeEach(() => {
  db = openDatabase(":memory:");
});

afterEach(() => {
  db.close();
});

test("creates a single-profile valuation case with audit history", () => {
  const created = createCase(db, sampleInput());
  assert.match(created.caseNumber, /^AR-\d{4}-0001$/);
  assert.equal(created.caseMode, "single");
  assert.equal(created.assetGroups.length, 1);
  assert.equal(created.assetGroups[0].directionCode, "real_estate");
  assert.equal(created.reportSections.length, 7);
  assert.equal(created.audit[0].eventType, "case.created");
  assert.equal(listCases(db).length, 1);
});

test("creates a composite case with independent workflow profiles", () => {
  const created = createCase(db, {
    ...sampleInput(),
    title: "Производственный имущественный комплекс",
    caseMode: "composite",
    assetGroups: [
      { directionCode: "real_estate", objectTypeCode: "property_complex", title: "Недвижимость" },
      { directionCode: "equipment", objectTypeCode: "equipment_group", title: "Оборудование" },
      { directionCode: "special_machinery", objectTypeCode: "machinery_fleet", title: "Спецтехника" }
    ]
  });

  assert.equal(created.assetGroups.length, 3);
  assert.deepEqual(
    created.assetGroups.map(group => group.workflowProfileId),
    ["real_estate:1", "equipment:1", "special_machinery:1"]
  );
  assert.equal(created.reportSections.filter(section => section.assetGroupId).length, 3);
});

test("rejects an invalid composite case", () => {
  assert.throws(
    () => createCase(db, { ...sampleInput(), caseMode: "composite" }),
    error => error instanceof ValidationError && error.details.length > 0
  );
});

test("enforces status transitions and audits accepted changes", () => {
  const created = createCase(db, sampleInput());
  const started = changeCaseStatus(db, created.id, "in_progress");
  assert.equal(started.status, "in_progress");
  assert.equal(started.audit[0].eventType, "case.status_changed");
  assert.throws(() => changeCaseStatus(db, created.id, "issued"), ValidationError);
  assert.equal(getCase(db, created.id).status, "in_progress");
});

test("saves a manual report-section version and audit event", () => {
  const created = createCase(db, sampleInput());
  const section = created.reportSections.find(item => item.sectionKey === "summary");
  const updated = updateReportSection(db, created.id, section.id, {
    content: "Объект оценки: квартира. Цель оценки: залоговое обеспечение.",
    changeNote: "Заполнены основные факты"
  });

  assert.equal(updated.version, 2);
  assert.equal(updated.origin, "manual");
  const reloaded = getCase(db, created.id);
  assert.equal(reloaded.reportSections.find(item => item.id === section.id).content, updated.content);
  assert.equal(reloaded.audit[0].eventType, "report_section.updated");
});

test("creates a local pilot workspace with independently reviewed artifacts", () => {
  const created = createTrainingPilot(db);
  assert.equal(created.assetGroups[0].objectTypeCode, "apartment");
  assert.equal(created.artifacts.length, 8);
  assert.equal(created.agentTasks.length, 1);

  const facts = created.artifacts.find(item => item.artifactType === "facts");
  const updated = updateArtifact(db, created.id, facts.id, {
    content: "Площадь квартиры: 72,4 кв. м. Сведения требуют подтверждения техническим документом.",
    changeNote: "Добавлена тестовая характеристика"
  });
  assert.equal(updated.version, 2);
  assert.equal(updated.reviewStatus, "proposed");

  const accepted = reviewArtifact(db, created.id, facts.id, {
    status: "accepted",
    comment: "Принято для учебного сценария"
  });
  assert.equal(accepted.reviewStatus, "accepted");
  assert.equal(getCase(db, created.id).artifacts.filter(item => item.reviewStatus === "accepted").length, 1);
});

test("records assistant assignments without an external AI provider", () => {
  const created = createCase(db, sampleInput());
  const task = createAgentTask(db, created.id, {
    prompt: "Подготовить перечень документов для оценки квартиры."
  });
  assert.equal(task.status, "planned");
  assert.match(task.prompt, /перечень документов/);
  assert.equal(getCase(db, created.id).audit[0].eventType, "agent_task.created");
});

function sampleInput() {
  return {
    title: "Квартира, ул. Шота Руставели, 53",
    customerName: "ООО «ORIENT FINANCE»",
    purpose: "Залоговое обеспечение",
    valueType: "Рыночная стоимость",
    valuationDate: "2026-06-12",
    deadline: "2026-06-18",
    appraiserId: "user-appraiser",
    reviewerId: "user-reviewer",
    caseMode: "single",
    releaseStrategy: "unified",
    assetGroups: [
      { directionCode: "real_estate", objectTypeCode: "apartment", title: "Квартира" }
    ]
  };
}
