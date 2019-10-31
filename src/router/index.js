import Vue from 'vue'
import VueRouter from 'vue-router'
import Catalog from '../views/Catalog.vue'
import CatalogSettings from '../views/CatalogSettings.vue'
import Dashboard from '../views/MyMetadata.vue'
import Dataset from '../views/Dataset.vue'
import DatasetSettings from '../views/DatasetSettings.vue'
import Distribution from '../views/Distribution.vue'
import Fdp from '../views/Fdp.vue'
import Login from '../views/Login.vue'
import NotAllowed from '../views/NotAllowed.vue'
import NotFound from '../views/NotFound.vue'
import UserCreate from '../views/UserCreate.vue'
import UserDetail from '../views/UserDetail.vue'
import Users from '../views/Users.vue'
import store from '../store'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/fdp' },
  { path: '/my-metadata', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/fdp', component: Fdp },
  { path: '/fdp/catalog/:id', component: Catalog },
  { path: '/fdp/catalog/:id/settings', component: CatalogSettings },
  { path: '/fdp/dataset/:id', component: Dataset },
  { path: '/fdp/dataset/:id/settings', component: DatasetSettings },
  { path: '/fdp/distribution/:id', component: Distribution },
  { path: '/login', component: Login },
  { path: '/users', component: Users, meta: { requiresAuth: true, roles: ['ADMIN'] } },
  { path: '/users/create', component: UserCreate, meta: { requiresAuth: true, roles: ['ADMIN'] } },
  { path: '/users/:id', component: UserDetail, meta: { requiresAuth: true, roles: ['ADMIN'] } },
  { path: '/not-allowed', component: NotAllowed },
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
  } else if (to.meta.roles && to.meta.roles.indexOf(store.getters['auth/role']) === -1) {
    next('/not-allowed')
  } else {
    next()
  }
})

export default router
