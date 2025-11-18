'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Building2, Users, LogIn } from 'lucide-react'

export default function Home() {
  const { isAuthenticated, tipoUsuario } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    if (isAuthenticated && tipoUsuario) {
      if (tipoUsuario === 'dono') {
        router.push('/dashboard')
      } else if (tipoUsuario === 'funcionario') {
        router.push('/sala')
      }
    }
  }, [isAuthenticated, tipoUsuario, router, mounted])

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Building2 className="w-12 h-12 text-blue-600" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              GestorFlex
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Sistema completo de gestão de equipes, técnicos e funcionários
          </p>
        </div>

        {/* Cards de Login */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Card Dono/Gestor */}
          <Card className="border-2 hover:border-blue-500 transition-all hover:shadow-xl">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">Dono / Gestor</CardTitle>
              <CardDescription className="text-base">
                Gerencie sua equipe, projetos e pagamentos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm text-gray-600 mb-6">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                  Cadastre funcionários e técnicos
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                  Controle dias trabalhados e pagamentos
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                  Gerencie projetos e materiais
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                  Relatórios completos da equipe
                </li>
              </ul>
              <Button 
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                size="lg"
                onClick={() => router.push('/login-dono')}
              >
                <LogIn className="w-4 h-4 mr-2" />
                Entrar como Gestor
              </Button>
            </CardContent>
          </Card>

          {/* Card Funcionário */}
          <Card className="border-2 hover:border-cyan-500 transition-all hover:shadow-xl">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-cyan-600" />
              </div>
              <CardTitle className="text-2xl">Funcionário</CardTitle>
              <CardDescription className="text-base">
                Acesse sua área privada com seu PIN
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm text-gray-600 mb-6">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-cyan-600 rounded-full" />
                  Veja seus dias trabalhados
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-cyan-600 rounded-full" />
                  Acompanhe pagamentos recebidos
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-cyan-600 rounded-full" />
                  Solicite materiais necessários
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-cyan-600 rounded-full" />
                  Comunique-se com seu gestor
                </li>
              </ul>
              <Button 
                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
                size="lg"
                onClick={() => router.push('/login-funcionario')}
              >
                <LogIn className="w-4 h-4 mr-2" />
                Entrar com PIN
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Footer Info */}
        <div className="text-center mt-16 text-gray-500 text-sm">
          <p>Gestão simples e eficiente para sua equipe</p>
        </div>
      </div>
    </div>
  )
}
