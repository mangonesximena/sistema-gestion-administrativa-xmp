'use client';

import { useState } from 'react';
import { Expense } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import { deleteExpenseAction } from '@/lib/actions';
import { Search, Trash2, TrendingDown } from 'lucide-react';

interface ExpensesTableProps {
  initialExpenses: Expense[];
}

export function ExpensesTable({ initialExpenses }: ExpensesTableProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todas');

  const categories = [
    'todas',
    'Compras',
    'Transporte',
    'Servicios',
    'Papelería',
    'Alimentación',
    'Entretenimiento',
    'Otros',
  ];

  const filteredExpenses = initialExpenses.filter((item) => {
    const matchesCategory =
      selectedCategory === 'todas' ||
      item.categoria.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      item.descripcion.toLowerCase().includes(search.toLowerCase()) ||
      item.categoria.toLowerCase().includes(search.toLowerCase()) ||
      item.observacion.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const total = filteredExpenses.reduce((acc, curr) => acc + (Number(curr.valor) || 0), 0);

  const handleDelete = async (id: string) => {
    if (confirm('¿Deseas eliminar este registro de gasto?')) {
      await deleteExpenseAction(id);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Search & Category Filter Toolbar */}
      <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-50/50">
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar concepto u observación..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
          />
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs font-medium text-slate-500 whitespace-nowrap">Categoría:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat === 'todas' ? 'Todas' : cat}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 py-2.5 bg-slate-50/30 border-b border-slate-100 text-xs text-slate-500 text-right">
        Total filtrado: <span className="font-semibold text-rose-700">{formatCurrency(total)}</span>
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
            {filteredExpenses.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-slate-400 text-sm">
                  No hay gastos registrados que coincidan con la búsqueda.
                </td>
              </tr>
            ) : (
              filteredExpenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-slate-50/70 transition">
                  <td className="px-6 py-4 text-xs font-medium text-slate-700 whitespace-nowrap">
                    {formatDate(exp.fecha)}
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-900">
                    <div className="flex items-center space-x-2">
                      <TrendingDown className="w-4 h-4 text-rose-500 flex-shrink-0" />
                      <span>{exp.descripcion}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200/80">
                      {exp.categoria}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500">
                    {exp.observacion || '-'}
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-rose-700 whitespace-nowrap">
                    -{formatCurrency(exp.valor)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(exp.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      title="Eliminar gasto"
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

