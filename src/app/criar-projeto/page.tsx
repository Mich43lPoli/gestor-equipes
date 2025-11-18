'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Building2, ArrowLeft, Briefcase, MapPin, Calendar, DollarSign, FileText } from 'lucide-react'
import { toast } from 'sonner'

export default function CriarProjetoPage() {
  const router = useRouter()
  const { isAuthenticated, tipoUsuario } = useAuth()
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    endereco: '',
    cliente: '',
    telefoneCliente: '',
    dataInicio: '',
    dataPrevisaoTermino: '',
    valorContrato: '',
    observacoes: ''
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    if (!isAuthenticated || tipoUsuario !== 'dono') {
      router.push('/login-dono')
    }
  }, [isAuthenticated, tipoUsuario, router, mounted])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validações básicas
      if (!formData.nome.trim()) {
        toast.error('Nome do projeto é obrigatório')
        setLoading(false)
        return
      }

      if (!formData.cliente.trim()) {
        toast.error('Nome do cliente é obrigatório')
        setLoading(false)
        return
      }

      // Aqui você pode adicionar a lógica para salvar no banco de dados
      // Por enquanto, vamos simular um salvamento
      await new Promise(resolve => setTimeout(resolve, 1000))

      toast.success('Projeto criado com sucesso!')
      router.push('/dashboard')
    } catch (error) {
      toast.error('Erro ao criar projeto')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) {
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
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push('/dashboard')}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <Building2 className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Criar Novo Projeto</h1>
              <p className="text-xs sm:text-sm text-gray-500">Preencha as informações do projeto</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 sm:py-8 max-w-4xl">
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-600" />
                Informações do Projeto
              </CardTitle>
              <CardDescription>
                Cadastre todos os detalhes importantes do projeto
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Nome do Projeto */}
              <div className="space-y-2">
                <Label htmlFor="nome" className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-blue-600" />
                  Nome do Projeto *
                </Label>
                <Input
                  id="nome"
                  name="nome"
                  placeholder="Ex: Construção Residencial - Rua das Flores"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                  className="text-base"
                />
              </div>

              {/* Descrição */}
              <div className="space-y-2">
                <Label htmlFor="descricao" className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  Descrição do Projeto
                </Label>
                <Textarea
                  id="descricao"
                  name="descricao"
                  placeholder="Descreva o escopo do projeto, tipo de obra, etapas principais..."
                  value={formData.descricao}
                  onChange={handleChange}
                  rows={4}
                  className="text-base resize-none"
                />
              </div>

              {/* Endereço */}
              <div className="space-y-2">
                <Label htmlFor="endereco" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  Endereço da Obra
                </Label>
                <Input
                  id="endereco"
                  name="endereco"
                  placeholder="Rua, número, bairro, cidade - UF"
                  value={formData.endereco}
                  onChange={handleChange}
                  className="text-base"
                />
              </div>

              {/* Informações do Cliente */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cliente">Nome do Cliente *</Label>
                  <Input
                    id="cliente"
                    name="cliente"
                    placeholder="Nome completo do cliente"
                    value={formData.cliente}
                    onChange={handleChange}
                    required
                    className="text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefoneCliente">Telefone do Cliente</Label>
                  <Input
                    id="telefoneCliente"
                    name="telefoneCliente"
                    placeholder="(00) 00000-0000"
                    value={formData.telefoneCliente}
                    onChange={handleChange}
                    className="text-base"
                  />
                </div>
              </div>

              {/* Datas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dataInicio" className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    Data de Início
                  </Label>
                  <Input
                    id="dataInicio"
                    name="dataInicio"
                    type="date"
                    value={formData.dataInicio}
                    onChange={handleChange}
                    className="text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dataPrevisaoTermino" className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    Previsão de Término
                  </Label>
                  <Input
                    id="dataPrevisaoTermino"
                    name="dataPrevisaoTermino"
                    type="date"
                    value={formData.dataPrevisaoTermino}
                    onChange={handleChange}
                    className="text-base"
                  />
                </div>
              </div>

              {/* Valor do Contrato */}
              <div className="space-y-2">
                <Label htmlFor="valorContrato" className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  Valor do Contrato
                </Label>
                <Input
                  id="valorContrato"
                  name="valorContrato"
                  type="text"
                  placeholder="R$ 0,00"
                  value={formData.valorContrato}
                  onChange={handleChange}
                  className="text-base"
                />
              </div>

              {/* Observações */}
              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações Adicionais</Label>
                <Textarea
                  id="observacoes"
                  name="observacoes"
                  placeholder="Informações extras, requisitos especiais, materiais específicos..."
                  value={formData.observacoes}
                  onChange={handleChange}
                  rows={4}
                  className="text-base resize-none"
                />
              </div>

              {/* Botões de Ação */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/dashboard')}
                  className="w-full sm:w-auto"
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="w-full sm:flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                  disabled={loading}
                >
                  {loading ? 'Criando...' : 'Criar Projeto'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </main>
    </div>
  )
}
