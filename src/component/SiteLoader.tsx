import { motion, useReducedMotion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

export default function SiteLoader() {
  const { t } = useTranslation()
  const reducedMotion = useReducedMotion()

  return (
    <motion.div
      className="site-loader"
      role="status"
      aria-label={t('loading.label')}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reducedMotion ? 0 : 0.35 }}
    >
      <div className="site-loader-content">
        <svg className="site-loader-mark" viewBox="0 0 64 64" fill="none" aria-hidden="true">
          <path
            className="site-loader-letter"
            d="M6 46 17 18 28 46 M10 36H24 M36 46V18H53 M36 31H49"
            pathLength="100"
          />
          <circle cx="57" cy="45" r="3" fill="#e5b900" />
        </svg>
        <div className="site-loader-track" aria-hidden="true">
          <span className="site-loader-bar" />
        </div>
      </div>
    </motion.div>
  )
}
