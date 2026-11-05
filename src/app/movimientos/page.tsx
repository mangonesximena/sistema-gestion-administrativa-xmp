import { getMovements } from '@/lib/storage';
import { Header } from '@/components/layout/Header';
import { MovementsView } from '@/components/finance/MovementsView';

export default async function MovementsPage() {
  const movements = await getMovements();

  return (
    <div className="flex flex-col min-h-full">
      <Header
        title="Libro de Movimientos Económicos"
        subtitle="Consulta unificada y cronológica de todos los ingresos y gastos de Roott+Co."
      />

      <div className="p-8 space-y-6 flex-1">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Libro Diario de Transacciones</h3>
          <p className="text-xs text-slate-500">
            Filtra transacciones por tipo de movimiento, rango de fechas y conceptos registrados.
          </p>
        </div>

        <MovementsView initialMovements={movements} />
      </div>
    </div>
  );
}
