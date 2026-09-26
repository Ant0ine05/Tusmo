<template>
  <div class="menu">
    <!-- Le logo est le titre visuel de la page ; le texte masqué donne son sujet au h1 -->
    <h1 class="site-title">
      <Logo size="small" class="logo" aria-hidden="true" />
      <span class="sr-only">Tomus, le jeu de mots gratuit en ligne inspiré de Motus et Wordle</span>
    </h1>
    <nav aria-label="Menu principal">
      <div class="button_grid">
        <div class="button-wrapper">
          <router-link to="/game" class="menu-button">Jouer</router-link>
        </div>
        <div class="button-wrapper">
          <router-link to="/stats" class="menu-button">Stats</router-link>
          <span class="new-badge">NEW</span>
        </div>
        <div class="button-wrapper">
          <router-link to="/options" class="menu-button">Options</router-link>
          <span class="new-badge">NEW</span>
        </div>
        <div class="button-wrapper">
          <router-link to="/regles" class="menu-button">Règles</router-link>
        </div>
      </div>
    </nav>
  </div>
</template>
<script setup>
import { onMounted } from 'vue';
import Logo from './Logo.vue';

onMounted(() => {
  // console.log('HelloWorld component mounted');
});
</script>
<style scoped>
/* Même décalage que le <main> de la page de jeu : le logo reste à la même place
   quand on passe de l'accueil au jeu */
.menu {
  padding-top: 0.5rem;
}

@media (max-width: 768px) {
  .menu {
    padding-top: 1rem;
  }
}

/* Le h1 ne contient que le logo : aucune marge ni taille de police en plus */
.site-title {
  margin: 0;
  font-size: inherit;
}

.hello-world {
  text-align: center;
  margin-top: 2rem;
}
.button_grid {
  display: grid;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}

.button-wrapper {
  position: relative;
  display: inline-block;
  width: 100%;
}

.button-wrapper .menu-button {
  display: block;
  box-sizing: border-box;
  width: 100%;
  text-decoration: none;
}

.new-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: linear-gradient(135deg, #d92b2b, #f5a623);
  color: white;
  font-size: 0.7rem;
  font-weight: 800;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 2px 10px rgba(217, 43, 43, 0.5);
  animation: pulse 2s infinite;
  z-index: 10;
  pointer-events: none;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 2px 10px rgba(217, 43, 43, 0.5);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 4px 15px rgba(217, 43, 43, 0.7);
  }
}

.menu-button {
  padding: 1rem 2rem;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  background: rgba(21, 101, 192, 0.2);
  backdrop-filter: blur(10px);
  color: var(--color-text);
  cursor: pointer;
  font-size: 2rem;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  
  /* Effet glassmorphism */
  box-shadow: 
    0 8px 32px rgba(21, 101, 192, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

/* Effet de brillance au survol */
.menu-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.menu-button:hover {
  background: rgba(21, 101, 192, 0.4);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px) scale(1.02);
  box-shadow: 
    0 12px 48px rgba(21, 101, 192, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.menu-button:hover::before {
  left: 100%;
}

.menu-button:active {
  transform: translateY(0) scale(0.98);
  box-shadow: 
    0 4px 16px rgba(21, 101, 192, 0.3),
    inset 0 2px 4px rgba(0, 0, 0, 0.2);
}
</style>