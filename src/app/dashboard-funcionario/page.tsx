'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { User, Calendar, DollarSign, Package, LogOut, Clock, Menu, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { supabase, type SolicitacaoMaterial } from '@/lib/supabase'

export default function DashboardFuncionarioPage() {
  const router = useRouter()
  const { funcionario, logout, isAuthenticated, tipoUsuario } = useAuth()
  const [activeTab, setActiveTab] = useState('visao-geral')
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [materiais, setMateriais] = useState<SolicitacaoMaterial[]>([])
  const [loading, setLoading] = useState(true)
  
  // Form state
  const [nomeMaterial, setNomeMaterial] = useState('')
  const [quantidade, setQuantidade] = useState('')
  const [valorUnitario, setValorUnitario] = useState('')
  const [observacao, setObservacao] = useState('')

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    if (!isAuthenticated || tipoUsuario !== 'funcionario') {
      router.push('/login-funcionario')
      return
    }

    carregarSolicitacoes()
  }, [isAuthenticated, tipoUsuario, router, mounted])

  const carregarSolicitacoes = async () => {
    try {
      setLoading(true)

      const { data, error } = await supabase
        .from('solicitacoes_materiais')
        .select('*')
        .eq('funcionario_id', funcionario?.id || '')
        .order('created_at', { ascending: false })

      if (error) throw error
      setMateriais(data || [])

    } catch (error: any) {
      console.error('Erro ao carregar solicitações:', error)
      // Não mostrar erro se for problema de configuração do Supabase
      if (!error.message?.includes('project reference')) {
        toast.error('Erro ao carregar solicitações')
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

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    setMobileMenuOpen(false)
  }

  const handleSolicitarMaterial = async () => {
    if (!nomeMaterial || !quantidade || !valorUnitario) {
      toast.error('Preencha todos os campos obrigatórios')
      return
    }

    const qtd = parseFloat(quantidade)
    const valor = parseFloat(valorUnitario)
    
    if (qtd <= 0 || valor <= 0) {
      toast.error('Quantidade e valor devem ser maiores que zero')
      return
    }

    try {
      const { error } = await supabase
        .from('solicitacoes_materiais')
        .insert({
          funcionario_id: funcionario?.id,
          nome_material: nomeMaterial,
          quantidade: qtd,
          valor_unitario: valor,
          valor_total: qtd * valor,
          observacao: observacao || null,
          status: 'pendente'
        })

      if (error) throw error

      // Limpar form
      setNomeMaterial('')
      setQuantidade('')
      setValorUnitario('')
      setObservacao('')
      setDialogOpen(false)
      
      toast.success('Solicitação enviada ao gestor com sucesso!')
      carregarSolicitacoes()

    } catch (error: any) {
      console.error('Erro ao criar solicitação:', error)
      toast.error('Erro ao enviar solicitação')
    }
  }

  const handleRemoverMaterial = async (id: string) => {
    try {
      const { error } = await supabase
        .from('solicitacoes_materiais')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast.success('Solicitação removida')
      carregarSolicitacoes()

    } catch (error: any) {
      console.error('Erro ao remover solicitação:', error)
      toast.error('Erro ao remover solicitação')
    }
  }

  const calcularTotal = () => {
    return materiais.reduce((acc, mat) => acc + mat.valor_total, 0)
  }

  const menuItems = [
    { id: 'visao-geral', label: 'Visão Geral', icon: User },
    { id: 'dias-trabalhados', label: 'Dias Trabalhados', icon: Calendar },
    { id: 'pagamentos', label: 'Pagamentos', icon: DollarSign },
    { id: 'solicitar-material', label: 'Solicitar Material', icon: Package }
  ]

  if (!mounted || !funcionario) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <User className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-pulse" />
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
              <User className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Minha Área</h1>
                <p className="text-xs sm:text-sm text-gray-500">Olá, {funcionario.nome}</p>
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
                Dias Trabalhados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                <span className="text-2xl sm:text-3xl font-bold">0</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2 sm:pb-3">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-500">
                Horas Trabalhadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-600" />
                <span className="text-2xl sm:text-3xl font-bold">0h</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2 sm:pb-3">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-500">
                A Receber
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
                <span className="text-2xl sm:text-3xl font-bold">{materiais.length}</span>
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
                <CardTitle>Bem-vindo, {funcionario.nome}!</CardTitle>
                <CardDescription>
                  Aqui você pode acompanhar seus dias trabalhados, pagamentos e solicitar materiais
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">Seu PIN de Acesso</h3>
                  <p className="text-sm text-blue-700 mb-2">
                    Use este PIN para fazer login no aplicativo:
                  </p>
                  <div className="bg-white rounded-lg p-3 text-center">
                    <span className="text-3xl font-bold text-blue-600 tracking-wider">
                      {funcionario.pin}
                    </span>
                  </div>
                  <p className="text-xs text-blue-600 mt-2">
                    Guarde este PIN com segurança. Não compartilhe com outras pessoas.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mt-6">
                  <Card className="bg-gradient-to-br from-blue-50 to-cyan-50">
                    <CardHeader>
                      <CardTitle className="text-lg">Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Status:</span>
                          <span className={`text-sm font-semibold ${
                            funcionario.status === 'ativo' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {funcionario.status === 'ativo' ? 'Ativo' : 'Inativo'}
                          </span>
                        </div>
                        {funcionario.telefone && (
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Telefone:</span>
                            <span className="text-sm font-medium">{funcionario.telefone}</span>
                          </div>
                        )}
                        {funcionario.documento && (
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Documento:</span>
                            <span className="text-sm font-medium">{funcionario.documento}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-cyan-50 to-blue-50">
                    <CardHeader>
                      <CardTitle className="text-lg">Resumo Financeiro</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Total Recebido:</span>
                          <span className="text-sm font-semibold text-green-600">R$ 0,00</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">A Receber:</span>
                          <span className="text-sm font-semibold text-orange-600">R$ 0,00</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t">
                          <span className="text-sm font-semibold text-gray-900">Total:</span>
                          <span className="text-sm font-bold text-blue-600">R$ 0,00</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tab Dias Trabalhados */}
          {activeTab === 'dias-trabalhados' && (
            <Card>
              <CardHeader>
                <CardTitle>Dias Trabalhados</CardTitle>
                <CardDescription>
                  Histórico dos seus dias de trabalho registrados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhum dia de trabalho registrado ainda</p>
                  <p className="text-sm mt-2">Seu gestor registrará os dias trabalhados aqui</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tab Pagamentos */}
          {activeTab === 'pagamentos' && (
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Pagamentos</CardTitle>
                <CardDescription>
                  Acompanhe os pagamentos recebidos e pendentes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-500">
                  <DollarSign className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhum pagamento registrado ainda</p>
                  <p className="text-sm mt-2">Os pagamentos aparecerão aqui quando forem realizados</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tab Solicitar Material */}
          {activeTab === 'solicitar-material' && (
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle>Solicitações de Materiais</CardTitle>
                    <CardDescription>
                      Solicite materiais necessários para o trabalho
                    </CardDescription>
                  </div>
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="gap-2 w-full sm:w-auto">
                        <Plus className="w-4 h-4" />
                        Nova Solicitação
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Solicitar Material</DialogTitle>
                        <DialogDescription>
                          Preencha os dados do material que você precisa
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="nome">Nome do Material *</Label>
                          <Input
                            id="nome"
                            placeholder="Ex: Cimento, Areia, Tinta..."
                            value={nomeMaterial}
                            onChange={(e) => setNomeMaterial(e.target.value)}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="quantidade">Quantidade *</Label>
                            <Input
                              id="quantidade"
                              type="number"
                              placeholder="0"
                              min="0"
                              step="0.01"
                              value={quantidade}
                              onChange={(e) => setQuantidade(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="valor">Valor Unit. (R$) *</Label>
                            <Input
                              id="valor"
                              type="number"
                              placeholder="0,00"
                              min="0"
                              step="0.01"
                              value={valorUnitario}
                              onChange={(e) => setValorUnitario(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="observacao">Observação (opcional)</Label>
                          <Textarea
                            id="observacao"
                            placeholder="Informações adicionais..."
                            rows={3}
                            value={observacao}
                            onChange={(e) => setObservacao(e.target.value)}
                          />
                        </div>
                        <Button 
                          className="w-full" 
                          onClick={handleSolicitarMaterial}
                        >
                          Enviar Solicitação
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-12 text-gray-500">
                    <Package className="w-12 h-12 mx-auto mb-4 opacity-50 animate-pulse" />
                    <p>Carregando solicitações...</p>
                  </div>
                ) : materiais.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhuma solicitação de material ainda</p>
                    <p className="text-sm mt-2">Clique em "Nova Solicitação" para começar</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Lista de Materiais */}
                    <div className="space-y-3">
                      {materiais.map((material) => (
                        <Card key={material.id} className="border-l-4 border-l-orange-500">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 space-y-2">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-semibold text-gray-900">{material.nome_material}</h4>
                                  <span className={`text-xs px-2 py-1 rounded-full ${
                                    material.status === 'pendente' ? 'bg-yellow-100 text-yellow-700' :
                                    material.status === 'aprovado' ? 'bg-green-100 text-green-700' :
                                    'bg-red-100 text-red-700'
                                  }`}>
                                    {material.status === 'pendente' ? 'Pendente' :
                                     material.status === 'aprovado' ? 'Aprovado' : 'Recusado'}
                                  </span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                  <div>
                                    <span className="text-gray-500">Quantidade:</span>
                                    <span className="ml-2 font-medium">{material.quantidade}</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Valor Unit.:</span>
                                    <span className="ml-2 font-medium">
                                      R$ {material.valor_unitario.toFixed(2)}
                                    </span>
                                  </div>
                                </div>
                                <div className="text-sm">
                                  <span className="text-gray-500">Valor Total:</span>
                                  <span className="ml-2 font-bold text-blue-600">
                                    R$ {material.valor_total.toFixed(2)}
                                  </span>
                                </div>
                                {material.observacao && (
                                  <p className="text-sm text-gray-600 italic">
                                    {material.observacao}
                                  </p>
                                )}
                                <p className="text-xs text-gray-400">
                                  {new Date(material.created_at).toLocaleDateString('pt-BR', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </p>
                              </div>
                              {material.status === 'pendente' && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleRemoverMaterial(material.id)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {/* Total Geral */}
                    <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-6 h-6 text-blue-600" />
                            <span className="text-lg font-semibold text-gray-900">
                              Total de Materiais Solicitados:
                            </span>
                          </div>
                          <span className="text-2xl font-bold text-blue-600">
                            R$ {calcularTotal().toFixed(2)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mt-2">
                          {materiais.length} {materiais.length === 1 ? 'solicitação' : 'solicitações'} registrada(s)
                        </p>
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
