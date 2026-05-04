import { useCallback, useRef, useState } from 'react'

import { api } from './useApi'

type SendOptions = {
  onDelta?: (delta: string, accumulated: string) => void
  onDone?: (accumulated: string) => void
  onError?: (message: string) => void
}

type ParsedFrame = {
  event: string
  data: string
}

function parseFrame(rawFrame: string): ParsedFrame | null {
  if (!rawFrame) return null
  let event = 'message'
  const dataLines: string[] = []
  for (const line of rawFrame.split('\n')) {
    if (!line) continue
    if (line.startsWith(':')) continue
    if (line.startsWith('event:')) {
      event = line.slice(6).trim()
    } else if (line.startsWith('data:')) {
      dataLines.push(line.slice(5).replace(/^\s/, ''))
    }
  }
  if (dataLines.length === 0 && event === 'message') return null
  return { event, data: dataLines.join('\n') }
}

export function useStream() {
  const [text, setText] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const reset = useCallback(() => {
    setText('')
    setError(null)
    setIsStreaming(false)
  }, [])

  const send = useCallback(
    async (path: string, body: unknown, opts: SendOptions = {}) => {
      abortRef.current?.abort()
      const controller = new AbortController()
      abortRef.current = controller

      setText('')
      setError(null)
      setIsStreaming(true)

      let accumulated = ''

      try {
        const response = await api(path, {
          method: 'POST',
          body: JSON.stringify(body),
          headers: { 'Content-Type': 'application/json' },
          stream: true,
          signal: controller.signal,
        })

        if (!response.ok || !response.body) {
          let message = 'Falha ao enviar mensagem.'
          try {
            const json = await response.json()
            message = json?.message || message
          } catch {
            // ignore parse error
          }
          setError(message)
          opts.onError?.(message)
          setIsStreaming(false)
          return
        }

        const reader = response.body.getReader()
        const decoder = new TextDecoder('utf-8')
        let buffer = ''
        let sawError = false

        while (true) {
          const { value, done } = await reader.read()
          if (done) break
          buffer += decoder.decode(value, { stream: true })

          let separatorIndex = buffer.indexOf('\n\n')
          while (separatorIndex !== -1) {
            const rawFrame = buffer.slice(0, separatorIndex)
            buffer = buffer.slice(separatorIndex + 2)

            const frame = parseFrame(rawFrame)
            if (frame) {
              if (frame.event === 'error') {
                let message = 'Erro no streaming.'
                try {
                  const parsed = JSON.parse(frame.data)
                  message = parsed?.message || message
                } catch {
                  // ignore
                }
                sawError = true
                setError(message)
                opts.onError?.(message)
              } else if (frame.event === 'done') {
                opts.onDone?.(accumulated)
              } else {
                try {
                  const parsed = JSON.parse(frame.data)
                  const delta: string = parsed?.delta ?? ''
                  if (delta) {
                    accumulated += delta
                    setText(accumulated)
                    opts.onDelta?.(delta, accumulated)
                  }
                } catch {
                  // ignore non-JSON frames
                }
              }
            }

            separatorIndex = buffer.indexOf('\n\n')
          }
        }

        if (!sawError) {
          opts.onDone?.(accumulated)
        }
      } catch (err) {
        if ((err as Error).name === 'AbortError') return
        const message =
          err instanceof Error ? err.message : 'Erro de conexao.'
        setError(message)
        opts.onError?.(message)
      } finally {
        setIsStreaming(false)
        abortRef.current = null
      }
    },
    [],
  )

  const cancel = useCallback(() => {
    abortRef.current?.abort()
    abortRef.current = null
    setIsStreaming(false)
  }, [])

  return { text, isStreaming, error, send, reset, cancel }
}

export default useStream
