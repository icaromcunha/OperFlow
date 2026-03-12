import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  BarChart3, 
  Share2, 
  Truck, 
  RefreshCw, 
  Clock,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  TrendingUp,
  ExternalLink,
  Plus,
  LayoutList,
  Rocket,
  History
} from "lucide-react";
import api from "../../services/api";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { StatCard } from "../../components/ui/StatCard";

const MARKETPLACE_LOGOS: Record<string, string> = {
  "Mercado Livre": "https://http2.mlstatic.com/frontend-assets/ui-navigation/5.19.1/mercadolibre/logo__large_plus.png",
  "Amazon": "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
  "Shopee": "https://upload.wikimedia.org/wikipedia/commons/f/fe/Shopee.svg",
  "Magalu": "https://upload.wikimedia.org/wikipedia/commons/e/e1/Magalu_logo.svg",
  "Americanas": "https://upload.wikimedia.org/wikipedia/commons/4/4b/Americanas_logo.svg"
};

export default function ClientDashboard() {
  const [protocols, setProtocols] = useState<any[]>([]);
  const [channels, setChannels] = useState<any[]>([]);
  const [insight, setInsight] = useState<any>(null);
  const [evolution, setEvolution] = useState<any[]>([]);
  const [detailedStats, setDetailedStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAllEvolution, setShowAllEvolution] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pRes, cRes, iRes, eRes, sRes] = await Promise.all([
          api.get("/protocols"),
          api.get("/channels"),
          api.get("/insights"),
          api.get("/evolution"),
          api.get("/protocols/stats/detailed")
        ]);
        setProtocols(pRes.data);
        setChannels(cRes.data);
        setInsight(iRes.data);
        setEvolution(eRes.data);
        setDetailedStats(sRes.data);
      } catch (err) {
        console.error("Erro ao carregar dados do dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const openProtocols = protocols.filter(p => p.status !== 'concluido');
  const avgResponseTime = detailedStats?.avg_hours ? `${detailedStats.avg_hours.toFixed(1)}h` : "4.2h";

  if (loading) return (
    <div className="flex items-center justify-center h-96">
      <RefreshCw className="animate-spin text-primary" size={40} />
    </div>
  );

  const getTrafficLightColor = (color: string) => {
    switch (color) {
      case 'verde': return 'bg-green-500';
      case 'amarelo': return 'bg-yellow-500';
      case 'vermelho': return 'bg-red-500';
      default: return 'bg-surface-subtle';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 bg-bg-main text-text-primary">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-text-primary tracking-tight">Dashboard do Cliente</h1>
        <p className="text-text-secondary font-medium italic">Visão geral da sua operação e insights estratégicos</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Protocolos Abertos" 
          value={openProtocols.length} 
          icon={MessageSquare} 
          color="text-brand-orange" 
        />
        <StatCard 
          label="Tempo Médio Resposta" 
          value={avgResponseTime} 
          icon={Clock} 
          color="text-brand-purple" 
        />
        <StatCard 
          label="Marketplaces Ativos" 
          value={channels.filter(c => c.status === 'ativo').length} 
          icon={Share2} 
          color="text-brand-orange" 
        />
        <StatCard 
          label="Estoque Full/FBA" 
          value={`${channels.filter(c => c.estoque_cor === 'verde').length} Canais`} 
          icon={Truck} 
          color="text-brand-purple" 
        />
      </div>

      {/* Marketplaces Grid */}
      <div className="bg-bg-card rounded-2xl border border-border-main shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border-main bg-surface-subtle flex items-center justify-between">
          <h2 className="text-lg font-black text-text-primary uppercase tracking-tight italic">Status nos Marketplaces</h2>
          <span className="text-[10px] font-black uppercase px-2 py-1 bg-emerald-500/10 text-emerald-500 rounded-full">Operação Saudável</span>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {channels.map((channel) => (
            <div key={channel.id} className="p-5 rounded-2xl border border-border-main bg-surface-subtle space-y-4 hover:border-brand-orange/20 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-12 rounded-xl bg-bg-card border border-border-main p-2 flex items-center justify-center overflow-hidden">
                    <img 
                      src={MARKETPLACE_LOGOS[channel.nome] || "https://picsum.photos/seed/shop/100/100"} 
                      alt={channel.nome} 
                      className="w-full h-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <h4 className="font-black text-text-primary">{channel.nome}</h4>
                    <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Canal de Venda</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-1.5">
                    <div className={`size-2.5 rounded-full ${getTrafficLightColor(channel.status_cor)} shadow-lg shadow-current/20`} />
                    <span className="text-[10px] font-black uppercase text-text-secondary">{channel.status}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border-main grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[9px] font-black text-text-secondary uppercase tracking-widest mb-1">Logística / Full</p>
                  <div className="flex items-center gap-1.5">
                    <div className={`size-2 rounded-full ${getTrafficLightColor(channel.estoque_cor)}`} />
                    <span className="text-xs font-bold text-text-primary">{channel.estoque_tipo}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-black text-text-secondary uppercase tracking-widest mb-1">Última Sinc.</p>
                  <p className="text-xs font-bold text-text-primary">{format(new Date(channel.data_atualizacao), "HH:mm")}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Insights & Evolution */}
        <div className="lg:col-span-2 space-y-8">
          {/* Consultant Insights */}
          <div className="bg-bg-card text-text-primary rounded-3xl p-8 relative overflow-hidden group shadow-2xl shadow-black/20 border border-border-main">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
              <TrendingUp size={120} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="size-10 rounded-xl bg-gradient-to-br from-brand-orange to-brand-purple flex items-center justify-center shadow-lg shadow-brand-orange/20">
                  <BarChart3 size={20} className="text-white" />
                </div>
                <h3 className="text-xl font-black italic uppercase tracking-tight">Insights do Consultor</h3>
              </div>
              <div className="space-y-4">
                <p className="text-text-secondary text-lg leading-relaxed font-medium italic">
                  "{insight?.descricao || "Sua performance no Full cresceu 15% este mês. Recomendamos aumentar o estoque de itens curva A para a Black Friday. O canal Amazon apresenta oportunidade em eletrônicos."}"
                </p>
                <div className="flex items-center gap-3 pt-6 border-t border-border-main">
                  <div className="size-10 rounded-full bg-brand-orange/20 flex items-center justify-center text-brand-orange font-bold">RC</div>
                  <div>
                    <p className="text-sm font-bold">Rodrigo Costa</p>
                    <p className="text-[10px] font-black uppercase text-text-secondary tracking-widest">Consultor Estratégico Sênior</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Evolution History */}
          <div className="bg-bg-card rounded-2xl border border-border-main shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border-main bg-surface-subtle/50 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-text-primary uppercase tracking-tight italic">Evolução Estratégica</h2>
                <p className="text-[10px] text-text-secondary font-black uppercase tracking-widest mt-0.5">Marcos e otimizações da sua operação</p>
              </div>
              <button 
                onClick={() => setShowAllEvolution(!showAllEvolution)}
                className="text-xs font-black text-brand-orange hover:underline uppercase tracking-widest flex items-center gap-1"
              >
                {showAllEvolution ? "Ver Menos" : "Ver Histórico Completo"}
                {showAllEvolution ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            </div>
            <div className="p-6">
              <div className="relative space-y-8 before:absolute before:inset-0 before:ml-11 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-border-main before:via-border-main before:to-transparent">
                {(showAllEvolution ? evolution : evolution.slice(0, 3)).map((item, i) => (
                  <div key={item.id} className="relative flex gap-6 group">
                    <div className={`size-10 rounded-2xl border-4 border-bg-card flex items-center justify-center z-10 transition-all ${i === 0 ? 'bg-brand-orange text-white shadow-lg shadow-brand-orange/30' : 'bg-surface-subtle text-text-secondary'}`}>
                      {i === 0 ? <Rocket size={18} /> : <History size={18} />}
                    </div>
                    <div className="flex-1 bg-surface-subtle/30 p-5 rounded-2xl border border-border-main group-hover:border-brand-orange/30 transition-all">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-black text-text-primary uppercase tracking-tight">{item.titulo}</h4>
                        <time className="text-[10px] font-mono text-text-secondary opacity-60 uppercase tracking-widest">{format(new Date(item.data_criacao), "dd MMM, yyyy", { locale: ptBR })}</time>
                      </div>
                      <p className="text-sm text-text-secondary leading-relaxed font-medium">
                        {item.descricao}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Protocols */}
          <div className="bg-bg-card rounded-2xl border border-border-main shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border-main bg-surface-subtle flex items-center justify-between">
              <h2 className="text-lg font-black text-text-primary uppercase tracking-tight italic">Protocolos Ativos</h2>
              <Link to="/support" className="p-2 bg-surface-hover rounded-lg transition-colors">
                <ExternalLink size={18} className="text-text-secondary" />
              </Link>
            </div>
            <div className="divide-y divide-border-main">
              {openProtocols.slice(0, 5).map((p) => (
                <Link key={p.id} to={`/protocols/${p.id}`} className="p-4 flex items-center justify-between bg-surface-hover transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className={`size-2 rounded-full ${p.status === 'aberto' ? 'bg-brand-orange' : 'bg-brand-purple'}`} />
                    <div>
                      <p className="text-sm font-bold text-text-primary group-hover:text-brand-orange transition-colors truncate max-w-[150px]">{p.titulo}</p>
                      <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest">#PRT-{p.id}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black uppercase px-2 py-1 rounded-lg bg-surface-subtle text-text-secondary">
                    {p.status === 'aberto' ? 'Aberto' : 'Em Andamento'}
                  </span>
                </Link>
              ))}
              {openProtocols.length === 0 && (
                <div className="p-8 text-center">
                  <p className="text-sm text-text-secondary font-medium italic">Nenhum protocolo ativo no momento.</p>
                </div>
              )}
            </div>
            <div className="p-4 bg-surface-subtle border-t border-border-main">
              <Link to="/new-protocol" className="w-full py-3 bg-bg-card border border-border-main rounded-xl text-xs font-black uppercase tracking-widest text-text-secondary hover:text-white hover:border-brand-orange transition-all flex items-center justify-center gap-2">
                Novo Protocolo
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: Empty or for future widgets */}
        <div className="space-y-8">
        </div>
      </div>

      {/* Floating Action Button */}
      <Link 
        to="/new-protocol"
        className="fixed bottom-8 right-8 bg-gradient-to-r from-brand-orange to-brand-purple hover:from-brand-orange-light hover:to-brand-purple-light text-white font-black py-4 px-8 rounded-full shadow-2xl flex items-center gap-3 transition-all hover:scale-105 active:scale-95 group z-50"
      >
        <Plus size={20} className="transition-transform group-hover:rotate-90" />
        <span className="tracking-tight uppercase italic">Cadastrar Protocolo</span>
      </Link>
    </div>
  );
}
