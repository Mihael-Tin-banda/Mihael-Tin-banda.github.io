<template>
  <div class="block max-w-[400px] mx-auto shadow-md rounded-lg">
    <div class="rounded-xl overflow-hidden">
      <div v-if="!isMounted" class="loading">Loading map...</div>
      <l-map 
        v-else
        ref="map" 
        :zoom="zoom" 
        :center="initialCenter"
        style="height: 400px; width: 100%"
      >
        <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
        
        <l-marker 
          v-for="(event, index) in props.events"
          :key="index"
          :lat-lng="event.coordinates"
        >
          <l-popup>
            <h3 class="font-bold">{{ event.title }}</h3>
            <p class="text-sm text-gray-700">Start: {{ formatDate(event.start) }}</p>
            <p class="text-sm text-gray-700">End: {{ formatDate(event.end) }}</p>
            <button 
              @click="viewDetails(event)"
              class="mt-2 bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 text-sm rounded-md transition duration-300"
            >
              View Details
            </button>
          </l-popup>
        </l-marker>
      </l-map>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineProps } from 'vue';
import { LMap, LTileLayer, LMarker, LPopup } from '@vue-leaflet/vue-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Ispravan način importa ikona za Vite
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';

const props = defineProps({
  events: {
    type: Array,
    required: true
  }
});

// Leaflet ikone fix za Vite
const leafletIcon = L.icon({
  iconUrl: icon,
  iconRetinaUrl: iconRetina,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = leafletIcon;

const isMounted = ref(false);
const zoom = ref(6);
const initialCenter = ref([45.8150, 15.9819]);

const url = ref('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
const attribution = ref('&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors');

onMounted(() => {
  isMounted.value = true;
});

const viewDetails = (event) => {
  console.log('Event details:', event);
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
.loading {
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f9f9f9;
  border-radius: 0.75rem;
}
</style>