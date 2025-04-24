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
    <div v-if="showCreateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-hidden">
  <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-auto max-h-[90vh] flex flex-col">
    <div class="p-6 flex-grow overflow-y-auto">
      <div class="flex justify-between items-start sticky top-0 bg-white pb-4 mb-4 border-b">
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
            
            <!-- Added Description Field -->
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2" for="event-description">
                Event Description (Optional)
              </label>
              <textarea 
                v-model="newEvent.description" 
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                id="event-description" 
                name="event-description"
                rows="3"
                placeholder="Enter event description"
              ></textarea>
            </div>

            <!-- ODABIR LOKACIJE -->

            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2">
                Location
              </label>

              <div v-if="!showMapPicker" class="flex items-center">
                <input 
                  v-model="newEvent.location" 
                  class="shadow appearance-none border rounded flex-grow py-2 px-3 mr-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                  type="text" 
                  placeholder="Enter event location address"
                  required
                >
                <button 
                  type="button"
                  @click="openMapPicker" 
                  class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition duration-300 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Pick on Map
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

                  <!-- Use MapPicker component -->
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

            <!-- ODABIR DATUMA -->
            
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
            
            <!-- Added API Error Message -->
            <div v-if="apiError" class="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {{ apiError }}
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
import MapPicker from './MapPicker.vue';
import { ref, onMounted, nextTick } from 'vue';
import axios from 'axios';
// Uncomment this import since you have the auth utilities
import { isAuthenticated as checkAuth, parseJwt } from '../utils/auth';

const searchQuery = ref('');
const showCreateModal = ref(false);
const isSubmitting = ref(false);
const isAuthenticated = ref(false);
const userToken = ref('');

// Add new state variables for better error handling
const apiError = ref(null);
const isLoading = ref(false);

// Initialize new event data with description
const newEvent = ref({
  title: '',
  description: '',
  start: '',
  end: '',
  class: 'bg-purple-300',
  type: 'private',
  latitude: '',
  longitude: '',
  address: ''
});

const showMapPicker = ref(false);
const mapPickerRef = ref(null);
const selectedLocation = ref(null);

const handleLocationSelected = ({ coordinates, address }) => {
  // Set the location in the form
  newEvent.value.location = address;
  
  // Store the GeoJSON formatted location
  selectedLocation.value = {
    type: "Point",
    coordinates: [coordinates[1], coordinates[0]], // [longitude, latitude] for GeoJSON
    address: address
  };
  
  // Close the map picker
  showMapPicker.value = false;
  
  // Debug
  console.log("Location selected:", coordinates, address);
};

// Add this function near your validateDates function in the <script setup> section
const validateCoordinates = () => {
  // If we have a selected location from the map, it's valid
  if (selectedLocation.value) {
    return true;
  }
  
  // If we have a text location but no coordinates, we'll try geocoding in submitEvent
  if (newEvent.value.location) {
    return true;
  }
  
  // If individual lat/lng were provided (legacy code), validate them
  if (!newEvent.value.latitude && !newEvent.value.longitude) {
    return true;  // Both empty is fine (location is optional)
  }
  
  // Parse the values to check if they're valid numbers
  const lat = parseFloat(newEvent.value.latitude);
  const lng = parseFloat(newEvent.value.longitude);
  
  if (isNaN(lat) || isNaN(lng)) {
    apiError.value = 'Coordinates must be valid numbers';
    return false;
  }
  
  // Check if values are in valid ranges
  if (lat < -90 || lat > 90) {
    apiError.value = 'Latitude must be between -90 and 90';
    return false;
  }
  
  if (lng < -180 || lng > 180) {
    apiError.value = 'Longitude must be between -180 and 180';
    return false;
  }
  
  return true;
};

const confirmLocation = () => {
  if (mapPickerRef.value) {
    console.log("Confirming location, ref exists");
    
    if (mapPickerRef.value.selectedLocation && mapPickerRef.value.selectedAddress) {
      // Directly access the MapPicker's selected location and address
      handleLocationSelected({
        coordinates: mapPickerRef.value.selectedLocation,
        address: mapPickerRef.value.selectedAddress
      });
      return true;
    } else {
      console.warn("No location selected in map picker");
      alert('Please select a location on the map first by clicking on it');
      return false;
    }
  } else {
    console.error("Map picker reference not available");
    return false;
  }
};

