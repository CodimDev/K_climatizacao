// @ts-nocheck
import React, { useState } from 'react'
import {
  Building2,
  Upload,
  Phone,
  MapPin,
  Clock,
  MessageSquare,
  Save,
  CheckCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export default function Settings() {
  const [saved, setSaved] = useState(false)
  const [settings, setSettings] = useState({
    company_name: 'K-Climatização',
    cnpj: '12.345.678/0001-00',
    address: 'Rua das Flores, 123 - Centro, São Paulo - SP',
    phone: '(11) 99999-0000',
    whatsapp: '(11) 99999-0000',
    work_hours: '08:00 às 18:00',
    work_days: 'Segunda a Sábado',
    logo: null,
    messages: {
      confirmation:
        'Olá {nome}! Seu agendamento foi confirmado para {data} às {horario}. Endereço: {endereco}. K-Climatização.',
      reminder:
        'Lembrete: Seu serviço está agendado para amanhã, {data} às {horario}. Confirma presença? K-Climatização.',
      cancellation:
        'Seu agendamento para {data} foi cancelado. Entre em contato para reagendar. K-Climatização.',
    },
  })

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Configurações</h1>
          <p className="text-white/40 text-sm mt-0.5">
            Configurações gerais da empresa
          </p>
        </div>
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
              <Save className="h-4 w-4 mr-2" /> Salvar
            </>
          )}
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Company Info */}
        <div className="glass-card rounded-xl p-6">
          <h3 className="text-sm font-medium text-white/60 mb-4 flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Dados da Empresa
          </h3>
          <div className="space-y-4">
            <div>
              <Label className="text-white/60">Logo da Empresa</Label>
              <div className="mt-2 flex items-center gap-4">
                <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-cyan-500/20 to-cyan-400/10 border border-cyan-500/20 flex items-center justify-center">
                  <span className="text-2xl font-bold text-cyan-400">K</span>
                </div>
                <Button
                  variant="outline"
                  className="border-white/10 text-white hover:bg-white/5"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
              </div>
            </div>
            <div>
              <Label className="text-white/60">Nome da Empresa</Label>
              <Input
                value={settings.company_name}
                onChange={(e) =>
                  setSettings({ ...settings, company_name: e.target.value })
                }
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div>
              <Label className="text-white/60">CNPJ / CPF</Label>
              <Input
                value={settings.cnpj}
                onChange={(e) =>
                  setSettings({ ...settings, cnpj: e.target.value })
                }
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div>
              <Label className="text-white/60">Endereço Comercial</Label>
              <Input
                value={settings.address}
                onChange={(e) =>
                  setSettings({ ...settings, address: e.target.value })
                }
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
          </div>
        </div>

        {/* Contact & Hours */}
        <div className="glass-card rounded-xl p-6">
          <h3 className="text-sm font-medium text-white/60 mb-4 flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Contato e Horários
          </h3>
          <div className="space-y-4">
            <div>
              <Label className="text-white/60">Telefone</Label>
              <Input
                value={settings.phone}
                onChange={(e) =>
                  setSettings({ ...settings, phone: e.target.value })
                }
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div>
              <Label className="text-white/60">WhatsApp de Suporte</Label>
              <Input
                value={settings.whatsapp}
                onChange={(e) =>
                  setSettings({ ...settings, whatsapp: e.target.value })
                }
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div>
              <Label className="text-white/60">Horário de Atendimento</Label>
              <Input
                value={settings.work_hours}
                onChange={(e) =>
                  setSettings({ ...settings, work_hours: e.target.value })
                }
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div>
              <Label className="text-white/60">Dias de Funcionamento</Label>
              <Input
                value={settings.work_days}
                onChange={(e) =>
                  setSettings({ ...settings, work_days: e.target.value })
                }
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
          </div>
        </div>

        {/* Message Templates */}
        <div className="lg:col-span-2 glass-card rounded-xl p-6">
          <h3 className="text-sm font-medium text-white/60 mb-4 flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Mensagens Automáticas
          </h3>
          <div className="space-y-4">
            <div>
              <Label className="text-white/60">
                Confirmação de Agendamento
              </Label>
              <Textarea
                value={settings.messages.confirmation}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    messages: {
                      ...settings.messages,
                      confirmation: e.target.value,
                    },
                  })
                }
                className="bg-white/5 border-white/10 text-white min-h-[80px]"
              />
              <p className="text-[10px] text-white/30 mt-1">
                Variáveis: {'{nome}'}, {'{data}'}, {'{horario}'}, {'{endereco}'}
                , {'{servico}'}
              </p>
            </div>
            <div>
              <Label className="text-white/60">Lembrete (1 dia antes)</Label>
              <Textarea
                value={settings.messages.reminder}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    messages: {
                      ...settings.messages,
                      reminder: e.target.value,
                    },
                  })
                }
                className="bg-white/5 border-white/10 text-white min-h-[80px]"
              />
            </div>
            <div>
              <Label className="text-white/60">Cancelamento</Label>
              <Textarea
                value={settings.messages.cancellation}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    messages: {
                      ...settings.messages,
                      cancellation: e.target.value,
                    },
                  })
                }
                className="bg-white/5 border-white/10 text-white min-h-[80px]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
