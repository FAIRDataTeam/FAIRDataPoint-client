import { createStore as createVuexStore } from 'vuex'
import { EntityConfig } from '@/entity/EntityConfig'
import { createEntitiesModule } from '@/store/modules/entities'
import auth from './modules/auth'
import apiPlugin from '../api/plugin'
import vuexLocal from './vuexLocal'

export function createStore(entityConfigs: Record<string, EntityConfig>) {
  return createVuexStore({
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
