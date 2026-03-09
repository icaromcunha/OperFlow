import { useNavigate } from "react-router-dom";
import { useProtocols, useProtocolStats } from "../../hooks/useProtocols";
import { useClients } from "../../hooks/useClients";
import { StatCard } from "../../components/ui/StatCard";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { 
  Users, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  LayoutList,
  AlertCircle,
  TrendingDown,
  Activity,
  UserCheck,
  Zap
} from "lucide-react";

export default function AdminDashboard() {
  const { protocols, loading: protocolsLoading } = useProtocols();
  const { stats, loading: statsLoading } = useProtocolStats();
  const { clients, loading: clientsLoading } = useClients();
  const navigate = useNavigate();

  const loading = protocolsLoading || statsLoading || clientsLoading;

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );

  const alerts = [
    { id: 1, clientId: 1, client: "E-Shop Pro", issue: "Queda de vendas (-30%)", type: "sales", severity: "crítico" },
    { id: 2, clientId: 2, client: "Mega Store", issue: "Erro de integração Shopee", type: "integration", severity: "alto" },
    { id: 3, clientId: 3, client: "Tech Hub", issue: "Atraso logístico (Coleta)", type: "logistics", severity: "médio" },
  ];

  const teamActivity = [
    { id: 1, name: "Ana Silva", handled: 24, avgTime: "1.5h", status: "online" },
    { id: 2, name: "Carlos Souza", handled: 18, avgTime: "2.1h", status: "away" },
    { id: 3, name: "Mariana Costa", handled: 31, avgTime: "1.2h", status: "online" },
  ];

  return (
    <div className="space-y-8 bg-bg-main min-h-full text-text-primary">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-text-primary tracking-tight">Painel do Consultor</h1>
        <p className="text-text-secondary font-medium italic">Monitoramento de operações de marketplace e gestão estratégica</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div onClick={() => navigate("/admin/global-queue")} className="cursor-pointer transition-transform hover:scale-[1.02]">
          <StatCard 
            label="Protocolos Abertos" 
            value={stats?.abertos || 0} 
            icon={LayoutList} 
            color="text-brand-orange" 
          />
        </div>

        <div onClick={() => navigate("/admin/global-queue")} className="cursor-pointer transition-transform hover:scale-[1.02]">
          <StatCard 
            label="Em Atendimento" 
            value={stats?.em_atendimento || 0} 
            icon={AlertTriangle} 
            color="text-brand-orange" 
            trend="Crítico"
          />
        </div>

        <div onClick={() => navigate("/admin/clients")} className="cursor-pointer transition-transform hover:scale-[1.02]">
          <StatCard 
            label="Clientes Ativos" 
            value={clients.length} 
            icon={UserCheck} 
            color="text-brand-purple" 
          />
        </div>

        <div onClick={() => navigate("/admin/reports")} className="cursor-pointer transition-transform hover:scale-[1.02]">
          <StatCard 
            label="Resolvidos Hoje" 
            value={stats?.concluidos || 0} 
            icon={CheckCircle2} 
            color="text-brand-purple" 
            trend="+12"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Priority Protocol Queue */}
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-text-primary flex items-center gap-2 italic uppercase tracking-tight">
                <Zap className="text-brand-orange size-5" />
                Fila de Protocolos Prioritários
              </h2>
              <button 
                onClick={() => navigate("/admin/queue")}
                className="text-sm font-bold text-brand-orange hover:underline"
              >
                Ver Todos
              </button>
            </div>
            
            <div className="bg-bg-card rounded-2xl border border-border-main shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/5 text-text-secondary text-[10px] font-black uppercase tracking-widest">
                      <th className="px-6 py-4">ID Protocolo</th>
                      <th className="px-6 py-4">Cliente</th>
                      <th className="px-6 py-4">Assunto</th>
                      <th className="px-6 py-4">Prioridade</th>
                      <th className="px-6 py-4">SLA</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-main">
                    {protocols.slice(0, 5).map((p) => (
                      <tr 
                        key={p.id} 
                        onClick={() => navigate(`/admin/protocols/${p.id}`)}
                        className="hover:bg-white/5 transition-colors cursor-pointer group"
                      >
                        <td className="px-6 py-4 text-xs font-mono text-text-secondary group-hover:text-brand-orange transition-colors">#PRT-{p.id}</td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-bold text-text-primary">{p.cliente_nome}</span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-text-secondary truncate max-w-[150px]">{p.titulo || "Análise de Conta"}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-full ${
                            p.prioridade_nome === 'Alta' ? 'bg-red-500/10 text-red-500' : 
                            p.prioridade_nome === 'Média' ? 'bg-brand-orange/10 text-brand-orange' : 
                            'bg-brand-purple/10 text-brand-purple'
                          }`}>
                            {p.prioridade_nome === 'Alta' ? 'Crítico' : p.prioridade_nome === 'Média' ? 'Alto' : 'Médio'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Clock size={14} className="text-text-secondary" />
                            <span className="text-xs font-bold text-text-secondary">2h 15m</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={p.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Integrated Reports Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-bg-card p-6 rounded-3xl border border-border-main shadow-sm">
              <h3 className="text-sm font-black text-text-primary uppercase italic mb-6 flex items-center gap-2">
                <Activity size={18} className="text-brand-orange" />
                Performance da Equipe (SLA)
              </h3>
              <div className="space-y-4">
                {teamActivity.map((member, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-text-secondary">{member.name}</span>
                      <span className="text-brand-orange">{member.avgTime} avg</span>
                    </div>
                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-brand-orange h-full transition-all duration-1000" 
                        style={{ width: `${100 - (i * 15)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-bg-card p-6 rounded-3xl border border-border-main shadow-sm">
              <h3 className="text-sm font-black text-text-primary uppercase italic mb-6 flex items-center gap-2">
                <LayoutList size={18} className="text-brand-purple" />
                Volume por Categoria
              </h3>
              <div className="space-y-4">
                {[
                  { label: "Marketplace", value: 45, color: "bg-brand-orange" },
                  { label: "Logística", value: 30, color: "bg-brand-purple" },
                  { label: "Financeiro", value: 15, color: "bg-emerald-500" },
                  { label: "Outros", value: 10, color: "bg-white/20" }
                ].map((cat, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`size-3 rounded-full ${cat.color}`} />
                    <span className="text-xs font-bold text-text-secondary flex-1">{cat.label}</span>
                    <span className="text-xs font-black text-text-primary">{cat.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Clients Alerts Panel */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
            <AlertCircle className="text-red-500 size-5" />
            Painel de Alertas de Clientes
          </h2>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div 
                key={alert.id} 
                onClick={() => navigate(`/admin/clients/${alert.clientId}`)}
                className="bg-bg-card p-4 rounded-2xl border border-border-main shadow-sm hover:border-red-500/50 transition-colors group cursor-pointer"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-text-primary group-hover:text-brand-orange transition-colors">{alert.client}</h4>
                  <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                    alert.severity === 'crítico' ? 'bg-red-500/10 text-red-500' : 'bg-brand-orange/10 text-brand-orange'
                  }`}>
                    {alert.severity}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-text-secondary">
                  {alert.type === 'sales' ? <TrendingDown size={16} className="text-red-500" /> : 
                   alert.type === 'integration' ? <Zap size={16} className="text-brand-orange" /> : 
                   <Clock size={16} className="text-brand-purple" />}
                  {alert.issue}
                </div>
              </div>
            ))}
          </div>

          {/* Team Activity */}
          <div className="pt-6 space-y-4">
            <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
              <Activity className="text-brand-orange size-5" />
              Atividade da Equipe
            </h2>
            <div className="bg-bg-card rounded-2xl border border-border-main shadow-sm divide-y divide-border-main overflow-hidden">
              {teamActivity.map((member) => (
                <div 
                  key={member.id} 
                  onClick={() => navigate("/admin/team")}
                  className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="size-10 rounded-full bg-white/5 flex items-center justify-center text-text-secondary font-bold group-hover:bg-brand-orange/10 group-hover:text-brand-orange transition-colors">
                        {member.name.substring(0, 2).toUpperCase()}
                      </div>
                      <span className={`absolute bottom-0 right-0 size-3 rounded-full border-2 border-bg-card ${
                        member.status === 'online' ? 'bg-emerald-500' : 'bg-brand-orange'
                      }`}></span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-text-primary group-hover:text-brand-orange transition-colors">{member.name}</p>
                      <p className="text-[10px] text-text-secondary uppercase font-medium">{member.handled} protocolos tratados</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-text-primary">{member.avgTime}</p>
                    <p className="text-[9px] text-text-secondary uppercase">Tempo Médio</p>
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
