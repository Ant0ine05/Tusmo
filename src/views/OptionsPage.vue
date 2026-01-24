<template>
  <div class="options-wrapper">
    <div class="options-container">
      <!-- En-tête -->
      <div class="options-header">
        <h1><Icon icon="mdi:cog" width="32" height="32" /> Options</h1>
      </div>

      <!-- Paramètres -->
      <div class="settings-section">
        
        <!-- Volume musique -->
        <div class="setting-item">
          <div class="setting-header">
            <div class="setting-label">
              <Icon icon="mdi:volume-high" width="24" height="24" />
              <span>Volume de la musique</span>
            </div>
            <span class="setting-value">{{ settings.musicVolume }}%</span>
          </div>
          <div class="slider-container">
            <input 
              type="range" 
              min="0" 
              max="100" 
              v-model.number="settings.musicVolume"
              @input="updateVolume"
              class="slider"
            />
            <div class="slider-track" :style="{ width: settings.musicVolume + '%' }"></div>
          </div>
        </div>

        <!-- Sons activés -->
        <div class="setting-item">
          <div class="setting-header">
            <div class="setting-label">
              <Icon :icon="settings.soundEnabled ? 'mdi:volume-high' : 'mdi:volume-off'" width="24" height="24" />
              <span>Sons du jeu</span>
            </div>
            <button 
              @click="toggleSound" 
              class="toggle-btn"
              :class="{ active: settings.soundEnabled }"
            >
              <div class="toggle-slider"></div>
            </button>
          </div>
        </div>

        <!-- Longueur des mots -->
        <div class="setting-item">
          <div class="setting-header">
            <div class="setting-label">
              <Icon icon="mdi:format-letter-case" width="24" height="24" />
              <span>Longueur des mots</span>
            </div>
            <span class="setting-value">{{ settings.minWordLength }} - {{ settings.maxWordLength }} lettres</span>
          </div>
          
          <div class="word-length-controls">
            <div class="length-control">
              <label>Minimum</label>
              <div class="slider-container">
                <input 
                  type="range" 
                  min="5" 
                  max="8" 
                  v-model.number="settings.minWordLength"
                  @input="updateMinLength"
                  class="slider"
                />
                <div class="slider-track" :style="{ width: ((settings.minWordLength - 5) / 3) * 100 + '%' }"></div>
              </div>
              <div class="length-markers">
                <span>5</span>
                <span>6</span>
                <span>7</span>
                <span>8</span>
              </div>
            </div>

            <div class="length-control">
              <label>Maximum</label>
              <div class="slider-container">
                <input 
                  type="range" 
                  min="5" 
                  max="8" 
                  v-model.number="settings.maxWordLength"
                  @input="updateMaxLength"
                  class="slider"
                />
                <div class="slider-track" :style="{ width: ((settings.maxWordLength - 5) / 3) * 100 + '%' }"></div>
              </div>
              <div class="length-markers">
                <span>5</span>
                <span>6</span>
                <span>7</span>
                <span>8</span>
              </div>
            </div>
          </div>

          <div v-if="settings.minWordLength > settings.maxWordLength" class="warning">
            <Icon icon="mdi:alert" width="20" height="20" />
            Le minimum ne peut pas être supérieur au maximum
          </div>
        </div>

        <!-- Thème (à venir) -->
        <div class="setting-item disabled">
          <div class="setting-header">
            <div class="setting-label">
              <Icon icon="mdi:theme-light-dark" width="24" height="24" />
              <span>Thème</span>
              <span class="coming-soon">Bientôt disponible</span>
            </div>
          </div>
        </div>

      </div>

      <!-- Zone dangereuse -->
      <div class="danger-zone">
        <h2><Icon icon="mdi:alert-octagon" width="24" height="24" /> Zone dangereuse</h2>
        
        <div class="danger-item">
          <div class="danger-info">
            <div class="danger-title">Réinitialiser les statistiques</div>
            <div class="danger-desc">Efface toutes les statistiques et l'historique des parties</div>
          </div>
          <button @click="confirmResetStats" class="btn-danger">
            <Icon icon="mdi:delete-forever" width="20" height="20" />
            Réinitialiser
          </button>
        </div>
      </div>

      <!-- Modal de confirmation -->
      <div v-if="showConfirmModal" class="modal-overlay" @click="showConfirmModal = false">
        <div class="modal-content" @click.stop>
          <Icon icon="mdi:alert-circle" width="48" height="48" class="modal-icon" />
          <h3>Confirmer la réinitialisation</h3>
          <p>Êtes-vous sûr de vouloir effacer toutes vos statistiques ?<br>Cette action est irréversible.</p>
          <div class="modal-actions">
            <button @click="showConfirmModal = false" class="btn-cancel">Annuler</button>
            <button @click="resetStats" class="btn-confirm-danger">Confirmer</button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue';
import { useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';
import { store } from '../store/store.ts';

const router = useRouter();
const showConfirmModal = ref(false);

// Copie locale des paramètres pour éviter les mutations directes
const settings = reactive({
  musicVolume: store.settings.musicVolume,
  soundEnabled: store.settings.soundEnabled,
  minWordLength: store.settings.minWordLength,
  maxWordLength: store.settings.maxWordLength
});

const goHome = () => {
  router.push('/'); 
};

const updateVolume = () => {
  store.updateSettings({ musicVolume: settings.musicVolume });
};

const toggleSound = () => {
  settings.soundEnabled = !settings.soundEnabled;
  store.updateSettings({ soundEnabled: settings.soundEnabled });
};

const updateMinLength = () => {
  if (settings.minWordLength > settings.maxWordLength) {
    settings.minWordLength = settings.maxWordLength;
  }
  store.updateSettings({ minWordLength: settings.minWordLength });
  // Recharger la liste de mots et réinitialiser la partie
  reloadGame();
};

const updateMaxLength = () => {
  if (settings.maxWordLength < settings.minWordLength) {
    settings.maxWordLength = settings.minWordLength;
  }
  store.updateSettings({ maxWordLength: settings.maxWordLength });
  // Recharger la liste de mots et réinitialiser la partie
  reloadGame();
};

const reloadGame = async () => {
  // Recharger la liste de mots avec les nouveaux paramètres
  await store.loadWords();
  // Si une partie est en cours ou terminée, la réinitialiser
  if (store.target !== "") {
    await store.resetGame();
  }
};

const confirmResetStats = () => {
  showConfirmModal.value = true;
};

const resetStats = () => {
  store.resetStats();
  showConfirmModal.value = false;
};

</script>

<style scoped>
/* Conteneur principal */
.options-wrapper {
  min-height: 100vh;
  padding: 2rem 1rem;
  color: white;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.options-container {
  max-width: 800px;
  margin: 0 auto;
  animation: fadeIn 0.5s ease;
}

/* En-tête */
.options-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.options-header h1 {
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

/* Section paramètres */
.settings-section {
  background: rgba(30, 40, 90, 0.4);
  padding: 2rem;
  border-radius: 15px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 2rem;
}

.setting-item {
  padding: 1.5rem;
  background: rgba(15, 21, 69, 0.5);
  border-radius: 12px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 1rem;
  transition: all 0.2s ease;
}

.setting-item:hover {
  border-color: rgba(255, 255, 255, 0.2);
}

.setting-item.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.setting-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.setting-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
}

.coming-soon {
  font-size: 0.75rem;
  padding: 0.25rem 0.75rem;
  background: rgba(255, 189, 0, 0.2);
  border: 1px solid rgba(255, 189, 0, 0.4);
  border-radius: 20px;
  color: #ffbd00;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-left: 1rem;
}

.setting-value {
  font-size: 1.1rem;
  font-weight: 700;
  color: #ffbd00;
}

/* Slider personnalisé */
.slider-container {
  position: relative;
  width: 100%;
  height: 8px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  overflow: visible;
}

.slider-track {
  position: absolute;
  height: 100%;
  background: linear-gradient(90deg, #d92b2b, #f5a623);
  border-radius: 10px;
  pointer-events: none;
  transition: width 0.1s ease;
}

.slider {
  position: absolute;
  width: 100%;
  height: 8px;
  top: 0;
  left: 0;
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  cursor: pointer;
  z-index: 2;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  background: white;
  border: 3px solid #f5a623;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  transition: all 0.2s ease;
}

.slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
  box-shadow: 0 4px 15px rgba(245, 166, 35, 0.5);
}

.slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  background: white;
  border: 3px solid #f5a623;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  transition: all 0.2s ease;
}

.slider::-moz-range-thumb:hover {
  transform: scale(1.2);
  box-shadow: 0 4px 15px rgba(245, 166, 35, 0.5);
}

/* Toggle button */
.toggle-btn {
  position: relative;
  width: 60px;
  height: 30px;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.toggle-btn.active {
  background: linear-gradient(90deg, #d92b2b, #f5a623);
  border-color: #f5a623;
}

.toggle-slider {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 22px;
  height: 22px;
  background: white;
  border-radius: 50%;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
}

.toggle-btn.active .toggle-slider {
  transform: translateX(30px);
}

/* Contrôles de longueur */
.word-length-controls {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-top: 1rem;
}

.length-control {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.length-control label {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.length-markers {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.5);
  padding: 0 5px;
}

.warning {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  padding: 0.75rem;
  background: rgba(239, 68, 68, 0.2);
  border: 1px solid rgba(239, 68, 68, 0.4);
  border-radius: 8px;
  color: #ef4444;
  font-size: 0.9rem;
}

/* Zone dangereuse */
.danger-zone {
  background: rgba(30, 40, 90, 0.4);
  padding: 2rem;
  border-radius: 15px;
  border: 2px solid rgba(239, 68, 68, 0.3);
}

.danger-zone h2 {
  font-size: 1.3rem;
  font-weight: 700;
  color: #ef4444;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.danger-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: rgba(15, 21, 69, 0.5);
  border-radius: 12px;
  border: 2px solid rgba(239, 68, 68, 0.2);
}

.danger-info {
  flex: 1;
}

.danger-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
  margin-bottom: 0.5rem;
}

.danger-desc {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
}

.btn-danger {
  background: rgba(239, 68, 68, 0.2);
  border: 2px solid rgba(239, 68, 68, 0.5);
  color: #ef4444;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
}

.btn-danger:hover {
  background: rgba(239, 68, 68, 0.3);
  border-color: #ef4444;
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(239, 68, 68, 0.3);
}

/* Modal */
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
  border: 3px solid rgba(239, 68, 68, 0.5);
  border-radius: 24px;
  padding: 2.5rem;
  max-width: 450px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  animation: slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: center;
}

.modal-icon {
  color: #ef4444;
  margin-bottom: 1rem;
}

.modal-content h3 {
  font-size: 1.8rem;
  color: #ef4444;
  margin-bottom: 1rem;
}

.modal-content p {
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin-bottom: 2rem;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn-cancel,
.btn-confirm-danger {
  padding: 0.75rem 2rem;
  border: 2px solid;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1rem;
}

.btn-cancel {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.3);
  color: white;
}

.btn-cancel:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.btn-confirm-danger {
  background: rgba(239, 68, 68, 0.3);
  border-color: #ef4444;
  color: white;
}

.btn-confirm-danger:hover {
  background: rgba(239, 68, 68, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(239, 68, 68, 0.3);
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(50px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Responsive */
@media (max-width: 768px) {
  .options-header h1 {
    font-size: 1.5rem;
  }

  .word-length-controls {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .danger-item {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .modal-content {
    padding: 2rem 1.5rem;
  }
}
</style>