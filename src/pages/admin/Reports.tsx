import { useState, useEffect } from "react";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Clock, 
  Download,
  Calendar,
  ChevronDown
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  Cell,
  PieChart,
  Pie
} from "recharts";
import api from "../../services/api";

export default function AdminReports() {
  const [protocols, setProtocols] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/protocols");
        setProtocols(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Group protocols by client
  const protocolsByClient = protocols.reduce((acc: any, p: any) => {
    const clientName = p.cliente_nome || "Outros";
    if (!acc[clientName]) acc[clientName] = 0;
    acc[clientName]++;
    return acc;
  }, {});

  const clientData = Object.keys(protocolsByClient).map(name => ({
    name,
    value: protocolsByClient[name]
  })).sort((a, b) => b.value - a.value).slice(0, 5);

  const COLORS = ['#0a47c2', '#fbbf24', '#10b981', '#ef4444', '#8b5cf6'];

  const data = [
    { name: "Seg", protocolos: 45, resolvidos: 38 },
    { name: "Ter", protocolos: 52, resolvidos: 48 },
    { name: "Qua", protocolos: 48, resolvidos: 42 },
    { name: "Qui", protocolos: 61, resolvidos: 55 },
    { name: "Sex", protocolos: 55, resolvidos: 50 },
    { name: "Sáb", protocolos: 32, resolvidos: 30 },
    { name: "Dom", protocolos: 25, resolvidos: 22 },
  ];

  return (
    <div className="space-y-8">
      {/* ... existing header ... */}
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <BarChart3 className="text-primary" />
            Relatórios Operacionais
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium italic">Análise de performance, SLA e produtividade da equipe</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">
          <Download size={18} />
          Exportar PDF
        </button>
      </div>

      {/* Quick Stats */}
      {/* ... existing stats ... */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Tempo Médio de Resposta", value: "1h 12m", trend: "-15%", icon: Clock, color: "text-blue-500" },
          { label: "Taxa de Resolução", value: "94.2%", trend: "+2.4%", icon: TrendingUp, color: "text-green-500" },
          { label: "Protocolos p/ Consultor", value: "18.5", trend: "+5%", icon: Users, color: "text-purple-500" },
          { label: "SLA Cumprido", value: "98.8%", trend: "+0.5%", icon: BarChart3, color: "text-amber-500" },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <stat.icon className={`${stat.color} p-2 bg-slate-50 dark:bg-slate-800 rounded-xl size-10`} />
              <span className={`text-[10px] font-black px-2 py-1 rounded-full ${stat.trend.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {stat.trend}
              </span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Volume Chart */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-slate-900 dark:text-white">Volume de Protocolos vs Resolvidos</h3>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
              <Calendar size={14} />
              Últimos 7 dias
              <ChevronDown size={14} />
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  cursor={{ fill: '#f1f5f9' }}
                />
                <Bar dataKey="protocolos" fill="#0a47c2" radius={[4, 4, 0, 0]} name="Protocolos" />
                <Bar dataKey="resolvidos" fill="#fbbf24" radius={[4, 4, 0, 0]} name="Resolvidos" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Protocols by Client Chart */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-slate-900 dark:text-white">Protocolos por Cliente (Top 5)</h3>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
              <Users size={14} />
              Total de Clientes
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={clientData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {clientData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            {clientData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div className="size-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400 truncate">{entry.name}</span>
                <span className="text-xs font-bold text-slate-900 dark:text-white ml-auto">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
