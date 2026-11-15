import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import VirtualizedDataTable from '../../../common/VirtualizedDataTable/VirtualizedDataTable';
import { generateShipments } from '../data/generateShipments';

function formatDate(val) {
  if (!val) return '';
  const date = new Date(val);
  if (Number.isNaN(date.getTime())) return String(val);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

const COLUMNS = [
  {
    key: 'id',
    header: 'Shipment ID',
    width: '130px',
    sortable: true,
    filter: true,
    renderCell: ({ value, row }) => (
      <Link
        to={`/shipments/${row.id}`}
        className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
        onClick={(e) => e.stopPropagation()}
      >
        {value}
      </Link>
    ),
  },
  { key: 'origin', header: 'Origin', width: '1fr', sortable: true, filter: true },
  { key: 'destination', header: 'Destination', width: '1fr', sortable: true, filter: true },
  { key: 'carrier', header: 'Carrier', width: '1.2fr', sortable: true, filter: true },
  { key: 'status', header: 'Status', width: '1fr', sortable: true, filter: true },
  { key: 'priority', header: 'Priority', width: '100px', sortable: true, filter: true },
  {
    key: 'eta',
    header: 'ETA',
    width: '120px',
    sortable: true,
    renderCell: ({ value }) => formatDate(value),
  },
  {
    key: 'lastUpdated',
    header: 'Last Updated',
    width: '150px',
    sortable: true,
    renderCell: ({ value }) => formatDate(value),
  },
  { key: 'verificationStatus', header: 'Verification', width: '130px', sortable: true, filter: true },
];

export default function ShipmentListPage() {
  const data = useMemo(() => generateShipments(100000), []);

  return (
    <div className="flex-1 min-h-0 overflow-auto bg-slate-50 p-6 flex flex-col items-center">
      <div className="w-full max-w-7xl flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Shipments Dashboard</h1>
        </div>

        <div className="border border-slate-300 rounded-lg overflow-hidden shadow-xs bg-white">
          <VirtualizedDataTable
            data={data}
            columns={COLUMNS}
            height={450}
            width="100%"
            rowHeight={42}
          />
        </div>
      </div>
    </div>
  );
}
