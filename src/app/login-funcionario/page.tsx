'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, ArrowLeft, Hash, User } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

export default function LoginFuncionarioPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [pin, setPin] = useState('')
  const [nome, setNome] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (pin.length < 4) {
      toast.error('O PIN deve ter no mínimo 4 dígitos')
      return
    }

    setIsLoading(true)

    try {
      // Simulação de login (substituir por chamada real ao Supabase)
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Mock de funcionário para demonstração
      const funcionarioMock = {
        id: '1',
        id_dono: '1',
        nome: nome,
        pin: pin,
        status: 'ativo' as const,
        data_cadastro: new Date().toISOString()
      }

      login('funcionario', funcionarioMock)
      toast.success(`Bem-vindo, ${nome}!`)
      router.push('/dashboard-funcionario')
    } catch (error) {
      toast.error('PIN ou nome incorretos. Verifique com seu gestor.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link href="/" className="inline-flex items-center gap-2 text-cyan-600 hover:text-cyan-700 mb-6">
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Link>

        <Card className="border-2">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-cyan-600" />
            </div>
            <CardTitle className="text-2xl">Área do Funcionário</CardTitle>
            <CardDescription>
              Entre com seu PIN fornecido pelo gestor
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Primeiro Nome</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="nome"
                    type="text"
                    placeholder="Digite seu primeiro nome"
                    className="pl-10"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Digite apenas seu primeiro nome para confirmar
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pin">PIN de Acesso</Label>
                <div className="relative">
                  <Hash className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="pin"
                    type="password"
                    placeholder="Digite seu PIN"
                    className="pl-10 text-2xl tracking-widest"
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                    maxLength={6}
                    required
                  />
                </div>
                <p className="text-xs text-gray-500">
                  PIN numérico fornecido pelo seu gestor
                </p>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
                disabled={isLoading}
              >
                {isLoading ? 'Entrando...' : 'Entrar na Minha Sala'}
              </Button>

              <div className="text-center text-sm text-gray-500 pt-4">
                <p>Não tem um PIN?</p>
                <p className="text-xs mt-1">Solicite ao seu gestor</p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
