'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { createExpenseAction } from '@/lib/actions';
import { Category } from '@/types';

interface ExpenseModalFormProps {
  categories?: Category[];
}

export function ExpenseModalForm({ categories }: ExpenseModalFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultCategories = [
    'Compras',
    'Transporte',
    'Servicios',
    'Papelería',
    'Alimentación',
    'Entretenimiento',
    'Otros',
  ];

  const categoryOptions = categories && categories.length > 0
    ? categories.map((c) => c.nombre)
    : defaultCategories;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    try {
      await createExpenseAction(formData);
      setIsOpen(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al registrar el gasto');
    } finally {
      setIsSubmitting(false);
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium rounded-lg shadow-sm transition"
      >
        <Plus className="w-4 h-4 mr-1.5" />
        Registrar Gasto
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Registrar Gasto Corporativo"
        description="Ingresa los egresos realizados por Roott+Co debidamente clasificados por categoría."
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Fecha *
              </label>
              <input
                type="date"
                name="fecha"
                defaultValue={todayStr}
                required
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Categoría *
              </label>
              <select
                name="categoria"
                defaultValue="Compras"
                required
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              >
                {categoryOptions.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Descripción del Gasto *
            </label>
            <input
              type="text"
              name="descripcion"
              required
              placeholder="Ej: Compra de papelería / Pago de servicios"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Valor (COP) *
            </label>
            <input
              type="number"
              name="valor"
              required
              min="1"
              step="1000"
              placeholder="Ej: 150000"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Observación
            </label>
            <input
              type="text"
              name="observacion"
              placeholder="Ej: Compra para abastecer el negocio / Factura mensual"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
            />
          </div>

          <div className="pt-3 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 border border-slate-300 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium rounded-lg shadow-sm transition disabled:opacity-50"
            >
              {isSubmitting ? 'Guardando...' : 'Guardar Gasto'}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}

