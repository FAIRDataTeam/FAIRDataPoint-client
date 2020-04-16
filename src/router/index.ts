import Vue from 'vue'
import VueRouter from 'vue-router'
import Dashboard from '../views/MyMetadata/index.vue'
import Repository from '../views/Repository/index.vue'
import RepositoryEdit from '../views/RepositoryEdit/index.vue'
import Login from '../views/Login/index.vue'
import NotAllowed from '../views/NotAllowed/index.vue'
import NotFound from '../views/NotFound/index.vue'
import UserCreate from '../views/UserCreate/index.vue'
import UserDetail from '../views/UserDetail/index.vue'
import Users from '../views/Users/index.vue'
import store from '../store'
import EntityCreatePage from '@/views/EntityCreatePage/index.vue'
import EntityViewPage from '@/views/EntityViewPage/index.vue'
import EntityEditPage from '@/views/EntityEditPage/index.vue'
import EntitySettingsPage from '@/views/EntitySettingsPage/index.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', component: Repository },
  { path: '/edit', component: RepositoryEdit, meta: { requiresAuth: true } },
  { path: '/my-metadata', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/login', component: Login },
  { path: '/users', component: Users, meta: { requiresAuth: true, roles: ['ADMIN'] } },
  { path: '/users/create', component: UserCreate, meta: { requiresAuth: true, roles: ['ADMIN'] } },
  { path: '/users/:id', component: UserDetail, meta: { requiresAuth: true, roles: ['ADMIN'] } },
  { path: '/not-allowed', component: NotAllowed },
  { path: '/:entity/:id', component: EntityViewPage },
  { path: '/:entity/:id/edit', component: EntityEditPage, meta: { requiresAuth: true } },
  { path: '/:entity/:id/settings', component: EntitySettingsPage, meta: { requiresAuth: true } },
  { path: '/create-:entity', component: EntityCreatePage, meta: { requiresAuth: true } },
  { path: '/:parentEntity/:id/create-:entity', component: EntityCreatePage, meta: { requiresAuth: true } },
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
