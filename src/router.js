import { createMemoryHistory, createRouter } from 'vue-router'

import Home from './views/Home.vue'
import Discover from './views/Discover.vue'
import Calendar from './views/Calendar.vue'
import Profile from './views/Profile.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/discover', component: Discover },
  { path: '/calendar', component: Calendar },
  { path: '/profile', component: Profile },
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

export default router