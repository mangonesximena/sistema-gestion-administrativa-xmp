'use server';

import { revalidatePath } from 'next/cache';
import {
  getTasks,
  saveTasks,
  getIncomes,
  saveIncomes,
  getExpenses,
  saveExpenses,
} from './storage';
import { generateId } from './utils';
import { Task, TaskPriority, TaskStatus, Income, Expense } from '@/types';

// ==================== TAREAS ====================

export async function createTaskAction(formData: FormData) {
  const nombre = formData.get('nombre')?.toString().trim();
  const descripcion = formData.get('descripcion')?.toString().trim() || '';
  const fecha = formData.get('fecha')?.toString() || new Date().toISOString().split('T')[0];
  const fechaLimite = formData.get('fechaLimite')?.toString() || fecha;
  const prioridad = (formData.get('prioridad')?.toString() as TaskPriority) || 'Media';
  const estado = (formData.get('estado')?.toString() as TaskStatus) || 'Pendiente';
  const responsable = formData.get('responsable')?.toString().trim() || 'Sin asignar';

  if (!nombre) {
    throw new Error('El nombre de la tarea es obligatorio');
  }

  const tasks = await getTasks();
  const newTask: Task = {
    id: generateId('task'),
    nombre,
    descripcion,
    fecha,
    fechaLimite,
    prioridad,
    estado,
    responsable,
  };

  tasks.unshift(newTask);
  await saveTasks(tasks);

  revalidatePath('/tareas');
  revalidatePath('/');
  return { success: true };
}

export async function updateTaskStatusAction(id: string, status: TaskStatus) {
  const tasks = await getTasks();
  const index = tasks.findIndex((t) => t.id === id);
  if (index !== -1) {
    tasks[index].estado = status;
    await saveTasks(tasks);
    revalidatePath('/tareas');
    revalidatePath('/');
  }
  return { success: true };
}

export async function deleteTaskAction(id: string) {
  const tasks = await getTasks();
  const filtered = tasks.filter((t) => t.id !== id);
  await saveTasks(filtered);

  revalidatePath('/tareas');
  revalidatePath('/');
  return { success: true };
}

// ==================== INGRESOS ====================

export async function createIncomeAction(formData: FormData) {
  const fecha = formData.get('fecha')?.toString() || new Date().toISOString().split('T')[0];
  const descripcion = formData.get('descripcion')?.toString().trim();
  const categoria = formData.get('categoria')?.toString().trim() || 'Ventas';
  const valor = Number(formData.get('valor')) || 0;
  const observacion = formData.get('observacion')?.toString().trim() || '';

  if (!descripcion) {
    throw new Error('La descripción del ingreso es obligatoria');
  }
  if (valor <= 0) {
    throw new Error('El valor debe ser mayor a cero');
  }

  const incomes = await getIncomes();
  const newIncome: Income = {
    id: generateId('inc'),
    fecha,
    descripcion,
    categoria,
    valor,
    observacion,
  };

  incomes.unshift(newIncome);
  await saveIncomes(incomes);

  revalidatePath('/ingresos');
  revalidatePath('/movimientos');
  revalidatePath('/reportes');
  revalidatePath('/');
  return { success: true };
}

export async function deleteIncomeAction(id: string) {
  const incomes = await getIncomes();
  const filtered = incomes.filter((i) => i.id !== id);
  await saveIncomes(filtered);

  revalidatePath('/ingresos');
  revalidatePath('/movimientos');
  revalidatePath('/reportes');
  revalidatePath('/');
  return { success: true };
}

// ==================== GASTOS ====================

export async function createExpenseAction(formData: FormData) {
  const fecha = formData.get('fecha')?.toString() || new Date().toISOString().split('T')[0];
  const descripcion = formData.get('descripcion')?.toString().trim();
  const categoria = formData.get('categoria')?.toString().trim() || 'Otros';
  const valor = Number(formData.get('valor')) || 0;
  const observacion = formData.get('observacion')?.toString().trim() || '';

  if (!descripcion) {
    throw new Error('La descripción del gasto es obligatoria');
  }
  if (valor <= 0) {
    throw new Error('El valor debe ser mayor a cero');
  }

  const expenses = await getExpenses();
  const newExpense: Expense = {
    id: generateId('exp'),
    fecha,
    descripcion,
    categoria,
    valor,
    observacion,
  };

  expenses.unshift(newExpense);
  await saveExpenses(expenses);

  revalidatePath('/gastos');
  revalidatePath('/movimientos');
  revalidatePath('/reportes');
  revalidatePath('/categorias');
  revalidatePath('/');
  return { success: true };
}

export async function deleteExpenseAction(id: string) {
  const expenses = await getExpenses();
  const filtered = expenses.filter((e) => e.id !== id);
  await saveExpenses(filtered);

  revalidatePath('/gastos');
  revalidatePath('/movimientos');
  revalidatePath('/reportes');
  revalidatePath('/categorias');
  revalidatePath('/');
  return { success: true };
}

