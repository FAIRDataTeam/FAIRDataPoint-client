import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import Vuelidate from 'vuelidate'
import vSelect from 'vue-select'
import App from './App'
import router from './router'
import store from './store'
import './font-awesome'

Vue.config.productionTip = false

Vue.use(BootstrapVue)
Vue.use(Vuelidate)

Vue.component('v-select', vSelect)

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
