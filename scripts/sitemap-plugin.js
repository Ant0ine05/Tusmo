import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { SITE } from '../src/config/site.js'

const ROOT = fileURLToPath(new URL('..', import.meta.url))

// Pages du sitemap, avec les fichiers dont dépend leur contenu : la date <lastmod> d'une
// page est celle du dernier commit qui touche l'un de ces fichiers.
const PAGES = [
  { path: '/', sources: ['src/components/Menu.vue', 'src/components/Logo.vue'] },
  {
    path: '/game',
    sources: ['src/views/GamePage.vue', 'src/components/GameGrid.vue', 'src/components/Keyboard.vue']
  },
  { path: '/regles', sources: ['src/views/RulesPage.vue'] },
  { path: '/confidentialite', sources: ['src/views/PrivacyPage.vue', 'src/config/site.js'] },
  { path: '/mentions-legales', sources: ['src/views/LegalPage.vue', 'src/config/site.js'] }
]

const git = (...args) =>
  execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim()

// AAAA-MM-JJ du dernier commit touchant ces fichiers, ou null quand git ne peut pas la donner
// de façon fiable. Un clone partiel donnerait la même date à toutes les pages : mieux vaut
// omettre <lastmod> que d'en publier une fausse, que Google finirait par ignorer.
function lastModified(sources) {
  try {
    if (git('rev-parse', '--is-shallow-repository') === 'true') return null
    return git('log', '-1', '--format=%cI', '--', ...sources).slice(0, 10) || null
  } catch {
    return null
  }
}

// Génère sitemap.xml au build, avec un <lastmod> issu de l'historique git
export default function sitemapPlugin() {
  return {
    name: 'tomus-sitemap',
    apply: 'build',
    generateBundle() {
      const urls = PAGES.map(({ path, sources }) => {
        const lastmod = lastModified(sources)
        if (!lastmod) this.warn(`sitemap : pas de <lastmod> pour ${path} (historique git indisponible ou partiel)`)
        return [
          '  <url>',
          `    <loc>${SITE.url}${path}</loc>`,
          lastmod ? `    <lastmod>${lastmod}</lastmod>` : null,
          '  </url>'
        ]
          .filter(Boolean)
          .join('\n')
      })

      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`
      })
    }
  }
}
