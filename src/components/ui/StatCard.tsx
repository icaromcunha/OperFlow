import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  trend?: string;
  icon: LucideIcon;
  color: string;
}

export function StatCard({ label, value, trend, icon: Icon, color }: StatCardProps) {
  return (
    <div className="bg-bg-card p-6 rounded-2xl border border-border-main shadow-sm hover:border-brand-orange/30 transition-colors group">
      <div className="flex items-center justify-between mb-4">
        <Icon className={`${color} p-2 bg-white/5 rounded-xl size-10 group-hover:scale-110 transition-transform`} />
        {trend && (
          <span className={`text-[10px] font-black px-2 py-1 rounded-full ${trend.startsWith('+') || trend === 'Crítico' ? 'bg-brand-orange/10 text-brand-orange' : 'bg-brand-purple/10 text-brand-purple'}`}>
            {trend}
          </span>
        )}
      </div>
      <p className="text-text-secondary text-xs font-medium uppercase tracking-wider">{label}</p>
      <p className="text-2xl font-bold text-white mt-1">{value}</p>
    </div>
  );
}
