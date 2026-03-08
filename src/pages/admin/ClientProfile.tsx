import { useState, useEffect } from "react";
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
  Activity
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
  const [insight, setInsight] = useState<any>(null);
  
  const [newEvolution, setNewEvolution] = useState({ titulo: "", descricao: "" });
  const [isAddingEvolution, setIsAddingEvolution] = useState(false);

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
      setInsight(iRes.data || { titulo: "Insight Estratégico", descricao: "" });
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async () => {
    try {
      await api.patch(`/clients/${id}`, editData);
      
      // Update channels
      for (const channel of channels) {
        await api.post("/channels", { ...channel, cliente_id: id });
      }

      // Update insight
      if (insight) {
        await api.post("/insights", { ...insight, cliente_id: id });
      }

      await refreshClient();
      setIsEditing(false);
      alert("Perfil atualizado com sucesso!");
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar alterações.");
    }
  };

  const handleAddEvolution = async () => {
    if (!newEvolution.titulo || !newEvolution.descricao) return;
    try {
      await api.post("/evolution", { ...newEvolution, cliente_id: id });
      setNewEvolution({ titulo: "", descricao: "" });
      setIsAddingEvolution(false);
      fetchExtraData();
    } catch (err) {
      console.error(err);
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
            className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-primary transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight italic uppercase">{client.nome}</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium uppercase text-[10px] tracking-widest">Painel do Consultor • Gestão Estratégica</p>
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
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase italic">Informações Básicas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Nome da Operação</label>
                <input 
                  type="text" 
                  value={editData.nome || ""} 
                  onChange={(e) => setEditData({...editData, nome: e.target.value})}
                  className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Status Geral</label>
                <select 
                  value={editData.status || ""} 
                  onChange={(e) => setEditData({...editData, status: e.target.value})}
                  className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary"
                >
                  <option value="ativo">Ativo</option>
                  <option value="inativo">Inativo</option>
                  <option value="pendente">Pendente</option>
                </select>
              </div>
            </div>
          </div>

          {/* Marketplaces Edit */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase italic">Gestão de Marketplaces (Farol)</h3>
            <div className="grid grid-cols-1 gap-4">
              {channels.map((channel, idx) => (
                <div key={idx} className="p-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/20 grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Marketplace</label>
                    <p className="font-black text-slate-900 dark:text-white">{channel.nome}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Status</label>
                    <select 
                      value={channel.status} 
                      onChange={(e) => updateChannel(idx, 'status', e.target.value)}
                      className="w-full p-3 bg-white dark:bg-slate-800 border-none rounded-xl text-xs font-bold"
                    >
                      <option value="ativo">Ativo</option>
                      <option value="inativo">Inativo</option>
                      <option value="pendente">Pendente</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Farol Status</label>
                    <select 
                      value={channel.status_cor} 
                      onChange={(e) => updateChannel(idx, 'status_cor', e.target.value)}
                      className="w-full p-3 bg-white dark:bg-slate-800 border-none rounded-xl text-xs font-bold"
                    >
                      <option value="verde">Verde (Saudável)</option>
                      <option value="amarelo">Amarelo (Atenção)</option>
                      <option value="vermelho">Vermelho (Crítico)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Logística</label>
                    <input 
                      type="text" 
                      value={channel.estoque_tipo} 
                      onChange={(e) => updateChannel(idx, 'estoque_tipo', e.target.value)}
                      className="w-full p-3 bg-white dark:bg-slate-800 border-none rounded-xl text-xs font-bold"
                      placeholder="Ex: Full, FBA, Fulfillment"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Farol Logística</label>
                    <select 
                      value={channel.estoque_cor} 
                      onChange={(e) => updateChannel(idx, 'estoque_cor', e.target.value)}
                      className="w-full p-3 bg-white dark:bg-slate-800 border-none rounded-xl text-xs font-bold"
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
          <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-xl space-y-6">
            <h3 className="text-lg font-black text-white uppercase italic flex items-center gap-2">
              <Lightbulb className="text-primary" size={20} />
              Insight Estratégico do Consultor
            </h3>
            <textarea 
              rows={4}
              value={insight?.descricao || ""} 
              onChange={(e) => setInsight({...insight, descricao: e.target.value})}
              className="w-full p-6 bg-slate-800 border-none rounded-2xl text-white font-medium italic focus:ring-2 focus:ring-primary"
              placeholder="Escreva sua análise detalhada e manual para o cliente..."
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <StatCard label="Faturamento" value="R$ 142.500,00" icon={DollarSign} color="text-green-500" trend="+15%" />
              <StatCard label="Pedidos" value="1,240" icon={ShoppingBag} color="text-blue-500" trend="+8%" />
            </div>

            {/* Marketplace Status View */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase italic">Status nos Marketplaces</h2>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                {channels.map((m) => (
                  <div key={m.id} className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-4">
                    <div className="size-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-[10px] text-slate-500 overflow-hidden">
                      <img src={MARKETPLACE_LOGOS[m.nome]} className="w-full h-full object-contain p-1" referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-black text-slate-900 dark:text-white">{m.nome}</p>
                      <div className="flex items-center gap-1.5">
                        <div className={`size-2 rounded-full ${m.status_cor === 'verde' ? 'bg-green-500' : m.status_cor === 'amarelo' ? 'bg-yellow-500' : 'bg-red-500'}`} />
                        <span className="text-[10px] font-black uppercase text-slate-500">{m.status}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Evolution History View */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between">
                <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase italic flex items-center gap-2">
                  <Activity size={20} className="text-primary" />
                  Histórico de Evolução
                </h2>
                <button 
                  onClick={() => setIsAddingEvolution(true)}
                  className="px-4 py-2 bg-primary/10 text-primary rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all flex items-center gap-2"
                >
                  <Plus size={14} /> Adicionar Atualização
                </button>
              </div>
              
              {isAddingEvolution && (
                <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 space-y-4">
                  <input 
                    type="text" 
                    placeholder="Título da Atualização (Ex: Otimização de Ads)"
                    value={newEvolution.titulo}
                    onChange={(e) => setNewEvolution({...newEvolution, titulo: e.target.value})}
                    className="w-full p-3 bg-white dark:bg-slate-900 border-none rounded-xl text-sm font-bold"
                  />
                  <textarea 
                    placeholder="Descreva a evolução detalhada..."
                    value={newEvolution.descricao}
                    onChange={(e) => setNewEvolution({...newEvolution, descricao: e.target.value})}
                    className="w-full p-3 bg-white dark:bg-slate-900 border-none rounded-xl text-sm font-medium"
                    rows={3}
                  />
                  <div className="flex justify-end gap-2">
                    <button onClick={() => setIsAddingEvolution(false)} className="px-4 py-2 text-xs font-bold text-slate-500">Cancelar</button>
                    <button onClick={handleAddEvolution} className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-black uppercase">Salvar Evolução</button>
                  </div>
                </div>
              )}

              <div className="p-6 space-y-6">
                {evolution.map((item) => (
                  <div key={item.id} className="flex gap-4 group">
                    <div className="size-10 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                      <History size={20} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-tight">{item.titulo}</h4>
                        <span className="text-[10px] font-black text-slate-400 uppercase">{format(new Date(item.data_criacao), "dd/MM/yyyy")}</span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{item.descricao}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* Consultant Insight View */}
            <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-xl">
              <h3 className="text-lg font-black uppercase italic mb-4 flex items-center gap-2">
                <Lightbulb className="text-primary" size={20} />
                Insight Atual
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed italic font-medium">
                "{insight?.descricao || "Nenhum insight registrado."}"
              </p>
            </div>

            {/* Recent Protocols */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase italic">Protocolos Recentes</h2>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {(client as any).protocolos_recentes?.map((p: any) => (
                  <div key={p.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{p.titulo}</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase">#PRT-{p.id}</p>
                    </div>
                    <StatusBadge status={p.status} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
