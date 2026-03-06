import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { 
  Search, 
  UserPlus, 
  MoreVertical, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  Clock,
  LayoutGrid,
  ShieldCheck
} from "lucide-react";

export default function ClientList() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await api.get("/clients");
        setClients(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []);

  const filteredClients = clients.filter(c => 
    c.nome.toLowerCase().includes(filter.toLowerCase()) ||
    c.email.toLowerCase().includes(filter.toLowerCase())
  );

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Client Management</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium italic">Monitor and manage marketplace partner accounts</p>
        </div>
        <button className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-primary/20">
          <UserPlus size={20} /> Add New Client
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-5" />
            <input
              type="text"
              placeholder="Search by name, email or ID..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-xl hover:bg-slate-200 transition-colors">
              <LayoutGrid size={20} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest">
                <th className="px-6 py-4">Client Name</th>
                <th className="px-6 py-4">Active Channels</th>
                <th className="px-6 py-4">Open Protocols</th>
                <th className="px-6 py-4">Average SLA</th>
                <th className="px-6 py-4">Account Health</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {filteredClients.map((c) => (
                <tr 
                  key={c.id} 
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
                  onClick={() => navigate(`/admin/clients/${c.id}`)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {c.nome.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{c.nome}</span>
                        <span className="text-[10px] text-slate-400 uppercase font-black">ID: #CLT-{c.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex -space-x-2">
                      <div className="size-7 rounded-full bg-blue-500 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[8px] font-bold text-white" title="Mercado Livre">ML</div>
                      <div className="size-7 rounded-full bg-orange-500 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[8px] font-bold text-white" title="Amazon">AMZ</div>
                      <div className="size-7 rounded-full bg-red-500 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[8px] font-bold text-white" title="Shopee">SHP</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{c.protocolos_ativos || 0}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-slate-400" />
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-400">94%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 w-16 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 w-[85%]"></div>
                      </div>
                      <span className="text-xs font-bold text-green-600">Good</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-primary">
                        <ExternalLink size={18} />
                      </button>
                      <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-primary">
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
