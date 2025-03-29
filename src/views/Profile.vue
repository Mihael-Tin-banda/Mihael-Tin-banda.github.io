<template>
  <div class="p-5 max-w-4xl mx-auto">
    <h1 class="font-bold text-4xl md:text-5xl text-gray-800 mb-8">Profile</h1>
    
    <div class="bg-white rounded-lg shadow-md p-6 mb-8">
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
        <div>
          <h3 class="text-lg font-medium text-gray-700 mb-3">Account Settings</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="p-4 bg-gray-50 rounded-lg">
              <span class="block text-sm font-medium text-gray-500 mb-1">Name</span>
              <span class="text-gray-800">{{ userName }}</span>
            </div>
            
            <div class="p-4 bg-gray-50 rounded-lg">
              <span class="block text-sm font-medium text-gray-500 mb-1">Username</span>
              <span class="text-gray-800">{{ userUsername }}</span>
            </div>
          </div>
        </div>
        
        <div class="pt-4">
          <button 
            @click="handleLogout" 
            class="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition duration-300 inline-flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7z" clip-rule="evenodd" />
              <path d="M4 8a1 1 0 011-1h4a1 1 0 110 2H5a1 1 0 01-1-1z" />
            </svg>
            Logout
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const userName = ref('');
const userUsername = ref('');

onMounted(() => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.warn('No authentication token found, redirecting to login');
    router.push('/login');
    return;
  }

  try {
    const userDataString = localStorage.getItem('user');
    
    if (userDataString && userDataString !== 'undefined' && userDataString !== 'null') {
      const userData = JSON.parse(userDataString);
      userName.value = userData.name || 'User';
      userUsername.value = userData.username || userData.name || 'username';
    } else {
      userName.value = 'User';
      userUsername.value = 'username';
      console.warn('No valid user data found in localStorage');
    }
  } catch (error) {
    console.error('Error parsing user data:', error);
    userName.value = 'User';
    userUsername.value = 'username';
    
    localStorage.removeItem('user');
  }
});

const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  
  router.push('/login');
};
</script>