// @ts-nocheck
import React, { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { base44 } from '@/api/base44Client'
import { Clock, Save, Calendar, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const weekDays = [
  { value: 1, label: 'Segunda-feira', short: 'Seg' },
  { value: 2, label: 'Terça-feira', short: 'Ter' },
  { value: 3, label: 'Quarta-feira', short: 'Qua' },
  { value: 4, label: 'Quinta-feira', short: 'Qui' },
  { value: 5, label: 'Sexta-feira', short: 'Sex' },
  { value: 6, label: 'Sábado', short: 'Sáb' },
  { value: 0, label: 'Domingo', short: 'Dom' },
]

export default function ScheduleConfig() {
  const queryClient = useQueryClient()
  const [config, setConfig] = useState({
    work_days: [1, 2, 3, 4, 5, 6],
    start_time: '08:00',
    end_time: '18:00',
    interval: 60,
    max_appointments_per_day: 8,
  })
  const [saved, setSaved] = useState(false)

  const { data: scheduleConfigs = [] } = useQuery({
    queryKey: ['schedule-config'],
    queryFn: () => base44.entities.ScheduleConfig.list(),
  })

  useEffect(() => {
    if (scheduleConfigs.length > 0) {
      setConfig(scheduleConfigs[0])
    }
  }, [scheduleConfigs])

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (scheduleConfigs.length > 0) {
        return base44.entities.ScheduleConfig.update(
          scheduleConfigs[0].id,
          data
        )
      } else {
        return base44.entities.ScheduleConfig.create(data)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['schedule-config'])
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    },
  })

  const toggleWorkDay = (dayValue) => {
    setConfig((prev) => ({
      ...prev,
      work_days: prev.work_days.includes(dayValue)
        ? prev.work_days.filter((d) => d !== dayValue)
        : [...prev.work_days, dayValue].sort(),
    }))
  }

  const generateTimeSlots = () => {
    const slots = []
    const [startHour, startMin] = config.start_time.split(':').map(Number)
    const [endHour, endMin] = config.end_time.split(':').map(Number)
    const startMinutes = startHour * 60 + startMin
    const endMinutes = endHour * 60 + endMin

    for (let min = startMinutes; min < endMinutes; min += config.interval) {
      const hour = Math.floor(min / 60)
      const minute = min % 60
      slots.push(
        `${hour.toString().padStart(2, '0')}:${minute
          .toString()
          .padStart(2, '0')}`
      )
    }

    return slots
  }

  const timeSlots = generateTimeSlots()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">
            Configuração de Horários
          </h1>
          <p className="text-white/40 text-sm mt-0.5">
            Configure os horários disponíveis para agendamento
          </p>
        </div>
        <Button
          onClick={() => saveMutation.mutate(config)}
          className={`${
            saved
              ? 'bg-emerald-500 hover:bg-emerald-400'
              : 'bg-cyan-500 hover:bg-cyan-400'
          } text-black font-medium`}
          disabled={saveMutation.isPending}
        >
          {saved ? (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Salvo!
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Salvar
            </>
          )}
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Configuration */}
        <div className="space-y-6">
          {/* Work Days */}
          <div className="glass-card rounded-xl p-6">
            <h3 className="text-sm font-medium text-white/60 mb-4 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Dias de Trabalho
            </h3>
            <div className="grid grid-cols-4 gap-2">
              {weekDays.map((day) => (
                <label
                  key={day.value}
                  className={`
                    flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-all border
                    ${
                      config.work_days.includes(day.value)
                        ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                        : 'bg-white/[0.02] border-white/5 text-white/50 hover:bg-white/5'
                    }
                  `}
                >
                  <Checkbox
                    checked={config.work_days.includes(day.value)}
                    onCheckedChange={() => toggleWorkDay(day.value)}
                    className="border-white/20"
                  />
                  <span className="text-xs font-medium">{day.short}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Time Settings */}
          <div className="glass-card rounded-xl p-6">
            <h3 className="text-sm font-medium text-white/60 mb-4 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Horários
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white/60">Início</Label>
                  <Input
                    type="time"
                    value={config.start_time}
                    onChange={(e) =>
                      setConfig({ ...config, start_time: e.target.value })
                    }
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white/60">Término</Label>
                  <Input
                    type="time"
                    value={config.end_time}
                    onChange={(e) =>
                      setConfig({ ...config, end_time: e.target.value })
                    }
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white/60">Intervalo</Label>
                  <Select
                    value={config.interval.toString()}
                    onValueChange={(value) =>
                      setConfig({ ...config, interval: parseInt(value) })
                    }
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1A1A1A] border-white/10">
                      <SelectItem value="30">30 minutos</SelectItem>
                      <SelectItem value="60">1 hora</SelectItem>
                      <SelectItem value="90">1h 30min</SelectItem>
                      <SelectItem value="120">2 horas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-white/60">Máx. Atend./Dia</Label>
                  <Input
                    type="number"
                    value={config.max_appointments_per_day}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        max_appointments_per_day: parseInt(e.target.value) || 1,
                      })
                    }
                    className="bg-white/5 border-white/10 text-white"
                    min="1"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="glass-card rounded-xl p-6">
          <h3 className="text-sm font-medium text-white/60 mb-4">
            Prévia dos Horários
          </h3>

          {/* Summary */}
          <div className="p-4 rounded-lg bg-cyan-500/5 border border-cyan-500/10 mb-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-white/40">Dias ativos</p>
                <p className="text-white font-medium">
                  {config.work_days.length} dias/semana
                </p>
              </div>
              <div>
                <p className="text-white/40">Horários/dia</p>
                <p className="text-white font-medium">
                  {timeSlots.length} slots
                </p>
              </div>
              <div>
                <p className="text-white/40">Funcionamento</p>
                <p className="text-white font-medium">
                  {config.start_time} às {config.end_time}
                </p>
              </div>
              <div>
                <p className="text-white/40">Capacidade</p>
                <p className="text-white font-medium">
                  {config.max_appointments_per_day} atend./dia
                </p>
              </div>
            </div>
          </div>

          {/* Days */}
          <div className="mb-4">
            <p className="text-xs text-white/40 mb-2">Dias disponíveis:</p>
            <div className="flex flex-wrap gap-2">
              {weekDays
                .filter((d) => config.work_days.includes(d.value))
                .map((day) => (
                  <span
                    key={day.value}
                    className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-xs font-medium text-cyan-400"
                  >
                    {day.label}
                  </span>
                ))}
            </div>
          </div>

          {/* Time slots grid */}
          <div>
            <p className="text-xs text-white/40 mb-2">Horários gerados:</p>
            <div className="grid grid-cols-5 gap-2 max-h-[250px] overflow-y-auto">
              {timeSlots.map((slot, index) => (
                <div
                  key={index}
                  className="p-2 bg-white/[0.02] border border-white/5 rounded-lg text-center text-xs font-medium text-white/60"
                >
                  {slot}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
