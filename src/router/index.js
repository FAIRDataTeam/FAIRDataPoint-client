import Vue from 'vue'
import VueRouter from 'vue-router'
import Catalog from '../views/Catalog'
import CatalogEdit from '../views/CatalogEdit'
import CatalogSettings from '../views/CatalogSettings'
import Dashboard from '../views/MyMetadata'
import Dataset from '../views/Dataset'
import DatasetEdit from '../views/DatasetEdit'
import DatasetSettings from '../views/DatasetSettings'
import Distribution from '../views/Distribution'
import DistributionEdit from '../views/DistributionEdit'
import DistributionSettings from '../views/DistributionSettings'
import Repository from '../views/Repository'
import RepositoryEdit from '../views/RepositoryEdit'
import Login from '../views/Login'
import NotAllowed from '../views/NotAllowed'
import NotFound from '../views/NotFound'
import UserCreate from '../views/UserCreate'
import UserDetail from '../views/UserDetail'
import Users from '../views/Users'
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
