import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { sites } from '@openai/sites-vite-plugin'

export default defineConfig(async () => {
  const { cloudflare } = await import('@cloudflare/vite-plugin')
  const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? 'Portfolio'

  return {
    base: process.env.GITHUB_ACTIONS ? `/${repositoryName}/` : '/',
    plugins: [
      react(),
      sites(),
      cloudflare({
        config: {
          main: 'worker/index.js',
          compatibility_date: '2026-08-28',
          assets: {
            binding: 'ASSETS',
            not_found_handling: 'single-page-application',
          },
        },
      }),
    ],
  }
})
