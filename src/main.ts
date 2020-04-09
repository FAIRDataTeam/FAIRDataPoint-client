import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import Vuelidate from 'vuelidate'
import vSelect from 'vue-select'
import 'prismjs'
import 'prismjs/components/prism-turtle'
import App from './App.vue'
import router from './router'
import store from './store'

import './filters'
import './font-awesome'

Vue.config.productionTip = false

Vue.use(BootstrapVue)
// @ts-ignore
Vue.use(Vuelidate)

Vue.component('v-select', vSelect)

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
