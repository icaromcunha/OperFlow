import { useState, useEffect } from "react";
import api from "../../services/api";
import { 
  Users, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  ListFilter, 
  Download, 
  ChevronLeft, 
  ChevronRight,
  LayoutList,
  AlertCircle,
  TrendingDown,
  Activity,
  UserCheck,
  Zap
} from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [protocols, setProtocols] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, protocolsRes] = await Promise.all([
          api.get("/protocols/stats"),
          api.get("/protocols")
        ]);
        setStats(statsRes.data);
        setProtocols(protocolsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );

  const alerts = [
    { id: 1, client: "E-Shop Pro", issue: "Queda de vendas (-30%)", type: "sales", severity: "critical" },
    { id: 2, client: "Mega Store", issue: "Erro de integração Shopee", type: "integration", severity: "high" },
    { id: 3, client: "Tech Hub", issue: "Atraso logístico (Coleta)", type: "logistics", severity: "medium" },
  ];

  const teamActivity = [
    { id: 1, name: "Ana Silva", handled: 24, avgTime: "1.5h", status: "online" },
    { id: 2, name: "Carlos Souza", handled: 18, avgTime: "2.1h", status: "away" },
    { id: 3, name: "Mariana Costa", handled: 31, avgTime: "1.2h", status: "online" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Consultant Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium italic">Monitoring marketplace operations & strategic management</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <LayoutList className="text-primary p-2 bg-primary/10 rounded-xl size-10" />
            <span className="text-xs font-bold text-slate-400">Total</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Open Protocols</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">42</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <AlertTriangle className="text-red-500 p-2 bg-red-500/10 rounded-xl size-10" />
            <span className="text-xs font-bold text-red-600 bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded-full">Critical</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Protocols in SLA Risk</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">08</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <UserCheck className="text-green-500 p-2 bg-green-500/10 rounded-xl size-10" />
            <span className="text-xs font-bold text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">Active</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Active Clients</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">156</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <CheckCircle2 className="text-blue-500 p-2 bg-blue-500/10 rounded-xl size-10" />
            <span className="text-xs font-bold text-blue-600 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-full">+12</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Resolved Today</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">28</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Priority Protocol Queue */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Zap className="text-amber-500 size-5" />
              Priority Protocol Queue
            </h2>
            <button className="text-sm font-bold text-primary hover:underline">View All</button>
          </div>
          
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest">
                    <th className="px-6 py-4">Protocol ID</th>
                    <th className="px-6 py-4">Client</th>
                    <th className="px-6 py-4">Subject</th>
                    <th className="px-6 py-4">Priority</th>
                    <th className="px-6 py-4">SLA</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {protocols.slice(0, 5).map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer">
                      <td className="px-6 py-4 text-xs font-mono text-slate-400">#PRT-{p.id}</td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">{p.cliente_nome}</span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-600 dark:text-slate-400 truncate max-w-[150px]">{p.titulo || "Análise de Conta"}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-full ${
                          p.prioridade_nome === 'Alta' ? 'bg-red-100 text-red-700' : 
                          p.prioridade_nome === 'Média' ? 'bg-amber-100 text-amber-700' : 
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {p.prioridade_nome === 'Alta' ? 'Critical' : p.prioridade_nome === 'Média' ? 'High' : 'Medium'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Clock size={14} className="text-slate-400" />
                          <span className="text-xs font-bold text-slate-600 dark:text-slate-400">2h 15m</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded uppercase">
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Clients Alerts Panel */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <AlertCircle className="text-red-500 size-5" />
            Clients Alerts Panel
          </h2>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-red-200 dark:hover:border-red-900 transition-colors group">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{alert.client}</h4>
                  <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                    alert.severity === 'critical' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
                  }`}>
                    {alert.severity}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                  {alert.type === 'sales' ? <TrendingDown size={16} className="text-red-500" /> : 
                   alert.type === 'integration' ? <Zap size={16} className="text-amber-500" /> : 
                   <Clock size={16} className="text-blue-500" />}
                  {alert.issue}
                </div>
              </div>
            ))}
          </div>

          {/* Team Activity */}
          <div className="pt-6 space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="text-primary size-5" />
              Team Activity
            </h2>
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm divide-y divide-slate-100 dark:divide-slate-800">
              {teamActivity.map((member) => (
                <div key={member.id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="size-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500 font-bold">
                        {member.name.substring(0, 2).toUpperCase()}
                      </div>
                      <span className={`absolute bottom-0 right-0 size-3 rounded-full border-2 border-white dark:border-slate-900 ${
                        member.status === 'online' ? 'bg-green-500' : 'bg-amber-500'
                      }`}></span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{member.name}</p>
                      <p className="text-[10px] text-slate-500 uppercase font-medium">{member.handled} protocols handled</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{member.avgTime}</p>
                    <p className="text-[9px] text-slate-400 uppercase">Avg Response</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
