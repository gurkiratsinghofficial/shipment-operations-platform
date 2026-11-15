import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes';

export default function App() {
  return (
    <BrowserRouter>
      <div className="h-full min-h-0 overflow-hidden bg-slate-50 text-slate-900 font-sans flex flex-col">
        <AppRoutes />
      </div>
    </BrowserRouter>
  );
}
