import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/api/supabaseClient'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Lock, Mail, Loader2, AlertCircle, Shield, Wrench } from 'lucide-react'

export default function Login() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [loginType, setLoginType] = useState<'admin' | 'tecnico'>('tecnico')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    try {
      if (isSignUp) {
        // Sign up logic... (omitted for brevity, keeping same behavior)
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              role: loginType, // Pass the selected role
            },
          },
        })
        if (error) throw error
        setMessage('Cadastro realizado! Verifique seu email ou faça login.')
        setIsSignUp(false)
      } else {
        // 1. Sign in
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error

        // 2. Check Role
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('user_id', data.user.id)
          .single()

        if (profile?.role !== loginType && loginType === 'admin') {
          // If trying to login as Admin but is not admin
          await supabase.auth.signOut()
          throw new Error(
            'Acesso negado: Esta conta não possui privilégios de Administrador.'
          )
        }

        // If trying to login as Tecnico but is Admin, maybe allow?
        // Or enforce separation? "foi criado o banco de admin... login tem que ser diferente"
        // Let's enforce strict matching for better UX of "different logins".
        if (profile?.role !== loginType) {
          await supabase.auth.signOut()
          throw new Error(
            `Acesso incorreto: Por favor use o login de ${profile?.role === 'admin' ? 'Administrador' : 'Técnico'}.`
          )
        }

        navigate('/Dashboard')
      }
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-background to-background pointer-events-none" />

      <div className="w-full max-w-md space-y-8 glass-card p-8 rounded-xl border border-border relative z-10">
        <div className="text-center">
          <div
            className={`w-12 h-12 mx-auto rounded-xl flex items-center justify-center mb-4 transition-all duration-300 ${
              loginType === 'admin'
                ? 'bg-gradient-to-br from-purple-500 to-purple-400 glow-purple shadow-purple-500/20'
                : 'bg-gradient-to-br from-cyan-500 to-cyan-400 glow-cyan shadow-cyan-500/20'
            }`}
          >
            <span className="text-black font-bold text-2xl">K</span>
          </div>
          <h2 className="text-2xl font-bold text-foreground">
            {isSignUp ? 'Criar Conta' : 'Acessar Sistema'}
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            Gestão de Climatização Inteligente
          </p>
        </div>

        {/* Role Toggles */}
        {!isSignUp && (
          <div className="grid grid-cols-2 gap-2 p-1 bg-muted/50 rounded-lg">
            <button
              type="button"
              onClick={() => setLoginType('tecnico')}
              className={`flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${
                loginType === 'tecnico'
                  ? 'bg-background text-cyan-400 shadow-sm border border-border/50'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Wrench className="h-4 w-4" />
              Técnico
            </button>
            <button
              type="button"
              onClick={() => setLoginType('admin')}
              className={`flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${
                loginType === 'admin'
                  ? 'bg-background text-purple-400 shadow-sm border border-border/50'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Shield className="h-4 w-4" />
              Admin
            </button>
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          {isSignUp && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Nome Completo
              </label>
              <Input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Seu nome"
                required
                className="bg-muted/50 border-border focus:ring-cyan-500/20"
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                className="pl-9 bg-muted/50 border-border focus:ring-cyan-500/20"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Senha
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="pl-9 bg-muted/50 border-border focus:ring-cyan-500/20"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-2 text-sm text-red-400 animate-in fade-in slide-in-from-top-1">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {message && (
            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-sm text-green-400">
              {message}
            </div>
          )}

          <Button
            type="submit"
            className={`w-full font-semibold transition-all duration-300 ${
              loginType === 'admin'
                ? 'bg-purple-500 hover:bg-purple-600 text-white'
                : 'bg-cyan-500 hover:bg-cyan-600 text-black'
            }`}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isSignUp ? (
              'Cadastrar'
            ) : (
              `Entrar como ${loginType === 'admin' ? 'Administrador' : 'Técnico'}`
            )}
          </Button>
        </form>

        <div className="text-center text-sm">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className={`hover:underline ${loginType === 'admin' ? 'text-purple-400' : 'text-cyan-400'}`}
          >
            {isSignUp
              ? 'Já tem uma conta? Faça login'
              : 'Não tem conta? Cadastre-se'}
          </button>
        </div>
      </div>
    </div>
  )
}
