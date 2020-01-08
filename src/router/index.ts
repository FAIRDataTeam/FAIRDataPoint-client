import Vue from 'vue'
import VueRouter from 'vue-router'
import Catalog from '../views/Catalog/index.vue'
import CatalogEdit from '../views/CatalogEdit/index.vue'
import CatalogSettings from '../views/CatalogSettings/index.vue'
import Dashboard from '../views/MyMetadata/index.vue'
import Dataset from '../views/Dataset/index.vue'
import DatasetEdit from '../views/DatasetEdit/index.vue'
import DatasetSettings from '../views/DatasetSettings/index.vue'
import Distribution from '../views/Distribution/index.vue'
import DistributionEdit from '../views/DistributionEdit/index.vue'
import DistributionSettings from '../views/DistributionSettings/index.vue'
import Repository from '../views/Repository/index.vue'
import RepositoryEdit from '../views/RepositoryEdit/index.vue'
import Login from '../views/Login/index.vue'
import NotAllowed from '../views/NotAllowed/index.vue'
import NotFound from '../views/NotFound/index.vue'
import UserCreate from '../views/UserCreate/index.vue'
import UserDetail from '../views/UserDetail/index.vue'
import Users from '../views/Users/index.vue'
import store from '../store'

Vue.use(VueRouter)

const routes = [
  { path: '/', component: Repository },
  { path: '/my-metadata', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/edit', component: RepositoryEdit, meta: { requiresAuth: true } },
  { path: '/catalog/:id', component: Catalog },
  { path: '/catalog/:id/edit', component: CatalogEdit, meta: { requiresAuth: true } },
  { path: '/catalog/:id/settings', component: CatalogSettings, meta: { requiresAuth: true } },
  { path: '/dataset/:id', component: Dataset },
  { path: '/dataset/:id/edit', component: DatasetEdit, meta: { requiresAuth: true } },
  { path: '/dataset/:id/settings', component: DatasetSettings, meta: { requiresAuth: true } },
  { path: '/distribution/:id', component: Distribution },
  { path: '/distribution/:id/edit', component: DistributionEdit, meta: { requiresAuth: true } },
  { path: '/distribution/:id/settings', component: DistributionSettings, meta: { requiresAuth: true } },
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
