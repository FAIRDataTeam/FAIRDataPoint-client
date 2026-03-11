import _ from 'lodash'
import { EntityConfig } from '@/entity/EntityConfig'

type EntityState = {
  entityConfigs: Record<string, EntityConfig>
}

const getConfigFor = (state: EntityState, entity?: string) => (
  entity === undefined || entity === null ? undefined : _.get(state.entityConfigs, entity)
)

export function createEntitiesModule(entityConfigs: Record<string, EntityConfig>) {
  return {
    namespaced: true,

    state: {
      entityConfigs,
    },

    getters: {
      config: (state: EntityState) => (entity: string) => getConfigFor(state, entity),
      parentConfig: (state: EntityState) => (entity: string) => getConfigFor(
        state,
        _.get(getConfigFor(state, entity), 'parentEntity'),
      ),
      configByUuid: (state: EntityState) => (uuid: string) => (
        Object.values(state.entityConfigs).reduce(
          (cfg, acc) => (_.get(cfg, 'uuid') === uuid ? cfg : acc),
        )
      ),
    },
  }
}
