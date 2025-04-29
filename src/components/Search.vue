<template>
  <div class="mb-6">
    <!-- Search Bar -->
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
    <div v-if="showCreateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4 overflow-hidden">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto max-h-[95vh] flex flex-col">
        <div class="p-4 sm:p-6 flex-grow overflow-y-auto scrollbar-thin">
          <div class="flex justify-between items-start bg-white pb-4 mb-4 border-b">
            <h2 class="text-xl font-bold text-gray-800">Create Event</h2>
            <button @click="closeCreateModal" class="text-gray-500 hover:text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <form @submit.prevent="submitEvent" class="space-y-5">
            <!-- Event Basic Info -->
            <div>
              <label class="block text-gray-700 text-sm font-bold mb-2" for="event-title">
                Event Title
              </label>
              <input 
                v-model="newEvent.title" 
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200" 
                id="event-title" 
                type="text" 
                placeholder="Enter event title"
                required
              >
            </div>
            
            <div>
              <label class="block text-gray-700 text-sm font-bold mb-2" for="event-description">
                Event Description (Optional)
              </label>
              <textarea 
                v-model="newEvent.description" 
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200" 
                id="event-description" 
                rows="3"
                placeholder="Enter event description"
              ></textarea>
            </div>

            <!-- Category Selection -->
            <div>
              <label class="block text-gray-700 text-sm font-bold mb-2" for="event-category">
                Event Category
              </label>
              <div class="relative">
                <select
                  v-model="newEvent.category"
                  class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                  id="event-category"
                  required
                >
                  <option value="" disabled>Select a category</option>
                  <option v-for="category in availableCategories" :key="category" :value="category">
                    {{ formatCategoryName(category) }}
                  </option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                  </svg>
                </div>
              </div>
              <p class="mt-1 text-xs text-gray-500">
                Select a category for your event to help others find it
              </p>
            </div>

            <!-- Location Selection -->
            <div>
              <label class="block text-gray-700 text-sm font-bold mb-2">
                Location
              </label>

              <div v-if="!showMapPicker" class="flex items-center">
                <input 
                  v-model="newEvent.location" 
                  class="shadow appearance-none border rounded flex-grow py-2 px-3 mr-2 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200" 
                  type="text" 
                  placeholder="Enter event location address"
                  required
                >
                <button 
                  type="button"
                  @click="openMapPicker" 
                  class="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-md transition duration-300 flex items-center text-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span class="hidden sm:inline">Pick on Map</span>
                  <span class="sm:hidden">Map</span>
                </button>
              </div>

              <!-- Map Picker Modal -->
              <div v-if="showMapPicker" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl">
                  <div class="flex justify-between items-center border-b p-4">
                    <h3 class="text-lg font-semibold">Select Location on Map</h3>
                    <button @click="showMapPicker = false" class="text-gray-500 hover:text-gray-700">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div class="p-4">
                    <MapPicker ref="mapPickerRef" @location-selected="handleLocationSelected" />
                  </div>

                  <div class="border-t p-4 flex justify-end">
                    <button 
                      type="button"
                      @click="showMapPicker = false" 
                      class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition duration-300 mr-2"
                    >
                      Cancel
                    </button>
                    <button 
                      type="button"
                      @click="confirmLocation" 
                      class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition duration-300"
                      :disabled="mapPickerRef ? !mapPickerRef.selectedLocation : true"
                    >
                      Confirm Location
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Date and Time Selection -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-gray-700 text-sm font-bold mb-2" for="event-start-date">
                  Start Date & Time
                </label>
                <input 
                  v-model="newEvent.start" 
                  class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200" 
                  id="event-start-date" 
                  type="datetime-local" 
                  required
                >
              </div>
              
              <div>
                <label class="block text-gray-700 text-sm font-bold mb-2" for="event-end-date">
                  End Date & Time
                </label>
                <input 
                  v-model="newEvent.end" 
                  class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200" 
                  id="event-end-date" 
                  type="datetime-local" 
                  required
                >
              </div>
            </div>
            
            <!-- Event Visibility Toggle -->
            <div>
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
            
            <!-- Color Selection -->
            <div>
              <fieldset>
                <legend class="block text-gray-700 text-sm font-bold mb-2">
                  Event Color
                </legend>
                <div class="flex flex-wrap gap-3">
                  <button 
                    type="button"
                    aria-label="Red color"
                    @click="newEvent.class = 'bg-red-300'"
                    class="w-8 h-8 rounded-full bg-red-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
                    :class="{'ring-2 ring-offset-2 ring-red-500': newEvent.class === 'bg-red-300'}"
                  ></button>
                  <button 
                    type="button"
                    aria-label="Blue color"
                    @click="newEvent.class = 'bg-blue-300'"
                    class="w-8 h-8 rounded-full bg-blue-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                    :class="{'ring-2 ring-offset-2 ring-blue-500': newEvent.class === 'bg-blue-300'}"
                  ></button>
                  <button 
                    type="button"
                    aria-label="Green color"
                    @click="newEvent.class = 'bg-green-300'"
                    class="w-8 h-8 rounded-full bg-green-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                    :class="{'ring-2 ring-offset-2 ring-green-500': newEvent.class === 'bg-green-300'}"
                  ></button>
                  <button 
                    type="button"
                    aria-label="Yellow color"
                    @click="newEvent.class = 'bg-yellow-300'"
                    class="w-8 h-8 rounded-full bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-all duration-200"
                    :class="{'ring-2 ring-offset-2 ring-yellow-500': newEvent.class === 'bg-yellow-300'}"
                  ></button>
                  <button 
                    type="button"
                    aria-label="Purple color"
                    @click="newEvent.class = 'bg-purple-300'"
                    class="w-8 h-8 rounded-full bg-purple-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200"
                    :class="{'ring-2 ring-offset-2 ring-purple-500': newEvent.class === 'bg-purple-300'}"
                  ></button>
                </div>
              </fieldset>
            </div>
            
            <!-- Error Message -->
            <div v-if="apiError" class="p-3 bg-red-100 text-red-700 rounded-md text-sm">
              {{ apiError }}
            </div>
          </form>
        </div>
        
        <!-- Form Actions - Fixed at bottom -->
        <div class="p-4 border-t bg-gray-50 flex items-center justify-end space-x-3 rounded-b-lg">
          <button 
            type="button"
            @click="closeCreateModal" 
            class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition duration-300 text-sm"
          >
            Cancel
          </button>
          <button 
            @click="submitEvent"
            class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition duration-300 flex items-center text-sm"
            :disabled="isSubmitting"
          >
            <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isSubmitting ? 'Creating...' : 'Create Event' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import MapPicker from './MapPicker.vue';
