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
        
        <!-- Loading indicator -->
        <div v-if="loading" class="text-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700 mx-auto"></div>
          <p class="text-gray-500 mt-4">Loading events...</p>
        </div>
        
        <div v-else-if="filteredEvents.length === 0" class="text-center py-12">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-gray-500 mt-4 text-lg">No public events found matching "{{ searchQuery }}"</p>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div v-for="event in filteredEvents" :key="event._id" class="bg-white rounded-lg shadow-md hover:shadow-lg transition duration-300">
          <div class="p-4">
            <div class="flex items-center mb-3">
              <span class="w-3 h-3 rounded-full mr-2" :class="event.class"></span>
              <h2 class="text-lg font-medium text-gray-900">{{ event.title }}</h2>
            </div>
            <p class="text-sm text-gray-500">Start: {{ formatDate(event.start) }}</p>
            <p class="text-sm text-gray-500 mb-2">End: {{ formatDate(event.end) }}</p>
            <p v-if="event.authorName" class="text-xs text-gray-400 mb-3">
              <span class="inline-flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {{ event.authorName }}
              </span>
            </p>
            <div class="flex justify-end space-x-2">
              <button 
                v-if="isAuthenticated && !hasJoinedEvent(event._id)"
                @click="joinEvent(event)" 
                class="bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-sm rounded-md transition duration-300">
                Join
              </button>
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
            <div class="flex items-center">
              <span class="w-4 h-4 rounded-full mr-2" :class="selectedEvent.class"></span>
              <h2 class="text-xl font-bold text-gray-800">{{ selectedEvent.title }}</h2>
            </div>
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
            
            <div v-if="selectedEvent.authorName" class="flex items-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span class="text-gray-700">Created by: {{ selectedEvent.authorName }}</span>
            </div>
            
            <div class="flex items-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span class="text-gray-700">Type: {{ selectedEvent.type === 'public' ? 'Public' : 'Private' }}</span>
            </div>
          </div>
          
          <div class="mt-6 flex justify-end space-x-3">
            <button 
              v-if="isAuthenticated && !hasJoinedEvent(selectedEvent._id) && selectedEvent.type === 'public'"
              @click="joinEvent(selectedEvent)" 
              class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition duration-300">
              Join Event
            </button>
            <button 
              @click="closeModal" 
              class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition duration-300">
              Close
            </button>
            <button 
              v-if="canDeleteEvent(selectedEvent)"
              @click="deleteSelectedEvent" 
              class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition duration-300">
              Delete Event
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Join Confirmation Modal -->
    <div v-if="joiningEvent" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-auto p-6">
        <div v-if="joinLoading" class="text-center py-8">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto"></div>
          <p class="text-gray-700 mt-4">Joining event...</p>
        </div>
        
        <div v-else-if="joinError" class="text-center py-8">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-red-600 mt-4">{{ joinError }}</p>
          <button 
            @click="cancelJoin" 
            class="mt-4 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition duration-300">
            Close
          </button>
        </div>
        
        <div v-else-if="joinSuccess" class="text-center py-8">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <p class="text-green-600 mt-4">Successfully joined the event!</p>
          <button 
            @click="finishJoin" 
            class="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition duration-300">
            Done
          </button>
        </div>
        
        <div v-else>
          <h3 class="text-xl font-bold text-gray-800 mb-4">Join this event?</h3>
          <p class="text-gray-600 mb-6">
            You're about to join "{{ joiningEvent.title }}". This will add it to your personal calendar.
          </p>
          <div class="flex justify-end space-x-3">
            <button 
              @click="cancelJoin" 
              class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition duration-300">
              Cancel
            </button>
            <button 
              @click="confirmJoin" 
              class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition duration-300">
              Join Event
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
import { parseJwt, isAuthenticated } from '../utils/auth'; // Update the path as needed

const events = ref([]);
const selectedEvent = ref(null);
const searchQuery = ref('');
const loading = ref(true);
const joinedEvents = ref([]);

// User authentication state
const userToken = ref('');
const userId = ref('');

// Join event functionality
const joiningEvent = ref(null);
const joinLoading = ref(false);
const joinError = ref(null);
const joinSuccess = ref(false);

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
  // Check if user is authenticated
  const token = localStorage.getItem('token');
  if (token) {
    isAuthenticated.value = true;
    userToken.value = token;
    
    // Use the safer token parsing approach
    const decoded = parseJwt(token);
    if (decoded && decoded.id) {
      userId.value = decoded.id;
      // Fetch joined events if authenticated
      await fetchJoinedEvents();
    } else {
      console.warn('Invalid token or missing user ID');
    }
  }
  
  // Fetch all events
  await fetchEvents();
});

async function fetchEvents() {
  loading.value = true;
  try {
    const headers = isAuthenticated.value 
      ? { Authorization: `Bearer ${userToken.value}` } 
      : {};
      
    const response = await axios.get('https://eventium-backend.onrender.com/events', { headers });
    events.value = response.data;
  } catch(error) {
    console.error('Error fetching events:', error);
  } finally {
    loading.value = false;
  }
}

async function fetchJoinedEvents() {
  if (!isAuthenticated.value) return;
  
  try {
    const response = await axios.get(
      'https://eventium-backend.onrender.com/events/joined',
      { headers: { Authorization: `Bearer ${userToken.value}` } }
    );
    joinedEvents.value = response.data;
  } catch (error) {
    console.error('Error fetching joined events:', error);
  }
}

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

// Delete the selected event
const deleteSelectedEvent = async () => {
  if (!confirm('Are you sure you want to delete this event?')) {
    return;
  }
  
  try {
    await axios.delete(
      `https://eventium-backend.onrender.com/events/${selectedEvent.value._id}`,
      { headers: { Authorization: `Bearer ${userToken.value}` } }
    );
    events.value = events.value.filter(event => event._id !== selectedEvent.value._id);
    closeModal();
  } catch (error) {
    console.error('Error deleting event:', error);
    alert('Failed to delete event. Please try again.');
  }
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

// Join event functionality
const joinEvent = (event) => {
  if (!isAuthenticated.value) {
    alert('Please log in to join events');
    return;
  }
  
  joiningEvent.value = event;
};

const cancelJoin = () => {
  joiningEvent.value = null;
  joinLoading.value = false;
  joinError.value = null;
  joinSuccess.value = false;
};

const confirmJoin = async () => {
  if (!joiningEvent.value) return;
  
  joinLoading.value = true;
  joinError.value = null;
  
  try {
    const response = await axios.post(
      `https://eventium-backend.onrender.com/events/join/${joiningEvent.value._id}`,
      {},
      { headers: { Authorization: `Bearer ${userToken.value}` } }
    );
    
    joinSuccess.value = true;
    
    // Update joined events
    if (response.data.event) {
      joinedEvents.value.push(response.data.event);
    }
  } catch (error) {
    console.error('Error joining event:', error);
    joinError.value = error.response?.data?.message || 'Failed to join the event. Please try again.';
  } finally {
    joinLoading.value = false;
  }
};

const finishJoin = () => {
  cancelJoin();
  closeModal();
};

// Check if user has already joined this event
const hasJoinedEvent = (eventId) => {
  return joinedEvents.value.some(event => event.originalEventId === eventId);
};

// Check if user can delete an event
const canDeleteEvent = (event) => {
  if (!isAuthenticated.value || !event) return false;
  
  // User can delete if they are the author
  return event.author === userId.value;
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