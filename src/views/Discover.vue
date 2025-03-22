<template>
  <div class="grid grid-cols-1 lg:grid-cols-4 gap-4 p-4 h-screen overflow-hidden">
    
    <div class="lg:col-span-3 overflow-y-auto pr-2 pb-20 max-h-screen">
      <div class="p-3">
        <h1 class="font-bold text-5xl md:text-7xl text-gray-800 mb-8">Discover</h1>

        <!-- Use the Search component with event creation functionality -->
        <Search 
          @search="updateSearch" 
          @event-created="handleEventCreated" 
        />
        
        <div v-if="filteredEvents.length === 0" class="text-center py-12">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-gray-500 mt-4 text-lg">No public events found matching "{{ searchQuery }}"</p>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div v-for="event in filteredEvents" :key="event._id" class="bg-white rounded-lg shadow-md hover:shadow-lg transition duration-300">
          <div class="p-4">
            <h2 class="text-lg font-medium text-gray-900 mb-2">{{ event.title }}</h2>
            <p class="text-sm text-gray-500">Start: {{ formatDate(event.start) }}</p>
            <p class="text-sm text-gray-500 mb-3">End: {{ formatDate(event.end) }}</p>
            <div class="flex justify-end">
              <button 
                @click="openEventDetails(event)" 
                class="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 text-sm rounded-md transition duration-300">
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Event Details Modal -->
    <div v-if="selectedEvent" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-auto">
        <div class="p-6">
          <div class="flex justify-between items-start">
            <h2 class="text-xl font-bold text-gray-800">{{ selectedEvent.title }}</h2>
            <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div class="mt-4">
            <div class="flex items-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span class="text-gray-700">Start: {{ formatDate(selectedEvent.start) }}</span>
            </div>
            <div class="flex items-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span class="text-gray-700">End: {{ formatDate(selectedEvent.end) }}</span>
            </div>
            
            <div class="flex items-center mb-4">
              <span 
                class="w-4 h-4 rounded-full mr-2" 
                :class="selectedEvent.class">
              </span>
              <span class="text-gray-700">Category Color</span>
            </div>
          </div>
          
          <div class="mt-6 flex justify-end space-x-3">
            <button 
              @click="closeModal" 
              class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition duration-300">
              Close
            </button>
            <button 
              @click="deleteSelectedEvent" 
              class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition duration-300">
              Delete Event
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Search from '../components/Search.vue';
import axios from 'axios';
import { onMounted, ref, computed } from 'vue';

const events = ref([]);
const selectedEvent = ref(null);
const searchQuery = ref('');

// Removed showCreateModal, isSubmitting, and newEvent since they're now in Search.vue

// Computed property for filtered events
const filteredEvents = computed(() => {
  if (!searchQuery.value.trim()) return publicEvents.value;
  
  const query = searchQuery.value.toLowerCase().trim();
  return publicEvents.value.filter(event => 
    event.title.toLowerCase().includes(query)
  );
});

const publicEvents = computed(() => {
  return events.value.filter(event => event.type === "public");
});

onMounted(async () => {
  try{
    const response = await axios.get('https://eventium-backend.onrender.com/events');
    events.value = response.data;
  } catch(error) {
    console.error('Greska u dohvatu podataka', error);
  }
});

const updateSearch = (query) => {
  searchQuery.value = query;
};

const openEventDetails = (event) => {
  selectedEvent.value = event;
};

const closeModal = () => {
  selectedEvent.value = null;
};

// Handle newly created event
const handleEventCreated = (newEvent) => {
  events.value.push(newEvent);
};

// Removed openCreateEventModal, closeCreateModal, and submitEvent since they're now in Search.vue

// Delete the selected event
const deleteSelectedEvent = async () => {
  if (!confirm('Are you sure you want to delete this event?')) {
    return;
  }
  
  try {
    await axios.delete(`https://eventium-backend.onrender.com/events/${selectedEvent.value._id}`);
    events.value = events.value.filter(event => event._id !== selectedEvent.value._id);
    closeModal();
  } catch (error) {
    console.error('Error deleting event:', error);
    alert('Failed to delete event. Please try again.');
  }
};

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

.h-screen {
  height: 100vh;
  height: calc(var(--vh, 1vh) * 100);
}
</style>