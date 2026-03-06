import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { 
  Search, 
  Filter, 
  MoreVertical, 
  UserPlus, 
  MessageSquare, 
  ArrowRightLeft, 
  AlertCircle,
  Clock,
  CheckCircle2,
  ChevronDown
} from "lucide-react";

export default function GlobalQueue() {
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
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Global Protocol Queue</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium italic">Manage and prioritize all incoming marketplace requests</p>
      </div>

      {/* Filters Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 size-5" />
          <input 
            type="text"
            placeholder="Search by ID, client or subject..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full pl-12 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary transition-all"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <select className="bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-400 focus:ring-2 focus:ring-primary">
            <option>All Priorities</option>
            <option>Critical</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
          <select className="bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-400 focus:ring-2 focus:ring-primary">
            <option>All Channels</option>
            <option>Mercado Livre</option>
            <option>Amazon</option>
            <option>Shopee</option>
          </select>
          <select className="bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-400 focus:ring-2 focus:ring-primary">
            <option>All Consultants</option>
            <option>Unassigned</option>
            <option>My Protocols</option>
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
                <th className="px-6 py-4">Protocol ID</th>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Priority</th>
                <th className="px-6 py-4">SLA</th>
                <th className="px-6 py-4">Consultant</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
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
                      {p.categoria_nome || "General"}
                    </span>
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
                        {p.consultor_nome || "Unassigned"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${
                      p.status === 'aberto' ? 'bg-blue-100 text-blue-700' : 
                      p.status === 'em atendimento' ? 'bg-amber-100 text-amber-700' : 
                      'bg-green-100 text-green-700'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button title="Take Protocol" className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all">
                        <UserPlus size={18} />
                      </button>
                      <button title="Reply" className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all">
                        <MessageSquare size={18} />
                      </button>
                      <button title="Change Priority" className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all">
                        <ArrowRightLeft size={18} />
                      </button>
                      <button title="More Actions" className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all">
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
