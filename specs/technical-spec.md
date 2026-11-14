# Shipment Operations & Document Verification Platform
**Technical Specification — Version 2.0**

## 1. Technology Stack

### Core

| Layer | Technology |
|---|---|
| UI | React 19 |
| Language | JavaScript (ES6+) |
| Bundler | Webpack 5 |
| Transpiler | Babel |
| Routing | React Router |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| Package Manager | npm |

### Performance

- Native Web Workers.
- Custom fixed-height virtualization.
- requestAnimationFrame for scroll updates.
- ResizeObserver for container measurements.

### Testing and quality

| Tool | Purpose |
|---|---|
| Jest | Test runner |
| jest-environment-jsdom | DOM testing environment |
| React Testing Library | Component tests |
| user-event | User interaction simulation |
| jest-dom | DOM assertions |
| ESLint | Static code analysis |
| Prettier | Formatting |

No Redux, Zustand, TanStack Table, React Virtual, or external form library is required.

## 2. Project Setup and Build Configuration

Use Webpack 5 with separate development and production configurations.

### Build dependencies

- webpack
- webpack-cli
- webpack-dev-server
- @babel/core
- babel-loader
- @babel/preset-env
- @babel/preset-react
- html-webpack-plugin
- css-loader
- style-loader
- sass
- sass-loader
- tailwindcss
- postcss
- autoprefixer

Use Babel for JSX and modern JavaScript transpilation.

Use Webpack 5 native Worker support. No additional Worker loader is required.

### Webpack configuration responsibilities

Development:
- Development server.
- Fast rebuilds.
- Source maps.
- React development support.

Production:
- Minification.
- Asset optimization.
- Content hashing.
- Production source maps configured appropriately.
- CSS extraction where appropriate.

## 3. Suggested Project Structure

```text
src/
├── app/
│   ├── App.jsx
│   └── routes.jsx
│
├── components/
│   ├── layout/
│   │   ├── TopNavigation.jsx
│   │   └── ResponsiveWorkspace.jsx
│   │
│   ├── VirtualizedTable/
│   │   ├── VirtualizedTable.jsx
│   │   ├── TableHeader.jsx
│   │   ├── TableRow.jsx
│   │   ├── ShipmentCard.jsx
│   │   ├── GroupHeader.jsx
│   │   └── useVirtualization.js
│   │
│   ├── DocumentViewer/
│   │   └── DocumentViewer.jsx
│   │
│   ├── TextPicker/
│   │   └── TextPicker.jsx
│   │
│   ├── DynamicForm/
│   │   ├── DynamicForm.jsx
│   │   ├── FormField.jsx
│   │   └── validation.js
│   │
│   └── FieldProvenance/
│       ├── ProvenanceIndicator.jsx
│       └── ProvenanceHelpers.js
│
├── features/
│   └── shipments/
│       ├── pages/
│       │   ├── ShipmentListPage.jsx
│       │   └── ShipmentDetailsPage.jsx
│       │
│       ├── hooks/
│       │   └── useShipments.js
│       │
│       ├── services/
│       │   └── shipmentService.js
│       │
│       ├── workers/
│       │   └── shipment.worker.js
│       │
│       ├── data/
│       │   ├── generateShipments.js
│       │   ├── shipments.json
│       │   ├── ocrAnnotations.json
│       │   └── documents/
│       │
│       └── utils/
│           ├── shipmentHelpers.js
│           └── provenanceHelpers.js
│
├── styles/
│   └── global.css
│
├── test/
│   └── setup.js
│
└── main.jsx
```

Tailwind utilities should handle the majority of styling. Small custom CSS rules are permitted for specialized behaviour such as annotation positioning.

## 4. Application Routing

Use React Router.

Routes:

- `/shipments` — shipment listing dashboard.
- `/shipments/:shipmentId` — shipment details.

Requirements:
- Direct route navigation.
- Browser refresh support.
- Unknown shipment handling.
- Back navigation without losing relevant listing state where practical.

## 5. Data Model

### Shipment

```js
{
  id: "SHP-10482",
  origin: "New York",
  destination: "London",
  carrier: "DHL Express",
  status: "In Transit",
  eta: "2026-11-20",
  priority: "High",
  lastUpdated: "2026-11-14T10:30:00Z",
  verificationStatus: "Pending Review",
  weight: 1250,
  declaredValue: 15000,
  currency: "USD",
  documentId: "DOC-10482"
}
```

The shipment's editable values and field provenance should be managed separately or through a consistent field-value structure, provided the canonical record remains clear.

