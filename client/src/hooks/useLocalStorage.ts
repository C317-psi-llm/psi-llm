import { useCallback, useState } from 'react'

type SetValue<T> = (value: T | null) => void

export function useLocalStorage<T>(
  key: string,
  initial: T | null = null,
): [T | null, SetValue<T>] {
  const [value, setValueState] = useState<T | null>(() => {
    try {
      const raw = window.localStorage.getItem(key)
      if (raw === null) return initial
      return JSON.parse(raw) as T
    } catch {
      return initial
    }
  })

  const setValue = useCallback<SetValue<T>>(
    (next) => {
      try {
        if (next === null || next === undefined) {
          window.localStorage.removeItem(key)
        } else {
          window.localStorage.setItem(key, JSON.stringify(next))
        }
      } catch {
        // ignore storage errors
      }
      setValueState(next)
    },
    [key],
  )

  return [value, setValue]
}

export default useLocalStorage
