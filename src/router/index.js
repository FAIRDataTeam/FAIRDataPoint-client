import Vue from 'vue'
import VueRouter from 'vue-router'
import Catalog from '../views/Catalog.vue'
import Dataset from '../views/Dataset.vue'
import Distribution from '../views/Distribution.vue'
import Fdp from '../views/Fdp.vue'
import NotFound from '../views/NotFound.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/fdp' },
  { path: '/fdp', component: Fdp },
  { path: '/fdp/catalog/:id', component: Catalog },
  { path: '/fdp/dataset/:id', component: Dataset },
  { path: '/fdp/distribution/:id', component: Distribution },
  { path: '*', component: NotFound },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
