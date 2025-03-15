<template>
  <!-- Main container with grid layout -->
  <div class="grid grid-cols-1 lg:grid-cols-4 gap-4 p-4 h-screen overflow-hidden">
    
    <!-- Left side (main content) - takes 3/4 width on large screens -->
    <div class="lg:col-span-3 overflow-y-auto pr-2 pb-20 max-h-screen">
      <div class="p-3">
        <h1 class="font-bold text-5xl md:text-7xl text-gray-800 mb-8">Home</h1>
      </div>

      <!-- Responsive Grid Layout for events -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div v-for="event in events" :key="event.id" class="bg-white rounded-lg shadow-md hover:shadow-lg transition duration-300">
          <div class="p-4">
            <h2 class="text-lg font-medium text-gray-900 mb-2">{{ event.title }}</h2>
            <p class="text-sm text-gray-500">Start: {{ formatDate(event.start) }}</p>
            <p class="text-sm text-gray-500 mb-3">End: {{ formatDate(event.end) }}</p>
            <div class="flex justify-end">
              <button class="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 text-sm rounded-md transition duration-300">
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Right side (sidebar) - takes 1/4 width on large screens -->
    <div class="hidden lg:block lg:overflow-y-auto max-h-screen pr-1">
      <SideCal />
    </div>
    
    <!-- Bottom calendar for mobile only -->
    <div class="lg:hidden mt-4">
      <SideCal />
    </div>
  </div>
</template>

<script setup>
import SideCal from '../components/SideCal.vue';
import axios from 'axios';
import { onMounted, ref } from 'vue';

const events = ref([]);

onMounted(async () => {
  try{
    const response = await axios.get('https://eventium-backend.onrender.com/events');
    events.value = response.data;
  } catch(error) {
    console.error('Greska u dohvatu podataka', error);
  }
});

// Helper function to format dates
const formatDate = (dateString) => {
  if (!dateString) return '';

  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  } catch (e) {
    return dateString;
  }
};
</script>

<style scoped>
/* Custom scrollbar styling */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #d1d1d1;
  border-radius: 10px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}

/* Ensure the container takes full height */
.h-screen {
  height: 100vh;
  height: calc(var(--vh, 1vh) * 100);
}
</style>