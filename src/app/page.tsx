import {
  getFinancialSummary,
  getTaskSummary,
  getTasks,
  getMovements,
} from '@/lib/storage';
import { Header } from '@/components/layout/Header';
import { StatCard } from '@/components/ui/StatCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { formatCurrency, formatDate } from '@/lib/utils';
import { TaskModalForm } from '@/components/tasks/TaskModalForm';
import { IncomeModalForm } from '@/components/finance/IncomeModalForm';
import { ExpenseModalForm } from '@/components/finance/ExpenseModalForm';
import Link from 'next/link';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Clock,
  CheckCircle2,
  ArrowRight,
  ListTodo,
  Receipt,
} from 'lucide-react';

export default async function DashboardPage() {
  const [financial, taskSummary, tasks, movements] = await Promise.all([
    getFinancialSummary(),
    getTaskSummary(),
    getTasks(),
    getMovements(),
  ]);

  const recentTasks = tasks.slice(0, 4);
  const recentMovements = movements.slice(0, 4);

  return (
    <div className="flex flex-col min-h-full">
      <Header
        title="Panel Principal de Roott+Co"
        subtitle="Resumen general de actividades administrativas y movimientos económicos."
      />

      <div className="p-8 space-y-8 flex-1">
        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <div>
            <h3 className="text-sm font-semibold text-slate-800">Acciones Rápidas</h3>
            <p className="text-xs text-slate-500">Registra movimientos o crea tareas directamente</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <TaskModalForm />
            <IncomeModalForm />
            <ExpenseModalForm />
          </div>
        </div>

        {/* Financial KPI Cards */}
        <section className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Resumen Financiero Corporativo
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <StatCard
              title="Total Ingresos Recibidos"
              value={formatCurrency(financial.totalIngresos)}
              subtitle={`${financial.conteoIngresos} registros de ventas y cobros`}
              icon={TrendingUp}
              variant="success"
            />
            <StatCard
              title="Total Gastos Realizados"
              value={formatCurrency(financial.totalGastos)}
              subtitle={`${financial.conteoGastos} registros en diferentes categorías`}
              icon={TrendingDown}
              variant="danger"
            />
            <StatCard
              title="Saldo Disponible"
              value={formatCurrency(financial.saldoDisponible)}
              subtitle="Capital líquido disponible en caja"
              icon={Wallet}
              variant="indigo"
            />
          </div>
        </section>

        {/* Operational Tasks KPI Cards */}
        <section className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Resumen Operativo de Tareas
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <StatCard
              title="Tareas Pendientes"
              value={taskSummary.pendientes}
              subtitle="Requieren atención o inicio"
              icon={Clock}
              variant="warning"
            />
            <StatCard
              title="Tareas En Proceso"
              value={taskSummary.enProceso}
              subtitle="Actualmente en ejecución"
              icon={ListTodo}
              variant="default"
            />
            <StatCard
              title="Tareas Completadas"
              value={taskSummary.completadas}
              subtitle="Actividades finalizadas exitosamente"
              icon={CheckCircle2}
              variant="success"
            />
          </div>
        </section>

        {/* Two Column Layout: Recent Tasks & Recent Financial Movements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Tasks */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <ListTodo className="w-5 h-5 text-indigo-600" />
                  <h4 className="font-bold text-slate-900 text-base">Actividades Administrativas</h4>
                </div>
                <Link
                  href="/tareas"
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center"
                >
                  Ver todas <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </div>

              <div className="divide-y divide-slate-100 mt-2">
                {recentTasks.map((task) => (
                  <div key={task.id} className="py-3 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{task.nombre}</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Límite: {formatDate(task.fechaLimite)} • {task.responsable}
                      </p>
                    </div>
                    <StatusBadge status={task.estado} />
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-2 border-t border-slate-100 text-center">
              <Link
                href="/tareas"
                className="text-xs font-medium text-slate-500 hover:text-slate-800 inline-flex items-center"
              >
                Gestionar y asignar tareas <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>
          </div>

          {/* Recent Movements */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <Receipt className="w-5 h-5 text-emerald-600" />
                  <h4 className="font-bold text-slate-900 text-base">Últimos Movimientos Contables</h4>
                </div>
                <Link
                  href="/movimientos"
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center"
                >
                  Ver libro <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </div>

              <div className="divide-y divide-slate-100 mt-2">
                {recentMovements.map((mov) => {
                  const isIncome = mov.tipo === 'ingreso';
                  return (
                    <div
                      key={`${mov.tipo}-${mov.id}`}
                      className="py-3 flex items-center justify-between gap-4"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-800 truncate">
                          {mov.descripcion}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {formatDate(mov.fecha)} • {mov.categoria}
                        </p>
                      </div>
                      <span
                        className={`text-sm font-bold whitespace-nowrap ${
                          isIncome ? 'text-emerald-700' : 'text-rose-700'
                        }`}
                      >
                        {isIncome ? '+' : '-'}
                        {formatCurrency(mov.valor)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 mt-2 border-t border-slate-100 text-center">
              <Link
                href="/movimientos"
                className="text-xs font-medium text-slate-500 hover:text-slate-800 inline-flex items-center"
              >
                Auditar historial de ingresos y gastos <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
