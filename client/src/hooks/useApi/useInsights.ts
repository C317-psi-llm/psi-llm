import { useEffect, useState } from 'react'
import { api } from './index'

export type InsightSeriedade = 'padrao' | 'alerta' | 'bom'
export type InsightOrigem = 'manual' | 'ia'

export interface PatientInsight {
  id_insight: number
  id_usuario: number
  id_psicologo: number | null
  conteudo: string
  seriedade: InsightSeriedade
  origem: InsightOrigem
  criado_em: string
  modificado_em?: string
}

async function readPatientInsights(): Promise<PatientInsight[]> {
  const response = await api('/insights/me')
  const result = await response.json().catch(() => null)

  if (!response.ok || !result?.success) {
    throw new Error(result?.message || 'Erro ao carregar insights.')
  }

  return result.data ?? []
}

export function usePatientInsights() {
  const [data, setData] = useState<PatientInsight[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function fetchInsights() {
    try {
      setLoading(true)
      const insights = await readPatientInsights()
      setData(insights)
      setError(null)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Erro ao carregar insights.',
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInsights()
  }, [])

  return {
    data,
    loading,
    error,
    refetch: fetchInsights,
  }
}