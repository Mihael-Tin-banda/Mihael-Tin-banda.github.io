<template>
  <div class="mb-6">
    <div class="relative">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Search events..."
        class="w-full bg-white rounded-lg pl-10 pr-10 py-3 shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:shadow-lg transition-all duration-300"
        @input="emitSearch"
      />
      
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      
      <button 
        v-if="searchQuery"
        @click="clearSearch" 
        class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
        aria-label="Clear search"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const searchQuery = ref('');
const emit = defineEmits(['search']);

const emitSearch = () => {
  emit('search', searchQuery.value);
};

const clearSearch = () => {
  searchQuery.value = '';
  emit('search', '');
};
</script>

<style scoped>
</style>