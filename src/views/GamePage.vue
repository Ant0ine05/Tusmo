<template>
  <main>
    <Logo size="small" class="logo" />
    <br>
    <GameGrid :targetWord="target" :guesses="guesses" :currentGuess="current" :maxAttempts="6" />

    <div class="instructions">
      <p>💡 Tapez directement sur votre clavier</p>
      <p>⌫ Backspace pour effacer | ↵ Enter pour valider</p>
    </div>

  </main>
</template>

<script setup>
import GameGrid from '../components/GameGrid.vue';
import Logo from '../components/Logo.vue';
import { ref, onMounted, onUnmounted } from 'vue';

const target = ref("");
const guesses = ref([]); // Deux essais simulés
const current = ref(""); // L'essai en cours
const wordList = ref([]);

const validateGuess = () => {
  if (current.value.length === target.value.length) {
    if (wordList.value.includes(current.value)) {
      guesses.value.push(current.value);
      current.value = "";
    } else {
      current.value = ""; // Réinitialiser l'essai en cours même si le mot n'est pas validefut
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

    // CORRECTION: split d'abord, puis map
    const words = text
      .split('\n')
      .map(line => {
        return line
          // 1. Sépare les accents des lettres (ex: "é" devient "e" + " ' ")
          .normalize("NFD")
          // 2. Supprime les marques d'accents
          .replace(/[\u0300-\u036f]/g, "")
          // 3. (Optionnel) Gère le "œ" qui résiste parfois
          .replace(/œ/g, "OE")
          .replace(/Œ/g, "OE")
          // 4. Nettoyage standard
          .trim()
          .toUpperCase();
      })
      .filter(word =>
        word.length >= 5 &&
        word.length <= 8 &&
        /^[A-Z]+$/.test(word) // VERIFIE qu'il ne reste que des lettres de A à Z (pas de tirets !)
      );
    wordList.value = words;
    // console.log("Mots de  lettres trouvés:", words.length);
    console.log("Exemples:", words.slice(0, 10));

    return words;
  } catch (error) {
    console.error("Erreur chargement mots:", error);
    // Fallback avec quelques mots
    return ['TUSMO', 'TABLE', 'ROUGE', 'BLOND', 'CARTE', 'MONDE', 'TEMPS', 'GARDE'];
  }
};

// Gestion du clavier global
const handleKeydown = (event) => {
  if (!target.value) return;

  const key = event.key.toUpperCase();

  // Si c'est une lettre A-Z
  if (/^[A-Z]$/.test(key) && current.value.length < target.value.length) {
    current.value += key;
    event.preventDefault();
  }

  // Si c'est Backspace
  else if (event.key === 'Backspace') {
    current.value = current.value.slice(0, -1);
    event.preventDefault();
  }

  // Si c'est Enter
  else if (event.key === 'Enter') {
    validateGuess();
    event.preventDefault();
  }
};

onMounted(async () => {
  const words = await loadWords();
  target.value = words[Math.floor(Math.random() * words.length)];
  // console.log("Mot cible :", target.value);
  window.addEventListener('keydown', handleKeydown);

});

// Retirer l'écouteur au démontage
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});
</script>

<style scoped>

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