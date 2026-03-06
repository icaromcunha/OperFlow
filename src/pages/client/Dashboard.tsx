import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  BarChart3, 
  Share2, 
  Truck, 
  RefreshCw, 
} from "lucide-react";
import api from "../../services/api";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function ClientDashboard() {
  const [protocols, setProtocols] = useState<any[]>([]);
  const [channels, setChannels] = useState<any[]>([]);
  const [insight, setInsight] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pRes, cRes, iRes] = await Promise.all([
          api.get("/protocols"),
          api.get("/channels"),
          api.get("/insights")
        ]);
        setProtocols(pRes.data);
        setChannels(cRes.data);
        setInsight(iRes.data);
      } catch (err) {
        console.error("Erro ao carregar dados do dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-96">
      <RefreshCw className="animate-spin text-primary" size={40} />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-20 py-8 space-y-8">
      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-5">
          <div className="size-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <BarChart3 size={30} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Faturamento Mensal</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">R$ 67.420,00</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-5">
          <div className="size-12 rounded-lg bg-accent/20 text-yellow-700 dark:text-accent flex items-center justify-center">
            <Share2 size={30} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Canais Ativos</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{channels.length}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-5">
          <div className="size-12 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center">
            <Truck size={30} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Itens em Full/FBA</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">482</p>
          </div>
        </div>
      </div>

      {/* Middle Section: Status and Consultant Feedback */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status por Canal */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <span className="material-symbols-outlined text-primary dark:text-accent">signal_cellular_alt</span>
              Status por Canal
            </h3>
            <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full">Sistema Estável</span>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Canal ML */}
            <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="size-10 rounded-full bg-white border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden">
                  <img src="https://http2.mlstatic.com/frontend-assets/ui-navigation/5.19.1/mercadolibre/logo__large_plus.png" alt="ML" className="size-7 object-contain" referrerPolicy="no-referrer" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Mercado Livre</h4>
                  <div className="flex items-center gap-1">
                    <span className="size-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Sincronizado</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Status Full</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">Ativo</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-green-500 h-full w-[94%]"></div>
                </div>
              </div>
            </div>
            {/* Canal Amazon */}
            <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="size-10 rounded-full bg-white border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" alt="AZ" className="size-7 object-contain" referrerPolicy="no-referrer" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Amazon</h4>
                  <div className="flex items-center gap-1">
                    <span className="size-2 rounded-full bg-green-500"></span>
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Sincronizado</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Status FBA</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">Ativo</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-green-500 h-full w-[88%]"></div>
                </div>
              </div>
            </div>
            {/* Canal Shopee */}
            <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="size-10 rounded-full bg-white border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/f/fe/Shopee.svg" alt="SH" className="size-7 object-contain" referrerPolicy="no-referrer" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Shopee</h4>
                  <div className="flex items-center gap-1">
                    <span className="size-2 rounded-full bg-yellow-500"></span>
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Aguardando</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Envios Diretos</span>
                  <span className="font-semibold text-primary dark:text-accent">12 Pendentes</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-primary dark:bg-accent h-full w-[45%]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Parecer do Consultor */}
        <div className="bg-primary text-white rounded-xl shadow-lg shadow-primary/20 p-6 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-8xl">clinical_notes</span>
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-accent">tips_and_updates</span>
              <h3 className="font-bold text-lg">Parecer do Consultor</h3>
            </div>
            <p className="text-blue-100 text-sm leading-relaxed mb-6">
              "{insight?.descricao || "Sua performance no Full cresceu 15% este mês. Recomendamos aumentar o estoque de itens curva A para a Black Friday. O canal Amazon apresenta oportunidade em eletrônicos."}"
            </p>
          </div>
          <div className="relative z-10 flex items-center justify-between border-t border-white/20 pt-4">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-full bg-accent text-primary flex items-center justify-center font-bold text-xs">RC</div>
              <span className="text-xs font-medium">Rodrigo Costa</span>
            </div>
            <button className="text-xs font-bold bg-white text-primary px-3 py-1.5 rounded-lg hover:bg-accent transition-colors">Ver Estratégia</button>
          </div>
        </div>
      </div>

      {/* Minhas Solicitações Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <h3 className="font-bold text-lg">Minhas Solicitações (Protocolos)</h3>
          <Link to="/support" className="text-sm font-semibold text-primary dark:text-accent flex items-center gap-1 hover:underline">
            Ver tudo <span className="material-symbols-outlined text-sm">open_in_new</span>
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-bold">Protocolo</th>
                <th className="px-6 py-4 font-bold">Assunto</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold">Data</th>
                <th className="px-6 py-4 font-bold text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {protocols.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-primary dark:text-accent">#PRT-{p.id}</td>
                  <td className="px-6 py-4 text-sm">{p.titulo}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      p.status === 'aberto' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                      p.status === 'concluido' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                      'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}>
                      {p.status === 'aberto' ? 'Em Análise' : p.status === 'concluido' ? 'Resolvido' : 'Pendente'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                    {format(new Date(p.data_criacao), "dd MMM, yyyy", { locale: ptBR })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link to={`/protocols/${p.id}`} className="p-1 hover:text-primary transition-colors inline-block">
                      <span className="material-symbols-outlined">visibility</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Floating Action Button */}
      <Link 
        to="/new-protocol"
        className="fixed bottom-8 right-8 bg-accent hover:bg-yellow-500 text-primary font-bold py-4 px-6 rounded-full shadow-2xl flex items-center gap-3 transition-all hover:scale-105 active:scale-95 group z-50"
      >
        <span className="material-symbols-outlined font-bold transition-transform group-hover:rotate-90">add_box</span>
        <span className="tracking-tight">Cadastrar Protocolo</span>
      </Link>
    </div>
  );
}
