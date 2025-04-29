<template>
  <div class="grid grid-cols-1 lg:grid-cols-4 gap-4 p-4 h-screen overflow-hidden">
    
    <!-- MAIN CONTENT AREA -->
    <div class="lg:col-span-3 flex flex-col max-h-screen overflow-hidden">
      <!-- Header -->
      <div class="flex-none p-3">
        <div class="flex justify-between items-center mb-6">
          <h1 class="font-bold text-4xl md:text-5xl text-gray-800">
            <span class="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">Discover</span>
          </h1>
          
          <!-- Mobile filter button -->
          <button 
            @click="showMobileFilter = true" 
            class="lg:hidden flex items-center space-x-1 bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-200 text-gray-700 hover:bg-gray-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span class="text-sm font-medium">Filter</span>
            <span v-if="hasActiveFilters" class="bg-purple-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {{ activeFilterCount }}
            </span>
          </button>
        </div>
        
        <Search 
          @search="updateSearch" 
          @event-created="handleEventCreated" 
          class="mb-8"
        />
      </div>
      
      <!-- Events List -->
      <div class="flex-grow overflow-y-auto pr-2 pb-20">
        <!-- Loading State -->
        <div v-if="loading" class="text-center py-12 bg-white rounded-xl shadow-md p-8">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700 mx-auto"></div>
          <p class="text-gray-500 mt-4">Loading events...</p>
        </div>
        
        <!-- Empty State -->
        <div v-else-if="filteredEvents.length === 0" class="bg-white rounded-xl shadow-md p-8 text-center">
          <div class="bg-gray-100 p-4 inline-block rounded-full mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-gray-700 mb-3">No Events Found</h2>
          <p class="text-gray-500 max-w-md mx-auto">
            No public events found matching "{{ searchQuery }}"
          </p>
        </div>

        <!-- Event Cards Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-3">
          <div v-for="event in filteredEvents" :key="event._id" class="bg-white rounded-xl shadow-md hover:shadow-lg transition duration-300 overflow-hidden">
            <div class="h-2" :class="event.class"></div>
            <div class="p-5">
              <!-- Event Title -->
              <div class="flex items-center mb-3">
                <span class="w-3 h-3 rounded-full mr-2" :class="event.class"></span>
                <h2 class="text-lg font-medium text-gray-900 truncate">{{ event.title }}</h2>
              </div>
              
              <!-- Category Badge -->
              <div v-if="event.category" class="mb-3">
                <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium" 
                  :class="{
                    'bg-blue-100 text-blue-800': event.category === 'business',
                    'bg-green-100 text-green-800': event.category === 'education',
                    'bg-purple-100 text-purple-800': event.category === 'social',
                    'bg-red-100 text-red-800': event.category === 'sports',
                    'bg-yellow-100 text-yellow-800': event.category === 'entertainment',
                    'bg-gray-100 text-gray-800': event.category === 'other' || !event.category
                  }">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  {{ formatCategoryName(event.category) }}
                </span>
              </div>
              
              <!-- Event Times -->
              <div class="mb-3 flex items-center text-sm text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{{ formatDate(event.start) }}</span>
              </div>
              
              <div class="mb-4 flex items-center text-sm text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{{ formatDate(event.end) }}</span>
              </div>
              
              <!-- Author and Join Status -->
              <div class="flex items-center mb-4">
                <div class="flex items-center flex-grow">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span class="text-xs text-gray-400 truncate">{{ event.authorName || 'Anonymous' }}</span>
                </div>
                
                <div v-if="hasJoinedEvent(event._id)" class="flex items-center ml-2">
                  <span class="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full">Joined</span>
                </div>
              </div>
              
              <!-- Action Buttons -->
              <div class="flex justify-end space-x-2">
                <button 
                  v-if="isAuthenticated && !hasJoinedEvent(event._id)"
                  @click="joinEvent(event)" 
                  class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 text-sm rounded-lg transition duration-300 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Join
                </button>
                <button 
                  @click="openEventDetails(event)" 
                  class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 text-sm rounded-lg transition duration-300 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- MODALS -->
    <!-- Event Details Modal -->
    <div v-if="selectedEvent" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-xl max-w-md w-full mx-auto overflow-hidden">
        <div class="h-2" :class="selectedEvent.class"></div>
        <div class="p-6">
          <!-- Modal Header -->
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
          
          <!-- Modal Content -->
          <div class="mt-4">
            <!-- Event Times -->
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
            
            <!-- Category Badge -->
            <div v-if="selectedEvent.category" class="mb-3">
              <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium" 
                :class="{
                  'bg-blue-100 text-blue-800': selectedEvent.category === 'business',
                  'bg-green-100 text-green-800': selectedEvent.category === 'education',
                  'bg-purple-100 text-purple-800': selectedEvent.category === 'social',
                  'bg-red-100 text-red-800': selectedEvent.category === 'sports',
                  'bg-yellow-100 text-yellow-800': selectedEvent.category === 'entertainment',
                  'bg-gray-100 text-gray-800': selectedEvent.category === 'other' || !selectedEvent.category
                }">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                {{ formatCategoryName(selectedEvent.category) }}
              </span>
            </div>
            
            <!-- Description -->
            <div :class="{ hidden: selectedEvent.description?.length === 0 }" class="flex flex-col mb-4">
              <span class="text-gray-700 font-bold mb-2">Description</span>
              <div class="text-gray-700 bg-gray-50 rounded-lg border border-gray-100 p-4">
                {{ selectedEvent.description }}
              </div>
            </div>

            <!-- Location Map -->
            <div v-if="selectedEvent.location?.coordinates" class="flex flex-col mb-4">
              <span class="text-gray-700 font-bold mb-2">Location</span>
              <div class="h-48 rounded-lg overflow-hidden shadow-md">
                <LocationMap 
                  :coordinates="[selectedEvent.location.coordinates[1], selectedEvent.location.coordinates[0]]"
                  :title="selectedEvent.title"
                  :address="selectedEvent.location.address || formatCoordinates(selectedEvent.location.coordinates)"
                />
              </div>
            </div>
            
            <!-- Author Info -->
            <div v-if="selectedEvent.authorName" class="flex items-center mb-4 p-3 bg-gray-50 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span class="text-gray-700">Created by: {{ selectedEvent.authorName }}</span>
            </div>
            
            <!-- Join Status -->
            <div v-if="hasJoinedEvent(selectedEvent._id)" class="flex items-center p-3 mb-4 bg-green-50 rounded-lg border border-green-100 text-green-700">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>You've joined this event</span>
            </div>
          </div>
          
          <!-- Modal Actions -->
          <div class="mt-6 flex justify-end space-x-3">
            <button 
              v-if="isAuthenticated && !hasJoinedEvent(selectedEvent._id) && selectedEvent.type === 'public'"
              @click="joinEvent(selectedEvent)" 
              class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition duration-300 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Join Event
            </button>
            <button 
              @click="closeModal" 
              class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition duration-300"
            >
              Close
            </button>
            <button 
              v-if="canDeleteEvent(selectedEvent)"
              @click="deleteSelectedEvent" 
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

    <!-- Join Confirmation Modal -->
    <div v-if="joiningEvent" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-xl max-w-md w-full mx-auto overflow-hidden">
        <div class="h-2 bg-green-500"></div>
        <div class="p-6">
          <!-- Loading State -->
          <div v-if="joinLoading" class="text-center py-8">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto"></div>
            <p class="text-gray-700 mt-4">Joining event...</p>
          </div>
          
          <!-- Error State -->
          <div v-else-if="joinError" class="text-center py-8">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-red-600 mt-4">{{ joinError }}</p>
            <button 
              @click="cancelJoin" 
              class="mt-4 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition duration-300">
              Close
            </button>
          </div>
          
          <!-- Success State -->
          <div v-else-if="joinSuccess" class="text-center py-8">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <p class="text-green-600 mt-4 text-xl font-medium">Successfully joined!</p>
            <p class="text-gray-500 mt-2">The event has been added to your calendar</p>
            <button 
              @click="finishJoin" 
              class="mt-6 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition duration-300 font-medium">
              Done
            </button>
          </div>
          
          <!-- Confirmation State -->
          <div v-else>
            <h3 class="text-xl font-bold text-gray-800 mb-4">Join this event?</h3>
            <p class="text-gray-600 mb-6">
              You're about to join "<span class="font-medium">{{ joiningEvent.title }}</span>". 
              This will add it to your personal calendar.
            </p>
            <div class="flex justify-end space-x-3">
              <button 
                @click="cancelJoin" 
                class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition duration-300">
                Cancel
              </button>
              <button 
                @click="confirmJoin" 
                class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition duration-300 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                Join Event
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- SIDEBAR -->
    <div class="hidden lg:block lg:col-span-1 lg:overflow-y-auto max-h-screen z-0">
      <EventFilter
        :dateFilter="dateFilter"
        :selectedCategories="selectedCategories"
        :locationFilter="locationFilter"
        @update:dateFilter="updateDateFilter"
        @update:selectedCategories="updateSelectedCategories"
        @update:locationFilter="updateLocationFilter"
        @filter-changed="applyFilters"
      />
    </div>
    
    <!-- Mobile Filter Panel -->
    <div 
      v-if="showMobileFilter" 
      class="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden"
      @click="showMobileFilter = false"
    >
      <div 
        class="absolute right-0 top-0 h-full w-4/5 max-w-sm bg-white shadow-lg transform transition-transform duration-300 ease-in-out"
        @click.stop
      >
        <div class="flex flex-col h-full">
          <!-- Filter Header -->
          <div class="flex items-center justify-between p-4 border-b">
            <h3 class="font-medium text-lg text-gray-800">Filters</h3>
            <button 
              @click="showMobileFilter = false" 
              class="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <!-- Filter Content -->
          <div class="flex-grow overflow-y-auto p-4">
            <EventFilter
              :dateFilter="dateFilter"
              :selectedCategories="selectedCategories"
              :locationFilter="locationFilter"
              @update:dateFilter="updateDateFilter"
              @update:selectedCategories="updateSelectedCategories"
              @update:locationFilter="updateLocationFilter"
              @filter-changed="applyFilters"
            />
          </div>
          
          <!-- Filter Actions -->
          <div class="border-t p-4">
            <div class="grid grid-cols-2 gap-3">
              <button 
                @click="clearAllFilters" 
                class="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg transition duration-300"
              >
                Clear All
              </button>
              <button 
                @click="applyFiltersAndCloseModal" 
                class="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition duration-300"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import EventFilter from '../components/EventFilter.vue';