### OCR Annotation

```js
{
  id: "OCR-001",
  documentId: "DOC-10482",
  page: 1,
  text: "DHL Express",
  coordinates: {
    x: 0.24,
    y: 0.31,
    width: 0.18,
    height: 0.035
  }
}
```

Coordinates are normalized against the original document dimensions.

### Field Provenance

```js
{
  source: "ocr",
  status: "accepted",
  documentId: "DOC-10482",
  evidence: [
    {
      annotationId: "OCR-001",
      page: 1,
      extractedText: "DHL Express",
      coordinates: {
        x: 0.24,
        y: 0.31,
        width: 0.18,
        height: 0.035
      }
    }
  ]
}
```

A field can reference multiple evidence regions.

Provenance status:
- `accepted`
- `edited`
- `manual`

The original extracted text and coordinates must be retained when an OCR-populated value is manually edited.

## 6. Shipment Data Processing Architecture

### Web Worker responsibilities

The Worker handles:
- Search.
- Filtering.
- Sorting.
- Grouping.

The main thread handles:
- UI state.
- Rendering.
- Collapsed group state.
- Flattening the visible grouped result.
- Virtualization.
- Navigation.

### Worker initialization

Initialize the Worker once and send the shipment dataset through an initialization message.

Example:

```js
const worker = new Worker(
  new URL("./shipment.worker.js", import.meta.url),
  { type: "module" }
);
```

The Worker maintains its own dataset copy.

The main application maintains the canonical shipment records.

### Worker message protocol

Initialization:

```js
{
  type: "INIT",
  payload: {
    shipments: []
  }
}
```

Processing:

```js
{
  type: "PROCESS",
  requestId: 1,
  payload: {
    search: "",
    filters: {},
    sort: {},
    groupBy: "status"
  }
}
```

Response:

```js
{
  type: "RESULT",
  requestId: 1,
  payload: {
    groups: [],
    shipmentIds: []
  }
}
```

Update:

```js
{
  type: "UPDATE_SHIPMENT",
  payload: {
    shipment: {}
  }
}
```

The Worker updates its local dataset after a successful save.

### Processing pipeline

Search → Filter → Sort → Group → Return ordered IDs and group metadata.

Use request IDs to ignore stale responses when users rapidly change filters or search terms.

### Error handling

- Worker initialization failure.
- Worker processing failure.
- Invalid messages.
- Stale responses.
- Worker termination and cleanup.

A failure should produce a visible recoverable state rather than leaving the interface indefinitely loading.

## 7. Custom Virtualization

No virtualization library will be used.

### Fixed dimensions

Desktop:
- Shipment row: 48px.
- Group header: 48px.

Mobile:
- Shipment card: 88px.
- Group header: 48px.

These are fixed dimensions within each responsive layout. The virtualizer must know which row type and layout are being rendered.

### Flattened rendering model

Worker returns grouped shipment IDs.

React maintains collapsed group state.

The main thread creates a flattened sequence containing:
- Group headers.
- Shipment rows belonging to expanded groups.

The virtualizer operates on this flattened sequence.

### Virtualization calculations

For a fixed row height:

```js
startIndex = Math.max(
  0,
  Math.floor(scrollTop / rowHeight) - overscan
);

visibleCount = Math.ceil(
  containerHeight / rowHeight
);

endIndex = Math.min(
  totalRows,
  startIndex + visibleCount + overscan * 2
);
```

Spacer heights:

```js
topSpacerHeight = startIndex * rowHeight;

bottomSpacerHeight =
  (totalRows - endIndex) * rowHeight;
```

Overscan target: 5 rows.

Use requestAnimationFrame to batch scroll updates.

Use ResizeObserver to measure the virtualized container.

### Large scroll-height considerations

A dataset of 100,000 records can approach browser scroll-height limits.

The implementation should avoid assuming that one enormous physical spacer is universally reliable.

If necessary, use segmented or logical scrolling while preserving the virtual index.

## 8. Responsive Architecture

Use Tailwind default breakpoints:

| Breakpoint | Width |
|---|---|
| Base | Below 640px |
| sm | 640px |
| md | 768px |
| lg | 1024px |
| xl | 1280px |
| 2xl | 1536px |

Target screens:
- Desktop: 1440 × 900.
- Laptop: 1366 × 768.
- Tablet: 768 × 1024.
- Mobile: 390 × 844.

### Navigation

- Top navigation at all sizes.
- No desktop sidebar.
- Compact navigation on tablet and mobile.

### Shipment listing

