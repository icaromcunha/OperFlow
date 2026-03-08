import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Search, Filter, AlertTriangle, ChevronRight, Loader2, Eye, ChevronLeft } from "lucide-react";

export default function ProtocolList() {
  const [protocols, setProtocols] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const fetchProtocols = async () => {
      try {
        const response = await api.get("/protocols");
        setProtocols(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProtocols();
  }, []);

  const filteredProtocols = protocols.filter(p => 
    p.titulo.toLowerCase().includes(filter.toLowerCase()) ||
    p.cliente_nome.toLowerCase().includes(filter.toLowerCase()) ||
    p.id.toString().includes(filter)
  );

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <Loader2 className="animate-spin text-brand-orange" size={32} />
    </div>
  );

  return (
    <div className="p-8 space-y-8 bg-bg-main min-h-screen text-text-primary">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-white tracking-tight">Fila de Pareceres</h1>
        <p className="text-text-secondary font-medium">Gerenciamento estratégico de solicitações operacionais</p>
      </div>

      <div className="bg-bg-card rounded-xl border border-border-main shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border-main flex flex-col md:flex-row gap-4 bg-white/5">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
            <input
              type="text"
              placeholder="Filtrar por ID, título ou lojista..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-border-main rounded-lg text-sm focus:ring-2 focus:ring-brand-orange/50 text-white placeholder:text-text-secondary/50"
            />
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2.5 bg-white/5 border border-border-main rounded-lg text-sm font-bold text-text-secondary flex items-center gap-2 hover:bg-white/10 transition-colors">
              <Filter size={16} /> Status
            </button>
            <button className="px-4 py-2.5 bg-white/5 border border-border-main rounded-lg text-sm font-bold text-text-secondary flex items-center gap-2 hover:bg-white/10 transition-colors">
              <AlertTriangle size={16} /> Prioridade
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 text-text-secondary text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Lojista</th>
                <th className="px-6 py-4">Título / Assunto</th>
                <th className="px-6 py-4">Prioridade</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Data</th>
                <th className="px-6 py-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-main">
              {filteredProtocols.map((p) => (
                <tr key={p.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4 text-sm font-mono text-text-secondary">#OP-{p.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded bg-brand-orange/10 flex items-center justify-center text-brand-orange font-bold text-xs">
                        {p.cliente_nome?.substring(0, 2).toUpperCase()}
                      </div>
                      <span className="text-sm font-semibold text-white">{p.cliente_nome}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-white truncate max-w-xs group-hover:text-brand-orange transition-colors">{p.titulo}</span>
                      <span className="text-xs text-text-secondary">{p.categoria_nome || "Geral"}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`flex items-center gap-1.5 font-bold text-xs uppercase ${
                      p.prioridade_nome === 'Alta' ? 'text-red-400' : 
                      p.prioridade_nome === 'Média' ? 'text-amber-400' : 
                      'text-text-secondary'
                    }`}>
                      <span className={`size-1.5 rounded-full ${
                        p.prioridade_nome === 'Alta' ? 'bg-red-500' : 
                        p.prioridade_nome === 'Média' ? 'bg-amber-500' : 
                        'bg-text-secondary'
                      }`}></span>
                      {p.prioridade_nome === 'Alta' ? 'Crítica' : p.prioridade_nome === 'Média' ? 'Alta' : 'Média'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                      p.status === 'aberto' ? 'bg-brand-orange/10 text-brand-orange border-brand-orange/20' :
                      p.status === 'em atendimento' ? 'bg-brand-purple/10 text-brand-purple border-brand-purple/20' :
                      p.status === 'concluido' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                      'bg-white/5 text-text-secondary border-border-main'
                    }`}>
                      {p.status === 'aberto' ? 'Aguardando' : 
                       p.status === 'em atendimento' ? 'Em Revisão' : 
                       p.status === 'concluido' ? 'Aprovado' : 'Pendente'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-text-secondary">
                    {format(new Date(p.data_criacao), "dd/MM/yy, HH:mm", { locale: ptBR })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link to={`/admin/protocols/${p.id}`} className="p-2 hover:bg-white/10 rounded-lg transition-colors inline-block text-brand-orange">
                      <Eye size={18} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-border-main bg-white/5 flex items-center justify-between text-sm text-text-secondary">
          <p>Mostrando {filteredProtocols.length} registros</p>
          <div className="flex items-center gap-2">
            <button className="p-1 rounded hover:bg-white/10 disabled:opacity-50" disabled>
              <ChevronLeft size={18} />
            </button>
            <span className="font-bold text-white">1</span>
            <button className="p-1 rounded hover:bg-white/10">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
