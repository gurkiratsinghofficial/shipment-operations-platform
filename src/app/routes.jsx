import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import ShipmentListPage from '../features/shipments/pages/ShipmentListPage';

function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-slate-800">
      <div className="max-w-md w-full bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4 font-bold text-xl">
          SO
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Shipment Operations &amp; Document Verification Platform
        </h1>
        <p className="text-sm text-slate-600 mb-6">
          React 19 + Webpack 5 + Tailwind CSS application setup complete and ready.
        </p>
        <div className="flex flex-col gap-2">
          <Link
            to="/shipments"
            className="w-full inline-flex justify-center items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
          >
            Go to Shipments Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

function ShipmentDetailsPlaceholder() {
  return (
    <div className="min-h-screen bg-slate-50 p-8 text-slate-800">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Shipment Details Workspace</h2>
        <p className="text-sm text-slate-600 mb-4">
          Details workspace route (Document Viewer &amp; Dynamic Form with OCR Provenance) will be hooked up next.
        </p>
        <Link to="/shipments" className="text-sm font-medium text-blue-600 hover:underline">
          &larr; Back to Shipments Listing
        </Link>
      </div>
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/shipments" element={<ShipmentListPage />} />
      <Route path="/shipments/:shipmentId" element={<ShipmentDetailsPlaceholder />} />
    </Routes>
  );
}