Desktop:
- Full data table.
- All important columns.
- Full toolbar.

Tablet:
- Adapted table.
- Lower-priority columns hidden.
- Filters in a drawer/popover.

Mobile:
- Shipment cards instead of a wide table.
- Search remains prominent.
- Filters in a drawer or bottom sheet.
- Preserve grouping where practical.
- Basic shipment review and verification are the primary use cases.

The virtualizer must support the responsive card layout using its fixed mobile card height.

### Shipment details

Desktop at 1024px and above:
- Side-by-side document and form panels.
- Approximately equal panel widths.
- Independent scrolling.

Tablet below 1024px:
- Document and Details tabs.
- One visible panel at a time.

Mobile:
- Same Document and Details tabs.
- Single-column form.
- Sticky bottom Save and Verify actions.

When OCR is selected on tablet/mobile:
- Populate the focused field.
- Preserve selected annotation and evidence.
- Switch to Details when necessary to show the populated field.

When the source indicator is selected:
- Switch to Document.
- Navigate to and highlight the associated evidence.

CSS controls responsive layout. JavaScript resize listeners must not be used for ordinary styling decisions.

## 9. Document Viewer and Text Picker Integration

The existing TextPicker logic is reused as an independent component.

### Responsibilities of TextPicker

- Render the document image.
- Render OCR annotations.
- Calculate annotation positions.
- Support image zoom.
- Report selected annotation IDs.
- Render different annotation visual states.

TextPicker must not know about shipment field names or shipment-specific business rules.

### DocumentViewer responsibilities

- Wrap TextPicker.
- Supply document metadata and annotations.
- Manage active evidence highlighting.
- Navigate to relevant pages and coordinates.
- Coordinate with the responsive workspace.

### Static OCR data

For this assignment:
- Use a local static document image.
- Use predefined OCR annotation JSON.
- Do not call an OCR backend.
- Do not perform actual extraction.

### Coordinate calculation

Normalized coordinates must be converted into displayed image coordinates using the current rendered dimensions.

Conceptually:

```js
displayX = normalizedX * imageWidth;
displayY = normalizedY * imageHeight;

displayWidth = normalizedWidth * imageWidth;
displayHeight = normalizedHeight * imageHeight;
```

This allows the same OCR evidence to work at different zoom levels and screen sizes.

## 10. Field-Level Provenance Architecture

### State ownership

Shipment Details owns:
- Focused field.
- Current selected OCR annotation.
- Field values.
- Field provenance.
- Dirty state.
- Save and Verify state.

TextPicker only reports selected annotation IDs.

### OCR selection flow

1. Dynamic Form reports the focused field to Shipment Details.
2. Operator selects an OCR annotation.
3. TextPicker reports the annotation ID.
4. Shipment Details resolves annotation metadata.
5. The focused field is populated with extracted text.
6. Provenance evidence is associated with the field.
7. A source indicator appears immediately.

If there is no focused field, annotation selection must not populate a field.

### Source indicator

The indicator displays the source relationship.

It must distinguish:
- Unsaved OCR evidence.
- Saved OCR evidence.
- Edited OCR evidence.
- Manually entered values.

Clicking the indicator triggers a parent-level action to:
- Navigate to the relevant document.
- Navigate to the relevant page.
- Highlight all associated evidence regions.

The annotation overlay should visually distinguish normal, selected, and provenance-linked regions.

### Manual edits

When a field with OCR provenance is modified:
- Preserve original extracted text.
- Preserve document coordinates.
- Change provenance status to `edited`.

When a field is manually populated:
- Use `manual` provenance status.
- Do not fabricate OCR coordinates.

When a field is cleared:
- Clear its active provenance.

## 11. Form Architecture

Use schema-driven rendering.

Example schema:

```js
const shipmentFormSchema = [
  {
    name: "origin",
    label: "Origin",
    type: "text",
    required: true
  },
  {
    name: "destination",
    label: "Destination",
    type: "text",
    required: true
  },
  {
    name: "carrier",
    label: "Carrier",
    type: "text",
    required: true
  },
  {
    name: "weight",
    label: "Weight",
    type: "number",
    required: true
  }
];
```

DynamicForm responsibilities:
- Render fields from schema.
- Display values.
- Track field focus.
- Report changes to parent.
- Display validation errors.
- Display provenance indicators.

Keep validation utilities independent of the rendering component.

## 12. State Management

No external state-management library is required.

### Canonical shipment state

Owned by the shipment service/application layer.

### Listing state

