import { createRouter, createWebHistory } from 'vue-router'
import Menu from '../components/Menu.vue'
import { SITE } from '../config/site.js'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Menu
  },
  {
    path: '/game',
    name: 'game',
    component: () => import('../views/GamePage.vue')
  },
  {
    path: '/stats',
    name: 'stats',
    component: () => import('../views/StatsPage.vue')
  },
  {
    path: '/options',
    name: 'options',
    component: () => import('../views/OptionsPage.vue')
  },
  {
    path: '/regles',
    name: 'rules',
    component: () => import('../views/RulesPage.vue'),
    meta: {
      title: 'Règles du jeu Motus/Wordle - Comment jouer à Tomus',
      description:
        'Découvrez les règles de Tomus : devinez le mot mystère en 6 essais grâce aux indices de couleur. Guide complet pour bien jouer, même pour les débutants.'
    }
  },
  {
    path: '/confidentialite',
    name: 'privacy',
    component: () => import('../views/PrivacyPage.vue'),
    meta: { title: 'Politique de confidentialité - Tomus' }
  },
  {
    path: '/mentions-legales',
    name: 'legal',
    component: () => import('../views/LegalPage.vue'),
    meta: { title: 'Mentions légales - Tomus' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  // Les liens du footer sont en bas de page : on repart en haut à chaque navigation
  scrollBehavior() {
    return { top: 0 }
  }
})

// Titre, meta description et URL canonique propres à chaque page,
// avec ceux de index.html en valeur par défaut
const defaultTitle = document.title
const descriptionTag = document.querySelector<HTMLMetaElement>('meta[name="description"]')
const defaultDescription = descriptionTag?.content ?? ''
const canonicalTag = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
const defaultCanonical = canonicalTag?.href ?? `${SITE.url}/`

router.afterEach((to) => {
  document.title = (to.meta.title as string | undefined) ?? defaultTitle
  descriptionTag?.setAttribute(
    'content',
    (to.meta.description as string | undefined) ?? defaultDescription
  )
  // Sans query ni hash ; une URL qui ne correspond à aucune route retombe sur l'accueil
  canonicalTag?.setAttribute(
    'href',
    to.matched.length ? `${SITE.url}${to.path}` : defaultCanonical
  )
})

export default router
