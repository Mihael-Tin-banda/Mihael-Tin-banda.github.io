<template>
  <div class="h-screen overflow-y-auto p-5">
    <div class="max-w-4xl mx-auto pb-20">
      <h1 class="font-bold text-4xl md:text-5xl text-gray-800 mb-8">Profile</h1>
      
      <div v-if="loading" class="flex justify-center my-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
      </div>
      
      <div v-else-if="!isAuthenticatedUser" class="bg-white rounded-lg shadow-md p-6 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <h2 class="text-xl font-bold text-gray-700 mb-2">Authentication Required</h2>
        <p class="text-gray-500 mb-6">Please log in to view your profile</p>
        <button 
          @click="router.push('/login')" 
          class="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-6 rounded-md transition duration-300"
        >
          Go to Login
        </button>
      </div>
      
      <div v-else class="bg-white rounded-lg shadow-md p-6 mb-8">
        <div class="flex flex-col md:flex-row items-start md:items-center mb-6">
          <div class="bg-purple-100 rounded-full p-4 mr-4 mb-4 md:mb-0">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h2 class="text-2xl font-semibold text-gray-800">{{ userName }}</h2>
            <p class="text-gray-600">{{ userUsername }}</p>
          </div>
        </div>
        
        <hr class="my-6 border-gray-200" />
        
        <div class="space-y-6">
          <!-- Account Information -->
          <div>
            <h3 class="text-lg font-medium text-gray-700 mb-3">Account Information</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="p-4 bg-gray-50 rounded-lg">
                <span class="block text-sm font-medium text-gray-500 mb-1">Full Name</span>
                <span class="text-gray-800">{{ userName }}</span>
              </div>
              
              <div class="p-4 bg-gray-50 rounded-lg">
                <span class="block text-sm font-medium text-gray-500 mb-1">Username</span>
                <span class="text-gray-800">{{ userUsername }}</span>
              </div>
              
              <div class="p-4 bg-gray-50 rounded-lg">
                <span class="block text-sm font-medium text-gray-500 mb-1">Email</span>
                <span class="text-gray-800">{{ userEmail }}</span>
              </div>
              
              <div class="p-4 bg-gray-50 rounded-lg">
                <span class="block text-sm font-medium text-gray-500 mb-1">Member Since</span>
                <span class="text-gray-800">{{ formatDate(accountCreated) }}</span>
              </div>
            </div>
          </div>
          
          <!-- Account Stats -->
          <div v-if="stats.loaded">
            <h3 class="text-lg font-medium text-gray-700 mb-3">Account Statistics</h3>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div class="p-4 bg-purple-50 rounded-lg text-center">
                <span class="block text-xl font-bold text-purple-700">{{ stats.totalEvents }}</span>
                <span class="text-sm text-gray-600">Total Events</span>
              </div>
              
              <div class="p-4 bg-green-50 rounded-lg text-center">
                <span class="block text-xl font-bold text-green-700">{{ stats.joinedEvents }}</span>
                <span class="text-sm text-gray-600">Joined Events</span>
              </div>
              
              <div class="p-4 bg-blue-50 rounded-lg text-center">
                <span class="block text-xl font-bold text-blue-700">{{ stats.publicEvents }}</span>
                <span class="text-sm text-gray-600">Public Events</span>
              </div>
            </div>
          </div>
          
          <!-- Actions -->
          <div class="pt-4 flex flex-wrap gap-3">
            <button 
              @click="handleLogout" 
              class="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition duration-300 inline-flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
            
            <button 
              @click="refreshStats" 
              class="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md transition duration-300 inline-flex items-center"
              :disabled="stats.loading"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" :class="{'animate-spin': stats.loading}">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh Stats
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { getAuthUser, isAuthenticated } from '../utils/auth'; // Update the path as needed

const router = useRouter();
const userName = ref('User');
const userUsername = ref('username');
const userEmail = ref('');
const accountCreated = ref(new Date());
const loading = ref(true);
const isAuthenticatedUser = ref(false);

// Stats
const stats = ref({
  loaded: false,
  loading: false,
  totalEvents: 0,
  joinedEvents: 0,
  publicEvents: 0
});

onMounted(async () => {
  checkAuth();
});

const checkAuth = async () => {
  loading.value = true;
  
  if (!isAuthenticated()) {
    isAuthenticatedUser.value = false;
    loading.value = false;
    return;
  }

  isAuthenticatedUser.value = true;
  const userData = getAuthUser();
  
  if (userData) {
    // Use the fields exactly as they are in your MongoDB
    if (userData.ime && userData.prezime) {
      userName.value = `${userData.ime} ${userData.prezime}`;
    } else if (userData.ime) {
      userName.value = userData.ime;
    }
    
    userUsername.value = userData.username || 'username';
    userEmail.value = userData.email || '';
    
    if (userData.createdAt) {
      accountCreated.value = new Date(userData.createdAt);
    }
    
    // Fetch user stats
    await fetchUserStats();
  } else {
    console.warn('No valid user data found in localStorage');
  }
  
  loading.value = false;
};

const fetchUserStats = async () => {
  if (!isAuthenticatedUser.value) return;
  
  stats.value.loading = true;
  
  try {
    const token = localStorage.getItem('token');
    
    // Fetch all user events
    const response = await axios.get('https://eventium-backend.onrender.com/events', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const events = response.data;
    const userData = getAuthUser();
    const userId = userData.id;
    
    // Calculate stats
    const userEvents = events.filter(event => event.author === userId);
    const joinedEvents = userEvents.filter(event => event.joined);
    const publicEvents = userEvents.filter(event => event.type === 'public');
    
    stats.value.totalEvents = userEvents.length;
    stats.value.joinedEvents = joinedEvents.length;
    stats.value.publicEvents = publicEvents.length;
    stats.value.loaded = true;
  } catch (error) {
    console.error('Error fetching user stats:', error);
  } finally {
    stats.value.loading = false;
  }
};

const refreshStats = async () => {
  await fetchUserStats();
};

const formatDate = (date) => {
  if (!date) return '';
  
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  
  router.push('/login');
};
</script>

<style scoped>
.h-screen {
  height: 100vh;
  height: calc(var(--vh, 1vh) * 100);
}

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
</style>