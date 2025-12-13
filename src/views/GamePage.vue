<template>
  <main>
    <Logo size="small" class="logo" />
    <br>
    
    <!-- Modal Victoire/Défaite -->
    <div v-if="gameStatus !== 'playing'" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        
        <!-- Victoire -->
        <div v-if="gameStatus === 'won'" class="modal-win">
          <div class="modal-icon"><Icon icon="mdi:party-popper" width="48" height="48" /></div>
          <h2>BRAVO !</h2>
          <p>Tu as trouvé le mot en <strong>{{ guesses.length }}</strong> essai{{ guesses.length > 1 ? 's' : '' }} !</p>
          <div class="modal-word">{{ target }}</div>
          <div class="modal-actions">
            <button @click="resetGame" class="btn-restart primary">
             <Icon icon="mdi:restart" width="24" height="24" /> Rejouer
            </button>
            <button @click="$router.replace('/')" class="btn-restart secondary">
               <Icon icon="line-md:home" width="24" height="24"/>
            </button>
          </div>
        </div>

        <!-- Défaite -->
        <div v-else-if="gameStatus === 'lost'" class="modal-lose">
          <!-- <div class="modal-icon"><Icon icon="mdi:close-circle" width="48" height="48" /></div> -->
          <h2>PERDU !</h2>
          <p>Le mot était :</p>
          <div class="modal-word">{{ target }}</div>
          <div class="modal-actions">
            <button @click="resetGame" class="btn-restart primary">
              <Icon icon="mdi:restart" width="24" height="24" /> Réessayer
            </button>
            <button @click="$router.replace('/')" class="btn-restart secondary">
              <Icon icon="line-md:home" width="24" height="24"/>
            </button>
          </div>
        </div>

      </div>
    </div>

    <GameGrid 
      :guesses="guesses" 
      :currentGuess="current" 
      :targetWord="target"
      :maxAttempts="6"
      @win="handleWin"
      @lose="handleLose"
    />

    <Keyboard 
      :guesses="guesses"
      :targetWord="target"
      @keyPress="handleKeyPress"
      @enter="validateGuess"
      @backspace="handleBackspace"
    />
  </main>
</template>

<script setup>
import { Icon } from '@iconify/vue';
import GameGrid from '../components/GameGrid.vue';
import Keyboard from '../components/Keyboard.vue';
import Logo from '../components/Logo.vue';
import { ref, onMounted, onUnmounted } from 'vue';

const target = ref("");
const guesses = ref([]);
const current = ref("");
const wordList = ref([]);
const maxAttempts = 6;
const gameStatus = ref('playing');

const handleWin = (attempts) => {
  gameStatus.value = 'won';
  console.log(`🎉 Victoire en ${attempts} essais !`);
};

const handleLose = (word) => {
  gameStatus.value = 'lost';
  console.log(`😢 Défaite ! Le mot était : ${word}`);
};

const closeModal = () => {
  // Optionnel : fermer la modal en cliquant sur l'overlay
};

const handleKeyPress = (key) => {
  if (gameStatus.value !== 'playing') return;
  if (current.value.length < target.value.length) {
    current.value += key;
  }
};

const handleBackspace = () => {
  if (gameStatus.value !== 'playing') return;
  current.value = current.value.slice(0, -1);
};

const validateGuess = () => {
  if (gameStatus.value !== 'playing') return;
  if (current.value.length === target.value.length) {
    if (wordList.value.includes(current.value)) {
      guesses.value.push(current.value);
      current.value = "";
    } else {
      current.value = "";
    }
  }
};

const loadWords = async () => {
  try {
    const response = await fetch('/mots-francais.txt');

    if (!response.ok) {
      throw new Error(`Fichier non trouvé: ${response.status}`);
    }

    const text = await response.text();

    const words = text
      .split('\n')
      .map(line => {
        return line
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/œ/g, "OE")
          .replace(/Œ/g, "OE")
          .trim()
          .toUpperCase();
      })
      .filter(word =>
        word.length >= 5 &&
        word.length <= 8 &&
        /^[A-Z]+$/.test(word)
      );
    wordList.value = words;
    // console.log("Exemples:", words.slice(0, 10));

    return words;
  } catch (error) {
    console.error("Erreur chargement mots:", error);
    return ['TUSMO', 'TABLE', 'ROUGE', 'BLOND', 'CARTE', 'MONDE', 'TEMPS', 'GARDE'];
  }
};

const resetGame = async () => {
  guesses.value = [];
  current.value = "";
  gameStatus.value = 'playing';
  const words = wordList.value.length > 0 ? wordList.value : await loadWords();
  target.value = words[Math.floor(Math.random() * words.length)];
  // console.log("Nouveau mot :", target.value);
};

const handleKeydown = (event) => {
  if (!target.value || gameStatus.value !== 'playing') return;

  const key = event.key.toUpperCase();

  if (/^[A-Z]$/.test(key) && current.value.length < target.value.length) {
    current.value += key;
    event.preventDefault();
  }
  else if (event.key === 'Backspace') {
    current.value = current.value.slice(0, -1);
    event.preventDefault();
  }
  else if (event.key === 'Enter') {
    validateGuess();
    event.preventDefault();
  }
};

onMounted(async () => {
  const words = await loadWords();
  target.value = words[Math.floor(Math.random() * words.length)];
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
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
  padding: 0rem 1rem 0 1rem;
  min-height: calc(100vh - 100px);
}

h1 {
  color: white;
  font-family: 'Montserrat', Arial, sans-serif;
  font-weight: 900;
  letter-spacing: 8px;
  font-size: 3rem;
  margin-bottom: 2rem;
  text-shadow: 0 4px 20px rgba(21, 101, 192, 0.5);
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
</style>