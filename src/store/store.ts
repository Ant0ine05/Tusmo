import { reactive, computed } from 'vue'

export const store = reactive({
    // État du jeu
    target: "",
    guesses: [],
    current: "",
    wordList: [],
    gameStatus: 'playing', // 'playing', 'won', 'lost'
    maxAttempts: 6,

    // Actions
    setTarget(word) {
        this.target = word
        console.log("Mot cible défini sur :", word);
        this.current = this.target[0];

    },

    addGuess(word) {
        this.guesses.push(word)
    },

    setCurrent(value) {
        this.current = value
    },

    setGameStatus(status) {
        this.gameStatus = status
    },

    setWordList(words) {
        this.wordList = words
    },

    // resetGame() {
    //     this.guesses = []
    //     this.gameStatus = 'playing'
    //     this.current = this.target[0]
    // },

    async loadWords() {
        try {
            const response = await fetch('/mots.txt');

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
            this.setWordList(words);
            // console.log("Exemples:", words.slice(0, 10));

            return words;
        } catch (error) {
            console.error("Erreur chargement mots:", error);
            return ['TUSMO', 'TABLE', 'ROUGE', 'BLOND', 'CARTE', 'MONDE', 'TEMPS', 'GARDE'];
        }
    },

    handleBackspace() {
        if (this.gameStatus !== 'playing') return;

        // Empêcher de supprimer la première lettre (toujours garder au moins 1 lettre)
        if (this.current.length > 1) {
            this.current = this.current.slice(0, -1);
        }
    },

    handleKeyPress(key) {
        // console.log("Touche pressée :", key);
        // console.log("État actuel avant traitement :", { current: this.current, target: this.target, gameStatus: this.gameStatus });
        if (this.gameStatus !== 'playing') return;

        // Si current est vide, ajouter automatiquement la première lettre
        if (this.current.length === 0) {
            this.current = this.target[0];
        }

        // Ajouter la lettre si on n'a pas atteint la longueur max
        if (this.current.length < this.target.length) {
            this.current += key;
        }
    },

    validateGuess() {
        if (this.gameStatus !== 'playing') return;
        if (this.current.length === this.target.length) {
            if (this.wordList.includes(this.current)) {
                this.guesses.push(this.current);
                this.current = this.target[0]; // Réinitialiser avec la première lettre
            } else {
                this.current = this.target[0]; // Réinitialiser avec la première lettre même si invalide
            }
        }
    },

    handleWin(attempts) {
        store.gameStatus = 'won';
        // console.log(`🎉 Victoire en ${attempts} essais !`);
    },

    handleLose(word) {
        store.gameStatus = 'lost';
        // console.log(`😢 Défaite ! Le mot était : ${word}`);
    },

    async initGame() {
        if (this.target !== "") return; // Ne pas réinitialiser si déjà défini 
        const words = this.wordList.length > 0 ? this.wordList : await this.loadWords();
        const randomWord = words[Math.floor(Math.random() * words.length)];

        this.setTarget(randomWord);
    },

    async resetGame() {
        this.guesses = [];
        this.gameStatus = 'playing';
        this.current = "";
        const words = this.wordList.length > 0 ? this.wordList : await this.loadWords();
        const randomWord = words[Math.floor(Math.random() * words.length)];
        this.setTarget(randomWord);
    },

    handleKeydown(event) {
        if (!store.target || store.gameStatus !== 'playing') return;

        const key = event.key.toUpperCase();

        if (/^[A-Z]$/.test(key)) {
            store.handleKeyPress(key);
            event.preventDefault();
        }
        else if (event.key === 'Backspace') {
            store.handleBackspace();
            event.preventDefault();
        }
        else if (event.key === 'Enter') {
            store.validateGuess();
            event.preventDefault();
        }
    }
})