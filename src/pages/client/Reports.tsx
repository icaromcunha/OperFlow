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
        setOpinions(Array.isArray(opinionsRes.data) ? opinionsRes.data : []);
        setInsights(Array.isArray(insightsRes.data) ? insightsRes.data : []);
      } catch (err) {
        console.error("Erro ao buscar dados do relatório:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto bg-bg-main min-h-screen text-text-primary">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black text-text-primary tracking-tight">Relatórios Estratégicos</h1>
        <p className="text-text-secondary font-medium">Análise de performance e direcionamentos do seu consultor.</p>
      </div>

      {/* Indicadores Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-bg-card p-6 rounded-2xl border border-border-main shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
              <DollarSign size={24} />
            </div>
            <span className="text-xs font-bold text-emerald-500 flex items-center gap-1 bg-emerald-500/10 px-2 py-1 rounded-full">
              <ArrowUpRight size={14} /> +12.5%
            </span>
          </div>
          <p className="text-sm font-medium text-text-secondary">Faturamento Total</p>
          <h3 className="text-2xl font-black text-text-primary mt-1">R$ 328.450,00</h3>
        </div>

        <div className="bg-bg-card p-6 rounded-2xl border border-border-main shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-brand-purple/10 rounded-lg text-brand-purple">
              <ShoppingCart size={24} />
            </div>
            <span className="text-xs font-bold text-brand-purple flex items-center gap-1 bg-brand-purple/10 px-2 py-1 rounded-full">
              <ArrowUpRight size={14} /> +8.2%
            </span>
          </div>
          <p className="text-sm font-medium text-text-secondary">Total de Pedidos</p>
          <h3 className="text-2xl font-black text-text-primary mt-1">950</h3>
        </div>

        <div className="bg-bg-card p-6 rounded-2xl border border-border-main shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
              <Target size={24} />
            </div>
            <span className="text-xs font-bold text-text-secondary flex items-center gap-1 bg-surface-subtle px-2 py-1 rounded-full border border-border-main">
              Meta: 85%
            </span>
          </div>
          <p className="text-sm font-medium text-text-secondary">Conversão Média</p>
          <h3 className="text-2xl font-black text-text-primary mt-1">3.2%</h3>
        </div>

        <div className="bg-bg-card p-6 rounded-2xl border border-border-main shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-brand-orange/10 rounded-lg text-brand-orange">
              <Award size={24} />
            </div>
            <span className="text-xs font-bold text-brand-orange flex items-center gap-1 bg-brand-orange/10 px-2 py-1 rounded-full">
              Top 1%
            </span>
          </div>
          <p className="text-sm font-medium text-text-secondary">Ticket Médio</p>
          <h3 className="text-2xl font-black text-text-primary mt-1">R$ 345,70</h3>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-bg-card p-6 rounded-2xl border border-border-main shadow-sm">
          <h3 className="text-lg font-bold text-text-primary mb-6">Evolução de Vendas</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dataVendas}>
                <defs>
                  <linearGradient id="colorVendas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF7A18" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#FF7A18" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-main)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--text-secondary)', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--text-secondary)', fontSize: 12}} tickFormatter={(value) => `R$ ${value/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-main)', borderRadius: '12px', color: 'var(--text-primary)' }}
                  itemStyle={{ color: 'var(--text-primary)' }}
                />
                <Area type="monotone" dataKey="vendas" stroke="#FF7A18" strokeWidth={3} fillOpacity={1} fill="url(#colorVendas)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-bg-card p-6 rounded-2xl border border-border-main shadow-sm">
          <h3 className="text-lg font-bold text-text-primary mb-6">Vendas por Canal</h3>
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
                <p className="text-xs font-bold text-text-secondary uppercase tracking-widest">Total</p>
                <p className="text-xl font-black text-text-primary">100%</p>
              </div>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {dataCanais.map((canal) => (
              <div key={canal.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="size-3 rounded-full" style={{ backgroundColor: canal.color }} />
                  <span className="text-text-secondary">{canal.name}</span>
                </div>
                <span className="font-bold text-text-primary">{canal.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Histórico e Dicas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Histórico de Atualização do Consultor */}
        <div className="bg-bg-card rounded-2xl border border-border-main shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border-main flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-brand-purple/10 rounded-lg text-brand-purple">
                <History size={20} />
              </div>
              <h3 className="font-bold text-text-primary">Histórico do Consultor</h3>
            </div>
          </div>
          <div className="p-6 space-y-6">
            {loading ? (
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map(i => <div key={i} className="h-20 bg-surface-subtle rounded-xl" />)}
              </div>
            ) : (Array.isArray(opinions) && opinions.length > 0) ? (
              opinions.map((op) => (
                <div key={op.id} className="relative pl-8 pb-6 border-l-2 border-border-main last:pb-0">
                  <div className="absolute left-[-9px] top-0 size-4 rounded-full bg-brand-orange border-4 border-bg-card" />
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">
                      {new Date(op.data_criacao).toLocaleDateString('pt-BR')}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter border ${
                      op.status_resultado === 'superou' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                      op.status_resultado === 'atencao' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-brand-purple/10 text-brand-purple border-brand-purple/20'
                    }`}>
                      {op.status_resultado}
                    </span>
                  </div>
                  <p className="text-sm text-text-primary leading-relaxed">
                    {op.conteudo}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="size-6 rounded-full bg-surface-subtle flex items-center justify-center text-[10px] font-bold text-text-primary">
                      {op.autor_nome?.charAt(0) || 'C'}
                    </div>
                    <span className="text-xs font-medium text-text-secondary">{op.autor_nome || 'Consultor'}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <MessageSquare className="mx-auto text-text-secondary/30 mb-4" size={48} />
                <p className="text-text-secondary">Nenhum histórico registrado ainda.</p>
              </div>
            )}
          </div>
        </div>

        {/* Dicas de Melhorias */}
        <div className="bg-bg-card rounded-2xl border border-border-main shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border-main flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
                <Lightbulb size={20} />
              </div>
              <h3 className="font-bold text-text-primary">Dicas de Melhorias</h3>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {loading ? (
              <div className="animate-pulse space-y-4">
                {[1, 2].map(i => <div key={i} className="h-24 bg-surface-subtle rounded-xl" />)}
              </div>
            ) : (Array.isArray(insights) && insights.length > 0) ? (
              insights.map((insight) => (
                <div key={insight.id} className="p-5 bg-amber-500/5 border border-amber-500/10 rounded-2xl group hover:border-amber-500/30 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-bg-card rounded-xl shadow-sm border border-border-main">
                      <TrendingUp className="text-amber-500" size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-text-primary mb-1">{insight.titulo}</h4>
                      <p className="text-sm text-text-secondary leading-relaxed">
                        {insight.descricao}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <Info className="mx-auto text-text-secondary/30 mb-4" size={48} />
                <p className="text-text-secondary">Aguardando novos insights estratégicos.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
