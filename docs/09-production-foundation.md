# Production Foundation

## Implemented Increment

The first production-oriented increment uses:

- Node.js 24;
- the built-in `node:sqlite` driver;
- SQLite stored under the local `data/` directory;
- a dependency-free HTTP and JSON API;
- a browser client implemented with native HTML, CSS, and JavaScript;
- Node's built-in test runner.

The application does not currently require internet access or a cloud
service. Customer data remains in the workspace infrastructure.

## Implemented Domain Scope

- organizations and fixed business roles: director, appraiser, and assistant
  appraiser;
- six valuation directions;
- versioned object-type definitions;
- immutable workflow-profile version 1 for every direction;
- structured engagement record;
- normal and composite valuation cases;
- independent asset groups;
- unified or separate release strategy;
- controlled case-status transitions;
- append-only audit events.
- explicit actor identity for material write actions;
- structured report sections;
- manual report-section editing with immutable versions.
- local assistant assignments without an external AI provider;
- eight independently reviewed pilot artifacts per case;
- immutable artifact versions and review decisions;
- an idempotent training pilot for one apartment.

## API

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/api/health` | Server and database health |
| `GET` | `/api/meta` | Directions, object types, statuses, users |
| `GET` | `/api/dashboard` | Dashboard counters |
| `GET` | `/api/cases` | Valuation-case register |
| `POST` | `/api/cases` | Create a normal or composite case |
| `GET` | `/api/cases/:id` | Read one case, groups, engagement, and audit |
| `PATCH` | `/api/cases/:id/status` | Perform an allowed lifecycle transition |
| `PATCH` | `/api/cases/:id/report-sections/:sectionId` | Save a new manual section version |
| `POST` | `/api/pilots/real-estate` | Create or open the training apartment pilot |
| `POST` | `/api/cases/:id/agent-tasks` | Record an assistant assignment |
| `PATCH` | `/api/cases/:id/artifacts/:artifactId` | Save a new artifact version |
| `POST` | `/api/cases/:id/artifacts/:artifactId/review` | Accept, reject, or return one artifact |

## Current Boundaries

- Authentication is not implemented yet; seeded local users represent the
  current fixed business roles. API write actions accept an explicit local
  actor identity but do not implement login, sessions, or password policy.
- Assistant appraisers can prepare working materials, but artifact acceptance
  and final case approval are limited to appraisers and directors.
- Report sections can be edited and versioned, but structured field,
  methodology, and calculation bindings are the next practical increment.
- Assistant assignments are currently performed manually with Codex and stored
  in the case. No OpenAI or Gemini provider is connected yet.
- The training pilot uses fictional apartment data and must not be treated as
  an appraisal conclusion.
- Assignment and contract records are present at the data level, but document
  template management and DOCX/PDF generation are not implemented.
- Asset-group workspaces currently expose their pinned profile but not
  direction-specific data-entry stages.
- Calculation formulas remain excluded until methodology approval.
- Backups, jobs, document uploads, and release snapshots are subsequent
  platform-foundation increments.

## Run and Test

```powershell
node src/server.js
node --test
```

The server defaults to `http://127.0.0.1:4173`.
