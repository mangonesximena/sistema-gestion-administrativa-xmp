import { TaskPriority, TaskStatus } from '@/types';

export function StatusBadge({ status }: { status: TaskStatus }) {
  const styles = {
    Pendiente: 'bg-amber-50 text-amber-700 border-amber-200/80',
    'En proceso': 'bg-blue-50 text-blue-700 border-blue-200/80',
    Completada: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
  }[status] || 'bg-slate-50 text-slate-700 border-slate-200';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-80" />
      {status}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  const styles = {
    Alta: 'bg-rose-50 text-rose-700 border-rose-200/80',
    Media: 'bg-amber-50 text-amber-700 border-amber-200/80',
    Baja: 'bg-slate-50 text-slate-600 border-slate-200/80',
  }[priority] || 'bg-slate-50 text-slate-700 border-slate-200';

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${styles}`}>
      {priority}
    </span>
  );
}

