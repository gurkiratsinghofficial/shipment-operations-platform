import React, { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import TextPicker from '../../../common/TextPicker/TextPicker';
import ShipmentForm from '../components/ShipmentForm';
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
    <div className="flex-1 min-h-0 h-full overflow-hidden flex flex-col bg-slate-50">
      <div className="flex-1 min-h-0 flex overflow-hidden">
        <section className="w-1/2 min-h-0 flex flex-col overflow-hidden border-r border-slate-200 bg-white">
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
          <div className="flex-1 min-h-0 overflow-hidden">
            <TextPicker
              imageUrl={blImage}
              annotations={annotations}
              zoom={zoom}
              containerClass="h-full min-h-0"
            />
          </div>
        </section>

        <section className="w-1/2 min-h-0 overflow-hidden flex flex-col p-8 text-slate-800">
          <h2 className="shrink-0 text-xl font-bold text-slate-900 mb-4">Shipment {shipmentId}</h2>
          <ShipmentForm shipmentId={shipmentId} />
        </section>
      </div>
    </div>
  );
}
