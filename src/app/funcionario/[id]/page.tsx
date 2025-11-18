'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, User, Phone, FileText, Calendar, Package, DollarSign, CheckCircle, XCircle, Clock } from 'lucide-react'
import { toast } from 'sonner'
import { supabase, type Funcionario, type SolicitacaoMaterial } from '@/lib/supabase'

export default function FuncionarioDetalhesPage() {
  const router = useRouter()
  const params = useParams()
  const { isAuthenticated, tipoUsuario } = useAuth()
  const [funcionario, setFuncionario] = useState<Funcionario | null>(null)
  const [solicitacoes, setSolicitacoes] = useState<SolicitacaoMaterial[]>([])
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    if (!isAuthenticated || tipoUsuario !== 'dono') {
      router.push('/login-dono')
      return
    }

    carregarDados()
  }, [isAuthenticated, tipoUsuario, router, mounted, params.id])

  const carregarDados = async () => {
    try {
      setLoading(true)

      // Carregar dados do funcionário
      const { data: funcData, error: funcError } = await supabase
        .from('funcionarios')
        .select('*')
        .eq('id', params.id)
        .single()

      if (funcError) throw funcError
      setFuncionario(funcData)

      // Carregar solicitações de materiais
      const { data: solData, error: solError } = await supabase
        .from('solicitacoes_materiais')
        .select('*')
        .eq('funcionario_id', params.id)
        .order('created_at', { ascending: false })

      if (solError) throw solError
      setSolicitacoes(solData || [])

    } catch (error: any) {
      console.error('Erro ao carregar dados:', error)
      toast.error('Erro ao carregar dados do funcionário')
    } finally {
      setLoading(false)
    }
  }

  const handleAtualizarStatus = async (solicitacaoId: string, novoStatus: 'aprovado' | 'recusado') => {
    try {
      const { error } = await supabase
        .from('solicitacoes_materiais')
        .update({ 
          status: novoStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', solicitacaoId)

      if (error) throw error

      toast.success(`Solicitação ${novoStatus === 'aprovado' ? 'aprovada' : 'recusada'} com sucesso!`)
      carregarDados()
    } catch (error: any) {
      console.error('Erro ao atualizar status:', error)
      toast.error('Erro ao atualizar status da solicitação')
    }
  }

  const calcularTotal = () => {
    return solicitacoes.reduce((acc, sol) => acc + sol.valor_total, 0)
  }

  const calcularTotalPorStatus = (status: string) => {
    return solicitacoes
      .filter(sol => sol.status === status)
      .reduce((acc, sol) => acc + sol.valor_total, 0)
  }

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <User className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!funcionario) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Funcionário não encontrado</p>
          <Button onClick={() => router.push('/dashboard')} className="mt-4">
            Voltar ao Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push('/dashboard')}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Detalhes do Funcionário
              </h1>
              <p className="text-xs sm:text-sm text-gray-500">{funcionario.nome}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 sm:py-8">
        {/* Informações do Funcionário */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Informações do Funcionário
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500">Nome Completo</label>
                  <p className="text-lg font-semibold">{funcionario.nome}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">PIN de Acesso</label>
                  <p className="text-2xl font-bold text-blue-600">{funcionario.pin}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Status</label>
                  <p className={`text-lg font-semibold ${
                    funcionario.status === 'ativo' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {funcionario.status === 'ativo' ? 'Ativo' : 'Inativo'}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                {funcionario.telefone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <div>
                      <label className="text-sm text-gray-500">Telefone</label>
                      <p className="font-medium">{funcionario.telefone}</p>
                    </div>
                  </div>
                )}
                {funcionario.documento && (
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <div>
                      <label className="text-sm text-gray-500">Documento</label>
                      <p className="font-medium">{funcionario.documento}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <div>
                    <label className="text-sm text-gray-500">Cadastrado em</label>
                    <p className="font-medium">
                      {new Date(funcionario.created_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resumo de Solicitações */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2 sm:pb-3">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-500">
                Total Solicitações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                <span className="text-2xl sm:text-3xl font-bold">{solicitacoes.length}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2 sm:pb-3">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-500">
                Pendentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
                <span className="text-2xl sm:text-3xl font-bold">
                  {solicitacoes.filter(s => s.status === 'pendente').length}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2 sm:pb-3">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-500">
                Aprovadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                <span className="text-2xl sm:text-3xl font-bold">
                  {solicitacoes.filter(s => s.status === 'aprovado').length}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2 sm:pb-3">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-500">
                Valor Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                <span className="text-xl sm:text-2xl font-bold">
                  R$ {calcularTotal().toFixed(2)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Solicitações */}
        <Card>
          <CardHeader>
            <CardTitle>Solicitações de Materiais</CardTitle>
            <CardDescription>
              Histórico completo de solicitações deste funcionário
            </CardDescription>
          </CardHeader>
          <CardContent>
            {solicitacoes.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma solicitação de material ainda</p>
              </div>
            ) : (
              <div className="space-y-4">
                {solicitacoes.map((solicitacao) => (
                  <Card key={solicitacao.id} className={`border-l-4 ${
                    solicitacao.status === 'pendente' ? 'border-l-yellow-500' :
                    solicitacao.status === 'aprovado' ? 'border-l-green-500' :
                    'border-l-red-500'
                  }`}>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 text-lg">
                              {solicitacao.nome_material}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {new Date(solicitacao.created_at).toLocaleDateString('pt-BR', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                          <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                            solicitacao.status === 'pendente' ? 'bg-yellow-100 text-yellow-700' :
                            solicitacao.status === 'aprovado' ? 'bg-green-100 text-green-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {solicitacao.status === 'pendente' ? 'Pendente' :
                             solicitacao.status === 'aprovado' ? 'Aprovado' : 'Recusado'}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Quantidade:</span>
                            <span className="ml-2 font-medium">{solicitacao.quantidade}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Valor Unit.:</span>
                            <span className="ml-2 font-medium">
                              R$ {solicitacao.valor_unitario.toFixed(2)}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">Valor Total:</span>
                            <span className="ml-2 font-bold text-blue-600">
                              R$ {solicitacao.valor_total.toFixed(2)}
                            </span>
                          </div>
                        </div>

                        {solicitacao.observacao && (
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Observação:</span> {solicitacao.observacao}
                            </p>
                          </div>
                        )}

                        {solicitacao.status === 'pendente' && (
                          <div className="flex gap-2 pt-2">
                            <Button
                              size="sm"
                              className="flex-1 bg-green-600 hover:bg-green-700"
                              onClick={() => handleAtualizarStatus(solicitacao.id, 'aprovado')}
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Aprovar
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="flex-1"
                              onClick={() => handleAtualizarStatus(solicitacao.id, 'recusado')}
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Recusar
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Resumo Financeiro */}
                <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200">
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Total Pendente:</span>
                        <span className="text-lg font-bold text-yellow-600">
                          R$ {calcularTotalPorStatus('pendente').toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Total Aprovado:</span>
                        <span className="text-lg font-bold text-green-600">
                          R$ {calcularTotalPorStatus('aprovado').toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-blue-300">
                        <span className="text-base font-semibold text-gray-900">Total Geral:</span>
                        <span className="text-2xl font-bold text-blue-600">
                          R$ {calcularTotal().toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
