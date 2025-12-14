<template>
  <div class="keyboard">
    <!-- Ligne 1 : A-P -->
    <div class="keyboard-row">
      <button 
        v-for="key in row1" 
        :key="key"
        :class="['key', getKeyStatus(key)]"
        @click="$emit('keyPress', key)"
      >
        {{ key }}
      </button>
    </div>

    <!-- Ligne 2 : Q-M -->
    <div class="keyboard-row">
      <button 
        v-for="key in row2" 
        :key="key"
        :class="['key', getKeyStatus(key)]"
        @click="$emit('keyPress', key)"
      >
        {{ key }}
      </button>
    </div>

    <!-- Ligne 3 : W-? avec Entrée et Backspace -->
    <div class="keyboard-row">
      <button class="key key-action" @click="$emit('enter')">
        ↵ ENTER
      </button>
      <button 
        v-for="key in row3" 
        :key="key"
        :class="['key', getKeyStatus(key)]"
        @click="$emit('keyPress', key)"
      >
        {{ key }}
      </button>
      <button class="key key-action" @click="$emit('backspace')">
        ⌫
      </button>
    </div>
  </div>
</template>

<script setup>
import {computed} from 'vue';

const props = defineProps({
  guesses: {
    type: Array,
    default: () => []
  },
  targetWord: {
    type: String,
    required: true
  }
});

defineEmits(['keyPress', 'enter', 'backspace']);

// Disposition AZERTY
const row1 = ['A', 'Z', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'];
const row2 = ['Q', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M'];
const row3 = ['W', 'X', 'C', 'V', 'B', 'N'];

// Calculer le statut de chaque lettre
const letterStatus = computed(() => {
  const status = {};
  
  props.guesses.forEach(guess => {
    for (let i = 0; i < guess.length; i++) {
      const letter = guess[i];
      
      // Si bien placée → correct (priorité max)
      if (props.targetWord[i] === letter) {
        status[letter] = 'correct';
      }
      // Si présente mais mal placée → present (seulement si pas déjà correct)
      else if (props.targetWord.includes(letter) && status[letter] !== 'correct') {
        status[letter] = 'present';
      }
      // Si absente → absent (seulement si pas déjà correct ou present)
      else if (!props.targetWord.includes(letter) && !status[letter]) {
        status[letter] = 'absent';
      }
    }
  });
  
  return status;
});

const getKeyStatus = (key) => {
  return letterStatus.value[key] || '';
};
</script>

<style scoped>
.keyboard {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 20px auto;
  max-width: 700px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.keyboard-row {
  display: flex;
  gap: 6px;
  justify-content: center;
}

.key {
  min-width: 50px;
  height: 58px;
  padding: 0 12px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: linear-gradient(145deg, rgba(30, 41, 59, 0.7), rgba(15, 23, 42, 0.9));
  color: white;
  font-size: 1.2rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.key:hover {
  transform: translateY(-2px);
  border-color: rgba(255, 255, 255, 0.4);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);
}

.key:active {
  transform: translateY(0);
}

.key-action {
  min-width: 80px;
  font-size: 0.9rem;
  background: linear-gradient(145deg, rgba(21, 101, 192, 0.4), rgba(13, 71, 161, 0.6));
}

/* États validés */
.key.correct {
  background: linear-gradient(145deg, var(--color-correct), #B71C1C);
  border-color: var(--color-correct);
  box-shadow: 0 0 15px rgba(211, 47, 47, 0.5), 0 4px 8px rgba(0, 0, 0, 0.4);
}

.key.present {
  background: linear-gradient(145deg, var(--color-present), #F9A825);
  border-color: var(--color-present);
  color: #1E293B;
  box-shadow: 0 0 15px rgba(251, 192, 45, 0.4), 0 4px 8px rgba(0, 0, 0, 0.4);
}

.key.absent {
  background: linear-gradient(145deg, rgba(120, 144, 156, 0.5), rgba(96, 125, 139, 0.7));
  border-color: rgba(120, 144, 156, 0.3);
  opacity: 0.6;
  cursor: not-allowed;
}

/* === RESPONSIVE MOBILE === */
@media (max-width: 768px) {
  .keyboard {
    gap: 6px;
    margin: 15px auto;
    padding: 15px;
    max-width: 550px;
    border-radius: 12px;
  }
  
  .keyboard-row {
    gap: 5px;
  }
  
  .key {
    min-width: 40px;
    height: 48px;
    padding: 0 10px;
    font-size: 1rem;
    border-radius: 6px;
  }
  
  .key-action {
    min-width: 65px;
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .keyboard {
    gap: 4px;
    margin: 10px auto;
    padding: 10px;
    max-width: 100%;
    border-radius: 10px;
  }
  
  .keyboard-row {
    gap: 3px;
  }
  
  .key {
    min-width: 28px;
    height: 40px;
    padding: 0 6px;
    font-size: 0.85rem;
    border-radius: 5px;
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
  
  .key-action {
    min-width: 50px;
    font-size: 0.7rem;
  }
}

@media (max-width: 360px) {
  .keyboard {
    gap: 3px;
    margin: 8px auto;
    padding: 8px;
  }
  
  .keyboard-row {
    gap: 2px;
  }
  
  .key {
    min-width: 24px;
    height: 35px;
    padding: 0 4px;
    font-size: 0.75rem;
    border-radius: 4px;
  }
  
  .key-action {
    min-width: 42px;
    font-size: 0.65rem;
  }
}
</style>