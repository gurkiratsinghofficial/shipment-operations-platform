# Shipment Operations & Document Verification Platform
**Product Specification — Version 2.0**

## 1. Product Overview

A shipment operations platform that helps logistics coordinators identify shipments requiring attention, review shipment information, validate supporting documents, and maintain accurate shipment records.

The platform combines a high-volume shipment dashboard with a document-assisted verification workspace.

Its key differentiator is human-in-the-loop document verification: operators can select OCR-detected text directly from a document, populate shipment fields, and preserve the exact document evidence associated with each field.

## 2. Problem Statement

Logistics coordinators work with large volumes of shipment records and supporting documents.

Common challenges include:
- Identifying delayed, high-priority, or problematic shipments.
- Searching and navigating large shipment datasets.
- Manually transferring information from documents into shipment records.
- Verifying that entered information matches its supporting document.
- Maintaining traceability between structured shipment data and original document evidence.

The platform aims to make these workflows faster, more accurate, and easier to audit.

## 3. Target User

**Primary user: Logistics Coordinator / Shipment Operations Analyst**

Responsibilities:
- Monitor shipment statuses and delivery risks.
- Investigate shipments requiring attention.
- Review shipment documents.
- Populate and validate shipment information.
- Save and verify shipment records.

## 4. Application Structure

The application consists of two primary screens.

### 4.1 Shipment Listing Dashboard

The dashboard provides a centralized view of approximately 100,000 shipments.

Each shipment contains:

| Field | Description |
|---|---|
| Shipment ID | Unique shipment identifier |
| Origin | Shipment origin |
| Destination | Shipment destination |
| Carrier | Logistics carrier |
| Status | Current shipment status |
| ETA | Estimated delivery date |
| Priority | Shipment priority |
| Last Updated | Last modification timestamp |
| Verification Status | Document verification state |

#### Shipment statuses
- In Transit
- Delivered
- Delayed
- Customs Hold
- Exception

#### Verification statuses
- Pending Review
- In Review
- Verified

#### Dashboard capabilities

**Search**
- Search by shipment ID, origin, destination, and carrier.
- Case-insensitive partial matching.
- Search combines with active filters.

**Filtering**
- Shipment status.
- Verification status.
- Priority.
- Carrier.
- Origin.
- Destination.

Multiple filters are applied conjunctively.

**Sorting**
- Shipment ID.
- ETA.
- Priority.
- Last Updated.
- Carrier.
- Status.

Ascending and descending sorting are supported.

**Grouping**
- Group by status, carrier, priority, or origin.
- One grouping dimension at a time.
- Display shipment count per group.
- Expand and collapse groups.
- Preserve sorting within groups.

**Navigation**
- Selecting a shipment opens its details page.
- Route format: `/shipments/:shipmentId`.
- Direct navigation and browser refresh must work.
- Unknown shipment IDs display a not-found state.

### 4.2 Shipment Details Workspace

The details screen provides two main work areas:

1. Document Viewer
2. Dynamic Shipment Form

On desktop, both are displayed side by side.

On tablet and mobile, they are accessible through Document and Details tabs.

#### Document Viewer

Displays a static shipment document image, such as a Bill of Lading.

Capabilities:
- Display document image.
- Render predefined OCR bounding boxes.
- Support image zoom.
- Support OCR annotation selection.
- Highlight selected OCR annotations.
- Highlight saved evidence associated with form fields.
- Support multiple evidence regions per field.

For the assignment, OCR annotations and extracted text are provided as static data. Actual OCR processing is not included.

#### Dynamic Shipment Form

The form displays editable shipment fields, including:
- Origin.
- Destination.
- Carrier.
- Weight.
- Declared Value.
- Currency.

Requirements:
- Schema-driven field rendering.
- Required-field validation.
- Read-only Shipment ID.
- Field-level editing.
- Dirty-state tracking.
- Clear validation messages.
- Save and Verify actions.

## 5. Document-Assisted Data Capture

This is a core feature of the platform.

### 5.1 OCR Selection Workflow

1. Operator focuses a shipment form input.
2. Operator selects an OCR annotation on the document.
3. The selected OCR text populates the focused input.
4. The selected OCR annotation is associated with the populated field.
5. A source indicator appears alongside the field.
6. The operator can review or edit the populated value.
7. The operator saves the shipment.

If no form input is focused, selecting an OCR annotation only selects/highlights it. It must not populate a field.

### 5.2 Field-Level Provenance

Every OCR-populated field must retain its source evidence.

Provenance includes:

| Property | Description |
|---|---|
| Document ID | Source document identifier |
| Page | Source document page |
| Extracted Text | Original OCR text |
| Coordinates | Original OCR bounding-box coordinates |
| Source | OCR or manual |
| Status | Accepted, edited, or manual |

Coordinates are normalized relative to the original document dimensions.

A field must support multiple source regions, even though the initial demonstration may use one region per field.

### 5.3 Source Indicator

A source indicator appears immediately after OCR selection, before saving.

The indicator distinguishes:
- Unsaved OCR evidence.
- Saved OCR evidence.
- Edited OCR values.
- Manually entered values.