const openMapPicker = () => {
  showMapPicker.value = true;
  
  // If they've typed an address, search for it when the map opens
  nextTick(() => {
    if (mapPickerRef.value && newEvent.value.location) {
      mapPickerRef.value.searchQuery = newEvent.value.location;
      // Use optional chaining to avoid errors if searchLocation doesn't exist
      mapPickerRef.value.searchLocation?.();
    }
  });
};

defineExpose({
  confirmLocation,
  searchQuery 
});

const emit = defineEmits(['search', 'eventCreated']);

onMounted(() => {
  // Use the auth utility for checking authentication
  isAuthenticated.value = checkAuth();
  
  if (isAuthenticated.value) {
    const token = localStorage.getItem('token');
    userToken.value = token;
    
    // Use the parseJwt utility to get user info
    const userData = parseJwt(token);
    if (userData) {
      console.log('Authenticated as:', userData.username);
    }
  }
});

const emitSearch = () => {
  emit('search', searchQuery.value);
};

const clearSearch = () => {
  searchQuery.value = '';
  emit('search', '');
};

// Date validation function
const validateDates = () => {
  const startDate = new Date(newEvent.value.start);
  const endDate = new Date(newEvent.value.end);
  
  if (endDate <= startDate) {
    apiError.value = 'End time must be after start time';
    return false;
  }
  
  return true;
};

// Open create event modal
const openCreateEventModal = () => {
  // Reset any previous errors
  apiError.value = null;
  
  // Check if user is authenticated
  if (!isAuthenticated.value) {
    alert('Please log in to create events');
    return;
  }
  
  // Set default start and end times
  const now = new Date();
  const startDate = new Date(now);
  startDate.setMinutes(Math.ceil(now.getMinutes() / 15) * 15);
  
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
    description: '',
    start: formatForInput(startDate),
    end: formatForInput(endDate),
    class: 'bg-purple-300',
    type: 'private',
    latitude: '',
    longitude: '',
    address: ''
  };
  
  showCreateModal.value = true;
};

const closeCreateModal = () => {
  showCreateModal.value = false;
  apiError.value = null;
  
  // Reset form state and clear any selections
  newEvent.value = {
    title: '',
    description: '',
    start: '',
    end: '',
    class: 'bg-purple-300',
    type: 'private',
    location: '',
    latitude: '',
    longitude: '',
    address: ''
  };
  
  // Reset other related state
  selectedLocation.value = null;
  showMapPicker.value = false;
  isSubmitting.value = false;
};

// Create a new event with improved error handling
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
    const formatDateForApi = (dateString) => {
      return new Date(dateString).toISOString();
    };
    
    // Create the basic event data
    const eventData = {
      title: newEvent.value.title,
      description: newEvent.value.description || "",
      start: formatDateForApi(newEvent.value.start),
      end: formatDateForApi(newEvent.value.end),
      class: newEvent.value.class,
      type: newEvent.value.type
    };
    
    // Add location data if we have it from the map picker
    if (selectedLocation.value) {
      // Use the selectedLocation object directly since it's already formatted correctly
      eventData.location = selectedLocation.value;
      console.log('Using selected location:', selectedLocation.value);
    }
    // If we don't have location data but have an address, try to geocode it
    else if (newEvent.value.location) {
      try {
        console.log('Geocoding address:', newEvent.value.location);
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
          console.log('Geocoded location:', eventData.location);
        }
      } catch (error) {
        console.error('Error geocoding address:', error);
        // Continue without location if geocoding fails
      }
    }
    
    console.log('Sending event data:', JSON.stringify(eventData, null, 2));
    
    // Use the fetch API like in the test function for consistency
    const token = localStorage.getItem('token');
    const response = await fetch('https://eventium-backend.onrender.com/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(eventData)
    });
    
    // Check if request was successful
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error ${response.status}: ${errorText}`);
    }
    
    // Parse the response
    const result = await response.json();
    console.log('Event created successfully:', result);
    
    // Emit event with the newly created event data
    emit('eventCreated', result.event);
    
    // Success - explicitly reset state before closing modal
    isSubmitting.value = false;
    
    // Call closeCreateModal to properly reset and close the modal
    closeCreateModal();
    
  } catch (error) {
    console.error('Error creating event:', error);
    
    // Handle error responses
    if (error.message) {
      apiError.value = error.message;
    } else {
      apiError.value = 'Failed to create event. Please try again.';
    }
    
    // Make sure to set isSubmitting to false even if there's an error
    isSubmitting.value = false;
  }
};
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
</style>