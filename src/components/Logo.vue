<template>
  <div class="tusmo-logo">
    <div class="letter-box red">T</div>
    <div class="letter-box yellow">O</div>
    <div class="letter-box red">M</div>
    <div class="letter-box blue">U</div>
    <div class="letter-box yellow">S</div>
  </div>
</template>

<script setup>
defineProps({
  size: {
    type: String,
    default: 'medium' // 'small', 'medium', 'large'
  }
});
</script>

<style scoped>
.tusmo-logo {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  align-items: center;
}

.letter-box {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  font-size: 3rem;
  font-weight: 900;
  color: #000000;
  font-family: 'Arial Black', Arial, sans-serif;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease;
}

/* .letter-box:hover {
  transform: translateY(-5px) scale(1.05);
} */

.letter-box.red {
  background: linear-gradient(145deg, #D32F2F, #B71C1C);
  color: #FFFFFF;
}

.letter-box.yellow {
  background: linear-gradient(145deg, #FBC02D, #F9A825);
  color: #FFFFFF;
}

.letter-box.blue {
  background: linear-gradient(145deg, #1565C0, #0D47A1);
  color: #FFFFFF;
}

/* Variantes de taille */
.tusmo-logo.small .letter-box {
  width: 50px;
  height: 50px;
  font-size: 1.8rem;
  border-radius: 8px;
}

.tusmo-logo.large .letter-box {
  width: 120px;
  height: 120px;
  font-size: 4.5rem;
  border-radius: 16px;
}

/* === RESPONSIVE MOBILE === */
@media (max-width: 768px) {
  .tusmo-logo {
    gap: 0.4rem;
  }
  
  .letter-box {
    width: 60px;
    height: 60px;
    font-size: 2.2rem;
    border-radius: 10px;
  }
  
  .tusmo-logo.small .letter-box {
    width: 40px;
    height: 40px;
    font-size: 1.4rem;
    border-radius: 6px;
  }
}

@media (max-width: 480px) {
  .tusmo-logo {
    gap: 0.3rem;
  }
  
  .letter-box {
    width: 45px;
    height: 45px;
    font-size: 1.6rem;
    border-radius: 8px;
  }
  
  .tusmo-logo.small .letter-box {
    width: 30px;
    height: 30px;
    font-size: 1rem;
    border-radius: 5px;
  }
}

@media (max-width: 360px) {
  .tusmo-logo {
    gap: 0.25rem;
  }
  
  .letter-box {
    width: 35px;
    height: 35px;
    font-size: 1.3rem;
    border-radius: 6px;
  }
  
  .tusmo-logo.small .letter-box {
    width: 25px;
    height: 25px;
    font-size: 0.85rem;
    border-radius: 4px;
  }
}
</style>