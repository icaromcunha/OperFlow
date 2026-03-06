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
      case 'aberto': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'em atendimento': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      case 'concluido': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
      default: return 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'Alta': return <AlertCircle className="text-red-500" size={16} />;
      case 'Média': return <Timer className="text-amber-500" size={16} />;
      default: return <Clock className="text-blue-500" size={16} />;
    }
  };

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Central de Suporte</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Acompanhe suas solicitações e abra novos protocolos.</p>
        </div>
        <Link 
          to="/new-protocol"
          className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-primary/20 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
        >
          <Plus size={20} />
          Novo Protocolo
        </Link>
      </div>

      {/* Filtros e Busca */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text"
            placeholder="Buscar por título ou número do protocolo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all text-slate-900 dark:text-white"
          />
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
          <Filter size={20} />
          Filtros
        </button>
      </div>

      {/* Lista de Protocolos */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 space-y-4">
            {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-16 bg-slate-50 dark:bg-slate-800/50 animate-pulse rounded-xl" />)}
          </div>
        ) : filteredProtocols.length > 0 ? (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredProtocols.map((protocol) => (
              <div 
                key={protocol.id} 
                onClick={() => navigate(`/protocols/${protocol.id}`)}
                className="p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl ${getStatusColor(protocol.status)}`}>
                      {protocol.status === 'concluido' ? <CheckCircle2 size={24} /> : <MessageSquare size={24} />}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">#{protocol.id}</span>
                        <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{protocol.titulo}</h3>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                        <span className="flex items-center gap-1.5">
                          <Plus size={14} /> {new Date(protocol.data_criacao).toLocaleDateString('pt-BR')}
                        </span>
                        <span className="flex items-center gap-1.5">
                          {getPriorityIcon(protocol.prioridade_nome)} {protocol.prioridade_nome}
                        </span>
                        <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tighter">
                          {protocol.categoria_nome}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(protocol.status)}`}>
                      {protocol.status}
                    </div>
                    <ArrowRight className="text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all" size={20} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-20 text-center">
            <div className="size-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageSquare className="text-slate-300" size={40} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Nenhum protocolo encontrado</h3>
            <p className="text-slate-500 max-w-md mx-auto mb-8">
              Você ainda não abriu nenhuma solicitação ou sua busca não retornou resultados.
            </p>
            <Link 
              to="/new-protocol"
              className="inline-flex items-center gap-2 bg-primary text-white font-bold py-3 px-8 rounded-xl hover:bg-primary/90 transition-all"
            >
              <Plus size={20} /> Abrir Primeiro Protocolo
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
