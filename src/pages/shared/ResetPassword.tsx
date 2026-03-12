import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { KeyRound, Eye, EyeOff } from "lucide-react";
import { supabase, isSupabaseEnabled } from "../../services/supabase";
import { Logo } from "../../components/ui/Logo";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password.length < 8) {
      setError("A nova senha deve ter pelo menos 8 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("A confirmação de senha não confere.");
      return;
    }

    if (!isSupabaseEnabled || !supabase) {
      setError("Integração com Supabase não está habilitada.");
      return;
    }

    setLoading(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) {
        setError(updateError.message || "Não foi possível atualizar a senha.");
        return;
      }

      setSuccess("Senha atualizada com sucesso! Você já pode fazer login.");
      setTimeout(() => navigate("/login"), 1200);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[100dvh] bg-bg-main flex items-center justify-center p-4 md:p-8 lg:p-12 overflow-hidden text-text-primary">
      <div className="pointer-events-none absolute -bottom-24 -left-24 size-96 bg-brand-orange/10 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute -top-24 -right-24 size-96 bg-brand-purple/10 rounded-full blur-3xl" />

      <div className="w-full max-w-md relative z-10">
        <div className="flex flex-col items-center mb-4 md:mb-6">
          <Logo className="w-full max-w-[280px] md:max-w-[360px] h-auto mb-2" variant="login" />
        </div>

        <div className="mb-6 md:mb-8 text-center">
          <h3 className="text-xl md:text-2xl font-black tracking-tight uppercase italic">Redefinir Senha</h3>
          <p className="text-text-secondary font-bold text-[10px] uppercase tracking-[0.2em] opacity-60">Defina uma nova senha de acesso</p>
        </div>

        {error && <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 text-red-600 rounded-2xl text-sm font-bold">{error}</div>}
        {success && <div className="mb-4 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-2xl text-sm font-bold">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
          <div className="space-y-3">
            <label className="text-[11px] font-black uppercase text-text-secondary tracking-widest ml-1" htmlFor="new-password">Nova senha</label>
            <div className="relative group">
              <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary size-5" />
              <input
                id="new-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-main w-full pl-12 pr-14 py-4 md:py-5 font-semibold text-base md:text-lg"
                placeholder="••••••••"
                required
              />
              <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary">
                {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[11px] font-black uppercase text-text-secondary tracking-widest ml-1" htmlFor="confirm-password">Confirmar senha</label>
            <input
              id="confirm-password"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input-main w-full py-4 md:py-5 font-semibold text-base md:text-lg"
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-4 md:py-5 text-base md:text-lg uppercase tracking-widest">
            {loading ? "Atualizando..." : "Salvar nova senha"}
          </button>
        </form>
      </div>
    </div>
  );
}
