<template>
  <div class="md:m-5 rounded-2xl bg-gray-200 h-screen flex">
      <Nav class="z-50" />

    <div class="flex-1 overflow-hidden">
      <RouterView />
    </div>
  </div>
</template>


<script setup>
import Nav from './components/Nav.vue';
</script>
