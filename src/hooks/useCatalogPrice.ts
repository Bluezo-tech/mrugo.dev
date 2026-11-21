import { useEffect, useState } from 'react'
import { quoteDollarSupport } from '../lib/payments'
import { priceLabel, type Product } from '../lib/products'
import { detectSupportCurrency } from '../utils/shop'

export function useCatalogPrice() {
  const [currency] = useState(detectSupportCurrency)
  const [ngnPerUsd, setNgnPerUsd] = useState<number | null>(null)

  useEffect(() => {
    if (currency !== 'USD') return
    let active = true
    // The Paystack checkout still charges NGN until USD settlement is enabled.
    // Reuse the same server exchange quote as support for an honest estimate.
    void quoteDollarSupport(100).then(({ amount_ngn }) => {
      if (active && amount_ngn > 0) setNgnPerUsd(amount_ngn / 100)
    }).catch(() => { if (active) setNgnPerUsd(null) })
    return () => { active = false }
  }, [currency])

  return (product: Product) => {
    const charged = priceLabel(product)
    if (currency !== 'USD' || !ngnPerUsd || product.currency !== 'NGN') return charged
    const estimate = product.price_minor / 100 / ngnPerUsd
    return `${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(estimate)} ≈ ${charged} charged`
  }
}
