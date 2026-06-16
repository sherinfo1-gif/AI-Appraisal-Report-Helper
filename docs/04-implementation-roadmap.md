# Implementation Roadmap

## Delivery Principles

- Prioritize practical appraisal work over CRM-style status management.
- Treat case tracking as supporting infrastructure for data, calculations, and report composition.
- Approve interaction design before production implementation.
- Treat current files as discovery examples, not canonical formulas.
- Introduce formulas only after methodologist approval and golden-case tests.
- Preserve traceability from every report value to its source or calculation.
- Keep all identifying data on company infrastructure.

## Current State After PR #4

The current foundation and prototype state includes:

- minimal identity and role alignment in the application foundation for
  director, appraiser, and assistant appraiser;
- explicit local actor identity for audited foundation write actions, without
  login, sessions, OAuth, or full user management;
- role checks that keep assistant appraiser work preparatory while appraisers
  and directors retain final approval authority;
- training-pilot artifact isolation so normal case creation and case reads do
  not create pilot or demo artifacts;
- an explicit training pilot flow for fictional apartment data through
  `POST /api/pilots/real-estate`;
- an initial clickable appraiser workflow in the static prototype, covering
  case overview, materials, report sections, helper findings, finding detail,
  appraiser decisions, and status summary.

The recommended next task is to continue prototype work with the director
review and escalation workflow. Do not start backend implementation of
AI, OCR, DOCX/PDF/XLSX generation, calculations, release snapshots, or
external provider integration yet.

## Phase 0: Discovery Baseline

Deliverables:

- source audit;
- domain model;
- prototype screen map;
- initial regulatory traceability matrix;
- list of methodology questions and observed inconsistencies.

Exit condition: the supplied materials are mapped without modifying them.

## Phase 1: Clickable Prototype

Deliverables:

- design tokens and basic product identity;
- dashboard and persistent navigation;
- initial appraiser workflow from case list through helper finding decisions
  and status summary;
- director review and escalation workflow for findings escalated by an
  appraiser;
- complete apartment flow;
- complex-property component, calculation, XLSX, and reconciliation screens;
- report template outline and manually editable section composer;
- AI and A4 preview panel states;
- reviewer and DOCX/PDF/XLSX release flow with QR state.

Exit condition: stakeholders complete the prototype review script and approve
the terminology, sequence, and layout.

Current next step: extend the prototype with the director review path for an
escalated finding before adding more backend behavior.

## Phase 2: Platform Foundation

Deliverables:

- fixed business roles and explicit local actor identity;
- valuation-case lifecycle;
- valuation directions, object types, and immutable workflow profiles;
- structured engagement record and versioned assignment/contract templates;
- component model;
- composite cases with independent asset groups and selectable release strategy;
- local document storage;
- append-only audit log;
- training-pilot data isolated from ordinary cases;
- background task processing;
- encrypted backup and restore procedure.

Exit condition: a case and its files survive backup/restore with intact
permissions and audit history.

The platform foundation must expose an appraiser workbench early. Lifecycle
and dashboard features must not become the primary product surface.

## Phase 3: Apartment Pilot

Deliverables:

- assignment, property, inspection, evidence, and comparable modules;
- assignment/TZ and valuation-services contract generation from shared fields;
- native sales-comparison calculation;
- structured report composer with section versions and protected manual edits;
- DOCX template mapping and immutable template versions;
- XLSX export for native calculations;
- map and official exchange-rate integrations;
- DOCX template engine, PDF export, A4 preview, and QR verification;
- reviewer comments and immutable release snapshots.

Exit condition: one approved reference apartment report is generated without
manual document assembly.

## Phase 4: Methodology, OCR, and AI

Deliverables:

- versioned methodology articles and document indexing;
- blocking and warning compliance rules;
- local OCR with human confirmation;
- OpenAI and local OpenAI-compatible provider adapters;
- anonymization gateway;
- cited AI proposals with explicit accept/edit/reject actions.

Exit condition: no identifying data is sent externally and every accepted AI
paragraph retains its provenance.

## Phase 5: Complex Property, Mixed Assets, and XLSX

Deliverables:

- multiple land/building components;
- mixed real-estate, equipment, motor-vehicle, and special-machinery groups;
- unified report assembly with independent chapters and a consolidated result;
- optional separate report release from the same shared case;
- land, rent, income, cost, depreciation, rate, and reconciliation modules;
- self-hosted ONLYOFFICE integration;
- versioned XLSX workbooks and named input/output bindings;
- report tables generated from mapped workbook ranges.

Exit condition: the supplied complex-property structure can be represented in
one case and its calculation package can be reproduced.

## Phase 6: Pilot Operation

Deliverables:

- production-like deployment on the company server;
- monitoring, backup checks, user training, and support procedure;
- five real apartment reports processed from creation through archive;
- defect and methodology review log.

Exit condition: five reports are issued without manual report reconstruction,
with successful reviewer workflow and archive verification.

## Deferred Until After Pilot

- electronic digital signature integration;
- Uzbek interface and report templates;
- offline inspection;
- structured migration of the historical archive;
- equipment, motor-vehicle, and special-machinery workflow implementation;
- business valuation workflow and financial-model modules;
- intangible-asset workflow and specialized income methods;
- dedicated GPU server and production local AI model.
