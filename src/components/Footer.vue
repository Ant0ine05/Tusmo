<template>
  <footer class="site-footer">
    <nav class="footer-links" aria-label="Informations">
      <router-link to="/regles">Règles du jeu</router-link>
      <router-link to="/confidentialite">Confidentialité</router-link>
      <router-link to="/mentions-legales">Mentions légales</router-link>
    </nav>
    <p class="footer-copy">© {{ year }} {{ SITE.name }} · Jeu de mots gratuit</p>
  </footer>
</template>

<script setup>
import { SITE } from '../config/site.js';

const year = new Date().getFullYear();
</script>

<style scoped>
.site-footer {
  margin-top: auto;
  padding: 2rem 1rem 1.5rem;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.85rem;
}

.footer-links {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem 1.5rem;
}

.footer-links a {
  color: rgba(255, 255, 255, 0.75);
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer-links a:hover {
  color: #ffbd00;
  text-decoration: underline;
}

.footer-copy {
  margin: 0.75rem 0 0;
}
</style>
