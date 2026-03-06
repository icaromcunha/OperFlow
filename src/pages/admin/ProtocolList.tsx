import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

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
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Fila de Pareceres</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium">Gerenciamento estratégico de solicitações operacionais</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row gap-4 bg-slate-50/50 dark:bg-slate-800/30">
          <div className="flex-1 relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input
              type="text"
              placeholder="Filtrar por ID, título ou lojista..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white"
            />
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
              <span className="material-symbols-outlined text-sm">filter_alt</span> Status
            </button>
            <button className="px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
              <span className="material-symbols-outlined text-sm">priority_high</span> Prioridade
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Lojista</th>
                <th className="px-6 py-4">Título / Assunto</th>
                <th className="px-6 py-4">Prioridade</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Data</th>
                <th className="px-6 py-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {filteredProtocols.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-mono text-slate-500">#OP-{p.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                        {p.cliente_nome?.substring(0, 2).toUpperCase()}
                      </div>
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">{p.cliente_nome}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-xs">{p.titulo}</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">{p.categoria_nome || "Geral"}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`flex items-center gap-1.5 font-bold text-xs uppercase ${
                      p.prioridade_nome === 'Alta' ? 'text-red-600 dark:text-red-400' : 
                      p.prioridade_nome === 'Média' ? 'text-amber-600 dark:text-amber-400' : 
                      'text-slate-400 dark:text-slate-600'
                    }`}>
                      <span className={`size-1.5 rounded-full ${
                        p.prioridade_nome === 'Alta' ? 'bg-red-600' : 
                        p.prioridade_nome === 'Média' ? 'bg-amber-600' : 
                        'bg-slate-400'
                      }`}></span>
                      {p.prioridade_nome === 'Alta' ? 'Crítica' : p.prioridade_nome === 'Média' ? 'Alta' : 'Média'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                      p.status === 'aberto' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800' :
                      p.status === 'em atendimento' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800' :
                      p.status === 'concluido' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800' :
                      'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                    }`}>
                      {p.status === 'aberto' ? 'Aguardando' : 
                       p.status === 'em atendimento' ? 'Em Revisão' : 
                       p.status === 'concluido' ? 'Aprovado' : 'Pendente'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                    {format(new Date(p.data_criacao), "dd/MM/yy, HH:mm", { locale: ptBR })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link to={`/admin/protocols/${p.id}`} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors inline-block text-primary dark:text-accent">
                      <span className="material-symbols-outlined">visibility</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/20 flex items-center justify-between text-sm text-slate-500">
          <p>Mostrando {filteredProtocols.length} registros</p>
          <div className="flex items-center gap-2">
            <button className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50" disabled>
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <span className="font-bold text-slate-900 dark:text-white">1</span>
            <button className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
