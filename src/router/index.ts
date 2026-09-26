import { createRouter, createWebHistory } from 'vue-router'
import Menu from '../components/Menu.vue'

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
    meta: { title: 'Règles du jeu - Tomus' }
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

// Titre propre à chaque page, avec le titre de index.html en valeur par défaut
const defaultTitle = document.title
router.afterEach((to) => {
  document.title = (to.meta.title as string | undefined) ?? defaultTitle
})

export default router
