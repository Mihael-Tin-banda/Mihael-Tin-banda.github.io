<template>
  <div class="h-screen overflow-y-auto m-4 bg-gray-200 text-grey-900">
    <!-- Desktop/Laptop view -->
    <VueCal
      v-if="screenType === 'desktop'"
      ref="calendarDesktop"
      :events="privateEvents"
      :time="true"
      :hide-view-selector="true"
      :disable-views="['years', 'day', 'month']"
      active-view="week"
      class="custom-calendar h-full"
      no-event-text=""
    />

    <!-- Tablet view -->
    <VueCal
      v-if="screenType === 'tablet'"
      ref="calendarTablet"
      :events="privateEvents"
      :time="true"
      :hide-view-selector="true"
      :disable-views="['years', 'day']"
      active-view="week"
      class="tablet-calendar"
      no-event-text=""
    />

    <!-- Mobile view -->
    <VueCal
      v-if="screenType === 'mobile'"
      ref="calendarMobile"
      xsmall
      :events="privateEvents"
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
    </VueCal>
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

onMounted(() => {
  updateScreenType();
  window.addEventListener('resize', updateScreenType);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateScreenType);
});

// UCITAVANJE PODATAKA
const events = ref([]);

const privateEvents = computed(() => {
  return events.value.filter(event => event.type === "private");
});

onMounted(async () => {
  try {
    const response = await axios.get('https://eventium-backend.onrender.com/events');
    events.value = response.data;
  } catch(error) {
    console.error('Greska u dohvatu podataka', error);
  }
});
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