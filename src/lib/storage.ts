import fs from 'node:fs/promises';
import path from 'node:path';
import {
  Task,
  Income,
  Expense,
  Category,
  Movement,
  FinancialSummary,
  TaskSummary,
} from '@/types';

const DATA_DIR = path.join(process.cwd(), 'data');

const TASKS_FILE = path.join(DATA_DIR, 'tasks.json');
const INCOMES_FILE = path.join(DATA_DIR, 'incomes.json');
const EXPENSES_FILE = path.join(DATA_DIR, 'expenses.json');
const CATEGORIES_FILE = path.join(DATA_DIR, 'categories.json');

async function ensureDataDirectory(): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (error) {
    console.error('Error ensuring data directory:', error);
  }
}

async function readJsonFile<T>(filePath: string, fallback: T): Promise<T> {
  await ensureDataDirectory();
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data) as T;
  } catch (error: unknown) {
    const nodeError = error as NodeJS.ErrnoException;
    if (nodeError.code === 'ENOENT') {
      await writeJsonFile(filePath, fallback);
      return fallback;
    }
    console.error(`Error reading ${filePath}:`, error);
    return fallback;
  }
}

async function writeJsonFile<T>(filePath: string, data: T): Promise<void> {
  await ensureDataDirectory();
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

// Tasks
export async function getTasks(): Promise<Task[]> {
  return readJsonFile<Task[]>(TASKS_FILE, []);
}

export async function saveTasks(tasks: Task[]): Promise<void> {
  await writeJsonFile(TASKS_FILE, tasks);
}

// Incomes
export async function getIncomes(): Promise<Income[]> {
  return readJsonFile<Income[]>(INCOMES_FILE, []);
}

export async function saveIncomes(incomes: Income[]): Promise<void> {
  await writeJsonFile(INCOMES_FILE, incomes);
}

// Expenses
export async function getExpenses(): Promise<Expense[]> {
  return readJsonFile<Expense[]>(EXPENSES_FILE, []);
}

export async function saveExpenses(expenses: Expense[]): Promise<void> {
  await writeJsonFile(EXPENSES_FILE, expenses);
}

// Categories
export async function getCategories(): Promise<Category[]> {
  return readJsonFile<Category[]>(CATEGORIES_FILE, []);
}

export async function saveCategories(categories: Category[]): Promise<void> {
  await writeJsonFile(CATEGORIES_FILE, categories);
}

// Financial Summary
export async function getFinancialSummary(): Promise<FinancialSummary> {
  const [incomes, expenses] = await Promise.all([getIncomes(), getExpenses()]);

  const totalIngresos = incomes.reduce((acc, curr) => acc + (Number(curr.valor) || 0), 0);
  const totalGastos = expenses.reduce((acc, curr) => acc + (Number(curr.valor) || 0), 0);

  return {
    totalIngresos,
    totalGastos,
    saldoDisponible: totalIngresos - totalGastos,
    conteoIngresos: incomes.length,
    conteoGastos: expenses.length,
  };
}

// Task Summary
export async function getTaskSummary(): Promise<TaskSummary> {
  const tasks = await getTasks();
  const pendientes = tasks.filter((t) => t.estado === 'Pendiente').length;
  const enProceso = tasks.filter((t) => t.estado === 'En proceso').length;
  const completadas = tasks.filter((t) => t.estado === 'Completada').length;

  return {
    total: tasks.length,
    pendientes,
    enProceso,
    completadas,
  };
}

// Movements (Unified Incomes and Expenses)
export async function getMovements(startDate?: string, endDate?: string): Promise<Movement[]> {
  const [incomes, expenses] = await Promise.all([getIncomes(), getExpenses()]);

  const incomeMovements: Movement[] = incomes.map((inc) => ({
    id: inc.id,
    tipo: 'ingreso',
    fecha: inc.fecha,
    descripcion: inc.descripcion,
    categoria: inc.categoria,
    valor: inc.valor,
    observacion: inc.observacion,
  }));

  const expenseMovements: Movement[] = expenses.map((exp) => ({
    id: exp.id,
    tipo: 'gasto',
    fecha: exp.fecha,
    descripcion: exp.descripcion,
    categoria: exp.categoria,
    valor: exp.valor,
    observacion: exp.observacion,
  }));

  let movements = [...incomeMovements, ...expenseMovements];

  if (startDate) {
    movements = movements.filter((m) => m.fecha >= startDate);
  }
  if (endDate) {
    movements = movements.filter((m) => m.fecha <= endDate);
  }

  // Sort descending by date
  return movements.sort((a, b) => b.fecha.localeCompare(a.fecha));
}

