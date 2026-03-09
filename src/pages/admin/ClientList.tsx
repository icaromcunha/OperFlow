import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useClients } from "../../hooks/useClients";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { 
  Search, 
  UserPlus, 
  MoreVertical, 
  ExternalLink, 
  Clock,
  LayoutGrid
} from "lucide-react";

export default function ClientList() {
  const { clients, loading, refresh: refreshClients } = useClients();
  const [filter, setFilter] = useState("");
  const navigate = useNavigate();

  const handleAddClient = async () => {
    const nome = prompt("Nome do cliente:");
    if (!nome) return;
    const email = prompt("E-mail do cliente:");
    if (!email) return;
    
    try {
      await api.post("/clients", { nome, email, status: 'ativo' });
      await refreshClients();
      alert("Cliente adicionado com sucesso!");
    } catch (err) {
      console.error(err);
      alert("Erro ao adicionar cliente.");
    }
  };

  const filteredClients = clients.filter(c => 
    c.nome.toLowerCase().includes(filter.toLowerCase()) ||
    c.email.toLowerCase().includes(filter.toLowerCase())
  );

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-black text-text-primary tracking-tight">Gestão de Clientes</h1>
          <p className="text-text-secondary font-medium italic">Monitore e gerencie as contas dos parceiros de marketplace</p>
        </div>
        <button 
          onClick={handleAddClient}
          className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-primary/20"
        >
          <UserPlus size={20} /> Adicionar Novo Cliente
        </button>
      </div>

      <div className="bg-bg-card rounded-2xl border border-border-main shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border-main bg-white/5 flex items-center justify-between">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary size-5" />
            <input
              type="text"
              placeholder="Buscar por nome, e-mail ou ID..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-bg-card border border-border-main rounded-xl text-sm focus:ring-2 focus:ring-primary/50 text-text-primary"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2.5 bg-white/5 text-text-secondary rounded-xl hover:bg-white/10 transition-colors">
              <LayoutGrid size={20} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 text-text-secondary text-[10px] font-black uppercase tracking-widest">
                <th className="px-6 py-4">Nome do Cliente</th>
                <th className="px-6 py-4">Canais Ativos</th>
                <th className="px-6 py-4">Protocolos Abertos</th>
                <th className="px-6 py-4">Média SLA</th>
                <th className="px-6 py-4">Saúde da Conta</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-main">
              {filteredClients.map((c) => (
                <tr 
                  key={c.id} 
                  className="hover:bg-white/5 transition-colors cursor-pointer group"
                  onClick={() => navigate(`/admin/clients/${c.id}`)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {c.nome.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-text-primary group-hover:text-primary transition-colors">{c.nome}</span>
                        <span className="text-[10px] text-text-secondary font-black">ID: #CLT-{c.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex -space-x-2">
                      <div className="size-7 rounded-full bg-blue-500 border-2 border-bg-card flex items-center justify-center text-[8px] font-bold text-white" title="Mercado Livre">ML</div>
                      <div className="size-7 rounded-full bg-orange-500 border-2 border-bg-card flex items-center justify-center text-[8px] font-bold text-white" title="Amazon">AMZ</div>
                      <div className="size-7 rounded-full bg-red-500 border-2 border-bg-card flex items-center justify-center text-[8px] font-bold text-white" title="Shopee">SHP</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-text-primary">{c.protocolos_ativos || 0}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-text-secondary" />
                      <span className="text-sm font-medium text-text-secondary">94%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={c.status} type="client" />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 hover:bg-white/5 rounded-lg transition-colors text-text-secondary hover:text-primary">
                        <ExternalLink size={18} />
                      </button>
                      <button className="p-2 hover:bg-white/5 rounded-lg transition-colors text-text-secondary hover:text-primary">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
