import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos do banco de dados
export interface Funcionario {
  id: string
  nome: string
  pin: string
  telefone?: string
  documento?: string
  status: 'ativo' | 'inativo'
  dono_id: string
  created_at: string
  updated_at: string
}

export interface SolicitacaoMaterial {
  id: string
  funcionario_id: string
  nome_material: string
  quantidade: number
  valor_unitario: number
  valor_total: number
  observacao?: string
  status: 'pendente' | 'aprovado' | 'recusado'
  created_at: string
  updated_at: string
  funcionario?: Funcionario
}
