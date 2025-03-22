<template>
  <div class="min-h-screen h-screen w-screen p-2 sm:p-4 box-border">
    <div class="rounded-2xl bg-gray-200 flex flex-col sm:flex-row h-full overflow-hidden">
      <Nav class="z-50" />

      <div class="flex-1 overflow-hidden">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<script setup>
import Nav from './components/Nav.vue';
import { onMounted } from 'vue';

onMounted(() => {
  const setVhVariable = () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };

  setVhVariable();

  window.addEventListener('resize', setVhVariable);

  return () => {
    window.removeEventListener('resize', setVhVariable);
  };
});
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
}

.h-screen {
  height: 100vh; /* Fallback */
  height: calc(var(--vh, 1vh) * 100);
}
</style>