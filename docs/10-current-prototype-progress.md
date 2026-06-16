# Current Prototype Progress

## Repository State

- Current base branch: `chore/repository-foundation`.
- Latest verified local base at the time of this report:
  `a99b7a4 Merge pull request #7 from sherinfo1-gif/prototype/manual-edit-version-rollback-demo`.
- Working tree status before this documentation update: clean.
- This report is documentation-only and does not modify prototype or
  application logic.

Verification commands run before creating this report:

```powershell
git status
git branch --show-current
git log --oneline -10
```

Observed branch and recent history:

```text
chore/repository-foundation
a99b7a4 Merge pull request #7 from sherinfo1-gif/prototype/manual-edit-version-rollback-demo
d253458 Merge pull request #6 from sherinfo1-gif/prototype/case-workspace-ai-assistant-panel
9949d06 prototype: add manual edit version rollback demo
c6e4351 prototype: add case workspace assistant panel
7a7e7e2 Merge pull request #5 from sherinfo1-gif/docs/update-current-state-after-prototype
68fb8c2 docs: update current project state
30f5db0 Merge pull request #4 from sherinfo1-gif/prototype/initial-appraiser-workflow
3b72d6a prototype: add initial appraiser workflow
a7452ba Merge pull request #3 from sherinfo1-gif/fix/isolate-pilot-artifacts-from-normal-cases
2b1dfcf fix: isolate pilot artifacts from normal cases
```

## Completed Prototype PRs

- PR #4: initial clickable appraiser workflow.
- PR #6: Case Workspace with static AI Assistant demo panel.
- PR #7: manual edit, version history, and rollback demo for Object
  Description.

PR #5 was a documentation update that recorded the current project state after
the identity/roles, pilot isolation, and first prototype workflow increments.

## Current Clickable Prototype Capabilities

The prototype now demonstrates an appraiser working inside one demo valuation
case, `APT-026`.

The clickable path includes:

1. Open dashboard or case list.
2. Open the active apartment valuation case.
3. Review case workspace information.
4. Review static materials summary.
5. Review report section structure.
6. Select Object Description.
7. Review AI Assistant demo output.
8. Reveal sources.
9. Accept, edit, regenerate, or reject the draft.
10. Save a manual version and rollback to the AI draft.

All data is static demo data inside the prototype layer.

## Case Workspace Features

The Case Workspace for `APT-026` currently shows:

- case code and apartment object context;
- purpose: collateral / bank valuation;
- status: in progress;
- appraiser-facing case metadata;
- static document and materials summary;
- report section list;
- selected Object Description section;
- current section status.

## AI Assistant Demo Panel

The right-side AI Assistant demo panel shows:

- short chat-style assistant message;
- what the assistant prepared;
- sources used;
- what could not be determined;
- confidence/risk indicator;
- quick actions:
  - Accept draft;
  - Edit manually;
  - Regenerate;
  - Reject;
  - Show sources.

These actions update only prototype UI state. They do not call an API and do
not run real AI.

## Manual Edit And Version/Rollback Flow

The Object Description section now includes a static manual-edit flow:

- `Edit manually` opens a prefilled textarea with the current draft.
- `Save as new version` marks the appraiser-edited version as active.
- Version history shows:
  - Version 1: AI draft;
  - Version 2: Appraiser edited version.
- The active version is visibly marked.
- `Rollback to AI draft` restores Version 1 and shows a rollback status
  message.

This validates the intended workflow concept: AI output is a proposal, the
appraiser remains responsible for the report text, and previous versions remain
visible in the workflow.

## Files And Layers Affected So Far

Recent prototype work has affected:

- `prototype/app.js`;
- `prototype/styles.css`;
- `docs/03-prototype-map.md`;
- `CHANGELOG.md`.

The application/foundation layer remains separate from prototype work:

- no `src/` changes from the recent prototype increments;
- no `public/` changes;
- no `test/` changes;
- no `data/` changes;
- no package-file changes.

## Intentionally Not Implemented Yet

The current prototype intentionally does not include:

- real AI agent;
- OCR;
- real document processing;
- DOCX/PDF/XLSX generation;
- local connector;
- backend AI integration;
- production file storage architecture;
- database-backed version history;
- authentication or authorization changes;
- calculation logic;
- release snapshots.

These items remain deferred until a separate architecture task defines the
right production boundaries.

## Recommended Next Steps

Small prototype tasks that can be done next:

1. Sources detail view: expand `Show sources` into a clearer source detail
   screen or panel for each cited material.
2. AI finding linked to report section: connect a helper finding directly to
   the Object Description or another report section in the prototype.
3. Readiness summary: add a simple case readiness panel that summarizes
   accepted sections, open findings, rejected drafts, and manual edits.
4. Approaches and Methods draft demo: add a static assistant draft flow for the
   report section that explains selected approaches and methods.
5. Later: design the real AI agent architecture, including anonymization,
   provider boundaries, audit trail, source attribution, and appraiser
   acceptance rules.

The next development task should remain small and prototype-only unless a
separate backend architecture task is explicitly opened.
