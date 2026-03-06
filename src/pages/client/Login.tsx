import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn, Eye, EyeOff, ShoppingCart, Sun, Moon } from "lucide-react";
import api from "../../services/api";
import { useTheme } from "../../components/ThemeProvider";

export default function ClientLogin({ onLogin }: { onLogin: (user: any) => void }) {
  const [email, setEmail] = useState("cliente@test.com");
  const [senha, setSenha] = useState("123456");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { config, toggleDarkMode } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await api.post("/auth/login", { email, senha });
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
    <div className="min-h-screen bg-slate-50 dark:bg-[#101622] flex flex-col transition-colors duration-200">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 md:px-10 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center size-10 bg-accent rounded-lg text-primary">
            <ShoppingCart className="size-6 font-bold" />
          </div>
          <h2 className="text-primary dark:text-white text-xl font-bold tracking-tight uppercase italic">
            OperFlow
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleDarkMode}
            className="flex items-center justify-center size-10 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <Sun className="hidden dark:block size-5" />
            <Moon className="block dark:hidden size-5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6 bg-slate-50 dark:bg-[#101622]/50">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          {/* Login Header Image */}
          <div className="h-32 bg-[#1E293B] relative overflow-hidden">
            <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=800&auto=format&fit=crop')] bg-cover bg-center" />
            <div className="absolute inset-0 flex items-center justify-center">
              <ShoppingCart className="text-accent size-12 opacity-80" />
            </div>
          </div>

          <div className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">OperFlow</h1>
              <p className="text-slate-500 dark:text-slate-400 mt-2">Acesse sua conta para gerenciar suas operações</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium border border-red-100 dark:border-red-900/30">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="email">
                  E-mail
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-5" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary transition-all placeholder:text-slate-400"
                    placeholder="cliente@test.com"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="password">
                    Senha
                  </label>
                  <a className="text-xs font-medium text-primary hover:underline" href="#">Esqueceu a senha?</a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-5" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary transition-all placeholder:text-slate-400"
                    placeholder="Sua senha secreta"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
                />
                <label className="ml-2 text-sm text-slate-600 dark:text-slate-400" htmlFor="remember">Manter conectado</label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1E293B] hover:bg-[#334155] text-white font-bold py-3.5 px-4 rounded-lg transition-colors shadow-lg shadow-slate-900/20 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>{loading ? "Entrando..." : "Login"}</span>
                <LogIn size={20} />
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Ainda não tem acesso? <a className="text-primary font-bold hover:underline" href="#">Solicite uma demonstração</a>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-slate-400 dark:text-slate-600 text-xs">
        <p>© 2024 {config?.nome_sistema || "e-com e vc"} - Gestão Inteligente de Marketplaces. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
