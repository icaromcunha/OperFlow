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
  ExternalLink
} from "lucide-react";
import api from "../../services/api";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

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
      default: return 'bg-white/20';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 bg-bg-main text-text-primary">
      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-bg-card p-6 rounded-2xl border border-border-main shadow-sm hover:border-brand-orange/30 transition-colors group">
          <div className="flex items-center justify-between mb-4">
            <div className="size-10 rounded-xl bg-brand-orange/10 text-brand-orange flex items-center justify-center group-hover:scale-110 transition-transform">
              <MessageSquare size={20} />
            </div>
          </div>
          <p className="text-xs font-black uppercase text-text-secondary tracking-widest">Protocolos Abertos</p>
          <p className="text-3xl font-black text-white mt-1">{openProtocols.length}</p>
        </div>

        <div className="bg-bg-card p-6 rounded-2xl border border-border-main shadow-sm hover:border-brand-purple/30 transition-colors group">
          <div className="flex items-center justify-between mb-4">
            <div className="size-10 rounded-xl bg-brand-purple/10 text-brand-purple flex items-center justify-center group-hover:scale-110 transition-transform">
              <Clock size={20} />
            </div>
          </div>
          <p className="text-xs font-black uppercase text-text-secondary tracking-widest">Tempo Médio Resposta</p>
          <p className="text-3xl font-black text-white mt-1">{avgResponseTime}</p>
        </div>

        <div className="bg-bg-card p-6 rounded-2xl border border-border-main shadow-sm hover:border-brand-orange/30 transition-colors group">
          <div className="flex items-center justify-between mb-4">
            <div className="size-10 rounded-xl bg-brand-orange/10 text-brand-orange flex items-center justify-center group-hover:scale-110 transition-transform">
              <Share2 size={20} />
            </div>
          </div>
          <p className="text-xs font-black uppercase text-text-secondary tracking-widest">Marketplaces Ativos</p>
          <p className="text-3xl font-black text-white mt-1">{channels.filter(c => c.status === 'ativo').length}</p>
        </div>

        <div className="bg-bg-card p-6 rounded-2xl border border-border-main shadow-sm hover:border-brand-purple/30 transition-colors group">
          <div className="flex items-center justify-between mb-4">
            <div className="size-10 rounded-xl bg-brand-purple/10 text-brand-purple flex items-center justify-center group-hover:scale-110 transition-transform">
              <Truck size={20} />
            </div>
          </div>
          <p className="text-xs font-black uppercase text-text-secondary tracking-widest">Estoque Full/FBA</p>
          <p className="text-3xl font-black text-white mt-1">{channels.filter(c => c.estoque_cor === 'verde').length} Canais</p>
        </div>
      </div>

      {/* Marketplaces Grid */}
      <div className="bg-bg-card rounded-2xl border border-border-main shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border-main bg-white/5 flex items-center justify-between">
          <h2 className="text-lg font-black text-white uppercase tracking-tight italic">Status nos Marketplaces</h2>
          <span className="text-[10px] font-black uppercase px-2 py-1 bg-emerald-500/10 text-emerald-500 rounded-full">Operação Saudável</span>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {channels.map((channel) => (
            <div key={channel.id} className="p-5 rounded-2xl border border-border-main bg-white/5 space-y-4 hover:border-brand-orange/20 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-12 rounded-xl bg-white border border-border-main p-2 flex items-center justify-center overflow-hidden">
                    <img 
                      src={MARKETPLACE_LOGOS[channel.nome] || "https://picsum.photos/seed/shop/100/100"} 
                      alt={channel.nome} 
                      className="w-full h-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <h4 className="font-black text-white">{channel.nome}</h4>
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
                    <span className="text-xs font-bold text-white">{channel.estoque_tipo}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-black text-text-secondary uppercase tracking-widest mb-1">Última Sinc.</p>
                  <p className="text-xs font-bold text-white">{format(new Date(channel.data_atualizacao), "HH:mm")}</p>
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
          <div className="bg-bg-card text-white rounded-3xl p-8 relative overflow-hidden group shadow-2xl shadow-black/20 border border-border-main">
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
            <div className="p-6 border-b border-border-main bg-white/5 flex items-center justify-between">
              <h2 className="text-lg font-black text-white uppercase tracking-tight italic">Evolução do Cliente</h2>
              <button 
                onClick={() => setShowAllEvolution(!showAllEvolution)}
                className="text-xs font-black text-brand-orange hover:underline uppercase tracking-widest flex items-center gap-1"
              >
                {showAllEvolution ? "Ver Menos" : "Ver Histórico Completo"}
                {showAllEvolution ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            </div>
            <div className="p-6">
              <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-border-main before:via-border-main before:to-transparent">
                {(showAllEvolution ? evolution : evolution.slice(0, 2)).map((item, i) => (
                  <div key={item.id} className="relative flex items-start group">
                    <div className={`absolute left-0 size-10 rounded-full border-4 border-bg-card flex items-center justify-center z-10 transition-colors ${i === 0 ? 'bg-brand-orange text-white' : 'bg-white/5 text-text-secondary'}`}>
                      {i === 0 ? <CheckCircle2 size={16} /> : <Clock size={16} />}
                    </div>
                    <div className="ml-14 flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-black text-white uppercase tracking-tight">{item.titulo}</h4>
                        <time className="text-[10px] font-black text-text-secondary uppercase tracking-widest">{format(new Date(item.data_criacao), "dd MMM, yyyy", { locale: ptBR })}</time>
                      </div>
                      <p className="text-sm text-text-secondary leading-relaxed">
                        {item.descricao}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Protocols */}
        <div className="space-y-8">
          <div className="bg-bg-card rounded-2xl border border-border-main shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border-main bg-white/5 flex items-center justify-between">
              <h2 className="text-lg font-black text-white uppercase tracking-tight italic">Protocolos Ativos</h2>
              <Link to="/support" className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                <ExternalLink size={18} className="text-text-secondary" />
              </Link>
            </div>
            <div className="divide-y divide-border-main">
              {openProtocols.slice(0, 5).map((p) => (
                <Link key={p.id} to={`/protocols/${p.id}`} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className={`size-2 rounded-full ${p.status === 'aberto' ? 'bg-brand-orange' : 'bg-brand-purple'}`} />
                    <div>
                      <p className="text-sm font-bold text-white group-hover:text-brand-orange transition-colors truncate max-w-[150px]">{p.titulo}</p>
                      <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest">#PRT-{p.id}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black uppercase px-2 py-1 rounded-lg bg-white/5 text-text-secondary">
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
            <div className="p-4 bg-white/5 border-t border-border-main">
              <Link to="/new-protocol" className="w-full py-3 bg-bg-card border border-border-main rounded-xl text-xs font-black uppercase tracking-widest text-text-secondary hover:text-white hover:border-brand-orange transition-all flex items-center justify-center gap-2">
                Novo Protocolo
              </Link>
            </div>
          </div>
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

function Plus({ size, className }: { size: number, className?: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  );
}
