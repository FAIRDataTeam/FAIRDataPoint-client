import Vue from 'vue'
import Vuex from 'vuex'
import { createEntitiesModule } from '@/store/modules/entities'
import auth from './modules/auth'
import apiPlugin from '../api/plugin'
import vuexLocal from './vuexLocal'

Vue.use(Vuex)

export function createStore(entityConfigs) {
  return new Vuex.Store({
    modules: {
      auth,
      entities: createEntitiesModule(entityConfigs),
    },
    plugins: [
      apiPlugin,
      vuexLocal.plugin,
    ],
  })
}
