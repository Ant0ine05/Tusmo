<template>
    <div>
        <div>
            <Icon v-if="router.currentRoute.value.path !== '/'" icon="line-md:home" width="24" height="24" class="button" @click="router.replace('/')" />
        </div>
    </div>
</template>
<script setup>  
import { onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';
import { store } from '../store/store.ts';

const router = useRouter();
const maMusique = new Audio('/sounds/Horizon_2.mp3');
maMusique.loop = true;

// Appliquer le volume initial
maMusique.volume = store.settings.musicVolume / 100;

// Démarrer la musique si les sons sont activés
onMounted(() => {
    if (store.settings.soundEnabled) {
        maMusique.play().catch(() => {
            // La lecture automatique peut être bloquée par le navigateur
            console.log('Autoplay bloqué par le navigateur');
        });
    }
});

// Surveiller les changements de volume
watch(() => store.settings.musicVolume, (newVolume) => {
    maMusique.volume = newVolume / 100;
});

// Surveiller l'activation/désactivation des sons
watch(() => store.settings.soundEnabled, (enabled) => {
    if (enabled) {
        maMusique.play().catch(() => {
            console.log('Lecture bloquée par le navigateur');
        });
    } else {
        maMusique.pause();
    }
});

</script>
<style scoped>
    div {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem 2rem 0rem 2rem;
    }
    a {
        text-decoration: none;
        color: inherit;
    }
    .button {
        padding: 0.75rem 1rem;
        border: 2px solid rgba(255, 255, 255, 0.1);
        border-radius: 10px;
        background: rgba(21, 101, 192, 0.2);
        backdrop-filter: blur(10px);
        color: var(--color-text);
        cursor: pointer;
        font-size: 1.5rem;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        overflow: hidden;
        min-width: 50px;
        
        /* Effet glassmorphism */
        box-shadow: 
            0 4px 16px rgba(21, 101, 192, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
    }

    /* Effet de brillance au survol */
    .button::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
        transition: left 0.5s;
    }

    .button:hover {
        background: rgba(21, 101, 192, 0.4);
        border-color: rgba(255, 255, 255, 0.3);
        transform: translateY(-2px) scale(1.05);
        box-shadow: 
            0 8px 24px rgba(21, 101, 192, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
    }

    .button:hover::before {
        left: 100%;
    }

    .button:active {
        transform: translateY(0) scale(0.95);
        box-shadow: 
            0 2px 8px rgba(21, 101, 192, 0.3),
            inset 0 2px 4px rgba(0, 0, 0, 0.2);
    }

/* === RESPONSIVE MOBILE === */
@media (max-width: 768px) {
    div {
        padding: 0.4rem 1.5rem 0rem 1.5rem;
    }
    
    .button {
        padding: 0.6rem 0.8rem;
        font-size: 1.3rem;
        min-width: 45px;
        border-radius: 8px;
    }
    
    img {
        max-width: 25%;
    }
}

@media (max-width: 480px) {
    div {
        padding: 0.3rem 1rem 0rem 1rem;
    }
    
    .button {
        padding: 0.5rem 0.6rem;
        font-size: 1.1rem;
        min-width: 40px;
        border-radius: 7px;
        border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    img {
        max-width: 30%;
    }
}

@media (max-width: 360px) {
    div {
        padding: 0.25rem 0.75rem 0rem 0.75rem;
    }
    
    .button {
        padding: 0.4rem 0.5rem;
        font-size: 1rem;
        min-width: 35px;
        border-radius: 6px;
    }
    
    img {
        max-width: 35%;
    }
}
</style>