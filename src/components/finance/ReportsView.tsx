'use client';

import { useState } from 'react';
import { Movement, Category } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Calendar, Printer, TrendingUp, TrendingDown, DollarSign, PieChart } from 'lucide-react';

interface ReportsViewProps {
  movements: Movement[];
  categories: Category[];
}

export function ReportsView({ movements, categories }: ReportsViewProps) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const filteredMovements = movements.filter((m) => {
    const matchesStart = !startDate || m.fecha >= startDate;
    const matchesEnd = !endDate || m.fecha <= endDate;
    return matchesStart && matchesEnd;
  });

  const totalIngresos = filteredMovements
    .filter((m) => m.tipo === 'ingreso')
    .reduce((acc, curr) => acc + (Number(curr.valor) || 0), 0);

  const totalGastos = filteredMovements
    .filter((m) => m.tipo === 'gasto')
    .reduce((acc, curr) => acc + (Number(curr.valor) || 0), 0);

  const saldoDisponible = totalIngresos - totalGastos;
  const margenRetencion = totalIngresos > 0 ? Math.round((saldoDisponible / totalIngresos) * 100) : 0;

  // Breakdown of expenses by category
  const expenseByCategory = categories.map((cat) => {
    const total = filteredMovements
      .filter((m) => m.tipo === 'gasto' && m.categoria.toLowerCase() === cat.nombre.toLowerCase())
      .reduce((acc, curr) => acc + (Number(curr.valor) || 0), 0);
    const percentage = totalGastos > 0 ? Math.round((total / totalGastos) * 100) : 0;
    return {
      nombre: cat.nombre,
      total,
      percentage,
    };
  }).filter((item) => item.total > 0 || totalGastos === 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Date Filter & Actions Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <div className="flex items-center space-x-2 text-slate-700">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span className="font-medium text-xs uppercase tracking-wider text-slate-500">Filtrar Período:</span>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
            <span className="text-slate-400 text-xs">hasta</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          {(startDate || endDate) && (
            <button
              onClick={() => {
                setStartDate('');
                setEndDate('');
              }}
              className="text-xs text-indigo-600 hover:underline font-medium"
            >
              Ver todo el historial
            </button>
          )}
        </div>

        <button
          onClick={handlePrint}
          className="inline-flex items-center px-3.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
        >
          <Printer className="w-4 h-4 mr-1.5" />
          Imprimir Reporte
        </button>
      </div>

      {/* KPI Financial Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-emerald-100 p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Ingresos Totales</p>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-emerald-700 mt-2">{formatCurrency(totalIngresos)}</p>
          <p className="text-xs text-slate-500 mt-1">Recibido en el período</p>
        </div>

        <div className="bg-white rounded-xl border border-rose-100 p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Gastos Totales</p>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-rose-700 mt-2">{formatCurrency(totalGastos)}</p>
          <p className="text-xs text-slate-500 mt-1">Egresos operativos</p>
        </div>

        <div className="bg-white rounded-xl border border-indigo-100 p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Saldo Disponible</p>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className={`text-2xl font-bold mt-2 ${saldoDisponible >= 0 ? 'text-indigo-900' : 'text-rose-700'}`}>
            {formatCurrency(saldoDisponible)}
          </p>
          <p className="text-xs text-slate-500 mt-1">Diferencial económico</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Margen Disponible</p>
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
              <PieChart className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{margenRetencion}%</p>
          <p className="text-xs text-slate-500 mt-1">Del total recaudado</p>
        </div>
      </div>

      {/* Expenses Breakdown by Category */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs">
        <h3 className="text-base font-bold text-slate-900 mb-1">Distribución de Gastos por Categoría</h3>
        <p className="text-xs text-slate-500 mb-6">
          Comportamiento del gasto empresarial clasificado según los rubros oficiales de Roott+Co.
        </p>

        {totalGastos === 0 ? (
          <p className="text-sm text-slate-400 py-4 text-center">No hay gastos en el período seleccionado.</p>
        ) : (
          <div className="space-y-4">
            {expenseByCategory.map((cat) => (
              <div key={cat.nombre} className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium text-slate-700">
                  <span>{cat.nombre}</span>
                  <span>
                    {formatCurrency(cat.total)} ({cat.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${cat.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50">
          <h4 className="text-sm font-bold text-slate-900">
            Detalle de Movimientos Incluidos en el Período ({filteredMovements.length})
          </h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">Tipo</th>
                <th className="px-6 py-3">Fecha</th>
                <th className="px-6 py-3">Concepto</th>
                <th className="px-6 py-3">Categoría</th>
                <th className="px-6 py-3 text-right">Monto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMovements.map((m) => (
                <tr key={`${m.tipo}-${m.id}`} className="hover:bg-slate-50/50">
                  <td className="px-6 py-3.5 capitalize text-xs font-semibold">
                    <span className={m.tipo === 'ingreso' ? 'text-emerald-600' : 'text-rose-600'}>
                      {m.tipo}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-xs text-slate-700 whitespace-nowrap">{formatDate(m.fecha)}</td>
                  <td className="px-6 py-3.5 text-slate-900 font-medium">{m.descripcion}</td>
                  <td className="px-6 py-3.5 text-xs text-slate-600">{m.categoria}</td>
                  <td className={`px-6 py-3.5 text-right font-bold whitespace-nowrap ${
                    m.tipo === 'ingreso' ? 'text-emerald-700' : 'text-rose-700'
                  }`}>
                    {m.tipo === 'ingreso' ? '+' : '-'}{formatCurrency(m.valor)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

