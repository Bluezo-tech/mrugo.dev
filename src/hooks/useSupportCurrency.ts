import { useEffect, useState } from 'react'
import { supportRegion } from '../lib/payments'
import { detectSupportCurrency, type SupportCurrency } from '../utils/shop'

export function useSupportCurrency() {
  const [currency, setCurrency] = useState<SupportCurrency>(detectSupportCurrency)
  useEffect(() => {
    let active = true
    const findRegion = async () => {
      try {
        const response = await fetch('/api/region', { cache: 'no-store' })
        if (response.ok) {
          const data: { country?: unknown } = await response.json()
          if (typeof data.country === 'string' && /^[A-Z]{2}$/.test(data.country)) return data.country
        }
      } catch { /* Local preview has no Vercel function. */ }
      return supportRegion()
    }
    void findRegion().then((country) => {
      if (active && country) setCurrency(detectSupportCurrency(country))
    }).catch(() => {})
    return () => { active = false }
  }, [])
  return currency
}
