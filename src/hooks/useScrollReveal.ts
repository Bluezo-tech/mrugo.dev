import { useLayoutEffect } from 'react'

const SAFETY_TIMEOUT_MS = 1500

/**
 * Reveals elements marked with data-reveal as they scroll into view.
 *
 * Deliberately cautious:
 * - does nothing if the browser lacks IntersectionObserver
 * - does nothing when the visitor prefers reduced motion
 * - a safety timer reveals everything shortly after load, so content can never
 *   be left invisible if something goes wrong
 */
export default function useScrollReveal(routeKey: string) {
  useLayoutEffect(() => {
    const root = document.documentElement

    if (!('IntersectionObserver' in window)) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const targets = Array.from(
      document.querySelectorAll<HTMLElement>('[data-reveal]'),
    )
    if (targets.length === 0) return

    root.classList.add('reveal-ready')
    targets.forEach((target) => target.classList.add('reveal'))

    const revealAll = () => {
      targets.forEach((target) => target.classList.add('is-visible'))
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        })
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.06 },
    )

    targets.forEach((target) => observer.observe(target))
    const safetyTimer = window.setTimeout(revealAll, SAFETY_TIMEOUT_MS)

    return () => {
      window.clearTimeout(safetyTimer)
      observer.disconnect()
      root.classList.remove('reveal-ready')
      targets.forEach((target) => target.classList.remove('reveal', 'is-visible'))
    }
  }, [routeKey])
}
