import { createWebHashHistory, createRouter } from 'vue-router'

import Home from './views/Home.vue'
import Discover from './views/Discover.vue'
import Calendar from './views/Calendar.vue'
import Profile from './views/Profile.vue'
import Login from './views/Login.vue'
import Register from './views/Register.vue'

const routes = [
  { 
    path: '/', 
    component: Home,
    meta: { requiresAuth: true }
  },
  { 
    path: '/discover', 
    component: Discover,
    meta: { requiresAuth: true }
  },
  { 
    path: '/calendar', 
    component: Calendar,
    meta: { requiresAuth: true }
  },
  { 
    path: '/profile', 
    component: Profile,
    meta: { requiresAuth: true }
  },
  { 
    path: '/login', 
    component: Login,
    meta: { guest: true }
  },
  { 
    path: '/register', 
    component: Register,
    meta: { guest: true }
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('token')
  
  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
    next('/login')
  } 
  else if (to.matched.some(record => record.meta.guest) && isAuthenticated) {
    next('/')
  }
  else {
    next()
  }
})

export default router