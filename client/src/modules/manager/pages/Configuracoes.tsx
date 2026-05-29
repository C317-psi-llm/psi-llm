import { useEffect, useState, type ReactNode } from 'react'

import DashboardCard from '../../../components/DashboardCard'
import Snackbar from '../../../components/Snackbar'
import {
  updateManagerSystemSettings,
  useManagerSystemSettings,
  type SystemSettings,
} from '../../../hooks/useApi/useManager'
import ManagerLayout from './ManagerLayout'

const featureLabels: Record<string, string> = {
  chat: 'Chat',
  insights: 'Insights',
  gamification: 'Gamificacao',
  alerts: 'Alertas',
}

const notificationLabels: Record<string, string> = {
  emailAlerts: 'Alertas por email',
  smsAlerts: 'Alertas por SMS',
  pushNotifications: 'Notificacoes push',
}

export default function ManagerConfiguracoes() {
  const { data, loading, error, refetch } = useManagerSystemSettings()
  const [settings, setSettings] = useState<SystemSettings | null>(null)
  const [saving, setSaving] = useState(false)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    variant: 'info' as 'error' | 'info',
  })

  useEffect(() => {
    if (data) {
      setSettings(data)
    }
  }, [data])

  useEffect(() => {
    if (error) {
      setSnackbar({
        open: true,
        message: error || 'Erro ao carregar configuracoes.',
        variant: 'error',
      })
    }
  }, [error])

  async function handleSave() {
    if (!settings) return

    try {
      setSaving(true)
      await updateManagerSystemSettings(settings)
      setSnackbar({
        open: true,
        message: 'Configuracoes atualizadas.',
        variant: 'info',
      })
      await refetch()
    } catch (err) {
      setSnackbar({
        open: true,
        message:
          err instanceof Error ? err.message : 'Erro ao salvar configuracoes.',
        variant: 'error',
      })
    } finally {
      setSaving(false)
    }
  }

  function updateFeature(key: string, value: boolean) {
    setSettings((current) =>
      current
        ? {
            ...current,
            features: { ...current.features, [key]: value },
          }
        : current,
    )
  }

  function updateNotification(key: string, value: boolean) {
    setSettings((current) =>
      current
        ? {
            ...current,
            notifications: { ...current.notifications, [key]: value },
          }
        : current,
    )
  }

  function updateSecurity(
    key: keyof SystemSettings['security'],
    value: number | boolean,
  ) {
    setSettings((current) =>
      current
        ? {
            ...current,
            security: { ...current.security, [key]: value },
          }
        : current,
    )
  }

  return (
    <ManagerLayout>
      <div className="space-y-8">
        <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-gray-950">
              Configura&ccedil;&otilde;es
            </h1>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              Configure permissoes, parametros operacionais e preferencias do
              gestor.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={!settings || saving}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-emerald-800 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-900 disabled:opacity-50"
          >
            {saving ? 'Salvando...' : 'Salvar'}
          </button>
        </header>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            {error}
          </div>
        )}

        {loading && (
          <p className="text-sm text-gray-500">Carregando configuracoes...</p>
        )}

        {!loading && settings && (
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.8fr)]">
            <section className="space-y-6">
              <SettingsSection
                title="Funcionalidades"
                description="Controle quais modulos ficam ativos na plataforma."
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  {Object.entries(settings.features).map(([key, value]) => (
                    <ToggleRow
                      key={key}
                      label={featureLabels[key] || key}
                      checked={value}
                      onChange={(nextValue) => updateFeature(key, nextValue)}
                    />
                  ))}
                </div>
              </SettingsSection>

              <SettingsSection
                title="Notificacoes"
                description="Defina canais habilitados para comunicacoes gerenciais."
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  {Object.entries(settings.notifications).map(([key, value]) => (
                    <ToggleRow
                      key={key}
                      label={notificationLabels[key] || key}
                      checked={value}
                      onChange={(nextValue) =>
                        updateNotification(key, nextValue)
                      }
                    />
                  ))}
                </div>
              </SettingsSection>
            </section>

            <SettingsSection
              title="Seguranca"
              description="Parametros de sessao e politicas de acesso."
            >
              <div className="space-y-5">
                <NumberField
                  label="Tamanho minimo da senha"
                  value={settings.security.passwordMinLength}
                  min={6}
                  max={24}
                  onChange={(value) =>
                    updateSecurity('passwordMinLength', value)
                  }
                />
                <NumberField
                  label="Timeout de sessao em minutos"
                  value={settings.security.sessionTimeout}
                  min={5}
                  max={120}
                  onChange={(value) => updateSecurity('sessionTimeout', value)}
                />
                <ToggleRow
                  label="MFA habilitado"
                  checked={settings.security.mfaEnabled}
                  onChange={(value) => updateSecurity('mfaEnabled', value)}
                />
              </div>
            </SettingsSection>
          </div>
        )}
      </div>

      <Snackbar
        open={snackbar.open}
        message={snackbar.message}
        variant={snackbar.variant}
        onClose={() =>
          setSnackbar({ open: false, message: '', variant: 'info' })
        }
      />
    </ManagerLayout>
  )
}

function SettingsSection({
  children,
  description,
  title,
}: {
  children: ReactNode
  description: string
  title: ReactNode
}) {
  return (
    <DashboardCard>
      <h2 className="text-lg font-semibold text-gray-950">{title}</h2>
      <p className="mt-1 text-sm leading-6 text-gray-500">{description}</p>
      <div className="mt-6">{children}</div>
    </DashboardCard>
  )
}

function ToggleRow({
  checked,
  label,
  onChange,
}: {
  checked: boolean
  label: string
  onChange: (checked: boolean) => void
}) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-xl border border-gray-100 bg-slate-50 px-4 py-3">
      <span className="text-sm font-semibold text-gray-700">{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-5 w-5 rounded border-gray-300 text-emerald-700 focus:ring-emerald-700"
      />
    </label>
  )
}

function NumberField({
  label,
  max,
  min,
  onChange,
  value,
}: {
  label: string
  max: number
  min: number
  onChange: (value: number) => void
  value: number
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-gray-700">{label}</span>
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-2 h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 shadow-sm outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
      />
    </label>
  )
}
