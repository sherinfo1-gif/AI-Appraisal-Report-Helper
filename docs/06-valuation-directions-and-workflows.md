# Valuation Directions and Workflow Profiles

## Scope Decision

The product currently has one top-level business module: `Valuation`.
Reports, calculations, methodology, review, release, and archive are
capabilities inside this module rather than separate products.

Creating a case uses a three-level classification:

1. Single-profile or composite-case mode.
2. Valuation direction.
3. Specific object type within that direction.

The first supported directions are:

- real estate;
- equipment and machinery;
- motor vehicles;
- special machinery;
- business;
- intangible assets.

More directions and object types can be added without changing the shared case
lifecycle.

## Why One Universal Wizard Is Not Suitable

All valuation cases share assignment, document storage, methodology,
traceability, report composition, review, release, and archive. The analytical
workflow is materially different by direction.

Real estate is based on rights, location, physical characteristics,
inspection, market evidence, comparables, rent, construction cost, and land.

Business valuation requires the valuation perimeter, ownership structure,
financial statements, normalization, industry analysis, forecast,
capital structure, discount rate, DCF, market multiples, net assets, and
reconciliation.

Intangible-asset valuation requires identification of the right, legal
protection, ownership, remaining useful life, commercial use, attributable
economic benefits, royalty rates, contributory assets, and specialized income
methods.

Reusing one fixed list of screens would produce irrelevant fields and weak
controls. The product therefore uses configurable workflow profiles.

## Platform Structure

```text
Valuation
├── Shared case platform
│   ├── assignment and participants
│   ├── documents and evidence
│   ├── methodology and compliance
│   ├── report composer
│   ├── review and release
│   └── archive and audit
└── Direction profile
    ├── object types
    ├── workflow stages
    ├── data schema
    ├── calculation modules
    ├── report templates
    └── direction-specific rules
```

## Direction Profiles

### Real Estate

Object types:

- apartment;
- house;
- commercial property;
- land parcel;
- property complex;
- future types added by the methodologist.

Typical workflow:

`Assignment -> Documents -> Object and rights -> Inspection -> Market ->
Approaches -> Calculations -> Reconciliation -> Report -> Compliance ->
Review -> Release`

### Equipment and Machinery

Object types:

- individual machine;
- production line;
- technological complex;
- inventory group;
- special equipment.

Specialized stages and modules:

- inventory identification;
- manufacturer, model, serial number, and year;
- completeness and technical condition;
- physical deterioration;
- functional and economic obsolescence;
- installation and commissioning costs;
- market analogues and replacement cost.

### Motor Vehicles

Object types:

- passenger vehicle;
- commercial vehicle;
- fleet;
- other road vehicles added later.

Specialized stages and modules:

- registration and identification;
- mileage;
- equipment and condition;
- damage and repair history;
- market analogues;
- depreciation and adjustment model.

### Special Machinery

Object types:

- construction machinery;
- road machinery;
- agricultural machinery;
- lifting machinery;
- fleet of special machinery.

Specialized stages and modules:

- factory and registration numbers;
- operating hours and utilization;
- working and attached equipment;
- technical diagnostics;
- replacement cost and market analogues;
- physical, functional, and economic obsolescence.

### Business

Object types:

- 100 percent of a company;
- equity interest;
- operating business;
- group of companies;
- business line or cash-generating unit.

Typical workflow:

`Assignment -> Perimeter and rights -> Corporate documents -> Financial
statements -> Normalization -> Industry and market -> Forecast -> Approaches
and methods -> DCF/multiples/net assets -> Reconciliation -> Report ->
Compliance -> Review -> Release`

The business profile must support:

- several reporting periods and currencies;
- balance sheet, income statement, and cash flow statement;
- normalization adjustments with reasons;
- working-capital and capital-expenditure forecast;
- WACC or other discount-rate construction;
- terminal value and sensitivity analysis;
- guideline-company and transaction multiples;
- non-operating assets, debt, and equity bridge.

### Intangible Assets

Object types:

- trademark or brand;
- software;
- patent or technology;
- license;
- copyright;
- customer relationships;
- other identifiable right.

Typical workflow:

`Assignment -> Asset identification -> Rights and legal protection ->
Commercial use -> Useful life -> Economic benefits -> Approaches and methods
-> Specialized calculation -> Reconciliation -> Report -> Compliance ->
Review -> Release`

The profile must support:

- relief-from-royalty;
- multi-period excess earnings;
- with-and-without analysis;
- incremental cash flow;
- cost approach where applicable;
- contributory asset charges;
- tax amortization benefit where applicable.

## Workflow Profile Definition

Each published profile version contains:

| Definition | Purpose |
| --- | --- |
| `ValuationDirection` | Stable direction identity and access scope |
| `ObjectTypeDefinition` | Specific subject type and required data schema |
| `WorkflowProfileVersion` | Ordered stages and transition rules |
| `StageDefinition` | Screen, required fields, completion and blocking rules |
| `CalculationModuleDefinition` | Native or XLSX calculation capability |
| `MethodologyApplicabilityRule` | Applicable standards, articles, and methods |
| `ReportTemplateCompatibility` | Templates permitted for the profile |

A case pins all these versions when it is created. Updating a profile does not
silently restructure an existing case.

## UI Rules

- The sidebar shows the single top-level module `Valuation`.
- `New valuation` first asks for direction, then object type and template.
- Case navigation is generated from the pinned workflow profile.
- Shared stages retain a consistent visual pattern across directions.
- Direction-specific stages use dedicated screens and terminology.
- Lists and dashboards can be filtered by direction and object type.
- Methodology, templates, and reference data are partitioned by applicability,
  while remaining searchable from one place.

## Implementation Sequence

1. Introduce direction, object type, and workflow-profile entities.
2. Move the existing apartment flow into the real-estate profile.
3. Add equipment, motor vehicles, and special machinery only after reference
   examples and methodology are supplied.
4. Design business valuation as a separate vertical on the shared platform.
5. Design intangible assets after business financial-model components are
   stable, because several income methods can reuse them.

## Required Inputs Before Building New Directions

For each direction, collect:

- at least one representative report;
- calculation workbook or approved formulas;
- applicable standards and internal methodology;
- required source documents;
- mandatory report structure;
- reviewer checklist;
- two or three reference cases with expected results.

The current prototype demonstrates the profile selection and different stage
maps. It does not yet implement approved business or intangible-asset
calculations.
