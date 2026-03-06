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

  const updateStatus = async (status: string) => {
    try {
      await api.patch(`/protocols/${id}/status`, { status });
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
    <div className="p-8 space-y-8 text-slate-900 dark:text-white">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-accent font-bold transition-colors group"
        >
          <span className="material-symbols-outlined transition-transform group-hover:-translate-x-1">arrow_back</span>
          Voltar à Fila
        </button>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-slate-400">ID: #OP-{protocol.id}</span>
          <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
            protocol.status === 'aberto' ? 'bg-blue-100 text-blue-700 border-blue-200' :
            protocol.status === 'em atendimento' ? 'bg-amber-100 text-amber-700 border-amber-200' :
            protocol.status === 'concluido' ? 'bg-green-100 text-green-700 border-green-200' :
            'bg-slate-100 text-slate-600 border-slate-200'
          }`}>
            {protocol.status}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-primary">description</span>
              <h1 className="text-2xl font-black tracking-tight">{protocol.titulo}</h1>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800 italic">
              "{protocol.descricao}"
            </p>
          </div>

          {/* Interactions */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black uppercase tracking-wider flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">forum</span>
                Histórico de Interações
              </h3>
              <span className="text-xs text-slate-400 font-bold">{protocol.interactions.length} mensagens</span>
            </div>
            
            <div className="space-y-6 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100 dark:before:bg-slate-800">
              {protocol.interactions.map((i: any) => (
                <div key={i.id} className="relative pl-10">
                  <div className={`absolute left-0 top-2 size-8 rounded-full border-4 border-white dark:border-slate-950 flex items-center justify-center text-white text-[10px] font-bold ${
                    i.autor_tipo === 'admin' ? 'bg-primary' : 'bg-slate-400'
                  }`}>
                    <span className="material-symbols-outlined text-xs">
                      {i.autor_tipo === 'admin' ? 'support_agent' : 'person'}
                    </span>
                  </div>
                  <div className={`p-5 rounded-2xl shadow-sm border ${
                    i.autor_tipo === 'admin' 
                      ? 'bg-primary/5 border-primary/10 dark:bg-primary/10' 
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                  }`}>
                    <div className="flex justify-between items-center mb-3">
                      <span className={`text-[10px] font-black uppercase tracking-widest ${
                        i.autor_tipo === 'admin' ? 'text-primary' : 'text-slate-500'
                      }`}>
                        {i.autor_nome} {i.autor_tipo === 'admin' && '(Consultor)'}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">
                        {format(new Date(i.data_envio), "dd/MM HH:mm", { locale: ptBR })}
                      </span>
                    </div>
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{i.mensagem}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reply Box */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl">
            <form onSubmit={handleSendMessage} className="space-y-4">
              <div className="relative">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Escreva seu parecer ou orientação estratégica..."
                  className="w-full p-5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all resize-none text-slate-900 dark:text-white min-h-[120px]"
                />
                <div className="absolute bottom-4 right-4 flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Pressione Ctrl+Enter para enviar</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <button type="button" className="p-2.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-2">
                    <span className="material-symbols-outlined">attach_file</span>
                    <span className="text-xs font-bold uppercase tracking-widest">Anexar</span>
                  </button>
                  <button type="button" className="p-2.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-2">
                    <span className="material-symbols-outlined">visibility_off</span>
                    <span className="text-xs font-bold uppercase tracking-widest">Nota Interna</span>
                  </button>
                </div>
                <button type="submit" className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-xl font-black flex items-center gap-2 transition-all shadow-lg shadow-primary/20 uppercase tracking-widest text-xs">
                  Enviar Parecer <span className="material-symbols-outlined text-sm">send</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Sidebar Column */}
        <aside className="space-y-8">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <span className="material-symbols-outlined text-xs">settings</span>
                Gestão de Status
              </label>
              <div className="relative">
                <select 
                  value={protocol.status}
                  onChange={(e) => updateStatus(e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white appearance-none focus:ring-2 focus:ring-primary"
                >
                  <option value="aberto">Aguardando Análise</option>
                  <option value="em atendimento">Em Revisão Estratégica</option>
                  <option value="aguardando cliente">Ação do Lojista</option>
                  <option value="concluido">Operação Finalizada</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <span className="material-symbols-outlined text-xs">priority_high</span>
                Nível de Urgência
              </label>
              <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                <span className={`size-3 rounded-full shadow-sm ${
                  protocol.prioridade_nome === 'Alta' ? 'bg-red-500 animate-pulse' :
                  protocol.prioridade_nome === 'Média' ? 'bg-amber-500' : 'bg-blue-500'
                }`}></span>
                <span className="font-black uppercase tracking-wider text-xs">{protocol.prioridade_nome}</span>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <span className="material-symbols-outlined text-xs">business</span>
                Dados do Lojista
              </label>
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black text-lg">
                  {protocol.cliente_nome.charAt(0)}
                </div>
                <div className="flex flex-col">
                  <p className="text-sm font-black tracking-tight">{protocol.cliente_nome}</p>
                  <p className="text-xs text-slate-500 font-medium">{protocol.cliente_email}</p>
                </div>
              </div>
              <button className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-sm">history</span>
                Ver Histórico do Lojista
              </button>
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-xs text-red-500">timer</span>
                SLA de Resposta
              </label>
              <div className="flex flex-col gap-1">
                <span className="text-3xl font-black tracking-tighter text-red-600 dark:text-red-400">02:45:00</span>
                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500 w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
