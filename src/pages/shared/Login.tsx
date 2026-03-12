import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn, Eye, EyeOff, Sun, Moon, ArrowRight, ShieldCheck } from "lucide-react";
import api from "../../services/api";
import { useTheme } from "../../components/ThemeProvider";
import { Logo } from "../../components/ui/Logo";

export default function Login({ onLogin }: { onLogin: (user: any) => void }) {
  const [email, setEmail] = useState(() => localStorage.getItem("remembered_email") || "");
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
      
      if (rememberMe) {
        localStorage.setItem("remembered_email", email);
      } else {
        localStorage.removeItem("remembered_email");
      }

      localStorage.setItem("token", token);
      onLogin(user);
      
      if (user.type === 'admin') {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err: any) {
      console.error("Login Error:", err);
      const status = err.response?.status;
      const apiBase = (api.defaults.baseURL || "/api").toString();

      if (status === 404) {
        setError(`Não foi possível encontrar a API de login (${apiBase}/auth/login). Verifique se o backend está publicado e se VITE_API_BASE_URL está configurada corretamente.`);
      } else {
        const errorMessage = err.response?.data?.error || err.message || "Erro ao fazer login. Verifique suas credenciais.";
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-main flex items-center justify-center p-6 md:p-12 transition-colors duration-200 overflow-hidden text-text-primary">
      {/* Decorative Elements */}
      <div className="absolute -bottom-24 -left-24 size-96 bg-brand-orange/10 rounded-full blur-3xl" />
      <div className="absolute -top-24 -right-24 size-96 bg-brand-purple/10 rounded-full blur-3xl" />

      <div className="w-full max-w-md relative z-10">
        <div className="flex flex-col items-center mb-8">
          <Logo className="w-full max-w-[420px] h-auto mb-4" variant="login" />
        </div>

        <div className="mb-10 text-center">
          <h3 className="text-2xl font-black text-text-primary mb-1 tracking-tight uppercase italic">Acesso ao Portal</h3>
          <p className="text-text-secondary font-bold text-[10px] uppercase tracking-[0.2em] opacity-60">Gerencie sua operação estratégica</p>
        </div>

        {error && (
          <div className="mb-8 p-5 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-2xl text-sm font-bold flex items-center gap-4 animate-in fade-in slide-in-from-top-2">
            <div className="size-2.5 rounded-full bg-red-500 animate-pulse shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-3">
            <label className="text-[11px] font-black uppercase text-text-secondary tracking-widest ml-1" htmlFor="email">
              E-mail de Acesso
            </label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary size-5 group-focus-within:text-brand-orange transition-colors" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-main w-full pl-12 py-5 font-semibold text-lg"
                placeholder="seu@email.com"
                required
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between ml-1">
              <label className="text-[11px] font-black uppercase text-text-secondary tracking-widest" htmlFor="password">
                Senha
              </label>
              <button type="button" className="text-[11px] font-black uppercase text-brand-orange hover:underline tracking-wider">Esqueci a senha</button>
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary size-5 group-focus-within:text-brand-orange transition-colors" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="input-main w-full pl-12 pr-14 py-5 font-semibold text-lg"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
              >
                {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
              </button>
            </div>
          </div>

          <div className="flex items-center">
            <div className="relative flex items-center">
              <input
                id="remember"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-5 h-5 rounded-lg border-border-main bg-surface-subtle text-brand-orange focus:ring-brand-orange cursor-pointer transition-all"
              />
            </div>
            <label className="ml-3 text-xs font-bold uppercase text-text-secondary tracking-widest cursor-pointer select-none" htmlFor="remember">
              Manter conectado
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-5 text-lg uppercase tracking-widest flex items-center justify-center gap-4"
          >
            <span>{loading ? "Autenticando..." : "Entrar no Portal"}</span>
            {!loading && <LogIn size={22} />}
          </button>
        </form>

        <div className="mt-16 flex items-center justify-between pt-8 border-t border-border-main">
          <button 
            onClick={toggleDarkMode}
            className="flex items-center gap-3 text-sm font-bold text-text-secondary hover:text-brand-orange transition-colors group"
          >
            <div className="size-10 rounded-xl bg-surface-subtle flex items-center justify-center border border-border-main group-hover:border-brand-orange transition-colors">
              <Sun className="hidden dark:block size-5" />
              <Moon className="block dark:hidden size-5" />
            </div>
            Alternar Tema
          </button>
          
          <div className="flex items-center gap-2 text-xs font-bold text-text-secondary/50 uppercase tracking-widest">
            <ShieldCheck size={14} />
            Acesso Seguro
          </div>
        </div>
      </div>
    </div>
  );
}
