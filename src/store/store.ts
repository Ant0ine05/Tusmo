import { reactive, computed } from 'vue'
import { todayParis, previousDay, wordOfTheDay } from './daily.ts'

// Gestion des statistiques
interface GameHistory {
    date: string;
    word: string;
    found: boolean;
    attempts: number;
    guesses: string[];
    daily?: boolean;
}

// Série du mot du jour : jours consécutifs gagnés
const emptyDailyStats = () => ({
    played: 0,
    won: 0,
    currentStreak: 0,
    maxStreak: 0,
    lastWinDate: '' // AAAA-MM-JJ du dernier mot du jour gagné
});

// Partie du mot du jour en cours ou terminée, pour la reprendre après un rechargement
const DAILY_KEY = 'tusmo_daily';

const loadDaily = () => {
    try {
        return JSON.parse(localStorage.getItem(DAILY_KEY) || 'null');
    } catch {
        return null;
    }
};

interface Settings {
    musicVolume: number;
    soundEnabled: boolean;
    minWordLength: number;
    maxWordLength: number;
}

const loadStats = () => {
    const saved = localStorage.getItem('tusmo_stats');
    if (saved) {
        const stats = JSON.parse(saved);
        // Les sauvegardes d'avant le mot du jour n'ont pas de série : on l'ajoute sans toucher au reste
        stats.daily = { ...emptyDailyStats(), ...stats.daily };
        return stats;
    }
    return {
        gamesPlayed: 0,
        gamesWon: 0,
        gamesLost: 0,
        history: [] as GameHistory[],
        daily: emptyDailyStats()
    };
};

const saveStats = (stats: any) => {
    localStorage.setItem('tusmo_stats', JSON.stringify(stats));
};

const loadSettings = (): Settings => {
    const saved = localStorage.getItem('tusmo_settings');
    if (saved) {
        return JSON.parse(saved);
    }
    return {
        musicVolume: 50,
        soundEnabled: true,
        minWordLength: 5,
        maxWordLength: 8
    };
};

const saveSettings = (settings: Settings) => {
    localStorage.setItem('tusmo_settings', JSON.stringify(settings));
};

// Le fichier de mots (2 Mo) n'est téléchargé qu'une fois, même si la liste est rechargée
let wordsText: string | null = null;

