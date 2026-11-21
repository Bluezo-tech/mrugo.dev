import { useEffect, useRef, useState } from 'react'

export default function CountUp({ value, suffix = '' }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [count, setCount] = useState(0)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return

    let frame = 0
    let wasVisible = false
    const observer = new IntersectionObserver(([entry]) => {
      const isVisible = entry.isIntersecting
      if (!isVisible) {
        wasVisible = false
        cancelAnimationFrame(frame)
        return
      }
      if (wasVisible) return
      wasVisible = true
      setCount(0)
      const start = performance.now()
      const duration = 1100
      const tick = (now: number) => {
        const progress = Math.min((now - start) / duration, 1)
        const eased = 1 - (1 - progress) ** 3
        setCount(Math.round(value * eased))
        if (progress < 1) frame = requestAnimationFrame(tick)
        else setCount(value)
      }
      frame = requestAnimationFrame(tick)
    }, { threshold: 0.25 })
    observer.observe(element)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [value])

  const displayed = typeof window !== 'undefined' && (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) ? value : count
  return <span ref={ref}>{displayed}{suffix}</span>
}
