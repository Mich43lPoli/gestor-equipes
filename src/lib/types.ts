// Tipos do GestorFlex

export type Plano = 'gratuito' | 'premium'
export type StatusFuncionario = 'ativo' | 'inativo'
export type StatusProjeto = 'em_andamento' | 'concluido' | 'pausado'
export type StatusPagamento = 'pago' | 'pendente' | 'parcialmente_pago'
export type StatusMaterial = 'solicitado' | 'aprovado' | 'negado' | 'comprado'
export type TipoPagamento = 'normal' | 'adiantamento'
export type TipoUsuario = 'dono' | 'funcionario'

export interface UsuarioDono {
  id: string
  nome: string
  email: string
  senha: string
  plano: Plano
  data_criacao: string
}

export interface Funcionario {
  id: string
  id_dono: string
  nome: string
  telefone?: string
  documento?: string
  pin: string
  status: StatusFuncionario
  data_cadastro: string
}

export interface Projeto {
  id: string
  id_dono: string
  nome_projeto: string
  descricao?: string
  data_inicio?: string
  data_fim?: string
  status: StatusProjeto
  created_at: string
}

export interface DiaTrabalhado {
  id: string
  id_funcionario: string
  id_projeto?: string
  data_trabalho: string
  horas_trabalhadas?: number
  descricao_trabalho?: string
  valor_diaria?: number
  status_pagamento: StatusPagamento
  created_at: string
}

export interface Pagamento {
  id: string
  id_funcionario: string
  id_projeto?: string
  data_pagamento: string
  valor_pago: number
  descricao?: string
  tipo: TipoPagamento
  created_at: string
}

export interface Material {
  id: string
  id_funcionario: string
  id_projeto?: string
  data_solicitacao: string
  descricao_material: string
  quantidade?: number
  status: StatusMaterial
  observacao_resposta_chefe?: string
  created_at: string
}

export interface Mensagem {
  id: string
  id_funcionario: string
  remetente: 'dono' | 'funcionario'
  mensagem: string
  lida: boolean
  created_at: string
}
