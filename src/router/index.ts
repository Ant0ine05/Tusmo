import { createRouter, createWebHistory } from 'vue-router'
import Menu from '../components/Menu.vue'
import { seoFor } from '../config/seo.js'

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
    path: '/mot-du-jour',
    name: 'daily',
    component: () => import('../views/GamePage.vue'),
    props: { mode: 'daily' }
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
    component: () => import('../views/RulesPage.vue')
  },
  {
    path: '/confidentialite',
    name: 'privacy',
    component: () => import('../views/PrivacyPage.vue')
  },
  {
    path: '/mentions-legales',
    name: 'legal',
    component: () => import('../views/LegalPage.vue')
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

// Balises <head> propres à chaque page (voir src/config/seo.js). Le HTML servi les contient déjà
// pour la page d'arrivée ; on les remet à jour quand on navigue d'une page à l'autre.
const tag = (selector: string) => document.head.querySelector<HTMLElement>(selector)
const setContent = (selector: string, value: string) => tag(selector)?.setAttribute('content', value)

router.afterEach((to) => {
  // Une URL qui ne correspond à aucune route retombe sur l'accueil
  const seo = seoFor(to.matched[0]?.path ?? '/')

  document.title = seo.title
  setContent('meta[name="description"]', seo.description)
  tag('link[rel="canonical"]')?.setAttribute('href', seo.url)
  setContent('meta[property="og:url"]', seo.url)
  setContent('meta[property="og:title"]', seo.shareTitle)
  setContent('meta[property="og:description"]', seo.shareDescription)
  setContent('meta[name="twitter:title"]', seo.shareTitle)
  setContent('meta[name="twitter:description"]', seo.shareDescription)
})

export default router
