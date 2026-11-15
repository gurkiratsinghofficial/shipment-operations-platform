import React, { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import TextPicker from '../../../common/TextPicker/TextPicker';
import { generateOCR } from '../data/generateOCR';
import blImage from '../data/bl.png';

const ocr = generateOCR();
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.1;

export default function ShipmentDetailsPage() {
  const { shipmentId } = useParams();
  const [zoom, setZoom] = useState(1);
  const annotations = useMemo(() => ocr.textCoordinates ?? [], []);
  const zoomPercent = Math.round(zoom * 100);

  return (
    <div className="h-screen min-h-0 flex flex-col bg-slate-50">
      <header className="shrink-0 flex items-center justify-between gap-4 px-4 py-3 border-b border-slate-200 bg-white">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">Shipment {shipmentId}</h1>
          <p className="text-xs text-slate-500">Document viewer</p>
        </div>
        <Link
          to="/shipments"
          className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
        >
          &larr; Back to Shipments
        </Link>
      </header>

      <div className="flex-1 min-h-0 flex">
        <section className="w-1/2 h-full min-h-0 flex flex-col border-r border-slate-200 bg-white">
          <div className="shrink-0 flex items-center gap-3 px-4 py-2 border-b border-slate-200 bg-slate-50">
            <label htmlFor="document-zoom" className="text-xs font-medium text-slate-600 whitespace-nowrap">
              Zoom
            </label>
            <input
              id="document-zoom"
              type="range"
              min={MIN_ZOOM}
              max={MAX_ZOOM}
              step={ZOOM_STEP}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full accent-blue-600"
              aria-valuetext={`${zoomPercent}%`}
            />
            <span className="text-xs tabular-nums text-slate-700 w-12 text-right">{zoomPercent}%</span>
          </div>
          <div className="flex-1 min-h-0">
            <TextPicker imageUrl={blImage} annotations={annotations} zoom={zoom} />
          </div>
        </section>

        <section className="w-1/2 h-full min-h-0 overflow-auto p-8 text-slate-800">
          <div className="max-w-lg">
            <h2 className="text-xl font-bold text-slate-900 mb-2">Shipment Details Workspace</h2>
            <p className="text-sm text-slate-600">
              Dynamic Form with OCR Provenance will be hooked up next.
              <input type='text' />
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
