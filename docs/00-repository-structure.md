# Repository Structure

## Purpose

The repository intentionally keeps product discovery, architecture, and the
experimental production-oriented foundation separate. A file's location
defines how it may be used.

## Layout

| Path | Responsibility | Production status |
| --- | --- | --- |
| `prototype/` | Static clickable UI used to validate workflows and visual language | Discovery only |
| `docs/` | Architecture, domain decisions, roadmap, and source audit | Design authority |
| `src/` | Local HTTP API and domain services | Experimental foundation |
| `public/` | Browser client for the experimental foundation | Experimental foundation |
| `test/` | Automated tests for domain and service behavior | Development support |
| `data/` | Local SQLite files, uploads, logs, and future generated artifacts | Runtime only; untracked |
| `Нормативные документы/` | Supplied regulatory discovery materials | Reference input |
| `Примеры отчетов и рассчетов/` | Supplied report and calculation examples | Reference input |

## Prototype Boundary

- The prototype must run as static HTML, CSS, and JavaScript.
- Prototype data, coefficients, formulas, statuses, and generated text are
  illustrative.
- Production modules must not import files from `prototype/`.
- Prototype screens are preserved until a product-design task explicitly
  approves their replacement.

## Production-Oriented Boundary

- `src/`, `public/`, and `test/` may evolve into the deployable product.
- Current code is a foundation, not a certified appraisal system.
- Approved methodology, authentication, secure document storage, backups,
  release generation, and production deployment remain separate future work.

## Source Material Policy

Supplied documents are retained for discovery and structure analysis. They must
not be treated as approved formulas or copied into production logic without
methodologist review. New real customer materials must not be committed to the
repository.
