<template>
  <div class="map-picker">
    <div class="mb-4">
      <div class="flex items-center">
        <input 
          type="text"
          v-model="searchQuery"
          placeholder="Search for a location..."
          class="flex-grow shadow appearance-none border rounded py-2 px-3 mr-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          @keyup.enter="searchLocation"
        />
        <button 
          @click="searchLocation" 
          class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md"
        >
          Search
        </button>
      </div>
    </div>
    
    <div id="map" ref="mapContainer" class="h-64 rounded-lg shadow-md"></div>
    
    <div v-if="selectedLocation" class="selected-location mt-4 p-3 bg-green-100 border border-green-300 rounded-lg">
      <p class="font-semibold text-green-800">✓ Location selected:</p>
      <p class="truncate">{{ selectedAddress || 'Location coordinates: ' + selectedLocation.join(', ') }}</p>
    </div>

    <div v-else class="selected-location mt-4 p-3 bg-gray-100 border border-gray-300 rounded-lg">
      <p class="text-gray-600">Click on the map to select a location</p>
    </div>
  </div>
</template>
  
  <script setup>
  import { ref, onMounted, onBeforeUnmount } from 'vue';
  import axios from 'axios';
  import 'leaflet/dist/leaflet.css';
  import L from 'leaflet';
  
  // Fix Leaflet icon issue
  let DefaultIcon = L.icon({
    iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
    shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
  
  L.Marker.prototype.options.icon = DefaultIcon;
  
  const emit = defineEmits(['location-selected']);
  const mapContainer = ref(null);
  const searchQuery = ref('');
  const selectedLocation = ref(null);
  const selectedAddress = ref('');
  
  let map = null;
  let marker = null;
  
  // Initialize map
  onMounted(() => {
    // Initialize map
    map = L.map(mapContainer.value).setView([45.8150, 15.9819], 13);
    
    // Add tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    // Add click handler
    map.on('click', handleMapClick);
  });
  
  // Clean up
  onBeforeUnmount(() => {
    if (map) {
      map.off('click', handleMapClick);
      map.remove();
    }
  });
  
  // Search for a location by address
  const searchLocation = async () => {
    if (!searchQuery.value) return;
    
    try {
      console.log("Searching for:", searchQuery.value);
      const response = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: {
          q: searchQuery.value,
          format: 'json',
          limit: 1
        }
      });
      
      if (response.data && response.data.length > 0) {
        const result = response.data[0];
        const lat = parseFloat(result.lat);
        const lng = parseFloat(result.lon);
        
        // Set map view to search result
        map.setView([lat, lng], 16);
        
        // Set marker
        if (marker) {
          marker.setLatLng([lat, lng]);
        } else {
          marker = L.marker([lat, lng]).addTo(map);
        }
        
        // Set selected location and address
        selectedLocation.value = [lat, lng];
        selectedAddress.value = result.display_name;
        
        console.log("Location found:", selectedLocation.value, selectedAddress.value);
      } else {
        console.log("No results found for search:", searchQuery.value);
        alert('No locations found for this search. Please try a different query.');
      }
    } catch (error) {
      console.error("Error searching for location:", error);
      alert('Error searching for location. Please try again.');
    }
  };
  
  // Handle map click - get address at clicked point
  const handleMapClick = async (e) => {
    const { lat, lng } = e.latlng;
    
    // Set the selected location immediately
    selectedLocation.value = [lat, lng];
    
    // Update or create marker
    if (marker) {
      marker.setLatLng([lat, lng]);
    } else {
      marker = L.marker([lat, lng]).addTo(map);
    }
    
    // Get address for clicked point using reverse geocoding
    try {
      const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
        params: {
          lat,
          lon: lng,
          format: 'json',
        },
        headers: {
          'Accept-Language': 'en'
        }
      });
      
      if (response.data) {
        selectedAddress.value = response.data.display_name;
      } else {
        selectedAddress.value = `Location at ${lat.toFixed(6)}, ${lng.toFixed(6)}`;
      }
      
      console.log("Selected location:", [lat, lng], selectedAddress.value);
    } catch (error) {
      console.error('Error getting address:', error);
      selectedAddress.value = `Location at ${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    }
  };
  
  // This will be called from the parent component
  const confirmLocation = () => {
    if (selectedLocation.value) {
      emit('location-selected', {
        coordinates: selectedLocation.value,
        address: selectedAddress.value
      });
      return true;
    }
    return false;
  };
  
  defineExpose({
    confirmLocation,
    searchLocation,
    selectedLocation,
    selectedAddress,
    searchQuery
  });
  </script>
  
  <style scoped>
  .map-picker {
    width: 100%;
    max-height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  
  /* Set the map to take available space but allow scrolling if needed */
  #map {
    min-height: 250px;
    max-height: 300px;
    flex-grow: 1;
  }
  
  /* Make the address text wrap or truncate */
  .selected-location p {
    overflow-wrap: break-word;
    word-break: break-word;
  }
  </style>