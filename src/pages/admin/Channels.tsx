import { useState, useEffect } from "react";
import api from "../../services/api";
import { Search, Share2, Filter, Download, Plus, Globe, Smartphone, ShoppingBag } from "lucide-react";

export default function AdminChannels() {
  const [channels, setChannels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const response = await api.get("/channels");
        setChannels(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchChannels();
  }, []);

  const filteredChannels = channels.filter(c => 
    c.nome.toLowerCase().includes(filter.toLowerCase()) ||
    c.cliente_nome?.toLowerCase().includes(filter.toLowerCase())
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
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Canais de Venda</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Gestão de integrações e performance por marketplace</p>
        </div>
        <button className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-primary/20">
          <Plus size={20} /> Nova Integração
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row gap-4 bg-slate-50/50 dark:bg-slate-800/30">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 size-5" />
            <input
              type="text"
              placeholder="Buscar por canal ou lojista..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-accent transition-all text-slate-900 dark:text-white"
            />
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
              <Filter size={18} /> Filtros
            </button>
            <button className="px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
              <Download size={18} /> Exportar
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Canal / Marketplace</th>
                <th className="px-6 py-4">Lojista Responsável</th>
                <th className="px-6 py-4">Status de Sincronia</th>
                <th className="px-6 py-4">Fulfillment / Logística</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {filteredChannels.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-lg flex items-center justify-center overflow-hidden bg-white border border-slate-200 dark:border-slate-800">
                        <img 
                          src={
                            c.nome === 'Mercado Livre' ? 'https://http2.mlstatic.com/frontend-assets/ui-navigation/5.19.1/mercadolibre/logo__large_plus.png' : 
                            c.nome === 'Amazon' ? 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg' : 
                            'https://upload.wikimedia.org/wikipedia/commons/f/fe/Shopee.svg'
                          } 
                          alt={c.nome}
                          className="size-7 object-contain"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 dark:text-white">{c.nome}</span>
                        <span className="text-xs text-slate-500">ID: #CH-{c.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{c.cliente_nome}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`size-2 rounded-full ${c.status === 'sincronizado' ? 'bg-green-500 animate-pulse' : 'bg-amber-500'}`}></span>
                      <span className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[10px]">
                        {c.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                      c.fulfillment === 'Ativo' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800' : 
                      'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                    }`}>
                      {c.fulfillment}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-primary">
                      <span className="material-symbols-outlined">settings</span>
                    </button>
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
