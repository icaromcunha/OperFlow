import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

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
    <div className="max-w-3xl mx-auto px-6 py-12 space-y-8">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-accent font-bold transition-colors group"
      >
        <span className="material-symbols-outlined transition-transform group-hover:-translate-x-1">arrow_back</span>
        Voltar ao Painel
      </button>

      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Novo Protocolo</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium italic">Descreva sua necessidade para que nosso time de consultores possa atuar.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-8">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-lg">label</span>
            Assunto / Título da Operação
          </label>
          <input
            type="text"
            required
            value={formData.titulo}
            onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
            placeholder="Ex: Atualização de estoque curva A - Mercado Livre"
            className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-lg">category</span>
              Categoria
            </label>
            <div className="relative">
              <select
                required
                value={formData.categoria_id}
                onChange={(e) => setFormData({ ...formData, categoria_id: e.target.value })}
                className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all appearance-none text-slate-900 dark:text-white"
              >
                {config?.categorias.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.nome}</option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-lg">priority_high</span>
              Urgência
            </label>
            <div className="relative">
              <select
                required
                value={formData.prioridade_id}
                onChange={(e) => setFormData({ ...formData, prioridade_id: e.target.value })}
                className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all appearance-none text-slate-900 dark:text-white"
              >
                {config?.prioridades.map((p: any) => (
                  <option key={p.id} value={p.id}>{p.nome}</option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-lg">description</span>
            Detalhamento da Demanda
          </label>
          <textarea
            required
            value={formData.descricao}
            onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
            placeholder="Descreva detalhadamente o que precisa ser feito ou o problema identificado..."
            rows={6}
            className="w-full p-5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all resize-none text-slate-900 dark:text-white placeholder:text-slate-400"
          />
        </div>

        <div className="p-5 bg-primary/5 dark:bg-primary/10 rounded-xl flex gap-4 text-slate-700 dark:text-slate-300 text-sm border border-primary/10">
          <span className="material-symbols-outlined text-primary">info</span>
          <p className="leading-relaxed">
            Nosso time de especialistas analisará sua solicitação. O tempo estimado de resposta para esta prioridade é de 
            <b className="text-primary dark:text-accent mx-1">{config?.prioridades.find((p: any) => p.id == formData.prioridade_id)?.tempo_sla || 24} horas</b> 
            úteis.
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-primary hover:bg-primary/90 text-white font-black rounded-xl shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50 uppercase tracking-widest"
        >
          {loading ? "Processando..." : (
            <>
              Enviar Solicitação <span className="material-symbols-outlined">send</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
