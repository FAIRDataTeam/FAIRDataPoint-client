import _ from 'lodash'
import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import Vuelidate from 'vuelidate'
import vSelect from 'vue-select'
import vueDebounce from 'vue-debounce'
import 'prismjs'
import 'prismjs/components/prism-turtle'
import 'prismjs/components/prism-sparql'
import { createEntityConfigs } from '@/entity/entityConfigs'
import App from './App.vue'
import { createRouter } from './router'
import { createStore } from './store'
import api from './api'
import './filters'
import './font-awesome'

Vue.config.productionTip = false

Vue.use(BootstrapVue)
// @ts-ignore
Vue.use(Vuelidate)
Vue.use(vueDebounce)
Vue.component('VSelect', vSelect)

let entitySpecs = []

api.configs.getBootstrap()
  .then((config) => {
    // default to remote config from FDP API, but allow override via local public/config.js file
    ['persistentURL', 'appTitle', 'appSubtitle', 'index'].forEach(
      (prop) => {
        if (!_.has(window, `config.${prop}`)) {
          _.set(window, `config.${prop}`, _.get(config, `data.${_.camelCase(prop)}`))
        }
      },
    )
    // use resource definitions from remote config without possibility to override
    entitySpecs = _.get(config, 'data.resourceDefinitions', [])
  })
  .finally(() => {
    const entityConfigs = createEntityConfigs(entitySpecs)
    const store = createStore(entityConfigs)
    const router = createRouter(store)

    new Vue({
      router,
      store,
      render: (h) => h(App),
    }).$mount('#app')
  })
