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
  MoreVertical,
  Paperclip,
  EyeOff,
  History,
  ChevronLeft,
  ChevronDown,
  Settings
} from "lucide-react";

export default function ProtocolDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [protocol, setProtocol] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [sendingWhatsApp, setSendingWhatsApp] = useState(false);

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

  const handleSendMessage = async (e?: React.FormEvent, sendWhatsApp: boolean = false) => {
    if (e) e.preventDefault();
    if (!message.trim()) return;
    
    if (sendWhatsApp) setSendingWhatsApp(true);
    else setSending(true);

    try {
      await api.post(`/protocols/${id}/interactions`, { 
        mensagem: message, 
        visivel_cliente: true,
        send_whatsapp: sendWhatsApp
      });
      setMessage("");
      fetchProtocol();
      if (sendWhatsApp) {
        alert("Atualização enviada ao cliente via WhatsApp.");
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao enviar mensagem.");
    } finally {
      setSending(false);
      setSendingWhatsApp(false);
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
      <Loader2 className="animate-spin text-primary" size={32} />
    </div>
  );

  if (!protocol) return (
    <div className="p-8 text-center">
      <AlertCircle className="text-6xl text-text-secondary mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-text-primary">Protocolo não encontrado</h2>
      <button onClick={() => navigate(-1)} className="mt-4 text-brand-orange font-bold hover:underline">Voltar</button>
    </div>
  );

  return (
    <div className="p-8 space-y-8 bg-bg-main min-h-screen text-text-primary">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-text-secondary hover:text-brand-orange font-bold transition-colors group"
        >
          <ChevronLeft size={20} className="transition-transform group-hover:-translate-x-1" />
          Voltar à Fila
        </button>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-text-secondary">ID: #OP-{protocol.id}</span>
          <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
            protocol.status === 'aberto' ? 'bg-brand-orange/10 text-brand-orange border-brand-orange/20' :
            protocol.status === 'em atendimento' ? 'bg-brand-purple/10 text-brand-purple border-brand-purple/20' :
            protocol.status === 'concluido' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
            'bg-white/5 text-text-secondary border-border-main'
          }`}>
            {protocol.status}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-bg-card p-8 rounded-2xl border border-border-main shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-brand-orange/10 text-brand-orange rounded-lg">
                <AlertCircle size={20} />
              </div>
              <h1 className="text-2xl font-black tracking-tight text-text-primary">{protocol.titulo}</h1>
            </div>
            <p className="text-text-secondary leading-relaxed bg-white/5 p-4 rounded-xl border border-border-main italic">
              "{protocol.descricao}"
            </p>
          </div>

          {/* Interactions / Activity History */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black uppercase tracking-wider flex items-center gap-2 text-text-primary">
                <History className="text-brand-orange" size={20} />
                Histórico de Atividades
              </h3>
              <span className="text-xs text-text-secondary font-bold">{protocol.interactions.length} eventos</span>
            </div>
            
            <div className="space-y-6 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-border-main">
              {protocol.interactions.map((i: any) => {
                const isWhatsApp = i.mensagem.includes("WhatsApp");
                const isStatusChange = i.mensagem.includes("Status alterado");
                
                return (
                  <div key={i.id} className="relative pl-10">
                    <div className={`absolute left-0 top-2 size-8 rounded-full border-4 border-bg-main flex items-center justify-center text-white text-[10px] font-bold ${
                      isWhatsApp ? 'bg-emerald-500' :
                      isStatusChange ? 'bg-amber-500' :
                      i.autor_tipo === 'admin' ? 'bg-brand-orange' : 'bg-text-secondary'
                    }`}>
                      {isWhatsApp ? <Smartphone size={14} /> :
                       isStatusChange ? <CheckCircle2 size={14} /> :
                       i.autor_tipo === 'admin' ? <ShieldCheck size={14} /> : <User size={14} />}
                    </div>
                    <div className={`p-5 rounded-2xl shadow-sm border ${
                      isWhatsApp || isStatusChange
                        ? 'bg-white/5 border-border-main'
                        : i.autor_tipo === 'admin' 
                          ? 'bg-brand-orange/5 border-brand-orange/10' 
                          : 'bg-bg-card border-border-main'
                    }`}>
                      <div className="flex justify-between items-center mb-3">
                        <span className={`text-[10px] font-black uppercase tracking-widest ${
                          isWhatsApp ? 'text-emerald-500' :
                          isStatusChange ? 'text-amber-500' :
                          i.autor_tipo === 'admin' ? 'text-brand-orange' : 'text-text-secondary'
                        }`}>
                          {isWhatsApp ? 'Sistema (WhatsApp)' :
                           isStatusChange ? 'Sistema (Status)' :
                           `${i.autor_nome} ${i.autor_tipo === 'admin' ? '(Consultor)' : ''}`}
                        </span>
                        <span className="text-[10px] font-bold text-text-secondary">
                          {format(new Date(i.data_envio), "dd/MM HH:mm", { locale: ptBR })}
                        </span>
                      </div>
                      <p className={`text-sm leading-relaxed whitespace-pre-wrap ${
                        isWhatsApp || isStatusChange ? 'text-text-secondary italic' : 'text-text-primary'
                      }`}>
                        {i.mensagem}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reply Box */}
          <div className="bg-bg-card p-6 rounded-2xl border border-border-main shadow-xl">
            <form onSubmit={(e) => handleSendMessage(e, false)} className="space-y-4">
              <div className="relative">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Escreva seu parecer ou orientação estratégica..."
                  className="w-full p-5 bg-bg-card border border-border-main rounded-xl text-sm focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all resize-none text-text-primary min-h-[120px] placeholder:text-text-secondary/50"
                />
                <div className="absolute bottom-4 right-4 flex items-center gap-2">
                  <span className="text-[10px] font-bold text-text-secondary uppercase">Pressione Ctrl+Enter para enviar</span>
                </div>
              </div>
              <div className="flex justify-between items-center flex-wrap gap-4">
                <div className="flex gap-2">
                  <button type="button" className="p-2.5 text-text-secondary hover:bg-white/5 rounded-lg transition-colors flex items-center gap-2">
                    <Paperclip size={18} />
                    <span className="text-xs font-bold uppercase tracking-widest">Anexar</span>
                  </button>
                  <button type="button" className="p-2.5 text-text-secondary hover:bg-white/5 rounded-lg transition-colors flex items-center gap-2">
                    <EyeOff size={18} />
                    <span className="text-xs font-bold uppercase tracking-widest">Nota Interna</span>
                  </button>
                </div>
                <div className="flex gap-3">
                  <button 
                    type="button"
                    disabled={sending || sendingWhatsApp || !message.trim()}
                    onClick={() => handleSendMessage(undefined, true)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-black flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20 uppercase tracking-widest text-xs disabled:opacity-50"
                  >
                    {sendingWhatsApp ? <Loader2 size={16} className="animate-spin" /> : <Smartphone size={16} />}
                    Enviar via WhatsApp
                  </button>
                  <button 
                    type="submit" 
                    disabled={sending || sendingWhatsApp || !message.trim()}
                    className="bg-gradient-to-r from-brand-orange to-brand-purple hover:from-brand-orange-light hover:to-brand-purple-light text-white px-8 py-3 rounded-xl font-black flex items-center gap-2 transition-all shadow-lg shadow-brand-orange/20 uppercase tracking-widest text-xs disabled:opacity-50"
                  >
                    {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                    Salvar Parecer
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Sidebar Column */}
        <aside className="space-y-8">
          <div className="bg-bg-card p-8 rounded-2xl border border-border-main shadow-sm space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] flex items-center gap-2">
                <Settings size={14} />
                Gestão de Status
              </label>
              <div className="relative">
                <select 
                  value={protocol.status}
                  onChange={(e) => updateStatus(e.target.value)}
                  className="w-full p-3 bg-bg-card border border-border-main rounded-xl text-sm font-bold text-text-primary appearance-none focus:ring-2 focus:ring-brand-orange"
                >
                  <option value="aberto">Aguardando Análise</option>
                  <option value="em atendimento">Em Revisão Estratégica</option>
                  <option value="aguardando cliente">Ação do Lojista</option>
                  <option value="concluido">Operação Finalizada</option>
                </select>
                <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] flex items-center gap-2">
                <AlertCircle size={14} />
                Nível de Urgência
              </label>
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-border-main">
                <span className={`size-3 rounded-full shadow-sm ${
                  protocol.prioridade_name === 'Alta' ? 'bg-red-500 animate-pulse' :
                  protocol.prioridade_name === 'Média' ? 'bg-amber-500' : 'bg-brand-orange'
                }`}></span>
                <span className="font-black uppercase tracking-wider text-xs text-text-primary">{protocol.prioridade_name}</span>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-border-main">
              <label className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] flex items-center gap-2">
                <User size={14} />
                Dados do Lojista
              </label>
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-xl bg-brand-orange/10 flex items-center justify-center text-brand-orange font-black text-lg">
                  {protocol.cliente_nome.charAt(0)}
                </div>
                <div className="flex flex-col">
                  <p className="text-sm font-black tracking-tight text-text-primary">{protocol.cliente_nome}</p>
                  <p className="text-xs text-text-secondary font-medium">{protocol.cliente_email}</p>
                </div>
              </div>
              <button className="w-full py-2.5 bg-bg-card hover:bg-white/5 text-text-primary rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2 border border-border-main">
                <History size={16} />
                Ver Histórico do Lojista
              </button>
            </div>

            <div className="pt-6 border-t border-border-main">
              <label className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] flex items-center gap-2 mb-3">
                <Clock size={14} className="text-red-500" />
                SLA de Resposta
              </label>
              <div className="flex flex-col gap-1">
                <span className="text-3xl font-black tracking-tighter text-red-500">02:45:00</span>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
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
