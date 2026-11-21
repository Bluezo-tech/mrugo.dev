import { useEffect, useLayoutEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import SiteFooter from './SiteFooter'
import SiteHeader from './SiteHeader'
import useScrollReveal from '../hooks/useScrollReveal'
import CmsBridge from './CmsBridge'
import CmsBlocks from './CmsBlocks'
import SiteDesignBridge from './SiteDesignBridge'
import SupportNudge from './SupportNudge'
import NotFound from '../pages/NotFound'
import { loadHiddenPages } from '../lib/cmsPages'

function Layout() {
  const { pathname, hash } = useLocation()
  const [hiddenPages, setHiddenPages] = useState<string[]>([])

  useEffect(() => {
    let active = true
    void loadHiddenPages().then((paths) => { if (active) setHiddenPages(paths) }).catch(() => {})
    return () => { active = false }
  }, [pathname])

  useScrollReveal(pathname)

  // Hash links like /#skills must scroll after the page has rendered, and a
  // normal route change should start at the top.
  useLayoutEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: 'auto' })
      return
    }

    const target = document.getElementById(hash.slice(1))
    if (target) {
      target.scrollIntoView({ behavior: 'instant', block: 'start' })
    } else {
      window.scrollTo({ top: 0, behavior: 'auto' })
    }
  }, [pathname, hash])

  return (
    <>
      <SiteHeader />
      {hiddenPages.includes(pathname) ? <NotFound /> : <><CmsBlocks slot="before" /><Outlet /><CmsBlocks slot="after" /></>}
      <SiteFooter />
      <CmsBridge />
      <SiteDesignBridge />
      <SupportNudge />
    </>
  )
}

export default Layout
