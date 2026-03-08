import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Plus, Search, Filter, MessageSquare, Clock, 
  CheckCircle2, AlertCircle, Timer, ArrowRight
} from "lucide-react";
import api from "../../services/api";

export default function Support() {
  const [protocols, setProtocols] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProtocols = async () => {
      try {
        const response = await api.get("/protocols");
        setProtocols(response.data);
      } catch (err) {
        console.error("Erro ao buscar protocolos:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProtocols();
  }, []);

  const filteredProtocols = protocols.filter(p => 
    p.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.id.toString().includes(searchTerm)
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aberto': return 'bg-brand-orange/10 text-brand-orange border-brand-orange/20';
      case 'em atendimento': return 'bg-brand-purple/10 text-brand-purple border-brand-purple/20';
      case 'concluido': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      default: return 'bg-white/5 text-text-secondary border-border-main';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'Alta': return <AlertCircle className="text-red-500" size={16} />;
      case 'Média': return <Timer className="text-amber-500" size={16} />;
      default: return <Clock className="text-brand-orange" size={16} />;
    }
  };

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto bg-bg-main min-h-screen text-text-primary">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-black text-white tracking-tight">Central de Suporte</h1>
          <p className="text-text-secondary font-medium">Acompanhe suas solicitações e abra novos protocolos.</p>
        </div>
        <Link 
          to="/new-protocol"
          className="bg-gradient-to-r from-brand-orange to-brand-purple hover:from-brand-orange-light hover:to-brand-purple-light text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-brand-orange/20 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
        >
          <Plus size={20} />
          Novo Protocolo
        </Link>
      </div>

      {/* Filtros e Busca */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={20} />
          <input 
            type="text"
            placeholder="Buscar por título ou número do protocolo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-bg-card border border-border-main rounded-xl focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all text-white placeholder:text-text-secondary/50"
          />
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-bg-card border border-border-main rounded-xl font-bold text-text-secondary hover:bg-white/5 transition-colors">
          <Filter size={20} />
          Filtros
        </button>
      </div>

      {/* Lista de Protocolos */}
      <div className="bg-bg-card rounded-2xl border border-border-main shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 space-y-4">
            {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-16 bg-white/5 animate-pulse rounded-xl" />)}
          </div>
        ) : filteredProtocols.length > 0 ? (
          <div className="divide-y divide-border-main">
            {filteredProtocols.map((protocol) => (
              <div 
                key={protocol.id} 
                onClick={() => navigate(`/protocols/${protocol.id}`)}
                className="p-6 hover:bg-white/5 transition-colors cursor-pointer group"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl border ${getStatusColor(protocol.status)}`}>
                      {protocol.status === 'concluido' ? <CheckCircle2 size={24} /> : <MessageSquare size={24} />}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-xs font-bold text-text-secondary uppercase tracking-widest">#{protocol.id}</span>
                        <h3 className="font-bold text-white group-hover:text-brand-orange transition-colors">{protocol.titulo}</h3>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
                        <span className="flex items-center gap-1.5">
                          <Plus size={14} /> {new Date(protocol.data_criacao).toLocaleDateString('pt-BR')}
                        </span>
                        <span className="flex items-center gap-1.5">
                          {getPriorityIcon(protocol.prioridade_nome)} {protocol.prioridade_nome}
                        </span>
                        <span className="bg-white/5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tighter border border-border-main">
                          {protocol.categoria_nome}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusColor(protocol.status)}`}>
                      {protocol.status}
                    </div>
                    <ArrowRight className="text-text-secondary group-hover:text-brand-orange group-hover:translate-x-1 transition-all" size={20} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-20 text-center">
            <div className="size-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-border-main">
              <MessageSquare className="text-text-secondary" size={40} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Nenhum protocolo encontrado</h3>
            <p className="text-text-secondary max-w-md mx-auto mb-8">
              Você ainda não abriu nenhuma solicitação ou sua busca não retornou resultados.
            </p>
            <Link 
              to="/new-protocol"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-orange to-brand-purple text-white font-bold py-3 px-8 rounded-xl hover:from-brand-orange-light hover:to-brand-purple-light transition-all shadow-lg shadow-brand-orange/20"
            >
              <Plus size={20} /> Abrir Primeiro Protocolo
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
