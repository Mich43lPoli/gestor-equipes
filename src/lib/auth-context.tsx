'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { TipoUsuario, UsuarioDono, Funcionario } from '@/lib/types'

interface AuthContextType {
  tipoUsuario: TipoUsuario | null
  usuarioDono: UsuarioDono | null
  funcionario: Funcionario | null
  login: (tipo: TipoUsuario, dados: UsuarioDono | Funcionario) => void
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [tipoUsuario, setTipoUsuario] = useState<TipoUsuario | null>(null)
  const [usuarioDono, setUsuarioDono] = useState<UsuarioDono | null>(null)
  const [funcionario, setFuncionario] = useState<Funcionario | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Verificar se está no cliente antes de acessar localStorage
    if (typeof window === 'undefined') {
      setIsLoading(false)
      return
    }

    try {
      // Recuperar sessão do localStorage
      const tipo = localStorage.getItem('tipoUsuario') as TipoUsuario | null
      const dadosDono = localStorage.getItem('usuarioDono')
      const dadosFuncionario = localStorage.getItem('funcionario')

      if (tipo === 'dono' && dadosDono) {
        setTipoUsuario('dono')
        setUsuarioDono(JSON.parse(dadosDono))
      } else if (tipo === 'funcionario' && dadosFuncionario) {
        setTipoUsuario('funcionario')
        setFuncionario(JSON.parse(dadosFuncionario))
      }
    } catch (error) {
      console.error('Erro ao recuperar sessão:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const login = (tipo: TipoUsuario, dados: UsuarioDono | Funcionario) => {
    setTipoUsuario(tipo)
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('tipoUsuario', tipo)

      if (tipo === 'dono') {
        setUsuarioDono(dados as UsuarioDono)
        localStorage.setItem('usuarioDono', JSON.stringify(dados))
      } else {
        setFuncionario(dados as Funcionario)
        localStorage.setItem('funcionario', JSON.stringify(dados))
      }
    }
  }

  const logout = () => {
    setTipoUsuario(null)
    setUsuarioDono(null)
    setFuncionario(null)
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('tipoUsuario')
      localStorage.removeItem('usuarioDono')
      localStorage.removeItem('funcionario')
    }
  }

  const isAuthenticated = tipoUsuario !== null

  return (
    <AuthContext.Provider
      value={{
        tipoUsuario,
        usuarioDono,
        funcionario,
        login,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}
