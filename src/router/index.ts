import Vue from 'vue'
import VueRouter from 'vue-router'
import ApiKeys from '../views/ApiKeys/index.vue'
import Dashboard from '../views/MyMetadata/index.vue'
import Login from '../views/Login/index.vue'
import NotAllowed from '../views/NotAllowed/index.vue'
import NotFound from '../views/NotFound/index.vue'
import UserCreate from '../views/UserCreate/index.vue'
import UserDetail from '../views/UserDetail/index.vue'
import Users from '../views/Users/index.vue'
import EntityCreatePage from '@/views/EntityCreatePage/index.vue'
import EntityViewPage from '@/views/EntityViewPage/index.vue'
import EntityEditPage from '@/views/EntityEditPage/index.vue'
import EntitySettingsPage from '@/views/EntitySettingsPage/index.vue'
import ResetToDefaults from '@/views/ResetToDefaults/index.vue'
import ResourceDefinitions from '@/views/ResourceDefinitions/index.vue'
import ResourceDefinitionDetail from '@/views/ResourceDefinitionDetail/index.vue'
import Shapes from '@/views/Shapes/index.vue'
import ShapeCreate from '@/views/ShapeCreate/index.vue'
import ShapeDetail from '@/views/ShapeDetail/index.vue'
import ShapesImport from '@/views/ShapesImport/index.vue'
import Index from '@/views/Index/index.vue'
import IndexDetail from '@/views/IndexDetail/index.vue'
import config from '@/config'
import SearchResults from '@/views/SearchResults/index.vue'
import IndexSettings from '@/views/IndexSettings/index.vue'
import IndexPing from '@/views/IndexPing/index.vue'
import FdpSettings from '@/views/FdpSettings/index.vue'

Vue.use(VueRouter)

export function createRouter(store) {
  const indexRoutes = [
    { path: '/', component: Index },
    { path: '/login', component: Login },
    { path: '/users', component: Users, meta: { requiresAuth: true, roles: ['ADMIN'] } },
    { path: '/users/create', component: UserCreate, meta: { requiresAuth: true, roles: ['ADMIN'] } },
    { path: '/users/current', component: UserDetail, meta: { requiresAuth: true } },
    { path: '/users/:id', component: UserDetail, meta: { requiresAuth: true, roles: ['ADMIN'] } },
    { path: '/api-keys', component: ApiKeys, meta: { requiresAuth: true } },
    { path: '/settings', component: IndexSettings, meta: { requiresAuth: true } },
    { path: '/trigger-ping', component: IndexPing, meta: { requiresAuth: true } },
    { path: '/entry/:id', component: IndexDetail },
    { path: '/search', component: SearchResults },
    { path: '/not-allowed', component: NotAllowed },
    { path: '*', component: NotFound },
  ]

  const fpdRoutes = [
    { path: '/', component: EntityViewPage },
    { path: '/edit', component: EntityEditPage, meta: { requiresAuth: true } },
    { path: '/my-metadata', component: Dashboard, meta: { requiresAuth: true } },
    { path: '/login', component: Login },
    { path: '/users', component: Users, meta: { requiresAuth: true, roles: ['ADMIN'] } },
    { path: '/users/create', component: UserCreate, meta: { requiresAuth: true, roles: ['ADMIN'] } },
    { path: '/users/current', component: UserDetail, meta: { requiresAuth: true } },
    { path: '/users/:id', component: UserDetail, meta: { requiresAuth: true, roles: ['ADMIN'] } },
    { path: '/reset-to-defaults', component: ResetToDefaults, meta: { requiresAuth: true, roles: ['ADMIN'] } },
    { path: '/resource-definitions', component: ResourceDefinitions, meta: { requiresAuth: true, roles: ['ADMIN'] } },
    { path: '/resource-definitions/create', component: ResourceDefinitionDetail, meta: { requiresAuth: true, roles: ['ADMIN'] } },
    { path: '/resource-definitions/:uuid', component: ResourceDefinitionDetail, meta: { requiresAuth: true, roles: ['ADMIN'] } },
    { path: '/shapes', component: Shapes, meta: { requiresAuth: true, roles: ['ADMIN'] } },
    { path: '/shapes/create', component: ShapeCreate, meta: { requiresAuth: true, roles: ['ADMIN'] } },
    { path: '/shapes/import', component: ShapesImport, meta: { requiresAuth: true, roles: ['ADMIN'] } },
    { path: '/shapes/:id', component: ShapeDetail, meta: { requiresAuth: true, roles: ['ADMIN'] } },
    { path: '/api-keys', component: ApiKeys, meta: { requiresAuth: true } },
    { path: '/settings', component: FdpSettings, meta: { requiresAuth: true } },
    { path: '/:entity/:id', component: EntityViewPage },
    { path: '/:entity/:id/edit', component: EntityEditPage, meta: { requiresAuth: true } },
    { path: '/:entity/:id/settings', component: EntitySettingsPage, meta: { requiresAuth: true } },
    { path: '/create-:entity', component: EntityCreatePage, meta: { requiresAuth: true } },
    { path: '/:parentEntity/:id/create-:entity', component: EntityCreatePage, meta: { requiresAuth: true } },
    { path: '/search', component: SearchResults },
    { path: '/not-allowed', component: NotAllowed },
    { path: '*', component: NotFound },
  ]

  const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: config.isIndex() ? indexRoutes : fpdRoutes,
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

  return router
}
