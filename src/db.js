import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { valuationCatalog } from "./catalog.js";

const defaultDatabasePath = resolve("data", "ai-report-helper.sqlite");

export function openDatabase(databasePath = defaultDatabasePath) {
  if (databasePath !== ":memory:") {
    mkdirSync(dirname(databasePath), { recursive: true });
  }

  const db = new DatabaseSync(databasePath);
  db.exec("PRAGMA foreign_keys = ON");
  db.exec("PRAGMA journal_mode = WAL");
  db.exec("PRAGMA synchronous = NORMAL");
  migrate(db);
  seedReferenceData(db);
  return db;
}

function migrate(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS organizations (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      organization_id TEXT NOT NULL REFERENCES organizations(id),
      full_name TEXT NOT NULL,
      role TEXT NOT NULL CHECK (role IN ('director', 'appraiser', 'assistant_appraiser')),
      active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS valuation_directions (
      code TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      icon TEXT NOT NULL,
      description TEXT NOT NULL,
      active INTEGER NOT NULL DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS object_type_definitions (
      code TEXT PRIMARY KEY,
      direction_code TEXT NOT NULL REFERENCES valuation_directions(code),
      name TEXT NOT NULL,
      version INTEGER NOT NULL,
      active INTEGER NOT NULL DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS workflow_profile_versions (
      id TEXT PRIMARY KEY,
      direction_code TEXT NOT NULL REFERENCES valuation_directions(code),
      version INTEGER NOT NULL,
      stages_json TEXT NOT NULL,
      published_at TEXT NOT NULL,
      UNIQUE(direction_code, version)
    );

    CREATE TABLE IF NOT EXISTS engagements (
      id TEXT PRIMARY KEY,
      organization_id TEXT NOT NULL REFERENCES organizations(id),
      customer_name TEXT NOT NULL,
      purpose TEXT NOT NULL,
      value_type TEXT NOT NULL,
      valuation_date TEXT NOT NULL,
      deadline TEXT,
      terms_json TEXT NOT NULL,
      status TEXT NOT NULL CHECK (status IN ('draft', 'approved', 'signed')),
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS valuation_cases (
      id TEXT PRIMARY KEY,
      case_number TEXT NOT NULL UNIQUE,
      organization_id TEXT NOT NULL REFERENCES organizations(id),
      engagement_id TEXT NOT NULL UNIQUE REFERENCES engagements(id),
      title TEXT NOT NULL,
      case_mode TEXT NOT NULL CHECK (case_mode IN ('single', 'composite')),
      release_strategy TEXT NOT NULL CHECK (release_strategy IN ('unified', 'separate')),
      status TEXT NOT NULL CHECK (status IN ('draft', 'in_progress', 'in_review', 'returned', 'approved', 'issued', 'archived')),
      appraiser_id TEXT NOT NULL REFERENCES users(id),
      reviewer_id TEXT REFERENCES users(id),
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS asset_groups (
      id TEXT PRIMARY KEY,
      case_id TEXT NOT NULL REFERENCES valuation_cases(id) ON DELETE RESTRICT,
      sequence_number INTEGER NOT NULL,
      direction_code TEXT NOT NULL REFERENCES valuation_directions(code),
      object_type_code TEXT NOT NULL REFERENCES object_type_definitions(code),
      workflow_profile_id TEXT NOT NULL REFERENCES workflow_profile_versions(id),
      title TEXT NOT NULL,
      status TEXT NOT NULL CHECK (status IN ('draft', 'in_progress', 'ready', 'approved')),
      approved_value_minor INTEGER,
      currency TEXT NOT NULL DEFAULT 'UZS',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      UNIQUE(case_id, sequence_number)
    );

    CREATE TABLE IF NOT EXISTS report_sections (
      id TEXT PRIMARY KEY,
      case_id TEXT NOT NULL REFERENCES valuation_cases(id) ON DELETE RESTRICT,
      asset_group_id TEXT REFERENCES asset_groups(id) ON DELETE RESTRICT,
      section_key TEXT NOT NULL,
      sequence_number INTEGER NOT NULL,
      section_number TEXT NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      origin TEXT NOT NULL CHECK (origin IN ('template', 'generated', 'calculated', 'manual')),
      status TEXT NOT NULL CHECK (status IN ('draft', 'ready', 'approved')),
      version INTEGER NOT NULL DEFAULT 1,
      updated_by TEXT NOT NULL REFERENCES users(id),
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      UNIQUE(case_id, section_key)
    );

    CREATE TABLE IF NOT EXISTS report_section_versions (
      id TEXT PRIMARY KEY,
      section_id TEXT NOT NULL REFERENCES report_sections(id) ON DELETE RESTRICT,
      version INTEGER NOT NULL,
      content TEXT NOT NULL,
      origin TEXT NOT NULL CHECK (origin IN ('template', 'generated', 'calculated', 'manual')),
      author_id TEXT NOT NULL REFERENCES users(id),
      change_note TEXT NOT NULL,
      created_at TEXT NOT NULL,
      UNIQUE(section_id, version)
    );

    CREATE TABLE IF NOT EXISTS agent_tasks (
      id TEXT PRIMARY KEY,
      case_id TEXT NOT NULL REFERENCES valuation_cases(id) ON DELETE RESTRICT,
      prompt TEXT NOT NULL,
      status TEXT NOT NULL CHECK (status IN ('planned', 'in_progress', 'completed', 'cancelled')),
      created_by TEXT NOT NULL REFERENCES users(id),
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS artifacts (
      id TEXT PRIMARY KEY,
      case_id TEXT NOT NULL REFERENCES valuation_cases(id) ON DELETE RESTRICT,
      artifact_key TEXT NOT NULL,
      artifact_type TEXT NOT NULL CHECK (
        artifact_type IN (
          'document_register', 'facts', 'gaps', 'assignment',
          'legal_sources', 'methodology', 'calculation', 'report'
        )
      ),
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      content TEXT NOT NULL,
      version INTEGER NOT NULL DEFAULT 1,
      review_status TEXT NOT NULL CHECK (
        review_status IN ('proposed', 'accepted', 'rejected', 'revision')
      ),
      updated_by TEXT NOT NULL REFERENCES users(id),
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      UNIQUE(case_id, artifact_key)
    );

    CREATE TABLE IF NOT EXISTS artifact_versions (
      id TEXT PRIMARY KEY,
      artifact_id TEXT NOT NULL REFERENCES artifacts(id) ON DELETE RESTRICT,
      version INTEGER NOT NULL,
      content TEXT NOT NULL,
      author_id TEXT NOT NULL REFERENCES users(id),
      change_note TEXT NOT NULL,
      created_at TEXT NOT NULL,
      UNIQUE(artifact_id, version)
    );

    CREATE TABLE IF NOT EXISTS artifact_reviews (
      id TEXT PRIMARY KEY,
      artifact_id TEXT NOT NULL REFERENCES artifacts(id) ON DELETE RESTRICT,
      status TEXT NOT NULL CHECK (status IN ('proposed', 'accepted', 'rejected', 'revision')),
      comment TEXT NOT NULL,
      reviewer_id TEXT NOT NULL REFERENCES users(id),
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS audit_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      organization_id TEXT NOT NULL REFERENCES organizations(id),
      case_id TEXT REFERENCES valuation_cases(id),
      actor_id TEXT NOT NULL REFERENCES users(id),
      event_type TEXT NOT NULL,
      entity_type TEXT NOT NULL,
      entity_id TEXT NOT NULL,
      payload_json TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sequences (
      name TEXT PRIMARY KEY,
      value INTEGER NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_cases_status ON valuation_cases(status);
    CREATE INDEX IF NOT EXISTS idx_cases_updated ON valuation_cases(updated_at DESC);
    CREATE INDEX IF NOT EXISTS idx_asset_groups_case ON asset_groups(case_id, sequence_number);
    CREATE INDEX IF NOT EXISTS idx_report_sections_case ON report_sections(case_id, sequence_number);
    CREATE INDEX IF NOT EXISTS idx_report_versions_section ON report_section_versions(section_id, version DESC);
    CREATE INDEX IF NOT EXISTS idx_agent_tasks_case ON agent_tasks(case_id, created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_artifacts_case ON artifacts(case_id, artifact_type);
    CREATE INDEX IF NOT EXISTS idx_artifact_versions_artifact ON artifact_versions(artifact_id, version DESC);
    CREATE INDEX IF NOT EXISTS idx_artifact_reviews_artifact ON artifact_reviews(artifact_id, created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_audit_case ON audit_events(case_id, id DESC);
  `);
  migrateUsersToBusinessRoles(db);
}

function migrateUsersToBusinessRoles(db) {
  const usersTable = db.prepare(`
    SELECT sql
    FROM sqlite_master
    WHERE type = 'table' AND name = 'users'
  `).get();
  if (!usersTable?.sql?.includes("'administrator'")) return;

  db.exec("PRAGMA foreign_keys = OFF");
  db.exec("BEGIN IMMEDIATE");
  try {
    db.exec(`
      CREATE TABLE users_new (
        id TEXT PRIMARY KEY,
        organization_id TEXT NOT NULL REFERENCES organizations(id),
        full_name TEXT NOT NULL,
        role TEXT NOT NULL CHECK (role IN ('director', 'appraiser', 'assistant_appraiser')),
        active INTEGER NOT NULL DEFAULT 1,
        created_at TEXT NOT NULL
      );

      INSERT INTO users_new (id, organization_id, full_name, role, active, created_at)
      SELECT
        id,
        organization_id,
        full_name,
        CASE role
          WHEN 'administrator' THEN 'director'
          WHEN 'reviewer' THEN 'director'
          WHEN 'methodologist' THEN 'assistant_appraiser'
          ELSE 'appraiser'
        END,
        active,
        created_at
      FROM users;

      DROP TABLE users;
      ALTER TABLE users_new RENAME TO users;
    `);
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  } finally {
    db.exec("PRAGMA foreign_keys = ON");
  }
}

function seedReferenceData(db) {
  const now = new Date().toISOString();
  db.prepare(`
    INSERT OR IGNORE INTO organizations (id, name, created_at)
    VALUES ('org-default', 'CONSULTING & ASSESSMENT SERVICE', ?)
  `).run(now);

  const users = [
    ["user-director", "Малика Каримова", "director"],
    ["user-appraiser", "Алексей Салиев", "appraiser"],
    ["user-assistant", "Дилшод Юсупов", "assistant_appraiser"]
  ];
  const insertUser = db.prepare(`
    INSERT OR IGNORE INTO users (id, organization_id, full_name, role, created_at)
    VALUES (?, 'org-default', ?, ?, ?)
  `);
  for (const [id, name, role] of users) insertUser.run(id, name, role, now);

  const insertDirection = db.prepare(`
    INSERT INTO valuation_directions (code, name, icon, description)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(code) DO UPDATE SET
      name = excluded.name,
      icon = excluded.icon,
      description = excluded.description
  `);
  const insertObjectType = db.prepare(`
    INSERT INTO object_type_definitions (code, direction_code, name, version)
    VALUES (?, ?, ?, 1)
    ON CONFLICT(code) DO UPDATE SET
      direction_code = excluded.direction_code,
      name = excluded.name
  `);
  const insertWorkflow = db.prepare(`
    INSERT OR IGNORE INTO workflow_profile_versions
      (id, direction_code, version, stages_json, published_at)
    VALUES (?, ?, 1, ?, ?)
  `);

  for (const direction of valuationCatalog) {
    insertDirection.run(direction.code, direction.name, direction.icon, direction.description);
    for (const [code, name] of direction.objectTypes) {
      insertObjectType.run(code, direction.code, name);
    }
    insertWorkflow.run(`${direction.code}:1`, direction.code, JSON.stringify(direction.stages), now);
  }
}
