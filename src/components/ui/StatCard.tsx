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
    <div className="bg-bg-card p-6 rounded-2xl border border-border-main shadow-sm hover:shadow-md hover:border-brand-orange/30 transition-all group">
      <div className="flex items-center justify-between mb-4">
        <div className={`${color} p-2.5 bg-surface-subtle rounded-xl group-hover:scale-110 transition-transform`}>
          <Icon size={24} />
        </div>
        {trend && (
          <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${trend.startsWith('+') || trend === 'Crítico' ? 'bg-brand-orange/10 text-brand-orange' : 'bg-brand-purple/10 text-brand-purple'}`}>
            {trend}
          </span>
        )}
      </div>
      <p className="text-text-secondary text-[11px] font-black uppercase tracking-widest opacity-70">{label}</p>
      <p className="text-3xl font-black text-text-primary mt-1 tracking-tight">{value}</p>
    </div>
  );
}
