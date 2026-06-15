# Engagement Documents: Assignment and Contract

## Product Decision

Before calculations begin, the product creates an engagement package:

1. valuation assignment or technical specification;
2. valuation-services contract;
3. optional annexes defined by the selected contract template.

The data is entered once in a structured engagement record. Both documents,
the valuation case, and later report sections use bindings to that record.

## Workflow

```text
Request
-> Select valuation direction and object type
-> Enter customer and engagement terms
-> Generate assignment and contract drafts
-> Review and edit permitted clauses
-> Approve or sign
-> Activate valuation case
-> Reuse the approved data in the report
```

The valuation case may be created as a draft before signature, but calculations
and final release rules can require an approved engagement package.

## Shared Data

- customer and authorized representative;
- appraiser organization and authorized representative;
- valuation direction and object type;
- subject and composition of the valuation;
- valued rights or ownership interest;
- valuation purpose and intended use;
- value type;
- valuation and report dates;
- information supplied by the customer;
- assumptions and limitations;
- scope of inspection or due diligence;
- report format and number of copies;
- service price, taxes, payment schedule, and currency;
- performance period and delivery method;
- confidentiality and personal-data terms;
- responsibilities, dispute procedure, and requisites.

Direction-specific profiles add their own fields. For example, business
valuation adds the ownership percentage, valuation perimeter, reporting
periods, and forecast responsibility.

## Document Templates

Assignment and contract templates are managed separately from report
templates. Each published version contains:

- DOCX source and styles;
- placeholders and conditional clauses;
- required and editable clauses;
- compatibility with valuation directions and purposes;
- approval status and effective dates;
- signatory rules and annex definitions.

Legal clauses are not generated freely by AI. AI may propose wording only in
explicitly editable fields. Approved template clauses remain locked unless a
user with the required permission creates a documented deviation.

## Versioning and Signatures

Every regeneration creates a document version. An approved or signed version
is immutable and records:

- template version;
- structured input snapshot;
- manual clause changes and authors;
- generated DOCX/PDF hashes;
- approval and signature status;
- relation to the activated valuation case.

Electronic signature can later use the same provider adapter as final report
signing. Until then, the system supports print/sign/upload and stores the
signed scan as a separate artifact.

## Prototype Scope

The prototype shows:

- switching between assignment and contract;
- completeness and template status;
- fields and generated document preview;
- DOCX/PDF generation controls;
- a rule that engagement data is reused in the report.

Actual legal templates must be provided and approved before production use.
