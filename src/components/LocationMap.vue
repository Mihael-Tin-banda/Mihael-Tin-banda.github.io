<template>
    <div class="location-map h-full w-full">
      <div v-if="!isMounted" class="loading-map">Loading map...</div>
      <l-map 
        v-else
        ref="map" 
        :zoom="15" 
        :center="coordinates"
        :options="{ zoomControl: false, attributionControl: false }"
        style="height: 100%; width: 100%"
      >
        <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
        <l-marker :lat-lng="coordinates">
          <l-popup>
            <h3 class="font-bold">{{ title }}</h3>
            <p v-if="address" class="text-sm text-gray-600 mt-1">{{ address }}</p>
          </l-popup>
        </l-marker>
      </l-map>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, defineProps } from 'vue';
  import { LMap, LTileLayer, LMarker, LPopup } from '@vue-leaflet/vue-leaflet';
  import 'leaflet/dist/leaflet.css';
  import L from 'leaflet';
  
  // Fix Leaflet icon issue
  import icon from 'leaflet/dist/images/marker-icon.png';
  import iconShadow from 'leaflet/dist/images/marker-shadow.png';
  import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
  
  const props = defineProps({
  coordinates: {
    type: Array,
    required: true
  },
  title: {
    type: String,
    default: 'Event Location'
  },
  address: {
    type: String,
    default: ''
  }
});
  
  // Fix Leaflet icons
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
  const url = ref('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
  const attribution = ref('&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors');
  
  onMounted(() => {
    isMounted.value = true;
  });
  </script>
  
  <style scoped>
  .loading-map {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f9f9f9;
  }
  </style>