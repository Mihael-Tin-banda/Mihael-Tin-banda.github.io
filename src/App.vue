<template>
  <div class="md:m-5 rounded-2xl bg-gray-200 h-screen flex">
    <Nav />
    <RouterView />
  </div>
</template>

<script setup>
import Nav from './components/Nav.vue';
</script>
