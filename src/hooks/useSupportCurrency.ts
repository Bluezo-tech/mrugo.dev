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
          const data: { currency?: unknown } = await response.json()
          if (data.currency === 'NGN' || data.currency === 'USD') return data.currency
        }
      } catch { /* Local preview has no Vercel function. */ }
      return supportRegion()
    }
    void findRegion().then((region) => {
      if (active && region) setCurrency(region)
    }).catch(() => {})
    return () => { active = false }
  }, [])
  return currency
}
