<template>
  <div>
    <Logo size="small" class="logo" />    
    <div>
      <div class="button_grid">
        <input type="button" value="Start Game" @click="router.push('/game')">
        <input type="button" value="Stats" @click="router.push('/multiplayer')">
        <input type="button" value="Options" @click="router.push('/options')">
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Logo from './Logo.vue';

const router = useRouter();

onMounted(() => {
  console.log('HelloWorld component mounted');
});
</script>
<style scoped>
.logo {
  
}
.hello-world {
  text-align: center;
  margin-top: 2rem;
}
.button_grid {
  display: grid;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}
input[type="button"] {
  padding: 1rem 2rem;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  background: rgba(21, 101, 192, 0.2);
  backdrop-filter: blur(10px);
  color: var(--color-text);
  cursor: pointer;
  font-size: 2rem;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  
  /* Effet glassmorphism */
  box-shadow: 
    0 8px 32px rgba(21, 101, 192, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

/* Effet de brillance au survol */
input[type="button"]::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

input[type="button"]:hover {
  background: rgba(21, 101, 192, 0.4);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px) scale(1.02);
  box-shadow: 
    0 12px 48px rgba(21, 101, 192, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

input[type="button"]:hover::before {
  left: 100%;
}

input[type="button"]:active {
  transform: translateY(0) scale(0.98);
  box-shadow: 
    0 4px 16px rgba(21, 101, 192, 0.3),
    inset 0 2px 4px rgba(0, 0, 0, 0.2);
}
</style>