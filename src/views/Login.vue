<template>
  <div class="flex flex-col items-center justify-center min-h-screen p-4">
    <div class="w-full max-w-md bg-white rounded-lg shadow-md p-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-6 text-center">Login to Eventium</h1>
      
      <div v-if="errorMessage" class="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
        {{ errorMessage }}
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label for="username" class="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <input 
            type="username" 
            id="username" 
            v-model="username" 
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="your@username.com"
          />
        </div>
        
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="••••••••"
          />
        </div>

        <div>
          <button 
            type="submit" 
            class="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md transition duration-300"
            :disabled="isLoading"
          >
            {{ isLoading ? 'Logging in...' : 'Login' }}
          </button>
        </div>
      </form>

      <div class="mt-6 text-center">
        <p class="text-gray-600">
          Don't have an account yet? 
          <router-link to="/register" class="text-purple-600 hover:text-purple-800 font-medium">
            Register here
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const username = ref('');
const password = ref('');
const errorMessage = ref('');
const isLoading = ref(false);

onMounted(() => {
  if (localStorage.getItem('token')) {
    router.push('/');
  }
});

const handleLogin = async () => {
  try {
    const response = await axios.post('https://eventium-backend.onrender.com/login', {
      username: username.value,
      password: password.value
    });
    
    if (response.data?.jwt_token) {
      localStorage.setItem('token', response.data.jwt_token);
      
      const userResponse = await axios.get('https://eventium-backend.onrender.com/users/me', {
        headers: { Authorization: `Bearer ${response.data.jwt_token}` }
      });
      
      localStorage.setItem('user', JSON.stringify(userResponse.data));
      
      router.push('/');
    }
  } catch (error) {
    console.error('Login failed:', error);
    errorMessage.value = 'Login failed. Please check your credentials.';
  }
};
</script>
