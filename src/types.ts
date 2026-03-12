export enum UserType {
  ADMIN = 'admin',
  CLIENT = 'client',
  CONSULTANT = 'consultor'
}

export interface User {
  id: number;
  empresa_id: number;
  nome: string;
  email: string;
  perfil: string;
  type: 'admin' | 'client';
  avatar?: string;
  status?: string;
}

export interface Client {
  id: number;
  empresa_id: number;
  consultor_id?: number;
  nome: string;
  email: string;
  telefone?: string;
  whatsapp_numero?: string;
  whatsapp_notificacoes_ativas?: number;
  status: string;
  notas?: string;
  protocolos_ativos?: number;
}

export interface Protocol {
  id: number;
  empresa_id: number;
  cliente_id: number;
  titulo: string;
  descricao: string;
  status: 'aberto' | 'em atendimento' | 'concluido';
  categoria_id?: number;
  prioridade_id?: number;
  responsavel_id?: number;
  data_criacao: string;
  cliente_nome?: string;
  categoria_nome?: string;
  prioridade_nome?: string;
  responsavel_nome?: string;
  consultor_nome?: string;
}

export interface Interaction {
  id: number;
  protocolo_id: number;
  autor_id: number;
  autor_tipo: 'admin' | 'cliente';
  mensagem: string;
  visivel_cliente: number;
  data_envio: string;
  autor_nome?: string;
}

export interface Marketplace {
  id: number;
  cliente_id: number;
  nome: string;
  status: 'ativo' | 'inativo';
  data_conexao: string;
  vendas_mes?: number;
}

export interface Insight {
  id: number;
  cliente_id: number;
  consultor_id: number;
  texto: string;
  data_criacao: string;
  visivel_cliente: boolean;
}

export interface EvolutionHistory {
  id: number;
  cliente_id: number;
  consultor_id: number;
  titulo: string;
  descricao: string;
  data: string;
  visivel_cliente: boolean;
}

export interface DashboardStats {
  total: number;
  abertos: number;
  em_atendimento: number;
  concluidos: number;
}
