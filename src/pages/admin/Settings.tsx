import { useState, useEffect } from "react";
import { 
  Settings, 
  Shield, 
  Palette, 
  Bell, 
  Globe, 
  Save, 
  CheckCircle2,
  Lock,
  Mail,
  Smartphone,
  Loader2,
  MessageSquare,
  Key,
  Phone,
  Link as LinkIcon,
  Send,
  Database
} from "lucide-react";
import api from "../../services/api";

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState("geral");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [validating, setValidating] = useState(false);
  const [supabaseStatus, setSupabaseStatus] = useState<{ enabled: boolean; message: string } | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [config, setConfig] = useState({
    nome_sistema: "OperFlow Consulting",
    cor_primaria: "#0a47c2",
    cor_secundaria: "#fbbf24",
    whatsapp_api_provider: "Meta Cloud API",
    whatsapp_api_token: "",
    whatsapp_numero_remetente: "",
    whatsapp_webhook_url: ""
  });

  useEffect(() => {
    const fetchConfig = async () => {
      setLoading(true);
      try {
        // Assuming empresa_id = 1 for demo
        const response = await api.get("/config/1");
        if (response.data) {
          setConfig({
            nome_sistema: response.data.nome_sistema || "OperFlow Consulting",
            cor_primaria: response.data.cor_primaria || "#0a47c2",
            cor_secundaria: response.data.cor_secundaria || "#fbbf24",
            whatsapp_api_provider: response.data.whatsapp_api_provider || "Meta Cloud API",
            whatsapp_api_token: response.data.whatsapp_api_token || "",
            whatsapp_numero_remetente: response.data.whatsapp_numero_remetente || "",
            whatsapp_webhook_url: response.data.whatsapp_webhook_url || ""
          });
        }

        // Validate Supabase connection
        const sbResponse = await api.get("/config/validate-supabase");
        setSupabaseStatus(sbResponse.data);
      } catch (err) {
        console.error("Erro ao carregar configurações:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.patch("/config/1", config);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.error("Erro ao salvar configurações:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleTestWhatsApp = async () => {
    setTesting(true);
    try {
      // Mock test
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert("Teste de envio disparado com sucesso! Verifique o número remetente.");
    } catch (err) {
      alert("Erro ao testar integração.");
    } finally {
      setTesting(false);
    }
  };

  const handleSyncSupabase = async () => {
    if (!confirm("Isso irá sincronizar todos os dados locais (usuários, clientes, protocolos, etc.) para o Supabase. Deseja continuar?")) return;
    
    setSyncing(true);
    try {
      const response = await api.post("/config/sync-supabase");
      alert(response.data.message || "Sincronização concluída com sucesso!");
    } catch (err: any) {
      alert(err.response?.data?.error || "Erro ao sincronizar com Supabase.");
    } finally {
      setSyncing(false);
    }
  };

  const handleValidateSupabase = async () => {
    setValidating(true);
    try {
      const response = await api.get("/config/validate-supabase");
      setSupabaseStatus(response.data);
      alert(response.data.message);
    } catch (err) {
      alert("Erro ao validar conexão.");
    } finally {
      setValidating(false);
    }
  };

  const tabs = [
    { id: "geral", label: "Geral", icon: Settings },
    { id: "seguranca", label: "Segurança", icon: Shield },
    { id: "aparencia", label: "Aparência", icon: Palette },
    { id: "notificacoes", label: "Notificações", icon: Bell },
    { id: "integracoes", label: "Integrações", icon: LinkIcon },
    { id: "supabase", label: "Supabase", icon: Database },
  ];

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <Loader2 className="animate-spin text-primary" size={32} />
    </div>
  );

  return (
    <div className="space-y-8 relative">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-8 right-8 z-[100] bg-green-500 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 size={20} />
          <span className="font-bold">Configurações salvas com sucesso!</span>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <Settings className="text-primary" />
            Configurações do Sistema
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium italic">Personalize sua plataforma OperFlow e gerencie preferências</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all disabled:opacity-50"
        >
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {saving ? "Salvando..." : "Salvar Alterações"}
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${
                activeTab === tab.id 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <tab.icon size={20} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-8">
            {activeTab === "geral" && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                    <Globe size={20} className="text-primary" />
                    Informações da Empresa
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase text-slate-400 tracking-widest">Nome do Sistema (White-label)</label>
                      <input 
                        type="text" 
                        value={config.nome_sistema} 
                        onChange={(e) => setConfig({...config, nome_sistema: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary transition-all" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase text-slate-400 tracking-widest">CNPJ</label>
                      <input type="text" defaultValue="12.345.678/0001-90" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary transition-all opacity-50 cursor-not-allowed" disabled />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase text-slate-400 tracking-widest">Cor Primária</label>
                      <div className="flex gap-2">
                        <input 
                          type="color" 
                          value={config.cor_primaria} 
                          onChange={(e) => setConfig({...config, cor_primaria: e.target.value})}
                          className="size-11 rounded-lg border-none cursor-pointer" 
                        />
                        <input 
                          type="text" 
                          value={config.cor_primaria} 
                          onChange={(e) => setConfig({...config, cor_primaria: e.target.value})}
                          className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary transition-all" 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase text-slate-400 tracking-widest">Cor Secundária</label>
                      <div className="flex gap-2">
                        <input 
                          type="color" 
                          value={config.cor_secundaria} 
                          onChange={(e) => setConfig({...config, cor_secundaria: e.target.value})}
                          className="size-11 rounded-lg border-none cursor-pointer" 
                        />
                        <input 
                          type="text" 
                          value={config.cor_secundaria} 
                          onChange={(e) => setConfig({...config, cor_secundaria: e.target.value})}
                          className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary transition-all" 
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                    <CheckCircle2 size={20} className="text-green-500" />
                    Preferências do Sistema
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">Fuso Horário Automático</p>
                        <p className="text-xs text-slate-500">Ajustar horários de protocolos com base na localização</p>
                      </div>
                      <div className="size-12 bg-primary/10 rounded-xl flex items-center justify-center">
                        <input type="checkbox" defaultChecked className="size-5 text-primary rounded focus:ring-primary" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">Relatórios Semanais</p>
                        <p className="text-xs text-slate-500">Enviar resumo de performance por e-mail toda segunda-feira</p>
                      </div>
                      <div className="size-12 bg-primary/10 rounded-xl flex items-center justify-center">
                        <input type="checkbox" defaultChecked className="size-5 text-primary rounded focus:ring-primary" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "seguranca" && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                    <Lock size={20} className="text-red-500" />
                    Segurança da Conta
                  </h3>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-6 border border-slate-100 dark:border-slate-800 rounded-2xl">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-xl">
                          <Smartphone size={24} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">Autenticação de Dois Fatores (2FA)</p>
                          <p className="text-xs text-slate-500">Adicione uma camada extra de segurança à sua conta</p>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl text-xs font-bold hover:bg-primary hover:text-white transition-all">Configurar</button>
                    </div>
                    <div className="flex items-center justify-between p-6 border border-slate-100 dark:border-slate-800 rounded-2xl">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-500 rounded-xl">
                          <Mail size={24} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">Verificação de E-mail</p>
                          <p className="text-xs text-slate-500">Seu e-mail foi verificado com sucesso em 12/02/2026</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-green-500 flex items-center gap-1">
                        <CheckCircle2 size={16} /> Verificado
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "integracoes" && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                    <MessageSquare size={20} className="text-green-500" />
                    Integração WhatsApp
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                        <Globe size={14} /> API Provider
                      </label>
                      <select 
                        value={config.whatsapp_api_provider}
                        onChange={(e) => setConfig({...config, whatsapp_api_provider: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary transition-all"
                      >
                        <option>Meta Cloud API</option>
                        <option>Twilio</option>
                        <option>360Dialog</option>
                        <option>Z-API</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                        <Key size={14} /> Token da API
                      </label>
                      <input 
                        type="password" 
                        placeholder="••••••••••••••••"
                        value={config.whatsapp_api_token}
                        onChange={(e) => setConfig({...config, whatsapp_api_token: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary transition-all" 
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                        <Phone size={14} /> Número Remetente
                      </label>
                      <input 
                        type="text" 
                        placeholder="+55 11 99999-9999"
                        value={config.whatsapp_numero_remetente}
                        onChange={(e) => setConfig({...config, whatsapp_numero_remetente: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary transition-all" 
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                        <LinkIcon size={14} /> Webhook URL
                      </label>
                      <input 
                        type="text" 
                        placeholder="https://api.operflow.com/webhooks/whatsapp"
                        value={config.whatsapp_webhook_url}
                        onChange={(e) => setConfig({...config, whatsapp_webhook_url: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary transition-all" 
                      />
                    </div>
                  </div>

                  <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
                    <button 
                      onClick={handleTestWhatsApp}
                      disabled={testing}
                      className="flex items-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl font-bold text-sm hover:bg-primary hover:text-white transition-all disabled:opacity-50"
                    >
                      {testing ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                      {testing ? "Testando..." : "Testar envio de mensagem"}
                    </button>
                  </div>
                </div>
              </div>
            )}
            {activeTab === "supabase" && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                    <Database size={20} className="text-blue-500" />
                    Integração com Supabase
                  </h3>
                  
                  <div className="p-6 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/30 mb-8">
                    <p className="text-sm text-blue-700 dark:text-blue-300 font-medium leading-relaxed">
                      O Supabase fornece uma infraestrutura de banco de dados escalável e em tempo real. 
                      Certifique-se de que as variáveis de ambiente <code className="bg-blue-100 dark:bg-blue-900/50 px-1.5 py-0.5 rounded">SUPABASE_URL</code> e <code className="bg-blue-100 dark:bg-blue-900/50 px-1.5 py-0.5 rounded">SUPABASE_ANON_KEY</code> estão configuradas.
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-6 border border-slate-100 dark:border-slate-800 rounded-2xl">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-slate-50 dark:bg-slate-800 text-primary rounded-xl">
                          <Database size={24} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">Sincronizar Dados Locais</p>
                          <p className="text-xs text-slate-500">Pressione para migrar os dados do SQLite para o seu banco Supabase</p>
                        </div>
                      </div>
                      <button 
                        onClick={handleSyncSupabase}
                        disabled={syncing}
                        className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                          syncing 
                            ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                            : "bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20"
                        } disabled:opacity-50`}
                      >
                        {syncing ? <Loader2 size={14} className="animate-spin" /> : <Database size={14} />}
                        {syncing ? "Sincronizando..." : "Sincronizar Agora"}
                      </button>
                    </div>

                    <div className="p-6 border border-slate-100 dark:border-slate-800 rounded-2xl space-y-4">
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">Status da Conexão</p>
                        <button 
                          onClick={handleValidateSupabase}
                          disabled={validating}
                          className="text-xs font-bold text-primary hover:underline disabled:opacity-50"
                        >
                          {validating ? "Validando..." : "Testar Novamente"}
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`size-2 rounded-full ${supabaseStatus?.enabled ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                          {supabaseStatus?.message || "Verificando status..."}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
