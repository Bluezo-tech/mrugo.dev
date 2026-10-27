import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import SiteFooter from './SiteFooter'
import SiteHeader from './SiteHeader'
import useScrollReveal from '../hooks/useScrollReveal'

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function Layout() {
  const { pathname, hash } = useLocation()

  useScrollReveal(pathname)

  // Hash links like /#skills must scroll after the page has rendered, and a
  // normal route change should start at the top.
  useEffect(() => {
    const behavior: ScrollBehavior = prefersReducedMotion() ? 'auto' : 'smooth'

    if (!hash) {
      window.scrollTo({ top: 0, behavior: 'auto' })
      return
    }

    const frame = window.requestAnimationFrame(() => {
      const target = document.getElementById(hash.slice(1))
      if (target) {
        target.scrollIntoView({ behavior, block: 'start' })
      } else {
        window.scrollTo({ top: 0, behavior })
      }
    })

    return () => window.cancelAnimationFrame(frame)
  }, [pathname, hash])

  return (
    <>
      <SiteHeader />
      <Outlet />
      <SiteFooter />
    </>
  )
}

export default Layout
