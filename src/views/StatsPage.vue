<template>
  <div class="stats-wrapper">
    <div class="stats-container">
      <!-- En-tête -->
      <div class="stats-header">
        <h1><Icon icon="mdi:chart-box" width="32" height="32" /> Statistiques</h1>
      </div>

      <!-- Statistiques globales -->
      <div class="stats-overview">
        <div class="stat-card">
          <div class="stat-value">{{ stats.gamesPlayed }}</div>
          <div class="stat-label">Parties jouées</div>
        </div>
        <div class="stat-card win">
          <div class="stat-value">{{ stats.gamesWon }}</div>
          <div class="stat-label">Victoires</div>
        </div>
        <div class="stat-card lose">
          <div class="stat-value">{{ stats.gamesLost }}</div>
          <div class="stat-label">Défaites</div>
        </div>
        <div class="stat-card rate">
          <div class="stat-value">{{ stats.winRate }}%</div>
          <div class="stat-label">Taux de réussite</div>
        </div>
      </div>

      <!-- Historique des parties -->
      <div class="history-section">
        <h2><Icon icon="mdi:history" width="24" height="24" /> Historique</h2>
        
        <div v-if="stats.history.length === 0" class="no-history">
          <Icon icon="mdi:emoticon-sad-outline" width="48" height="48" />
          <p>Aucune partie jouée pour le moment.</p>
        </div>

        <div v-else class="history-list">
          <div 
            v-for="(game, index) in stats.history" 
            :key="index"
            class="history-item"
            :class="{ win: game.found, lose: !game.found }"
          >
            <div class="history-header">
              <div class="history-date">
                <Icon :icon="game.found ? 'mdi:check-circle' : 'mdi:close-circle'" width="20" height="20" />
                {{ formatDate(game.date) }}
              </div>
              <div class="history-word">{{ game.word }}</div>
            </div>
            
            <div class="history-details">
              <div class="detail-item">
                <Icon icon="mdi:counter" width="16" height="16" />
                {{ game.attempts }} essai{{ game.attempts > 1 ? 's' : '' }}
              </div>
              <button @click="toggleDetails(index)" class="btn-details">
                <Icon :icon="expandedGames.has(index) ? 'mdi:chevron-up' : 'mdi:chevron-down'" width="20" height="20" />
              </button>
            </div>

            <!-- Détails expandable -->
            <div v-if="expandedGames.has(index)" class="history-guesses">
              <div class="guesses-title">Tentatives :</div>
              <div class="guess-list">
                <div v-for="(guess, gIndex) in game.guesses" :key="gIndex" class="guess-item">
                  <span class="guess-number">{{ gIndex + 1 }}.</span>
                  <span class="guess-word">{{ guess }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';
import { store } from '../store/store.ts';

const router = useRouter();
const expandedGames = ref(new Set());

const stats = computed(() => store.getStats());

const goHome = () => {
  router.push('/'); 
};

const formatDate = (isoDate) => {
  const date = new Date(isoDate);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return `Aujourd'hui à ${date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
  } else if (diffDays === 1) {
    return `Hier à ${date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
  } else {
    return date.toLocaleDateString('fr-FR', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
};

const toggleDetails = (index) => {
  if (expandedGames.value.has(index)) {
    expandedGames.value.delete(index);
  } else {
    expandedGames.value.add(index);
  }
};

</script>

<style scoped>
/* Conteneur principal */
.stats-wrapper {
  min-height: 100vh;
  padding: 2rem 1rem;
  color: white;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.stats-container {
  max-width: 900px;
  margin: 0 auto;
  animation: fadeIn 0.5s ease;
}

/* En-tête */
.stats-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.stats-header h1 {
  font-size: 2rem;
  font-weight: 800;
  text-transform: uppercase;
  color: #ffbd00;
  text-shadow: 2px 2px 0px #c43c3c;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-back {
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 0.75rem;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-back:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

/* Statistiques globales */
.stats-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: rgba(30, 40, 90, 0.6);
  padding: 1.5rem;
  border-radius: 15px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  text-align: center;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  border-color: rgba(255, 255, 255, 0.3);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.stat-card.win {
  border-color: rgba(34, 197, 94, 0.3);
}

.stat-card.win:hover {
  border-color: rgba(34, 197, 94, 0.6);
  box-shadow: 0 10px 30px rgba(34, 197, 94, 0.2);
}

.stat-card.lose {
  border-color: rgba(239, 68, 68, 0.3);
}

.stat-card.lose:hover {
  border-color: rgba(239, 68, 68, 0.6);
  box-shadow: 0 10px 30px rgba(239, 68, 68, 0.2);
}

.stat-card.rate {
  border-color: rgba(255, 189, 0, 0.3);
}

.stat-card.rate:hover {
  border-color: rgba(255, 189, 0, 0.6);
  box-shadow: 0 10px 30px rgba(255, 189, 0, 0.2);
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 800;
  color: #ffbd00;
  margin-bottom: 0.5rem;
}

.stat-card.win .stat-value {
  color: #22c55e;
}

.stat-card.lose .stat-value {
  color: #ef4444;
}

.stat-label {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Section historique */
.history-section {
  background: rgba(30, 40, 90, 0.4);
  padding: 2rem;
  border-radius: 15px;
  border: 2px solid rgba(255, 255, 255, 0.1);
}

.history-section h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffbd00;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Pas d'historique */
.no-history {
  text-align: center;
  padding: 3rem 1rem;
  color: rgba(255, 255, 255, 0.6);
}

.no-history p {
  margin: 1rem 0 2rem;
  font-size: 1.1rem;
}

.btn-play {
  background: linear-gradient(90deg, #d92b2b, #f5a623);
  border: none;
  color: white;
  padding: 0.75rem 2rem;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.btn-play:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(217, 43, 43, 0.4);
}

/* Liste historique */
.history-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.history-item {
  background: rgba(15, 21, 69, 0.5);
  padding: 1.25rem;
  border-radius: 12px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  transition: all 0.2s ease;
}

.history-item:hover {
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateX(5px);
}

.history-item.win {
  border-left: 4px solid #22c55e;
}

.history-item.lose {
  border-left: 4px solid #ef4444;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.history-date {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
}

.history-item.win .history-date {
  color: #22c55e;
}

.history-item.lose .history-date {
  color: #ef4444;
}

.history-word {
  font-size: 1.25rem;
  font-weight: 800;
  color: #ffbd00;
  letter-spacing: 2px;
}

.history-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
}

.btn-details {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  padding: 0.25rem;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
}

.btn-details:hover {
  color: rgba(255, 255, 255, 0.9);
}

/* Détails des tentatives */
.history-guesses {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  animation: slideDown 0.3s ease;
}

.guesses-title {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 0.75rem;
}

.guess-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.guess-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: rgba(0, 0, 0, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 8px;
}

.guess-number {
  color: rgba(255, 189, 0, 0.7);
  font-weight: 600;
  min-width: 25px;
}

.guess-word {
  color: white;
  font-weight: 600;
  letter-spacing: 1px;
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideDown {
  from { opacity: 0; max-height: 0; }
  to { opacity: 1; max-height: 500px; }
}

/* Responsive */
@media (max-width: 768px) {
  .stats-header h1 {
    font-size: 1.5rem;
  }

  .stats-overview {
    grid-template-columns: repeat(2, 1fr);
  }

  .history-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .history-word {
    font-size: 1.1rem;
  }
}
</style>