'use client';

import { useState } from 'react';
import { Task, TaskStatus } from '@/types';
import { StatusBadge, PriorityBadge } from '@/components/ui/StatusBadge';
import { formatDate } from '@/lib/utils';
import { updateTaskStatusAction, deleteTaskAction } from '@/lib/actions';
import { Search, Trash2, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface TasksTableProps {
  initialTasks: Task[];
}

export function TasksTable({ initialTasks }: TasksTableProps) {
  const [filterStatus, setFilterStatus] = useState<string>('todos');
  const [search, setSearch] = useState<string>('');

  const filteredTasks = initialTasks.filter((task) => {
    const matchesStatus =
      filterStatus === 'todos' || task.estado.toLowerCase() === filterStatus.toLowerCase();
    const matchesSearch =
      task.nombre.toLowerCase().includes(search.toLowerCase()) ||
      task.descripcion.toLowerCase().includes(search.toLowerCase()) ||
      task.responsable.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    await updateTaskStatusAction(taskId, newStatus);
  };

  const handleDelete = async (taskId: string) => {
    if (confirm('¿Estás seguro de eliminar esta tarea?')) {
      await deleteTaskAction(taskId);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Filters Toolbar */}
      <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-50/50">
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar tarea, responsable..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs font-medium text-slate-500 whitespace-nowrap">Estado:</span>
          {['todos', 'Pendiente', 'En proceso', 'Completada'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition whitespace-nowrap ${
                filterStatus === status
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {status === 'todos' ? 'Todas' : status}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3.5">Tarea / Descripción</th>
              <th className="px-6 py-3.5">Responsable</th>
              <th className="px-6 py-3.5">Fechas</th>
              <th className="px-6 py-3.5">Prioridad</th>
              <th className="px-6 py-3.5">Estado</th>
              <th className="px-6 py-3.5 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredTasks.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-slate-400 text-sm">
                  No se encontraron tareas registradas con los filtros actuales.
                </td>
              </tr>
            ) : (
              filteredTasks.map((task) => (
                <tr key={task.id} className="hover:bg-slate-50/70 transition">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-900">{task.nombre}</p>
                    {task.descripcion && (
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                        {task.descripcion}
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-slate-700">
                    {task.responsable}
                  </td>
                  <td className="px-6 py-4 text-xs whitespace-nowrap">
                    <div>
                      <span className="text-slate-400">Inicio:</span> {formatDate(task.fecha)}
                    </div>
                    <div className="mt-0.5 font-medium text-slate-700">
                      <span className="text-slate-400">Límite:</span> {formatDate(task.fechaLimite)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <PriorityBadge priority={task.prioridad} />
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={task.estado} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="inline-flex items-center space-x-1.5">
                      {task.estado !== 'Completada' ? (
                        <button
                          title="Marcar como Completada"
                          onClick={() => handleStatusChange(task.id, 'Completada')}
                          className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          title="Volver a poner en proceso"
                          onClick={() => handleStatusChange(task.id, 'En proceso')}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        >
                          <Clock className="w-4 h-4" />
                        </button>
                      )}
                      {task.estado === 'Pendiente' && (
                        <button
                          title="Iniciar tarea (En proceso)"
                          onClick={() => handleStatusChange(task.id, 'En proceso')}
                          className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition"
                        >
                          <AlertCircle className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        title="Eliminar tarea"
                        onClick={() => handleDelete(task.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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

