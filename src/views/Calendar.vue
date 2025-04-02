<template>
  <div class="h-screen overflow-y-auto m-4 bg-gray-200 text-grey-900">
    <!-- Authentication Status -->
    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700 mx-auto"></div>
      <p class="text-gray-500 mt-4">Loading your calendar...</p>
    </div>

    <div v-else-if="!isAuthenticated" class="text-center py-12 bg-white rounded-lg shadow-md p-6">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
      <h2 class="text-xl font-bold text-gray-700 mt-4">Authentication Required</h2>
      <p class="text-gray-500 mt-2">Please log in to view your personal calendar</p>
    </div>

    <div v-else>
      <!-- Desktop/Laptop view -->
      <VueCal
        v-if="screenType === 'desktop'"
        ref="calendarDesktop"
        :events="formattedEvents"
        :time="true"
        :hide-view-selector="true"
        :disable-views="['years', 'day', 'month']"
        active-view="week"
        class="custom-calendar h-full"
        no-event-text=""
      >
        <template #event="{ event }">
          <div class="h-full flex flex-col p-1 overflow-hidden">
            <div class="font-semibold text-sm">{{ event.title }}</div>
            <div v-if="event.joined" class="text-xs text-green-600 mt-auto">Joined</div>
          </div>
        </template>
      </VueCal>

      <!-- Tablet view -->
      <VueCal
        v-if="screenType === 'tablet'"
        ref="calendarTablet"
        :events="formattedEvents"
        :time="true"
        :hide-view-selector="true"
        :disable-views="['years', 'day']"
        active-view="week"
        class="tablet-calendar"
        no-event-text=""
      >
        <template #event="{ event }">
          <div class="h-full flex flex-col p-1 overflow-hidden">
            <div class="font-semibold text-sm">{{ event.title }}</div>
            <div v-if="event.joined" class="text-xs text-green-600 mt-auto">Joined</div>
          </div>
        </template>
      </VueCal>

      <!-- Mobile view -->
      <VueCal
        v-if="screenType === 'mobile'"
        ref="calendarMobile"
        xsmall
        :events="formattedEvents"
        :time-from="10 * 60"
        :disable-views="[]"
        events-count-on-year-view
        :hide-view-selector="true"
        :active-view="mobileView"
        @cell-click="onDayCellClick"
        @click-date="onDateClick"
        class="mobile-calendar"
        no-event-text=""
      >
        <template v-if="mobileView === 'day'" #header-left>
          <button 
            @click="returnToMonthView" 
            class="bg-purple-700 hover:bg-purple-500 text-white px-2 py-1 rounded"
          >
            &larr; Back
          </button>
        </template>
        
        <template #event="{ event }">
          <div class="h-full flex flex-col p-1 overflow-hidden">
            <div class="font-semibold text-xs">{{ event.title }}</div>
            <div v-if="event.joined" class="text-xs text-green-600 mt-auto">Joined</div>
          </div>
        </template>
      </VueCal>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import VueCal from 'vue-cal';
import 'vue-cal/dist/vuecal.css';
import axios from 'axios';

const calendarDesktop = ref(null);
const calendarTablet = ref(null);
const calendarMobile = ref(null);

const screenType = ref('desktop');
const mobileView = ref('month');
const selectedDate = ref(null);
const loading = ref(true);

// Authentication state
const isAuthenticated = ref(false);
const userToken = ref('');
const userId = ref('');

const updateScreenType = () => {
  if (window.innerWidth < 640) {
    screenType.value = 'mobile';
  } else if (window.innerWidth < 1024) {
    screenType.value = 'tablet';
  } else {
    screenType.value = 'desktop';
  }
};

const onDayCellClick = (cell, event) => {
  if (screenType.value === 'mobile' && mobileView.value === 'month') {
    selectedDate.value = cell.date;
    mobileView.value = 'day';
    
    if (calendarMobile.value) {
      calendarMobile.value.switchToDate(cell.date);
    }
  }
};

const onDateClick = (date) => {
  if (screenType.value === 'mobile' && mobileView.value === 'month') {
    selectedDate.value = date;
    mobileView.value = 'day';
  }
};

const returnToMonthView = () => {
  mobileView.value = 'month';
};

// UCITAVANJE PODATAKA
const events = ref([]);

// Filter events to only show those belonging to the current user
const privateEvents = computed(() => {
  return events.value.filter(event => 
    event.type === "private" && event.author === userId.value
  );
});

// Format events for the vue-cal component
const formattedEvents = computed(() => {
  return privateEvents.value.map(event => {
    return {
      ...event,
      start: new Date(event.start),
      end: new Date(event.end),
      class: event.class || 'bg-purple-300', // Default color
      content: event.title,
      title: event.title,
      background: true,
      split: 1,
    };
  });
});

onMounted(() => {
  // Initialize UI
  updateScreenType();
  window.addEventListener('resize', updateScreenType);
  
  // Check authentication and load events
  checkAuth();
});

onUnmounted(() => {
  window.removeEventListener('resize', updateScreenType);
});

// Check if user is authenticated
async function checkAuth() {
  loading.value = true;
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
      
      // Now that we have the user ID, fetch events
      await fetchEvents();
    } catch (error) {
      console.error('Error parsing token:', error);
      loading.value = false;
    }
  } else {
    loading.value = false;
  }
}

// Fetch events with authentication
async function fetchEvents() {
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
</script>

<style scoped>
.vuecal__no-event {
  color: transparent;
}

.h-screen {
  height: 100vh;
}

.overflow-y-auto {
  overflow-y: auto;
}

.custom-calendar {
  height: calc(100vh - 2rem);
}

.tablet-calendar {
  height: calc(100vh - 2rem);
}

.mobile-calendar {
  height: auto;
  min-height: 500px;
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .tablet-calendar {
    height: auto;
    min-height: 600px;
  }
}

@media (max-width: 640px) {
  .mobile-calendar {
    min-height: 400px;
  }
  
  .m-4 {
    margin: 0.5rem;
  }
}
</style>