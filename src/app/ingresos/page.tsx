import { getIncomes, getFinancialSummary } from '@/lib/storage';
import { Header } from '@/components/layout/Header';
import { IncomeModalForm } from '@/components/finance/IncomeModalForm';
import { IncomesTable } from '@/components/finance/IncomesTable';
import { StatCard } from '@/components/ui/StatCard';
import { formatCurrency } from '@/lib/utils';
import { TrendingUp, DollarSign, Receipt } from 'lucide-react';

export default async function IncomesPage() {
  const [incomes, summary] = await Promise.all([getIncomes(), getFinancialSummary()]);

  return (
    <div className="flex flex-col min-h-full">
      <Header
        title="Control de Ingresos"
        subtitle="Registro y consulta del dinero recibido por ventas de productos y pagos de clientes."
      />

      <div className="p-8 space-y-8 flex-1">
        {/* Module Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Historial de Entradas de Dinero</h3>
            <p className="text-xs text-slate-500">
              Control de ventas de productos y cuentas cobradas de Roott+Co.
            </p>
          </div>
          <IncomeModalForm />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <StatCard
            title="Total Ingresos Recaudados"
            value={formatCurrency(summary.totalIngresos)}
            subtitle="Acumulado histórico registrado"
            icon={DollarSign}
            variant="success"
          />
          <StatCard
            title="Cantidad de Transacciones"
            value={summary.conteoIngresos}
            subtitle="Facturas / recibos de venta"
            icon={Receipt}
            variant="default"
          />
          <StatCard
            title="Promedio por Ingreso"
            value={
              summary.conteoIngresos > 0
                ? formatCurrency(Math.round(summary.totalIngresos / summary.conteoIngresos))
                : '$0'
            }
            subtitle="Ticket promedio recaudado"
            icon={TrendingUp}
            variant="indigo"
          />
        </div>

        {/* Incomes Table */}
        <IncomesTable initialIncomes={incomes} />
      </div>
    </div>
  );
}
