<script setup>
import {  computed,  } from 'vue';

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

const emit = defineEmits(['win', 'lose']);

// --- LOGIQUE 1 : CALCULER LES LETTRES DÉCOUVERTES (Pour les indices) ---
const revealedLetters = computed(() => {
  if (!props.targetWord) return [];
  
  const revealed = Array(props.targetWord.length).fill(null);
  
  revealed[0] = props.targetWord[0];
  
  props.guesses.forEach(guess => {
    for (let i = 0; i < guess.length; i++) {
      if (guess[i] === props.targetWord[i]) {
        revealed[i] = props.targetWord[i];
      }
    }
  });
  
  return revealed;
});

// --- LOGIQUE 2 : L'ALGORITHME DES COULEURS (LE FIX DU BUG) ---
const getGuessStatuses = (guess, target) => {
    const guessArr = guess.split('');
    const targetArr = target.split('');
    
    const result = new Array(guess.length).fill('absent'); 
    
    const targetCounts = {};
    for (const char of targetArr) {
        targetCounts[char] = (targetCounts[char] || 0) + 1;
    }

    // PASSE 1 : Les Bien Placés (Rouge) - PRIORITAIRE
    guessArr.forEach((letter, i) => {
        if (letter === targetArr[i]) {
            result[i] = 'correct';
            targetCounts[letter]--;
        }
    });

    // PASSE 2 : Les Mal Placés (Jaune)
    guessArr.forEach((letter, i) => {
        if (result[i] !== 'correct') { 
            if (targetCounts[letter] > 0) {
                result[i] = 'present';
                targetCounts[letter]--;
            }
        }
    });

    return result;
};

// --- LOGIQUE 3 : VÉRIFIER SI LE MOT EST CORRECT ---
const checkWin = (guess) => {
  return guess.toUpperCase() === props.targetWord.toUpperCase();
};

// Vérifier après chaque guess
const checkGameStatus = () => {
  if (props.guesses.length === 0) return;
  
  const lastGuess = props.guesses[props.guesses.length - 1];
  
  // Victoire : le dernier mot est correct
  if (checkWin(lastGuess)) {
    setTimeout(() => {
      emit('win', props.guesses.length);
    }, 600); // Attendre l'animation flip
  }
  // Défaite : nombre max d'essais atteint
  else if (props.guesses.length >= props.maxAttempts) {
    setTimeout(() => {
      emit('lose', props.targetWord);
    }, 600);
  }
};

// Surveiller les changements de guesses
import { watch } from 'vue';
watch(() => props.guesses.length, () => {
  checkGameStatus();
});

const getCellClass = (rowIndex, colIndex) => {
  const word = props.guesses[rowIndex];
  if (!word) return '';
  
  const statuses = getGuessStatuses(word, props.targetWord);
  
  return statuses[colIndex];
};
</script>

<template>
  <div class="grid-container">
    
    <div v-if="targetWord"
      v-for="(row, rowIndex) in maxAttempts" 
      :key="rowIndex" 
      class="row"
    >
      
      <template v-if="rowIndex < guesses.length">
        <div 
          v-for="(letter, colIndex) in props.targetWord.length" 
          :key="colIndex"
          class="cell revealed"
          :class="getCellClass(rowIndex, colIndex)"
        >
          {{ guesses[rowIndex][colIndex] }}
        </div>
      </template>

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
          <span v-else-if="revealedLetters[colIndex]" class="hint">
            {{ revealedLetters[colIndex] }}
          </span>
          <span v-else class="placeholder">.</span>
        </div>
      </template>

      <template v-else>
        <div 
          v-for="(letter, colIndex) in targetWord.length" 
          :key="colIndex"
          class="cell empty"
        >
          <span v-if="revealedLetters[colIndex]" class="hint opacity-50">
            {{ revealedLetters[colIndex] }}
          </span>
          <span v-else>.</span>
        </div>
      </template>

    </div>
    
    <div v-else class="loading">
       Chargement du dictionnaire...
    </div>
  </div>
</template>

<style scoped>
/* --- TON STYLE ORIGINAL (Conservé) --- */
.grid-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 20px auto;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  width: fit-content;
}

.row {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.cell {
  width: 50px;
  height: 50px;
  border: 3px solid rgba(255, 255, 255, 0.2);
  background: linear-gradient(145deg, rgba(30, 41, 59, 0.7), rgba(15, 23, 42, 0.9));
  color: var(--color-text);
  font-size: 2rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  border-radius: 8px;
  user-select: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

/* === RESPONSIVE MOBILE === */
@media (max-width: 768px) {
  .grid-container {
    gap: 6px;
    margin: 10px auto;
    padding: 12px;
    border-radius: 12px;
  }
  
  .row {
    gap: 6px;
  }
  
  .cell {
    width: 45px;
    height: 45px;
    font-size: 1.5rem;
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-radius: 6px;
  }
}

@media (max-width: 480px) {
  .grid-container {
    gap: 4px;
    margin: 8px auto;
    padding: 10px;
    border-radius: 10px;
  }
  
  .row {
    gap: 4px;
  }
  
  .cell {
    width: 35px;
    height: 35px;
    font-size: 1.2rem;
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-radius: 5px;
  }
}

@media (max-width: 430px) {
  .grid-container {
    gap: 3px;
    margin: 5px auto;
    padding: 8px;
  }
  
  .row {
    gap: 3px;
  }
  
  .cell {
    width: 30px;
    height: 30px;
    font-size: 1rem;
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
}

/* --- ETATS DES CASES --- */

.cell.filled {
  border-color: rgba(255, 255, 255, 0.6);
  background: linear-gradient(145deg, rgba(21, 101, 192, 0.3), rgba(13, 71, 161, 0.5));
  transform: scale(1.05);
}

.hint {
  opacity: 0.5;
  color: rgba(255, 255, 255, 0.7);
}

.placeholder {
  opacity: 0.3;
  color: rgba(255, 255, 255, 0.3);
}

/* --- COULEURS VALIDATION --- */

.cell.correct {
  /* ROUGE */
  background: linear-gradient(145deg, var(--color-correct), #B71C1C);
  border-color: var(--color-correct);
  box-shadow: 0 0 20px rgba(211, 47, 47, 0.6), 0 4px 12px rgba(0, 0, 0, 0.4); 
  transform: scale(1.05);
  z-index: 1; /* Pour passer au dessus */
}

.cell.present {
  /* JAUNE */
  background: linear-gradient(145deg, var(--color-present), #F9A825);
  border-color: var(--color-present);
  color: #1E293B; /* Texte sombre sur jaune pour lisibilité */
  font-weight: 800;
  box-shadow: 0 0 20px rgba(251, 192, 45, 0.5), 0 4px 12px rgba(0, 0, 0, 0.4);
  transform: scale(1.05);
  z-index: 1;
}

.cell.absent {
  /* BLEU/GRIS */
  background: linear-gradient(145deg, rgba(120, 144, 156, 0.6), rgba(96, 125, 139, 0.8));
  border-color: rgba(120, 144, 156, 0.4);
  opacity: 0.7;
}

/* Animation d'apparition */
.revealed {
  animation: flip 0.6s ease forwards;
}

.loading {
    color: white;
    text-align: center;
    padding: 20px;
}

@keyframes flip {
  0% { transform: rotateX(0); }
  50% { transform: rotateX(90deg); }
  100% { transform: rotateX(0); }
}
</style>