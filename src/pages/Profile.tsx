// @ts-nocheck
import React, { useState, useEffect } from 'react'
import { base44 } from '@/api/base44Client'
import { useTheme } from '../Layout'
import {
  User,
  Mail,
  Phone,
  Shield,
  Key,
  Moon,
  Sun,
  Save,
  CheckCircle,
  Camera,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function Profile() {
  const { theme, setTheme, toggleTheme } = useTheme()
  const [user, setUser] = useState(null)
  const [saved, setSaved] = useState(false)
  const [profile, setProfile] = useState({
    full_name: '',
    email: '',
    phone: '',
    role: 'admin',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  useEffect(() => {
    loadUser()
  }, [])

  const loadUser = async () => {
    try {
      const userData = await base44.auth.me()
      setUser(userData)
      setProfile((prev) => ({
        ...prev,
        full_name: userData?.full_name || '',
        email: userData?.email || '',
        phone: userData?.phone || '',
        role: userData?.role || 'admin',
      }))
    } catch (e) {}
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-foreground">Meu Perfil</h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          Gerencie suas informações pessoais
        </p>
      </div>

      {/* Avatar */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-cyan-400/10 border border-cyan-500/20 flex items-center justify-center">
              <span className="text-3xl font-bold text-cyan-400">
                {profile.full_name
                  ?.split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2) || 'U'}
              </span>
            </div>
            <button className="absolute -bottom-2 -right-2 w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center hover:bg-cyan-400 transition-colors">
              <Camera className="h-4 w-4 text-black" />
            </button>
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">
              {profile.full_name || 'Usuário'}
            </h2>
            <p className="text-sm text-muted-foreground">{profile.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <Shield className="h-4 w-4 text-purple-400" />
              <span className="text-sm text-purple-400 capitalize">
                {profile.role}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Info */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-4 flex items-center gap-2">
          <User className="h-4 w-4" />
          Informações Pessoais
        </h3>
        <div className="space-y-4">
          <div>
            <Label className="text-muted-foreground">Nome Completo</Label>
            <Input
              value={profile.full_name}
              onChange={(e) =>
                setProfile({ ...profile, full_name: e.target.value })
              }
              className="bg-muted/50 border-border text-foreground"
            />
          </div>
          <div>
            <Label className="text-muted-foreground">E-mail</Label>
            <Input
              type="email"
              value={profile.email}
              onChange={(e) =>
                setProfile({ ...profile, email: e.target.value })
              }
              className="bg-muted/50 border-border text-foreground"
              disabled
            />
            <p className="text-[10px] text-muted-foreground mt-1">
              O e-mail não pode ser alterado
            </p>
          </div>
          <div>
            <Label className="text-muted-foreground">Telefone</Label>
            <Input
              value={profile.phone}
              onChange={(e) =>
                setProfile({ ...profile, phone: e.target.value })
              }
              className="bg-muted/50 border-border text-foreground"
              placeholder="(00) 00000-0000"
            />
          </div>
        </div>
      </div>

      {/* Password */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-4 flex items-center gap-2">
          <Key className="h-4 w-4" />
          Alterar Senha
        </h3>
        <div className="space-y-4">
          <div>
            <Label className="text-muted-foreground">Senha Atual</Label>
            <Input
              type="password"
              value={profile.currentPassword}
              onChange={(e) =>
                setProfile({ ...profile, currentPassword: e.target.value })
              }
              className="bg-muted/50 border-border text-foreground"
              placeholder="••••••••"
            />
          </div>
          <div>
            <Label className="text-muted-foreground">Nova Senha</Label>
            <Input
              type="password"
              value={profile.newPassword}
              onChange={(e) =>
                setProfile({ ...profile, newPassword: e.target.value })
              }
              className="bg-muted/50 border-border text-foreground"
              placeholder="••••••••"
            />
          </div>
          <div>
            <Label className="text-muted-foreground">
              Confirmar Nova Senha
            </Label>
            <Input
              type="password"
              value={profile.confirmPassword}
              onChange={(e) =>
                setProfile({ ...profile, confirmPassword: e.target.value })
              }
              className="bg-muted/50 border-border text-foreground"
              placeholder="••••••••"
            />
          </div>
        </div>
      </div>

      {/* Theme */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-4">
          Aparência
        </h3>
        <p className="text-xs text-muted-foreground/70 mb-4">
          Escolha o tema que mais combina com você
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => setTheme('light')}
            className={`flex-1 p-5 rounded-xl border-2 transition-all duration-200 ${
              theme === 'light'
                ? 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-400 text-amber-600 shadow-lg shadow-amber-100/50 dark:shadow-none'
                : 'bg-muted/30 border-border text-muted-foreground hover:bg-muted/50 hover:border-muted-foreground/30'
            }`}
          >
            <div
              className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${
                theme === 'light' ? 'bg-amber-400/20' : 'bg-muted'
              }`}
            >
              <Sun
                className={`h-6 w-6 ${
                  theme === 'light' ? 'text-amber-500' : ''
                }`}
              />
            </div>
            <p className="text-sm font-semibold">Claro</p>
            <p className="text-[10px] mt-1 opacity-70">Limpo e profissional</p>
          </button>
          <button
            onClick={() => setTheme('dark')}
            className={`flex-1 p-5 rounded-xl border-2 transition-all duration-200 ${
              theme === 'dark'
                ? 'bg-gradient-to-br from-cyan-950/50 to-slate-900/50 border-cyan-500 text-cyan-400 shadow-lg shadow-cyan-500/10'
                : 'bg-muted/30 border-border text-muted-foreground hover:bg-muted/50 hover:border-muted-foreground/30'
            }`}
          >
            <div
              className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${
                theme === 'dark' ? 'bg-cyan-500/20' : 'bg-muted'
              }`}
            >
              <Moon
                className={`h-6 w-6 ${theme === 'dark' ? 'text-cyan-400' : ''}`}
              />
            </div>
            <p className="text-sm font-semibold">Escuro</p>
            <p className="text-[10px] mt-1 opacity-70">
              Elegante e confortável
            </p>
          </button>
        </div>
      </div>

      {/* Save */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          className={`${
            saved
              ? 'bg-emerald-500 hover:bg-emerald-400'
              : 'bg-cyan-500 hover:bg-cyan-400'
          } text-black font-medium`}
        >
          {saved ? (
            <>
              <CheckCircle className="h-4 w-4 mr-2" /> Salvo!
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" /> Salvar Alterações
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
