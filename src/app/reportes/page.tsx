import { getMovements, getCategories } from '@/lib/storage';
import { Header } from '@/components/layout/Header';
import { ReportsView } from '@/components/finance/ReportsView';

export default async function ReportsPage() {
  const [movements, categories] = await Promise.all([
    getMovements(),
    getCategories(),
  ]);

  return (
    <div className="flex flex-col min-h-full">
      <Header
        title="Reportes y Análisis Financiero"
        subtitle="Consulta de totales por período determinado para la toma de decisiones administrativas."
      />

      <div className="p-8 space-y-6 flex-1">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Auditoría y Desglose por Fechas</h3>
          <p className="text-xs text-slate-500">
            Evalúa cuánto dinero se ha recibido, cuánto se ha gastado y el saldo resultante en cualquier rango temporal.
          </p>
        </div>

        <ReportsView movements={movements} categories={categories} />
      </div>
    </div>
  );
}
