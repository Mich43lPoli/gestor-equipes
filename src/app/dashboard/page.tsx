'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Building2, Users, Briefcase, DollarSign, Package, LogOut, Plus, Menu, ChevronRight, Phone, FileText } from 'lucide-react'
import { toast } from 'sonner'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { supabase, type Funcionario, type SolicitacaoMaterial } from '@/lib/supabase'

export default function DashboardPage() {
  const router = useRouter()
  const { usuarioDono, logout, isAuthenticated, tipoUsuario } = useAuth()
  const [activeTab, setActiveTab] = useState('visao-geral')
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([])
  const [solicitacoes, setSolicitacoes] = useState<SolicitacaoMaterial[]>([])
  const [loading, setLoading] = useState(true)

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
  }, [isAuthenticated, tipoUsuario, router, mounted])

  const carregarDados = async () => {
    try {
      setLoading(true)

      // Carregar funcionários
      const { data: funcData, error: funcError } = await supabase
        .from('funcionarios')
        .select('*')
        .eq('dono_id', usuarioDono?.id || '')
        .order('created_at', { ascending: false })

      if (funcError) throw funcError
      setFuncionarios(funcData || [])

      // Carregar solicitações de materiais
      const { data: solData, error: solError } = await supabase
        .from('solicitacoes_materiais')
        .select(`
          *,
          funcionario:funcionarios(*)
        `)
        .in('funcionario_id', (funcData || []).map(f => f.id))
        .order('created_at', { ascending: false })

      if (solError) throw solError
      setSolicitacoes(solData || [])

    } catch (error: any) {
      console.error('Erro ao carregar dados:', error)
      // Não mostrar erro se for problema de configuração do Supabase
      if (!error.message?.includes('project reference')) {
        toast.error('Erro ao carregar dados')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    toast.success('Logout realizado com sucesso')
    router.push('/')
  }

  const handleNovoFuncionario = () => {
    router.push('/cadastrar-funcionario')
  }

  const handleNovoProjeto = () => {
    router.push('/criar-projeto')
  }

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    setMobileMenuOpen(false)
  }

  const handleVerFuncionario = (funcionarioId: string) => {
    router.push(`/funcionario/${funcionarioId}`)
  }

  const calcularTotalMateriais = () => {
    return solicitacoes.reduce((acc, sol) => acc + sol.valor_total, 0)
  }

  const menuItems = [
    { id: 'visao-geral', label: 'Visão Geral', icon: Building2 },
    { id: 'funcionarios', label: 'Funcionários', icon: Users },
    { id: 'projetos', label: 'Projetos', icon: Briefcase },
    { id: 'pagamentos', label: 'Pagamentos', icon: DollarSign },
    { id: 'materiais', label: 'Materiais', icon: Package }
  ]

  if (!mounted || !usuarioDono) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <Building2 className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Building2 className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">GestorFlex</h1>
                <p className="text-xs sm:text-sm text-gray-500">Olá, {usuarioDono.nome}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Menu Mobile */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="md:hidden">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64">
                  <div className="flex flex-col gap-2 mt-8">
                    {menuItems.map((item) => {
                      const Icon = item.icon
                      return (
                        <Button
                          key={item.id}
                          variant={activeTab === item.id ? 'default' : 'ghost'}
                          className="w-full justify-start gap-3"
                          onClick={() => handleTabChange(item.id)}
                        >
                          <Icon className="w-5 h-5" />
                          {item.label}
                        </Button>
                      )
                    })}
                  </div>
                </SheetContent>
              </Sheet>

              <Button
                variant="outline"
                onClick={handleLogout}
                className="gap-2"
                size="sm"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sair</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 sm:py-8">
        {/* Cards de Resumo */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <Card>
            <CardHeader className="pb-2 sm:pb-3">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-500">
                Funcionários
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                <span className="text-2xl sm:text-3xl font-bold">{funcionarios.length}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2 sm:pb-3">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-500">
                Projetos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-600" />
                <span className="text-2xl sm:text-3xl font-bold">0</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2 sm:pb-3">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-500">
                Pagamentos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                <span className="text-xl sm:text-2xl font-bold">R$ 0</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2 sm:pb-3">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-500">
                Materiais
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                <span className="text-2xl sm:text-3xl font-bold">{solicitacoes.length}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navegação Desktop - Tabs Horizontais */}
        <div className="hidden md:flex gap-2 mb-6 overflow-x-auto pb-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Button
                key={item.id}
                variant={activeTab === item.id ? 'default' : 'outline'}
                onClick={() => setActiveTab(item.id)}
                className="gap-2 whitespace-nowrap"
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Button>
            )
          })}
        </div>

        {/* Conteúdo das Tabs */}
        <div className="space-y-6">
          {/* Tab Visão Geral */}
          {activeTab === 'visao-geral' && (
            <Card>
              <CardHeader>
                <CardTitle>Bem-vindo ao GestorFlex!</CardTitle>
                <CardDescription>
                  Comece cadastrando seus funcionários e projetos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button
                    className="h-20 sm:h-24 flex flex-col gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                    onClick={() => setActiveTab('funcionarios')}
                  >
                    <Users className="w-6 h-6 sm:w-8 sm:h-8" />
                    <span className="text-sm sm:text-base">Cadastrar Funcionário</span>
                  </Button>
                  <Button
                    className="h-20 sm:h-24 flex flex-col gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
                    onClick={() => setActiveTab('projetos')}
                  >
                    <Briefcase className="w-6 h-6 sm:w-8 sm:h-8" />
                    <span className="text-sm sm:text-base">Criar Projeto</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tab Funcionários */}
          {activeTab === 'funcionarios' && (
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle>Funcionários</CardTitle>
                    <CardDescription>
                      Gerencie sua equipe de funcionários e técnicos
                    </CardDescription>
                  </div>
                  <Button 
                    className="gap-2 w-full sm:w-auto"
                    onClick={handleNovoFuncionario}
                  >
                    <Plus className="w-4 h-4" />
                    Novo Funcionário
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-12 text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-4 opacity-50 animate-pulse" />
                    <p>Carregando funcionários...</p>
                  </div>
                ) : funcionarios.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhum funcionário cadastrado ainda</p>
                    <p className="text-sm mt-2">Clique em "Novo Funcionário" para começar</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {funcionarios.map((funcionario) => (
                      <Card 
                        key={funcionario.id}
                        className="hover:shadow-lg transition-shadow cursor-pointer"
                        onClick={() => handleVerFuncionario(funcionario.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 flex-1">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg">
                                {funcionario.nome.charAt(0).toUpperCase()}
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-gray-900">{funcionario.nome}</h3>
                                <div className="flex flex-wrap gap-3 mt-1">
                                  <span className="text-sm text-gray-500 flex items-center gap-1">
                                    <FileText className="w-3 h-3" />
                                    PIN: {funcionario.pin}
                                  </span>
                                  {funcionario.telefone && (
                                    <span className="text-sm text-gray-500 flex items-center gap-1">
                                      <Phone className="w-3 h-3" />
                                      {funcionario.telefone}
                                    </span>
                                  )}
                                  <span className={`text-xs px-2 py-1 rounded-full ${
                                    funcionario.status === 'ativo' 
                                      ? 'bg-green-100 text-green-700' 
                                      : 'bg-red-100 text-red-700'
                                  }`}>
                                    {funcionario.status === 'ativo' ? 'Ativo' : 'Inativo'}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Tab Projetos */}
          {activeTab === 'projetos' && (
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle>Projetos</CardTitle>
                    <CardDescription>
                      Organize o trabalho por projetos, obras ou contratos
                    </CardDescription>
                  </div>
                  <Button 
                    className="gap-2 w-full sm:w-auto"
                    onClick={handleNovoProjeto}
                  >
                    <Plus className="w-4 h-4" />
                    Novo Projeto
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-500">
                  <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhum projeto criado ainda</p>
                  <p className="text-sm mt-2">Clique em "Novo Projeto" para começar</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tab Pagamentos */}
          {activeTab === 'pagamentos' && (
            <Card>
              <CardHeader>
                <CardTitle>Pagamentos</CardTitle>
                <CardDescription>
                  Controle de pagamentos realizados e pendentes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-500">
                  <DollarSign className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhum pagamento registrado ainda</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tab Materiais */}
          {activeTab === 'materiais' && (
            <Card>
              <CardHeader>
                <CardTitle>Materiais Solicitados</CardTitle>
                <CardDescription>
                  Gerencie solicitações de materiais dos funcionários
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-12 text-gray-500">
                    <Package className="w-12 h-12 mx-auto mb-4 opacity-50 animate-pulse" />
                    <p>Carregando solicitações...</p>
                  </div>
                ) : solicitacoes.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhuma solicitação de material ainda</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {solicitacoes.map((solicitacao) => (
                      <Card 
                        key={solicitacao.id}
                        className="border-l-4 border-l-orange-500 hover:shadow-lg transition-shadow cursor-pointer"
                        onClick={() => handleVerFuncionario(solicitacao.funcionario_id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center justify-between">
                                <h4 className="font-semibold text-gray-900">{solicitacao.nome_material}</h4>
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  solicitacao.status === 'pendente' ? 'bg-yellow-100 text-yellow-700' :
                                  solicitacao.status === 'aprovado' ? 'bg-green-100 text-green-700' :
                                  'bg-red-100 text-red-700'
                                }`}>
                                  {solicitacao.status === 'pendente' ? 'Pendente' :
                                   solicitacao.status === 'aprovado' ? 'Aprovado' : 'Recusado'}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600">
                                Solicitado por: <span className="font-medium">{solicitacao.funcionario?.nome}</span>
                              </p>
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                  <span className="text-gray-500">Quantidade:</span>
                                  <span className="ml-2 font-medium">{solicitacao.quantidade}</span>
                                </div>
                                <div>
                                  <span className="text-gray-500">Valor Total:</span>
                                  <span className="ml-2 font-bold text-blue-600">
                                    R$ {solicitacao.valor_total.toFixed(2)}
                                  </span>
                                </div>
                              </div>
                              <p className="text-xs text-gray-400">
                                {new Date(solicitacao.created_at).toLocaleDateString('pt-BR', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    {/* Total Geral */}
                    <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-6 h-6 text-blue-600" />
                            <span className="text-lg font-semibold text-gray-900">
                              Total de Materiais:
                            </span>
                          </div>
                          <span className="text-2xl font-bold text-blue-600">
                            R$ {calcularTotalMateriais().toFixed(2)}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
