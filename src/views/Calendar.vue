<template>
  <div class="h-screen overflow-y-auto p-4">
    <div class="mb-6">
      <h1 class="font-bold text-4xl md:text-5xl text-gray-800">
        <span class="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">Calendar</span>
      </h1>
    </div>

    <!-- Authentication Status -->
    <div v-if="loading" class="text-center py-12 bg-white rounded-xl shadow-md p-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700 mx-auto"></div>
      <p class="text-gray-500 mt-4">Loading your calendar...</p>
    </div>

    <div v-else-if="!isAuthenticated" class="bg-white rounded-xl shadow-md p-8 text-center">
      <div class="bg-gray-100 p-4 inline-block rounded-full mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </div>
      <h2 class="text-2xl font-bold text-gray-700 mb-3">Authentication Required</h2>
      <p class="text-gray-500 max-w-md mx-auto">Please log in to view your personal calendar</p>
    </div>

    <div v-else class="bg-white rounded-xl shadow-md overflow-hidden">
      <!-- Desktop/Laptop view -->
      <VueCal
        v-if="screenType === 'desktop'"
        ref="calendarDesktop"
        :events="formattedEvents"
        :time="true"
        :hide-view-selector="true"
        :disable-views="['years', 'day', 'month']"
        active-view="week"
        class="custom-calendar"
        no-event-text=""
        :on-event-click="onEventClick"
        :time-from="7 * 60"
        :time-to="22 * 60"
        :time-step="30"
        :special-hours="getBusinessHours()"
      >
        <template #event="{ event }">
          <div class="h-full flex flex-col p-2 overflow-hidden rounded">
            <div class="font-semibold text-sm">{{ event.title }}</div>
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
        :on-event-click="onEventClick"
        :time-from="7 * 60"
        :time-to="22 * 60"
        :time-step="30"
        :special-hours="getBusinessHours()"
      >
        <template #event="{ event }">
          <div class="h-full flex flex-col p-2 overflow-hidden rounded">
            <div class="font-semibold text-sm">{{ event.title }}</div>
          </div>
        </template>
      </VueCal>

      <!-- Mobile view -->
      <VueCal
        v-if="screenType === 'mobile'"
        ref="calendarMobile"
        xsmall
        :events="formattedEvents"
        :time-from="7 * 60"
        :time-to="22 * 60"
        :disable-views="[]"
        events-count-on-year-view
        :hide-view-selector="true"
        :active-view="mobileView"
        @cell-click="onDayCellClick"
        @click-date="onDateClick"
        class="mobile-calendar"
        no-event-text=""
        :on-event-click="onEventClick"
        :special-hours="getBusinessHours()"
      >
        <template #event="{ event }">
          <div class="h-full flex flex-col p-1 overflow-hidden rounded">
            <div class="font-semibold text-xs">{{ event.title }}</div>
            <div v-if="event.joined" class="text-xs bg-green-100 text-green-600 px-1 rounded mt-0.5 inline-block">Joined</div>
          </div>
        </template>
      </VueCal>
    </div>

    <!-- Event Details Modal -->
    <div v-if="selectedEvent" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-xl max-w-md w-full mx-auto overflow-hidden">
        <div class="h-2" :class="selectedEvent.class"></div>
        <div class="p-6">
          <div class="flex justify-between items-start">
            <div class="flex items-center">
              <span class="w-4 h-4 rounded-full mr-2" :class="selectedEvent.class"></span>
              <h2 class="text-xl font-bold text-gray-800">{{ selectedEvent.title }}</h2>
            </div>
            <button @click="closeEventDetails" class="text-gray-500 hover:text-gray-700">
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
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span class="text-gray-700">End: {{ formatDate(selectedEvent.end) }}</span>
            </div>
            
            <div :class="{ hidden: !selectedEvent.description }" class="flex flex-col mb-4">
              <span class="text-gray-700 font-bold mb-2">Description</span>
              <div class="text-gray-700 bg-gray-50 rounded-lg border border-gray-100 p-4">
                {{ selectedEvent.description }}
              </div>
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
            
            <div v-if="selectedEvent.joined" class="flex items-center p-3 mb-4 bg-green-50 rounded-lg border border-green-100 text-green-700">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>You've joined this event</span>
            </div>
          </div>
          
          <div class="mt-6 flex justify-end space-x-3">
            <button 
              @click="closeEventDetails" 
              class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition duration-300"
            >
              Close
            </button>
            <button 
              v-if="canDeleteEvent(selectedEvent)"
              @click="deleteEvent(selectedEvent)" 
              class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition duration-300 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import LocationMap from '../components/LocationMap.vue';
