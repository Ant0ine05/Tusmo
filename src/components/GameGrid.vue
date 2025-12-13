<script setup>
import { defineProps, computed } from 'vue';

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

// --- LOGIQUE 1 : CALCULER LES LETTRES DÉCOUVERTES (Pour les indices) ---
const revealedLetters = computed(() => {
  if (!props.targetWord) return [];
  
  const revealed = Array(props.targetWord.length).fill(null);
  
  // La première lettre est toujours révélée (Règle Tusmo)
  revealed[0] = props.targetWord[0];
  
  // On regarde tous les essais précédents pour compléter les indices
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
// C'est cette fonction qui gère intelligemment les doublons
const getGuessStatuses = (guess, target) => {
    const guessArr = guess.split('');
    const targetArr = target.split('');
    
    // Par défaut, tout est "absent" (bleu/gris)
    const result = new Array(guess.length).fill('absent'); 
    
    // On compte les lettres du mot cible (Ex: POMME -> {P:1, O:1, M:2, E:1})
    const targetCounts = {};
    for (const char of targetArr) {
        targetCounts[char] = (targetCounts[char] || 0) + 1;
    }

    // PASSE 1 : Les Bien Placés (Rouge) - PRIORITAIRE
    guessArr.forEach((letter, i) => {
        if (letter === targetArr[i]) {
            result[i] = 'correct';
            targetCounts[letter]--; // On consomme la lettre
        }
    });

    // PASSE 2 : Les Mal Placés (Jaune)
    guessArr.forEach((letter, i) => {
        // On ne touche pas à ceux qui sont déjà rouges
        if (result[i] !== 'correct') { 
            // S'il reste cette lettre dans le stock
            if (targetCounts[letter] > 0) {
                result[i] = 'present';
                targetCounts[letter]--; // On consomme la lettre
            }
        }
    });

    return result;
};

// Fonction utilisée par le Template pour récupérer la couleur d'une case précise
const getCellClass = (rowIndex, colIndex) => {
  const word = props.guesses[rowIndex];
  if (!word) return '';
  
  // On calcule les couleurs pour tout le mot de cette ligne
  const statuses = getGuessStatuses(word, props.targetWord);
  
  // On retourne la couleur de la colonne demandée
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
  /* J'ai enlevé max-height fixe pour éviter que ça coupe sur mobile */
  
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  width: fit-content; /* S'adapte au contenu */
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