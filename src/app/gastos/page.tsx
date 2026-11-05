import { getExpenses, getCategories, getFinancialSummary } from '@/lib/storage';
import { Header } from '@/components/layout/Header';
import { ExpenseModalForm } from '@/components/finance/ExpenseModalForm';
import { ExpensesTable } from '@/components/finance/ExpensesTable';
import { StatCard } from '@/components/ui/StatCard';
import { formatCurrency } from '@/lib/utils';
import { TrendingDown, ShoppingBag, CreditCard } from 'lucide-react';

export default async function ExpensesPage() {
  const [expenses, categories, summary] = await Promise.all([
    getExpenses(),
    getCategories(),
    getFinancialSummary(),
  ]);

  return (
    <div className="flex flex-col min-h-full">
      <Header
        title="Control de Gastos Operativos"
        subtitle="Registro y clasificación de egresos corporativos por categorías de Roott+Co."
      />

      <div className="p-8 space-y-8 flex-1">
        {/* Module Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Historial de Salidas de Dinero</h3>
            <p className="text-xs text-slate-500">
              Control de pagos de servicios, compras de suministros, transporte y otros egresos.
            </p>
          </div>
          <ExpenseModalForm categories={categories} />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <StatCard
            title="Total Gastos Realizados"
            value={formatCurrency(summary.totalGastos)}
            subtitle="Acumulado total de desembolsos"
            icon={TrendingDown}
            variant="danger"
          />
          <StatCard
            title="Cantidad de Desembolsos"
            value={summary.conteoGastos}
            subtitle="Comprobantes de pago registrados"
            icon={CreditCard}
            variant="default"
          />
          <StatCard
            title="Promedio por Gasto"
            value={
              summary.conteoGastos > 0
                ? formatCurrency(Math.round(summary.totalGastos / summary.conteoGastos))
                : '$0'
            }
            subtitle="Costo medio de adquisición"
            icon={ShoppingBag}
            variant="indigo"
          />
        </div>

        {/* Expenses Table */}
        <ExpensesTable initialExpenses={expenses} />
      </div>
    </div>
  );
}
