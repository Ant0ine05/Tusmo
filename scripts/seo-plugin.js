import { PAGES, seoFor } from '../src/config/seo.js'

const escapeAttr = (value) =>
  value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

// Réécrit dans le HTML les balises décrites par src/config/seo.js pour cette page.
// Échoue si une balise manque : mieux vaut un build cassé qu'une page au mauvais aperçu.
function applySeo(html, path) {
  const { title, description, shareTitle, shareDescription, url } = seoFor(path)

  const set = (pattern, value) => {
    if (!pattern.test(html)) throw new Error(`seo : balise introuvable dans index.html (${pattern})`)
    html = html.replace(pattern, (_, before, after) => `${before}${escapeAttr(value)}${after}`)
  }

  set(/(<title>)[^<]*(<\/title>)/, title)
  set(/(<meta name="description" content=")[^"]*(">)/, description)
  set(/(<link rel="canonical" href=")[^"]*(">)/, url)
  set(/(<meta property="og:url" content=")[^"]*(">)/, url)
  set(/(<meta property="og:title" content=")[^"]*(">)/, shareTitle)
  set(/(<meta property="og:description" content=")[^"]*(">)/, shareDescription)
  set(/(<meta name="twitter:title" content=")[^"]*(">)/, shareTitle)
  set(/(<meta name="twitter:description" content=")[^"]*(">)/, shareDescription)
  return html
}

// Balises propres à chaque page, dès le HTML servi (sans attendre le JavaScript) :
//  - index.html prend celles de l'accueil ;
//  - chaque autre page reçoit sa copie, /mot-du-jour.html pour /mot-du-jour. Cloudflare
//    sert /mot-du-jour depuis ce fichier ; sur un hébergeur qui ne le fait pas, la page retombe
//    sur index.html et le routeur met les balises à jour comme avant.
export default function seoPlugin() {
  return {
    name: 'tomus-seo',

    transformIndexHtml(html) {
      return applySeo(html, '/')
    },

    // Après Vite, qui n'ajoute index.html au bundle (avec ses scripts et feuilles de style) qu'à ce stade
    generateBundle: {
      order: 'post',
      handler(_, bundle) {
        const index = bundle['index.html']
        if (!index || typeof index.source !== 'string') {
          this.error("seo : index.html introuvable dans le bundle, pages statiques non générées")
        }

        for (const path of Object.keys(PAGES)) {
          if (path === '/') continue
          this.emitFile({
            type: 'asset',
            fileName: `${path.slice(1)}.html`,
            source: applySeo(index.source, path)
          })
        }
      }
    }
  }
}
