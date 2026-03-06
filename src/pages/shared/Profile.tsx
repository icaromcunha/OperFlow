import React, { useState, useRef } from "react";
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
  Upload
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function UserProfile({ user, onUpdateUser }: { user: any; onUpdateUser: (userData: any) => void }) {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [formData, setFormData] = useState({
    nome: user.nome,
    empresa: user.empresa || "OperFlow Solutions",
    email: user.email,
    senha: "",
    novaSenha: "",
    confirmarSenha: ""
  });

  const marketplaceAvatars = [
    { id: 'rocket', icon: Rocket, label: 'Foguete', color: 'bg-blue-500', url: 'https://img.icons8.com/color/200/rocket.png' },
    { id: 'bag', icon: ShoppingBag, label: 'Sacola', color: 'bg-orange-500', url: 'https://img.icons8.com/color/200/shopping-bag.png' },
    { id: 'truck', icon: Truck, label: 'Caminhão', color: 'bg-green-500', url: 'https://img.icons8.com/color/200/truck.png' },
    { id: 'pkg', icon: Package, label: 'Pacote', color: 'bg-purple-500', url: 'https://img.icons8.com/color/200/package.png' },
    { id: 'globe', icon: Globe, label: 'Global', color: 'bg-indigo-500', url: 'https://img.icons8.com/color/200/globe.png' },
    { id: 'phone', icon: Smartphone, label: 'Mobile', color: 'bg-pink-500', url: 'https://img.icons8.com/color/200/iphone.png' },
  ];

  const handleAvatarSelect = (url: string) => {
    onUpdateUser({ ...user, avatar: url });
    setShowAvatarPicker(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Limit size to 2MB
      if (file.size > 2 * 1024 * 1024) {
        alert("O arquivo é muito grande. O limite é 2MB.");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateUser({ ...user, avatar: reader.result as string });
        setShowAvatarPicker(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate save
    onUpdateUser({ ...user, nome: formData.nome, empresa: formData.empresa, email: formData.email });
    setIsEditing(false);
    alert("Perfil atualizado com sucesso!");
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
              {user.avatar ? (
                <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
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
                      className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-primary transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500">Confirmar Senha</label>
                    <input 
                      type="password"
                      placeholder="••••••••"
                      disabled={!isEditing}
                      className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-primary transition-all"
                    />
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="flex gap-4 pt-4">
                  <button 
                    type="submit"
                    className="flex-1 py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 size={20} /> Salvar Alterações
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
