<template>
  <div class="construction-wrapper">
    <div class="card">
      <div class="icon-container">
        <span class="icon">🚧</span>
      </div>

      <h1>Page en construction</h1>
      
      <p>
        Cette partie de <strong>TOMUS</strong> n'est pas encore prête.<br>
        On empile les briques de code en ce moment même.
      </p>

      <div class="loading-bar">
        <div class="progress"></div>
      </div>

      <button @click="goHome" class="home-btn">
        Retour au jeu
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goHome = () => {
  router.push('/'); 
};
</script>

<style scoped>
/* 1. LE FOND : Le même bleu profond que votre jeu */
.construction-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  /* C'est le bleu exact de votre background TOMUS */
  color: white;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  padding: 20px;
}

/* 2. LA CARTE : Style similaire à votre modal "Perdu" mais en bleu/neutre */
.card {
  text-align: center;
  background: rgba(30, 40, 90, 0.6); /* Un bleu légèrement plus clair et transparent */
  padding: 3rem;
  border-radius: 15px;
  /* Bordure subtile pour rappeler les tuiles */
  border: 2px solid rgba(255, 255, 255, 0.1); 
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  max-width: 500px;
  width: 100%;
  backdrop-filter: blur(5px); /* Flou derrière la carte */
  animation: fadeIn 0.6s ease-out;
}

.icon {
  font-size: 4rem;
  display: inline-block;
  animation: bounce 2s infinite;
}

/* 3. TITRE : Le Jaune/Orange des tuiles TOMUS */
h1 {
  font-size: 2rem;
  margin: 20px 0 10px;
  font-weight: 800; /* Plus gras pour faire "Logo" */
  text-transform: uppercase;
  color: #ffbd00; /* Jaune orangé */
  text-shadow: 2px 2px 0px #c43c3c; /* Petit effet 3D rouge comme les tuiles */
}

p {
  color: #e0e0e0;
  line-height: 1.6;
  margin-bottom: 30px;
  font-size: 1.1rem;
}

/* 4. BARRE DE CHARGEMENT : Dégradé Rouge -> Orange (Couleurs Logo) */
.loading-bar {
  width: 100%;
  height: 8px;
  background: rgba(0, 0, 0, 0.3); /* Fond sombre */
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 30px;
}

.progress {
  height: 100%;
  width: 50%;
  /* Dégradé du Rouge (T) vers le Jaune (S) */
  background: linear-gradient(90deg, #d92b2b, #f5a623); 
  border-radius: 10px;
  animation: loading 2s infinite ease-in-out;
}

/* 5. BOUTON : Style "Ghost" blanc simple et efficace */
.home-btn {
  background: transparent;
  border: 2px solid rgba(255, 255, 255, 0.5);
  color: white;
  padding: 12px 30px;
  font-size: 1rem;
  border-radius: 8px; /* Coins un peu moins ronds pour coller aux tuiles carrées */
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.home-btn:hover {
  background: white;
  color: #0f1545;
  border-color: white;
  transform: translateY(-2px);
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
  40% {transform: translateY(-15px);}
  60% {transform: translateY(-7px);}
}

@keyframes loading {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(200%); }
}
</style>