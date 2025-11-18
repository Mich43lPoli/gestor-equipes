'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Building2, ArrowLeft, UserPlus } from 'lucide-react'
import { toast } from 'sonner'

export default function CadastrarFuncionarioPage() {
  const router = useRouter()
  const { usuarioDono } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    documento: '',
    pin: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validações básicas
      if (!formData.nome || !formData.pin) {
        toast.error('Nome e PIN são obrigatórios')
        setLoading(false)
        return
      }

      if (formData.pin.length !== 4) {
        toast.error('O PIN deve ter 4 dígitos')
        setLoading(false)
        return
      }

      // Simular salvamento (aqui você integraria com Supabase)
      await new Promise(resolve => setTimeout(resolve, 1000))

      toast.success('Funcionário cadastrado com sucesso!')
      router.push('/dashboard')
    } catch (error) {
      toast.error('Erro ao cadastrar funcionário')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4)
    setFormData(prev => ({
      ...prev,
      pin: value
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Building2 className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">GestorFlex</h1>
                <p className="text-sm text-gray-500">Cadastrar Novo Funcionário</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => router.push('/dashboard')}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <UserPlus className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle>Novo Funcionário</CardTitle>
                  <CardDescription>
                    Preencha os dados do funcionário para cadastrá-lo no sistema
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nome */}
                <div className="space-y-2">
                  <Label htmlFor="nome">
                    Nome Completo <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="nome"
                    name="nome"
                    type="text"
                    placeholder="Ex: João Silva"
                    value={formData.nome}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Telefone */}
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone (opcional)</Label>
                  <Input
                    id="telefone"
                    name="telefone"
                    type="tel"
                    placeholder="Ex: (11) 98765-4321"
                    value={formData.telefone}
                    onChange={handleChange}
                  />
                </div>

                {/* Documento */}
                <div className="space-y-2">
                  <Label htmlFor="documento">Documento (CPF/RG) (opcional)</Label>
                  <Input
                    id="documento"
                    name="documento"
                    type="text"
                    placeholder="Ex: 123.456.789-00"
                    value={formData.documento}
                    onChange={handleChange}
                  />
                </div>

                {/* PIN */}
                <div className="space-y-2">
                  <Label htmlFor="pin">
                    PIN de Acesso (4 dígitos) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="pin"
                    name="pin"
                    type="text"
                    inputMode="numeric"
                    placeholder="Ex: 1234"
                    value={formData.pin}
                    onChange={handlePinChange}
                    maxLength={4}
                    required
                  />
                  <p className="text-sm text-gray-500">
                    Este PIN será usado pelo funcionário para acessar o sistema
                  </p>
                </div>

                {/* Botões */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push('/dashboard')}
                    className="flex-1"
                    disabled={loading}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                    disabled={loading}
                  >
                    {loading ? 'Cadastrando...' : 'Cadastrar Funcionário'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Informações Adicionais */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Informações Importantes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-gray-600">
              <div className="flex gap-2">
                <span className="font-semibold text-blue-600">•</span>
                <p>O PIN deve ter exatamente 4 dígitos numéricos</p>
              </div>
              <div className="flex gap-2">
                <span className="font-semibold text-blue-600">•</span>
                <p>O funcionário usará o PIN + primeiro nome para fazer login</p>
              </div>
              <div className="flex gap-2">
                <span className="font-semibold text-blue-600">•</span>
                <p>Cada PIN deve ser único para cada funcionário</p>
              </div>
              <div className="flex gap-2">
                <span className="font-semibold text-blue-600">•</span>
                <p>Você pode editar os dados do funcionário depois do cadastro</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