import { ref, onMounted, onUnmounted, computed } from 'vue';
import VueCal from 'vue-cal';
import 'vue-cal/dist/vuecal.css';
import axios from 'axios';

const calendarDesktop = ref(null);
const calendarTablet = ref(null);
const calendarMobile = ref(null);
const selectedEvent = ref(null);

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

// Format date for display
const formatDate = (date) => {
  if (!date) return '';
  const options = { 
    weekday: 'short', 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return new Date(date).toLocaleString('en-US', options);
};

// Current month/year display
const currentMonthYear = computed(() => {
  const date = new Date();
  return date.toLocaleString('default', { month: 'long', year: 'numeric' });
});

const onEventClick = (event, e) => {
  selectedEvent.value = event;
};

const closeEventDetails = () => {
  selectedEvent.value = null;
};

const canDeleteEvent = (event) => {
  return event.author === userId.value;
};

const deleteEvent = async (event) => {
  // Implement delete functionality
  console.log('Deleting event:', event);
  closeEventDetails();
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

const todayView = () => {
  const today = new Date();
  if (calendarDesktop.value) calendarDesktop.value.switchToDate(today);
  if (calendarTablet.value) calendarTablet.value.switchToDate(today);
  if (calendarMobile.value) calendarMobile.value.switchToDate(today);
};

const previousPeriod = () => {
  if (screenType.value === 'desktop' && calendarDesktop.value) {
    calendarDesktop.value.previous();
  } else if (screenType.value === 'tablet' && calendarTablet.value) {
    calendarTablet.value.previous();
  } else if (screenType.value === 'mobile' && calendarMobile.value) {
    calendarMobile.value.previous();
  }
};

const nextPeriod = () => {
  if (screenType.value === 'desktop' && calendarDesktop.value) {
    calendarDesktop.value.next();
  } else if (screenType.value === 'tablet' && calendarTablet.value) {
    calendarTablet.value.next();
  } else if (screenType.value === 'mobile' && calendarMobile.value) {
    calendarMobile.value.next();
  }
};

// Highlight business hours
const getBusinessHours = () => {
  return {
    highlight: {
      class: 'business-hours',
      from: 9 * 60,     // 9am
      to: 18 * 60       // 6pm
    }
  };
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

:deep(.vuecal__time-column-header),
:deep(.vuecal__all-day) {
  background-color: #f9fafb !important; 
}

:deep(.vuecal__week-view .vuecal__cell) {
  border-color: #e5e7eb !important;
}

:deep(.vuecal__cell--today) {
  background-color: rgba(219, 234, 254, 0.3) !important; /* Light blue background */
}

:deep(.business-hours) {
  background-color: rgba(243, 244, 246, 0.7) !important; /* Very light gray */
}

:deep(.vuecal__header) {
  background-color: #f9fafb !important;
  border-bottom: 1px solid #e5e7eb;
}

:deep(.vuecal__title) {
  color: #1f2937 !important;
  font-weight: 600;
}

:deep(.vuecal__event) {
  border-radius: 0.25rem;
}

.custom-calendar {
  height: calc(100vh - 9rem);
}

.tablet-calendar {
  height: calc(100vh - 9rem);
}

.mobile-calendar {
  height: calc(100vh - 10rem);
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