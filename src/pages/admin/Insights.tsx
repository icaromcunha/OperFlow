import { useState } from "react";
import { 
  Lightbulb, 
  TrendingUp, 
  AlertCircle, 
  Zap, 
  ArrowRight, 
  Sparkles,
  Package,
  Star,
  BarChart3,
  Truck
} from "lucide-react";

export default function Insights() {
  const recommendations = [
    {
      id: 1,
      title: "Aumentar estoque para itens mais vendidos",
      description: "Com base na velocidade de vendas atual, 4 itens da 'E-Shop Pro' ficarão sem estoque em 5 dias.",
      client: "E-Shop Pro",
      impact: "Alto",
      type: "inventory",
      icon: Package,
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    {
      id: 2,
      title: "Melhorar qualidade dos anúncios",
      description: "12 anúncios na 'Mega Store' têm pontuação de qualidade abaixo de 60%. Melhorar as fotos pode aumentar a conversão em 15%.",
      client: "Mega Store",
      impact: "Médio",
      type: "quality",
      icon: Star,
      color: "text-amber-500",
      bg: "bg-amber-500/10"
    },
    {
      id: 3,
      title: "Otimizar campanhas de Ads",
      description: "O ACoS nas campanhas Amazon da 'Tech Hub' está acima de 25%. Considere pausar palavras-chave de baixo desempenho.",
      client: "Tech Hub",
      impact: "Alto",
      type: "ads",
      icon: BarChart3,
      color: "text-purple-500",
      bg: "bg-purple-500/10"
    },
    {
      id: 4,
      title: "Verificar atrasos logísticos",
      description: "O tempo médio de envio para 'Global Trade' aumentou 12h esta semana. Potencial impacto na reputação do ML.",
      client: "Global Trade",
      impact: "Crítico",
      type: "logistics",
      icon: Truck,
      color: "text-red-500",
      bg: "bg-red-500/10"
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <Sparkles className="text-primary" />
            Insights Estratégicos
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium italic">Recomendações baseadas em IA para otimização de marketplace</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-xl text-primary font-bold text-sm">
          <Zap size={18} />
          Motor de IA Ativo
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {recommendations.map((rec) => (
          <div key={rec.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden hover:border-primary transition-all group">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${rec.bg} ${rec.color}`}>
                  <rec.icon size={24} />
                </div>
                <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-full ${
                  rec.impact === 'Crítico' ? 'bg-red-100 text-red-700' : 
                  rec.impact === 'Alto' ? 'bg-amber-100 text-amber-700' : 
                  'bg-blue-100 text-blue-700'
                }`}>
                  Impacto {rec.impact}
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
                {rec.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                {rec.description}
              </p>
              
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="size-6 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[8px] font-black text-slate-500">
                    {rec.client.substring(0, 2).toUpperCase()}
                  </div>
                  <span className="text-xs font-bold text-slate-500">{rec.client}</span>
                </div>
                <button className="flex items-center gap-1 text-xs font-bold text-primary hover:gap-2 transition-all">
                  Aplicar Estratégia <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Performance Summary */}
      <div className="bg-slate-900 dark:bg-slate-950 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-4">Resumo de Performance da IA</h2>
          <p className="text-slate-400 max-w-2xl mb-8">
            Nosso motor estratégico analisou mais de 15.000 transações esta semana. A implementação destas recomendações pode resultar em um aumento potencial de receita de <span className="text-green-400 font-bold">18.5%</span> em seu portfólio.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <p className="text-3xl font-bold">84%</p>
              <p className="text-xs text-slate-500 uppercase font-black tracking-widest mt-1">Precisão</p>
            </div>
            <div>
              <p className="text-3xl font-bold">12</p>
              <p className="text-xs text-slate-500 uppercase font-black tracking-widest mt-1">Insights Ativos</p>
            </div>
            <div>
              <p className="text-3xl font-bold">R$ 42k</p>
              <p className="text-xs text-slate-500 uppercase font-black tracking-widest mt-1">Ganhos Potenciais</p>
            </div>
            <div>
              <p className="text-3xl font-bold">92%</p>
              <p className="text-xs text-slate-500 uppercase font-black tracking-widest mt-1">Satisfação do Cliente</p>
            </div>
          </div>
        </div>
        <Sparkles className="absolute -right-12 -bottom-12 size-64 text-white/5 rotate-12" />
      </div>
    </div>
  );
}
