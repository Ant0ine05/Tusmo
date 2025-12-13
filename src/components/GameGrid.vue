<script setup>
import { defineProps, onMounted, computed } from 'vue';

// On reçoit les infos du parent (GameView)
const props = defineProps({
  guesses: {
    type: Array,
    default: () => []
  },
  currentGuess: {
    type: String,
    default: ""
  },
  targetWord: {
    type: String,
    required: true
  },
  maxAttempts: {
    type: Number,
    default: 6
  }
});

// Calculer les lettres bien placées (correctes) déjà trouvées
const revealedLetters = computed(() => {
  const revealed = Array(props.targetWord.length).fill(null);
  
  // La première lettre est toujours révélée
  revealed[0] = props.targetWord[0];
  
  // Parcourir tous les essais précédents
  props.guesses.forEach(guess => {
    for (let i = 0; i < guess.length; i++) {
      // Si la lettre est bien placée, on la révèle
      if (guess[i] === props.targetWord[i]) {
        revealed[i] = props.targetWord[i];
      }
    }
  });
  
  return revealed;
});

onMounted(() => {
  console.log("GameGrid monté avec le mot cible :", props.targetWord);
});

const getStatusClass = (word, letter, index) => {
  if (!word) return '';
  
  const target = props.targetWord;
  
  if (target[index] === letter) return 'correct';
  if (target.includes(letter)) return 'present';
  
  return 'absent';
};
</script>

<template>
  <div class="grid-container">
    
    <div v-if="targetWord !== ''"
      v-for="(row, rowIndex) in maxAttempts" 
      :key="rowIndex" 
      class="row"
    >
      
      <!-- Ligne déjà validée -->
      <template v-if="rowIndex < guesses.length">
        <div 
          v-for="(letter, colIndex) in props.targetWord.length" 
          :key="colIndex"
          class="cell revealed"
          :class="getStatusClass(guesses[rowIndex], guesses[rowIndex][colIndex], colIndex)"
        >
          {{ guesses[rowIndex][colIndex] }}
        </div>
      </template>

      <!-- Ligne en cours de saisie -->
      <template v-else-if="rowIndex === guesses.length">
        <div 
          v-for="(letter, colIndex) in props.targetWord.length" 
          :key="colIndex"
          class="cell current"
          :class="{ 'filled': colIndex < currentGuess.length }"
        >
          <span v-if="colIndex < currentGuess.length">
            {{ currentGuess[colIndex] }}
          </span>
          <!-- Afficher les lettres révélées (bien placées) -->
          <span v-else-if="revealedLetters[colIndex]" class="hint">
            {{ revealedLetters[colIndex] }}
          </span>
          <span v-else class="placeholder">.</span>
        </div>
      </template>

      <!-- Lignes vides futures -->
      <template v-else>
        <div 
          v-for="(letter, colIndex) in targetWord.length" 
          :key="colIndex"
          class="cell empty"
        >
          <!-- Afficher les lettres révélées même sur les lignes futures -->
          <span v-if="revealedLetters[colIndex]" class="hint opacity-50">
            {{ revealedLetters[colIndex] }}
          </span>
          <span v-else>.</span>
        </div>
      </template>

    </div>
  </div>
</template>
<style scoped>
.grid-container {
  display: flex;
  flex-direction: column;
  gap: 10px; /* Espace entre les lignes */
  margin: 20px auto;
  padding: 20px;
  max-width: 400px; /* Largeur max de la grille */
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.row {
  display: flex;
  gap: 10px; /* Espace entre les lettres */
  justify-content: center;
}

.cell {
  width: 60px;
  height: 60px;
  border: 3px solid rgba(255, 255, 255, 0.2);
  background: linear-gradient(145deg, rgba(30, 41, 59, 0.7), rgba(15, 23, 42, 0.9));
  color: var(--color-text);
  font-size: 2rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  border-radius: 8px; /* Un peu arrondi comme ton logo */
  user-select: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

/* --- ETATS DES CASES --- */

/* Case remplie (en cours de frappe) */
.cell.filled {
  border-color: rgba(255, 255, 255, 0.6);
  background: linear-gradient(145deg, rgba(21, 101, 192, 0.3), rgba(13, 71, 161, 0.5));
  transform: scale(1.05);
}

/* Case indice (Première lettre) */
.hint {
  opacity: 0.5;
  color: rgba(255, 255, 255, 0.7);
}

.placeholder {
  opacity: 0.3;
  color: rgba(255, 255, 255, 0.3);
}

/* --- COULEURS VALIDATION (TES VARIABLES) --- */

.cell.correct {
  background: linear-gradient(145deg, var(--color-correct), #B71C1C);
  border-color: var(--color-correct);
  /* Effet néon subtil */
  box-shadow: 0 0 20px rgba(211, 47, 47, 0.6), 0 4px 12px rgba(0, 0, 0, 0.4); 
  transform: scale(1.05);
}

.cell.present {
  background: linear-gradient(145deg, var(--color-present), #F9A825);
  border-color: var(--color-present);
  color: #1E293B;
  font-weight: 800;
  box-shadow: 0 0 20px rgba(251, 192, 45, 0.5), 0 4px 12px rgba(0, 0, 0, 0.4);
  transform: scale(1.05);
}

.cell.absent {
  background: linear-gradient(145deg, rgba(120, 144, 156, 0.6), rgba(96, 125, 139, 0.8));
  border-color: rgba(120, 144, 156, 0.4);
  opacity: 0.7;
}

/* Animation d'apparition */
.revealed {
  animation: flip 0.5s ease forwards;
}

@keyframes flip {
  0% { transform: scaleY(1); }
  50% { transform: scaleY(0); }
  100% { transform: scaleY(1); }
}
</style>