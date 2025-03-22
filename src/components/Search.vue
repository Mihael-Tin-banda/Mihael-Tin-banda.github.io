<template>
  <div class="mb-6">
    <div class="flex items-center">
      <div class="relative flex-1 mr-3">
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
      
      <!-- Add button to create new event -->
      <button 
        @click="openCreateEventModal" 
        class="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-md transition duration-300 flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
    
    <!-- Create Event Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-auto">
        <div class="p-6">
          <div class="flex justify-between items-start mb-4">
            <h2 class="text-xl font-bold text-gray-800">Create Event</h2>
            <button @click="closeCreateModal" class="text-gray-500 hover:text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <form @submit.prevent="submitEvent">
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2" for="event-title">
                Event Title
              </label>
              <input 
                v-model="newEvent.title" 
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                id="event-title" 
                name="event-title"
                type="text" 
                placeholder="Enter event title"
                required
              >
            </div>
            
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2" for="event-start-date">
                Start Date & Time
              </label>
              <input 
                v-model="newEvent.start" 
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                id="event-start-date" 
                name="event-start-date"
                type="datetime-local" 
                required
              >
            </div>
            
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2" for="event-end-date">
                End Date & Time
              </label>
              <input 
                v-model="newEvent.end" 
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                id="event-end-date" 
                name="event-end-date"
                type="datetime-local" 
                required
              >
            </div>
            
            <!-- Event Type Toggle -->
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2">
                Event Type
              </label>
              <div class="flex items-center">
                <span class="mr-3 text-sm font-medium text-gray-700">Private</span>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    class="sr-only peer" 
                    :checked="newEvent.type === 'public'"
                    @change="newEvent.type = $event.target.checked ? 'public' : 'private'"
                  >
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
                <span class="ml-3 text-sm font-medium text-gray-700">Public</span>
              </div>
              <p class="mt-1 text-xs text-gray-500">
                {{ newEvent.type === 'public' ? 'This event will be visible to everyone' : 'This event will only be visible to you' }}
              </p>
            </div>
            
            <div class="mb-6">
              <fieldset>
                <legend class="block text-gray-700 text-sm font-bold mb-2">
                  Event Color
                </legend>
                <div class="flex space-x-2">
                  <button 
                    type="button"
                    aria-label="Red color"
                    @click="newEvent.class = 'bg-red-300'"
                    class="w-8 h-8 rounded-full bg-red-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    :class="{'ring-2 ring-offset-2 ring-red-500': newEvent.class === 'bg-red-300'}"
                  ></button>
                  <button 
                    type="button"
                    aria-label="Blue color"
                    @click="newEvent.class = 'bg-blue-300'"
                    class="w-8 h-8 rounded-full bg-blue-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    :class="{'ring-2 ring-offset-2 ring-blue-500': newEvent.class === 'bg-blue-300'}"
                  ></button>
                  <button 
                    type="button"
                    aria-label="Green color"
                    @click="newEvent.class = 'bg-green-300'"
                    class="w-8 h-8 rounded-full bg-green-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    :class="{'ring-2 ring-offset-2 ring-green-500': newEvent.class === 'bg-green-300'}"
                  ></button>
                  <button 
                    type="button"
                    aria-label="Yellow color"
                    @click="newEvent.class = 'bg-yellow-300'"
                    class="w-8 h-8 rounded-full bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                    :class="{'ring-2 ring-offset-2 ring-yellow-500': newEvent.class === 'bg-yellow-300'}"
                  ></button>
                  <button 
                    type="button"
                    aria-label="Purple color"
                    @click="newEvent.class = 'bg-purple-300'"
                    class="w-8 h-8 rounded-full bg-purple-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    :class="{'ring-2 ring-offset-2 ring-purple-500': newEvent.class === 'bg-purple-300'}"
                  ></button>
                </div>
              </fieldset>
            </div>
            
            <div class="flex items-center justify-end space-x-3">
              <button 
                type="button"
                id="cancel-button"
                name="cancel-button"
                @click="closeCreateModal" 
                class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition duration-300"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                id="submit-button"
                name="submit-button"
                class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition duration-300"
                :disabled="isSubmitting"
              >
                {{ isSubmitting ? 'Creating...' : 'Create Event' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const searchQuery = ref('');
const showCreateModal = ref(false);
const isSubmitting = ref(false);

// Initialize new event data
const newEvent = ref({
  title: '',
  start: '',
  end: '',
  class: 'bg-purple-300',
  type: 'private'
});

const emit = defineEmits(['search', 'eventCreated']);

const emitSearch = () => {
  emit('search', searchQuery.value);
};

const clearSearch = () => {
  searchQuery.value = '';
  emit('search', '');
};

// Open create event modal
const openCreateEventModal = () => {
  // Set default start and end times
  const now = new Date();
  const startDate = new Date(now);
  startDate.setMinutes(Math.ceil(now.getMinutes() / 15) * 15); // Round to nearest 15 min
  
  const endDate = new Date(startDate);
  endDate.setHours(endDate.getHours() + 1);
  
  // Format for datetime-local input
  const formatForInput = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };
  
  newEvent.value = {
    title: '',
    start: formatForInput(startDate),
    end: formatForInput(endDate),
    class: 'bg-purple-300',
    type: 'private' // Default to private
  };
  
  showCreateModal.value = true;
};

const closeCreateModal = () => {
  showCreateModal.value = false;
};

// Create a new event
const submitEvent = async () => {
  if (!newEvent.value.title || !newEvent.value.start || !newEvent.value.end) {
    alert('Please fill out all fields');
    return;
  }
  
  isSubmitting.value = true;
  
  try {
    // Format dates to match the API's expected format "YYYY-MM-DD HH:MM"
    const formatDateForApi = (dateString) => {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    };
    
    const eventData = {
      title: newEvent.value.title,
      start: formatDateForApi(newEvent.value.start),
      end: formatDateForApi(newEvent.value.end),
      class: newEvent.value.class,
      type: newEvent.value.type
    };
    
    const response = await axios.post('https://eventium-backend.onrender.com/events', eventData);
    
    // Emit event with the newly created event data
    emit('eventCreated', response.data);
    
    closeCreateModal();
    
    // Show success message
    alert('Event created successfully!');
  } catch (error) {
    console.error('Error creating event:', error);
    alert('Failed to create event. Please try again.');
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
</style>