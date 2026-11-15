import React from 'react';

const inputClassName =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500';

const readOnlyInputClassName = `${inputClassName} bg-slate-50 text-slate-600`;

export default function ShipmentForm({ shipmentId }) {
  return (
    <form className="flex-1 min-h-0 flex flex-col">
      <fieldset className="flex-1 min-h-0 overflow-auto grid grid-cols-2 gap-x-6 gap-y-4 content-start border-0 p-0 m-0">
        <legend className="sr-only">Shipment details</legend>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="shipment-id" className="text-sm font-medium text-slate-700">
            Shipment ID
          </label>
          <input
            id="shipment-id"
            name="shipmentId"
            type="text"
            readOnly
            defaultValue={shipmentId}
            className={readOnlyInputClassName}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="origin" className="text-sm font-medium text-slate-700">
            Origin
          </label>
          <input id="origin" name="origin" type="text" className={inputClassName} />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="destination" className="text-sm font-medium text-slate-700">
            Destination
          </label>
          <input id="destination" name="destination" type="text" className={inputClassName} />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="carrier" className="text-sm font-medium text-slate-700">
            Carrier
          </label>
          <input id="carrier" name="carrier" type="text" className={inputClassName} />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="weight" className="text-sm font-medium text-slate-700">
            Weight
          </label>
          <input id="weight" name="weight" type="text" className={inputClassName} />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="declared-value" className="text-sm font-medium text-slate-700">
            Declared Value
          </label>
          <input id="declared-value" name="declaredValue" type="text" className={inputClassName} />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="currency" className="text-sm font-medium text-slate-700">
            Currency
          </label>
          <input id="currency" name="currency" type="text" className={inputClassName} />
        </div>
      </fieldset>

      <div className="shrink-0 flex items-center gap-3 pt-4 mt-4 border-t border-slate-200 bg-slate-50">
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
        >
          Save
        </button>
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
        >
          Verify
        </button>
      </div>
    </form>
  );
}
