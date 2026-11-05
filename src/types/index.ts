export type TaskPriority = 'Alta' | 'Media' | 'Baja';
export type TaskStatus = 'Pendiente' | 'En proceso' | 'Completada';

export interface Task {
  id: string;
  nombre: string;
  descripcion: string;
  fecha: string;        // YYYY-MM-DD
  fechaLimite: string;  // YYYY-MM-DD
  prioridad: TaskPriority;
  estado: TaskStatus;
  responsable: string;
}

export interface Income {
  id: string;
  fecha: string;        // YYYY-MM-DD
  descripcion: string;
  categoria: string;
  valor: number;
  observacion: string;
}

export interface Expense {
  id: string;
  fecha: string;        // YYYY-MM-DD
  descripcion: string;
  categoria: string;
  valor: number;
  observacion: string;
}

export interface Category {
  id: string;
  nombre: string;
  descripcion: string;
  color?: string;
}

export type MovementType = 'ingreso' | 'gasto';

export interface Movement {
  id: string;
  tipo: MovementType;
  fecha: string;
  descripcion: string;
  categoria: string;
  valor: number;
  observacion: string;
}

export interface FinancialSummary {
  totalIngresos: number;
  totalGastos: number;
  saldoDisponible: number;
  conteoIngresos: number;
  conteoGastos: number;
}

export interface TaskSummary {
  total: number;
  pendientes: number;
  enProceso: number;
  completadas: number;
}

