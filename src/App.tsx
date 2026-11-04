import './App.css'
import { useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import SiteLoader from './component/SiteLoader'
import Banner from './pages/banner'
//import Skills from './pages/skills'
import Formation from './pages/formation'
import KnowMe from './pages/knowme'
import Skill from './pages/skillpill'
import Projects from './pages/projects'

function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    let minimumElapsed = false
    let assetsReady = false

    const finish = () => {
      if (!cancelled && minimumElapsed && assetsReady) setLoading(false)
    }
    const onLoad = () => {
      void document.fonts.ready.then(() => {
        assetsReady = true
        finish()
      })
    }
    const minimumTimer = window.setTimeout(() => {
      minimumElapsed = true
      finish()
    }, 650)
    // Always release the page even if a remote resource fails to finish.
    const fallbackTimer = window.setTimeout(() => setLoading(false), 8000)

    if (document.readyState === 'complete') onLoad()
    else window.addEventListener('load', onLoad, { once: true })

    return () => {
      cancelled = true
      window.removeEventListener('load', onLoad)
      window.clearTimeout(minimumTimer)
      window.clearTimeout(fallbackTimer)
    }
  }, [])

  useEffect(() => {
    if (!loading) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previousOverflow }
  }, [loading])

  return (
    <>
      <AnimatePresence>{loading && <SiteLoader key="site-loader" />}</AnimatePresence>
      <div inert={loading} aria-busy={loading}>
      <Banner />
      <Projects />
      <Skill />
      <Formation />
      <KnowMe />
      </div>
    </>
  )
}

export default App
