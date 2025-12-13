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
    path: '/multiplayer',
    name: 'multiplayer',
    component: () => import('../views/MultiplayerPage.vue')
  },
  {
    path: '/options',
    name: 'options',
    component: () => import('../views/OptionsPage.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router