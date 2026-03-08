interface StatusBadgeProps {
  status: string;
  type?: 'protocol' | 'client';
}

export function StatusBadge({ status, type = 'protocol' }: StatusBadgeProps) {
  const getStyles = () => {
    const s = status.toLowerCase();
    
    if (type === 'protocol') {
      if (s === 'aberto') return 'bg-blue-100 text-blue-700';
      if (s === 'em atendimento') return 'bg-amber-100 text-amber-700';
      if (s === 'concluido') return 'bg-green-100 text-green-700';
    }
    
    if (type === 'client') {
      if (s === 'ativo') return 'bg-green-100 text-green-700';
      if (s === 'inativo') return 'bg-red-100 text-red-700';
      if (s === 'pendente') return 'bg-amber-100 text-amber-700';
    }
    
    return 'bg-slate-100 text-slate-700';
  };

  return (
    <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${getStyles()}`}>
      {status}
    </span>
  );
}