import { ref, onMounted, nextTick } from 'vue';
import axios from 'axios';
import { isAuthenticated as checkAuth, parseJwt } from '../utils/auth';

// State variables
const searchQuery = ref('');
const showCreateModal = ref(false);
const isSubmitting = ref(false);
const isAuthenticated = ref(false);
const userToken = ref('');
const apiError = ref(null);
const showMapPicker = ref(false);
const mapPickerRef = ref(null);
const selectedLocation = ref(null);

// Category handling
const availableCategories = [
  'social', 'business', 'education', 'sports', 'entertainment', 'other'
];

const formatCategoryName = (category) => {
  if (!category) return '';
  return category.charAt(0).toUpperCase() + category.slice(1);
};

// Event form data
const newEvent = ref({
  title: '',
  description: '',
  start: '',
  end: '',
  class: 'bg-purple-300',
  type: 'private',
  category: 'social',
  location: '',
  latitude: '',
  longitude: '',
});

// Location handling
const handleLocationSelected = ({ coordinates, address }) => {
  newEvent.value.location = address;
  
  selectedLocation.value = {
    type: "Point",
    coordinates: [coordinates[1], coordinates[0]],
    address: address
  };
  
  showMapPicker.value = false;
};

const openMapPicker = () => {
  showMapPicker.value = true;
  
  nextTick(() => {
    if (mapPickerRef.value && newEvent.value.location) {
      mapPickerRef.value.searchQuery = newEvent.value.location;
      mapPickerRef.value.searchLocation?.();
    }
  });
};

// Define confirmLocation before using it in defineExpose
const confirmLocation = () => {
  if (mapPickerRef.value && mapPickerRef.value.selectedLocation && mapPickerRef.value.selectedAddress) {
    handleLocationSelected({
      coordinates: mapPickerRef.value.selectedLocation,
      address: mapPickerRef.value.selectedAddress
    });
    return true;
  } else {
    alert('Please select a location on the map first by clicking on it');
    return false;
  }
};

// Move defineExpose AFTER function definitions
const emit = defineEmits(['search', 'eventCreated']);

// Now expose methods to parent components
defineExpose({
  confirmLocation,
  searchQuery 
});

// Validation functions
const validateDates = () => {
  const startDate = new Date(newEvent.value.start);
  const endDate = new Date(newEvent.value.end);
  
  if (endDate <= startDate) {
    apiError.value = 'End time must be after start time';
    return false;
  }
  
  return true;
};

const validateCoordinates = () => {
  if (selectedLocation.value || newEvent.value.location) {
    return true;
  }
  
  if (!newEvent.value.latitude && !newEvent.value.longitude) {
    return true;
  }
  
  const lat = parseFloat(newEvent.value.latitude);
  const lng = parseFloat(newEvent.value.longitude);
  
  if (isNaN(lat) || isNaN(lng)) {
    apiError.value = 'Coordinates must be valid numbers';
    return false;
  }
  
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    apiError.value = 'Coordinates are out of valid range';
    return false;
  }
  
  return true;
};

