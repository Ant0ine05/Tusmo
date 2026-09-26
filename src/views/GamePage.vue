<template>
  <main>
    <!-- Le logo est le titre visuel de la page ; le texte masqué donne son sujet au h1 -->
    <h1 class="site-title">
      <Logo size="small" class="logo" aria-hidden="true" />
      <span class="sr-only">{{ heading }}</span>
    </h1>
    <p v-if="isDaily" class="mode-label">Mot du jour · {{ dayLabel }}</p>
    <br v-else>
    <!-- Modal Victoire/Défaite -->
    <div v-if="store.gameStatus !== 'playing'" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>

        <!-- Victoire -->
        <div v-if="store.gameStatus === 'won'" class="modal-win">
          <div class="modal-icon"><Icon icon="mdi:party-popper" width="48" height="48" /></div>
          <h2>BRAVO !</h2>
          <p>Tu as trouvé le mot en <strong>{{ store.guesses.length }}</strong> essai{{ store.guesses.length > 1 ? 's' : '' }} !</p>
          <div class="modal-word">{{ store.target }}</div>
        </div>

        <!-- Défaite -->
        <div v-else-if="store.gameStatus === 'lost'" class="modal-lose">
          <!-- <div class="modal-icon"><Icon icon="mdi:close-circle" width="48" height="48" /></div> -->
          <h2>PERDU !</h2>
          <p>Le mot était :</p>
          <div class="modal-word">{{ store.target }}</div>
        </div>

        <!-- Mot du jour : série et prochain mot -->
        <div v-if="isDaily" class="daily-info">
          <p v-if="store.gameStatus === 'won'" class="daily-streak">
            <Icon icon="mdi:fire" width="24" height="24" />
            Série : <strong>{{ streak.current }}</strong> jour{{ streak.current > 1 ? 's' : '' }}
            <span class="daily-record">· Record : {{ streak.max }}</span>
          </p>
          <p v-else class="daily-streak">Série interrompue. Un nouveau mot vous attend demain !</p>

          <p v-if="dayChanged">
            <button @click="loadNewDaily" class="btn-restart primary">Voir le nouveau mot du jour</button>
          </p>
          <p v-else class="daily-next">Prochain mot dans <strong>{{ countdown }}</strong></p>
        </div>

        <div class="modal-actions">
          <button v-if="isDaily" @click="$router.push('/game')" class="btn-restart primary">
            <Icon icon="mdi:play" width="24" height="24" /> Partie libre
          </button>
          <button v-else @click="store.resetGame()" class="btn-restart primary">
            <Icon icon="mdi:restart" width="24" height="24" /> {{ store.gameStatus === 'won' ? 'Rejouer' : 'Réessayer' }}
          </button>
          <button @click="$router.replace('/')" class="btn-restart secondary">
            <Icon icon="line-md:home" width="24" height="24"/>
          </button>
        </div>

      </div>
    </div>
    <GameGrid 
      @win="store.handleWin"
      @lose="store.handleLose"
    />
    <Keyboard />
    <AdBanner :ad-slot="AD_SLOTS.game" />
  </main>
</template>

<script setup>
import { Icon } from '@iconify/vue';
import GameGrid from '../components/GameGrid.vue';
import Keyboard from '../components/Keyboard.vue';
import Logo from '../components/Logo.vue';
import AdBanner from '../components/AdBanner.vue';
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { store } from '../store/store.ts';
import { formatDay, secondsUntilNextDay, todayParis } from '../store/daily.ts';
import { AD_SLOTS } from '../config/ads.js';

// 'free' : mot tiré au hasard (/game) ; 'daily' : mot du jour (/mot-du-jour)
const props = defineProps({
  mode: {
    type: String,
    default: 'free'
  }
});

const isDaily = computed(() => props.mode === 'daily');
const heading = computed(() =>
  isDaily.value
    ? 'Tomus : le mot du jour à deviner en 6 essais, le même pour tous les joueurs'
    : 'Tomus : devinez le mot mystère en 6 essais'
);
const dayLabel = computed(() => formatDay(store.dailyDate || todayParis()));
const streak = computed(() => store.getDailyStreak());

// Compte à rebours jusqu'au prochain mot (minuit, heure de Paris)
const secondsLeft = ref(secondsUntilNextDay());
const dayChanged = ref(false);
const countdown = computed(() => {
  const pad = (n) => String(n).padStart(2, '0');
  const s = secondsLeft.value;
  return `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`;
});

let timer;
const tick = () => {
  if (!isDaily.value) return;
  secondsLeft.value = secondsUntilNextDay();
  // La page est restée ouverte après minuit : un nouveau mot est disponible
  dayChanged.value = store.dailyDate !== '' && store.dailyDate !== todayParis();
};

const closeModal = () => {
  // Optionnel : fermer la modal en cliquant sur l'overlay
};

const start = () => (isDaily.value ? store.startDaily() : store.initGame());

const loadNewDaily = async () => {
  dayChanged.value = false;
  await store.startDaily();
};

