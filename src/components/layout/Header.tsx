'use client';

import { Calendar, UserCircle2 } from 'lucide-react';

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const today = new Intl.DateTimeFormat('es-CO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  return (
    <header className="bg-white border-b border-slate-200 px-8 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          {title || 'Sistema de Gestión Administrativa'}
        </h2>
        {subtitle && (
          <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center space-x-6 self-end sm:self-auto">
        <div className="flex items-center text-xs text-slate-500 bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-md">
          <Calendar className="w-3.5 h-3.5 mr-2 text-slate-400 capitalize" />
          <span className="capitalize">{today}</span>
        </div>

        <div className="flex items-center space-x-2 text-xs font-medium text-slate-700 bg-indigo-50 border border-indigo-100/80 px-3 py-1.5 rounded-md">
          <UserCircle2 className="w-4 h-4 text-indigo-600" />
          <span>Unidad Administrativa</span>
        </div>
      </div>
    </header>
  );
}

