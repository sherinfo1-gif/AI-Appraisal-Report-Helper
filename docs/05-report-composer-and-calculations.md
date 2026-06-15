# Report Composer and Calculation Architecture

## Product Decision

The report is assembled in a structured report composer inside the product.
The DOCX file is an import and export format, but it is not the live canonical
copy of the case.

This gives the appraiser:

- a section outline created from the selected report template;
- manual editing of every permitted paragraph and table;
- visible origin for imported, calculated, AI-proposed, and manual content;
- controlled insertion of case fields, methodology references, and results;
- protection from silent overwriting after data or calculation changes;
- repeatable DOCX, PDF, and XLSX generation from one approved snapshot.

## Template Lifecycle

1. A methodologist uploads an approved DOCX template.
2. The system extracts paragraphs, headings, tables, styles, bookmarks,
   content controls, and supported placeholders.
3. The methodologist maps sections and their bindings in a template editor.
4. Validation checks mandatory sections, unsupported constructs, and missing
   bindings.
5. The template is published as an immutable version.
6. A valuation case selects and pins one published template version.
7. A later template update does not change an existing case automatically.

Arbitrary DOCX files cannot be imported reliably without configuration.
Template publication therefore requires a one-time mapping and validation
step by a methodologist.

## Report Section Model

Each report section stores:

| Field | Purpose |
| --- | --- |
| Template section ID and version | Connects the section to the approved structure |
| Structured document content | Current paragraphs, lists, tables, and inline bindings |
| Content origin | Template, case data, calculation, AI proposal, import, or manual edit |
| Data bindings | Case fields, calculation values, table ranges, and methodology references |
| Standard references | Paragraphs of the applicable standard and methodology |
| Edit history | Author, timestamp, previous version, and reason for material changes |
| Review state | Draft, ready, commented, approved, or locked |
| Freshness state | Current or affected by changed source data |

When a bound value changes, the section is marked as affected. The product
shows a comparison and offers to reapply the generated fragment. It never
silently replaces manually edited text.

## Binding Types

- `Field binding`: customer, dates, address, cadastral data, and other case
  fields.
- `Computed value binding`: value, adjustment, rate, weight, and total.
- `Narrative binding`: generated description or justification accepted by the
  appraiser.
- `Table binding`: native calculation table or a mapped XLSX named range.
- `Methodology binding`: approved article, formula, or standard reference.
- `Conditional section`: section included only when its applicability rule is
  true.

For example, rejection of an approach is entered as a structured decision
with the selected approach, reason, source, author, and date. Its approved
wording is then inserted in the template-defined `Choice of approaches`
section.

## Calculation Strategy

Use a hybrid calculation model.

### Native Calculations

Standard and frequently repeated calculations are implemented as product
modules:

- sales comparison for apartments;
- adjustment tables;
- weighting and reconciliation;
- standard cost and income modules after methodology approval.

Native tables are easier to validate, audit, reuse in the report, and export
to XLSX.

### Linked XLSX

Complex or customer-specific calculations use a versioned XLSX workbook,
preferably edited through self-hosted ONLYOFFICE:

- system fields are mapped to named cells or ranges;
- report values and tables are read only from named outputs;
- every save creates a workbook version and recalculation result;
- formulas, file hash, input values, and output values are recorded;
- unsupported macros and external links are blocked or explicitly approved;
- XLSX import and export use a documented supported-workbook profile.

Manual overrides in either mode require a reason and source. A report release
uses only an approved `CalculationSnapshot`; later workbook changes do not
alter the issued report.

## Word, PDF, and XLSX Release

The release service receives one frozen case snapshot and generates:

1. DOCX from the pinned template version and approved report sections.
2. PDF from the generated DOCX using a controlled server-side converter.
3. XLSX calculation package containing native exports and linked workbooks.
4. Evidence index and hashes for the released files.

The exact PDF engine can be selected during implementation after layout tests
with the supplied templates. LibreOffice headless and self-hosted ONLYOFFICE
are candidates; the acceptance criterion is visual equivalence on the
approved reference reports.

## QR Verification

The QR code contains an opaque verification URL or release identifier, not
confidential case data. The verification page returns only the permitted
fields:

- report and release number;
- issue date;
- current release status;
- file hash match;
- electronic-signature status when available.

Access to the report itself remains protected by normal authorization.

## Electronic Signature

Electronic signature is added through a provider adapter after the pilot:

- the release snapshot is created before signing;
- the adapter sends the final PDF or its hash to the selected provider;
- signature result, certificate metadata, and validation status are stored;
- a signed file becomes another immutable artifact of the same release.

The provider and signature format must be confirmed against the applicable
Uzbekistan legal and technical requirements before implementation. The core
report workflow must not depend on one provider.

## Recommended Delivery Order

1. Structured report outline and manual section editor.
2. DOCX template mapping and immutable template versions.
3. Native apartment calculation with XLSX export.
4. DOCX/PDF generation and A4 preview.
5. Release snapshot, file hashes, and QR verification.
6. Linked XLSX/ONLYOFFICE for complex objects.
7. Electronic-signature provider adapter.

## Acceptance Rules

- Every report section can be opened and manually edited.
- The active template defines section order and mandatory content.
- Manual edits survive recalculation until the appraiser explicitly accepts a
  replacement.
- Every displayed value can be traced to a case field or calculation snapshot.
- Approach selection and rejection reasons appear in the correct report
  section.
- One release produces matching DOCX, PDF, and XLSX artifacts.
- Issued files, template, methodology, calculations, and report sections are
  immutable and reproducible.
