import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard } from 'lucide-react';

function backTo(pathname) {
  if (pathname === '/') return null;
  if (pathname === '/shipments') return '/';
  if (pathname.startsWith('/shipments/')) return '/shipments';
  return '/';
}

export default function AppLayout() {
  const { pathname } = useLocation();
  const backHref = backTo(pathname);

  return (
    <div className="h-full min-h-0 flex flex-col overflow-hidden bg-slate-50">
      <header className="shrink-0 h-14 flex items-center justify-between gap-4 px-4 border-b border-slate-200 bg-white sticky top-0 z-20">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
            <LayoutDashboard size={18} aria-hidden="true" />
          </span>
          <span className="text-base font-semibold text-slate-900 truncate">Operations Panel</span>
        </div>
        {backHref ? (
          <Link
            to={backHref}
            className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
          >
            Back
          </Link>
        ) : null}
      </header>
      <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
        <Outlet />
      </div>
    </div>
  );
}
