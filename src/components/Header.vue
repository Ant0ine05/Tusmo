<template>
    <div>
        <div>
            <Icon v-if="router.currentRoute.value.path !== '/'" icon="line-md:home" width="24" height="24" class="button" @click="router.replace('/')" />
            <img v-if="viewImage" src="../assets/Logo4.png" alt="" width="20%" height="20%">
        </div>
        <div>
            <ul>
                <li><Icon icon="line-md:volume-high-filled" width="24" height="24" class="button"/></li>
                <li><Icon icon="line-md:sunny-filled-loop-to-moon-filled-alt-loop-transition" width="24" height="24" class="button" /></li>
            </ul>   
        </div>
    </div>
</template>
<script setup>  
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';
const router = useRouter();

onMounted(() => {
});
defineProps({
    viewImage: {
        type: Boolean,
        default: true
    }
})
</script>
<style scoped>
    div {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 2rem 0rem 2rem;
    }
    ul {
        list-style: none;
        display: flex;
        gap: 1rem;
        padding: 0;
        margin: 0;
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
</style>