import { getTasks, getTaskSummary } from '@/lib/storage';
import { Header } from '@/components/layout/Header';
import { TaskModalForm } from '@/components/tasks/TaskModalForm';
import { TasksTable } from '@/components/tasks/TasksTable';
import { StatCard } from '@/components/ui/StatCard';
import { CheckSquare, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default async function TasksPage() {
  const [tasks, summary] = await Promise.all([getTasks(), getTaskSummary()]);

  return (
    <div className="flex flex-col min-h-full">
      <Header
        title="Gestión de Tareas Administrativas"
        subtitle="Organización, asignación de responsables y control de fechas de cumplimiento."
      />

      <div className="p-8 space-y-8 flex-1">
        {/* Top Header bar with Add Task */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Actividades y Pendientes</h3>
            <p className="text-xs text-slate-500">
              Registra, asigna y da seguimiento a los pendientes de la unidad administrativa de Roott+Co.
            </p>
          </div>
          <TaskModalForm />
        </div>

        {/* Task Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Actividades"
            value={summary.total}
            subtitle="Registradas en el sistema"
            icon={CheckSquare}
            variant="default"
          />
          <StatCard
            title="Tareas Pendientes"
            value={summary.pendientes}
            subtitle="Por iniciar"
            icon={Clock}
            variant="warning"
          />
          <StatCard
            title="En Proceso"
            value={summary.enProceso}
            subtitle="En ejecución"
            icon={AlertTriangle}
            variant="indigo"
          />
          <StatCard
            title="Completadas"
            value={summary.completadas}
            subtitle="Finalizadas exitosamente"
            icon={CheckCircle2}
            variant="success"
          />
        </div>

        {/* Tasks Table */}
        <TasksTable initialTasks={tasks} />
      </div>
    </div>
  );
}
