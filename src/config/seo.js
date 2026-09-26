import { SITE } from './site.js'

// Balises <head> propres à chaque page. Source unique pour :
//  - le routeur, qui les met à jour à chaque navigation ;
//  - scripts/seo-plugin.js, qui les écrit dans le HTML au build (index.html pour l'accueil,
//    un fichier statique par page pour les autres). Les robots des réseaux sociaux n'exécutent
//    pas le JavaScript : ils lisent les balises og:* telles qu'elles sont dans le fichier.
//
// title / description : résultats Google (title 50-60 caractères, description 160 au plus).
// shareTitle / shareDescription : cartes de partage (og:*, twitter:*) ; par défaut, les mêmes.
export const PAGES = {
  '/': {
    title: 'Tomus - Jeu de mots gratuit en ligne (Style Motus/Wordle)',
    description:
      'Jouez à Tomus : le jeu de mots gratuit en ligne inspiré de Motus et Wordle. Devinez le mot caché du jour en 6 essais. Testez votre vocabulaire dès maintenant !',
    shareTitle: 'Tomus - Le mot du jour',
    shareDescription: "J'ai trouvé le mot du jour ! Viens essayer de me battre."
  },
  '/game': {
    title: 'Jouer à Tomus - Motus/Wordle gratuit en ligne',
    description:
      'Jouez gratuitement à Tomus, sans inscription : trouvez le mot mystère en 6 essais grâce aux indices de couleur. Enchaînez les parties dans votre navigateur.',
    shareTitle: 'Tomus - Jeu de mots gratuit',
    shareDescription: 'Trouve le mot mystère en 6 essais ! Viens jouer, sans inscription.'
  },
  '/mot-du-jour': {
    title: 'Mot du jour Motus/Wordle gratuit : jouez chaque jour - Tomus',
    description:
      'Le mot du jour Tomus : le même mot pour tous, 6 essais pour le trouver. Gagnez chaque jour pour garder votre série. Nouveau mot chaque jour à minuit.',
    shareTitle: 'Tomus - Le mot du jour',
    shareDescription: 'Le même mot pour tous les joueurs, 6 essais pour le trouver. Viens essayer de me battre !'
  },
  '/regles': {
    title: 'Règles du jeu Motus/Wordle - Comment jouer à Tomus',
    description:
      'Découvrez les règles de Tomus : devinez le mot mystère en 6 essais grâce aux indices de couleur. Guide complet pour bien jouer, même pour les débutants.'
  },
  // Pages sans description propre : celle de l'accueil est reprise
  '/confidentialite': { title: 'Politique de confidentialité - Tomus' },
  '/mentions-legales': { title: 'Mentions légales - Tomus' }
}

// Balises d'une page. Une page sans entrée (statistiques, options) reprend les textes de
// l'accueil mais garde sa propre URL.
export function seoFor(path) {
  const home = PAGES['/']
  const url = `${SITE.url}${path}`
  const page = PAGES[path]
  if (!page) return { ...home, url }

  const description = page.description ?? home.description
  return {
    title: page.title,
    description,
    shareTitle: page.shareTitle ?? page.title,
    shareDescription: page.shareDescription ?? description,
    url
  }
}