export const store = reactive({
    // État du jeu
    mode: 'free', // 'free' (mot tiré au hasard) ou 'daily' (mot du jour)
    dailyDate: '', // jour du mot du jour en cours (AAAA-MM-JJ)
    target: "",
    guesses: [],
    current: "",
    wordList: [],
    gameStatus: 'playing', // 'playing', 'won', 'lost'
    maxAttempts: 6,
    
    // Statistiques
    stats: loadStats(),
    
    // Paramètres
    settings: loadSettings(),

    // Actions
    setTarget(word) {
        this.target = word
        // console.log("Mot cible défini sur :", word);
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

    // Par défaut la liste suit les options du joueur ; le mot du jour impose ses propres longueurs
    async loadWords(
        minLength = store.settings.minWordLength,
        maxLength = store.settings.maxWordLength
    ) {
        try {
            if (wordsText === null) {
                const response = await fetch('/mots.txt');

                if (!response.ok) {
                    throw new Error(`Fichier non trouvé: ${response.status}`);
                }

                wordsText = await response.text();
            }

            const text = wordsText;

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
                    word.length >= minLength &&
                    word.length <= maxLength &&
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
                if (this.mode === 'daily') this.saveDaily();
            } else {
                this.current = this.target[0]; // Réinitialiser avec la première lettre même si invalide
            }
        }
    },

    // Une partie déjà terminée (par exemple reprise après un rechargement) n'est comptée qu'une fois
    handleWin(attempts) {
        if (store.gameStatus !== 'playing') return;
        store.gameStatus = 'won';
        // Sauvegarder les statistiques
        store.saveGameResult(true, attempts);
        // console.log(`🎉 Victoire en ${attempts} essais !`);
    },

    handleLose(word) {
        if (store.gameStatus !== 'playing') return;
        store.gameStatus = 'lost';
        // Sauvegarder les statistiques
        store.saveGameResult(false, store.guesses.length);
        // console.log(`😢 Défaite ! Le mot était : ${word}`);
    },

    saveGameResult(won: boolean, attempts: number) {
        const gameData: GameHistory = {
            date: new Date().toISOString(),
            word: this.target,
            found: won,
            attempts: attempts,
            guesses: [...this.guesses],
            daily: this.mode === 'daily'
        };

        if (this.mode === 'daily') {
            this.recordDailyResult(won);
            this.saveDaily();
        }

        this.stats.gamesPlayed++;
        if (won) {
            this.stats.gamesWon++;
        } else {
            this.stats.gamesLost++;
        }
        this.stats.history.unshift(gameData); // Ajouter au début
        
        // Limiter l'historique à 50 parties
        if (this.stats.history.length > 50) {
            this.stats.history = this.stats.history.slice(0, 50);
        }
        
        saveStats(this.stats);
    },

    getStats() {
        return {
            ...this.stats,
            winRate: this.stats.gamesPlayed > 0 
                ? Math.round((this.stats.gamesWon / this.stats.gamesPlayed) * 100) 
                : 0
        };
    },

    // Partie libre : une partie déjà en cours est conservée quand on revient sur la page
    async initGame() {
        if (this.mode === 'free' && this.target !== "") return;

        this.mode = 'free';
        this.target = "";
        this.guesses = [];
        this.current = "";
        this.gameStatus = 'playing';

        const words = await this.loadWords();
        const randomWord = words[Math.floor(Math.random() * words.length)];

        this.setTarget(randomWord);
    },

    // Mot du jour : même mot pour tous, indépendant des options de longueur
    async startDaily() {
        const today = todayParis();
        if (this.mode === 'daily' && this.dailyDate === today && this.target !== "") return;

        this.mode = 'daily';
        this.dailyDate = today;
        this.target = "";
        this.guesses = [];
        this.current = "";
        this.gameStatus = 'playing';

        const target = await wordOfTheDay(today);
        const words = await this.loadWords(target.length, target.length);
        // Le mot du jour doit toujours être une proposition acceptée
        if (!words.includes(target)) words.push(target);

        this.setTarget(target);

        // Reprise de la partie du jour après un rechargement ou un retour sur la page
        const saved = loadDaily();
        if (saved && saved.date === today && saved.word === target) {
            this.guesses = saved.guesses;
            this.gameStatus = saved.status;
            // Rechargé pendant l'animation de la dernière proposition : on la compte maintenant
            if (this.gameStatus === 'playing') {
                if (this.guesses[this.guesses.length - 1] === target) {
                    this.handleWin(this.guesses.length);
                } else if (this.guesses.length >= this.maxAttempts) {
                    this.handleLose(target);
                }
            }
        }
    },

    saveDaily() {
        localStorage.setItem(DAILY_KEY, JSON.stringify({
            date: this.dailyDate,
            word: this.target,
            guesses: this.guesses,
            status: this.gameStatus
        }));
    },

    // La série compte les jours gagnés d'affilée : une défaite ou un jour sauté la remet à zéro
    recordDailyResult(won: boolean) {
        const daily = this.stats.daily;
        // Déjà gagné ce jour-là (par exemple partie rejouée après un effacement partiel des données)
        if (won && daily.lastWinDate === this.dailyDate) return;

        daily.played++;
        if (won) {
            daily.won++;
            daily.currentStreak = daily.lastWinDate === previousDay(this.dailyDate)
                ? daily.currentStreak + 1
                : 1;
            daily.lastWinDate = this.dailyDate;
            daily.maxStreak = Math.max(daily.maxStreak, daily.currentStreak);
        } else {
            daily.currentStreak = 0;
        }
    },

    // Série affichée : elle reste vivante jusqu'à la fin du jour qui suit la dernière victoire
    getDailyStreak() {
        const daily = this.stats.daily;
        const today = todayParis();
        const alive = daily.lastWinDate === today || daily.lastWinDate === previousDay(today);
        return {
            current: alive ? daily.currentStreak : 0,
            max: daily.maxStreak,
            played: daily.played,
            won: daily.won
        };
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
    },

    // Gestion des paramètres
    updateSettings(newSettings: Partial<Settings>) {
        this.settings = { ...this.settings, ...newSettings };
        saveSettings(this.settings);
    },

    resetStats() {
        this.stats = {
            gamesPlayed: 0,
            gamesWon: 0,
            gamesLost: 0,
            history: [],
            daily: emptyDailyStats()
        };
        saveStats(this.stats);
    }
})