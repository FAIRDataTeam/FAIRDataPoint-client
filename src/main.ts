import _ from 'lodash'
import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import Vuelidate from 'vuelidate'
import vSelect from 'vue-select'
import 'prismjs'
import 'prismjs/components/prism-turtle'
import App from './App.vue'
import router from './router'
import store from './store'
import api from './api'

import './filters'
import './font-awesome'

Vue.config.productionTip = false

Vue.use(BootstrapVue)
// @ts-ignore
Vue.use(Vuelidate)

Vue.component('v-select', vSelect)


api.configs.getBootstrap()
  .then((config) => {
    _.set(window, 'config.persistentURL', _.get(config, 'data.persistentUrl'))
  })
  .finally(() => {
    new Vue({
      router,
      store,
      render: h => h(App),
    }).$mount('#app')
  })
