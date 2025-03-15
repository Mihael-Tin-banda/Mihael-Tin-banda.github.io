<template>
    <div class="max-w-[400] mx-auto p-6 bg-white shadow-md rounded-lg">
      <!-- Kalendar -->
      <div class="rounded-xl p-3">
        <vue-cal
          selected-date="2018-11-19"
          xsmall
          hide-view-selector
          :time-from="10 * 60"
          :disable-views="['day']"
          events-count-on-year-view
          active-view="month"
          :events="events">
        </vue-cal>
      </div>

      <!-- Karta dogadaja -->
    </div>
  
  </template>
  
  <script setup>
    import VueCal from 'vue-cal';
    import 'vue-cal/dist/vuecal.css';
    import axios from 'axios';
    import { onMounted, ref } from 'vue';

    const events = ref([]);

    onMounted(async () => {
      try{
        const response = await axios.get('https://eventium-backend.onrender.com/events');
        events.value = response.data;
      } catch(error) {
        console.error('Greska u dohvatu podataka', error);
      }
    });
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
  