Owned by the listing page or custom hook:
- Search.
- Filters.
- Sorting.
- Grouping.
- Processed results.

### Collapsed groups

Owned by React state.

### Virtualization state

Owned by the virtualized table:
- Scroll position.
- Container dimensions.
- Visible range.

### Shipment details state

Owned by ShipmentDetailsPage:
- Selected shipment.
- Form draft.
- Focused field.
- OCR selection.
- Field provenance.
- Save and Verify state.

### Document viewer state

Owned by DocumentViewer:
- Zoom.
- Current page.
- Active highlighted evidence.

Use controlled state and explicit callbacks between components.

## 13. Save and Verify Architecture

### Mock shipment service

Expose methods such as:

```js
getShipments()
getShipmentById(id)
updateShipment(id, changes)
verifyShipment(id)
```

Use simulated asynchronous operations.

### Save sequence

1. Validate the form.
2. Build the updated shipment object.
3. Include associated provenance.
4. Simulate an asynchronous save.
5. Update canonical shipment state.
6. Synchronize Worker data.
7. Update the listing view.
8. Clear dirty state.

If saving fails:
- Preserve the form draft.
- Preserve provenance.
- Show an error.
- Allow retry.

### Verify sequence

1. Validate required fields.
2. Ensure unsaved changes have been saved.
3. Simulate verification.
4. Update verification status.
5. Synchronize canonical and Worker data.

### Future API compatibility

The service layer should isolate persistence details.

A future backend can accept field values and provenance in the same payload.

Example:

```js
{
  shipmentId: "SHP-10482",
  fields: {
    carrier: {
      value: "DHL Express",
      provenance: {
        source: "ocr",
        status: "accepted",
        documentId: "DOC-10482",
        evidence: [
          {
            annotationId: "OCR-001",
            page: 1,
            extractedText: "DHL Express",
            coordinates: {
              x: 0.24,
              y: 0.31,
              width: 0.18,
              height: 0.035
            }
          }
        ]
      }
    }
  }
}
```

This preserves evidence for future extraction-quality analysis and potential model-improvement workflows.

The assignment does not implement model training or automatically authorize submitted data for training.

## 14. Performance Considerations

- Keep 100K records out of React component state where unnecessary.
- Initialize Worker data once.
- Avoid sending the entire dataset on every query.
- Use request IDs to discard stale Worker results.
- Use memoization selectively.
- Avoid unnecessary rerenders of virtualized rows.
- Use stable IDs as React keys.
- Batch scroll updates through requestAnimationFrame.
- Use normalized coordinates for document annotations.
- Clean up Workers, observers, and event listeners on unmount.
- Avoid excessive DOM nodes through virtualization.

## 15. Accessibility

- Semantic navigation and landmarks.
- Accessible form labels.
- Keyboard-accessible controls.
- Visible focus states.
- Appropriate aria attributes for virtualized rows.
- Accessible alternatives to OCR annotation interactions.
- Screen-reader-friendly save and verification feedback.
- Do not communicate state through colour alone.

## 16. Testing Strategy

### Unit tests

- Search and filtering utilities.
- Sorting and grouping.
- Virtualization calculations.
- Coordinate transformation.
- Provenance helpers.
- Form validation.

### Component tests

- Shipment table.
- Mobile shipment cards.
- Group collapse/expand.
- Document annotation selection.
- Dynamic form.
- Provenance indicator.
- Responsive tab navigation.

### Integration tests

- Focus a form field and select OCR text.
- Ensure the correct field is populated.
- Verify provenance association.
- Edit an OCR-populated value.
- Verify provenance status changes to edited.
- Click source indicator and highlight evidence.
- Save field values and provenance together.
- Verify shipment and confirm listing synchronization.

Prioritize core logic and critical user workflows over arbitrary coverage percentages.

## 17. Known Tradeoffs

- Main thread and Worker maintain separate dataset copies to simplify processing.
- Custom virtualization provides control but requires careful testing.
- Static OCR fixtures demonstrate the interaction without requiring OCR infrastructure.
- In-memory persistence is sufficient for the assignment but not production.
- Custom form handling is appropriate for the current field complexity.
- Mobile supports the primary review workflow rather than every advanced desktop operation.

## 18. Future Improvements

- Real OCR service integration.
- Backend persistence.
- Document upload and PDF support.
- Extraction confidence scores.
- Multiple documents per shipment.
- Field-level audit history.
- Real-time shipment updates.
- Model evaluation using reviewed evidence.
- User permissions and collaboration.
- Server-side processing for larger datasets.