// Search functions
const emitSearch = () => {
  emit('search', searchQuery.value);
};

const clearSearch = () => {
  searchQuery.value = '';
  emit('search', '');
};

// Modal functions
const openCreateEventModal = () => {
  apiError.value = null;
  
  if (!isAuthenticated.value) {
    alert('Please log in to create events');
    return;
  }
  
  // Set default times
  const now = new Date();
  const startDate = new Date(now);
  startDate.setMinutes(Math.ceil(now.getMinutes() / 15) * 15);
  
  const endDate = new Date(startDate);
  endDate.setHours(endDate.getHours() + 1);
  
  const formatForInput = (date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}T${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };
  
  newEvent.value = {
    title: '',
    description: '',
    start: formatForInput(startDate),
    end: formatForInput(endDate),
    class: 'bg-purple-300',
    type: 'private',
    category: 'social',
    location: '',
    latitude: '',
    longitude: '',
  };
  
  showCreateModal.value = true;
};

const closeCreateModal = () => {
  showCreateModal.value = false;
  apiError.value = null;
  selectedLocation.value = null;
  showMapPicker.value = false;
  isSubmitting.value = false;
  
  newEvent.value = {
    title: '',
    description: '',
    start: '',
    end: '',
    class: 'bg-purple-300',
    type: 'private',
    category: 'social',
    location: '',
    latitude: '',
    longitude: '',
  };
};

// Form submission
const submitEvent = async () => {
  if (!checkAuth()) {
    alert('You must be logged in to create events');
    return;
  }

  if (!newEvent.value.title || !newEvent.value.start || !newEvent.value.end) {
    apiError.value = 'Please fill out all required fields';
    return;
  }
  
  if (!validateDates()) {
    return;
  }
  
  isSubmitting.value = true;
  apiError.value = null;
  
  try {
    // Format dates for API
    const formatDateForApi = (dateString) => new Date(dateString).toISOString();
    
    // Create event data
    const eventData = {
      title: newEvent.value.title,
      description: newEvent.value.description || "",
      start: formatDateForApi(newEvent.value.start),
      end: formatDateForApi(newEvent.value.end),
      class: newEvent.value.class,
      type: newEvent.value.type,
      category: newEvent.value.category
    };
    
    // Handle location data
    if (selectedLocation.value) {
      eventData.location = selectedLocation.value;
    } else if (newEvent.value.location) {
      try {
        const response = await axios.get('https://nominatim.openstreetmap.org/search', {
          params: {
            q: newEvent.value.location,
            format: 'json',
            limit: 1
          }
        });
        
        if (response.data && response.data.length > 0) {
          const result = response.data[0];
          eventData.location = {
            type: "Point",
            coordinates: [parseFloat(result.lon), parseFloat(result.lat)],
            address: newEvent.value.location
          };
        }
      } catch (error) {
        console.error('Error geocoding address:', error);
      }
    }
    
    // Submit event to API
    const token = localStorage.getItem('token');
    const response = await fetch('https://eventium-backend.onrender.com/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(eventData)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error ${response.status}: ${errorText}`);
    }
    
    const result = await response.json();
    emit('eventCreated', result.event);
    
    isSubmitting.value = false;
    closeCreateModal();
    
  } catch (error) {
    console.error('Error creating event:', error);
    apiError.value = error.message || 'Failed to create event. Please try again.';
    isSubmitting.value = false;
  }
};

// Lifecycle hooks
onMounted(() => {
  isAuthenticated.value = checkAuth();
  
  if (isAuthenticated.value) {
    const token = localStorage.getItem('token');
    userToken.value = token;
    
    const userData = parseJwt(token);
    if (userData) {
      console.log('Authenticated as:', userData.username);
    }
  }
});
</script>

<style scoped>
@import 'leaflet/dist/leaflet.css';

.leaflet-container {
  height: 100%;
  width: 100%;
}

.leaflet-control-geosearch {
  width: 100%;
  max-width: 400px;
  margin: 10px;
}

.leaflet-control-geosearch form {
  display: flex;
}

.leaflet-control-geosearch input {
  flex-grow: 1;
  padding: 8px;
}

/* Custom scrollbar styles */
.scrollbar-thin::-webkit-scrollbar {
  width: 5px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #d1d1d1;
  border-radius: 10px;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}

/* Fix for mobile date inputs */
@media (max-width: 640px) {
  input[type="datetime-local"] {
    font-size: 16px; /* Prevents zoom on iOS */
  }
}
</style>