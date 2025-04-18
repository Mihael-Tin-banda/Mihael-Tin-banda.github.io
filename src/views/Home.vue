<template>
  <div class="grid grid-cols-1 lg:grid-cols-4 gap-4 p-4 h-screen overflow-hidden">
    
    <div class="lg:col-span-3 overflow-y-auto pr-2 pb-20 max-h-screen">
      <div class="p-3">
        <h1 class="font-bold text-5xl md:text-7xl text-gray-800 mb-8">Home</h1>

        <Search 
          @search="updateSearch" 
          @event-created="handleEventCreated" 
        />
        
        <!-- Loading indicator -->
        <div v-if="loading" class="text-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700 mx-auto"></div>
          <p class="text-gray-500 mt-4">Loading events...</p>
        </div>
        
        <div v-else-if="!isAuthenticated" class="text-center py-12">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <p class="text-gray-500 mt-4 text-lg">Please log in to view your personal events</p>
        </div>
        
        <div v-else-if="filteredEvents.length === 0" class="text-center py-12">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-gray-500 mt-4 text-lg">No events found matching "{{ searchQuery }}"</p>
        </div>
      </div>

      <div v-if="isAuthenticated && filteredEvents.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div v-for="event in filteredEvents" :key="event._id" class="bg-white rounded-lg shadow-md hover:shadow-lg transition duration-300">
          <div class="p-4">
            <div class="flex items-center mb-3">
              <span class="w-3 h-3 rounded-full mr-2" :class="event.class"></span>
              <h2 class="text-lg font-medium text-gray-900">{{ event.title }}</h2>
            </div>
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
            
            <div :class="{ hidden: selectedEvent.description.length === 0 }" class="flex flex-col mb-4">
              <span class="text-gray-700 font-bold mb-4">Event description</span>

              <span class="text-gray-700 bg-gray-100 rounded-2xl p-4"> {{ selectedEvent.description }}</span>
            </div>

            <div v-if="selectedEvent.location?.coordinates" class="flex flex-col mb-4">
              <span class="text-gray-700 font-bold mb-2">Location</span>

              <!-- Mini map -->
              <div class="h-48 rounded-lg overflow-hidden shadow-md">
                <LocationMap 
                  :coordinates="[selectedEvent.location.coordinates[1], selectedEvent.location.coordinates[0]]"
                  :title="selectedEvent.title"
                  :address="selectedEvent.location.address || formatCoordinates(selectedEvent.location.coordinates)"
                />
              </div>
            </div>
            
            <div v-if="selectedEvent.joined" class="flex items-center mb-4 text-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Joined event</span>
            </div>
          </div>
          
          <div class="mt-6 flex justify-end space-x-3">
            <button 
              @click="deleteSelectedEvent" 
              class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition duration-300">
              Delete Event
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- SIDEBAR COMPONENTS -->
    <!-- Desktop Layout -->
    <div class="hidden lg:block lg:overflow-y-auto max-h-screen z-0">
      <SideCal />
      
      <SideMap 
        :events="filteredEventsWithCoordinates"
        class="mt-4"
        @event-selected="handleEventSelected"
        @delete-event="deleteSelectedEvent"
      />
    </div>
    
    <!-- Mobile Layout -->
    <div class="lg:hidden mt-4">
      <SideCal />
    </div>
  </div>
</template>

<script setup>
import SideCal from '../components/SideCal.vue';
import SideMap from '../components/SideMap.vue';
import Search from '../components/Search.vue';
import LocationMap from '../components/LocationMap.vue';
import axios from 'axios';
import { onMounted, ref, computed, hydrateOnIdle } from 'vue';


const events = ref([]);
const selectedEvent = ref(null);
const searchQuery = ref('');
const loading = ref(true);

// User authentication state
const isAuthenticated = ref(false);
const userToken = ref('');
const userId = ref('');

// Computed property for filtered events
const filteredEvents = computed(() => {
  if (!searchQuery.value.trim()) return privateEvents.value;
  
  const query = searchQuery.value.toLowerCase().trim();
  return privateEvents.value.filter(event => 
    event.title.toLowerCase().includes(query)
  );
});

const filteredEventsWithCoordinates = computed(() => {
  console.log("Events before filtering:", filteredEvents.value);
  const filtered = filteredEvents.value.filter(event => {
    // Check if event has valid coordinates (latitude and longitude)
    const hasCoordinates = event.location?.coordinates && 
           Array.isArray(event.location.coordinates) && 
           event.location.coordinates.length === 2;
    
    if (!hasCoordinates) {
      console.log("Event missing coordinates:", event.title);
    }
    return hasCoordinates;
  }).map(event => {
    // Format the event data for the map component
    return {
      ...event,
      coordinates: [
        event.location.coordinates[1], // latitude
        event.location.coordinates[0]  // longitude
      ]
    };
  });
  
  console.log("Events with coordinates:", filtered);
  return filtered;
});

const formatCoordinates = (coordinates) => {
  if (!coordinates || !Array.isArray(coordinates) || coordinates.length !== 2) {
    return 'Location unavailable';
  }
  
  // Format as latitude, longitude with 6 decimal places
  return `${coordinates[1].toFixed(6)}, ${coordinates[0].toFixed(6)}`;
};

const privateEvents = computed(() => {
  return events.value.filter(event => 
    event.type === "private" && event.author === userId.value
  );
});

onMounted(async () => {
  // Check if user is authenticated
  const token = localStorage.getItem('token');
  if (token) {
    isAuthenticated.value = true;
    userToken.value = token;
    
    try {
      // Parse the JWT to get user ID
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      const decoded = JSON.parse(jsonPayload);
      userId.value = decoded.id;
    } catch (error) {
      console.error('Error parsing token:', error);
    }
  }
  
  // Fetch events with authentication if available
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

const updateSearch = (query) => {
  searchQuery.value = query;
};

const openEventDetails = (event) => {
  selectedEvent.value = event;
};

const closeModal = () => {
  selectedEvent.value = null;
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

// Handle newly created event
const handleEventCreated = (newEvent) => {
  events.value.push(newEvent);
};

const handleEventSelected = (event) => {
  selectedEvent.value = event;
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