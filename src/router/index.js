import Vue from 'vue'
import VueRouter from 'vue-router'
import Catalog from '../views/Catalog.vue'
import Dataset from '../views/Dataset.vue'
import Distribution from '../views/Distribution.vue'
import Fdp from '../views/Fdp.vue'
import Login from '../views/Login.vue'
import NotFound from '../views/NotFound.vue'
import Users from '../views/Users.vue'
import store from '../store'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/fdp' },
  { path: '/fdp', component: Fdp },
  { path: '/fdp/catalog/:id', component: Catalog },
  { path: '/fdp/dataset/:id', component: Dataset },
  { path: '/fdp/distribution/:id', component: Distribution },
  { path: '/login', component: Login },
  { path: '/users', component: Users, meta: { requiresAuth: true } },
  { path: '*', component: NotFound },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !store.getters['auth/authenticated']) {
    next('/login')
  } else {
    next()
  }
})

export default router
