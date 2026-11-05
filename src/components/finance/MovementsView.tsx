'use client';

import { useState } from 'react';
import { Movement } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Search, ArrowDownRight, ArrowUpRight, Filter, Calendar } from 'lucide-react';

interface MovementsViewProps {
  initialMovements: Movement[];
}

export function MovementsView({ initialMovements }: MovementsViewProps) {
  const [filterType, setFilterType] = useState<'todos' | 'ingreso' | 'gasto'>('todos');
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const filtered = initialMovements.filter((m) => {
    const matchesType = filterType === 'todos' || m.tipo === filterType;
    const matchesSearch =
      m.descripcion.toLowerCase().includes(search.toLowerCase()) ||
      m.categoria.toLowerCase().includes(search.toLowerCase()) ||
      m.observacion.toLowerCase().includes(search.toLowerCase());
    const matchesStart = !startDate || m.fecha >= startDate;
    const matchesEnd = !endDate || m.fecha <= endDate;

    return matchesType && matchesSearch && matchesStart && matchesEnd;
  });

  const totalIngresos = filtered
    .filter((m) => m.tipo === 'ingreso')
    .reduce((acc, curr) => acc + (Number(curr.valor) || 0), 0);

  const totalGastos = filtered
    .filter((m) => m.tipo === 'gasto')
    .reduce((acc, curr) => acc + (Number(curr.valor) || 0), 0);

  const balanceNeto = totalIngresos - totalGastos;

  return (
    <div className="space-y-6">
      {/* Summary KPI Cards of the filtered view */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Ingresos (Filtrados)</p>
          <p className="text-xl font-bold text-emerald-600 mt-1">{formatCurrency(totalIngresos)}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Gastos (Filtrados)</p>
          <p className="text-xl font-bold text-rose-600 mt-1">{formatCurrency(totalGastos)}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Balance del Período</p>
          <p className={`text-xl font-bold mt-1 ${balanceNeto >= 0 ? 'text-indigo-600' : 'text-rose-600'}`}>
            {formatCurrency(balanceNeto)}
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar en movimientos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          {/* Type Filter Buttons */}
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs font-medium text-slate-500">Tipo:</span>
            {(['todos', 'ingreso', 'gasto'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1 text-xs font-medium rounded-lg capitalize transition ${
                  filterType === type
                    ? 'bg-slate-900 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {type === 'todos' ? 'Todos' : type === 'ingreso' ? 'Ingresos' : 'Gastos'}
              </button>
            ))}
          </div>
        </div>

        {/* Date Filter Range */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-3 text-xs text-slate-600">
          <div className="flex items-center space-x-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-medium text-slate-500">Desde:</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-2 py-1 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs"
            />
          </div>

          <div className="flex items-center space-x-1.5">
            <span className="font-medium text-slate-500">Hasta:</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-2 py-1 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs"
            />
          </div>

          {(startDate || endDate) && (
            <button
              onClick={() => {
                setStartDate('');
                setEndDate('');
              }}
              className="text-indigo-600 hover:underline font-medium text-xs ml-auto"
            >
              Limpiar fechas
            </button>
          )}
        </div>
      </div>

      {/* Movements Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Tipo</th>
                <th className="px-6 py-3.5">Fecha</th>
                <th className="px-6 py-3.5">Concepto / Descripción</th>
                <th className="px-6 py-3.5">Categoría</th>
                <th className="px-6 py-3.5">Observación</th>
                <th className="px-6 py-3.5 text-right">Monto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-slate-400 text-sm">
                    No se encontraron movimientos económicos con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                filtered.map((mov) => {
                  const isIncome = mov.tipo === 'ingreso';
                  return (
                    <tr key={`${mov.tipo}-${mov.id}`} className="hover:bg-slate-50/70 transition">
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${
                            isIncome
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
                              : 'bg-rose-50 text-rose-700 border-rose-200/80'
                          }`}
                        >
                          {isIncome ? (
                            <ArrowDownRight className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                          ) : (
                            <ArrowUpRight className="w-3.5 h-3.5 mr-1 text-rose-600" />
                          )}
                          {isIncome ? 'Ingreso' : 'Gasto'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-slate-700 whitespace-nowrap">
                        {formatDate(mov.fecha)}
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-900">
                        {mov.descripcion}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                          {mov.categoria}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500">
                        {mov.observacion || '-'}
                      </td>
                      <td
                        className={`px-6 py-4 text-right font-bold whitespace-nowrap ${
                          isIncome ? 'text-emerald-700' : 'text-rose-700'
                        }`}
                      >
                        {isIncome ? '+' : '-'}
                        {formatCurrency(mov.valor)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

