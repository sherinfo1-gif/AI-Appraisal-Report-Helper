# Changelog

All notable changes to AI Report Helper are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
The project does not yet have a stable public release.

## [Unreleased]

### Added

- Repository-wide Codex instructions in `AGENTS.md`.
- Explicit repository structure and prototype/production boundary documentation.
- Minimal foundation identity model with director, appraiser, and assistant
  appraiser roles.
- Explicit actor identity handling for audited foundation write actions.
- Initial clickable appraiser workflow in the static prototype, including case
  overview, materials, report sections, helper findings, finding decisions, and
  status summary.
- Static Case Workspace AI Assistant demo panel for an appraiser reviewing the
  Object Description section in one prototype valuation case.

### Changed

- Expanded the root README with repository status, layout, safety boundaries,
  and contribution workflow.
- Expanded `.gitignore` for dependencies, build output, local runtime data,
  editor files, logs, caches, and secrets.
- Kept source reports, calculation workbooks, and regulatory PDFs local and
  excluded them from the public repository.
- Limited final artifact acceptance and final case approval to appraisers and
  directors while keeping assistant appraiser preparation available.
- Separated training-pilot artifact initialization from ordinary valuation
  cases and kept case reads free of pilot data creation.
- Documented the current post-PR #4 state and the next recommended prototype
  task for director review and escalation.
