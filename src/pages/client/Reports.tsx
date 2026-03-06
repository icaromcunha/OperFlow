import React, { useState, useEffect } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area, Cell, PieChart, Pie
} from "recharts";
import { 
  TrendingUp, TrendingDown, DollarSign, ShoppingCart, 
  Target, Award, Lightbulb, History, MessageSquare,
  ArrowUpRight, ArrowDownRight, Info
} from "lucide-react";
import api from "../../services/api";

const dataVendas = [
  { name: "Jan", vendas: 45000, pedidos: 120 },
  { name: "Fev", vendas: 52000, pedidos: 145 },
  { name: "Mar", vendas: 48000, pedidos: 132 },
  { name: "Abr", vendas: 61000, pedidos: 168 },
  { name: "Mai", vendas: 55000, pedidos: 150 },
  { name: "Jun", vendas: 67000, pedidos: 185 },
];

const dataCanais = [
  { name: "Mercado Livre", value: 45, color: "#FFE600" },
  { name: "Amazon", value: 30, color: "#FF9900" },
  { name: "Shopee", value: 25, color: "#EE4D2D" },
];

export default function Reports() {
  const [opinions, setOpinions] = useState<any[]>([]);
  const [insights, setInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [opinionsRes, insightsRes] = await Promise.all([
          api.get("/opinions"),
          api.get("/insights")
        ]);
        setOpinions(opinionsRes.data);
        setInsights(insightsRes.data);
      } catch (err) {
        console.error("Erro ao buscar dados do relatório:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Relatórios Estratégicos</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium">Análise de performance e direcionamentos do seu consultor.</p>
      </div>

      {/* Indicadores Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg text-emerald-600 dark:text-emerald-400">
              <DollarSign size={24} />
            </div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full">
              <ArrowUpRight size={14} /> +12.5%
            </span>
          </div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Faturamento Total</p>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">R$ 328.450,00</h3>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
              <ShoppingCart size={24} />
            </div>
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-full">
              <ArrowUpRight size={14} /> +8.2%
            </span>
          </div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total de Pedidos</p>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">950</h3>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-amber-600 dark:text-amber-400">
              <Target size={24} />
            </div>
            <span className="text-xs font-bold text-slate-400 flex items-center gap-1 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-full">
              Meta: 85%
            </span>
          </div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Conversão Média</p>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">3.2%</h3>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-purple-600 dark:text-purple-400">
              <Award size={24} />
            </div>
            <span className="text-xs font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1 bg-purple-50 dark:bg-purple-900/20 px-2 py-1 rounded-full">
              Top 1%
            </span>
          </div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Ticket Médio</p>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">R$ 345,70</h3>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Evolução de Vendas</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dataVendas}>
                <defs>
                  <linearGradient id="colorVendas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0a47c2" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0a47c2" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} tickFormatter={(value) => `R$ ${value/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="vendas" stroke="#0a47c2" strokeWidth={3} fillOpacity={1} fill="url(#colorVendas)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Vendas por Canal</h3>
          <div className="h-[300px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dataCanais}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {dataCanais.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total</p>
                <p className="text-xl font-black text-slate-900 dark:text-white">100%</p>
              </div>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {dataCanais.map((canal) => (
              <div key={canal.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="size-3 rounded-full" style={{ backgroundColor: canal.color }} />
                  <span className="text-slate-600 dark:text-slate-400">{canal.name}</span>
                </div>
                <span className="font-bold text-slate-900 dark:text-white">{canal.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Histórico e Dicas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Histórico de Atualização do Consultor */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
                <History size={20} />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white">Histórico do Consultor</h3>
            </div>
          </div>
          <div className="p-6 space-y-6">
            {loading ? (
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map(i => <div key={i} className="h-20 bg-slate-100 dark:bg-slate-800 rounded-xl" />)}
              </div>
            ) : opinions.length > 0 ? (
              opinions.map((op) => (
                <div key={op.id} className="relative pl-8 pb-6 border-l-2 border-slate-100 dark:border-slate-800 last:pb-0">
                  <div className="absolute left-[-9px] top-0 size-4 rounded-full bg-primary border-4 border-white dark:border-slate-900" />
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      {new Date(op.data_criacao).toLocaleDateString('pt-BR')}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter ${
                      op.status_resultado === 'superou' ? 'bg-emerald-100 text-emerald-700' :
                      op.status_resultado === 'atencao' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {op.status_resultado}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {op.conteudo}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="size-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold">
                      {op.autor_nome?.charAt(0) || 'C'}
                    </div>
                    <span className="text-xs font-medium text-slate-500">{op.autor_nome || 'Consultor'}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <MessageSquare className="mx-auto text-slate-300 mb-4" size={48} />
                <p className="text-slate-500">Nenhum histórico registrado ainda.</p>
              </div>
            )}
          </div>
        </div>

        {/* Dicas de Melhorias */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-amber-600 dark:text-amber-400">
                <Lightbulb size={20} />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white">Dicas de Melhorias</h3>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {loading ? (
              <div className="animate-pulse space-y-4">
                {[1, 2].map(i => <div key={i} className="h-24 bg-slate-100 dark:bg-slate-800 rounded-xl" />)}
              </div>
            ) : insights.length > 0 ? (
              insights.map((insight) => (
                <div key={insight.id} className="p-5 bg-amber-50/50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-2xl group hover:border-amber-300 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
                      <TrendingUp className="text-amber-600" size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white mb-1">{insight.titulo}</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        {insight.descricao}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <Info className="mx-auto text-slate-300 mb-4" size={48} />
                <p className="text-slate-500">Aguardando novos insights estratégicos.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