onMounted(async () => {
  await start();
  window.addEventListener('keydown', store.handleKeydown);
  timer = setInterval(tick, 1000);
});

// /game et /mot-du-jour partagent ce composant : passer de l'un à l'autre ne le recrée pas
watch(() => props.mode, () => {
  dayChanged.value = false;
  start();
});

onUnmounted(() => {
  window.removeEventListener('keydown', store.handleKeydown);
  clearInterval(timer);
});
</script>

<style scoped>
/* Modal Overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.modal-content {
  background: linear-gradient(145deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.98));
  border: 3px solid rgba(255, 255, 255, 0.2);
  border-radius: 24px;
  padding: 3rem 2.5rem;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  animation: slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: center;
}

.modal-icon {
  font-size: 5rem;
  margin-bottom: 1rem;
  animation: bounce 0.6s ease;
}

.modal-win h2 {
  color: #4CAF50;
  font-size: 2.5rem;
  margin: 0 0 1rem 0;
  text-shadow: 0 0 20px rgba(76, 175, 80, 0.5);
}

.modal-lose h2 {
  color: #EF5350;
  font-size: 2.5rem;
  margin: 0 0 1rem 0;
  text-shadow: 0 0 20px rgba(239, 83, 80, 0.5);
}

.modal-content p {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.2rem;
  margin: 1rem 0;
}

.modal-word {
  font-size: 2.5rem;
  font-weight: 900;
  letter-spacing: 8px;
  margin: 2rem 0;
  padding: 1rem 2rem;
  background: rgba(21, 101, 192, 0.2);
  border: 2px solid rgba(21, 101, 192, 0.5);
  border-radius: 12px;
  color: #64B5F6;
  text-shadow: 0 0 15px rgba(100, 181, 246, 0.5);
}

.modal-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  justify-content: center;
}

/* Mot du jour : indication du mode sous le logo, puis série et compte à rebours dans la modale */
.mode-label {
  margin: 0.6rem 0 1rem;
  font-size: 1rem;
  font-weight: 800;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #ffbd00;
}

.daily-info {
  margin-top: 1.5rem;
}

.daily-info .daily-streak {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.4rem;
  color: #ffbd00;
  font-weight: 600;
}

.daily-record {
  color: rgba(255, 255, 255, 0.6);
  font-weight: 400;
}

.daily-info .daily-next {
  font-size: 1rem;
}

.daily-info .btn-restart {
  margin: 0 auto;
  max-width: none;
}

.btn-restart {
  padding: 1rem 2rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  flex: 1;
  max-width: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-restart.primary {
  background: linear-gradient(145deg, rgba(76, 175, 80, 0.4), rgba(56, 142, 60, 0.6));
  color: white;
  border-color: #4CAF50;
}

.btn-restart.primary:hover {
  background: linear-gradient(145deg, rgba(76, 175, 80, 0.6), rgba(56, 142, 60, 0.8));
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 8px 20px rgba(76, 175, 80, 0.4);
}

.btn-restart.secondary {
  background: rgba(21, 101, 192, 0.3);
  color: white;
  border-color: rgba(255, 255, 255, 0.3);
}

.btn-restart.secondary:hover {
  background: rgba(21, 101, 192, 0.5);
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 8px 20px rgba(21, 101, 192, 0.4);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(50px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

main {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem 1rem 0 1rem;
  min-height: calc(100vh - 100px);
}

/* Le h1 ne contient que le logo : aucune marge ni taille de police en plus */
.site-title {
  margin: 0;
  font-size: inherit;
}

.logo-area {
  width: 30%;
  aspect-ratio: 30 / 9;
  object-fit: cover;
}

.instructions {
  text-align: center;
  margin-top: 2rem;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
}

.instructions p {
  margin: 0.3rem 0;
}

.input-test {
  text-align: center;
  margin-top: 2rem;
  color: white;
  display: flex;
  gap: 1rem;
  align-items: center;
}

.input-test input {
  padding: 0.5rem 1rem;
  font-size: 1.2rem;
  text-transform: uppercase;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: rgba(21, 101, 192, 0.2);
  color: white;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.input-test input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 20px rgba(21, 101, 192, 0.5);
}

.input-test button {
  padding: 0.5rem 1.5rem;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  background: rgba(21, 101, 192, 0.3);
  color: white;
  cursor: pointer;
  font-weight: 600;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.input-test button:hover {
  background: rgba(21, 101, 192, 0.5);
  transform: scale(1.05);
}
@media (max-width: 768px) {
  .modal-content {
    padding: 2.5rem 2rem;
  }

  .modal-word {
    font-size: 2rem;
    letter-spacing: 6px;
    padding: 0.8rem 1.5rem;
  }
  main{
    padding: 1rem 0.5rem 0 0.5rem;
  }
}
@media (max-width: 480px) {
  .modal-content {
    padding: 2rem 1.5rem;
  }

  .modal-word {
    font-size: 2rem;
    letter-spacing: 6px;
    padding: 0.8rem 1.5rem;
  }
  main{
    padding: 1rem 0.5rem 0 0.5rem;
  }
}
</style>