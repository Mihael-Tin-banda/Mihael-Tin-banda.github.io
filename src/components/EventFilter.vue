<template>
  <div class="bg-white rounded-xl shadow-md overflow-hidden p-5 mb-4">
    <div class="flex items-center justify-between mb-3">
      <h3 class="font-semibold text-lg text-gray-800">Filter Events</h3>
      
      <!-- Filter count badge -->
      <span v-if="activeFilterCount > 0" class="bg-purple-100 text-purple-800 text-xs font-semibold px-2 py-1 rounded-full">
        {{ activeFilterCount }} active
      </span>
    </div>
    
    <!-- Date range filter -->
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
      <div class="relative">
        <select 
          v-model="localDateFilter" 
          class="form-select w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50 pl-3 pr-10 py-2 appearance-none"
        >
          <option value="all">All Dates</option>
          <option value="today">Today</option>
          <option value="tomorrow">Tomorrow</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>
      </div>
    </div>
    
    <!-- Category filter -->
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 mb-1">Categories</label>
      <div class="grid grid-cols-2 gap-2">
        <div v-for="category in availableCategories" :key="category" 
             class="flex items-center p-2 border rounded-lg transition-colors"
             :class="localSelectedCategories.includes(category) ? 
                    'bg-purple-50 border-purple-200' : 
                    'bg-gray-50 border-gray-200 hover:bg-gray-100'"
             @click="toggleCategory(category)">
          <input
            type="checkbox"
            :id="`category-${category}`"
            :value="category"
            v-model="localSelectedCategories"
            class="rounded border-gray-300 text-purple-600 focus:ring-purple-500 h-4 w-4"
            @click.stop
          />
          <label :for="`category-${category}`" class="ml-2 block text-gray-700 cursor-pointer select-none text-sm">
            {{ formatCategoryName(category) }}
          </label>
        </div>
      </div>
    </div>
    
    <!-- Location filter -->
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 mb-1">Location</label>
      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <input 
          type="text" 
          v-model="localLocationFilter"
          placeholder="Enter city or address"
          class="form-input block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50 pl-10 py-2"
        >
      </div>
    </div>
    
    <!-- Clear filters button -->
    <button 
      @click="clearFilters"
      :disabled="!hasActiveFilters"
      class="w-full flex justify-center items-center py-2 px-4 rounded-lg transition duration-300 mt-2"
      :class="hasActiveFilters ? 
              'bg-purple-100 hover:bg-purple-200 text-purple-800' : 
              'bg-gray-100 text-gray-400 cursor-not-allowed'"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
      Clear Filters
    </button>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';

// Props to receive from parent
const props = defineProps({
  dateFilter: {
    type: String,
    default: 'all'
  },
  locationFilter: {
    type: String,
    default: ''
  },
  selectedCategories: {
    type: Array,
    default: () => []
  },
  events: {
    type: Array,
    default: () => []
  }
});

// Emits for communicating with parent
const emit = defineEmits(['update:dateFilter', 'update:locationFilter', 'update:selectedCategories', 'filter-changed']);

// Local reactive copies of the props (with proper initialization)
const localDateFilter = ref(props.dateFilter);
const localLocationFilter = ref(props.locationFilter);
const localSelectedCategories = ref([...props.selectedCategories]); // Create a new array to avoid mutation issues

// Available categories
const availableCategories = [
  'social', 'business', 'education', 'sports', 'entertainment', 'other'
];

// Format category names for display (capitalize first letter)
const formatCategoryName = (category) => {
  if (!category) return '';
  return category.charAt(0).toUpperCase() + category.slice(1);
};

// Check if any filters are active
const hasActiveFilters = computed(() => {
  return localDateFilter.value !== 'all' || 
         localLocationFilter.value !== '' || 
         localSelectedCategories.value.length > 0;
});

// Count active filters
const activeFilterCount = computed(() => {
  let count = 0;
  if (localDateFilter.value !== 'all') count++;
  if (localLocationFilter.value !== '') count++;
  count += localSelectedCategories.value.length;
  return count;
});

// Toggle category selection
const toggleCategory = (category) => {
  const index = localSelectedCategories.value.indexOf(category);
  if (index === -1) {
    localSelectedCategories.value.push(category);
  } else {
    localSelectedCategories.value.splice(index, 1);
  }
};

// Clear all filters
const clearFilters = () => {
  localDateFilter.value = 'all';
  localLocationFilter.value = '';
  localSelectedCategories.value = [];
  
  // Emit updates
  emitChanges();
};

// Emit updates to parent in a single batch to avoid multiple re-renders
let debounceTimer = null;
const emitChanges = () => {
  // Clear any existing timer
  if (debounceTimer) clearTimeout(debounceTimer);
  
  // Set a new timer to debounce rapid changes
  debounceTimer = setTimeout(() => {
    emit('update:dateFilter', localDateFilter.value);
    emit('update:locationFilter', localLocationFilter.value);
    emit('update:selectedCategories', [...localSelectedCategories.value]); // Create a new array reference
    
    // Signal that filters have changed (after a brief delay)
    setTimeout(() => {
      emit('filter-changed');
    }, 20);
  }, 100);
};

// Watch for changes in local values and emit updates
watch(localDateFilter, emitChanges);
watch(localLocationFilter, emitChanges);
watch(localSelectedCategories, emitChanges, { deep: true });

// Watch for prop changes to update local values (with equality checks to prevent loops)
watch(() => props.dateFilter, (newVal) => {
  if (newVal !== localDateFilter.value) {
    localDateFilter.value = newVal;
  }
});

watch(() => props.locationFilter, (newVal) => {
  if (newVal !== localLocationFilter.value) {
    localLocationFilter.value = newVal;
  }
});

watch(() => props.selectedCategories, (newVal) => {
  // Deep comparison to avoid unnecessary updates
  const currentCategories = localSelectedCategories.value;
  if (newVal.length !== currentCategories.length || 
      newVal.some(cat => !currentCategories.includes(cat)) ||
      currentCategories.some(cat => !newVal.includes(cat))) {
    localSelectedCategories.value = [...newVal];
  }
}, { deep: true });
</script>