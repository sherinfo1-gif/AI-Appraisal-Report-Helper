# Composite Valuation Cases

## Decision

A property complex is represented as one valuation case containing multiple
independent asset groups. The product must not merge already generated Word
reports as its primary workflow.

Each asset group pins its own:

- valuation direction and object type;
- workflow-profile version;
- required fields and documents;
- inspection and evidence;
- methodology and calculation modules;
- result, reviewer state, and report chapter.

The case stores shared customer, purpose, value type, valuation date,
engagement documents, assumptions, and release settings only once.

## Example

One industrial property complex may contain:

1. land, buildings, and structures;
2. production equipment;
3. passenger and commercial vehicles;
4. construction or lifting machinery;
5. intangible rights or another related group.

The result of every group remains independently reproducible. A consolidation
layer checks inclusion, exclusions, dependencies, and double counting before
calculating the total value.

## Release Strategies

### Unified report

Recommended for a property complex:

- one cover, assignment, contract reference, and general assumptions;
- one chapter for every asset group;
- separate approach selection and calculations inside each chapter;
- a consolidated conclusion and total-value table;
- one DOCX, PDF, QR identifier, and release snapshot;
- calculation workbooks attached by asset group.

### Separate reports with a common package

Used when requested by the customer, required by a template, or needed for
separate legal use:

- one independently numbered report per asset group;
- one common engagement and case;
- optional consolidated cover letter or summary conclusion;
- separate release snapshots and QR identifiers.

The user chooses the release strategy. Changing it does not duplicate source
data or calculations.

## Validation Rules

- Every component belongs to exactly one asset group for conclusion purposes.
- Shared infrastructure must declare whether its value is included elsewhere.
- A group cannot enter the consolidated conclusion without an approved result.
- Interdependent assets require an explicit aggregation assumption.
- The consolidated total is calculated from immutable approved group snapshots.
- Report chapters may be reordered, but their pinned profile versions remain.
