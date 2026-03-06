import { useState, useEffect } from "react";
import api from "../../services/api";
import { Search, Package, Filter, Download, Plus } from "lucide-react";

export default function AdminCatalog() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/products");
        setProducts(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(p => 
    p.sku.toLowerCase().includes(filter.toLowerCase()) ||
    p.cliente_nome?.toLowerCase().includes(filter.toLowerCase())
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
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Catálogo Global</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Monitoramento de SKUs e estoque em todos os canais</p>
        </div>
        <button className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-primary/20">
          <Plus size={20} /> Novo Produto
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row gap-4 bg-slate-50/50 dark:bg-slate-800/30">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 size-5" />
            <input
              type="text"
              placeholder="Buscar por SKU ou lojista..."
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
                <th className="px-6 py-4">Produto / SKU</th>
                <th className="px-6 py-4">Lojista</th>
                <th className="px-6 py-4">Estoque Total</th>
                <th className="px-6 py-4">Canais Ativos</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                        <Package size={24} />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 dark:text-white">{p.sku}</span>
                        <span className="text-xs text-slate-500">ID: #PRD-{p.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{p.cliente_nome}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">124 un.</span>
                      <span className="text-[10px] text-green-600 font-bold uppercase tracking-wider">Em Dia</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1.5">
                      <div className="size-7 rounded-lg bg-white border border-slate-200 dark:border-slate-800 flex items-center justify-center overflow-hidden" title="Mercado Livre">
                        <img src="https://http2.mlstatic.com/frontend-assets/ui-navigation/5.19.1/mercadolibre/logo__large_plus.png" alt="ML" className="size-5 object-contain" referrerPolicy="no-referrer" />
                      </div>
                      <div className="size-7 rounded-lg bg-white border border-slate-200 dark:border-slate-800 flex items-center justify-center overflow-hidden" title="Amazon">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" alt="AZ" className="size-5 object-contain" referrerPolicy="no-referrer" />
                      </div>
                      <div className="size-7 rounded-lg bg-white border border-slate-200 dark:border-slate-800 flex items-center justify-center overflow-hidden" title="Shopee">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/f/fe/Shopee.svg" alt="SH" className="size-5 object-contain" referrerPolicy="no-referrer" />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-primary">
                      <span className="material-symbols-outlined">edit</span>
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
