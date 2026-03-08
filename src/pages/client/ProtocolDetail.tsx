import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  MessageSquare, 
  Send, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  User, 
  ShieldCheck,
  Smartphone,
  Loader2,
  Paperclip,
  ChevronLeft,
  History,
  Info
} from "lucide-react";

export default function ProtocolDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [protocol, setProtocol] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

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
    setSending(true);
    try {
      await api.post(`/protocols/${id}/interactions`, { mensagem: message, visivel_cliente: true });
      setMessage("");
      fetchProtocol();
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <Loader2 className="animate-spin text-primary" size={32} />
    </div>
  );

  if (!protocol) return (
    <div className="p-8 text-center">
      <AlertCircle className="text-6xl text-slate-300 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Protocolo não encontrado</h2>
      <button onClick={() => navigate(-1)} className="mt-4 text-primary font-bold hover:underline">Voltar</button>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-8 bg-bg-main min-h-screen text-text-primary">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-text-secondary hover:text-brand-orange font-bold transition-colors group"
        >
          <ChevronLeft size={20} className="transition-transform group-hover:-translate-x-1" />
          Voltar ao Painel
        </button>
        <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border ${
          protocol.status === 'aberto' ? 'bg-brand-orange/10 text-brand-orange border-brand-orange/20' :
          protocol.status === 'em atendimento' ? 'bg-brand-purple/10 text-brand-purple border-brand-purple/20' :
          protocol.status === 'concluido' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
          'bg-white/5 text-text-secondary border-border-main'
        }`}>
          {protocol.status === 'aberto' ? 'Aguardando Análise' : 
           protocol.status === 'em atendimento' ? 'Em Revisão' : 
           protocol.status === 'concluido' ? 'Operação Finalizada' : 'Pendente'}
        </div>
      </div>

      <div className="bg-bg-card p-8 md:p-12 rounded-2xl border border-border-main shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
          <span className="text-xs font-mono text-text-secondary bg-white/5 px-3 py-1 rounded-lg self-start border border-border-main">
            #OP-{format(new Date(protocol.data_criacao), "yyMM")}-{String(protocol.id).padStart(3, '0')}
          </span>
          <h1 className="text-3xl font-black tracking-tight text-white">{protocol.titulo}</h1>
        </div>
        
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-border-main">
            <Info size={14} className="text-brand-orange" />
            <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">{protocol.categoria_nome}</span>
          </div>
          <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-border-main">
            <AlertCircle size={14} className="text-brand-orange" />
            <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">{protocol.prioridade_nome}</span>
          </div>
          <div className="flex items-center gap-2 text-text-secondary ml-auto">
            <Clock size={14} />
            <span className="text-xs font-bold">{format(new Date(protocol.data_criacao), "dd/MM/yyyy HH:mm", { locale: ptBR })}</span>
          </div>
        </div>

        <div className="bg-white/5 p-6 rounded-2xl border border-border-main italic relative">
          <div className="absolute -top-3 -left-3 bg-bg-card rounded-full p-2 shadow-sm border border-border-main">
            <MessageSquare size={16} className="text-brand-orange" />
          </div>
          <p className="text-text-primary leading-relaxed text-sm whitespace-pre-wrap">{protocol.descricao}</p>
        </div>
      </div>

      <div className="space-y-8">
        <div className="flex items-center gap-3 px-2">
          <div className="h-0.5 flex-1 bg-border-main"></div>
          <h3 className="font-black text-text-secondary text-xs uppercase tracking-[0.3em] flex items-center gap-2">
            <History size={14} />
            Linha do Tempo
          </h3>
          <div className="h-0.5 flex-1 bg-border-main"></div>
        </div>

        <div className="space-y-8">
          {protocol.interactions.filter((i: any) => i.visivel_cliente).map((i: any) => {
            const isWhatsApp = i.mensagem.includes("WhatsApp");
            const isStatusChange = i.mensagem.includes("Status alterado");
            const isSystem = isWhatsApp || isStatusChange;

            if (isSystem) {
              return (
                <div key={i.id} className="flex justify-center">
                  <div className="flex items-center gap-3 px-6 py-2 bg-white/5 rounded-full border border-border-main">
                    {isWhatsApp ? <Smartphone size={14} className="text-emerald-500" /> : <CheckCircle2 size={14} className="text-amber-500" />}
                    <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">
                      {i.mensagem} • {format(new Date(i.data_envio), "HH:mm")}
                    </span>
                  </div>
                </div>
              );
            }

            return (
              <div key={i.id} className={`flex ${i.autor_tipo === 'cliente' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] md:max-w-[70%] p-6 rounded-2xl shadow-lg border transition-all hover:shadow-xl ${
                  i.autor_tipo === 'cliente' 
                    ? 'bg-gradient-to-br from-brand-orange to-brand-purple text-white border-white/10 rounded-tr-none' 
                    : 'bg-bg-card border-border-main text-text-primary rounded-tl-none'
                }`}>
                  <div className="flex justify-between items-center mb-4 gap-8">
                    <div className="flex items-center gap-2">
                      {i.autor_tipo === 'admin' ? <ShieldCheck size={14} className="opacity-70" /> : <User size={14} className="opacity-70" />}
                      <span className={`text-[10px] font-black uppercase tracking-widest opacity-80`}>
                        {i.autor_tipo === 'admin' ? 'Consultor Especialista' : 'Você'}
                      </span>
                    </div>
                    <span className="text-[10px] opacity-60 font-bold">{format(new Date(i.data_envio), "HH:mm")}</span>
                  </div>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{i.mensagem}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {protocol.status !== 'concluido' && (
        <div className="bg-bg-card p-8 rounded-2xl border border-border-main shadow-2xl sticky bottom-8">
          <form onSubmit={handleSendMessage} className="space-y-4">
            <div className="relative">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Digite sua resposta, dúvida ou anexo de evidência..."
                className="w-full p-5 bg-white/5 border border-border-main rounded-xl text-sm focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all resize-none text-white min-h-[100px] placeholder:text-text-secondary/50"
                rows={3}
              />
            </div>
            <div className="flex justify-between items-center">
              <button type="button" className="p-3 text-text-secondary hover:bg-white/5 rounded-xl transition-colors flex items-center gap-2">
                <Paperclip size={18} />
                <span className="text-xs font-bold uppercase tracking-widest">Anexar Arquivo</span>
              </button>
              <button 
                type="submit" 
                disabled={sending || !message.trim()}
                className="bg-gradient-to-r from-brand-orange to-brand-purple hover:from-brand-orange-light hover:to-brand-purple-light text-white px-10 py-4 rounded-xl font-black flex items-center gap-3 transition-all shadow-xl shadow-brand-orange/20 uppercase tracking-widest text-xs disabled:opacity-50"
              >
                {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                Enviar Resposta
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
