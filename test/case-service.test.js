import assert from "node:assert/strict";
import { afterEach, beforeEach, test } from "node:test";
import {
  changeCaseStatus,
  createAgentTask,
  createCase,
  createTrainingPilot,
  getCase,
  getMetadata,
  listCases,
  reviewArtifact,
  updateArtifact,
  updateReportSection,
  ValidationError
} from "../src/case-service.js";
import { openDatabase } from "../src/db.js";

const DIRECTOR = "user-director";
const APPRAISER = "user-appraiser";
const ASSISTANT = "user-assistant";

let db;

beforeEach(() => {
  db = openDatabase(":memory:");
});

afterEach(() => {
  db.close();
});

test("seeds the target business roles only", () => {
  const roles = getMetadata(db).users.map(user => user.role).sort();
  assert.deepEqual(roles, ["appraiser", "assistant_appraiser", "director"]);
  assert(!roles.includes("administrator"));
  assert(!roles.includes("reviewer"));
  assert(!roles.includes("methodologist"));
});

test("requires explicit actor identity for write actions", () => {
  assert.throws(
    () => createCase(db, sampleInput()),
    error => error instanceof ValidationError
  );
});

test("creates a single-profile valuation case with appraiser audit history", () => {
  const created = createCase(db, sampleInput(), APPRAISER);
  assert.match(created.caseNumber, /^AR-\d{4}-0001$/);
  assert.equal(created.caseMode, "single");
  assert.equal(created.assetGroups.length, 1);
  assert.equal(created.assetGroups[0].directionCode, "real_estate");
  assert.equal(created.reportSections.length, 7);
  assert.equal(created.audit[0].eventType, "case.created");
  assert.equal(created.audit[0].actorRole, "appraiser");
  assert.equal(listCases(db).length, 1);
});

test("creates a composite case with independent workflow profiles", () => {
  const created = createCase(db, {
    ...sampleInput(),
    title: "Composite industrial property",
    caseMode: "composite",
    assetGroups: [
      { directionCode: "real_estate", objectTypeCode: "property_complex", title: "Real estate" },
      { directionCode: "equipment", objectTypeCode: "equipment_group", title: "Equipment" },
      { directionCode: "special_machinery", objectTypeCode: "machinery_fleet", title: "Special machinery" }
    ]
  }, APPRAISER);

  assert.equal(created.assetGroups.length, 3);
  assert.deepEqual(
    created.assetGroups.map(group => group.workflowProfileId),
    ["real_estate:1", "equipment:1", "special_machinery:1"]
  );
  assert.equal(created.reportSections.filter(section => section.assetGroupId).length, 3);
});

test("rejects invalid case inputs and assistant-owned appraisal responsibility", () => {
  assert.throws(
    () => createCase(db, { ...sampleInput(), caseMode: "composite" }, APPRAISER),
    error => error instanceof ValidationError && error.details.length > 0
  );
  assert.throws(
    () => createCase(db, { ...sampleInput(), appraiserId: ASSISTANT }, APPRAISER),
    error => error instanceof ValidationError
  );
  assert.throws(
    () => createCase(db, sampleInput(), ASSISTANT),
    error => error instanceof ValidationError
  );
});

test("allows assistant preparation status changes but blocks final approval", () => {
  const created = createCase(db, sampleInput(), APPRAISER);
  const started = changeCaseStatus(db, created.id, "in_progress", ASSISTANT);
  assert.equal(started.status, "in_progress");
  assert.equal(started.audit[0].eventType, "case.status_changed");
  assert.equal(started.audit[0].actorRole, "assistant_appraiser");

  const submitted = changeCaseStatus(db, created.id, "in_review", APPRAISER);
  assert.equal(submitted.status, "in_review");
  assert.throws(
    () => changeCaseStatus(db, created.id, "approved", ASSISTANT),
    error => error instanceof ValidationError
  );
  assert.equal(getCase(db, created.id).status, "in_review");
});

test("records director final approval as director in the audit trail", () => {
  const created = createCase(db, { ...sampleInput(), appraiserId: DIRECTOR, reviewerId: APPRAISER }, DIRECTOR);
  changeCaseStatus(db, created.id, "in_progress", APPRAISER);
  changeCaseStatus(db, created.id, "in_review", APPRAISER);
  const approved = changeCaseStatus(db, created.id, "approved", DIRECTOR);

  assert.equal(approved.status, "approved");
  assert.equal(approved.audit[0].eventType, "case.status_changed");
  assert.equal(approved.audit[0].actorRole, "director");
});

test("saves assistant-prepared report-section versions and audit events", () => {
  const created = createCase(db, sampleInput(), APPRAISER);
  const section = created.reportSections.find(item => item.sectionKey === "summary");
  const updated = updateReportSection(db, created.id, section.id, {
    content: "Object: apartment. Purpose: collateral valuation.",
    changeNote: "Assistant prepared basic facts"
  }, ASSISTANT);

  assert.equal(updated.version, 2);
  assert.equal(updated.origin, "manual");
  const reloaded = getCase(db, created.id);
  assert.equal(reloaded.reportSections.find(item => item.id === section.id).content, updated.content);
  assert.equal(reloaded.audit[0].eventType, "report_section.updated");
  assert.equal(reloaded.audit[0].actorRole, "assistant_appraiser");
});

test("keeps artifact preparation separate from appraiser or director acceptance", () => {
  const created = createTrainingPilot(db, APPRAISER);
  assert.equal(created.assetGroups[0].objectTypeCode, "apartment");
  assert.equal(created.artifacts.length, 8);
  assert.equal(created.agentTasks.length, 1);

  const facts = created.artifacts.find(item => item.artifactType === "facts");
  const updated = updateArtifact(db, created.id, facts.id, {
    content: "Apartment area: 72.4 sq. m. Source document still requires appraiser confirmation.",
    changeNote: "Assistant added a working characteristic"
  }, ASSISTANT);
  assert.equal(updated.version, 2);
  assert.equal(updated.reviewStatus, "proposed");
  assert.equal(getCase(db, created.id).audit[0].actorRole, "assistant_appraiser");

  assert.throws(
    () => reviewArtifact(db, created.id, facts.id, { status: "accepted", comment: "" }, ASSISTANT),
    error => error instanceof ValidationError
  );

  const accepted = reviewArtifact(db, created.id, facts.id, {
    status: "accepted",
    comment: "Accepted for the training scenario"
  }, DIRECTOR);
  assert.equal(accepted.reviewStatus, "accepted");
  assert.equal(getCase(db, created.id).audit[0].actorRole, "director");
});

test("records assistant assignments with the actual actor", () => {
  const created = createCase(db, sampleInput(), APPRAISER);
  const task = createAgentTask(db, created.id, {
    prompt: "Prepare the document list for apartment valuation."
  }, ASSISTANT);
  assert.equal(task.status, "planned");
  assert.match(task.prompt, /document list/);
  const reloaded = getCase(db, created.id);
  assert.equal(reloaded.audit[0].eventType, "agent_task.created");
  assert.equal(reloaded.audit[0].actorRole, "assistant_appraiser");
});

function sampleInput() {
  return {
    title: "Apartment, Shota Rustaveli street, 53",
    customerName: "ORIENT FINANCE LLC",
    purpose: "Collateral valuation",
    valueType: "Market value",
    valuationDate: "2026-06-12",
    deadline: "2026-06-18",
    appraiserId: APPRAISER,
    reviewerId: DIRECTOR,
    caseMode: "single",
    releaseStrategy: "unified",
    assetGroups: [
      { directionCode: "real_estate", objectTypeCode: "apartment", title: "Apartment" }
    ]
  };
}
