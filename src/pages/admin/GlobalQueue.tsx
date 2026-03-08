import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useProtocols } from "../../hooks/useProtocols";
import { useClients } from "../../hooks/useClients";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { 
  Search, 
  Filter, 
  MoreVertical, 
  UserPlus, 
  MessageSquare, 
  ArrowRightLeft, 
  Clock
} from "lucide-react";

export default function GlobalQueue() {
  const { protocols, loading, refresh: refreshProtocols } = useProtocols();
  const { clients } = useClients();
  const [filter, setFilter] = useState("");
  const [selectedClient, setSelectedClient] = useState("Todos os Clientes");
  const navigate = useNavigate();

  const handleTakeProtocol = async (id: number) => {
    try {
      await api.patch(`/protocols/${id}`, { status: 'em atendimento' });
      await refreshProtocols();
      alert("Protocolo assumido com sucesso!");
    } catch (err) {
      console.error(err);
      alert("Erro ao assumir protocolo.");
    }
  };

  const handleChangePriority = async (id: number) => {
    const newPriority = prompt("Digite a nova prioridade (Baixa, Média, Alta):");
    if (!newPriority) return;
    
    try {
      await api.patch(`/protocols/${id}`, { priority_name: newPriority });
      await refreshProtocols();
      alert("Prioridade alterada!");
    } catch (err) {
      console.error(err);
    }
  };

  const filteredProtocols = protocols.filter(p => {
    const matchesSearch = p.titulo?.toLowerCase().includes(filter.toLowerCase()) ||
      p.cliente_nome?.toLowerCase().includes(filter.toLowerCase()) ||
      p.id.toString().includes(filter);
    
    const matchesClient = selectedClient === "Todos os Clientes" || p.cliente_nome === selectedClient;
    
    return matchesSearch && matchesClient;
  });

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight italic uppercase">Protocolos e Fila de Atendimento</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium italic">Gestão centralizada de todas as demandas e solicitações dos lojistas</p>
      </div>

      {/* Filters Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 size-5" />
          <input 
            type="text"
            placeholder="Buscar por ID, cliente ou assunto..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full pl-12 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary transition-all"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <select className="bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-400 focus:ring-2 focus:ring-primary">
            <option>Todas as Prioridades</option>
            <option>Crítica</option>
            <option>Alta</option>
            <option>Média</option>
            <option>Baixa</option>
          </select>
          <select 
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-400 focus:ring-2 focus:ring-primary"
          >
            <option>Todos os Clientes</option>
            {clients.map(c => (
              <option key={c.id} value={c.nome}>{c.nome}</option>
            ))}
          </select>
          <button className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-xl hover:bg-slate-200 transition-colors">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Queue Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest">
                <th className="px-6 py-4">ID Protocolo</th>
                <th className="px-6 py-4">Cliente</th>
                <th className="px-6 py-4">Categoria</th>
                <th className="px-6 py-4">Prioridade</th>
                <th className="px-6 py-4">SLA</th>
                <th className="px-6 py-4">Consultor</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {filteredProtocols.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                  <td className="px-6 py-4 text-xs font-mono text-slate-400">#PRT-{p.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 font-bold text-xs">
                        {p.cliente_nome?.substring(0, 2).toUpperCase()}
                      </div>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">{p.cliente_nome}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                      {p.categoria_nome || "Geral"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-full ${
                      p.prioridade_nome === 'Alta' ? 'bg-red-100 text-red-700' : 
                      p.prioridade_nome === 'Média' ? 'bg-amber-100 text-amber-700' : 
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {p.prioridade_nome === 'Alta' ? 'Crítica' : p.prioridade_nome === 'Média' ? 'Alta' : 'Média'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-red-500" />
                      <span className="text-xs font-bold text-red-600">0h 45m</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="size-6 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-500">
                        {p.consultor_nome ? p.consultor_nome.substring(0, 2).toUpperCase() : "?"}
                      </div>
                      <span className="text-xs text-slate-600 dark:text-slate-400">
                        {p.consultor_nome || "Não Atribuído"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleTakeProtocol(p.id)}
                        title="Assumir Protocolo" 
                        className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                      >
                        <UserPlus size={18} />
                      </button>
                      <button 
                        onClick={() => navigate(`/admin/protocols/${p.id}`)}
                        title="Responder" 
                        className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                      >
                        <MessageSquare size={18} />
                      </button>
                      <button 
                        onClick={() => handleChangePriority(p.id)}
                        title="Alterar Prioridade" 
                        className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                      >
                        <ArrowRightLeft size={18} />
                      </button>
                      <button title="Mais Ações" className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
