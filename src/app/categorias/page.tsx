import { getCategories, getExpenses } from '@/lib/storage';
import { Header } from '@/components/layout/Header';
import { formatCurrency } from '@/lib/utils';
import {
  Utensils,
  Truck,
  Zap,
  ShoppingBag,
  FileText,
  PartyPopper,
  HelpCircle,
  Tag,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

export default async function CategoriesPage() {
  const [categories, expenses] = await Promise.all([getCategories(), getExpenses()]);

  const categoryIcons: Record<string, React.ReactNode> = {
    alimentacion: <Utensils className="w-5 h-5 text-amber-600" />,
    transporte: <Truck className="w-5 h-5 text-blue-600" />,
    servicios: <Zap className="w-5 h-5 text-indigo-600" />,
    compras: <ShoppingBag className="w-5 h-5 text-emerald-600" />,
    papeleria: <FileText className="w-5 h-5 text-purple-600" />,
    entretenimiento: <PartyPopper className="w-5 h-5 text-pink-600" />,
    otros: <HelpCircle className="w-5 h-5 text-slate-600" />,
  };

  const categoriesWithStats = categories.map((cat) => {
    const matchedExpenses = expenses.filter(
      (e) => e.categoria.toLowerCase() === cat.nombre.toLowerCase()
    );
    const totalSpent = matchedExpenses.reduce((acc, curr) => acc + (Number(curr.valor) || 0), 0);
    return {
      ...cat,
      count: matchedExpenses.length,
      totalSpent,
    };
  });

  const totalGeneralGastos = expenses.reduce((acc, curr) => acc + (Number(curr.valor) || 0), 0);

  return (
    <div className="flex flex-col min-h-full">
      <Header
        title="Catálogo de Categorías de Gastos"
        subtitle="Normativa y criterios oficiales de clasificación contable para Roott+Co."
      />

      <div className="p-8 space-y-6 flex-1">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Rubros Corporativos Autorizados</h3>
            <p className="text-xs text-slate-500">
              Cada gasto operativo debe registrarse estrictamente en una de las 7 categorías normadas.
            </p>
          </div>
          <Link
            href="/gastos"
            className="inline-flex items-center px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-lg shadow-xs transition"
          >
            Ir a Control de Gastos <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {categoriesWithStats.map((cat) => {
            const icon = categoryIcons[cat.id] || <Tag className="w-5 h-5 text-slate-600" />;
            const percentage =
              totalGeneralGastos > 0
                ? Math.round((cat.totalSpent / totalGeneralGastos) * 100)
                : 0;

            return (
              <div
                key={cat.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:shadow-sm transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center">
                      {icon}
                    </div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {cat.count} {cat.count === 1 ? 'gasto' : 'gastos'}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900">{cat.nombre}</h4>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{cat.descripcion}</p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs font-medium text-slate-400">Total Desembolsado:</span>
                    <span className="text-sm font-bold text-slate-900">
                      {formatCurrency(cat.totalSpent)}
                    </span>
                  </div>
                  {/* Mini progress bar */}
                  <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-indigo-600 h-1.5 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 text-right mt-1">
                    {percentage}% del total de gastos
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