import Search from '../components/Search.vue';
import LocationMap from '../components/LocationMap.vue';
import axios from 'axios';
import { onMounted, ref, computed } from 'vue';
import { parseJwt, isAuthenticated } from '../utils/auth';

// --- STATE MANAGEMENT ---
const events = ref([]);
const selectedEvent = ref(null);
const searchQuery = ref('');
const loading = ref(true);
const joinedEvents = ref([]);

// Filter states
const dateFilter = ref('all');
const selectedCategories = ref([]);
const locationFilter = ref('');
const showMobileFilter = ref(false);

// Authentication states
const userToken = ref('');
const userId = ref('');

// Join event states
const joiningEvent = ref(null);
const joinLoading = ref(false);
const joinError = ref(null);
const joinSuccess = ref(false);

// --- COMPUTED PROPERTIES ---
// Public events only
const publicEvents = computed(() => {
  return events.value.filter(event => event.type === "public");
});

// Filtered events based on all criteria
const filteredEvents = computed(() => {
  let filtered = publicEvents.value;
  
  // Search query filtering
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim();
    filtered = filtered.filter(event => 
      event.title.toLowerCase().includes(query)
    );
  }
  
  // Date filtering
  if (dateFilter.value !== 'all') {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    
    const nextMonth = new Date(today);
    nextMonth.setMonth(today.getMonth() + 1);
    
    filtered = filtered.filter(event => {
      const eventDate = new Date(event.start);
      
      switch (dateFilter.value) {
        case 'today':
          return eventDate >= today && eventDate < tomorrow;
        case 'tomorrow':
          return eventDate >= tomorrow && eventDate < new Date(tomorrow.getTime() + 24*60*60*1000);
        case 'week':
          return eventDate >= today && eventDate < nextWeek;
        case 'month':
          return eventDate >= today && eventDate < nextMonth;
        default:
          return true;
      }
    });
  }
  
  // Category filtering
  if (selectedCategories.value.length > 0) {
    filtered = filtered.filter(event => 
      event.category && selectedCategories.value.includes(event.category)
    );
  }
  
  // Location filtering
  if (locationFilter.value.trim()) {
    const location = locationFilter.value.toLowerCase().trim();
    filtered = filtered.filter(event => 
      (event.location?.address && event.location.address.toLowerCase().includes(location)) ||
      (event.locationName && event.locationName.toLowerCase().includes(location))
    );
  }
  
  return filtered;
});

