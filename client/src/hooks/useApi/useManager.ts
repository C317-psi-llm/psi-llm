import { useEffect, useState } from 'react'
import { api } from './index'

export interface DashboardStats {
  registeredPatients: number
  activePsychologists: number
  totalUsers: number
  completedCheckins: number
  highRiskPatients?: number
}

export interface CheckinsData {
  week: string
  checkins: number
}

export interface RiskDistributionData {
  id: string
  label: string
  patients: number
  value: number
}

export interface DashboardData {
  stats: DashboardStats
  checkins: CheckinsData[]
  riskDistribution: RiskDistributionData[]
}

export interface Psychologist {
  id_usuario: number
  nome: string
  email: string
  status: string
  data_cadastro: string
  patientCount: number
}

export interface Patient {
  id_usuario: number
  nome: string
  email: string
  status: string
  data_cadastro: string
  aceitou_lgpd: boolean
  psicologo_nome: string | null
  psicologo_id: number | null
}

export interface ManagerAlert {
  id_insight: number
  conteudo: string
  seriedade: string
  origem: string
  criado_em: string
  usuario_nome: string | null
  psicologo_nome: string | null
}

export interface RoleStats {
  papel: string
  count: number
}

export interface StatisticsData {
  dashboard: DashboardStats
  byRole: RoleStats[]
}

export interface MentalHealthReport {
  totalPatients: number
  insightsGenerated: number
  alertsActive: number
  alertsByOrigin: Array<{
    origem: string
    count: number
  }>
}

export interface LGPDUser {
  id_usuario: number
  nome: string
  email: string
  papel: string
  aceitou_lgpd: boolean
  data_cadastro: string
}

export interface LGPDStatus extends PaginatedResponse<LGPDUser> {
  acceptanceRate: number
}

export interface SystemSettings {
  appName: string
  version: string
  features: Record<string, boolean>
  security: {
    passwordMinLength: number
    sessionTimeout: number
    mfaEnabled: boolean
  }
  notifications: {
    emailAlerts: boolean
    smsAlerts: boolean
    pushNotifications: boolean
  }
}

export interface PaginatedResponse<T> {
  items: T[]
  page: number
  limit: number
  total: number
}

async function readManagerData<T>(path: string, message: string): Promise<T> {
  const response = await api(path)
  const result = await response.json().catch(() => null)

  if (!response.ok || !result?.success) {
    throw new Error(result?.message || message)
  }

  return result.data as T
}

function useManagerResource<T>(
  path: string,
  errorMessage: string,
  deps: Array<string | number | null> = [],
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchResource = async () => {
    if (!path) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const nextData = await readManagerData<T>(path, errorMessage)
      setData(nextData)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchResource()
  }, deps)

  return { data, loading, error, refetch: fetchResource }
}

export function useManagerDashboard() {
  return useManagerResource<DashboardData>(
    '/manager/dashboard',
    'Failed to fetch dashboard',
  )
}

export function useManagerPsychologists(page: number = 1, limit: number = 10) {
  return useManagerResource<PaginatedResponse<Psychologist>>(
    `/manager/psychologists?page=${page}&limit=${limit}`,
    'Failed to fetch psychologists',
    [page, limit],
  )
}

export function useManagerPatients(page: number = 1, limit: number = 10) {
  return useManagerResource<PaginatedResponse<Patient>>(
    `/manager/patients?page=${page}&limit=${limit}`,
    'Failed to fetch patients',
    [page, limit],
  )
}

export function useManagerPatientDetail(patientId: number | null) {
  const path = patientId ? `/manager/patients/${patientId}` : ''
  return useManagerResource<Patient>(
    path,
    'Failed to fetch patient details',
    [patientId],
  )
}

export function useManagerStatistics() {
  return useManagerResource<StatisticsData>(
    '/manager/statistics',
    'Failed to fetch statistics',
  )
}

export function useManagerAlerts(page: number = 1, limit: number = 10) {
  return useManagerResource<PaginatedResponse<ManagerAlert>>(
    `/manager/alerts?page=${page}&limit=${limit}`,
    'Failed to fetch alerts',
    [page, limit],
  )
}

export function useManagerMentalHealthReport() {
  return useManagerResource<MentalHealthReport>(
    '/manager/reports/mental-health',
    'Failed to fetch mental health report',
  )
}

export function useManagerLGPDStatus(page: number = 1, limit: number = 10) {
  return useManagerResource<LGPDStatus>(
    `/manager/lgpd?page=${page}&limit=${limit}`,
    'Failed to fetch LGPD status',
    [page, limit],
  )
}

export function useManagerSystemSettings() {
  return useManagerResource<SystemSettings>(
    '/manager/settings',
    'Failed to fetch system settings',
  )
}

export async function updateUserStatus(
  userId: number,
  status: 'active' | 'inactive',
) {
  const response = await api(`/manager/users/${userId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
  const result = await response.json().catch(() => null)
  if (!response.ok || !result?.success) {
    throw new Error(result?.message || 'Failed to update user status')
  }
  return result
}

export async function deleteManagerUser(userId: number) {
  const response = await api(`/manager/users/${userId}`, {
    method: 'DELETE',
  })
  const result = await response.json().catch(() => null)
  if (!response.ok || !result?.success) {
    throw new Error(result?.message || 'Failed to delete user')
  }
  return result
}

export async function updateManagerSystemSettings(
  settings: Partial<SystemSettings>,
) {
  const response = await api('/manager/settings', {
    method: 'PATCH',
    body: JSON.stringify(settings),
  })
  const result = await response.json().catch(() => null)
  if (!response.ok || !result?.success) {
    throw new Error(result?.message || 'Failed to update settings')
  }
  return result.data
}
