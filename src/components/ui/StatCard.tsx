import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: 'default' | 'success' | 'danger' | 'warning' | 'indigo';
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'default',
}: StatCardProps) {
  const variantStyles = {
    default: {
      border: 'border-slate-200',
      iconBg: 'bg-slate-100 text-slate-700',
      valueColor: 'text-slate-900',
    },
    indigo: {
      border: 'border-indigo-100',
      iconBg: 'bg-indigo-50 text-indigo-600',
      valueColor: 'text-indigo-900',
    },
    success: {
      border: 'border-emerald-100',
      iconBg: 'bg-emerald-50 text-emerald-600',
      valueColor: 'text-emerald-700',
    },
    danger: {
      border: 'border-rose-100',
      iconBg: 'bg-rose-50 text-rose-600',
      valueColor: 'text-rose-700',
    },
    warning: {
      border: 'border-amber-100',
      iconBg: 'bg-amber-50 text-amber-600',
      valueColor: 'text-amber-800',
    },
  }[variant];

  return (
    <div className={`bg-white rounded-xl border ${variantStyles.border} p-5 shadow-sm transition hover:shadow`}>
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
        <div className={`w-9 h-9 rounded-lg ${variantStyles.iconBg} flex items-center justify-center`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="mt-3">
        <p className={`text-2xl font-bold tracking-tight ${variantStyles.valueColor}`}>{value}</p>
        {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}

