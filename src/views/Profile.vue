<template>
  <div class="h-screen overflow-y-auto p-5 bg-gray-50">
    <div class="max-w-4xl mx-auto pb-20">
      
      <div v-if="loading" class="flex justify-center my-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
      </div>
      
      <!-- Not authenticated view -->   
      <div v-else-if="!isAuthenticatedUser" class="bg-white rounded-lg shadow-md p-8 text-center">
        <div class="bg-gray-100 p-4 inline-block rounded-full mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-gray-700 mb-3">Authentication Required</h2>
        <p class="text-gray-500 mb-8 max-w-md mx-auto">Please log in to view your profile and manage your events</p>
        <button 
          @click="router.push('/login')" 
          class="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-8 rounded-lg transition duration-300 shadow-md hover:shadow-lg"
        >
          Go to Login
        </button>
      </div>
      
      <!-- Authenticated user view -->
      <div v-else class="space-y-6">
        <!-- Profile header -->
        <div class="bg-white rounded-xl shadow-md overflow-hidden">
          <div class="bg-gradient-to-r from-purple-500 to-indigo-600 h-24"></div>
          <div class="px-6 py-4 relative flex flex-col md:flex-row items-center md:items-end">
            <div class="bg-white p-2 rounded-full border-4 border-white -mt-12 mb-2 md:mb-0 md:mr-6 shadow-md">
              <div class="bg-purple-100 rounded-full p-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
            <div class="text-center md:text-left md:flex-grow">
              <h2 class="text-2xl font-bold text-gray-800">{{ userName }}</h2>
              <p class="text-gray-600">@{{ userUsername }}</p>
            </div>
            <div class="mt-4 md:mt-0">
              <button 
                @click="handleLogout" 
                class="bg-red-50 hover:bg-red-100 text-red-600 font-medium py-2 px-4 rounded-lg transition duration-300 inline-flex items-center border border-red-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>

        <!-- Stats and info section -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Account Stats -->
          <div class="md:col-span-1">
            <div class="bg-white rounded-xl shadow-md overflow-hidden">
              <div class="p-5 border-b border-gray-100">
                <h3 class="font-semibold text-lg text-gray-800">Event Statistics</h3>
                <p class="text-sm text-gray-500">Your event activity</p>
              </div>
              
              <div v-if="stats.loading" class="flex justify-center p-8">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
              </div>
              
              <div v-else-if="stats.loaded" class="p-5">
                <div class="grid grid-cols-1 gap-4">
                  <div class="p-4 bg-green-50 rounded-lg border border-green-100 flex items-center justify-between">
                    <div>
                      <span class="text-sm font-medium text-green-600">Joined Events</span>
                      <span class="block text-2xl font-bold text-green-700 mt-1">{{ stats.joinedEvents }}</span>
                    </div>
                    <div class="bg-green-100 p-2 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                  </div>

                  <div class="p-4 bg-purple-50 rounded-lg border border-purple-100 flex items-center justify-between">
                    <div>
                      <span class="text-sm font-medium text-purple-600">Created Events</span>
                      <span class="block text-2xl font-bold text-purple-700 mt-1">{{ stats.totalEvents }}</span>
                    </div>
                    <div class="bg-purple-100 p-2 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Account Information -->
          <div class="md:col-span-2">
            <div class="bg-white rounded-xl shadow-md overflow-hidden">
              <div class="p-5 border-b border-gray-100">
                <h3 class="font-semibold text-lg text-gray-800">Account Information</h3>
                <p class="text-sm text-gray-500">Your personal details</p>
              </div>
              
              <div class="p-5">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div class="p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <span class="block text-sm font-medium text-gray-500 mb-1">Full Name</span>
                    <span class="text-gray-800 font-medium">{{ userName }}</span>
                  </div>
                  
                  <div class="p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <span class="block text-sm font-medium text-gray-500 mb-1">Username</span>
                    <span class="text-gray-800 font-medium">{{ userUsername }}</span>
                  </div>
                  
                  <div class="p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <span class="block text-sm font-medium text-gray-500 mb-1">Email</span>
                    <span class="text-gray-800 font-medium">{{ userEmail }}</span>
                  </div>
                  
                  <div class="p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <span class="block text-sm font-medium text-gray-500 mb-1">Member Since</span>
                    <span class="text-gray-800 font-medium">{{ formatDate(accountCreated) }}</span>
                  </div>
                </div>
              </div>
            </div>
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
    const userData = getAuthUser();
    const userId = userData.id;
    
    // Fetch all events
    const eventsResponse = await axios.get(`https://eventium-backend.onrender.com/events`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    // Filter events created by the user
    const createdEvents = eventsResponse.data.filter(event => 
      event.author === userId || event.author?._id === userId
    );
    

    const joinedEvents = eventsResponse.data.filter(event => 
      event.joined === true
    );
    
    stats.value.totalEvents = createdEvents.length;
    stats.value.joinedEvents = joinedEvents.length;
    stats.value.loaded = true;
    
    console.log('Created events:', createdEvents);
    console.log('Joined events:', joinedEvents);
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
``` 