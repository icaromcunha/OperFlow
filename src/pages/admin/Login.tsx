import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn, Eye, EyeOff, ShieldCheck, Sun, Moon, ArrowRight } from "lucide-react";
import api from "../../services/api";
import { useTheme } from "../../components/ThemeProvider";

export default function AdminLogin({ onLogin }: { onLogin: (user: any) => void }) {
  const [email, setEmail] = useState(() => localStorage.getItem("remembered_email_admin") || "");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { toggleDarkMode } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await api.post("/auth/login", { email, senha });
      const { token, user } = response.data;
      
      if (user.type !== 'admin') {
        setError("Acesso restrito a administradores e consultores.");
        setLoading(false);
        return;
      }

      if (rememberMe) {
        localStorage.setItem("remembered_email_admin", email);
      } else {
        localStorage.removeItem("remembered_email_admin");
      }

      localStorage.setItem("token", token);
      onLogin(user);
      navigate("/admin");
    } catch (err: any) {
      setError(err.response?.data?.error || "Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-main flex transition-colors duration-200 overflow-hidden text-text-primary">
      {/* Left Side - Branding & Info */}
      <div className="hidden lg:flex lg:w-1/2 bg-bg-card relative items-center justify-center p-12 overflow-hidden border-r border-border-main">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/20 to-brand-purple/20" />
        
        <div className="relative z-10 max-w-lg">
          <div className="flex items-center gap-3 mb-8">
            <div className="size-12 bg-gradient-to-br from-brand-orange to-brand-purple rounded-2xl flex items-center justify-center shadow-xl shadow-brand-orange/20">
              <ShieldCheck className="text-white size-7" />
            </div>
            <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase">OperFlow</h1>
          </div>
          
          <h2 className="text-5xl font-black text-white leading-tight mb-6">
            Gestão Estratégica de <span className="text-brand-orange">Marketplaces</span>
          </h2>
          <p className="text-text-secondary text-xl font-medium leading-relaxed mb-10">
            A plataforma definitiva para consultores e agências escalarem operações de e-commerce com inteligência e dados.
          </p>
          
          <div className="space-y-6">
            {[
              "Monitoramento em tempo real de múltiplos sellers",
              "Análise preditiva de performance e estoque",
              "Gestão centralizada de protocolos e atendimento",
              "Relatórios estratégicos automatizados"
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-white/80 font-semibold">
                <div className="size-6 rounded-full bg-brand-orange/20 flex items-center justify-center text-brand-orange">
                  <ArrowRight size={14} />
                </div>
                {item}
              </div>
            ))}
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute -bottom-24 -left-24 size-96 bg-brand-orange/10 rounded-full blur-3xl" />
        <div className="absolute -top-24 -right-24 size-96 bg-brand-purple/10 rounded-full blur-3xl" />
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 bg-bg-main">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-12 justify-center">
            <div className="size-10 bg-gradient-to-br from-brand-orange to-brand-purple rounded-xl flex items-center justify-center">
              <ShieldCheck className="text-white size-6" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tighter italic uppercase">OperFlow</h1>
          </div>

          <div className="mb-10">
            <h3 className="text-3xl font-black text-white mb-2">Acesso Administrativo</h3>
            <p className="text-text-secondary font-medium">Entre com suas credenciais de consultor ou admin.</p>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl text-sm font-bold flex items-center gap-3">
              <div className="size-2 rounded-full bg-red-500 animate-pulse" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-text-secondary tracking-widest ml-1" htmlFor="email">
                E-mail Profissional
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary size-5" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-border-main rounded-2xl text-white focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all font-semibold placeholder:text-text-secondary/30"
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-[10px] font-black uppercase text-text-secondary tracking-widest" htmlFor="password">
                  Senha de Acesso
                </label>
                <button type="button" className="text-[10px] font-black uppercase text-brand-orange hover:underline">Esqueci a senha</button>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary size-5" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 bg-white/5 border border-border-main rounded-2xl text-white focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all font-semibold placeholder:text-text-secondary/30"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-white"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-border-main bg-white/5 text-brand-orange focus:ring-brand-orange cursor-pointer"
              />
              <label className="ml-2 text-[10px] font-black uppercase text-text-secondary tracking-widest cursor-pointer" htmlFor="remember">Manter conectado</label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-brand-orange to-brand-purple hover:from-brand-orange-light hover:to-brand-purple-light text-white font-black py-4 px-4 rounded-2xl transition-all shadow-xl shadow-brand-orange/20 flex items-center justify-center gap-3 disabled:opacity-50 active:scale-[0.98]"
            >
              <span>{loading ? "AUTENTICANDO..." : "ENTRAR NO PAINEL"}</span>
              {!loading && <LogIn size={20} />}
            </button>
          </form>

          <div className="mt-12 flex items-center justify-between">
            <button 
              onClick={toggleDarkMode}
              className="flex items-center gap-2 text-xs font-bold text-text-secondary hover:text-brand-orange transition-colors"
            >
              <div className="size-8 rounded-lg bg-white/5 flex items-center justify-center border border-border-main">
                <Sun className="hidden dark:block size-4" />
                <Moon className="block dark:hidden size-4" />
              </div>
              Alternar Tema
            </button>
            
            <button 
              onClick={() => navigate("/login")}
              className="text-xs font-bold text-text-secondary hover:text-brand-orange transition-colors flex items-center gap-2"
            >
              Acesso Lojista
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
