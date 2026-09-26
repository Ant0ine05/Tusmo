<template>
  <aside v-if="adSlot" class="ad-banner" aria-label="Publicité">
    <span class="ad-label">Publicité</span>
    <ins
      class="adsbygoogle"
      style="display: block"
      :data-ad-client="ADSENSE_CLIENT"
      :data-ad-slot="adSlot"
      data-ad-format="auto"
      data-full-width-responsive="true"
      :data-adtest="isDev ? 'on' : null"
    ></ins>
  </aside>
</template>

<script setup>
import { onMounted } from 'vue';
import { ADSENSE_CLIENT } from '../config/ads.js';

const props = defineProps({
  // ID du bloc d'annonces (voir src/config/ads.js). Sans ID, rien n'est affiché.
  adSlot: {
    type: String,
    default: ''
  }
});

// En développement, demande des annonces de test pour ne pas fausser les stats
const isDev = import.meta.env.DEV;

onMounted(() => {
  if (!props.adSlot) return;
  try {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  } catch (error) {
    // Bloqueur de pub ou script AdSense non chargé : le jeu doit continuer à fonctionner
    console.warn('AdSense indisponible :', error);
  }
});
</script>

<style scoped>
.ad-banner {
  width: 100%;
  max-width: 728px;
  margin: 2.5rem auto 1rem;
  padding: 0 0.5rem;
  box-sizing: border-box;
  overflow: hidden;
}

.ad-label {
  display: block;
  margin-bottom: 0.25rem;
  font-size: 0.65rem;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.4);
}
</style>
