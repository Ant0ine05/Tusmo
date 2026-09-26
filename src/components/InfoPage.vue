<template>
  <div class="info-wrapper">
    <div class="info-container">
      <div class="info-header">
        <h1><Icon :icon="icon" width="32" height="32" /> {{ title }}</h1>
      </div>
      <article class="info-content">
        <slot />
      </article>
    </div>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue';

defineProps({
  title: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: 'mdi:information-outline'
  }
});
</script>

<style scoped>
.info-wrapper {
  padding: 2rem 1rem;
  color: white;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.info-container {
  max-width: 800px;
  margin: 0 auto;
  animation: fadeIn 0.5s ease;
}

.info-header h1 {
  font-size: 2rem;
  font-weight: 800;
  text-transform: uppercase;
  color: #ffbd00;
  text-shadow: 2px 2px 0px #c43c3c;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin: 0 0 2rem;
}

.info-content {
  background: rgba(30, 40, 90, 0.4);
  padding: 2rem;
  border-radius: 15px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  text-align: left;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.85);
}

/* Le contenu vient du slot : on le cible avec :deep */
.info-content :deep(h2) {
  font-size: 1.4rem;
  color: #ffbd00;
  margin: 2rem 0 0.75rem;
}

.info-content :deep(h2:first-child) {
  margin-top: 0;
}

.info-content :deep(h3) {
  font-size: 1.1rem;
  color: white;
  margin: 1.5rem 0 0.5rem;
}

.info-content :deep(p) {
  margin: 0 0 1rem;
}

.info-content :deep(ul),
.info-content :deep(ol) {
  margin: 0 0 1rem;
  padding-left: 1.5rem;
}

.info-content :deep(li) {
  margin-bottom: 0.4rem;
}

.info-content :deep(a) {
  color: #64B5F6;
}

.info-content :deep(a:hover) {
  color: #90CAF9;
}

.info-content :deep(strong) {
  color: white;
}

.info-content :deep(.updated) {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@media (max-width: 768px) {
  .info-header h1 {
    font-size: 1.5rem;
  }

  .info-content {
    padding: 1.25rem;
  }
}
</style>
