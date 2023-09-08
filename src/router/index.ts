import _ from 'lodash'
import Vue from 'vue'
import VueRouter from 'vue-router'
import EntityCreatePage from '@/views/EntityCreatePage/index.vue'
import EntityViewPage from '@/views/EntityViewPage/index.vue'
import EntityEditPage from '@/views/EntityEditPage/index.vue'
import EntitySettingsPage from '@/views/EntitySettingsPage/index.vue'
import ResetToDefaults from '@/views/ResetToDefaults/index.vue'
import ResourceDefinitions from '@/views/ResourceDefinitions/index.vue'
import ResourceDefinitionDetail from '@/views/ResourceDefinitionDetail/index.vue'
import SchemaDetail from '@/views/SchemaDetail/index.vue'
import SchemaRelease from '@/views/SchemaRelease/index.vue'
import Schemas from '@/views/Schemas/index.vue'
import SchemasImport from '@/views/SchemasImport/index.vue'
import SchemasUpdate from '@/views/SchemasUpdate/index.vue'
import IndexDetail from '@/views/IndexDetail/index.vue'
import config from '@/config'
import SearchResults from '@/views/SearchResults/index.vue'
import IndexSettings from '@/views/IndexSettings/index.vue'
import IndexPing from '@/views/IndexPing/index.vue'
import FdpSettings from '@/views/FdpSettings/index.vue'
import Profile from '@/views/Profile/index.vue'
import Users from '../views/Users/index.vue'
import UserDetail from '../views/UserDetail/index.vue'
import UserCreate from '../views/UserCreate/index.vue'
import NotFound from '../views/NotFound/index.vue'
import NotAllowed from '../views/NotAllowed/index.vue'
import Login from '../views/Login/index.vue'
import Dashboard from '../views/MyMetadata/index.vue'
import ApiKeys from '../views/ApiKeys/index.vue'

Vue.use(VueRouter)

export function createRouter(store) {
  const indexRoutes : any[] = [
    { path: '/index/settings', component: IndexSettings, meta: { requiresAuth: true, roles: ['ADMIN'] } },
    { path: '/trigger-ping', component: IndexPing, meta: { requiresAuth: true } },
    { path: '/entry/:id', component: IndexDetail },
  ]

  const fdpRoutes: any[] = [
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
    { path: '/schemas', component: Schemas, meta: { requiresAuth: true, roles: ['ADMIN'] } },
    { path: '/schemas/create', component: SchemaDetail, meta: { requiresAuth: true, roles: ['ADMIN'] } },
    { path: '/schemas/import', component: SchemasImport, meta: { requiresAuth: true, roles: ['ADMIN'] } },
    { path: '/schemas/update', component: SchemasUpdate, meta: { requiresAuth: true, roles: ['ADMIN'] } },
    { path: '/schemas/:uuid/release', component: SchemaRelease, meta: { requiresAuth: true, roles: ['ADMIN'] } },
    { path: '/schemas/:uuid', component: SchemaDetail, meta: { requiresAuth: true, roles: ['ADMIN'] } },
    { path: '/api-keys', component: ApiKeys, meta: { requiresAuth: true } },
    { path: '/settings', component: FdpSettings, meta: { requiresAuth: true } },
    { path: '/profile/:id', component: Profile },
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
    routes: config.isIndex() ? _.concat(indexRoutes, fdpRoutes) : fdpRoutes,
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
