import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function ProtocolDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [protocol, setProtocol] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchProtocol = async () => {
    try {
      const response = await api.get(`/protocols/${id}`);
      setProtocol(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProtocol();
  }, [id]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    try {
      await api.post(`/protocols/${id}/interactions`, { mensagem: message, visivel_cliente: true });
      setMessage("");
      fetchProtocol();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
  if (!protocol) return (
    <div className="p-8 text-center">
      <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">error</span>
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Protocolo não encontrado</h2>
      <button onClick={() => navigate(-1)} className="mt-4 text-primary font-bold hover:underline">Voltar</button>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-8 text-slate-900 dark:text-white">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-accent font-bold transition-colors group"
        >
          <span className="material-symbols-outlined transition-transform group-hover:-translate-x-1">arrow_back</span>
          Voltar ao Painel
        </button>
        <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border ${
          protocol.status === 'aberto' ? 'bg-blue-100 text-blue-700 border-blue-200' :
          protocol.status === 'em atendimento' ? 'bg-amber-100 text-amber-700 border-amber-200' :
          protocol.status === 'concluido' ? 'bg-green-100 text-green-700 border-green-200' :
          'bg-slate-100 text-slate-600 border-slate-200'
        }`}>
          {protocol.status === 'aberto' ? 'Aguardando Análise' : 
           protocol.status === 'em atendimento' ? 'Em Revisão' : 
           protocol.status === 'concluido' ? 'Operação Finalizada' : 'Pendente'}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
          <span className="text-xs font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg self-start">
            #OP-{format(new Date(protocol.data_criacao), "yyMM")}-{String(protocol.id).padStart(3, '0')}
          </span>
          <h1 className="text-3xl font-black tracking-tight">{protocol.titulo}</h1>
        </div>
        
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-4 py-2 rounded-xl border border-slate-100 dark:border-slate-700">
            <span className="material-symbols-outlined text-primary text-sm">category</span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">{protocol.categoria_nome}</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-4 py-2 rounded-xl border border-slate-100 dark:border-slate-700">
            <span className="material-symbols-outlined text-primary text-sm">priority_high</span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">{protocol.prioridade_nome}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400 ml-auto">
            <span className="material-symbols-outlined text-sm">calendar_today</span>
            <span className="text-xs font-bold">{format(new Date(protocol.data_criacao), "dd/MM/yyyy HH:mm", { locale: ptBR })}</span>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 italic relative">
          <span className="material-symbols-outlined absolute -top-3 -left-3 text-primary bg-white dark:bg-slate-900 rounded-full p-1 shadow-sm">format_quote</span>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm whitespace-pre-wrap">{protocol.descricao}</p>
        </div>
      </div>

      <div className="space-y-8">
        <div className="flex items-center gap-3 px-2">
          <div className="h-0.5 flex-1 bg-slate-100 dark:bg-slate-800"></div>
          <h3 className="font-black text-slate-400 text-xs uppercase tracking-[0.3em] flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">forum</span>
            Histórico de Interações
          </h3>
          <div className="h-0.5 flex-1 bg-slate-100 dark:bg-slate-800"></div>
        </div>

        <div className="space-y-8">
          {protocol.interactions.filter((i: any) => i.visivel_cliente).map((i: any) => (
            <div key={i.id} className={`flex ${i.autor_tipo === 'cliente' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] md:max-w-[70%] p-6 rounded-2xl shadow-lg border transition-all hover:shadow-xl ${
                i.autor_tipo === 'cliente' 
                  ? 'bg-primary text-white border-primary/20 rounded-tr-none' 
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none'
              }`}>
                <div className="flex justify-between items-center mb-4 gap-8">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm opacity-70">
                      {i.autor_tipo === 'admin' ? 'support_agent' : 'person'}
                    </span>
                    <span className={`text-[10px] font-black uppercase tracking-widest opacity-80`}>
                      {i.autor_tipo === 'admin' ? 'Consultor Especialista' : 'Você'}
                    </span>
                  </div>
                  <span className="text-[10px] opacity-60 font-bold">{format(new Date(i.data_envio), "HH:mm")}</span>
                </div>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{i.mensagem}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {protocol.status !== 'concluido' && (
        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl sticky bottom-8">
          <form onSubmit={handleSendMessage} className="space-y-4">
            <div className="relative">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Digite sua resposta, dúvida ou anexo de evidência..."
                className="w-full p-5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all resize-none text-slate-900 dark:text-white min-h-[100px]"
                rows={3}
              />
            </div>
            <div className="flex justify-between items-center">
              <button type="button" className="p-3 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors flex items-center gap-2">
                <span className="material-symbols-outlined">attach_file</span>
                <span className="text-xs font-bold uppercase tracking-widest">Anexar Arquivo</span>
              </button>
              <button type="submit" className="bg-primary hover:bg-primary/90 text-white px-10 py-4 rounded-xl font-black flex items-center gap-3 transition-all shadow-xl shadow-primary/20 uppercase tracking-widest text-xs">
                Enviar Resposta <span className="material-symbols-outlined text-sm">send</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
