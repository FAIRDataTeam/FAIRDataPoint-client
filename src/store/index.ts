import Vue from 'vue'
import Vuex from 'vuex'
import auth from './modules/auth'
import apiPlugin from '../api/plugin'
import vuexLocal from './vuexLocal'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    auth,
  },
  plugins: [
    apiPlugin,
    vuexLocal.plugin,
  ],
})
