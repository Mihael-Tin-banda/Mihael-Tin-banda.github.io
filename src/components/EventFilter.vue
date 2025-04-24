<template>
  <div class="bg-white rounded-xl shadow-md overflow-hidden p-5 mb-4">
    <h3 class="font-semibold text-lg text-gray-800 mb-3">Filter Events</h3>
    
    <!-- Date range filter -->
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
      <select 
        v-model="localDateFilter" 
        class="form-select w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
      >
        <option value="all">All Dates</option>
        <option value="today">Today</option>
        <option value="tomorrow">Tomorrow</option>
        <option value="week">This Week</option>
        <option value="month">This Month</option>
      </select>
    </div>
    
    <!-- Location filter -->
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 mb-1">Location</label>
      <input 
        type="text" 
        v-model="localLocationFilter"
        placeholder="Enter city or address"
        class="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
      >
    </div>
    
    <!-- Clear filters button -->
    <button 
      @click="clearFilters"
      class="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg transition duration-300 flex justify-center items-center mt-2"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
      Clear Filters
    </button>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

// Props to receive from parent - removed selectedCategories prop
const props = defineProps({
  dateFilter: {
    type: String,
    default: 'all'
  },
  locationFilter: {
    type: String,
    default: ''
  },
  events: {
    type: Array,
    default: () => []
  }
});

// Emits for communicating with parent - removed update:selectedCategories
const emit = defineEmits(['update:dateFilter', 'update:locationFilter', 'filter-changed']);

// Local reactive copies of the props - removed localSelectedCategories
const localDateFilter = ref(props.dateFilter);
const localLocationFilter = ref(props.locationFilter);

// Clear all filters - removed clearing selectedCategories
const clearFilters = () => {
  localDateFilter.value = 'all';
  localLocationFilter.value = '';
  
  // Emit updates
  emitChanges();
};

// Watch for changes in local values and emit updates - removed watch for localSelectedCategories
watch(localDateFilter, () => emitChanges());
watch(localLocationFilter, () => emitChanges());

// Watch for prop changes to update local values - removed watch for props.selectedCategories
watch(() => props.dateFilter, (newVal) => {
  localDateFilter.value = newVal;
});
watch(() => props.locationFilter, (newVal) => {
  localLocationFilter.value = newVal;
});

// Emit updates to parent - removed update:selectedCategories emit
const emitChanges = () => {
  emit('update:dateFilter', localDateFilter.value);
  emit('update:locationFilter', localLocationFilter.value);
  emit('filter-changed');
};
</script>