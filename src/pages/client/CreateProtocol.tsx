import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { 
  ArrowLeft, 
  Tag, 
  Layers, 
  AlertTriangle, 
  FileText, 
  Info, 
  Send,
  ChevronDown
} from "lucide-react";

export default function CreateProtocol() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState<any>(null);
  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    categoria_id: "",
    prioridade_id: ""
  });

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await api.get("/companies/config");
        setConfig(response.data);
        if (response.data.categorias.length > 0) {
          setFormData(prev => ({ ...prev, categoria_id: response.data.categorias[0].id }));
        }
        if (response.data.prioridades.length > 0) {
          setFormData(prev => ({ ...prev, prioridade_id: response.data.prioridades[0].id }));
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchConfig();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post("/protocols", formData);
      navigate(`/protocols/${response.data.id}`);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 space-y-8 bg-bg-main min-h-screen text-text-primary">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-text-secondary hover:text-brand-orange font-bold transition-colors group"
      >
        <ArrowLeft size={20} className="transition-transform group-hover:-translate-x-1" />
        Voltar ao Painel
      </button>

      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-white tracking-tight">Novo Protocolo</h1>
        <p className="text-text-secondary font-medium italic">Descreva sua necessidade para que nosso time de consultores possa atuar.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-bg-card p-8 md:p-12 rounded-2xl border border-border-main shadow-xl space-y-8">
        <div className="space-y-2">
          <label className="text-sm font-bold text-text-secondary uppercase tracking-wider flex items-center gap-2">
            <Tag size={18} className="text-brand-orange" />
            Assunto / Título da Operação
          </label>
          <input
            type="text"
            required
            value={formData.titulo}
            onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
            placeholder="Ex: Atualização de estoque curva A - Mercado Livre"
            className="w-full p-4 bg-white/5 border border-border-main rounded-xl focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all text-white placeholder:text-text-secondary/50"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-sm font-bold text-text-secondary uppercase tracking-wider flex items-center gap-2">
              <Layers size={18} className="text-brand-orange" />
              Categoria
            </label>
            <div className="relative">
              <select
                required
                value={formData.categoria_id}
                onChange={(e) => setFormData({ ...formData, categoria_id: e.target.value })}
                className="w-full p-4 bg-white/5 border border-border-main rounded-xl focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all appearance-none text-white"
              >
                {config?.categorias.map((c: any) => (
                  <option key={c.id} value={c.id} className="bg-bg-card">{c.nome}</option>
                ))}
              </select>
              <ChevronDown size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-text-secondary uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle size={18} className="text-brand-orange" />
              Urgência
            </label>
            <div className="relative">
              <select
                required
                value={formData.prioridade_id}
                onChange={(e) => setFormData({ ...formData, prioridade_id: e.target.value })}
                className="w-full p-4 bg-white/5 border border-border-main rounded-xl focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all appearance-none text-white"
              >
                {config?.prioridades.map((p: any) => (
                  <option key={p.id} value={p.id} className="bg-bg-card">{p.nome}</option>
                ))}
              </select>
              <ChevronDown size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-text-secondary uppercase tracking-wider flex items-center gap-2">
            <FileText size={18} className="text-brand-orange" />
            Detalhamento da Demanda
          </label>
          <textarea
            required
            value={formData.descricao}
            onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
            placeholder="Descreva detalhadamente o que precisa ser feito ou o problema identificado..."
            rows={6}
            className="w-full p-5 bg-white/5 border border-border-main rounded-xl focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all resize-none text-white placeholder:text-text-secondary/50"
          />
        </div>

        <div className="p-5 bg-brand-orange/10 rounded-xl flex gap-4 text-text-secondary text-sm border border-brand-orange/20">
          <Info size={20} className="text-brand-orange shrink-0" />
          <p className="leading-relaxed">
            Nosso time de especialistas analisará sua solicitação. O tempo estimado de resposta para esta prioridade é de 
            <b className="text-brand-orange mx-1">{config?.prioridades.find((p: any) => p.id == formData.prioridade_id)?.tempo_sla || 24} horas</b> 
            úteis.
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-brand-orange to-brand-purple hover:from-brand-orange-light hover:to-brand-purple-light text-white font-black rounded-xl shadow-xl shadow-brand-orange/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50 uppercase tracking-widest"
        >
          {loading ? "Processando..." : (
            <>
              Enviar Solicitação <Send size={20} />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
