<template>
  <div class="min-h-screen h-screen w-screen p-1 sm:p-3 md:p-4 box-border bg-gray-100">
    <div class="rounded-2xl bg-white shadow-lg flex flex-col sm:flex-row h-full overflow-hidden border border-gray-200">
      <!-- Navigation sidebar -->
      <Nav v-if="isAuthenticated" class="z-50" />

      <!-- Main content area -->
      <div class="flex-1 overflow-hidden relative">
        <div class="h-full">
          <RouterView />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Nav from './components/Nav.vue';
import { onMounted, ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const isAuthenticated = ref(false);

const checkAuth = () => {
  isAuthenticated.value = !!localStorage.getItem('token');
  
  if (!isAuthenticated.value && route.meta.requiresAuth) {
    router.push('/login');
  }
};

onMounted(() => {
  const setVhVariable = () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };

  setVhVariable();
  window.addEventListener('resize', setVhVariable);
  
  checkAuth();
  
  window.addEventListener('storage', (event) => {
    if (event.key === 'token') {
      checkAuth();
    }
  });

  return () => {
    window.removeEventListener('resize', setVhVariable);
    window.removeEventListener('storage', checkAuth);
  };
});

watch(() => route.path, checkAuth);
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
}

.h-screen {
  height: 100vh;
  height: calc(var(--vh, 1vh) * 100);
}
</style>