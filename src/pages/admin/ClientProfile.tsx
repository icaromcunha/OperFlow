import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useClient } from "../../hooks/useClients";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { StatCard } from "../../components/ui/StatCard";
import { 
  ChevronLeft, 
  TrendingUp, 
  ShoppingBag, 
  Percent, 
  DollarSign,
  CheckCircle2,
  AlertCircle,
  Clock,
  FileText,
  Lightbulb,
  MessageSquare,
  ExternalLink,
  Edit2,
  Save,
  X,
  Plus,
  Trash2,
  History,
  Activity,
  Share2,
  MessageCircle,
  Info,
  Rocket,
  Check
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const MARKETPLACE_LOGOS: Record<string, string> = {
  "Mercado Livre": "https://http2.mlstatic.com/frontend-assets/ui-navigation/5.19.1/mercadolibre/logo__large_plus.png",
  "Amazon": "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
  "Shopee": "https://upload.wikimedia.org/wikipedia/commons/f/fe/Shopee.svg",
  "Magalu": "https://upload.wikimedia.org/wikipedia/commons/e/e1/Magalu_logo.svg",
  "Americanas": "https://upload.wikimedia.org/wikipedia/commons/4/4b/Americanas_logo.svg"
};

export default function ClientProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { client, loading, refresh: refreshClient } = useClient(id);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<any>({});
  const [channels, setChannels] = useState<any[]>([]);
  const [evolution, setEvolution] = useState<any[]>([]);
  const [insights, setInsights] = useState<any[]>([]);
  const [showAllEvolution, setShowAllEvolution] = useState(false);
  const [showAllInsights, setShowAllInsights] = useState(false);
  
  const [newEvolution, setNewEvolution] = useState({ titulo: "", descricao: "", visivel_cliente: true });
  const [isAddingEvolution, setIsAddingEvolution] = useState(false);

  const [newInsight, setNewInsight] = useState({ titulo: "Insight Estratégico", descricao: "", visivel_cliente: true });
  const [isAddingInsight, setIsAddingInsight] = useState(false);

  const [newChannel, setNewChannel] = useState({ nome: "Mercado Livre", status: "ativo", status_cor: "verde", estoque_tipo: "Full", estoque_cor: "verde" });
  const [isAddingChannel, setIsAddingChannel] = useState(false);

  useEffect(() => {
    if (client) {
      setEditData(client);
      fetchExtraData();
    }
  }, [client]);

  const fetchExtraData = async () => {
    try {
      const [cRes, eRes, iRes] = await Promise.all([
        api.get(`/channels?cliente_id=${id}`),
        api.get(`/evolution?cliente_id=${id}`),
        api.get(`/insights?cliente_id=${id}`)
      ]);
      setChannels(cRes.data);
      setEvolution(eRes.data);
      setInsights(Array.isArray(iRes.data) ? iRes.data : (iRes.data ? [iRes.data] : []));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async () => {
    try {
      await api.patch(`/clients/${id}`, editData);
      
      // Update channels (only existing ones, new ones are added via handleAddChannel)
      for (const channel of channels) {
        if (channel.id) {
          await api.post("/channels", { ...channel, cliente_id: id });
        }
      }

      await refreshClient();
      setIsEditing(false);
      alert("Perfil atualizado com sucesso!");
    } catch (err: any) {
      console.error("Erro ao salvar perfil:", err);
      const errorMessage = err.response?.data?.error || err.message || "Erro desconhecido";
      alert(`Erro ao salvar alterações: ${errorMessage}`);
    }
  };

  const handleAddChannel = async () => {
    try {
      await api.post("/channels", { ...newChannel, cliente_id: id });
      setIsAddingChannel(false);
      fetchExtraData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddEvolution = async () => {
    if (!newEvolution.titulo || !newEvolution.descricao) return;
    try {
      await api.post("/evolution", { ...newEvolution, cliente_id: id });
      setNewEvolution({ titulo: "", descricao: "", visivel_cliente: true });
      setIsAddingEvolution(false);
      fetchExtraData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddInsight = async () => {
    if (!newInsight.descricao) return;
    try {
      await api.post("/insights", { ...newInsight, cliente_id: id });
      setNewInsight({ titulo: "Insight Estratégico", descricao: "", visivel_cliente: true });
      setIsAddingInsight(false);
      fetchExtraData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopyLink = (type: string, item?: any) => {
    const baseUrl = window.location.origin;
    let link = baseUrl;
    
    if (type === 'protocol') {
      link = `${baseUrl}/admin/protocols/${item.id}`;
    } else if (type === 'insight') {
      link = `${baseUrl}/?view=insight&id=${item.id}`;
    } else if (type === 'evolution') {
      link = `${baseUrl}/?view=evolution&id=${item.id}`;
    } else if (type === 'client') {
      link = `${baseUrl}/admin/clients/${id}`;
    }

    const shareText = `Confira as informações da operação no OperFlow: ${link}`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(link).then(() => {
        alert("Link copiado para a área de transferência!");
      }).catch(err => {
        console.error("Erro ao copiar link:", err);
        prompt("Copie o link abaixo:", link);
      });
    } else {
      prompt("Copie o link abaixo:", link);
    }
  };

  const handleWhatsAppShare = (type: string, item?: any) => {
    const baseUrl = window.location.origin;
    let link = baseUrl;
    
    if (type === 'protocol') {
      link = `${baseUrl}/admin/protocols/${item.id}`;
    } else if (type === 'insight') {
      link = `${baseUrl}/?view=insight&id=${item.id}`;
    } else if (type === 'evolution') {
      link = `${baseUrl}/?view=evolution&id=${item.id}`;
    } else if (type === 'client') {
      link = `${baseUrl}/admin/clients/${id}`;
    }

    const text = encodeURIComponent(`OperFlow - Gestão Estratégica: ${link}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        try {
          await api.patch(`/clients/${id}`, { ...editData, avatar_url: base64 });
          setEditData({ ...editData, avatar_url: base64 });
          refreshClient();
        } catch (err) {
          console.error("Erro ao salvar avatar:", err);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const updateChannel = (index: number, field: string, value: string) => {
    const newChannels = [...channels];
    newChannels[index] = { ...newChannels[index], [field]: value };
    setChannels(newChannels);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );

  if (!client) return <div className="p-8 text-center font-bold">Cliente não encontrado</div>;

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate("/admin/clients")}
            className="p-2 bg-bg-card rounded-xl border border-border-main text-text-secondary hover:text-brand-orange transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          {client.avatar_url && (
            <div className="size-16 rounded-2xl border border-border-main overflow-hidden shadow-sm">
              <img src={client.avatar_url} className="w-full h-full object-cover" />
            </div>
          )}
          <div>
            <h1 className="text-3xl font-black text-text-primary tracking-tight italic uppercase">{client.nome}</h1>
            <div className="flex items-center gap-2">
              <p className="text-text-secondary font-medium uppercase text-[10px] tracking-widest">Painel do Consultor • Gestão Estratégica</p>
              <button 
                onClick={() => handleCopyLink('client')}
                className="p-1 hover:bg-surface-subtle rounded-lg text-text-secondary transition-colors"
                title="Copiar Link do Perfil"
              >
                <Share2 size={14} />
              </button>
              <button 
                onClick={() => handleWhatsAppShare('client')}
                className="p-1 hover:bg-surface-subtle rounded-lg text-text-secondary hover:text-green-500 transition-colors"
                title="Compartilhar no WhatsApp"
              >
                <MessageCircle size={14} />
              </button>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <button 
                onClick={() => setIsEditing(false)}
                className="px-6 py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2"
              >
                <X size={16} /> Cancelar
              </button>
              <button 
                onClick={handleSave}
                className="px-6 py-2.5 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 flex items-center gap-2"
              >
                <Save size={16} /> Salvar Tudo
              </button>
            </>
          ) : (
            <button 
              onClick={() => setIsEditing(true)}
              className="px-6 py-2.5 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 flex items-center gap-2"
            >
              <Edit2 size={16} /> Atualizar Painel do Cliente
            </button>
          )}
        </div>
      </div>

      {isEditing ? (
        <div className="space-y-8">
          {/* Basic Info Edit */}
          <div className="bg-bg-card p-8 rounded-3xl border border-border-main shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-text-primary uppercase italic">Informações Básicas</h3>
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <div className="size-16 rounded-2xl bg-surface-subtle border border-border-main overflow-hidden">
                    {editData.avatar_url ? (
                      <img src={editData.avatar_url} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-text-secondary">
                        <Plus size={24} />
                      </div>
                    )}
                  </div>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleAvatarChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-primary text-white p-1.5 rounded-lg shadow-lg">
                    <Edit2 size={12} />
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-text-secondary tracking-widest">Nome da Operação</label>
                <input 
                  type="text" 
                  value={editData.nome || ""} 
                  onChange={(e) => setEditData({...editData, nome: e.target.value})}
                  className="w-full p-4 bg-bg-main border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-brand-orange text-text-primary"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-text-secondary tracking-widest">Status Geral</label>
                <select 
                  value={editData.status || ""} 
                  onChange={(e) => setEditData({...editData, status: e.target.value})}
                  className="w-full p-4 bg-bg-main border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-brand-orange text-text-primary"
                >
                  <option value="ativo">Ativo</option>
                  <option value="inativo">Inativo</option>
                  <option value="pendente">Pendente</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-text-secondary tracking-widest">Faturamento Mensal (R$)</label>
                <input 
                  type="number" 
                  value={editData.faturamento || 0} 
                  onChange={(e) => setEditData({...editData, faturamento: parseFloat(e.target.value)})}
                  className="w-full p-4 bg-bg-main border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-brand-orange text-text-primary"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-text-secondary tracking-widest">Volume de Pedidos</label>
                <input 
                  type="number" 
                  value={editData.pedidos || 0} 
                  onChange={(e) => setEditData({...editData, pedidos: parseInt(e.target.value)})}
                  className="w-full p-4 bg-bg-main border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-brand-orange text-text-primary"
                />
              </div>
            </div>
          </div>

          {/* Marketplaces Edit */}
          <div className="bg-bg-card p-8 rounded-3xl border border-border-main shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-text-primary uppercase italic">Gestão de Marketplaces (Farol)</h3>
              <button 
                onClick={() => setIsAddingChannel(true)}
                className="px-4 py-2 bg-primary/10 text-primary rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-primary dark:hover:text-white transition-all flex items-center gap-2"
              >
                <Plus size={14} /> Novo Canal
              </button>
            </div>

            {isAddingChannel && (
              <div className="p-6 rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-text-secondary uppercase tracking-widest">Marketplace</label>
                  <select 
                    value={newChannel.nome} 
                    onChange={(e) => setNewChannel({...newChannel, nome: e.target.value})}
                    className="w-full p-3 bg-bg-card border border-border-main rounded-xl text-xs font-bold text-text-primary"
                  >
                    {Object.keys(MARKETPLACE_LOGOS).map(name => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-text-secondary uppercase tracking-widest">Status</label>
                  <select 
                    value={newChannel.status} 
                    onChange={(e) => setNewChannel({...newChannel, status: e.target.value})}
                    className="w-full p-3 bg-bg-card border border-border-main rounded-xl text-xs font-bold text-text-primary"
                  >
                    <option value="ativo">Ativo</option>
                    <option value="inativo">Inativo</option>
                    <option value="pendente">Pendente</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-text-secondary uppercase tracking-widest">Farol</label>
                  <select 
                    value={newChannel.status_cor} 
                    onChange={(e) => setNewChannel({...newChannel, status_cor: e.target.value})}
                    className="w-full p-3 bg-bg-card border border-border-main rounded-xl text-xs font-bold text-text-primary"
                  >
                    <option value="verde">Verde</option>
                    <option value="amarelo">Amarelo</option>
                    <option value="vermelho">Vermelho</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-text-secondary uppercase tracking-widest">Logística</label>
                  <input 
                    type="text" 
                    value={newChannel.estoque_tipo} 
                    onChange={(e) => setNewChannel({...newChannel, estoque_tipo: e.target.value})}
                    className="w-full p-3 bg-bg-card border border-border-main rounded-xl text-xs font-bold text-text-primary"
                    placeholder="Ex: Full"
                  />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setIsAddingChannel(false)} className="px-4 py-3 text-xs font-bold text-text-secondary">X</button>
                  <button onClick={handleAddChannel} className="flex-1 py-3 bg-primary text-white rounded-xl text-xs font-black uppercase">Adicionar</button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4">
              {channels.map((channel, idx) => (
                <div key={idx} className="p-6 rounded-2xl border border-border-main bg-surface-subtle grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-text-secondary uppercase tracking-widest">Marketplace</label>
                    <p className="font-black text-text-primary">{channel.nome}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-text-secondary uppercase tracking-widest">Status</label>
                    <select 
                      value={channel.status} 
                      onChange={(e) => updateChannel(idx, 'status', e.target.value)}
                      className="w-full p-3 bg-bg-main border-none rounded-xl text-xs font-bold text-text-primary"
                    >
                      <option value="ativo">Ativo</option>
                      <option value="inativo">Inativo</option>
                      <option value="pendente">Pendente</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-text-secondary uppercase tracking-widest">Farol Status</label>
                    <select 
                      value={channel.status_cor} 
                      onChange={(e) => updateChannel(idx, 'status_cor', e.target.value)}
                      className="w-full p-3 bg-bg-main border-none rounded-xl text-xs font-bold text-text-primary"
                    >
                      <option value="verde">Verde (Saudável)</option>
                      <option value="amarelo">Amarelo (Atenção)</option>
                      <option value="vermelho">Vermelho (Crítico)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-text-secondary uppercase tracking-widest">Logística</label>
                    <input 
                      type="text" 
                      value={channel.estoque_tipo} 
                      onChange={(e) => updateChannel(idx, 'estoque_tipo', e.target.value)}
                      className="w-full p-3 bg-bg-main border-none rounded-xl text-xs font-bold text-text-primary"
                      placeholder="Ex: Full, FBA, Fulfillment"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-text-secondary uppercase tracking-widest">Farol Logística</label>
                    <select 
                      value={channel.estoque_cor} 
                      onChange={(e) => updateChannel(idx, 'estoque_cor', e.target.value)}
                      className="w-full p-3 bg-bg-main border-none rounded-xl text-xs font-bold text-text-primary"
                    >
                      <option value="verde">Verde (Abastecido)</option>
                      <option value="amarelo">Amarelo (Reposição)</option>
                      <option value="vermelho">Vermelho (Ruptura)</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Insight Edit */}
          <div className="bg-bg-card p-8 rounded-3xl border border-border-main shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-text-primary uppercase italic flex items-center gap-2">
                <Lightbulb className="text-primary" size={20} />
                Gestão de Insights Estratégicos
              </h3>
              <button 
                onClick={() => setIsAddingInsight(true)}
                className="px-4 py-2 bg-primary/10 text-primary rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-primary dark:hover:text-white transition-all flex items-center gap-2"
              >
                <Plus size={14} /> Novo Insight
              </button>
            </div>

            {isAddingInsight && (
              <div className="p-6 bg-surface-subtle rounded-2xl border border-border-main space-y-4">
                <textarea 
                  rows={4}
                  value={newInsight.descricao} 
                  onChange={(e) => setNewInsight({...newInsight, descricao: e.target.value})}
                  className="w-full p-6 bg-bg-card border border-border-main rounded-2xl text-text-primary font-medium italic focus:ring-2 focus:ring-primary"
                  placeholder="Escreva sua análise detalhada e manual para o cliente..."
                />
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={newInsight.visivel_cliente}
                      onChange={(e) => setNewInsight({...newInsight, visivel_cliente: e.target.checked})}
                      className="size-4 rounded border-border-main text-primary focus:ring-primary"
                    />
                    <span className="text-xs font-bold text-text-secondary uppercase">Visível para o Cliente</span>
                  </label>
                  <div className="flex gap-2">
                    <button onClick={() => setIsAddingInsight(false)} className="px-4 py-2 text-xs font-bold text-text-secondary">Cancelar</button>
                    <button onClick={handleAddInsight} className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-black uppercase">Salvar Insight</button>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {insights.map((item) => (
                <div key={item.id} className="p-6 rounded-2xl border border-border-main bg-bg-card space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-text-secondary uppercase">{format(new Date(item.data_criacao), "dd/MM/yyyy HH:mm")}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${item.visivel_cliente ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-500/10 text-slate-500'}`}>
                        {item.visivel_cliente ? 'Visível' : 'Privado'}
                      </span>
                      <button onClick={() => handleCopyLink('insight', item)} className="p-1.5 hover:bg-surface-subtle rounded-lg text-text-secondary">
                        <Share2 size={14} />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-text-secondary italic">"{item.descricao}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <StatCard 
                label="Faturamento" 
                value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(client.faturamento || 0)} 
                icon={DollarSign} 
                color="text-green-500" 
                trend="+15%" 
              />
              <StatCard 
                label="Pedidos" 
                value={new Intl.NumberFormat('pt-BR').format(client.pedidos || 0)} 
                icon={ShoppingBag} 
                color="text-blue-500" 
                trend="+8%" 
              />
            </div>

            {/* Marketplace Status View */}
            <div className="bg-bg-card rounded-3xl border border-border-main shadow-sm overflow-hidden">
              <div className="p-6 border-b border-border-main bg-surface-subtle">
                <h2 className="text-lg font-black text-text-primary uppercase italic">Status nos Marketplaces</h2>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                {channels.map((m) => (
                  <div key={m.id} className="p-4 rounded-2xl border border-border-main flex items-center gap-4">
                    <div className="size-10 rounded-xl bg-white border border-border-main flex items-center justify-center font-black text-[10px] text-text-secondary overflow-hidden">
                      <img src={MARKETPLACE_LOGOS[m.nome]} className="w-full h-full object-contain p-1" referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-black text-text-primary">{m.nome}</p>
                      <div className="flex items-center gap-1.5">
                        <div className={`size-2 rounded-full ${m.status_cor === 'verde' ? 'bg-green-500' : m.status_cor === 'amarelo' ? 'bg-yellow-500' : 'bg-red-500'}`} />
                        <span className="text-[10px] font-black uppercase text-text-secondary">{m.status}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Evolution History View */}
            <div className="bg-bg-card rounded-3xl border border-border-main shadow-sm overflow-hidden">
              <div className="p-6 border-b border-border-main bg-surface-subtle/50 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-text-primary uppercase italic tracking-tight flex items-center gap-2">
                    <Activity size={20} className="text-brand-orange" />
                    Evolução Estratégica
                  </h2>
                  <p className="text-[10px] text-text-secondary font-black uppercase tracking-widest mt-0.5 ml-7">Marcos e otimizações da operação</p>
                </div>
                <button 
                  onClick={() => setIsAddingEvolution(true)}
                  className="p-2 bg-brand-orange text-white rounded-xl hover:scale-105 transition-transform shadow-lg shadow-brand-orange/20"
                >
                  <Plus size={18} />
                </button>
              </div>
              
              {isAddingEvolution && (
                <div className="p-6 bg-surface-subtle border-b border-border-main space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary ml-1">Título do Marco</label>
                    <input 
                      type="text" 
                      placeholder="Ex: Otimização de Ads - Curva A"
                      value={newEvolution.titulo}
                      onChange={(e) => setNewEvolution({...newEvolution, titulo: e.target.value})}
                      className="w-full p-3 bg-bg-card border border-border-main rounded-xl text-sm font-bold text-text-primary focus:ring-2 focus:ring-brand-orange transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary ml-1">Descrição Detalhada</label>
                    <textarea 
                      placeholder="Descreva as ações tomadas e os resultados esperados..."
                      value={newEvolution.descricao}
                      onChange={(e) => setNewEvolution({...newEvolution, descricao: e.target.value})}
                      className="w-full p-3 bg-bg-card border border-border-main rounded-xl text-sm font-medium text-text-primary focus:ring-2 focus:ring-brand-orange transition-all"
                      rows={3}
                    />
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <div className={`size-5 rounded border-2 border-border-main flex items-center justify-center transition-colors ${newEvolution.visivel_cliente ? 'bg-brand-orange border-brand-orange' : 'bg-bg-card'}`}>
                        {newEvolution.visivel_cliente && <Check size={12} className="text-white" />}
                        <input 
                          type="checkbox" 
                          checked={newEvolution.visivel_cliente}
                          onChange={(e) => setNewEvolution({...newEvolution, visivel_cliente: e.target.checked})}
                          className="hidden"
                        />
                      </div>
                      <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest group-hover:text-text-primary transition-colors">Visível para o Cliente</span>
                    </label>
                    <div className="flex gap-3">
                      <button onClick={() => setIsAddingEvolution(false)} className="px-4 py-2 text-xs font-black uppercase tracking-widest text-text-secondary hover:text-text-primary transition-colors">Cancelar</button>
                      <button onClick={handleAddEvolution} className="px-6 py-2 bg-brand-orange text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-brand-orange/20 hover:scale-105 transition-all">Salvar Marco</button>
                    </div>
                  </div>
                </div>
              )}

              <div className="p-6 space-y-8 relative before:absolute before:inset-0 before:ml-11 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-border-main before:via-border-main before:to-transparent">
                {(showAllEvolution ? evolution : evolution.slice(0, 3)).map((item, i) => (
                  <div key={item.id} className="relative flex gap-6 group">
                    <div className={`size-10 rounded-2xl border-4 border-bg-card flex items-center justify-center z-10 transition-all ${i === 0 ? 'bg-brand-orange text-white shadow-lg shadow-brand-orange/30' : 'bg-surface-subtle text-text-secondary'}`}>
                      {i === 0 ? <Rocket size={18} /> : <History size={18} />}
                    </div>
                    <div className="flex-1 bg-surface-subtle/30 p-5 rounded-2xl border border-border-main group-hover:border-brand-orange/30 transition-all">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <h4 className="font-black text-text-primary uppercase tracking-tight">{item.titulo}</h4>
                          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${item.visivel_cliente ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-500/10 text-slate-500'}`}>
                            {item.visivel_cliente ? 'Publicado' : 'Interno'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-text-secondary opacity-60">{format(new Date(item.data_criacao), "dd/MM/yyyy")}</span>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleCopyLink('evolution', item)} className="p-1.5 hover:bg-bg-card rounded-lg text-text-secondary hover:text-brand-orange transition-colors" title="Copiar Link">
                              <Share2 size={14} />
                            </button>
                            <button onClick={() => handleWhatsAppShare('evolution', item)} className="p-1.5 hover:bg-bg-card rounded-lg text-text-secondary hover:text-green-500 transition-colors" title="Compartilhar no WhatsApp">
                              <MessageCircle size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-text-secondary leading-relaxed font-medium">{item.descricao}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {evolution.length > 3 && (
                <div className="p-4 bg-surface-subtle border-t border-border-main text-center">
                  <button 
                    onClick={() => setShowAllEvolution(!showAllEvolution)}
                    className="text-xs font-black text-primary uppercase tracking-widest hover:underline"
                  >
                    {showAllEvolution ? "Ver Menos" : `Ver Mais ${evolution.length - 3} Atualizações`}
                  </button>
                </div>
              )}
            </div>

            {/* Recent Protocols */}
            <div className="bg-bg-card rounded-3xl border border-border-main shadow-sm overflow-hidden">
              <div className="p-6 border-b border-border-main bg-surface-subtle">
                <h2 className="text-lg font-black text-text-primary uppercase italic">Protocolos Recentes</h2>
              </div>
              <div className="divide-y divide-border-main">
                {(client as any).protocolos_recentes?.map((p: any) => (
                  <div 
                    key={p.id} 
                    onClick={() => navigate(`/admin/protocols/${p.id}`)}
                    className="p-4 flex items-center justify-between bg-surface-hover transition-colors cursor-pointer group"
                  >
                    <div>
                      <p className="text-sm font-bold text-text-primary group-hover:text-brand-orange transition-colors">{p.titulo}</p>
                      <div className="flex items-center gap-2">
                        <p className="text-[10px] font-black text-text-secondary uppercase">#PRT-{p.id}</p>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyLink('protocol', p);
                          }}
                          className="p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-surface-subtle rounded-lg text-text-secondary"
                          title="Copiar Link"
                        >
                          <Share2 size={12} />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleWhatsAppShare('protocol', p);
                          }}
                          className="p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-surface-subtle rounded-lg text-text-secondary hover:text-green-500"
                          title="Compartilhar no WhatsApp"
                        >
                          <MessageCircle size={12} />
                        </button>
                      </div>
                    </div>
                    <StatusBadge status={p.status} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* Consultant Insight View */}
            <div className="bg-bg-card text-text-primary rounded-3xl p-8 shadow-xl border border-border-main relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                <button 
                  onClick={() => setShowAllInsights(!showAllInsights)}
                  className="p-2 hover:bg-surface-subtle rounded-xl text-text-secondary transition-colors"
                  title="Ver Histórico de Insights"
                >
                  <History size={18} />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black uppercase italic flex items-center gap-2">
                  <Lightbulb className="text-primary" size={20} />
                  Insight Atual
                </h3>
                {insights[0] && (
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => handleCopyLink('insight', insights[0])}
                      className="p-1 hover:bg-surface-subtle rounded-lg text-text-secondary transition-colors"
                      title="Copiar Link do Insight"
                    >
                      <Share2 size={12} />
                    </button>
                    <button 
                      onClick={() => handleWhatsAppShare('insight', insights[0])}
                      className="p-1 hover:bg-surface-subtle rounded-lg text-text-secondary hover:text-green-500 transition-colors"
                      title="Compartilhar no WhatsApp"
                    >
                      <MessageCircle size={12} />
                    </button>
                  </div>
                )}
              </div>
              <p className="text-text-secondary text-sm leading-relaxed italic font-medium">
                "{insights[0]?.descricao || "Nenhum insight registrado."}"
              </p>
              
              {showAllInsights && insights.length > 1 && (
                <div className="mt-8 pt-8 border-t border-border-main space-y-6">
                  <h4 className="text-[10px] font-black uppercase text-text-secondary tracking-widest">Histórico de Insights</h4>
                  {insights.slice(1, 4).map(item => (
                    <div key={item.id} className="space-y-2">
                      <span className="text-[9px] font-black text-text-secondary uppercase">{format(new Date(item.data_criacao), "dd/MM/yyyy")}</span>
                      <p className="text-xs text-text-secondary italic line-clamp-2">"{item.descricao}"</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
