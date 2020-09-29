import _ from 'lodash'
import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import Vuelidate from 'vuelidate'
import vSelect from 'vue-select'
import 'prismjs'
import 'prismjs/components/prism-turtle'
import App from './App.vue'
import { createRouter } from './router'
import { createStore } from './store'
import api from './api'
import './filters'
import './font-awesome'
import { createEntityConfigs } from '@/entity/entityConfigs'

Vue.config.productionTip = false

Vue.use(BootstrapVue)
// @ts-ignore
Vue.use(Vuelidate)
Vue.component('v-select', vSelect)


let entitySpecs = []


api.configs.getBootstrap()
  .then((config) => {
    _.set(window, 'config.persistentURL', _.get(config, 'data.persistentUrl'))
    entitySpecs = _.get(config, 'data.resourceDefinitions', [])
  })
  .finally(() => {
    const entityConfigs = createEntityConfigs(entitySpecs)
    const store = createStore(entityConfigs)
    const router = createRouter(store)

    new Vue({
      router,
      store,
      render: h => h(App),
    }).$mount('#app')
  })