Clicking the indicator must:
- Navigate to the relevant document and page.
- Locate the associated OCR bounding box or boxes.
- Highlight the evidence using a distinct visual treatment.
- Preserve the relationship between the field and its source.

Normal, selected, and provenance-linked OCR annotations must have visually distinguishable states.

### 5.4 Editing and Provenance Rules

| Scenario | Behaviour |
|---|---|
| OCR value accepted unchanged | Status: `accepted` |
| OCR value manually modified | Status: `edited` |
| Field entered manually | Status: `manual` |
| Field cleared | Clear its active provenance |
| Multiple OCR regions selected | Associate all selected regions with the field |

When an OCR value is edited, retain the original OCR evidence and extracted text.

The current field value and original evidence must remain distinguishable.

## 6. Save and Verify Workflow

### Save

- Validate the form.
- Save field values and associated provenance together.
- Preserve verification status unless explicitly changed through Verify.
- Update the canonical shipment record.
- Update the shipment listing and Worker dataset.
- Preserve the draft if saving fails.

### Verify

- Require all mandatory fields to be valid.
- Require pending edits to be saved before verification.
- Update verification status to Verified.
- Reflect the updated status in the shipment listing.

For this assignment, saving and verification use simulated asynchronous operations. No backend integration is required.

## 7. Data Consistency

The shipment record is the canonical source of truth.

- Listing and details views must reflect the same shipment data.
- Successful saves update the canonical record.
- Worker-held shipment data must be synchronized after successful changes.
- Form drafts remain separate from canonical data until saved.
- Provenance must be saved alongside its associated field value.

## 8. Responsive Design

The application must support desktop, tablet, and mobile experiences.

### Breakpoints

Use Tailwind CSS default breakpoints:

| Breakpoint | Width |
|---|---|
| Base | Below 640px |
| sm | 640px |
| md | 768px |
| lg | 1024px |
| xl | 1280px |
| 2xl | 1536px |

### Target screen sizes

- Desktop: 1440 × 900.
- Laptop: 1366 × 768.
- Tablet: 768 × 1024.
- Mobile: 390 × 844.

### Desktop: 1280px and above

- Top navigation, no sidebar.
- Full shipment data table.
- Full search, filter, sorting, and grouping controls.
- Side-by-side document viewer and shipment form.
- Independent panel scrolling.

### Tablet: 768px–1279px

- Compact top navigation.
- Adapted shipment table with lower-priority columns hidden.
- Document and Details tabs.
- One workspace panel visible at a time.
- Switching to Details after OCR selection should preserve the selected evidence and populated value.
- Switching to Document from a source indicator should highlight the associated evidence.

### Mobile: Below 768px

- Compact top navigation.
- Shipment listing displayed as cards instead of a wide table.
- Search remains prominent.
- Filters open in a drawer or bottom sheet.
- Document and Details tabs.
- Single-column form layout.
- Sticky bottom action bar for Save and Verify.
- Primary use case is shipment review and basic verification rather than extensive operations.

Mobile supports the core review and verification workflow, not necessarily every advanced desktop operation.

### Responsive implementation rules

- CSS-driven responsive layouts.
- No JavaScript resize listeners for ordinary layout changes.
- Use ResizeObserver where actual container measurements are needed.
- Avoid horizontal scrolling in the primary mobile experience.
- Preserve active filters, sorting, grouping, and shipment context when switching layouts.

## 9. Accessibility

- Semantic and keyboard-accessible controls.
- Proper form labels and error associations.
- Visible keyboard focus indicators.
- Accessible table and card representations.
- Appropriate row and column information for the virtualized table.
- Screen-reader announcements for relevant state changes.
- Status indicators must not rely solely on colour.
- OCR annotations must have accessible interaction alternatives.

## 10. Application States

The application must support:

- Initial loading.
- Loading after search/filter changes.
- Empty shipment results.
- No search matches.
- Shipment not found.
- Document loading failure.
- Save failure.
- Verification failure.
- Worker initialization or processing failure.

Failure states must provide understandable recovery actions.

## 11. Assumptions

- Approximately 100,000 locally generated shipment records.
- Static local document image.
- Static OCR annotations and extracted text.
- In-memory shipment state.
- Simulated asynchronous save and verification operations.
- No authentication or backend.
- No real OCR processing.

## 12. Out of Scope

- Real carrier tracking.
- Carrier API integration.
- Actual OCR extraction.
- Document uploads.
- Real customs clearance.
- Authentication and authorization.
- Persistent database storage.
- Audit-log backend.
- Real model training or model fine-tuning.
- Multi-user collaboration.

The application should preserve data structures that make future API integration and model-improvement workflows possible.

## 13. Success Criteria

The assignment is successful when:

1. Users can efficiently explore a large shipment dataset.
2. Search, filtering, sorting, and grouping work correctly.
3. The custom virtualized listing performs smoothly.
4. Users can navigate to and inspect shipment details.
5. OCR annotations can populate focused form fields.
6. Field values retain their associated document evidence.
7. Source indicators navigate to and highlight the correct OCR regions.
8. Users can edit, save, and verify shipment information.
9. Listing and details remain consistent after updates.
10. The application provides a polished, accessible responsive experience.
