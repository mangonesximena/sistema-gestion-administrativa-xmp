'use client';

import { useState } from 'react';
import { Income } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import { deleteIncomeAction } from '@/lib/actions';
import { Search, Trash2, TrendingUp } from 'lucide-react';

interface IncomesTableProps {
  initialIncomes: Income[];
}

export function IncomesTable({ initialIncomes }: IncomesTableProps) {
  const [search, setSearch] = useState('');

  const filteredIncomes = initialIncomes.filter((item) => {
    return (
      item.descripcion.toLowerCase().includes(search.toLowerCase()) ||
      item.categoria.toLowerCase().includes(search.toLowerCase()) ||
      item.observacion.toLowerCase().includes(search.toLowerCase())
    );
  });

  const total = filteredIncomes.reduce((acc, curr) => acc + (Number(curr.valor) || 0), 0);

  const handleDelete = async (id: string) => {
    if (confirm('¿Deseas eliminar este registro de ingreso?')) {
      await deleteIncomeAction(id);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Search Bar */}
      <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por concepto, categoría u observación..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        <div className="text-xs text-slate-500">
          Total listado: <span className="font-semibold text-emerald-700">{formatCurrency(total)}</span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3.5">Fecha</th>
              <th className="px-6 py-3.5">Descripción</th>
              <th className="px-6 py-3.5">Categoría</th>
              <th className="px-6 py-3.5">Observación</th>
              <th className="px-6 py-3.5 text-right">Valor</th>
              <th className="px-6 py-3.5 text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredIncomes.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-slate-400 text-sm">
                  No hay ingresos registrados con los criterios de búsqueda.
                </td>
              </tr>
            ) : (
              filteredIncomes.map((inc) => (
                <tr key={inc.id} className="hover:bg-slate-50/70 transition">
                  <td className="px-6 py-4 text-xs font-medium text-slate-700 whitespace-nowrap">
                    {formatDate(inc.fecha)}
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-900">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span>{inc.descripcion}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                      {inc.categoria}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500">
                    {inc.observacion || '-'}
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-emerald-700 whitespace-nowrap">
                    +{formatCurrency(inc.valor)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(inc.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      title="Eliminar ingreso"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

