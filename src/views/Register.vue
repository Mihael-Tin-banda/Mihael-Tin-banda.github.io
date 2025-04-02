<template>
  <div class="flex flex-col items-center justify-center min-h-screen p-4">
    <div class="w-full max-w-md bg-white rounded-lg shadow-md p-8 max-h-[90vh] overflow-y-auto">
      <h1 class="text-3xl font-bold text-gray-800 mb-6 text-center">Create Account</h1>
      
      <div v-if="errorMessage" class="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
        {{ errorMessage }}
      </div>

      <form @submit.prevent="handleRegister" class="space-y-4">
        <div>
          <label for="firstName" class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
          <input 
            type="text" 
            id="firstName" 
            v-model="firstName" 
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="John"
          />
        </div>
        
        <div>
          <label for="lastName" class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
          <input 
            type="text" 
            id="lastName" 
            v-model="lastName" 
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Doe"
          />
        </div>
        
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input 
            type="email" 
            id="email" 
            v-model="email" 
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="your.email@example.com"
          />
        </div>
        
        <div>
          <label for="username" class="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <input 
            type="text" 
            id="username" 
            v-model="username" 
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="username"
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
            placeholder="Minimum 8 characters"
            minlength="8"
          />
        </div>
        
        <div>
          <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
          <input 
            type="password" 
            id="confirmPassword" 
            v-model="confirmPassword" 
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Confirm your password"
          />
          <p v-if="passwordMismatch" class="mt-1 text-sm text-red-600">
            Passwords do not match
          </p>
        </div>

        <div class="mt-6">
          <button 
            type="submit" 
            class="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md transition duration-300"
            :disabled="isLoading || passwordMismatch"
          >
            {{ isLoading ? 'Creating Account...' : 'Register' }}
          </button>
        </div>
      </form>

      <div class="mt-6 text-center">
        <p class="text-gray-600">
          Already have an account? 
          <router-link to="/login" class="text-purple-600 hover:text-purple-800 font-medium">
            Login here
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const firstName = ref('');
const lastName = ref('');
const email = ref('');
const username = ref('');
const password = ref('');
const confirmPassword = ref('');
const errorMessage = ref('');
const isLoading = ref(false);

onMounted(() => {
  if (localStorage.getItem('token')) {
    router.push('/');
  }
});

const passwordMismatch = computed(() => {
  return password.value && confirmPassword.value && password.value !== confirmPassword.value;
});

const handleRegister = async () => {
  if (passwordMismatch.value) {
    return;
  }
  
  try {
    errorMessage.value = '';
    isLoading.value = true;
    
    const response = await axios.post('https://eventium-backend.onrender.com/register', {
      ime: firstName.value,
      prezime: lastName.value,
      email: email.value,
      username: username.value,
      password: password.value
    });

    router.push({
      path: '/login',
      query: { 
        newUser: 'true',
        username: username.value 
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    errorMessage.value = error.response?.data?.message || 'Failed to create account. Please try again later.';
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
/* Custom scrollbar styling */
.overflow-y-auto::-webkit-scrollbar {
  width: 8px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #c084fc;
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a855f7;
}
</style>