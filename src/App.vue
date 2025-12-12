

<template >
  <div class="app-container" >
     <Header :viewImage="viewImage" />
     <HelloWorld @viewImage="viewImage = false" />
  </div>
</template>
<script setup>
import Header from './components/Header.vue';
import HelloWorld from './components/HelloWorld.vue'
import { ref } from 'vue';

const viewImage = ref(true);
</script>
<style>
:root {
  /* --- COULEURS DU JEU (LOGIQUE) --- */
  
  /* ROUGE : Bien placé (La couleur du carré T du logo) */
  --color-correct: #D32F2F; 
  
  /* JAUNE : Mal placé (Le jaune orangé du logo, lisible avec texte blanc) */
  --color-present: #FBC02D; 
  
  /* BLEU : En attente / Sélectionné (Le bleu du logo) */
  --color-primary: #1565C0; 

  /* GRIS : Absent (Lettre testée mais pas dans le mot) */
  --color-absent: #78909C;

  /* --- COULEURS D'INTERFACE --- */
  
  /* Fond de la page (Un gris très sombre/bleuté pour faire ressortir la grille) */
  --color-background: #0F172A; 
  
  /* Fond des cases vides */
  --color-surface: #1E293B; 
  
  /* Couleur du texte (Blanc pur) */
  --color-text: #FFFFFF;
  
  /* Bordures des cases */
  --color-border: #334155;

  --bg-gradient-1: #0F172A; /* Notre base sombre */
  --bg-gradient-2: #1A237E; /* Un bleu nuit très profond */
  --bg-gradient-3: #311B92; /* Un violet sombre */
}
.app-container {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background: linear-gradient(to right, #4facfe, #00f2fe);
}

.app-container {
    /* On s'assure que ça prend toute la hauteur */
    min-height: 100vh;
    margin: 0;
    color: var(--color-text); /* Juste au cas où */
    font-family: sans-serif; /* Temporaire */

    /* LE GRADIENT MAGIQUE */
    /* Angle diagonal (-45deg) */
    background: linear-gradient(
        -45deg, 
        var(--bg-gradient-1), 
        var(--bg-gradient-2), 
        var(--bg-gradient-3), 
        var(--bg-gradient-2)
    );
    
    /* L'astuce : le fond est 4x plus grand que l'écran */
    background-size: 400% 400%;
    
    /* L'animation : nom, durée (30s = très lent), type, infini */
    animation: gradientMove 30s ease infinite;
}

/* Les étapes de l'animation */
@keyframes gradientMove {
    0% {
        background-position: 0% 50%;
    }
    50% {
        background-position: 100% 50%;
    }
    100% {
        background-position: 0% 50%;
    }
}

/* Pour être sûr que l'app Vue ne bloque pas le fond */
#app {
    min-height: 100vh;
    background: transparent;
}
</style>
