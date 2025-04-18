<template>
  <div class="hidden lg:block max-w-[400px] mx-auto bg-white shadow-md rounded-xl">
      <vue-cal
        xsmall
        hide-view-selector
        :disable-views="['year', 'week', 'day']"
        :events="formattedEvents"
        :editable-events="false"
        :clickable-events="true"
        :draggable-events="false"
        :time="false"
        active-view="month"
        :time-from="0"
        :time-to="24"
        :on-event-click="showEventDetails"
        :on-cell-click="() => {}"
        :cell-click-hold="false"
        class="p-4"
      >
      </vue-cal>
    
    <!-- Event Details Modal -->
    <div v-if="selectedEvent" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-auto">
        <div class="p-6">
          <div class="flex justify-between items-start">
            <div class="flex items-center">
              <span class="w-4 h-4 rounded-full mr-2" :class="selectedEvent.class"></span>
              <h2 class="text-xl font-bold text-gray-800">{{ selectedEvent.title }}</h2>
            </div>
            <button @click="selectedEvent = null" class="text-gray-500 hover:text-gray-700">
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
            
            <div v-if="selectedEvent.description" class="mb-4">
              <h3 class="font-semibold text-gray-700 mb-1">Description:</h3>
              <p class="text-gray-600">{{ selectedEvent.description }}</p>
            </div>
            
            <div v-if="selectedEvent.authorName" class="flex items-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span class="text-gray-700">Created by: {{ selectedEvent.authorName }}</span>
            </div>
          </div>
          
          <div class="mt-6 flex justify-end">
            <button 
              @click="selectedEvent = null" 
              class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition duration-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import VueCal from 'vue-cal';
  import 'vue-cal/dist/vuecal.css';
  import axios from 'axios';
  import { onMounted, ref, computed } from 'vue';
  import { isAuthenticated as checkAuth } from '../utils/auth';

  const events = ref([]);
  const selectedEvent = ref(null);
  const userEvents = ref([]);

  onMounted(async () => {
    try {
      const headers = {};
      if (checkAuth()) {
        headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
      }
      
      const response = await axios.get('https://eventium-backend.onrender.com/events', { headers });
      events.value = response.data;
      
      // If user is authenticated, fetch their joined events too
      if (checkAuth()) {
        const joinedResponse = await axios.get(
          'https://eventium-backend.onrender.com/events/joined',
          { headers }
        );
        userEvents.value = joinedResponse.data;
      }
    } catch(error) {
      console.error('Error fetching events:', error);
    }
  });

  // Format the events for vue-cal
  const formattedEvents = computed(() => {
    // Combine all events relevant to the user
    const allUserEvents = [
      ...events.value.filter(event => event.type === "private" || event.joined),
      ...userEvents.value
    ];
    
    return allUserEvents.map(event => {
      // Parse dates from your API format
      const startDate = new Date(event.start);
      const endDate = new Date(event.end);
      
      return {
        start: startDate,
        end: endDate,
        title: event.title,
        class: event.class || 'bg-purple-300',
        content: event.description,
        // Keep original data for reference
        originalEvent: event
      };
    });
  });
  
  // Handle event click
  const showEventDetails = (event) => {
    selectedEvent.value = event.originalEvent;
  };
  
  // Format date for display
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
/* Dash indicator */
.vuecal__cell-events-count {
  width: 18px;
  height: 2px;
  color: transparent;
}

/* Dot indicator */
.vuecal__cell-events-count {
  width: 4px;
  min-width: 0;
  height: 4px;
  padding: 0;
  color: transparent;
}

/* Cell background indicator */
.vuecal__cell--has-events {background-color: #fffacd;}
.vuecal__cell-events-count {display: none;}
</style>