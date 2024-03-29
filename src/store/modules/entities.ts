import _ from 'lodash'

const getConfigFor = (state, entity) => _.get(state.entityConfigs, entity)

export function createEntitiesModule(entityConfigs) {
  return {
    namespaced: true,

    state: {
      entityConfigs,
    },

    getters: {
      config: (state) => (entity) => getConfigFor(state, entity),
      parentConfig: (state) => (entity) => getConfigFor(state, _.get(getConfigFor(state, entity), 'parentEntity')),
      configByUuid: (state) => (uuid) => Object.values(state.entityConfigs).reduce(
        (cfg, acc) => (_.get(cfg, 'uuid') === uuid ? cfg : acc),
      ),
    },
  }
}
