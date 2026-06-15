# Changelog

All notable changes to AI Report Helper are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
The project does not yet have a stable public release.

## [Unreleased]

### Added

- Repository-wide Codex instructions in `AGENTS.md`.
- Explicit repository structure and prototype/production boundary documentation.
- Minimal GitHub Actions repository check for required files, Node dependency
  installation, tests, and an optional build script.
- npm lock file so CI can use reproducible `npm ci` installs.

### Changed

- Expanded the root README with repository status, layout, safety boundaries,
  and contribution workflow.
- Expanded `.gitignore` for dependencies, build output, local runtime data,
  editor files, logs, caches, and secrets.
- Kept source reports, calculation workbooks, and regulatory PDFs local and
  excluded them from the public repository.
