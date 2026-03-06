import React from "react";
import { LucideIcon, Settings } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  iconBg: string;
  iconColor: string;
}

export const StatCard: React.FC<StatCardProps> = ({ icon: Icon, label, value, iconBg, iconColor }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-6">
    <div className={`size-16 ${iconBg} rounded-2xl flex items-center justify-center`}>
      <Icon className={iconColor} size={32} />
    </div>
    <div>
      <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{label}</p>
      <p className="text-4xl font-black text-slate-800 tracking-tight">{value}</p>
    </div>
  </div>
);

interface ChannelCardProps {
  name: string;
  status: string;
  stock: number;
  fulfillment: string;
  icon: string; // URL or identifier
  isSyncing?: boolean;
}

export const ChannelCard: React.FC<ChannelCardProps> = ({ name, status, stock, fulfillment, icon }) => {
  // Simple mapping for icons based on name
  const getIcon = () => {
    if (name.includes("Mercado")) return "https://http2.mlstatic.com/frontend-assets/ui-navigation/5.19.1/mercadolibre/logo__large_plus.png";
    if (name.includes("Amazon")) return "https://upload.wikimedia.org/wikipedia/commons/4/4a/Amazon_icon.svg";
    if (name.includes("Shopee")) return "https://upload.wikimedia.org/wikipedia/commons/f/fe/Shopee.svg";
    return "";
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
      <div className="p-6 flex-1">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="size-10 flex items-center justify-center overflow-hidden">
              <img src={getIcon()} alt={name} className="max-h-full max-w-full object-contain" referrerPolicy="no-referrer" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800">{name}</h4>
              <span className="text-[10px] font-bold uppercase bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded">
                {status}
              </span>
            </div>
          </div>
          {name === "Mercado Livre" && <div className="text-blue-500">⚡</div>}
          {name === "Amazon" && <div className="text-orange-500">🔖</div>}
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-slate-50 p-3 rounded-xl">
            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Estoque</p>
            <p className="text-sm font-bold text-slate-700">{stock} un.</p>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl">
            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Fulfillment</p>
            <p className={`text-sm font-bold ${fulfillment === 'Inativo' ? 'text-red-500' : 'text-emerald-500'}`}>
              {fulfillment}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

interface InsightCardProps {
  title: string;
  description: string;
}

export const InsightCard: React.FC<InsightCardProps> = ({ title, description }) => (
  <div className="bg-[#1E293B] rounded-2xl p-8 text-white flex flex-col h-full">
    <div className="flex items-center gap-3 mb-6">
      <div className="size-10 bg-[#FACC15] rounded-xl flex items-center justify-center">
        <Settings className="text-[#1E293B]" size={20} />
      </div>
      <h3 className="font-bold text-lg">{title}</h3>
    </div>
    <p className="text-slate-400 text-sm leading-relaxed mb-8 flex-1">
      {description}
    </p>
    <button className="w-full py-3.5 bg-[#FACC15] hover:bg-yellow-500 text-[#1E293B] font-bold rounded-xl flex items-center justify-center gap-2 transition-all">
      Ver Plano de Ação <span>→</span>
    </button>
  </div>
);
