import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { 
  ChevronLeft, 
  TrendingUp, 
  ShoppingBag, 
  Percent, 
  DollarSign,
  CheckCircle2,
  AlertCircle,
  Clock,
  FileText,
  Lightbulb,
  MessageSquare,
  ExternalLink
} from "lucide-react";

export default function ClientProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const response = await api.get(`/clients`);
        const found = response.data.find((c: any) => c.id.toString() === id);
        setClient(found);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchClient();
  }, [id]);

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );

  if (!client) return <div>Client not found</div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate("/admin/clients")}
          className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-primary transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{client.nome}</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium uppercase text-[10px] tracking-widest">Client Profile • ID: #CLT-{id}</p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="text-green-500 p-2 bg-green-500/10 rounded-xl size-10" />
            <span className="text-xs font-bold text-green-600">+15%</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Revenue</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">R$ 142.500,00</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <ShoppingBag className="text-blue-500 p-2 bg-blue-500/10 rounded-xl size-10" />
            <span className="text-xs font-bold text-blue-600">+8%</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Orders</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">1,240</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <Percent className="text-purple-500 p-2 bg-purple-500/10 rounded-xl size-10" />
            <span className="text-xs font-bold text-red-600">-2%</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Conversion</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">3.2%</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="text-amber-500 p-2 bg-amber-500/10 rounded-xl size-10" />
            <span className="text-xs font-bold text-green-600">+5%</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Average Ticket</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">R$ 114,90</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Marketplace Status */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Marketplace Status</h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: "Mercado Livre", status: "Healthy", color: "bg-green-500", icon: "ML" },
                { name: "Amazon", status: "Warning", color: "bg-amber-500", icon: "AMZ" },
                { name: "Shopee", status: "Healthy", color: "bg-green-500", icon: "SHP" }
              ].map((m) => (
                <div key={m.name} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center gap-4">
                  <div className="size-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-[10px] text-slate-500">
                    {m.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{m.name}</p>
                    <div className="flex items-center gap-1.5">
                      <span className={`size-2 rounded-full ${m.color}`}></span>
                      <span className="text-xs text-slate-500">{m.status}</span>
                    </div>
                  </div>
                  <ExternalLink size={14} className="text-slate-400" />
                </div>
              ))}
            </div>
          </div>

          {/* Recent Protocols */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Protocols</h2>
              <button className="text-sm font-bold text-primary hover:underline">View History</button>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="size-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                      <FileText size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">Análise de Reputação - ML</p>
                      <p className="text-[10px] text-slate-500 uppercase font-medium">Opened 2 days ago • #PRT-8921</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black uppercase px-2 py-1 rounded-full bg-blue-100 text-blue-700">In Progress</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Consultant Analysis Notes */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <MessageSquare size={18} className="text-primary" />
                Analysis Notes
              </h2>
              <button className="text-xs font-bold text-primary">Edit</button>
            </div>
            <div className="p-6">
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed italic">
                "O cliente apresenta uma queda constante na conversão orgânica no Mercado Livre. Suspeitamos de perda de relevância por atrasos logísticos recentes. É necessário revisar os tempos de postagem e a qualidade das fotos nos anúncios principais."
              </p>
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <div className="size-6 rounded-full bg-primary/10 flex items-center justify-center text-[8px] font-bold text-primary">AS</div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Ana Silva • 05/03/2026</span>
              </div>
            </div>
          </div>

          {/* Strategic Recommendations */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Lightbulb size={18} className="text-amber-500" />
                Strategic Recommendations
              </h2>
            </div>
            <div className="p-6 space-y-4">
              {[
                "Migrar 40% do estoque para o Full (ML)",
                "Otimizar títulos para busca Amazon",
                "Ativar campanha de Ads em Shopee",
                "Revisar política de devolução"
              ].map((rec, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="size-5 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0 mt-0.5">
                    <CheckCircle2 size={12} />
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">{rec}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
