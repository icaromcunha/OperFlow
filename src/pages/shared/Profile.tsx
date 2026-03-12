import React, { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { 
  User, 
  Building2, 
  Mail, 
  Lock, 
  Camera, 
  Rocket, 
  ShoppingBag, 
  Truck, 
  Package, 
  Globe, 
  Smartphone,
  CheckCircle2,
  ChevronLeft,
  Upload,
  MessageSquare,
  Bell,
  Loader2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function UserProfile({ user, onUpdateUser }: { user: any; onUpdateUser: (userData: any) => void }) {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: user.nome,
    empresa: user.empresa || "OperFlow Solutions",
    email: user.email,
    telefone: user.telefone || "",
    whatsapp_numero: user.whatsapp_numero || "",
    whatsapp_notificacoes_ativas: user.whatsapp_notificacoes_ativas === 1,
    senha: "",
    novaSenha: "",
    confirmarSenha: ""
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const endpoint = user.type === 'client' ? "/clients/me" : "/users/me";
        const response = await api.get(endpoint);
        if (response.data) {
          setFormData(prev => ({
            ...prev,
            nome: response.data.nome,
            email: response.data.email,
            telefone: response.data.telefone || "",
            whatsapp_numero: response.data.whatsapp_numero || "",
            whatsapp_notificacoes_ativas: response.data.whatsapp_notificacoes_ativas === 1,
            avatar_url: response.data.avatar_url || ""
          }));
        }
      } catch (err) {
        console.error("Erro ao buscar perfil:", err);
      }
    };
    fetchProfile();
  }, [user.type]);

  const marketplaceAvatars = [
    { id: 'rocket', icon: Rocket, label: 'Foguete', color: 'bg-blue-500', url: 'https://img.icons8.com/color/200/rocket.png' },
    { id: 'bag', icon: ShoppingBag, label: 'Sacola', color: 'bg-orange-500', url: 'https://img.icons8.com/color/200/shopping-bag.png' },
    { id: 'truck', icon: Truck, label: 'Caminhão', color: 'bg-green-500', url: 'https://img.icons8.com/color/200/truck.png' },
    { id: 'pkg', icon: Package, label: 'Pacote', color: 'bg-purple-500', url: 'https://img.icons8.com/color/200/package.png' },
    { id: 'globe', icon: Globe, label: 'Global', color: 'bg-indigo-500', url: 'https://img.icons8.com/color/200/globe.png' },
    { id: 'phone', icon: Smartphone, label: 'Mobile', color: 'bg-pink-500', url: 'https://img.icons8.com/color/200/iphone.png' },
  ];

  const handleAvatarSelect = (url: string) => {
    setFormData(prev => ({ ...prev, avatar_url: url }));
    onUpdateUser({ ...user, avatar_url: url });
    setShowAvatarPicker(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("O arquivo é muito grande. O limite é 2MB.");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setFormData(prev => ({ ...prev, avatar_url: base64 }));
        onUpdateUser({ ...user, avatar_url: base64 });
        setShowAvatarPicker(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = user.type === 'client' ? "/clients/me" : "/users/me";
      const payload: any = {
        nome: formData.nome,
        email: formData.email,
        avatar_url: formData.avatar_url
      };

      if (user.type === 'client') {
        payload.telefone = formData.telefone;
        payload.whatsapp_numero = formData.whatsapp_numero;
        payload.whatsapp_notificacoes_ativas = formData.whatsapp_notificacoes_ativas;
      }

      if (formData.novaSenha) {
        if (formData.novaSenha !== formData.confirmarSenha) {
          alert("As senhas não coincidem.");
          setLoading(false);
          return;
        }
        payload.senha = formData.novaSenha;
      }

      await api.patch(endpoint, payload);
      
      onUpdateUser({ 
        ...user, 
        nome: formData.nome, 
        empresa: formData.empresa, 
        email: formData.email,
        whatsapp_numero: formData.whatsapp_numero,
        whatsapp_notificacoes_ativas: formData.whatsapp_notificacoes_ativas ? 1 : 0,
        avatar_url: formData.avatar_url
      });
      setIsEditing(false);
      alert("Perfil atualizado com sucesso!");
    } catch (err) {
      console.error("Erro ao salvar perfil:", err);
      alert("Erro ao salvar perfil.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-10">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-accent font-bold transition-colors group"
      >
        <ChevronLeft size={20} className="transition-transform group-hover:-translate-x-1" />
        Voltar
      </button>

      <div className="flex flex-col md:flex-row gap-10 items-start">
        {/* Left Column: Avatar & Basic Info */}
        <div className="w-full md:w-1/3 flex flex-col items-center space-y-6">
          <div className="relative group">
            <div className="size-40 rounded-3xl bg-slate-200 dark:bg-slate-800 overflow-hidden border-4 border-white dark:border-slate-900 shadow-2xl transition-transform group-hover:scale-[1.02]">
              {user.avatar_url ? (
                <img src={user.avatar_url} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  <User size={64} />
                </div>
              )}
            </div>
            <button 
              onClick={() => setShowAvatarPicker(!showAvatarPicker)}
              className="absolute -bottom-4 -right-4 size-12 bg-primary text-white rounded-2xl flex items-center justify-center shadow-xl hover:bg-primary/90 transition-all hover:scale-110 active:scale-95"
            >
              <Camera size={20} />
            </button>
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{user.nome}</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium uppercase text-xs tracking-widest mt-1">{user.type === 'admin' ? 'Consultor Especialista' : 'Lojista Parceiro'}</p>
          </div>

          {showAvatarPicker && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-4"
            >
              <div className="grid grid-cols-3 gap-3">
                {marketplaceAvatars.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleAvatarSelect(item.url)}
                    className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
                  >
                    <div className={`size-10 ${item.color} rounded-lg flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                      <item.icon size={20} />
                    </div>
                    <span className="text-[10px] font-bold uppercase text-slate-500">{item.label}</span>
                  </button>
                ))}
              </div>
              
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden" 
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-3 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 text-slate-500 hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider"
                >
                  <Upload size={16} /> Fazer Upload (Max 2MB)
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Right Column: Form */}
        <div className="flex-1 w-full">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <User className="text-primary size-5" />
                Informações da Conta
              </h3>
              {!isEditing && (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="text-sm font-bold text-primary dark:text-accent hover:underline"
                >
                  Editar Perfil
                </button>
              )}
            </div>

            <form onSubmit={handleSave} className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <User size={14} /> Usuário
                  </label>
                  <input 
                    type="text"
                    disabled={!isEditing}
                    value={formData.nome}
                    onChange={(e) => setFormData({...formData, nome: e.target.value})}
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-primary transition-all disabled:opacity-60"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Building2 size={14} /> Empresa
                  </label>
                  <div className="relative">
                    <input 
                      type="text"
                      disabled={!isEditing || user.type !== 'admin'}
                      value={formData.empresa}
                      onChange={(e) => setFormData({...formData, empresa: e.target.value})}
                      className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-primary transition-all disabled:opacity-60 pr-10"
                    />
                    {user.type !== 'admin' && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" title="Apenas consultores podem alterar">
                        <Lock size={14} />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Mail size={14} /> E-mail
                </label>
                <input 
                  type="email"
                  disabled={!isEditing}
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-primary transition-all disabled:opacity-60"
                />
              </div>

              {/* WhatsApp Notifications Section (Client Only) */}
              {user.type === 'client' && (
                <div className="pt-8 border-t border-slate-100 dark:border-slate-800 space-y-6">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Bell className="text-primary size-4" />
                    Notificações
                  </h4>
                  
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <MessageSquare size={14} /> WhatsApp para notificações
                      </label>
                      <input 
                        type="text"
                        placeholder="+55 11 99999-9999"
                        disabled={!isEditing}
                        value={formData.whatsapp_numero}
                        onChange={(e) => setFormData({...formData, whatsapp_numero: e.target.value})}
                        className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-primary transition-all disabled:opacity-60"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">Receber atualizações via WhatsApp</p>
                        <p className="text-xs text-slate-500">Quando ativado, você receberá atualizações automáticas de seus protocolos diretamente no WhatsApp.</p>
                      </div>
                      <button
                        type="button"
                        disabled={!isEditing}
                        onClick={() => setFormData({...formData, whatsapp_notificacoes_ativas: !formData.whatsapp_notificacoes_ativas})}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 ${
                          formData.whatsapp_notificacoes_ativas ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-700'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            formData.whatsapp_notificacoes_ativas ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-8 border-t border-slate-100 dark:border-slate-800 space-y-6">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Lock className="text-primary size-4" />
                  Segurança e Senha
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500">Nova Senha</label>
                    <input 
                      type="password"
                      placeholder="••••••••"
                      disabled={!isEditing}
                      value={formData.novaSenha}
                      onChange={(e) => setFormData({...formData, novaSenha: e.target.value})}
                      className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-primary transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500">Confirmar Senha</label>
                    <input 
                      type="password"
                      placeholder="••••••••"
                      disabled={!isEditing}
                      value={formData.confirmarSenha}
                      onChange={(e) => setFormData({...formData, confirmarSenha: e.target.value})}
                      className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-primary transition-all"
                    />
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="flex gap-4 pt-4">
                  <button 
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? <Loader2 size={20} className="animate-spin" /> : <CheckCircle2 size={20} />}
                    {loading ? "Salvando..." : "Salvar Alterações"}
                  </button>
                  <button 
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-8 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