const hasActiveFilters = computed(() => {
  return dateFilter.value !== 'all' || 
         locationFilter.value.trim() !== '' || 
         selectedCategories.value.length > 0;
});

// Count active filters for the badge
const activeFilterCount = computed(() => {
  let count = 0;
  if (dateFilter.value !== 'all') count++;
  if (locationFilter.value.trim() !== '') count++;
  count += selectedCategories.value.length;
  return count;
});

// --- LIFECYCLE HOOKS ---
onMounted(async () => {
  // Check authentication
  const token = localStorage.getItem('token');
  if (token) {
    isAuthenticated.value = true;
    userToken.value = token;
    
    const decoded = parseJwt(token);
    if (decoded && decoded.id) {
      userId.value = decoded.id;
      await fetchJoinedEvents();
    }
  }
  
  await fetchEvents();
});

// --- API FUNCTIONS ---
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

async function deleteSelectedEvent() {
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
}

// --- EVENT HANDLERS ---
const updateSearch = (query) => {
  searchQuery.value = query;
};

const openEventDetails = (event) => {
  selectedEvent.value = event;
};

const closeModal = () => {
  selectedEvent.value = null;
};

const handleEventCreated = (newEvent) => {
  events.value.push(newEvent);
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

// --- FILTER FUNCTIONS ---
const updateDateFilter = (value) => {
  dateFilter.value = value;
};

const updateLocationFilter = (value) => {
  locationFilter.value = value;
};

const updateSelectedCategories = (value) => {
  selectedCategories.value = [...value];
};

// Clear all filters
const clearAllFilters = () => {
  dateFilter.value = 'all';
  locationFilter.value = '';
  selectedCategories.value = [];
  applyFilters();
};

// Apply filters with loading indicator
const applyFilters = () => {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 100);
};

// Apply filters and close mobile filter modal
const applyFiltersAndCloseModal = () => {
  applyFilters();
  showMobileFilter.value = false;
};

// --- JOIN EVENT FUNCTIONS ---
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

// --- UTILITY FUNCTIONS ---
const hasJoinedEvent = (eventId) => {
  return joinedEvents.value.some(event => event.originalEventId === eventId);
};

const canDeleteEvent = (event) => {
  if (!isAuthenticated.value || !event) return false;
  return event.author === userId.value;
};

const formatCoordinates = (coordinates) => {
  if (!coordinates || !Array.isArray(coordinates) || coordinates.length !== 2) {
    return 'Location unavailable';
  }
  return `${coordinates[1].toFixed(6)}, ${coordinates[0].toFixed(6)}`;
};

const formatCategoryName = (category) => {
  if (!category) return 'Other';
  return category.charAt(0).toUpperCase() + category.slice(1);
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

/* Slide animation for mobile filter panel */
@keyframes slideInRight {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

.fixed .absolute {
  animation: slideInRight 0.3s forwards;
}
</style>