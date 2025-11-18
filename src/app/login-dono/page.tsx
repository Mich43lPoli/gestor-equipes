'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Building2, ArrowLeft, Mail, Lock, User } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

export default function LoginDonoPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  // Estados para Login
  const [loginEmail, setLoginEmail] = useState('')
  const [loginSenha, setLoginSenha] = useState('')

  // Estados para Cadastro
  const [cadastroNome, setCadastroNome] = useState('')
  const [cadastroEmail, setCadastroEmail] = useState('')
  const [cadastroSenha, setCadastroSenha] = useState('')
  const [cadastroConfirmaSenha, setCadastroConfirmaSenha] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulação de login (substituir por chamada real ao Supabase)
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Mock de usuário para demonstração
      const usuarioMock = {
        id: '1',
        nome: 'Gestor Demo',
        email: loginEmail,
        senha: '',
        plano: 'gratuito' as const,
        data_criacao: new Date().toISOString()
      }

      login('dono', usuarioMock)
      toast.success('Login realizado com sucesso!')
      router.push('/dashboard')
    } catch (error) {
      toast.error('Erro ao fazer login. Verifique suas credenciais.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault()

    if (cadastroSenha !== cadastroConfirmaSenha) {
      toast.error('As senhas não coincidem')
      return
    }

    if (cadastroSenha.length < 6) {
      toast.error('A senha deve ter no mínimo 6 caracteres')
      return
    }

    setIsLoading(true)

    try {
      // Simulação de cadastro (substituir por chamada real ao Supabase)
      await new Promise(resolve => setTimeout(resolve, 1000))

      const novoUsuario = {
        id: Math.random().toString(),
        nome: cadastroNome,
        email: cadastroEmail,
        senha: '',
        plano: 'gratuito' as const,
        data_criacao: new Date().toISOString()
      }

      login('dono', novoUsuario)
      toast.success('Conta criada com sucesso!')
      router.push('/dashboard')
    } catch (error) {
      toast.error('Erro ao criar conta. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link href="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6">
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Link>

        <Card className="border-2">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl">Área do Gestor</CardTitle>
            <CardDescription>
              Entre com sua conta ou crie uma nova
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Entrar</TabsTrigger>
                <TabsTrigger value="cadastro">Criar Conta</TabsTrigger>
              </TabsList>

              {/* Tab de Login */}
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">E-mail</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="seu@email.com"
                        className="pl-10"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-senha">Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="login-senha"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        value={loginSenha}
                        onChange={(e) => setLoginSenha(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Entrando...' : 'Entrar'}
                  </Button>

                  <div className="text-center text-sm text-gray-500">
                    <a href="#" className="text-blue-600 hover:underline">
                      Esqueceu sua senha?
                    </a>
                  </div>
                </form>
              </TabsContent>

              {/* Tab de Cadastro */}
              <TabsContent value="cadastro">
                <form onSubmit={handleCadastro} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cadastro-nome">Nome Completo</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="cadastro-nome"
                        type="text"
                        placeholder="Seu nome"
                        className="pl-10"
                        value={cadastroNome}
                        onChange={(e) => setCadastroNome(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cadastro-email">E-mail</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="cadastro-email"
                        type="email"
                        placeholder="seu@email.com"
                        className="pl-10"
                        value={cadastroEmail}
                        onChange={(e) => setCadastroEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cadastro-senha">Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="cadastro-senha"
                        type="password"
                        placeholder="Mínimo 6 caracteres"
                        className="pl-10"
                        value={cadastroSenha}
                        onChange={(e) => setCadastroSenha(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cadastro-confirma">Confirmar Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="cadastro-confirma"
                        type="password"
                        placeholder="Digite a senha novamente"
                        className="pl-10"
                        value={cadastroConfirmaSenha}
                        onChange={(e) => setCadastroConfirmaSenha(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Criando conta...' : 'Criar Conta'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
