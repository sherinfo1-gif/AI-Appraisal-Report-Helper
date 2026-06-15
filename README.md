# AI Report Helper

AI Report Helper is a local-first internal web product for an appraisal
company. It manages valuation cases and is being expanded toward calculations,
report generation, methodology, review, and document archives.

The repository contains a production-oriented platform foundation, a
clickable discovery prototype, and product-design documents. The supplied
report and workbook are examples of the existing process, not approved
calculation standards.

## Repository Status

The project is in controlled discovery and foundation development. Nothing in
this repository should be treated as a certified valuation methodology or a
production release process.

The main boundaries are:

- `prototype/` is a static discovery artifact and must remain independent from
  production-oriented modules;
- `src/`, `public/`, and `test/` are an experimental foundation for future
  production development;
- `docs/` records architecture and product decisions;
- `data/` contains local runtime state and is excluded from Git.

See [Repository structure](docs/00-repository-structure.md) and
[Agent instructions](AGENTS.md).

## Repository Layout

| Path | Purpose |
| --- | --- |
| `prototype/` | Static clickable prototype; illustrative data only |
| `docs/` | Architecture, source audit, domain model, and roadmap |
| `src/` | Experimental domain services and local HTTP API |
| `public/` | Browser client for the experimental foundation |
| `test/` | Automated tests for foundation behavior |
| `data/` | Local runtime data; never committed |
| `Нормативные документы/` | Supplied discovery references |
| `Примеры отчетов и рассчетов/` | Supplied report/workbook examples |

## Source Materials

Source reports, calculation workbooks, and regulatory PDFs are stored locally
for discovery and are not committed to GitHub. The expected local directories
are:

- `Примеры отчетов и рассчетов/`;
- `Нормативные документы/`.

These directories are excluded by `.gitignore`. Do not add real customer
materials to the repository.

## Design Documents

- [ChatGPT development master prompt](CHATGPT_MASTER_PROMPT_RU.md)
- [Repository structure](docs/00-repository-structure.md)
- [Source audit](docs/01-source-audit.md)
- [Domain model](docs/02-domain-model.md)
- [Clickable prototype map](docs/03-prototype-map.md)
- [Implementation roadmap](docs/04-implementation-roadmap.md)
- [Report composer and calculations](docs/05-report-composer-and-calculations.md)
- [Valuation directions and workflow profiles](docs/06-valuation-directions-and-workflows.md)
- [Assignment and contract generation](docs/07-engagement-documents.md)
- [Composite valuation cases](docs/08-composite-valuation-cases.md)
- [Production foundation](docs/09-production-foundation.md)

## Working Application

Requirements: Node.js 24 or newer.

```powershell
node src/server.js
```

Open `http://127.0.0.1:4173/`.

Run automated tests:

```powershell
node --test
```

The working application currently provides:

- local SQLite persistence;
- six versioned valuation-direction profiles;
- normal and composite valuation cases;
- independent asset groups;
- unified or separate release strategy;
- controlled case lifecycle;
- append-only audit history;
- dashboard, case register, creation flow, and case detail;
- a training apartment pilot with assignments, artifacts, versions, and
  independent appraiser decisions.

## Discovery Prototype

Open `prototype/index.html` directly or serve the workspace locally:

```powershell
python -m http.server 4180 --bind 127.0.0.1
```

Then open `http://127.0.0.1:4180/prototype/`.

The prototype demonstrates the intended visual language and navigation:

- dashboard and report register;
- valuation direction selection with separate profiles for motor vehicles and
  special machinery;
- composite valuation cases with several asset groups and unified report
  assembly;
- a 12-stage apartment valuation workflow;
- document/OCR confirmation, comparables, adjustments, compliance, review, and issue stages;
- switchable AI assistant and A4 report preview;
- a complex bank-property case with components, three approaches, and an ONLYOFFICE calculation concept;
- archive, templates, methodology, reference data, and settings entry points.

All values, checks, report text, and formulas shown in the prototype are
illustrative. They are not approved valuation methodology.

## Development Workflow

- Create a feature branch; do not push changes directly to `main`.
- Read `AGENTS.md` and the relevant architecture document before editing.
- Keep prototype and production-oriented changes separate.
- Never commit secrets, local databases, generated releases, or real customer
  materials.
- Record material changes under `Unreleased` in `CHANGELOG.md`.

## Current Status

Discovery and prototype definition are complete for the supplied source set.
The first platform-foundation increment is operational. Approved valuation
formulas and production document generators have not been implemented yet.
