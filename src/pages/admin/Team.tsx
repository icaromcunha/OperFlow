import { useState, useEffect } from "react";
import { 
  Users, 
  UserPlus, 
  Search, 
  MoreVertical, 
  Mail, 
  Shield, 
  Activity,
  CheckCircle2,
  Clock
} from "lucide-react";
import api from "../../services/api";

const teamMembers = [
  { id: 1, name: "Ana Silva", email: "ana.silva@operflow.com", role: "Consultor Sênior", status: "online", protocols: 42, performance: "98%" },
  { id: 2, name: "Carlos Souza", email: "carlos.souza@operflow.com", role: "Consultor Pleno", status: "away", protocols: 28, performance: "92%" },
  { id: 3, name: "Mariana Costa", email: "mariana.costa@operflow.com", role: "Consultor Júnior", status: "online", protocols: 35, performance: "95%" },
  { id: 4, name: "Ricardo Oliveira", email: "ricardo.o@operflow.com", role: "Analista", status: "offline", protocols: 15, performance: "88%" },
];

export default function AdminTeam() {
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  const fetchTeam = async () => {
    try {
      const response = await api.get("/users");
      setTeamMembers(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const filteredMembers = teamMembers.filter(member => 
    member.nome.toLowerCase().includes(filter.toLowerCase()) ||
    member.email.toLowerCase().includes(filter.toLowerCase())
  );

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );

  const handleAddMember = async () => {
    const nome = prompt("Nome do consultor:");
    if (!nome) return;
    const email = prompt("E-mail do consultor:");
    if (!email) return;
    const senha = prompt("Senha inicial (padrão 123456):") || "123456";

    try {
      await api.post("/users", { nome, email, senha, perfil: 'consultor' });
      await fetchTeam();
      alert("Consultor adicionado com sucesso!");
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.error || "Erro ao adicionar consultor.");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <Users className="text-primary" />
            Gestão de Equipe
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium italic">Gerencie consultores, permissões e acompanhe a produtividade</p>
        </div>
        <button 
          onClick={handleAddMember}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
        >
          <UserPlus size={18} />
          Convidar Membro
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex gap-4 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 size-5" />
          <input 
            type="text"
            placeholder="Buscar por nome, e-mail ou cargo..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full pl-12 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary transition-all"
          />
        </div>
        <select className="bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-400 focus:ring-2 focus:ring-primary">
          <option>Todos os Cargos</option>
          <option>Consultor Sênior</option>
          <option>Consultor Pleno</option>
          <option>Analista</option>
        </select>
      </div>

      {/* Team Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member) => (
          <div key={member.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden hover:border-primary transition-all group">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="relative">
                  <div className="size-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-2xl font-black text-slate-400">
                    {member.nome.substring(0, 2).toUpperCase()}
                  </div>
                  <span className={`absolute -bottom-1 -right-1 size-4 rounded-full border-4 border-white dark:border-slate-900 ${
                    member.status === 'online' ? 'bg-green-500' : 
                    member.status === 'away' ? 'bg-amber-500' : 'bg-slate-400'
                  }`}></span>
                </div>
                <button className="p-2 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">
                  <MoreVertical size={20} />
                </button>
              </div>

              <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{member.nome}</h3>
              <div className="flex items-center gap-2 text-slate-500 text-sm mt-1">
                <Shield size={14} className="text-primary" />
                {member.perfil}
              </div>
              <div className="flex items-center gap-2 text-slate-400 text-xs mt-1">
                <Mail size={14} />
                {member.email}
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Protocolos</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Activity size={16} className="text-primary" />
                    {member.protocols || 0}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Performance</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-green-500" />
                    {member.performance || "100%"}
                  </p>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                <Clock size={12} />
                Ativo
              </span>
              <button className="text-xs font-bold text-primary hover:underline">Ver Perfil</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
