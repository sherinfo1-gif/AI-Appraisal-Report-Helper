# Clickable Prototype Map

## Prototype Goal

Validate navigation, information hierarchy, terminology, and daily appraisal
workflow before production development. The prototype must not be used for
real calculations or report release.

It covers:

- a top-level valuation module with direction and object-type selection;
- a complete apartment valuation flow using the sales comparison approach;
- selected complex-property screens showing components, three approaches,
  embedded XLSX, and reconciliation.

The direction selector also demonstrates planned workflow profiles for
equipment, motor vehicles, special machinery, business, and intangible
assets. These profiles are navigation concepts, not implemented calculation
methodology.

## Visual System

- Light professional interface with dark-blue primary actions.
- Persistent left navigation.
- Balanced information density suitable for desktop work.
- Wizard-like stages inside an open valuation case.
- Main work area in the center.
- Switchable right panel for AI assistance or live A4 report preview.
- Clear distinction between user input, calculated value, imported value,
  AI proposal, warning, and blocking error.

## Global Navigation

1. Valuation dashboard.
2. Valuation cases.
3. Archive.
4. Report templates.
5. Methodology.
6. Reference data.
7. Administration.

## New Valuation

The creation dialog uses three levels:

1. Case mode: one object type or a composite valuation case.
2. Direction: real estate, equipment, motor vehicles, special machinery,
   business, or intangible assets.
3. Object type and compatible report template.

In composite mode, the user adds multiple asset groups. Each group receives an
independent workflow and calculation result, while shared case fields are
entered once.

The dialog previews the workflow loaded for the selected direction. Existing
cases retain their pinned workflow-profile version.

Before calculation work, the first shared stage generates the engagement
package:

- valuation assignment or technical specification;
- valuation-services contract;
- compatible annexes when required.

The same confirmed fields are reused in the case and final report.

## Dashboard

- My active cases and deadlines.
- Cases returned with reviewer comments.
- Cases waiting for review.
- Recently issued reports.
- Primary action: `Create valuation case`.

## Initial Appraiser Workflow

The prototype now includes a lightweight first-pass appraiser workflow for the
active apartment case. It is static demo data only and is not connected to the
application API.

Required clickable path:

1. Open the dashboard or case list.
2. Open the active apartment valuation case or create a case from the header
   action.
3. Review the case overview.
4. Review uploaded/report materials as static demo cards.
5. Review the report section structure.
6. Open the helper findings list.
7. Open a finding detail.
8. Choose one finding decision: corrected, disagree, or escalate to director.
9. Review the case status summary.

## Apartment Scenario

| Step | Screen | Required prototype behavior |
| --- | --- | --- |
| 1 | Create case | Select direction, object type, customer, purpose, value type, valuation date, deadline, appraiser, and reviewer |
| 2 | Assignment and contract | Generate versioned assignment/TZ and contract drafts from shared fields; preview and export DOCX/PDF |
| 3 | Documents | Upload cadastral document; display proposed OCR fields and confirmation controls |
| 4 | Subject property | Address, map, cadastral data, rights, apartment/building characteristics |
| 5 | Inspection | Visit data, condition checklist, measurements, observations, and photo gallery |
| 6 | Market evidence | Add three or more listings with URL, dated snapshot, and parsed characteristics |
| 7 | Comparables | Side-by-side subject/comparable table and comparable selection |
| 8 | Adjustments | Sequential adjustments, justification, source, and calculated adjusted price |
| 9 | Result | Weights, unit value, total value, rounding, anomaly warnings, native/XLSX mode, and XLSX export |
| 10 | Report sections | Template outline, section selection, data bindings, cited methodology, manual editor, history, and accept/reject action |
| 11 | Compliance | Blocking errors, warnings, source links, and completion checklist |
| 12 | Review | Reviewer comments grouped by stage; return and resubmit flow |
| 13 | Preview and issue | A4 preview, package contents, release number, DOCX/PDF/XLSX generation, QR verification, and signature readiness |
| 14 | Archive | Immutable release, hashes, files, history, and later corrected release |

## Complex Property Scenario

The complex scenario does not repeat the complete apartment flow. It proves
that the same case model supports:

1. A land parcel with multiple buildings and structures.
2. A component register with areas, volumes, condition, and inclusion status.
3. Separate tabs for land, sales comparison, market rent, income, cost,
   depreciation, capitalization rate, and entrepreneurial profit.
4. An embedded ONLYOFFICE workbook with named input/output bindings.
5. A reconciliation screen for approach values and weights.
6. Report tables generated from both native calculations and mapped XLSX
   ranges.
7. Mixed asset groups such as real estate, equipment, motor vehicles, and
   special machinery.
8. A release choice between one unified report and separate group reports with
   a common package.

## Case Workspace Layout

```text
+----------------+------------------------------+----------------------+
| Left navigation| Current stage                | AI / A4 preview      |
|                |                              |                      |
| Dashboard      | Fields, tables, calculations | Contextual proposal  |
| Cases          | sources and validation       | or report pages      |
| Archive        |                              |                      |
+----------------+------------------------------+----------------------+
```

## Important UI States

- Empty, partially complete, complete, and locked stages.
- OCR proposal awaiting confirmation.
- AI proposal awaiting acceptance.
- Missing source evidence.
- Formula override with mandatory explanation.
- Blocking compliance error and non-blocking warning.
- Reviewer comment, resolved comment, and reopened comment.
- Workbook available, workbook locked, and workbook version changed.
- Draft preview, approved preview, and immutable issued snapshot.

## Prototype Review Script

1. Create a new apartment case from the dashboard.
2. Confirm OCR data from a cadastral document.
3. Complete subject and inspection data.
4. Add and confirm three comparable listings.
5. Apply and justify adjustments.
6. Review the calculated value and warning panel.
7. Accept an AI-generated report paragraph.
8. Manually edit the paragraph and confirm that a recalculation does not
   silently overwrite it.
9. Export the calculation workbook.
10. Submit the case to review.
11. Return one stage with a reviewer comment and resolve it.
12. Generate a DOCX/PDF/XLSX snapshot with QR and open it in the archive.
13. Open the complex case and inspect components, XLSX, three approaches, and
    reconciliation.

## Prototype Acceptance

- An appraiser can understand where to enter every major data category.
- A reviewer can identify changed and unresolved areas without editing them.
- The relationship between source, calculation, text, and final report is
  visible.
- The apartment path can be completed without navigating outside the case.
- The complex case does not require a separate product architecture.
