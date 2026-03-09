import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn, Eye, EyeOff, ShoppingCart, Sun, Moon } from "lucide-react";
import api from "../../services/api";
import { useTheme } from "../../components/ThemeProvider";
import { Logo } from "../../components/ui/Logo";

export default function ClientLogin({ onLogin }: { onLogin: (user: any) => void }) {
  const [email, setEmail] = useState(() => localStorage.getItem("remembered_email_client") || "");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { config, toggleDarkMode } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await api.post("/auth/login", { email, senha });
      
      if (rememberMe) {
        localStorage.setItem("remembered_email_client", email);
      } else {
        localStorage.removeItem("remembered_email_client");
      }

      localStorage.setItem("token", response.data.token);
      onLogin(response.data.user);
      if (response.data.user.type === 'admin') {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-main flex flex-col transition-colors duration-200 text-text-primary">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 md:px-10 border-b border-border-main bg-bg-card">
        <div className="flex items-center gap-2">
          <Logo className="size-10" />
          <h2 className="text-text-primary text-xl font-bold tracking-tight uppercase italic">
            OperFlow
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleDarkMode}
            className="flex items-center justify-center size-10 rounded-lg bg-white/5 text-text-secondary hover:bg-white/10 transition-colors border border-border-main"
          >
            <Sun className="hidden dark:block size-5" />
            <Moon className="block dark:hidden size-5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6 bg-bg-main/50">
        <div className="w-full max-w-md bg-bg-card rounded-xl shadow-2xl border border-border-main overflow-hidden">
          {/* Login Header Image */}
          <div className="h-32 bg-bg-main relative overflow-hidden">
            <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=800&auto=format&fit=crop')] bg-cover bg-center" />
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-transparent to-bg-card/80">
              <Logo className="size-16" />
            </div>
          </div>

          <div className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-text-primary">OperFlow</h1>
              <p className="text-text-secondary mt-2">Acesse sua conta para gerenciar suas operações</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 text-red-500 rounded-lg text-sm font-medium border border-red-500/20">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-text-secondary mb-1.5" htmlFor="email">
                  E-mail
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary size-5" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-bg-card border border-border-main rounded-lg text-text-primary focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all placeholder:text-text-secondary/50"
                    placeholder="cliente@test.com"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-semibold text-text-secondary" htmlFor="password">
                    Senha
                  </label>
                  <a className="text-xs font-medium text-brand-orange hover:underline" href="#">Esqueceu a senha?</a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary size-5" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 bg-bg-card border border-border-main rounded-lg text-text-primary focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all placeholder:text-text-secondary/50"
                    placeholder="Sua senha secreta"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-white"
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
                <label className="ml-2 text-sm text-text-secondary cursor-pointer" htmlFor="remember">Manter conectado</label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-brand-orange to-brand-purple hover:from-brand-orange-light hover:to-brand-purple-light text-white font-bold py-3.5 px-4 rounded-lg transition-all shadow-lg shadow-brand-orange/20 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>{loading ? "Entrando..." : "Login"}</span>
                <LogIn size={20} />
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-border-main text-center space-y-4">
              <p className="text-sm text-text-secondary">
                Ainda não tem acesso? <a className="text-brand-orange font-bold hover:underline" href="#">Solicite uma demonstração</a>
              </p>
              <button 
                onClick={() => navigate("/admin/login")}
                className="text-xs font-bold text-text-secondary hover:text-brand-orange transition-colors uppercase tracking-widest"
              >
                Acesso Consultor / Admin
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-text-secondary text-xs">
        <p>© 2024 {config?.nome_sistema || "e-com e vc"} - Gestão Inteligente de Marketplaces. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
